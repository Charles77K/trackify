import { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { useFetch } from "../../services/tanstack-helpers";
import { Link } from "react-router-dom";

export type InventoryItem = {
  id: number;
  name: string;
  category: number;
  category_name: string;
  quantity: number;
  min_quantity: number;
  unit: string;
  cost_price: string;
  selling_price: string;
  is_low_stock: boolean;
  is_out_of_stock: boolean;
};

const columnHelper = createColumnHelper<InventoryItem>();

const LowStock = () => {
  const {
    data: stock,
    isPending,
    isError,
  } = useFetch<{ results: InventoryItem[] }>("/inventory/");

  // Filter low stock items using the is_low_stock property or quantity < min_quantity
  const lowStock: InventoryItem[] = useMemo(() => {
    if (!stock?.results) return [];
    return stock.results.filter(
      (item) => item.is_low_stock || item.quantity <= item.min_quantity
    );
  }, [stock?.results]);

  const columns = useMemo(
    () => [
      columnHelper.accessor("name", {
        header: "Item",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("quantity", {
        header: "Current Stock",
        cell: (info) => `${info.getValue()} ${info.row.original.unit}`,
      }),
      columnHelper.accessor("min_quantity", {
        header: "Min Level",
        cell: (info) => `${info.getValue()} ${info.row.original.unit}`,
      }),
      columnHelper.accessor("category_name", {
        header: "Category",
        cell: (info) => info.getValue(),
      }),
      columnHelper.display({
        id: "status",
        header: "Status",
        cell: (info) => {
          const item = info.row.original;
          const isOutOfStock = item.is_out_of_stock || item.quantity === 0;

          return (
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${
                isOutOfStock
                  ? "bg-red-100 text-red-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {isOutOfStock ? "Out of Stock" : "Low Stock"}
            </span>
          );
        },
      }),
    ],
    []
  );

  const table = useReactTable<InventoryItem>({
    data: lowStock,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isPending) {
    return (
      <div className="w-full p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center justify-center h-32">
          <div className="text-gray-500">Loading low stock items...</div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center justify-center h-32">
          <div className="text-red-500">Error loading inventory data</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-sidebar">
          Low Stock Items ({lowStock.length})
        </h2>
        <Link
          to={"/inventory"}
          className="px-4 py-2 text-sm bg-sidebar text-white rounded-lg hover:bg-sidebar-active transition"
        >
          View All
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {lowStock.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No low stock items found
          </div>
        ) : (
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-50">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-3 text-base font-semibold text-sidebar"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default LowStock;
