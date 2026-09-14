'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, GripVertical, Image as ImageIcon } from 'lucide-react';
import ImageUpload from '@/components/ImageUpload';

interface CarouselSlide {
  id: string;
  title: string;
  type: string;
  image: string;
  description: string;
  cta: string;
  cta_link: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export default function CarouselPage() {
  const [slides, setSlides] = useState<CarouselSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<CarouselSlide | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    type: '',
    image: '',
    description: '',
    cta: '',
    cta_link: '',
    display_order: 1,
    is_active: true,
  });

  const fetchSlides = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/carousel');
      const data = await res.json();
      if (data.success) {
        setSlides(
          [...data.data].sort(
            (a: CarouselSlide, b: CarouselSlide) => a.display_order - b.display_order
          )
        );
      }
    } catch (error) {
      console.error('Failed to fetch carousel slides:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const resetForm = () => {
    setFormData({
      title: '',
      type: '',
      image: '',
      description: '',
      cta: '',
      cta_link: '',
      display_order: slides.length + 1,
      is_active: true,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await fetch('/api/admin/carousel', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingItem.id, ...formData }),
        });
      } else {
        await fetch('/api/admin/carousel', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      }
      await fetchSlides();
      setShowForm(false);
      setEditingItem(null);
      resetForm();
    } catch (error) {
      console.error('Failed to save slide:', error);
      alert('Failed to save slide');
    }
  };

  const handleEdit = (item: CarouselSlide) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      type: item.type,
      image: item.image,
      description: item.description,
      cta: item.cta,
      cta_link: item.cta_link,
      display_order: item.display_order,
      is_active: item.is_active,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this slide?')) return;
    try {
      await fetch(`/api/admin/carousel?id=${id}`, { method: 'DELETE' });
      await fetchSlides();
    } catch (error) {
      console.error('Failed to delete slide:', error);
    }
  };

  const toggleActive = async (item: CarouselSlide) => {
    try {
      await fetch('/api/admin/carousel', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id, is_active: !item.is_active }),
      });
      await fetchSlides();
    } catch (error) {
      console.error('Failed to toggle slide:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Homepage Carousel</h1>
          <p className="text-gray-600">Manage the banner slides shown on the homepage</p>
        </div>
        <button
          onClick={() => {
            setEditingItem(null);
            resetForm();
            setShowForm(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#002E5D] text-white rounded-lg hover:bg-[#001f45] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Slide
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading slides...</div>
        ) : slides.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No slides yet</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {slides.map((slide) => (
              <div key={slide.id} className="flex items-center gap-4 p-4 hover:bg-gray-50">
                <GripVertical className="w-4 h-4 text-gray-300 shrink-0" />
                <div className="w-20 h-14 bg-gray-100 rounded-lg overflow-hidden shrink-0 relative">
                  {slide.image ? (
                    <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-5 h-5 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{slide.title}</p>
                  <p className="text-sm text-gray-500 truncate">{slide.type} · order {slide.display_order}</p>
                </div>
                <button
                  onClick={() => toggleActive(slide)}
                  className={`px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors shrink-0 ${
                    slide.is_active
                      ? 'bg-green-100 text-green-800 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {slide.is_active ? 'Active' : 'Inactive'}
                </button>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleEdit(slide)}
                    className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(slide.id)}
                    className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 flex items-center justify-between p-4 border-b border-gray-200 bg-white rounded-t-xl">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingItem ? 'Edit Slide' : 'Add Slide'}
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
                  placeholder="EARTHQUAKE PREPAREDNESS"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Badge Label</label>
                <input
                  type="text"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F58220]"
                  placeholder="Safety Guide"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Background Image</label>
                <ImageUpload
                  value={formData.image}
                  onChange={(url) => setFormData({ ...formData, image: url })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F58220]"
                  rows={2}
                  placeholder="Learn essential earthquake safety tips..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
                  <input
                    type="text"
                    value={formData.cta}
                    onChange={(e) => setFormData({ ...formData, cta: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F58220]"
                    placeholder="Download Guide"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Button Link</label>
                  <input
                    type="text"
                    value={formData.cta_link}
                    onChange={(e) => setFormData({ ...formData, cta_link: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F58220]"
                    placeholder="/resources"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                  <input
                    type="number"
                    min={1}
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F58220]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <div className="flex items-center gap-2 h-10">
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