export const mockPatientsByPhone: Record<string, any> = {
  "9876543210": {
    type: "IP" as const,
    name: "Harish Kalyan",
    gdid: "001",
    age: "35",
    gender: "M",
    lastActivityShort: "In IP since May 2025",
    ipInfo: {
      doctor: "Dr hello world",
      ward: "25",
      bed: "34",
      emergencyContact: "sxlfcndxlkc",
    },
    pending: [
      { item: "ECG report", status: "Paid" },
      { item: "ECG report", status: "Paid" },
    ],
    pendingAmount: {
      outstanding: "₹6,600",
      advance: "₹3,200",
      bills: "₹9,800",
      balance: "₹3,400",
    },
    options: ["Add amount", "Book appointment", "Discharge"],
  },
  "0123456789": {
    type: "OP" as const,
    name: "Pooja Nair",
    gdid: "002",
    age: "—",
    gender: "F",
    lastActivityShort: "Last visit: 2hr ago — consultation",
    pendingReports: "Report pending by doctor",
    pendingAmountNote: "Add pending",
    options: [
      "Add amount",
      "Book appointment",
      "View payment history",
      "Documents",
      "Insurance etc",
    ],
  },
};
