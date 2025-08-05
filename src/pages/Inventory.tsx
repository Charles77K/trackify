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
import type { Category } from "./Categories";
import CreateModal from "../components/admin/CreateModal";
import CreateInventory from "../components/admin/CreateInventory";

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
            <Check size={16} />
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
          {meta.isUpdating ? (
            <p className="text-xs text-gray-400">updating...</p>
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
        </>
      )}
    </div>
  );
};

const Inventory = () => {
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
  } = useFetch<{ results: InventoryItem[] }>("/inventory/");

  const [tableData, setTableData] = useState<InventoryItem[]>([]);
  const [originalData, setOriginalData] = useState<InventoryItem[]>([]);

  const { mutate: deleteItem, isPending: isDeleting } = useDelete("/inventory");
  const { mutate: updateItem, isPending: isUpdating } = useUpdate("/inventory");

  // fetch categories
  const { data: category } = useFetch<{ results: Category[] }>("/categories/");
  const categories = category?.results;

  const prevDataRef = useRef<InventoryItem[]>(null);

  useEffect(() => {
    if (data.results && Array.isArray(data?.results)) {
      // Only update if the data has actually changed
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

  // Fix: Include categories in the dependency array
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
            selectOptions={categories!}
          />
        ),
      }),
      columnHelper.accessor("quantity", {
        header: "Quantity",
        cell: EditableTableCell,
      }),
      columnHelper.accessor("min_quantity", {
        header: "Min qty",
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
      columnHelper.accessor("is_out_of_stock", {
        header: "Status",
        cell: ({ row }) => {
          const isOutOfStock = row.original.is_out_of_stock;
          const bgColor = isOutOfStock
            ? "bg-yellow-100 text-yellow-800"
            : "bg-green-100 text-green-800";

          return (
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${bgColor}`}
            >
              {isOutOfStock ? "Out of Stock" : "In Stock"}
            </span>
          );
        },
      }),

      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: EditCell,
      }),
    ],
    [categories] // Add categories to dependency array
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
    <div className="w-full p-4 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold text-sidebar">
          Inventory Management
        </h1>
        <button
          onClick={() => createModalRef.current?.open()}
          className="flex items-center gap-2 bg-sidebar text-white px-4 py-2 rounded-lg hover:bg-sidebar-active"
        >
          <Plus size={18} /> Add Item
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        {content}
      </div>

      {/* delete modal */}
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

      {/* create modal */}
      <CreateModal ref={createModalRef}>
        <CreateInventory onComplete={() => createModalRef.current?.close()} />
      </CreateModal>
    </div>
  );
};

export default Inventory;
