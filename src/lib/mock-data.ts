/**
 * Realistic healthcare demo data for the UI layer only.
 * No backend behaviour is implemented — every export here is static and
 * is intended to be swapped for real API/database reads later.
 */

export type OrderStatus =
  | "delivered"
  | "in-transit"
  | "processing"
  | "pending"
  | "cancelled";

export type StockStatus = "in-stock" | "low-stock" | "out-of-stock" | "expiring";

export interface Medicine {
  id: string;
  name: string;
  generic: string;
  form: string;
  strength: string;
  manufacturer: string;
  price: number;
  stock: number;
  status: StockStatus;
  batch: string;
  expiry: string;
  category: string;
  parLevel: number;
}

export interface Order {
  id: string;
  item: string;
  party: string;
  quantity: number;
  total: number;
  status: OrderStatus;
  date: string;
}

export interface Prescription {
  id: string;
  doctor: string;
  clinic: string;
  uploaded: string;
  items: number;
  status: "verified" | "reviewing" | "rejected" | "expired";
}

export const medicines: Medicine[] = [
  {
    id: "MED-1041",
    name: "Amoxicillin",
    generic: "Amoxicillin trihydrate",
    form: "Capsule",
    strength: "500 mg",
    manufacturer: "Nordis Pharma",
    price: 8.4,
    stock: 12480,
    status: "in-stock",
    batch: "AMX-24C",
    expiry: "2027-04-18",
    category: "Antibiotics",
    parLevel: 4000,
  },
  {
    id: "MED-1088",
    name: "Metformin",
    generic: "Metformin hydrochloride",
    form: "Tablet",
    strength: "850 mg",
    manufacturer: "Corvea Labs",
    price: 5.1,
    stock: 940,
    status: "low-stock",
    batch: "MTF-19A",
    expiry: "2026-11-02",
    category: "Diabetes care",
    parLevel: 3000,
  },
  {
    id: "MED-1123",
    name: "Insulin Glargine",
    generic: "Insulin glargine",
    form: "Injection",
    strength: "100 IU/mL",
    manufacturer: "Helvex Biotech",
    price: 46.75,
    stock: 0,
    status: "out-of-stock",
    batch: "ING-07B",
    expiry: "2026-09-30",
    category: "Diabetes care",
    parLevel: 1500,
  },
  {
    id: "MED-1190",
    name: "Salbutamol",
    generic: "Salbutamol sulfate",
    form: "Inhaler",
    strength: "100 mcg",
    manufacturer: "Nordis Pharma",
    price: 14.2,
    stock: 3120,
    status: "in-stock",
    batch: "SLB-33F",
    expiry: "2026-10-15",
    category: "Respiratory",
    parLevel: 2000,
  },
  {
    id: "MED-1204",
    name: "Atorvastatin",
    generic: "Atorvastatin calcium",
    form: "Tablet",
    strength: "20 mg",
    manufacturer: "Meridian Health",
    price: 9.9,
    stock: 640,
    status: "expiring",
    batch: "ATV-52D",
    expiry: "2026-09-12",
    category: "Cardiovascular",
    parLevel: 2500,
  },
  {
    id: "MED-1250",
    name: "Paracetamol",
    generic: "Acetaminophen",
    form: "Tablet",
    strength: "650 mg",
    manufacturer: "Corvea Labs",
    price: 2.35,
    stock: 28400,
    status: "in-stock",
    batch: "PCM-91X",
    expiry: "2028-01-22",
    category: "Other",
    parLevel: 8000,
  },
];

export const customerOrders: Order[] = [
  {
    id: "ORD-78432",
    item: "Amoxicillin 500 mg × 21",
    party: "Riverside Pharmacy",
    quantity: 21,
    total: 34.6,
    status: "in-transit",
    date: "2026-08-27",
  },
  {
    id: "ORD-78390",
    item: "Salbutamol Inhaler",
    party: "Meadow Health Store",
    quantity: 1,
    total: 14.2,
    status: "delivered",
    date: "2026-08-21",
  },
  {
    id: "ORD-78355",
    item: "Metformin 850 mg × 60",
    party: "Riverside Pharmacy",
    quantity: 60,
    total: 42.9,
    status: "processing",
    date: "2026-08-18",
  },
  {
    id: "ORD-78301",
    item: "Vitamin D3 60k IU × 4",
    party: "CareLine Pharmacy",
    quantity: 4,
    total: 11.5,
    status: "cancelled",
    date: "2026-08-09",
  },
];

export const hospitalRequests: Order[] = [
  {
    id: "REQ-4471",
    item: "Insulin Glargine 100 IU/mL",
    party: "Helvex Biotech",
    quantity: 400,
    total: 18700,
    status: "pending",
    date: "2026-08-28",
  },
  {
    id: "REQ-4468",
    item: "Sodium Chloride 0.9% IV",
    party: "Corvea Labs",
    quantity: 1200,
    total: 5640,
    status: "in-transit",
    date: "2026-08-26",
  },
  {
    id: "REQ-4455",
    item: "Ceftriaxone 1 g Vials",
    party: "Nordis Pharma",
    quantity: 800,
    total: 9120,
    status: "delivered",
    date: "2026-08-22",
  },
  {
    id: "REQ-4440",
    item: "Surgical Gloves (L)",
    party: "Meridian Health",
    quantity: 5000,
    total: 3250,
    status: "processing",
    date: "2026-08-19",
  },
];

export const pharmaOrders: Order[] = [
  {
    id: "SUP-9120",
    item: "Amoxicillin 500 mg — 40k units",
    party: "St. Anne's General Hospital",
    quantity: 40000,
    total: 336000,
    status: "processing",
    date: "2026-08-28",
  },
  {
    id: "SUP-9114",
    item: "Paracetamol 650 mg — 120k units",
    party: "Northfield Medical Center",
    quantity: 120000,
    total: 282000,
    status: "in-transit",
    date: "2026-08-25",
  },
  {
    id: "SUP-9101",
    item: "Salbutamol Inhaler — 8k units",
    party: "Riverside Pharmacy Group",
    quantity: 8000,
    total: 113600,
    status: "delivered",
    date: "2026-08-20",
  },
  {
    id: "SUP-9088",
    item: "Atorvastatin 20 mg — 60k units",
    party: "Lakeview Clinic Network",
    quantity: 60000,
    total: 594000,
    status: "pending",
    date: "2026-08-17",
  },
];

export const prescriptions: Prescription[] = [
  {
    id: "RX-2291",
    doctor: "Dr. Amara Osei",
    clinic: "Riverside Family Clinic",
    uploaded: "2026-08-27",
    items: 3,
    status: "verified",
  },
  {
    id: "RX-2274",
    doctor: "Dr. Luis Herrera",
    clinic: "Northfield Cardiology",
    uploaded: "2026-08-24",
    items: 2,
    status: "reviewing",
  },
  {
    id: "RX-2240",
    doctor: "Dr. Priya Raman",
    clinic: "Lakeview Endocrinology",
    uploaded: "2026-08-14",
    items: 4,
    status: "verified",
  },
  {
    id: "RX-2205",
    doctor: "Dr. Hannah Weiss",
    clinic: "Meadow Health Store",
    uploaded: "2026-05-30",
    items: 2,
    status: "expired",
  },
];

export const demandTrend = [
  { month: "Mar", fulfilled: 1240, requested: 1380 },
  { month: "Apr", fulfilled: 1420, requested: 1510 },
  { month: "May", fulfilled: 1610, requested: 1660 },
  { month: "Jun", fulfilled: 1580, requested: 1740 },
  { month: "Jul", fulfilled: 1890, requested: 1950 },
  { month: "Aug", fulfilled: 2140, requested: 2180 },
];

export const categoryMix = [
  { name: "Antibiotics", value: 32 },
  { name: "Cardiovascular", value: 24 },
  { name: "Diabetes care", value: 21 },
  { name: "Respiratory", value: 14 },
  { name: "Other", value: 9 },
];

export const dailyDispense = [
  { day: "Mon", units: 820 },
  { day: "Tue", units: 940 },
  { day: "Wed", units: 1130 },
  { day: "Thu", units: 990 },
  { day: "Fri", units: 1280 },
  { day: "Sat", units: 760 },
  { day: "Sun", units: 540 },
];

export const supplyReliability = [
  { name: "Nordis Pharma", onTime: 97, fillRate: 99 },
  { name: "Corvea Labs", onTime: 92, fillRate: 96 },
  { name: "Helvex Biotech", onTime: 88, fillRate: 91 },
  { name: "Meridian Health", onTime: 94, fillRate: 95 },
];

export const notifications = [
  {
    id: "n1",
    title: "Prescription RX-2274 under review",
    body: "Our pharmacist team is verifying two items.",
    time: "12 min ago",
    tone: "info" as const,
  },
  {
    id: "n2",
    title: "Low stock: Metformin 850 mg",
    body: "940 units left across 3 warehouses.",
    time: "1 hr ago",
    tone: "warning" as const,
  },
  {
    id: "n3",
    title: "Shipment REQ-4468 dispatched",
    body: "Estimated arrival Aug 30, 09:40.",
    time: "3 hrs ago",
    tone: "success" as const,
  },
  {
    id: "n4",
    title: "Insulin Glargine out of stock",
    body: "Auto-request drafted to Helvex Biotech.",
    time: "Yesterday",
    tone: "destructive" as const,
  },
];

export interface PlatformUser {
  id: string;
  name: string;
  email: string;
  role: "Customer" | "Hospital Staff" | "Pharma Rep";
  region: string;
  status: "active" | "suspended";
  joined: string;
}

export const platformUsers: PlatformUser[] = [
  { id: "USR-3301", name: "Dr. Elena Vasquez", email: "e.vasquez@stannes.org", role: "Hospital Staff", region: "Midwest", status: "active", joined: "2025-02-11" },
  { id: "USR-3318", name: "Marcus Feld", email: "m.feld@nordispharma.com", role: "Pharma Rep", region: "Global", status: "active", joined: "2024-11-04" },
  { id: "USR-3352", name: "Anna Keller", email: "a.keller@helvexbio.eu", role: "Pharma Rep", region: "EU", status: "active", joined: "2026-06-19" },
  { id: "USR-3390", name: "Marta Kowalski", email: "marta.kowalski@gmail.com", role: "Customer", region: "Northeast", status: "active", joined: "2026-03-08" },
  { id: "USR-3412", name: "Dr. Samuel Ortiz", email: "s.ortiz@lakeviewclinics.org", role: "Hospital Staff", region: "West", status: "suspended", joined: "2025-08-30" },
  { id: "USR-3277", name: "Aisha Rahman", email: "aisha.rahman@outlook.com", role: "Customer", region: "Northeast", status: "active", joined: "2025-12-02" },
  { id: "USR-3461", name: "Ingrid Solberg", email: "i.solberg@corvealabs.no", role: "Pharma Rep", region: "EU", status: "active", joined: "2026-01-14" },
  { id: "USR-3488", name: "James Whitfield", email: "j.whitfield@northfieldmc.org", role: "Hospital Staff", region: "Northeast", status: "active", joined: "2026-04-22" },
  { id: "USR-3502", name: "Daniel Okoye", email: "d.okoye@meridianhealth.com", role: "Pharma Rep", region: "Midwest", status: "suspended", joined: "2025-06-17" },
  { id: "USR-3519", name: "Lucia Moreno", email: "lucia.moreno@gmail.com", role: "Customer", region: "West", status: "active", joined: "2026-07-30" },
];

export interface Organization {
  id: string;
  name: string;
  type: "Hospital" | "Pharmaceutical";
  licenseId: string;
  region: string;
  reps: number;
  status: "active" | "review" | "suspended";
  contact: string;
  contactRole: string;
  licenseExpiry: string;
  documents: string[];
}

export const organisations: Organization[] = [
  { id: "ORG-2201", name: "St. Anne's General Hospital", type: "Hospital", licenseId: "LIC-HTH-2291", region: "Midwest", reps: 4, status: "active", contact: "Dr. Elena Vasquez", contactRole: "Chief Pharmacist", licenseExpiry: "2027-05-14", documents: ["Drug Establishment License", "Hospital Accreditation"] },
  { id: "ORG-2204", name: "Northfield Medical Center", type: "Hospital", licenseId: "LIC-HTH-2301", region: "Northeast", reps: 3, status: "active", contact: "James Whitfield", contactRole: "Procurement Lead", licenseExpiry: "2027-08-02", documents: ["Drug Establishment License", "Hospital Accreditation"] },
  { id: "ORG-2210", name: "Nordis Pharma", type: "Pharmaceutical", licenseId: "LIC-PHA-1140", region: "Global", reps: 6, status: "active", contact: "Marcus Feld", contactRole: "VP Supply Chain", licenseExpiry: "2028-01-09", documents: ["Drug Establishment License", "GMP Certificate"] },
  { id: "ORG-2216", name: "Corvea Labs", type: "Pharmaceutical", licenseId: "LIC-PHA-1287", region: "EU", reps: 3, status: "active", contact: "Ingrid Solberg", contactRole: "Regulatory Director", licenseExpiry: "2027-11-30", documents: ["Drug Establishment License", "GMP Certificate"] },
  { id: "ORG-2222", name: "Riverside Pharmacy Group", type: "Hospital", licenseId: "LIC-HTH-2350", region: "West", reps: 1, status: "active", contact: "Nina Park", contactRole: "Pharmacy Director", licenseExpiry: "2027-02-19", documents: ["Drug Establishment License", "Pharmacy Board License"] },
  { id: "ORG-2231", name: "Helvex Biotech", type: "Pharmaceutical", licenseId: "LIC-PHA-1402", region: "EU", reps: 1, status: "review", contact: "Anna Keller", contactRole: "QA Lead", licenseExpiry: "2027-09-27", documents: ["Drug Establishment License", "Board Certifications", "GMP Certificate"] },
  { id: "ORG-2238", name: "Lakeview Clinic Network", type: "Hospital", licenseId: "LIC-HTH-2344", region: "West", reps: 2, status: "review", contact: "Dr. Samuel Ortiz", contactRole: "Medical Director", licenseExpiry: "2027-04-11", documents: ["Drug Establishment License", "Board Certifications"] },
  { id: "ORG-2245", name: "Meridian Health", type: "Pharmaceutical", licenseId: "LIC-PHA-1319", region: "Northeast", reps: 2, status: "review", contact: "Daniel Okoye", contactRole: "Distribution Manager", licenseExpiry: "2027-03-22", documents: ["Drug Establishment License"] },
];

export interface AuditEvent {
  id: string;
  timestamp: string;
  eventType: string;
  actor: string;
  risk: "Low" | "Medium" | "High";
  detail: string;
}

export const auditEvents: AuditEvent[] = [
  { id: "AUD-8841", timestamp: "2026-10-27 05:42", eventType: "Bulk Narcotic Order", actor: "Marcus Feld — Nordis Pharma", risk: "High", detail: "Controlled-substance order of 40,000 units flagged for DEA Form 222 verification before release." },
  { id: "AUD-8839", timestamp: "2026-10-27 03:11", eventType: "Failed Login Attempt", actor: "Unknown (IP 203.0.113.44)", risk: "Medium", detail: "Nine consecutive failed attempts on a pharmacy rep account; temporary lock engaged automatically." },
  { id: "AUD-8836", timestamp: "2026-10-26 21:56", eventType: "Prescription Verification Override", actor: "Dr. Elena Vasquez — St. Anne's", risk: "Medium", detail: "Pharmacist overrode an automated interaction warning for RX-2274; override reason was recorded." },
  { id: "AUD-8831", timestamp: "2026-10-26 18:20", eventType: "Role Permission Change", actor: "Priya Raman — Platform", risk: "Medium", detail: "Warehouse operator role granted export rights for order manifests across two facilities." },
  { id: "AUD-8827", timestamp: "2026-10-26 14:03", eventType: "Data Export", actor: "James Whitfield — Northfield", risk: "Low", detail: "Monthly inventory report exported as CSV (1.2 MB) to a verified facility address." },
  { id: "AUD-8824", timestamp: "2026-10-26 09:47", eventType: "Failed Login Attempt", actor: "d.okoye@meridianhealth.com", risk: "Low", detail: "Two failed attempts before a successful sign-in from a newly registered device." },
  { id: "AUD-8819", timestamp: "2026-10-25 23:31", eventType: "Bulk Narcotic Order", actor: "Lakeview Clinic Network", risk: "High", detail: "Scheduled controlled-substance order paused automatically pending licence verification." },
];

export interface GeneratedReport {
  id: string;
  type: string;
  range: string;
  format: "PDF" | "CSV";
  generated: string;
}

export const reportHistory: GeneratedReport[] = [
  { id: "REP-0141", type: "Prescription Compliance", range: "Last 30 Days", format: "PDF", generated: "Sep 27, 2026" },
  { id: "REP-0140", type: "Network Health", range: "Last 7 Days", format: "CSV", generated: "Oct 01, 2026" },
  { id: "REP-0139", type: "Organisation Audits", range: "Year to Date", format: "PDF", generated: "Oct 12, 2026" },
];

export const testimonials = [
  {
    quote:
      "We cut emergency stock-outs by 63% in one quarter. The AI demand forecast flags shortages before our pharmacists notice them.",
    name: "Dr. Elena Vasquez",
    role: "Chief Pharmacist, St. Anne's General Hospital",
  },
  {
    quote:
      "Distribution planning used to take three analysts a week. PharmaBridge gives us the same picture every morning at 6am.",
    name: "Marcus Feld",
    role: "VP Supply Chain, Nordis Pharma",
  },
  {
    quote:
      "I upload my prescription and the medicine is verified and on its way the same afternoon. It changed how I manage my mother's care.",
    name: "Aisha Rahman",
    role: "Patient caregiver, Boston",
  },
];

export interface Shipment {
  id: string;
  item: string;
  carrier: string;
  origin: string;
  eta: string;
  quantity: number;
  /** 0 = Placed, 1 = Dispatched, 2 = In transit, 3 = Delivered */
  stage: 0 | 1 | 2 | 3;
}

export const shipments: Shipment[] = [
  {
    id: "SHP-2210",
    item: "Insulin Glargine 100 IU/mL × 400",
    carrier: "ColdChain Express",
    origin: "Helvex Biotech — EU Hub",
    eta: "Sep 02, 14:00",
    quantity: 400,
    stage: 0,
  },
  {
    id: "SHP-2206",
    item: "Sodium Chloride 0.9% IV × 1200",
    carrier: "MedFreight Lines",
    origin: "Corvea Labs — Plant 2",
    eta: "Aug 30, 09:40",
    quantity: 1200,
    stage: 2,
  },
  {
    id: "SHP-2190",
    item: "Surgical Gloves (L) × 5000",
    carrier: "Swift Medical Logistics",
    origin: "Meridian Health — Warehouse B",
    eta: "Sep 05, 11:00",
    quantity: 5000,
    stage: 1,
  },
  {
    id: "SHP-2198",
    item: "Ceftriaxone 1 g Vials × 800",
    carrier: "ColdChain Express",
    origin: "Nordis Pharma — Distribution",
    eta: "Delivered Aug 24",
    quantity: 800,
    stage: 3,
  },
];

export interface Ward {
  name: string;
  beds: number;
  occupied: number;
  coverage: number;
}

export const wardBreakdown: Ward[] = [
  { name: "Intensive care", beds: 24, occupied: 22, coverage: 92 },
  { name: "Emergency", beds: 36, occupied: 28, coverage: 78 },
  { name: "General surgery", beds: 42, occupied: 31, coverage: 71 },
  { name: "Oncology", beds: 30, occupied: 19, coverage: 64 },
  { name: "Paediatrics", beds: 28, occupied: 12, coverage: 41 },
];

/* ------------------------- Customer workspace data ------------------------- */

export interface CatalogMedicine {
  id: string;
  name: string;
  salt: string;
  dosage: string;
  manufacturer: string;
  price: number;
  status: "in-stock" | "low-stock" | "out-of-stock";
  category: string;
}

export const customerCatalog: CatalogMedicine[] = [
  { id: "MED-1041", name: "Amoxicillin 500 mg", salt: "Amoxicillin trihydrate", dosage: "Capsule · 500 mg", manufacturer: "Nordis Pharma", price: 8.4, status: "in-stock", category: "Antibiotics" },
  { id: "MED-1077", name: "Azithromycin 250 mg", salt: "Azithromycin dihydrate", dosage: "Tablet · 250 mg", manufacturer: "Corvea Labs", price: 11.2, status: "in-stock", category: "Antibiotics" },
  { id: "MED-1093", name: "Cephalexin 500 mg", salt: "Cefalexin monohydrate", dosage: "Capsule · 500 mg", manufacturer: "Nordis Pharma", price: 9.6, status: "low-stock", category: "Antibiotics" },
  { id: "MED-1088", name: "Metformin 850 mg", salt: "Metformin hydrochloride", dosage: "Tablet · 850 mg", manufacturer: "Corvea Labs", price: 5.1, status: "in-stock", category: "Diabetes" },
  { id: "MED-1156", name: "Glimepiride 2 mg", salt: "Glimepiride", dosage: "Tablet · 2 mg", manufacturer: "Meridian Health", price: 7.3, status: "in-stock", category: "Diabetes" },
  { id: "MED-1123", name: "Insulin Glargine", salt: "Insulin glargine", dosage: "Injection · 100 IU/mL", manufacturer: "Helvex Biotech", price: 46.75, status: "out-of-stock", category: "Diabetes" },
  { id: "MED-1250", name: "Paracetamol 650 mg", salt: "Acetaminophen", dosage: "Tablet · 650 mg", manufacturer: "Corvea Labs", price: 2.35, status: "in-stock", category: "Pain Relief" },
  { id: "MED-1261", name: "Ibuprofen 400 mg", salt: "Ibuprofen", dosage: "Tablet · 400 mg", manufacturer: "Meridian Health", price: 3.8, status: "in-stock", category: "Pain Relief" },
  { id: "MED-1275", name: "Naproxen 250 mg", salt: "Naproxen sodium", dosage: "Tablet · 250 mg", manufacturer: "Nordis Pharma", price: 4.9, status: "low-stock", category: "Pain Relief" },
  { id: "MED-1204", name: "Atorvastatin 20 mg", salt: "Atorvastatin calcium", dosage: "Tablet · 20 mg", manufacturer: "Meridian Health", price: 9.9, status: "in-stock", category: "Cardiac" },
  { id: "MED-1218", name: "Amlodipine 5 mg", salt: "Amlodipine besylate", dosage: "Tablet · 5 mg", manufacturer: "Corvea Labs", price: 4.2, status: "in-stock", category: "Cardiac" },
  { id: "MED-1226", name: "Losartan 50 mg", salt: "Losartan potassium", dosage: "Tablet · 50 mg", manufacturer: "Helvex Biotech", price: 6.4, status: "in-stock", category: "Cardiac" },
  { id: "MED-1301", name: "Vitamin D3 60k IU", salt: "Cholecalciferol", dosage: "Sachet · 60,000 IU", manufacturer: "CareLine Health", price: 3.2, status: "in-stock", category: "Vitamins" },
  { id: "MED-1315", name: "Vitamin B12 1500 mcg", salt: "Methylcobalamin", dosage: "Tablet · 1500 mcg", manufacturer: "CareLine Health", price: 5.6, status: "in-stock", category: "Vitamins" },
  { id: "MED-1320", name: "Daily Multivitamin", salt: "Multivitamin & minerals", dosage: "Tablet · 1 daily", manufacturer: "Meridian Health", price: 8.1, status: "in-stock", category: "Vitamins" },
];

export interface PrescriptionItem {
  name: string;
  dosage: string;
  instructions: string;
}

export const prescriptionItems: Record<string, PrescriptionItem[]> = {
  "RX-2291": [
    { name: "Amoxicillin 500 mg", dosage: "1 capsule, 3× daily", instructions: "Take with food for 7 days. Complete the full course even if you feel better." },
    { name: "Paracetamol 650 mg", dosage: "1 tablet, every 6 hours", instructions: "As needed for fever or pain. Maximum 4 tablets in 24 hours." },
    { name: "Vitamin D3 60k IU", dosage: "1 sachet weekly", instructions: "Take after breakfast on the same day each week." },
  ],
  "RX-2274": [
    { name: "Atorvastatin 20 mg", dosage: "1 tablet at bedtime", instructions: "Avoid grapefruit juice while taking this medicine." },
    { name: "Salbutamol Inhaler", dosage: "2 puffs when needed", instructions: "Shake well before use and rinse your mouth after each use." },
  ],
  "RX-2240": [
    { name: "Metformin 850 mg", dosage: "1 tablet, 2× daily", instructions: "Take with meals to reduce stomach upset." },
    { name: "Insulin Glargine", dosage: "10 units nightly", instructions: "Inject under the skin at the same time each evening. Rotate sites." },
    { name: "Vitamin B12 1500 mcg", dosage: "1 tablet daily", instructions: "Dissolve under the tongue before breakfast." },
    { name: "Aspirin 75 mg", dosage: "1 tablet in the morning", instructions: "Take after food. Do not stop without consulting your doctor." },
  ],
  "RX-2205": [
    { name: "Cetirizine 10 mg", dosage: "1 tablet daily", instructions: "This prescription has expired — ask your doctor to renew it." },
    { name: "Paracetamol 650 mg", dosage: "1 tablet, every 6 hours", instructions: "As needed for pain." },
  ],
};

export interface CustomerDelivery {
  id: string;
  item: string;
  carrier: string;
  eta: string;
  placed: string;
  /** 0 = Order Confirmed, 1 = Packed, 2 = Out for Delivery, 3 = Delivered */
  stage: 0 | 1 | 2 | 3;
}

export const customerDeliveries: CustomerDelivery[] = [
  {
    id: "TRK-88214",
    item: "Amoxicillin 500 mg × 21",
    carrier: "Swift Medical Logistics",
    eta: "Oct 28, 18:30",
    placed: "Oct 26",
    stage: 2,
  },
  {
    id: "TRK-88167",
    item: "Metformin 850 mg × 60",
    carrier: "MedFreight Lines",
    eta: "Oct 30, 12:00",
    placed: "Oct 27",
    stage: 1,
  },
  {
    id: "TRK-88090",
    item: "Salbutamol Inhaler × 1",
    carrier: "Swift Medical Logistics",
    eta: "Delivered Oct 22",
    placed: "Oct 20",
    stage: 3,
  },
];

/* ------------------------ Pharmaceutical workspace data ------------------------ */

export interface ProductionLine {
  id: string;
  name: string;
  focus: string;
  /** Utilisation percentage */
  capacity: number;
  activeBatches: number;
  outputRate: string;
  health: "optimal" | "watch" | "maintenance";
}

export const productionLines: ProductionLine[] = [
  {
    id: "line-a",
    name: "Line A — Solid dose",
    focus: "Tablets & capsules",
    capacity: 88,
    activeBatches: 2,
    outputRate: "12,400 units/hr",
    health: "optimal",
  },
  {
    id: "line-b",
    name: "Line B — Injectables",
    focus: "Vials & ampoules",
    capacity: 72,
    activeBatches: 1,
    outputRate: "3,200 units/hr",
    health: "watch",
  },
  {
    id: "line-c",
    name: "Line C — Inhalers",
    focus: "Metered dose inhalers",
    capacity: 54,
    activeBatches: 1,
    outputRate: "1,850 units/hr",
    health: "optimal",
  },
];

export interface Batch {
  id: string;
  product: string;
  targetUnits: number;
  completion: string;
  line: string;
  status: "running" | "queued" | "quality-check";
}

export const batchSchedule: Batch[] = [
  { id: "BAT-4412", product: "Amoxicillin 500 mg", targetUnits: 50000, completion: "Sep 06, 2026", line: "Line A — Solid dose", status: "running" },
  { id: "BAT-4409", product: "Paracetamol 650 mg", targetUnits: 120000, completion: "Sep 02, 2026", line: "Line A — Solid dose", status: "quality-check" },
  { id: "BAT-4415", product: "Insulin Glargine 100 IU/mL", targetUnits: 24000, completion: "Sep 11, 2026", line: "Line B — Injectables", status: "running" },
  { id: "BAT-4418", product: "Salbutamol Inhaler 100 mcg", targetUnits: 18000, completion: "Sep 15, 2026", line: "Line C — Inhalers", status: "queued" },
  { id: "BAT-4421", product: "Atorvastatin 20 mg", targetUnits: 60000, completion: "Sep 20, 2026", line: "Line A — Solid dose", status: "queued" },
];
