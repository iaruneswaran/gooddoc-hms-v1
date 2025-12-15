import { useNavigate } from "react-router-dom";
import { ListPageLayout, Column, Filter, RowAction } from "@/components/overview/ListPageLayout";
import { lowStockItems, InventoryItemRecord } from "@/data/overview.mock";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

const LowStockItems = () => {
  const navigate = useNavigate();

  const statusStyles: Record<string, string> = {
    Low: "badge-warning",
    Critical: "badge-error",
    OK: "badge-success",
  };

  const columns: Column<InventoryItemRecord>[] = [
    { key: "id", label: "Item ID", sortable: true },
    { key: "itemName", label: "Item Name", sortable: true },
    { key: "category", label: "Category", sortable: true },
    {
      key: "currentStock",
      label: "Current Stock",
      sortable: true,
      render: (row) => `${row.currentStock} ${row.unit}`,
    },
    {
      key: "reorderLevel",
      label: "Reorder Level",
      render: (row) => `${row.reorderLevel} ${row.unit}`,
    },
    { key: "supplier", label: "Supplier", sortable: true },
    {
      key: "lastRefilled",
      label: "Last Refilled",
      sortable: true,
      render: (row) => format(new Date(row.lastRefilled), "dd MMM yyyy"),
    },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <Badge className={statusStyles[row.status]}>{row.status}</Badge>
      ),
    },
  ];

  const filters: Filter[] = [
    {
      key: "category",
      label: "Category",
      value: "all",
      options: [
        { value: "Medications", label: "Medications" },
        { value: "Surgical Supplies", label: "Surgical Supplies" },
        { value: "Lab Consumables", label: "Lab Consumables" },
        { value: "PPE", label: "PPE" },
        { value: "IV Supplies", label: "IV Supplies" },
        { value: "Wound Care", label: "Wound Care" },
      ],
    },
    {
      key: "status",
      label: "Status",
      value: "all",
      options: [
        { value: "Low", label: "Low" },
        { value: "Critical", label: "Critical" },
      ],
    },
  ];

  const rowActions: RowAction<InventoryItemRecord>[] = [
    { label: "View Item", onClick: (row) => navigate(`/inventory/item/${row.id}`) },
    { label: "Create Purchase Requisition", onClick: () => {} },
    { label: "Update Stock", onClick: () => {} },
  ];

  return (
    <ListPageLayout
      title="Low Stock Items"
      count={lowStockItems.length}
      subtitle="Below reorder threshold"
      breadcrumbs={["Overview", "Low Stock Items"]}
      data={lowStockItems}
      columns={columns}
      filters={filters}
      rowActions={rowActions}
      emptyMessage="No items are currently low on stock."
      searchPlaceholder="Search by Item ID or Name..."
      onRowClick={(row) => navigate(`/inventory/item/${row.id}`)}
      getRowId={(row) => row.id}
    />
  );
};

export default LowStockItems;
