/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo, useRef, useState, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { Check, Edit2, Trash2, X } from "lucide-react";
import { useDelete, useFetch, useUpdate } from "../services/tanstack-helpers";
import EditableTableCell from "../components/admin/EditableTableCell";
import type { ModalRef } from "../components/ui/Modal";
import Toast from "../lib/Toast";
import TableSkeleton from "../components/admin/TableSkeleton";
import ErrorHandler from "../components/admin/ErrorHandler";
import EmptyState from "../components/admin/EmptyState";
import Modal from "../components/ui/Modal";

const options = [
  { id: 1, name: "manager" },
  { id: 2, name: "staff" },
];

export type User = {
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

const EditCell = ({ row, table }: any) => {
  const meta = table.options.meta;
  const toggleEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
    const elName = e.currentTarget.name;
    meta?.setEditedRows((old: any) => ({
      ...old,
      [row.id]: !old[row.id],
    }));

    if (elName !== "edit") {
      meta?.revertData(row.index, elName === "cancel");
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {meta?.editedRows[row.id] ? (
        <>
          <button
            onClick={toggleEdit}
            name="done"
            className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded transition-colors"
            title="Save"
          >
            <Check size={16} />
          </button>
          <button
            onClick={toggleEdit}
            name="cancel"
            className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded transition-colors"
            title="Cancel"
          >
            <X size={16} />
          </button>
        </>
      ) : (
        <>
          {meta.isUpdating ? (
            <p className="text-xs text-gray-400">updating...</p>
          ) : (
            <>
              <button
                onClick={toggleEdit}
                name="edit"
                className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                title="Edit"
              >
                <Edit2 size={16} />
              </button>
              <button
                onClick={() => meta?.handleDelete(row.original.id)}
                className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
};

const Users = () => {
  const modalRef = useRef<ModalRef>(null);
  const [userId, setUserId] = useState<string | number>("");
  const [editedRows, setEditedRows] = useState<Record<string, boolean>>({});
  const {
    data = { results: [] },
    isLoading,
    isError,
    error,
    refetch,
  } = useFetch<{ results: User[] }>("/users/");
  const [tableData, setTableData] = useState<User[]>([]);
  const [originalData, setOriginalData] = useState<User[]>([]);

  const { mutate: deleteUser, isPending: isDeleting } = useDelete("/users");
  const { mutate: updateUser, isPending: isUpdating } = useUpdate("/users");

  const prevDataRef = useRef<User[]>(null);

  useEffect(() => {
    if (data.results && Array.isArray(data.results)) {
      const current = JSON.stringify(data.results);
      const previous = JSON.stringify(prevDataRef.current);
      if (current !== previous) {
        setTableData([...data.results]);
        setOriginalData([...data.results]);
        prevDataRef.current = data.results;
      }
    }
  }, [data]);

  const handleDelete = (id: string | number) => {
    setUserId(id);
    modalRef.current?.open();
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor("username", {
        header: "Username",
        cell: EditableTableCell,
      }),
      columnHelper.accessor("email", {
        header: "Email",
        cell: EditableTableCell,
      }),
      columnHelper.accessor("role", {
        header: "Role",
        cell: (props) => (
          <EditableTableCell
            {...props}
            inputType="select"
            selectOptions={options}
          />
        ),
      }),
      columnHelper.accessor("date_joined", {
        header: "Date Joined",
        cell: (info) => new Date(info.getValue()).toLocaleDateString(),
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: EditCell,
      }),
    ],
    []
  );

  const table = useReactTable<User>({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      editedRows,
      setEditedRows,
      handleDelete,
      isUpdating,
      revertData: (rowIndex: number, revert: boolean) => {
        if (revert) {
          setTableData((old) =>
            old.map((row, i) => (i === rowIndex ? originalData[rowIndex] : row))
          );
        } else {
          const updated = tableData[rowIndex];
          updateUser(
            { id: updated.id, data: updated },
            {
              onSuccess: () => {
                Toast.success("Updated", "User updated successfully");
                setOriginalData((old) =>
                  old.map((row, i) =>
                    i === rowIndex ? tableData[rowIndex] : row
                  )
                );
              },
              onError: () => {
                Toast.error("Failed", "Update failed");
              },
            }
          );
        }
      },
      updateData: (rowIndex: number, columnId: string, value: string) => {
        setTableData((old) =>
          old.map((row, i) =>
            i === rowIndex ? { ...row, [columnId]: value } : row
          )
        );
      },
    },
  });

  let content;
  if (isLoading) content = <TableSkeleton columns={5} rows={5} />;
  else if (isError)
    content = <ErrorHandler error={error} retry={refetch} title="Users" />;
  else if (tableData.length === 0) content = <EmptyState title="Users" />;
  else
    content = (
      <table className="w-full">
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map((group) => (
            <tr key={group.id}>
              {group.headers.map((header) => (
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
        <tbody className="bg-white divide-y divide-gray-200">
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className={`hover:bg-gray-50 ${
                editedRows[row.id] ? "bg-blue-50" : ""
              }`}
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-6 py-4 text-sm">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );

  return (
    <div className="w-full p-4 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold text-sidebar">User Management</h1>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        {content}
      </div>
      <Modal
        ref={modalRef}
        title="Are you sure you want to delete this user?"
        negativeText="Cancel"
        positiveText={isDeleting ? "Deleting" : "Yes"}
        onPositive={() => {
          deleteUser(userId, {
            onSuccess: () => {
              Toast.success("Deleted", "User deleted successfully");
              modalRef.current?.close();
              refetch();
            },
            onError: () => {
              Toast.error("Failed", "User could not be deleted");
            },
          });
        }}
      />
    </div>
  );
};

export default Users;
