'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2, Search, Map, Image as ImageIcon } from 'lucide-react';
import { useAdminApi } from "@/lib/hooks/useAdminApi";
import { uploadFile } from "@/lib/uploadFile";

interface HazardMap {
  id: string;
  title: string;
  type: 'flood' | 'landslide' | 'earthquake' | 'storm_surge' | 'tsunami';
  file_url: string;
  description: string;
  created_at: string;
  is_active: boolean;
}

export default function HazardMapsPage() {
  const { data: maps, loading, error, refetch, create, update, remove } = useAdminApi<HazardMap>('/api/admin/hazard-maps');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<HazardMap | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [formLoading, setFormLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    type: 'flood' as 'flood' | 'landslide' | 'earthquake' | 'storm_surge' | 'tsunami',
    file_url: '',
    description: '',
  });

  const filteredMaps = maps.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const acceptedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!acceptedTypes.includes(file.type)) {
      setFormError('Upload a JPG, PNG, GIF, or WebP image.');
      event.target.value = '';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setFormError('Map images must be 5 MB or smaller.');
      event.target.value = '';
      return;
    }

    setUploadingImage(true);
    setFormError(null);
    try {
      const url = await uploadFile(file, 'news-images');
      if (!url) {
        setFormError('Image upload failed. Please try again.');
        return;
      }
      setFormData((current) => ({ ...current, file_url: url }));
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : 'Image upload failed. Please try again.',
      );
    } finally {
      setUploadingImage(false);
      event.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);
    
    try {
      if (!formData.file_url.trim()) {
        setFormError('A map image URL or public path is required.');
        return;
      }

      const payload = { ...formData, file_url: formData.file_url.trim() };
      const result = editingItem
        ? await update(editingItem.id, payload)
        : await create(payload);
      
      if (result.success) {
        setShowForm(false);
        setEditingItem(null);
        refetch();
      } else {
        setFormError(result.error || 'Failed to save hazard map');
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (item: HazardMap) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      type: item.type,
      file_url: item.file_url,
      description: item.description,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this hazard map?')) {
      try {
        const result = await remove(id);
        if (!result.success) {
          setFormError(result.error || 'Failed to delete hazard map.');
        }
      } catch (error) {
        setFormError(
          error instanceof Error ? error.message : 'Failed to delete hazard map.',
        );
      }
    }
  };

  const toggleActive = async (item: HazardMap) => {
    try {
      const result = await update(item.id, { is_active: !item.is_active });
      if (!result.success) {
        setFormError(result.error || 'Failed to update hazard map status.');
      }
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : 'Failed to update hazard map status.',
      );
    }
  };

  const getTypeBadge = (type: string) => {
    const styles = {
      flood: 'bg-blue-100 text-blue-800',
      landslide: 'bg-green-100 text-green-800',
      earthquake: 'bg-red-100 text-red-800',
      storm_surge: 'bg-purple-100 text-purple-800',
      tsunami: 'bg-amber-100 text-amber-800',
    };
    const labels = {
      flood: 'Flood',
      landslide: 'Landslide',
      earthquake: 'Earthquake',
      storm_surge: 'Storm Surge',
      tsunami: 'Tsunami',
    };
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[type as keyof typeof styles]}`}>
        {labels[type as keyof typeof labels]}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hazard Maps</h1>
          <p className="text-gray-600">Manage hazard maps and geospatial data</p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingItem(null);
            setFormData({
              title: '',
              type: 'flood',
              file_url: '',
              description: '',
            });
            setFormError(null);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#002E5D] text-white rounded-lg hover:bg-[#001f45] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Hazard Map
        </button>
      </div>

      {error && (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}
      {formError && !showForm && (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {formError}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search hazard maps..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <Map className="w-4 h-4 text-gray-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="flood">Flood</option>
              <option value="landslide">Landslide</option>
              <option value="earthquake">Earthquake</option>
              <option value="storm_surge">Storm Surge</option>
              <option value="tsunami">Tsunami</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Title</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Type</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Status</th>
                <th className="text-right px-4 py-3 text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                    Loading hazard maps...
                  </td>
                </tr>
              ) : filteredMaps.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                    No hazard maps found
                  </td>
                </tr>
              ) : (
                filteredMaps.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <ImageIcon className="w-6 h-6 text-gray-400" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{item.title}</p>
                          <p className="text-sm text-gray-500">{item.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {getTypeBadge(item.type)}
                    </td>
                    <td className="px-4 py-4">
                      <button
                        type="button"
                        onClick={() => toggleActive(item)}
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          item.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {item.is_active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 flex items-center justify-between p-4 border-b border-gray-200 bg-white rounded-t-xl">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingItem ? 'Edit Hazard Map' : 'Add Hazard Map'}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingItem(null);
                }}
                disabled={formLoading || uploadingImage}
                className="p-1 hover:bg-gray-100 rounded-lg text-2xl"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F58220] text-black"
                  placeholder="Enter hazard map title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'flood' | 'landslide' | 'earthquake' | 'storm_surge' | 'tsunami' })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F58220] text-black"
                >
                  <option value="flood">Flood</option>
                  <option value="landslide">Landslide</option>
                  <option value="earthquake">Earthquake</option>
                  <option value="storm_surge">Storm Surge</option>
                  <option value="tsunami">Tsunami</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F58220] text-black"
                  rows={3}
                  placeholder="Brief description of the hazard map"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Map image
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  disabled={uploadingImage || formLoading}
                  onChange={handleImageUpload}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 file:mr-3 file:rounded-md file:border-0 file:bg-blue-50 file:px-3 file:py-1.5 file:font-medium file:text-[#002E5D] hover:file:bg-blue-100 disabled:opacity-50"
                />
                <p className="mt-1 text-xs text-gray-500">
                  {uploadingImage
                    ? 'Uploading image...'
                    : 'Upload a JPG, PNG, GIF, or WebP image up to 5 MB, or enter a public image URL/path below.'}
                </p>
                {formData.file_url && (
                  <a
                    href={formData.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-sm text-blue-700 hover:underline"
                  >
                    View current map image
                  </a>
                )}
                <label
                  htmlFor="hazard-map-image-url"
                  className="mt-3 block text-sm font-medium text-gray-700"
                >
                  Or enter an image URL or public path
                </label>
                <input
                  id="hazard-map-image-url"
                  type="text"
                  required
                  value={formData.file_url}
                  onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
                  placeholder="https://... or /hazard-map.png"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-[#F58220]"
                />
              </div>


                {formError && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm mb-4">
                  {formError}
                </div>
              )}
                <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingItem(null);
                    setFormError(null);
                  }}
                  className="px-4 py-2 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                  disabled={formLoading || uploadingImage}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading || uploadingImage}
                  className="px-4 py-2 bg-[#002E5D] text-white rounded-lg hover:bg-[#001f45] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {formLoading ? (editingItem ? 'Updating...' : 'Creating...') : (editingItem ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
