"use client";

import { useState } from "react";
import { Award, FileText, Pencil, Plus, Trash2 } from "lucide-react";
import { useAdminApi } from "@/lib/hooks/useAdminApi";
import FileUpload from "@/components/FileUpload";

interface OfficeAward {
  id: string;
  year: number;
  category: string;
  name: string;
  region: string;
  class_rating: string;
  scan_url: string | null;
  is_active: boolean;
}

const emptyForm = {
  year: String(new Date().getFullYear()),
  category: "",
  name: "",
  region: "",
  class_rating: "",
  scan_url: "",
};

export default function AwardsAdminPage() {
  const {
    data: awards,
    loading,
    error,
    create,
    update,
    remove,
  } = useAdminApi<OfficeAward>("/api/admin/awards");
  const [showForm, setShowForm] = useState(false);
  const [editingAward, setEditingAward] = useState<OfficeAward | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const openNewForm = () => {
    setEditingAward(null);
    setFormData({ ...emptyForm });
    setFormError(null);
    setShowForm(true);
  };

  const openEditForm = (award: OfficeAward) => {
    setEditingAward(award);
    setFormData({
      year: String(award.year),
      category: award.category,
      name: award.name,
      region: award.region,
      class_rating: award.class_rating,
      scan_url: award.scan_url ?? "",
    });
    setFormError(null);
    setShowForm(true);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormLoading(true);
    setFormError(null);

    try {
      const payload = { ...formData, year: Number(formData.year) };
      const result = editingAward
        ? await update(editingAward.id, payload)
        : await create(payload);

      if (!result.success) {
        setFormError(result.error || "Failed to save award.");
        return;
      }

      setShowForm(false);
      setEditingAward(null);
      setFormData({ ...emptyForm });
    } catch (saveError) {
      setFormError(
        saveError instanceof Error ? saveError.message : "Failed to save award.",
      );
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this award record?")) return;
    const result = await remove(id);
    if (!result.success) {
      setFormError(result.error || "Failed to delete award.");
    }
  };

  const toggleActive = async (award: OfficeAward) => {
    const result = await update(award.id, { is_active: !award.is_active });
    if (!result.success) {
      setFormError(result.error || "Failed to update award status.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Awards and Recognitions
          </h1>
          <p className="text-gray-600">
            Manage awards and recognitions received by the office
          </p>
        </div>
        <button
          onClick={openNewForm}
          className="inline-flex items-center gap-2 rounded-lg bg-[#002E5D] px-4 py-2 text-white transition-colors hover:bg-[#001f45]"
        >
          <Plus className="h-4 w-4" />
          Add Award / Recognition
        </button>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {error}
        </div>
      )}
      {formError && !showForm && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {formError}
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-sm">
        <table className="w-full">
          <thead className="border-b border-gray-100 bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                Year
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                Award / Recognition
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                Category
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                Region
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                Scan
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                Status
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  Loading awards...
                </td>
              </tr>
            ) : awards.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  No award records found
                </td>
              </tr>
            ) : (
              awards.map((award) => (
                <tr key={award.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 text-sm text-gray-700">
                    {award.year}
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-medium text-gray-900">{award.name}</p>
                    <p className="text-sm text-gray-500">
                      {award.class_rating}
                    </p>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700">
                    {award.category}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700">
                    {award.region || "—"}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700">
                    {award.scan_url ? (
                      <a
                        href={award.scan_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[#002E5D] hover:underline"
                      >
                        <FileText className="h-4 w-4" />
                        View
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <button
                      onClick={() => toggleActive(award)}
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        award.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {award.is_active ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditForm(award)}
                        aria-label={`Edit ${award.name}`}
                        className="rounded-lg p-1.5 text-gray-600 transition-colors hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(award.id)}
                        aria-label={`Delete ${award.name}`}
                        className="rounded-lg p-1.5 text-gray-600 transition-colors hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 p-4">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <Award className="h-5 w-5 text-[#F58220]" />
                {editingAward
                  ? "Edit Award / Recognition"
                  : "Add Award / Recognition"}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                aria-label="Close form"
                className="rounded p-1 text-2xl text-gray-500 hover:bg-gray-100"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 p-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-medium text-gray-700">
                  Year
                  <input
                    type="number"
                    required
                    min={1900}
                    max={2200}
                    value={formData.year}
                    onChange={(event) =>
                      setFormData({ ...formData, year: event.target.value })
                    }
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900"
                  />
                </label>
                <label className="block text-sm font-medium text-gray-700">
                  Category
                  <input
                    type="text"
                    required
                    value={formData.category}
                    placeholder="e.g. National Award, Certification, Recognition"
                    onChange={(event) =>
                      setFormData({ ...formData, category: event.target.value })
                    }
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900"
                  />
                </label>
              </div>
              <label className="block text-sm font-medium text-gray-700">
                Award / recognition name
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(event) =>
                    setFormData({ ...formData, name: event.target.value })
                  }
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900"
                />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-medium text-gray-700">
                  Region
                  <input
                    type="text"
                    value={formData.region}
                    onChange={(event) =>
                      setFormData({ ...formData, region: event.target.value })
                    }
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900"
                  />
                </label>
                <label className="block text-sm font-medium text-gray-700">
                  Distinction / rating
                  <input
                    type="text"
                    value={formData.class_rating}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        class_rating: event.target.value,
                      })
                    }
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900"
                  />
                </label>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Scanned document (optional)
                </label>
                <p className="mb-2 text-xs text-gray-500">
                  Upload an image or PDF scan of the award or recognition.
                </p>
                <FileUpload
                  value={formData.scan_url}
                  onChange={(scan_url) => setFormData({ ...formData, scan_url })}
                  accept=".pdf,.jpg,.jpeg,.png"
                />
              </div>
              {formError && (
                <div
                  role="alert"
                  className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
                >
                  {formError}
                </div>
              )}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  disabled={formLoading}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="rounded-lg bg-[#002E5D] px-4 py-2 text-white hover:bg-[#001f45] disabled:opacity-50"
                >
                  {formLoading ? "Saving..." : "Save Award / Recognition"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
