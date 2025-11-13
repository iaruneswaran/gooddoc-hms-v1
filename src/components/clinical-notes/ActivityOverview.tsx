import { ArrowRight, TestTube, ScanLine, Pill, FileText, BedDouble } from "lucide-react";

interface ActivityCardProps {
  icon: React.ReactNode;
  title: string;
  time: string;
  location?: string;
  status: "admission" | "lab" | "imaging" | "pharmacy" | "pending";
}

function ActivityCard({ icon, title, time, location, status }: ActivityCardProps) {
  const styles = {
    admission: {
      bg: "#EEF2FF",
      border: "#E0E7FF",
      color: "#4F46E5",
    },
    lab: {
      bg: "#F4EAFF",
      border: "#EADAFD",
      color: "#7C3AED",
    },
    imaging: {
      bg: "#E6FAFF",
      border: "#CFF4FF",
      color: "#0891B2",
    },
    pharmacy: {
      bg: "#EAF7EF",
      border: "#D3F0DA",
      color: "#047857",
    },
    pending: {
      bg: "#F9FAFB",
      border: "#D1D5DB",
      color: "#6B7280",
    },
  };

  const style = styles[status];
  const isPending = status === "pending";

  return (
    <div
      className="rounded-xl p-4 min-w-[220px]"
      style={{
        backgroundColor: style.bg,
        border: isPending ? `1px dashed ${style.border}` : `1px solid ${style.border}`,
        boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
      }}
    >
      <div className="flex items-start gap-3">
        <div style={{ color: style.color }}>{icon}</div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm" style={{ color: style.color }}>
            {title}
          </p>
          <p className="text-xs text-muted-foreground mt-1">{time}</p>
          {location && <p className="text-xs text-muted-foreground">{location}</p>}
        </div>
      </div>
    </div>
  );
}

export function ActivityOverview() {
  const activities = [
    {
      date: "Aug 03",
      cards: [
        {
          icon: <BedDouble className="w-5 h-5" />,
          title: "Admission",
          time: "09:30 AM",
          location: "ER → Ward 3B",
          status: "admission" as const,
        },
      ],
    },
    {
      date: "Aug 04",
      cards: [
        {
          icon: <TestTube className="w-5 h-5" />,
          title: "Lab Tests",
          time: "08:00 AM",
          location: "CBC + CMP",
          status: "lab" as const,
        },
        {
          icon: <ScanLine className="w-5 h-5" />,
          title: "Imaging",
          time: "11:30 AM",
          location: "Chest X-ray",
          status: "imaging" as const,
        },
      ],
    },
    {
      date: "Aug 05",
      cards: [
        {
          icon: <Pill className="w-5 h-5" />,
          title: "Pharmacy",
          time: "07:00 AM",
          location: "Ceftriaxone 1g IV",
          status: "pharmacy" as const,
        },
        {
          icon: <FileText className="w-5 h-5" />,
          title: "Discharge",
          time: "Pending",
          location: "Awaiting approval",
          status: "pending" as const,
        },
      ],
    },
  ];

  return (
    <div>
      <h2 className="text-base font-semibold text-foreground mb-4">Activity Overview</h2>
      <div className="flex gap-6 overflow-x-auto pb-2">
        {activities.map((day, idx) => (
          <div key={idx} className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">{day.date}</p>
            <div className="space-y-3">
              {day.cards.map((card, cardIdx) => (
                <ActivityCard key={cardIdx} {...card} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
