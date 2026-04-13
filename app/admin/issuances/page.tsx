'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2, Search, FileUp, ExternalLink } from 'lucide-react';

interface Issuance {
  id: string;
  title: string;
  type: 'executive_order' | 'memorandum' | 'resolution' | 'ordinance' | 'bulletin';
  number: string;
  date_issued: string;
  file_url: string;
  description: string;
  is_active: boolean;
  created_at: string;
}

const initialIssuances: Issuance[] = [
  {
    id: '1',
    title: 'Executive Order No. 2026-001: Declaration of Wet Season Preparedness',
    type: 'executive_order',
    number: '2026-001',
    date_issued: '2026-01-15',
    file_url: '/issuances/EO-2026-001.pdf',
    description: 'Declaration of wet season preparedness and emergency protocols for PDRRMO',
    is_active: true,
    created_at: '2026-01-15T10:00:00Z',
  },
  {
    id: '2',
    title: 'Memorandum No. 2026-012: Emergency Response Team Deployment',
    type: 'memorandum',
    number: '2026-012',
    date_issued: '2026-02-20',
    file_url: '/issuances/MEMO-2026-012.pdf',
    description: 'Deployment orders for emergency response teams during monsoon season',
    is_active: true,
    created_at: '2026-02-20T14:00:00Z',
  },
  {
    id: '3',
    title: 'Resolution No. 2026-008: Community Evacuation Plan Approval',
    type: 'resolution',
    number: '2026-008',
    date_issued: '2026-03-05',
    file_url: '/issuances/RES-2026-008.pdf',
    description: 'Approval of community evacuation plans for flood-prone areas',
    is_active: true,
    created_at: '2026-03-05T09:00:00Z',
  },
  {
    id: '4',
    title: 'Ordinance No. 2026-003: Disaster Risk Reduction Fund',
    type: 'ordinance',
    number: '2026-003',
    date_issued: '2026-01-30',
    file_url: '/issuances/ORD-2026-003.pdf',
    description: 'Establishment of disaster risk reduction fund for FY 2026',
    is_active: false,
    created_at: '2026-01-30T11:00:00Z',
  },
];

export default function IssuancesPage() {
  const [issuances, setIssuances] = useState<Issuance[]>(initialIssuances);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Issuance | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const [formData, setFormData] = useState({
    title: '',
    type: 'executive_order' as 'executive_order' | 'memorandum' | 'resolution' | 'ordinance' | 'bulletin',
    number: '',
    date_issued: '',
    file_url: '',
    description: '',
    is_active: true,
  });

  const filteredIssuances = issuances.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.number.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingItem) {
      setIssuances(issuances.map(item => 
        item.id === editingItem.id 
          ? { ...item, ...formData }
          : item
      ));
    } else {
      const newItem: Issuance = {
        id: Date.now().toString(),
        ...formData,
        created_at: new Date().toISOString(),
      };
      setIssuances([newItem, ...issuances]);
    }
    
    setShowForm(false);
    setEditingItem(null);
    setFormData({ title: '', type: 'executive_order', number: '', date_issued: '', file_url: '', description: '', is_active: true });
  };

  const handleEdit = (item: Issuance) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      type: item.type,
      number: item.number,
      date_issued: item.date_issued,
      file_url: item.file_url,
      description: item.description,
      is_active: item.is_active,
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this issuance?')) {
      setIssuances(issuances.filter(item => item.id !== id));
    }
  };

  const toggleActive = (id: string) => {
    setIssuances(issuances.map(item => 
      item.id === id 
        ? { ...item, is_active: !item.is_active }
        : item
    ));
  };

  const getTypeBadge = (type: string) => {
    const styles = {
      executive_order: 'bg-blue-100 text-blue-800',
      memorandum: 'bg-purple-100 text-purple-800',
      resolution: 'bg-green-100 text-green-800',
      ordinance: 'bg-amber-100 text-amber-800',
      bulletin: 'bg-gray-100 text-gray-800',
    };
    const labels = {
      executive_order: 'Executive Order',
      memorandum: 'Memorandum',
      resolution: 'Resolution',
      ordinance: 'Ordinance',
      bulletin: 'Bulletin',
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
          <h1 className="text-2xl font-bold text-gray-900">Issuances</h1>
          <p className="text-gray-600">Manage executive orders, memoranda, resolutions, and ordinances</p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingItem(null);
            setFormData({ title: '', type: 'executive_order', number: '', date_issued: '', file_url: '', description: '', is_active: true });
          }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#002E5D] text-white rounded-lg hover:bg-[#001f45] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Issuance
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search issuances..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <FileUp className="w-4 h-4 text-gray-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="executive_order">Executive Order</option>
              <option value="memorandum">Memorandum</option>
              <option value="resolution">Resolution</option>
              <option value="ordinance">Ordinance</option>
              <option value="bulletin">Bulletin</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Title</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Type</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Number</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Date</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Status</th>
                <th className="text-right px-4 py-3 text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredIssuances.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    No issuances found
                  </td>
                </tr>
              ) : (
                filteredIssuances.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{item.title}</p>
                        <p className="text-sm text-gray-500 truncate max-w-md">{item.description}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {getTypeBadge(item.type)}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600 font-mono">
                      {item.number}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      {new Date(item.date_issued).toLocaleDateString()}
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
                        <a
                          href={item.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
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
                {editingItem ? 'Edit Issuance' : 'Add Issuance'}
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
                  placeholder="Enter issuance title"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'executive_order' | 'memorandum' | 'resolution' | 'ordinance' | 'bulletin' })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F58220]"
                  >
                    <option value="executive_order">Executive Order</option>
                    <option value="memorandum">Memorandum</option>
                    <option value="resolution">Resolution</option>
                    <option value="ordinance">Ordinance</option>
                    <option value="bulletin">Bulletin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Number</label>
                  <input
                    type="text"
                    required
                    value={formData.number}
                    onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F58220]"
                    placeholder="e.g., 2026-001"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date Issued</label>
                <input
                  type="date"
                  required
                  value={formData.date_issued}
                  onChange={(e) => setFormData({ ...formData, date_issued: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F58220]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F58220]"
                  rows={3}
                  placeholder="Brief description of the issuance"
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
                  placeholder="/issuances/example.pdf"
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

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingItem(null);
                  }}
                  className="px-4 py-2 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#002E5D] text-white rounded-lg hover:bg-[#001f45] transition-colors"
                >
                  {editingItem ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
