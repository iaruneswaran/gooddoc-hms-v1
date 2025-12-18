interface KpiTileProps {
  label: string;
  amount: string;
}

export function KpiTile({ label, amount }: KpiTileProps) {
  return (
    <div className="bg-card border border-border rounded-xl px-4 py-3 shadow-sm">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className="text-lg font-semibold text-primary">₹{amount}</p>
    </div>
  );
}
