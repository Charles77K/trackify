/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { useFetch } from "../services/tanstack-helpers";
import TableSkeleton from "../components/admin/TableSkeleton";
import EmptyState from "../components/admin/EmptyState";

type Sales = {
  id: number;
  item_name: string;
  outlet_name: string;
  user_name: string;
  quantity: string;
  total_price: string;
  outlet: boolean;
  timestamp: Date;
  item: string;
  user: any;
};

const columnHelper = createColumnHelper<Sales>();

const Sales = () => {
  const { data, isLoading } = useFetch("/sales/");
  const sales = data?.results;

  const columns = useMemo(
    () => [
      columnHelper.accessor("item_name", {
        header: "Name",
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
      columnHelper.accessor("user_name", {
        header: "User",
        cell: (info) => (
          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
            {info.getValue()}
          </span>
        ),
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

  const table = useReactTable<Sales>({
    data: sales || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return (
      <div className="w-full p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-sidebar">Sales</h2>
          <button className="px-4 py-2 text-sm bg-sidebar text-white rounded hover:bg-sidebar-active transition">
            Add New Sake
          </button>
        </div>
        {/* Your skeleton loader component here */}
        <TableSkeleton />
      </div>
    );
  }

  return (
    <div className="w-full p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-sidebar">User Management</h2>
        <button
          onClick={() => {
            // Your create/add new user hook here
            console.log("Add new user");
          }}
          className="px-4 py-2 text-sm bg-sidebar text-white rounded hover:bg-sidebar-active transition"
        >
          Add New Sale
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

      {/* Empty state */}
      {sales && sales.length === 0 && <EmptyState title="sales" />}
    </div>
  );
};

export default Sales;
