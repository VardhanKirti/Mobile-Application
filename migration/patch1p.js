const admin = require("firebase-admin");
const XLSX = require("xlsx");
const path = require("path");
const fs = require("fs");

// ---------- Firebase Admin Init ----------
const serviceAccountPath = path.join(__dirname, "serviceAccountKey.json");
const excelPath = path.join(__dirname, "Project management.xlsx");

if (!fs.existsSync(serviceAccountPath)) {
    throw new Error("serviceAccountKey.json not found in the current folder.");
}

if (!fs.existsSync(excelPath)) {
    throw new Error("Project management.xlsx not found in the current folder.");
}

const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// ---------- Helpers ----------
function slugify(text) {
    return String(text || "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function toText(value) {
    if (value === null || value === undefined) return null;
    const s = String(value).trim();
    return s === "" ? null : s;
}

function toImageArray(value) {
    if (value === null || value === undefined) return [];

    if (Array.isArray(value)) {
        return value.map(v => String(v).trim()).filter(Boolean);
    }

    const text = String(value).trim();
    if (!text) return [];

    return text
        .split(/[,;\n]/)
        .map(s => s.trim())
        .filter(Boolean);
}

function buildDocId(rowIndex, centerName) {
    return `1P_${rowIndex}_${slugify(centerName) || "row"}`;
}

// ---------- Patch Script ----------
async function patch1P() {
    const workbook = XLSX.readFile(excelPath, { cellDates: true });
    const sheetName = "1P";

    if (!workbook.SheetNames.includes(sheetName)) {
        throw new Error(`Sheet "${sheetName}" not found in the Excel file.`);
    }

    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet, {
        defval: null,
        raw: true,
    });

    console.log(`Found ${rows.length} rows in sheet: ${sheetName}`);

    let batch = db.batch();
    let batchCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;

    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const centerName = toText(row["Center Name"]);

        if (!centerName) {
            skippedCount++;
            console.log(`Skipping row ${i + 2}: missing Center Name`);
            continue;
        }

        const siteLocation = toText(row["site_locations"]);
        const siteImages = toImageArray(row["site images"]);

        // If both new fields are empty, skip updating this row
        if (!siteLocation && siteImages.length === 0) {
            skippedCount++;
            continue;
        }

        const docId = buildDocId(i + 2, centerName);
        const docRef = db.collection("properties").doc(docId);

        const updateData = {};
        if (siteLocation) updateData.siteLocation = siteLocation;
        if (siteImages.length > 0) updateData.siteImages = siteImages;

        batch.set(docRef, updateData, { merge: true });
        batchCount++;
        updatedCount++;

        if (batchCount >= 450) {
            await batch.commit();
            batch = db.batch();
            batchCount = 0;
            console.log("Committed 450 updates...");
        }
    }

    if (batchCount > 0) {
        await batch.commit();
    }

    console.log("Patch completed.");
    console.log(`Updated: ${updatedCount}`);
    console.log(`Skipped: ${skippedCount}`);
}

patch1P().catch((error) => {
    console.error("Patch failed:");
    console.error(error);
    process.exit(1);
});