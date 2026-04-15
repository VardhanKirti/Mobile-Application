// ─────────────────────────────────────────────────────────────────────────────
//  propertyService.js  –  Firestore-backed data layer
//  Fields in Firestore use snake_case (from PostgreSQL):
//    store_type, product_type, business_type, city, name, ...
// ─────────────────────────────────────────────────────────────────────────────

import { db } from "../../firebaseConfig";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  where,
  limit,
  addDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

const COLLECTION = "properties";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const toDocs = (snapshot) =>
  snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));

const distinctField = (docs, field) =>
  [...new Set(docs.map((d) => d[field]).filter(Boolean))].sort();

// ─── Diagnostic ───────────────────────────────────────────────────────────────
export async function diagnoseProperties() {
  try {
    const snap = await getDocs(query(collection(db, COLLECTION), limit(1)));
    if (snap.empty) {
      console.warn('[Firestore] Collection "properties" is EMPTY or blocked by rules.');
    } else {
      const data = snap.docs[0].data();
      console.log('[Firestore] ✅ First doc field names:', Object.keys(data));
      console.log('[Firestore] Sample:', JSON.stringify(data, null, 2));
    }
  } catch (e) {
    console.error('[Firestore] ❌ ERROR:', e.message);
  }
}

export async function getRawSampleDocument() {
  try {
    const snap = await getDocs(query(collection(db, COLLECTION), limit(1)));
    if (snap.empty) return null;
    const data = snap.docs[0].data();
    return { fieldNames: Object.keys(data), sample: data };
  } catch (e) {
    return { error: e.message };
  }
}

// ═════════════════════════════════════════════════════════════════════════════
//  FS FLOW  (store_type = "FS")
// ═════════════════════════════════════════════════════════════════════════════

/** Distinct product_type values for FS: ["Elite", "Neo", "Lux"] */
export async function getFSProductTypes() {
  const q = query(collection(db, COLLECTION), where("store_type", "==", "FS"));
  const snap = await getDocs(q);
  return distinctField(toDocs(snap), "product_type");
}

/** Distinct business_type values for FS + given product_type: ["1P", "2P"] */
export async function getFSBusinessTypes(productType) {
  const q = query(
    collection(db, COLLECTION),
    where("store_type", "==", "FS"),
    where("product_type", "==", productType)
  );
  const snap = await getDocs(q);
  return distinctField(toDocs(snap), "business_type");
}

/** Distinct cities for FS + product_type + business_type */
export async function getFSCities(productType, businessType) {
  const q = query(
    collection(db, COLLECTION),
    where("store_type", "==", "FS"),
    where("product_type", "==", productType),
    where("business_type", "==", businessType)
  );
  const snap = await getDocs(q);
  return distinctField(toDocs(snap), "city");
}

/** All FS stores for product_type + business_type + city */
export async function getFSStores(productType, businessType, city) {
  const q = query(
    collection(db, COLLECTION),
    where("store_type", "==", "FS"),
    where("product_type", "==", productType),
    where("business_type", "==", businessType),
    where("city", "==", city)
  );
  const snap = await getDocs(q);
  return toDocs(snap);
}

// ═════════════════════════════════════════════════════════════════════════════
//  EBO FLOW  (store_type = "EBO")
// ═════════════════════════════════════════════════════════════════════════════

/** All distinct cities for EBO stores */
export async function getEBOCities() {
  const q = query(collection(db, COLLECTION), where("store_type", "==", "EBO"));
  const snap = await getDocs(q);
  return distinctField(toDocs(snap), "city");
}

/** All EBO stores in a city */
export async function getEBOStores(city) {
  const q = query(
    collection(db, COLLECTION),
    where("store_type", "==", "EBO"),
    where("city", "==", city)
  );
  const snap = await getDocs(q);
  return toDocs(snap);
}

// ═════════════════════════════════════════════════════════════════════════════
//  SINGLE STORE DETAILS
// ═════════════════════════════════════════════════════════════════════════════

export async function getStoreById(id) {
  const ref = doc(db, COLLECTION, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

// ═════════════════════════════════════════════════════════════════════════════
//  ADMIN CRUD
// ═════════════════════════════════════════════════════════════════════════════

export async function createProperty(data) {
  const ref = await addDoc(collection(db, COLLECTION), data);
  return ref.id;
}

export async function updateProperty(id, data) {
  await updateDoc(doc(db, COLLECTION, id), data);
}

export async function deleteProperty(id) {
  await deleteDoc(doc(db, COLLECTION, id));
}
