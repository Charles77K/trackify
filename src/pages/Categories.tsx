import { useRef, useState } from "react";
import { Pencil, Trash2, Plus, X, Check } from "lucide-react";
import {
  useCreate,
  useDelete,
  useFetch,
  useUpdate,
} from "../services/tanstack-helpers";
import Toast from "../lib/Toast";
import type { ModalRef } from "../components/ui/Modal";
import Modal from "../components/ui/Modal";
import Skeleton from "react-loading-skeleton";

export type Category = {
  id: number;
  name: string;
};

const Categories = () => {
  const modalRef = useRef<ModalRef>(null);
  const { mutate: createCategory, isPending: isCreating } =
    useCreate("/categories/");

  const { data = { results: [] }, isLoading } = useFetch<{
    results: Category[];
  }>("/categories/");

  const { mutate: update, isPending: isUpdating } = useUpdate("/categories");

  const { mutate: deleteData, isPending: isDeleting } =
    useDelete("/categories");
  const categories = data?.results || [];

  const [editingId, setEditingId] = useState<number | string>("");
  const [editingName, setEditingName] = useState("");
  const [deletingId, setDeletingId] = useState<number | string>("");
  const [isAdding, setIsAdding] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const handleEdit = (category: Category) => {
    setEditingId(category.id);
    setEditingName(category.name);
  };
  const handleSaveEdit = () => {
    update(
      { id: editingId, data: { name: editingName } },
      {
        onSuccess: () => {
          Toast.success("Success", "Category updated successfully");
          setEditingId("");
          setEditingName("");
        },
        onError: (error) => {
          Toast.error(
            "Error",
            "An unexpected error occurred while fetching data"
          );
          console.log(error);
        },
      }
    );
  };

  const handleCancelEdit = () => {
    setEditingId("");
    setEditingName("");
  };

  const handleDelete = (categoryId: number) => {
    setDeletingId(categoryId);
    modalRef?.current?.open();
  };

  const handleAddNew = () => {
    if (newCategoryName.trim()) {
      createCategory(
        { name: newCategoryName },
        {
          onSuccess: () => {
            Toast.success("Success", "Category added successfully");
            setNewCategoryName("");
            setIsAdding(false);
          },
          onError: (err) => {
            Toast.error(
              "Error",
              "An unexpected error occurred while creating the category"
            );
            console.log(err);
          },
        }
      );
    }
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setNewCategoryName("");
  };

  if (isLoading) {
    return (
      <div className="w-full p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-sidebar">Categories</h2>
        </div>
        <div className="space-y-10">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton
              key={i}
              className="h-12 bg-gray-200 animate-pulse rounded-lg"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Categories</h2>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-sidebar text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={16} />
          Add Category
        </button>
      </div>

      {/* Add New Category Form */}
      {isAdding && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Enter category name"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
              onKeyPress={(e) => e.key === "Enter" && handleAddNew()}
            />
            {isCreating ? (
              <p className="text-xs text-gray-400">Creating..</p>
            ) : (
              <>
                <button
                  onClick={handleAddNew}
                  className="p-2 text-green-600 hover:bg-green-100 rounded-md transition"
                  title="Save"
                >
                  <Check size={16} />
                </button>
                <button
                  onClick={handleCancelAdd}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-md transition"
                  title="Cancel"
                >
                  <X size={16} />
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Categories List */}
      <div className="space-y-2">
        {categories.map((category: Category) => (
          <div
            key={category.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
          >
            {editingId === category.id ? (
              // Edit Mode
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                  onKeyDown={(e) => e.key === "Enter" && handleSaveEdit()}
                />
                {isUpdating ? (
                  <p className="text-xs text-gray-400">Editing</p>
                ) : (
                  <>
                    <button
                      onClick={handleSaveEdit}
                      className="p-2 text-green-600 hover:bg-green-100 rounded-md transition"
                      title="Save"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-md transition"
                      title="Cancel"
                    >
                      <X size={16} />
                    </button>
                  </>
                )}
              </div>
            ) : (
              // View Mode
              <>
                <span className="font-medium text-gray-800">
                  {category.name}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleEdit(category)}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-md transition"
                    title="Edit"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-md transition"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {categories.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">
            <Plus size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            No categories yet
          </h3>
          <p className="text-gray-500 mb-4">
            Get started by creating your first category
          </p>
          <button
            onClick={() => setIsAdding(true)}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Add First Category
          </button>
        </div>
      )}

      <Modal
        ref={modalRef}
        title="Are you sure you want to delete this category"
        negativeText="Cancel"
        positiveText={isDeleting ? "Deleting" : "Yes"}
        onPositive={() => {
          deleteData(deletingId, {
            onSuccess: () => {
              Toast.success("Deleted", "Category deleted successfully");
              modalRef.current?.close();
            },
            onError: () => {
              Toast.error("Failed", "Category could not be deleted");
            },
          });
        }}
      />
    </div>
  );
};

export default Categories;
