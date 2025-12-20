interface KpiTileProps {
  label: string;
  amount: string;
}

export function KpiTile({ label, amount }: KpiTileProps) {
  return (
    <div className="border border-border rounded-lg px-4 py-3">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className="text-lg font-semibold text-primary">₹{amount}</p>
    </div>
  );
}
