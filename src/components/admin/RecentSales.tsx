import { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { useFetch } from "../../services/tanstack-helpers";

const columnHelper = createColumnHelper<Sale>();

// Dummy data type
type Sale = {
  id: string;
  date: string;
  outlet: string;
  total: string;
  action: string;
};

// Dummy data
const salesData: Sale[] = [
  {
    id: "001",
    date: "June 15",
    outlet: "Outlet A",
    total: "$150.00",
    action: "View",
  },
  {
    id: "002",
    date: "June 12",
    outlet: "Outlet B",
    total: "$245.99",
    action: "View",
  },
  {
    id: "003",
    date: "June 13",
    outlet: "Outlet C",
    total: "$95.20",
    action: "View",
  },
  {
    id: "004",
    date: "June 15",
    outlet: "Outlet A",
    total: "$310.00",
    action: "View",
  },
];

const RecentSales = () => {
  // const { data: recentSales } = useFetch("/dashboard/recent-sales/");

  const columns = useMemo(
    () => [
      columnHelper.accessor("id", {
        header: "ID",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("date", {
        header: "Date",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("outlet", {
        header: "Outlet",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("total", {
        header: "Total",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("action", {
        header: "Action",
        cell: (info) => (
          <button className="text-blue-600 hover:underline text-sm">
            {info.getValue()}
          </button>
        ),
      }),
    ],
    []
  );

  const table = useReactTable<Sale>({
    data: salesData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-sidebar">Recent Sales</h2>
        <button className="px-4 py-2 text-sm bg-sidebar text-white rounded hover:bg-sidebar-active transition">
          <span className="mr-2">+</span>
          New Sale
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

export default RecentSales;
