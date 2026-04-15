/**
 * migrate.js — Excel → Firestore upsert (merge, no duplicates)
 *
 * Strategy:
 *  1. Load ALL existing Firestore docs from "properties" into a name→{id,data} map
 *  2. For each Excel row across 1P / 2P / EBO sheets:
 *       - Normalize the Center Name
 *       - If a matching doc exists  → update() only the mapped fields (non-destructive)
 *       - If no match               → addDoc() with all fields
 *  3. Report counts at the end
 *
 * Run:
 *   cd migration
 *   node migrate.js
 */

const admin = require("firebase-admin");
const XLSX  = require("xlsx");
const path  = require("path");
const fs    = require("fs");

// ── Paths ─────────────────────────────────────────────────────────────────────
const SERVICE_ACCOUNT_PATH = path.join(__dirname, "serviceAccountKey.json");
const EXCEL_PATH           = path.join(__dirname, "Project management.xlsx");

if (!fs.existsSync(SERVICE_ACCOUNT_PATH))
  throw new Error("serviceAccountKey.json not found in migration/");
if (!fs.existsSync(EXCEL_PATH))
  throw new Error("Project management.xlsx not found in migration/");

// ── Firebase init ─────────────────────────────────────────────────────────────
const serviceAccount = require(SERVICE_ACCOUNT_PATH);
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

// ── Helpers ───────────────────────────────────────────────────────────────────
const normalizeName = (v) =>
  String(v || "").toLowerCase().trim().replace(/\s+/g, " ");

const toText = (v) => {
  if (v === null || v === undefined) return null;
  const s = String(v).trim();
  return s === "" ? null : s;
};

const toNumber = (v) => {
  if (v === null || v === undefined || String(v).trim() === "") return null;
  const n = Number(String(v).replace(/,/g, "").trim());
  return isNaN(n) ? null : n;
};

const toDate = (v) => {
  if (!v) return null;
  // XLSX may parse as JS Date when cellDates:true
  if (v instanceof Date) return v.toISOString().split("T")[0];
  const s = String(v).trim();
  return s || null;
};

const toImageArray = (v) => {
  if (!v) return [];
  if (Array.isArray(v)) return v.map((x) => String(x).trim()).filter(Boolean);
  return String(v).split(/[,;\n]/).map((s) => s.trim()).filter(Boolean);
};

// ── Column mappings per sheet ─────────────────────────────────────────────────
//  Each entry: [excelColumn, firestoreField, converter]
const MAPPING_1P = [
  ["Center Name",         "name",                    toText],
  ["City",                "city",                    toText],
  ["Product Type",        "product_type",             toText],
  ["Property code",       "property_code",            toText],
  ["Floor",               "floor",                   toText],
  ["Launched Year",       "launch_year",              toNumber],
  ["Rental Psf (Inc CAM)","cost_per_sqft",            toNumber],
  ["Total Rental",        "monthly_rent",             toNumber],
  ["Carpet Area",         "total_sqft",               toNumber],
  ["Esc - Yearly",        "escalation_percent",       toNumber],
  ["SD in Months",        "security_deposit_months",  toNumber],
  ["Under Lockin",        "lockin_status",            toText],
  ["Due Renewal",         "contract_end",             toDate],
  ["Next Esc",            "next_escalation_date",     toDate],
  ["site_locations",      "site_location",            toText],
  ["site images",         "site_images",              toImageArray],
];

const MAPPING_2P = [
  ["Center Name",   "name",                    toText],
  ["City",          "city",                    toText],
  ["Product Type",  "product_type",             toText],
  ["Launch Year",   "launch_year",              toNumber],
  ["Rental Psf",    "cost_per_sqft",            toNumber],
  ["Total Rental",  "monthly_rent",             toNumber],
  ["Carper Area",   "total_sqft",               toNumber],
];

const MAPPING_EBO = [
  ["Center Name",   "name",                    toText],
  ["City",          "city",                    toText],
  ["Product Type",  "product_type",             toText],
  ["Launch Year",   "launch_year",              toNumber],
  ["Rental Psf",    "cost_per_sqft",            toNumber],
  ["Total Rental",  "monthly_rent",             toNumber],
  ["Carper Area",   "total_sqft",               toNumber],
  ["Esc - Yearly",  "escalation_percent",       toNumber],
  ["SD in Months",  "security_deposit_months",  toNumber],
  ["Under Lockin",  "lockin_status",            toText],
];

// Sheet → { mapping, store_type, business_type }
const SHEETS = [
  { name: "1P",  mapping: MAPPING_1P, store_type: "FS",  business_type: "1P"  },
  { name: "2P",  mapping: MAPPING_2P, store_type: "FS",  business_type: "2P"  },
  { name: "EBO", mapping: MAPPING_EBO, store_type: "EBO", business_type: null  },
];

// ── Build data object from a row ──────────────────────────────────────────────
function buildData(row, mapping, store_type, business_type) {
  const data = {};
  for (const [col, field, fn] of mapping) {
    const val = fn(row[col]);
    if (val !== null && !(Array.isArray(val) && val.length === 0)) {
      data[field] = val;
    }
  }
  data.store_type = store_type;
  if (business_type) data.business_type = business_type;
  return data;
}

// ── Main migration ────────────────────────────────────────────────────────────
async function migrate() {
  console.log("Loading existing Firestore documents...");
  const snapshot = await db.collection("properties").get();

  // Map: normalizedName → { id, data }
  const existingByName = new Map();
  snapshot.forEach((doc) => {
    const name = normalizeName(doc.data().name);
    if (name) existingByName.set(name, { id: doc.id, data: doc.data() });
  });
  console.log(`Found ${existingByName.size} existing documents.\n`);

  const workbook = XLSX.readFile(EXCEL_PATH, { cellDates: true });

  let totalUpdated = 0;
  let totalCreated = 0;
  let totalSkipped = 0;

  for (const sheetConfig of SHEETS) {
    const { name: sheetName, mapping, store_type, business_type } = sheetConfig;

    if (!workbook.SheetNames.includes(sheetName)) {
      console.warn(`Sheet "${sheetName}" not found — skipping.`);
      continue;
    }

    const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
      defval: null,
      raw:    false,   // parse numbers/dates as strings to avoid Excel serial dates
    });

    console.log(`Processing sheet "${sheetName}" — ${rows.length} rows`);

    let updated = 0, created = 0, skipped = 0;
    let batch = db.batch();
    let batchCount = 0;

    for (const row of rows) {
      const centerName = toText(row["Center Name"]);
      if (!centerName) { skipped++; continue; }

      const data = buildData(row, mapping, store_type, business_type);
      const normName = normalizeName(centerName);
      const existing = existingByName.get(normName);

      if (existing) {
        // UPDATE — only patch new/changed fields, never delete old ones
        const ref = db.collection("properties").doc(existing.id);
        batch.update(ref, data);
        updated++;
      } else {
        // CREATE — new document
        const ref = db.collection("properties").doc();
        batch.set(ref, data);
        existingByName.set(normName, { id: ref.id, data });  // prevent duplicate within same run
        created++;
      }

      batchCount++;
      if (batchCount >= 450) {
        await batch.commit();
        batch = db.batch();
        batchCount = 0;
        console.log("  Committed 450 operations...");
      }
    }

    if (batchCount > 0) await batch.commit();

    console.log(`  ✅ Updated: ${updated}  Created: ${created}  Skipped: ${skipped}`);
    totalUpdated += updated;
    totalCreated += created;
    totalSkipped += skipped;
  }

  console.log("\n==========================");
  console.log(`Migration complete!`);
  console.log(`Total Updated : ${totalUpdated}`);
  console.log(`Total Created : ${totalCreated}`);
  console.log(`Total Skipped : ${totalSkipped}`);
  console.log("==========================");
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
