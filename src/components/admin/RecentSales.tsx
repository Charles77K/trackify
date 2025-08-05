import { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { useFetch } from "../../services/tanstack-helpers";
import TableSkeleton from "../../components/admin/TableSkeleton";
import EmptyState from "../../components/admin/EmptyState";

import { Link } from "react-router-dom";

type RecentSale = {
  id: number;
  item_name: string;
  outlet_name: string;
  quantity: string;
  total_price: string;
  user_name: string;
  timestamp: string;
};

const columnHelper = createColumnHelper<RecentSale>();

const RecentSales = () => {
  const { data, isLoading } = useFetch("/dashboard/recent-sales/");
  const sales = data?.results;

  const columns = useMemo(
    () => [
      columnHelper.accessor("id", {
        header: "ID",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("item_name", {
        header: "Name",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("outlet_name", {
        header: "Outlet",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("quantity", {
        header: "Quantity",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("total_price", {
        header: "Price",
        cell: (info) => info.getValue(),
      }),

      columnHelper.accessor("timestamp", {
        header: "Date Created",
        cell: (info) => {
          const date = new Date(info.getValue());
          return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          });
        },
      }),
    ],
    []
  );

  const table = useReactTable<RecentSale>({
    data: sales || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return <TableSkeleton />;
  }

  return (
    <div className="w-full p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-sidebar">Recent Sales</h2>
        <Link
          to={"/sales"}
          className="px-4 py-2 text-sm bg-sidebar text-white rounded-lg hover:bg-sidebar-active transition"
        >
          View All Sales
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
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

      {sales && sales.length === 0 && <EmptyState title="sales" />}
    </div>
  );
};

export default RecentSales;
