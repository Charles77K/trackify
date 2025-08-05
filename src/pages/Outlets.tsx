/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo, useRef, useState, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { Check, Edit2, Trash2, X, Plus } from "lucide-react";
import { useDelete, useFetch, useUpdate } from "../services/tanstack-helpers";
import EditableTableCell from "../components/admin/EditableTableCell";
import type { ModalRef } from "../components/ui/Modal";
import Toast from "../lib/Toast";
import TableSkeleton from "../components/admin/TableSkeleton";
import ErrorHandler from "../components/admin/ErrorHandler";
import EmptyState from "../components/admin/EmptyState";
import Modal from "../components/ui/Modal";
import CreateModal from "../components/admin/CreateModal";
import CreateOutlet from "../components/admin/CreateOutlet";

// Outlet type
export type OutletItem = {
  id: number;
  total_sales: string;
  name: string;
  location: string;
};

const columnHelper = createColumnHelper<OutletItem>();

const EditCell = ({ row, table }: any) => {
  const meta = table.options.meta;
  const setEditedRows = (e: React.MouseEvent<HTMLButtonElement>) => {
    const elName = e.currentTarget.name;
    meta?.setEditedRows((old: any) => ({
      ...old,
      [row.id]: !old[row.id],
    }));

    if (elName !== "edit") {
      meta?.revertData(row.index, e.currentTarget.name === "cancel");
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {meta?.editedRows[row.id] ? (
        <>
          <button
            onClick={setEditedRows}
            name="done"
            className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded transition-colors"
            title="Save"
            disabled={meta?.isUpdating}
          >
            {meta?.isUpdating ? (
              <div className="flex space-x-1">
                <div className="w-1 h-1 bg-green-600 rounded-full animate-pulse"></div>
                <div className="w-1 h-1 bg-green-600 rounded-full animate-pulse delay-75"></div>
                <div className="w-1 h-1 bg-green-600 rounded-full animate-pulse delay-150"></div>
              </div>
            ) : (
              <Check size={16} />
            )}
          </button>
          <button
            onClick={setEditedRows}
            name="cancel"
            className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded transition-colors"
            title="Cancel"
            disabled={meta?.isUpdating}
          >
            <X size={16} />
          </button>
        </>
      ) : (
        <>
          <button
            onClick={setEditedRows}
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
    </div>
  );
};

const Outlets = () => {
  const modalRef = useRef<ModalRef>(null);
  const createModalRef = useRef<ModalRef>(null);
  const [editedRows, setEditedRows] = useState<Record<string, boolean>>({});
  const [itemId, setItemId] = useState<string | number>("");

  const {
    data = { results: [] },
    isLoading,
    isError,
    error,
    refetch,
  } = useFetch<{ results: OutletItem[] }>("/outlets/");

  const [tableData, setTableData] = useState<OutletItem[]>([]);
  const [originalData, setOriginalData] = useState<OutletItem[]>([]);

  const { mutate: deleteItem, isPending: isDeleting } = useDelete("/outlets");
  const { mutate: updateItem, isPending: isUpdating } = useUpdate("/outlets");

  const prevDataRef = useRef<OutletItem[]>(null);

  useEffect(() => {
    if (data.results && Array.isArray(data?.results)) {
      const currentData = JSON.stringify(data.results);
      const prevData = JSON.stringify(prevDataRef.current);

      if (currentData !== prevData) {
        setTableData([...data.results]);
        setOriginalData([...data.results]);
        prevDataRef.current = data.results;
      }
    }
  }, [data]);

  const handleDelete = (id: string | number) => {
    modalRef.current?.open();
    setItemId(id);
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor("name", {
        header: "Outlet Name",
        cell: EditableTableCell,
      }),
      columnHelper.accessor("total_sales", {
        header: "Total sales",
        cell: EditableTableCell,
      }),
      columnHelper.accessor("location", {
        header: "location",
        cell: EditableTableCell,
      }),

      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: EditCell,
      }),
    ],
    []
  );

  const table = useReactTable<OutletItem>({
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
            old.map((row, index) =>
              index === rowIndex ? originalData[rowIndex] : row
            )
          );
        } else {
          const updatedRow = tableData[rowIndex];
          updateItem(
            { id: updatedRow.id, data: updatedRow },
            {
              onSuccess: () => {
                Toast.success("Updated", "Outlet updated");
                setOriginalData((old) =>
                  old.map((row, index) =>
                    index === rowIndex ? tableData[rowIndex] : row
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
          old.map((row, index) =>
            index === rowIndex ? { ...row, [columnId]: value } : row
          )
        );
      },
    },
  });

  let content;

  if (isLoading) content = <TableSkeleton columns={7} rows={5} />;
  else if (isError)
    content = <ErrorHandler error={error} retry={refetch} title="Outlets" />;
  else if (tableData.length === 0) content = <EmptyState title="outlets" />;
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
              className={`hover:bg-gray-50 transition-colors ${
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
    <div className="w-full p-4 bg-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Outlet Management</h1>
        <button
          onClick={() => createModalRef.current?.open()}
          className="flex items-center gap-2 bg-sidebar text-white px-4 py-2 rounded-lg hover:bg-sidebar-active"
        >
          <Plus size={18} /> Add Outlet
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        {content}
      </div>

      {/* delete modal */}
      <Modal
        ref={modalRef}
        title="Are you sure you want to delete this outlet?"
        negativeText="Cancel"
        positiveText={isDeleting ? "Deleting" : "Yes"}
        onPositive={() => {
          deleteItem(itemId, {
            onSuccess: () => {
              Toast.success("Deleted", "Outlet deleted successfully");
              modalRef.current?.close();
              refetch();
            },
            onError: () => {
              Toast.error("Failed", "Outlet could not be deleted");
            },
          });
        }}
      />

      {/* create modal */}
      <CreateModal ref={createModalRef}>
        <CreateOutlet onComplete={() => createModalRef.current?.close()} />
      </CreateModal>
    </div>
  );
};

export default Outlets;
