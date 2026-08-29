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
  status: "verified" | "reviewing" | "rejected";
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

export const platformUsers = [
  {
    id: "USR-3301",
    name: "St. Anne's General Hospital",
    type: "Hospital",
    region: "Midwest",
    status: "active",
    joined: "2025-02-11",
  },
  {
    id: "USR-3318",
    name: "Nordis Pharma",
    type: "Pharmaceutical",
    region: "Global",
    status: "active",
    joined: "2024-11-04",
  },
  {
    id: "USR-3352",
    name: "Helvex Biotech",
    type: "Pharmaceutical",
    region: "EU",
    status: "review",
    joined: "2026-06-19",
  },
  {
    id: "USR-3390",
    name: "Marta Kowalski",
    type: "Customer",
    region: "Northeast",
    status: "active",
    joined: "2026-03-08",
  },
  {
    id: "USR-3412",
    name: "Lakeview Clinic Network",
    type: "Hospital",
    region: "West",
    status: "suspended",
    joined: "2025-08-30",
  },
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
