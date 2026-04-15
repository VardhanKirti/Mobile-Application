
// ─────────────────────────────────────────────────────────
//  Property Management App – Static Data
// ─────────────────────────────────────────────────────────

export const PROPERTY_TYPES = ['FS', 'EBD', 'Warehouse', 'Office'];

// ── FS Data ──────────────────────────────────────────────
export const FS_PRODUCT_TYPES = ['Elite', 'Neo', 'Lux'];
export const FS_BHK_TYPES = ['1P', '2P'];

export const FS_CITIES = ['Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'NCR', 'Mumbai'];

export const FS_STORES = {
  Bangalore: [
    { id: 'B1', name: 'Cult GX Koramangala COCO BLR', product: 'Elite', bhk: '1P', rentalPsf: 86, carpetArea: 9755, launchYear: 2023, nextEscalation: '01/04/2026', dueRenewal: '26/07/2027', landlordName: 'Parimala Tiramali', address: 'Koramangala, Bangalore', state: 'Karnataka', monthlRent: 840950 },
    { id: 'B2', name: 'Cult GX Sarjapur COCO BLR', product: 'Elite', bhk: '1P', rentalPsf: 82, carpetArea: 8900, launchYear: 2022, nextEscalation: '15/06/2026', dueRenewal: '30/09/2027', landlordName: 'Rajesh Kumar', address: 'Sarjapur Road, Bangalore', state: 'Karnataka', monthlRent: 729800 },
    { id: 'B3', name: 'Cult GX Kalyan Nagar COCO BLR', product: 'Neo', bhk: '1P', rentalPsf: 43, carpetArea: 7200, launchYear: 2021, nextEscalation: '01/01/2026', dueRenewal: '31/12/2026', landlordName: 'Suresh Nair', address: 'Kalyan Nagar, Bangalore', state: 'Karnataka', monthlRent: 309600 },
    { id: 'B4', name: 'Cult GX Marathahalli COCO BLR', product: 'Neo', bhk: '2P', rentalPsf: 41, carpetArea: 8100, launchYear: 2022, nextEscalation: '01/03/2026', dueRenewal: '28/02/2027', landlordName: 'Priya Sharma', address: 'Marathahalli, Bangalore', state: 'Karnataka', monthlRent: 332100 },
    { id: 'B5', name: 'FF - Gold Gym - Convent Road', product: 'Lux', bhk: '1P', rentalPsf: 108, carpetArea: 12000, launchYear: 2020, nextEscalation: '01/07/2025', dueRenewal: '30/06/2026', landlordName: 'Anita Reddy', address: 'Convent Road, Bangalore', state: 'Karnataka', monthlRent: 1296000 },
    { id: 'B6', name: 'Cult GX Rajajinagar COCO BLR', product: 'Lux', bhk: '2P', rentalPsf: 105, carpetArea: 11500, launchYear: 2021, nextEscalation: '01/09/2025', dueRenewal: '31/08/2026', landlordName: 'Venkat Rao', address: 'Rajajinagar, Bangalore', state: 'Karnataka', monthlRent: 1207500 },
    { id: 'B7', name: 'Cult GX Electronic City COCO BLR', product: 'Elite', bhk: '2P', rentalPsf: 78, carpetArea: 9200, launchYear: 2023, nextEscalation: '01/11/2025', dueRenewal: '31/10/2026', landlordName: 'Raman Pillai', address: 'Electronic City, Bangalore', state: 'Karnataka', monthlRent: 717600 },
  ],
  Hyderabad: [
    { id: 'H1', name: 'Cult GX Banjara Hills COCO HYD', product: 'Elite', bhk: '1P', rentalPsf: 75, carpetArea: 9000, launchYear: 2022, nextEscalation: '01/04/2026', dueRenewal: '31/03/2027', landlordName: 'Srinivas Rao', address: 'Banjara Hills, Hyderabad', state: 'Telangana', monthlRent: 675000 },
    { id: 'H2', name: 'Cult GX Gachibowli COCO HYD', product: 'Neo', bhk: '2P', rentalPsf: 45, carpetArea: 8500, launchYear: 2021, nextEscalation: '15/02/2026', dueRenewal: '14/02/2027', landlordName: 'Kavitha Reddy', address: 'Gachibowli, Hyderabad', state: 'Telangana', monthlRent: 382500 },
    { id: 'H3', name: 'Cult GX Kukatpally COCO HYD', product: 'Lux', bhk: '1P', rentalPsf: 110, carpetArea: 13000, launchYear: 2023, nextEscalation: '01/06/2026', dueRenewal: '31/05/2027', landlordName: 'Mohammed Ali', address: 'Kukatpally, Hyderabad', state: 'Telangana', monthlRent: 1430000 },
  ],
  Chennai: [
    { id: 'C1', name: 'Cult GX Anna Nagar COCO CHN', product: 'Elite', bhk: '1P', rentalPsf: 80, carpetArea: 8800, launchYear: 2022, nextEscalation: '01/05/2026', dueRenewal: '30/04/2027', landlordName: 'Sundaram Pillai', address: 'Anna Nagar, Chennai', state: 'Tamil Nadu', monthlRent: 704000 },
    { id: 'C2', name: 'Cult GX Velachery COCO CHN', product: 'Neo', bhk: '1P', rentalPsf: 42, carpetArea: 7000, launchYear: 2021, nextEscalation: '01/08/2025', dueRenewal: '31/07/2026', landlordName: 'Meenakshi Iyer', address: 'Velachery, Chennai', state: 'Tamil Nadu', monthlRent: 294000 },
    { id: 'C3', name: 'Cult GX OMR COCO CHN', product: 'Lux', bhk: '2P', rentalPsf: 107, carpetArea: 11000, launchYear: 2023, nextEscalation: '01/10/2026', dueRenewal: '30/09/2027', landlordName: 'Karthik Subramanian', address: 'OMR, Chennai', state: 'Tamil Nadu', monthlRent: 1177000 },
  ],
  Pune: [
    { id: 'P1', name: 'Cult GX Baner COCO PNQ', product: 'Elite', bhk: '1P', rentalPsf: 77, carpetArea: 9100, launchYear: 2022, nextEscalation: '01/03/2026', dueRenewal: '28/02/2027', landlordName: 'Sachin Kulkarni', address: 'Baner, Pune', state: 'Maharashtra', monthlRent: 700700 },
    { id: 'P2', name: 'Cult GX Kharadi COCO PNQ', product: 'Neo', bhk: '2P', rentalPsf: 40, carpetArea: 7800, launchYear: 2021, nextEscalation: '01/12/2025', dueRenewal: '30/11/2026', landlordName: 'Pooja Desai', address: 'Kharadi, Pune', state: 'Maharashtra', monthlRent: 312000 },
    { id: 'P3', name: 'Cult GX Viman Nagar COCO PNQ', product: 'Lux', bhk: '1P', rentalPsf: 106, carpetArea: 10500, launchYear: 2023, nextEscalation: '01/07/2026', dueRenewal: '30/06/2027', landlordName: 'Amol Joshi', address: 'Viman Nagar, Pune', state: 'Maharashtra', monthlRent: 1113000 },
  ],
  NCR: [
    { id: 'N1', name: 'Cult GX Gurugram Sector 29', product: 'Elite', bhk: '1P', rentalPsf: 95, carpetArea: 10200, launchYear: 2022, nextEscalation: '01/04/2026', dueRenewal: '31/03/2027', landlordName: 'Ajay Bansal', address: 'Sector 29, Gurugram', state: 'Haryana', monthlRent: 969000 },
    { id: 'N2', name: 'Cult GX Noida Sector 18', product: 'Neo', bhk: '1P', rentalPsf: 45, carpetArea: 8300, launchYear: 2021, nextEscalation: '15/01/2026', dueRenewal: '14/01/2027', landlordName: 'Neha Singh', address: 'Sector 18, Noida', state: 'Uttar Pradesh', monthlRent: 373500 },
    { id: 'N3', name: 'Cult GX Vasant Kunj DLH', product: 'Lux', bhk: '2P', rentalPsf: 115, carpetArea: 14000, launchYear: 2023, nextEscalation: '01/09/2026', dueRenewal: '31/08/2027', landlordName: 'Ramesh Gupta', address: 'Vasant Kunj, Delhi', state: 'Delhi', monthlRent: 1610000 },
  ],
  Mumbai: [
    { id: 'M1', name: 'Cult GX Andheri COCO MUM', product: 'Elite', bhk: '1P', rentalPsf: 144, carpetArea: 8500, launchYear: 2022, nextEscalation: '01/06/2026', dueRenewal: '31/05/2027', landlordName: 'Deepak Shah', address: 'Andheri West, Mumbai', state: 'Maharashtra', monthlRent: 1224000 },
    { id: 'M2', name: 'Cult GX Powai COCO MUM', product: 'Neo', bhk: '2P', rentalPsf: 58, carpetArea: 9000, launchYear: 2021, nextEscalation: '01/02/2026', dueRenewal: '31/01/2027', landlordName: 'Seema Mehta', address: 'Powai, Mumbai', state: 'Maharashtra', monthlRent: 522000 },
    { id: 'M3', name: 'Cult GX BKC Premium MUM', product: 'Lux', bhk: '1P', rentalPsf: 180, carpetArea: 12000, launchYear: 2023, nextEscalation: '01/08/2026', dueRenewal: '31/07/2027', landlordName: 'Prakash Oberoi', address: 'BKC, Mumbai', state: 'Maharashtra', monthlRent: 2160000 },
  ],
};

// ── EBD Data ──────────────────────────────────────────────
export const EBD_CITIES = ['Bangalore', 'Hyderabad', 'Chennai', 'Pune'];
export const EBD_STORES = {
  Bangalore: [
    { id: 'EB1', name: 'EBD Whitefield BLR', rentalPsf: 55, carpetArea: 5000, launchYear: 2022, nextEscalation: '01/06/2026', dueRenewal: '31/05/2027', landlordName: 'Krishna Murthy', address: 'Whitefield, Bangalore', state: 'Karnataka', monthlRent: 275000 },
    { id: 'EB2', name: 'EBD Indiranagar BLR', rentalPsf: 65, carpetArea: 4800, launchYear: 2021, nextEscalation: '01/09/2025', dueRenewal: '31/08/2026', landlordName: 'Lakshmi Devi', address: 'Indiranagar, Bangalore', state: 'Karnataka', monthlRent: 312000 },
  ],
  Hyderabad: [
    { id: 'EH1', name: 'EBD Jubilee Hills HYD', rentalPsf: 60, carpetArea: 5200, launchYear: 2022, nextEscalation: '01/07/2026', dueRenewal: '30/06/2027', landlordName: 'Ravi Teja', address: 'Jubilee Hills, Hyderabad', state: 'Telangana', monthlRent: 312000 },
  ],
  Chennai: [
    { id: 'EC1', name: 'EBD T Nagar CHN', rentalPsf: 50, carpetArea: 4500, launchYear: 2021, nextEscalation: '01/04/2026', dueRenewal: '31/03/2027', landlordName: 'Vijay Kumar', address: 'T Nagar, Chennai', state: 'Tamil Nadu', monthlRent: 225000 },
  ],
  Pune: [
    { id: 'EP1', name: 'EBD FC Road PNQ', rentalPsf: 48, carpetArea: 4200, launchYear: 2022, nextEscalation: '01/10/2025', dueRenewal: '30/09/2026', landlordName: 'Anil Pawar', address: 'FC Road, Pune', state: 'Maharashtra', monthlRent: 201600 },
  ],
};

// ── Warehouse Data ────────────────────────────────────────
export const WH_CITIES = ['Bangalore', 'Hyderabad', 'Pune'];
export const WH_STORES = {
  Bangalore: [
    { id: 'W1', name: 'Warehouse Peenya BLR', rentalPsf: 22, carpetArea: 25000, launchYear: 2020, nextEscalation: '01/01/2026', dueRenewal: '31/12/2026', landlordName: 'Ganesh Rao', address: 'Peenya, Bangalore', state: 'Karnataka', monthlRent: 550000 },
    { id: 'W2', name: 'Warehouse Bommasandra BLR', rentalPsf: 20, carpetArea: 30000, launchYear: 2021, nextEscalation: '01/04/2026', dueRenewal: '31/03/2027', landlordName: 'Suresh Gowda', address: 'Bommasandra, Bangalore', state: 'Karnataka', monthlRent: 600000 },
  ],
  Hyderabad: [
    { id: 'WH1', name: 'Warehouse Patancheru HYD', rentalPsf: 18, carpetArea: 28000, launchYear: 2021, nextEscalation: '01/06/2026', dueRenewal: '31/05/2027', landlordName: 'Abdul Karim', address: 'Patancheru, Hyderabad', state: 'Telangana', monthlRent: 504000 },
  ],
  Pune: [
    { id: 'WP1', name: 'Warehouse Chakan PNQ', rentalPsf: 19, carpetArea: 22000, launchYear: 2022, nextEscalation: '01/02/2026', dueRenewal: '31/01/2027', landlordName: 'Santosh Patil', address: 'Chakan, Pune', state: 'Maharashtra', monthlRent: 418000 },
  ],
};

// ── Office Data ───────────────────────────────────────────
export const OFFICE_CITIES = ['Bangalore', 'Mumbai', 'NCR'];
export const OFFICE_STORES = {
  Bangalore: [
    { id: 'O1', name: 'Head Office - Indiranagar BLR', rentalPsf: 90, carpetArea: 15000, launchYear: 2019, nextEscalation: '01/07/2025', dueRenewal: '30/06/2027', landlordName: 'Corporate Trust', address: 'Indiranagar, Bangalore', state: 'Karnataka', monthlRent: 1350000 },
    { id: 'O2', name: 'Tech Office - Whitefield BLR', rentalPsf: 70, carpetArea: 12000, launchYear: 2021, nextEscalation: '01/01/2026', dueRenewal: '31/12/2026', landlordName: 'IT Park Ltd', address: 'Whitefield, Bangalore', state: 'Karnataka', monthlRent: 840000 },
  ],
  Mumbai: [
    { id: 'OM1', name: 'Corporate Office BKC MUM', rentalPsf: 200, carpetArea: 8000, launchYear: 2020, nextEscalation: '01/04/2026', dueRenewal: '31/03/2028', landlordName: 'BKC Realty', address: 'BKC, Mumbai', state: 'Maharashtra', monthlRent: 1600000 },
  ],
  NCR: [
    { id: 'ON1', name: 'Regional Office Gurugram NCR', rentalPsf: 120, carpetArea: 10000, launchYear: 2022, nextEscalation: '01/08/2026', dueRenewal: '31/07/2028', landlordName: 'Gurugram Infra', address: 'Cyber City, Gurugram', state: 'Haryana', monthlRent: 1200000 },
  ],
};

// ── Summary Stats ─────────────────────────────────────────
export const SUMMARY_STATS = {
  FS: {
    totalSites: 332,
    rentalPsf: 73,
    ebdSites: 29,
    ebdRentalPsf: 213,
  },
  EBD: {
    totalSites: 29,
    rentalPsf: 56,
    activeSites: 27,
    avgArea: 4800,
  },
  Warehouse: {
    totalSites: 18,
    rentalPsf: 20,
    totalArea: 450000,
    avgArea: 25000,
  },
  Office: {
    totalSites: 12,
    rentalPsf: 105,
    totalArea: 120000,
    avgArea: 10000,
  },
};

export const FS_SUMMARY = {
  'Elite': { '1P+2P': 76, '1P': 86, '2P': 63 },
  'Neo':   { '1P+2P': 73, '1P': 43, '2P': 41 },
  'Lux':   { '1P+2P': 108, '1P': 108, '2P': 59 },
  'Overall': { '1P+2P': 73, '1P': 83, '2P': 144 },
};

export const CITY_SUMMARY = {
  'BLR': 58,
  'HYD': 57,
  'Mumbai': 144,
  'Pune': 69,
  'NCR': 83,
  'Chennai': 61,
};
