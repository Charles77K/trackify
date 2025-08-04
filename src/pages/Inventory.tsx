/* eslint-disable react-hooks/exhaustive-deps */
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

// Inventory type
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

const Inventory = () => {
  const modalRef = useRef<ModalRef>(null);
  const [editedRows, setEditedRows] = useState<Record<string, boolean>>({});
  const [itemId, setItemId] = useState<string | number>("");

  const {
    data = { results: [] },
    isLoading,
    isError,
    error,
    refetch,
  } = useFetch<{ results: InventoryItem[] }>("/inventory/");

  const [tableData, setTableData] = useState<InventoryItem[]>([]);
  const [originalData, setOriginalData] = useState<InventoryItem[]>([]);

  const { mutate: deleteItem, isPending: isDeleting } = useDelete("/inventory");
  const { mutate: updateItem, isPending: isUpdating } = useUpdate("/inventory");

  // fetch categories
  const { data: categories } = useFetch("/categories/");

  useEffect(() => {
    if (data.results && Array.isArray(data?.results)) {
      setTableData([...data.results]);
      setOriginalData([...data.results]);
    }
  }, [data]);

  const handleDelete = (id: string | number) => {
    modalRef.current?.open();
    setItemId(id);
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor("name", {
        header: "Item Name",
        cell: EditableTableCell,
      }),
      columnHelper.accessor("category_name", {
        header: "Category",
        cell: (props) => (
          <EditableTableCell
            {...props}
            inputType="select"
            selectOptions={categories}
          />
        ),
      }),
      columnHelper.accessor("quantity", {
        header: "Stock",
        cell: EditableTableCell,
      }),
      columnHelper.accessor("min_quantity", {
        header: "Min Level",
        cell: EditableTableCell,
      }),
      columnHelper.accessor("cost_price", {
        header: "Cost Price",
        cell: EditableTableCell,
      }),
      columnHelper.accessor("selling_price", {
        header: "Selling Price",
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

  const table = useReactTable<InventoryItem>({
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
                Toast.success("Updated", "Inventory item updated");
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
    content = <ErrorHandler error={error} retry={refetch} title="Inventory" />;
  else if (tableData.length === 0)
    content = <EmptyState title="inventory items" />;
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
        <h1 className="text-2xl font-bold text-gray-900">
          Inventory Management
        </h1>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          <Plus size={18} /> Add Item
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        {content}
      </div>

      <Modal
        ref={modalRef}
        title="Are you sure you want to delete this item?"
        negativeText="Cancel"
        positiveText={isDeleting ? "Deleting" : "Yes"}
        onPositive={() => {
          deleteItem(itemId, {
            onSuccess: () => {
              Toast.success("Deleted", "Item deleted successfully");
              modalRef.current?.close();
              refetch();
            },
            onError: () => {
              Toast.error("Failed", "Item could not be deleted");
            },
          });
        }}
      />
    </div>
  );
};

export default Inventory;
