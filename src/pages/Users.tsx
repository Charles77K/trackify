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

type User = {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  is_active: boolean;
  date_joined: string;
};

const columnHelper = createColumnHelper<User>();

const Users = () => {
  const { data, isLoading } = useFetch("/users/");
  const users = data?.results;

  const columns = useMemo(
    () => [
      columnHelper.accessor("username", {
        header: "Username",
        cell: (info) => info.getValue(),
      }),
      columnHelper.display({
        id: "full_name",
        header: "Full Name",
        cell: (info) => {
          const row = info.row.original;
          return `${row.first_name} ${row.last_name}`;
        },
      }),
      columnHelper.accessor("email", {
        header: "Email",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("role", {
        header: "Role",
        cell: (info) => (
          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.display({
        id: "status",
        header: "Status",
        cell: (info) => {
          const isActive = info.row.original.is_active;
          return (
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${
                isActive
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {isActive ? "Active" : "Inactive"}
            </span>
          );
        },
      }),
      columnHelper.accessor("date_joined", {
        header: "Date Joined",
        cell: (info) => {
          const date = new Date(info.getValue());
          return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          });
        },
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: (info) => {
          const row = info.row.original;
          return (
            <div className="flex gap-2">
              <button
                onClick={() => {
                  // Your view user hook here
                  console.log("View user:", row.id);
                }}
                className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
              >
                View
              </button>
              <button
                onClick={() => {
                  // Your edit user hook here
                  console.log("Edit user:", row.id);
                }}
                className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition"
              >
                Edit
              </button>
              <button
                onClick={() => {
                  // Your toggle user status hook here
                  console.log("Toggle status for user:", row.id);
                }}
                className={`px-2 py-1 text-xs rounded transition ${
                  row.is_active
                    ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                    : "bg-green-100 text-green-700 hover:bg-green-200"
                }`}
              >
                {row.is_active ? "Deactivate" : "Activate"}
              </button>
              <button
                onClick={() => {
                  // Your delete user hook here
                  console.log("Delete user:", row.id);
                }}
                className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
              >
                Delete
              </button>
            </div>
          );
        },
      }),
    ],
    []
  );

  const table = useReactTable<User>({
    data: users || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return (
      <div className="w-full p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-sidebar">
            User Management
          </h2>
          <button className="px-4 py-2 text-sm bg-sidebar text-white rounded hover:bg-sidebar-active transition">
            Add New User
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
          Add New User
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
      {users && users.length === 0 && <EmptyState title="Users" />}
    </div>
  );
};

export default Users;
