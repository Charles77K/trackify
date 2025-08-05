import { useMemo, useRef } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { useFetch } from "../services/tanstack-helpers";
import TableSkeleton from "../components/admin/TableSkeleton";
import EmptyState from "../components/admin/EmptyState";
import type { ModalRef } from "../components/ui/Modal";
import CreateModal from "../components/admin/CreateModal";
import CreatePurchase from "../components/admin/CreatePurchase";

type Purchases = {
  id: number;
  item: number;
  quantity: number;
  supplier: string;
  cost: string;
};

const columnHelper = createColumnHelper<Purchases>();

const Purchases = () => {
  const modalRef = useRef<ModalRef>(null);
  const { data, isLoading } = useFetch("/purchases/");
  const sales = data?.results;

  const columns = useMemo(
    () => [
      columnHelper.accessor("quantity", {
        header: "Quantity",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("supplier", {
        header: "Supplier",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("cost", {
        header: "Cost",
        cell: (info) => {
          return <p>₦{info.getValue()}</p>;
        },
      }),
    ],
    []
  );

  const table = useReactTable<Purchases>({
    data: sales || [],
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
        <h2 className="text-xl font-semibold text-sidebar">Purchases</h2>
        <button
          onClick={() => {
            modalRef.current?.open();
          }}
          className="px-4 py-2 text-sm bg-sidebar text-white rounded hover:bg-sidebar-active transition"
        >
          Add New Purchase
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
      {sales && sales.length === 0 && <EmptyState title="purchases" />}

      {/* create modal ref */}
      <CreateModal ref={modalRef}>
        <CreatePurchase onComplete={() => modalRef.current?.close()} />
      </CreateModal>
    </div>
  );
};

export default Purchases;
