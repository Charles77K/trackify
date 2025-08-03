import { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";

type Item = {
  item: string;
  stock: number;
  minLevel: number;
};

const columnHelper = createColumnHelper<Item>();

const data: Item[] = [
  { item: "Liquid Soap", stock: 12, minLevel: 15 },
  { item: "Hand Sanitizer", stock: 5, minLevel: 5 },
  { item: "Toilet Roll", stock: 3, minLevel: 10 },
  { item: "Disinfectant", stock: 20, minLevel: 15 },
];

const LowStock = () => {
  const columns = useMemo(
    () => [
      columnHelper.accessor("item", {
        header: "Item",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("stock", {
        header: "Stock",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("minLevel", {
        header: "Min Level",
        cell: (info) => info.getValue(),
      }),
      columnHelper.display({
        id: "status",
        header: "Status",
        cell: (info) => {
          const row = info.row.original;
          let color = "text-green-600";
          let label = "OK";

          if (row.stock < row.minLevel) {
            color = "text-red-600";
            label = "Below Min";
          } else if (row.stock === row.minLevel) {
            color = "text-yellow-600";
            label = "At Min";
          }

          return <span className={`font-medium ${color}`}>{label}</span>;
        },
      }),
    ],
    []
  );

  const table = useReactTable<Item>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-sidebar">Low Stock Items</h2>
        <button className="px-4 py-2 text-sm bg-sidebar text-white rounded hover:bg-sidebar-active transition">
          View All
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-base font-semibold text-sidebar "
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LowStock;
