'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2, Search, Map, Image } from 'lucide-react';
import { useAdminApi } from "@/lib/hooks/useAdminApi";

interface HazardMap {
  id: string;
  title: string;
  type: 'flood' | 'landslide' | 'earthquake' | 'storm_surge' | 'tsunami';
  file_url: string;
  thumbnail: string;
  description: string;
  is_active: boolean;
  created_at: string;
}


export default function HazardMapsPage() {
  const { data: maps, loading, error, refetch, create, update, remove } = useAdminApi<HazardMap>('/api/admin/hazard-maps');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<HazardMap | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    type: 'flood' as 'flood' | 'landslide' | 'earthquake' | 'storm_surge' | 'tsunami',
    file_url: '',
    thumbnail: '',
    description: '',
    is_active: true,
  });

  const filteredMaps = maps.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);
    
    try {
      const result = editingItem
        ? await update(editingItem.id, formData)
        : await create(formData);
      
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
      thumbnail: item.thumbnail,
      description: item.description,
      is_active: item.is_active,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this hazard map?')) {
      await remove(id);
      refetch();
    }
  };

  const toggleActive = async (id: string) => {
    const item = maps.find(m => m.id === id);
    if (item) {
      await update(id, { is_active: !item.is_active });
      refetch();
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
            setFormData({ title: '', type: 'flood', file_url: '', thumbnail: '', description: '', is_active: true });
          }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#002E5D] text-white rounded-lg hover:bg-[#001f45] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Hazard Map
        </button>
      </div>

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
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">File URL</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Status</th>
                <th className="text-right px-4 py-3 text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredMaps.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    No hazard maps found
                  </td>
                </tr>
              ) : (
                filteredMaps.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Image className="w-6 h-6 text-gray-400" />
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
                    <td className="px-4 py-4 text-sm text-gray-600">
                      <span className="truncate block max-w-[200px]">{item.file_url}</span>
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => toggleActive(item.id)}
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
                          item.is_active 
                            ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
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
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F58220]"
                  placeholder="Enter hazard map title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'flood' | 'landslide' | 'earthquake' | 'storm_surge' | 'tsunami' })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F58220]"
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
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F58220]"
                  rows={3}
                  placeholder="Brief description of the hazard map"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">File URL</label>
                <input
                  type="text"
                  required
                  value={formData.file_url}
                  onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F58220]"
                  placeholder="/hazard-maps/example.pdf"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail URL</label>
                <input
                  type="text"
                  value={formData.thumbnail}
                  onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F58220]"
                  placeholder="/hazard-maps/thumbnails/example.jpg"
                />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="is_active" className="text-sm text-gray-700">Active</label>
                </div>
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
                  disabled={formLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
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
