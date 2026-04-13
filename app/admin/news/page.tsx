'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2, Eye, Search, Filter, ArrowUpDown } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  slug: string;
  content: string;
  featured_image: string;
  excerpt: string;
  status: 'draft' | 'published' | 'archived';
  author_id: string;
  published_at: string;
  created_at: string;
}

const initialNews: NewsItem[] = [
  {
    id: '1',
    title: 'GAD Meeting on Strengthening Protection for Women and Children',
    slug: 'gad-meeting-strengthening-protection-women-children',
    content: 'The Gender and Development (GAD) Meeting focused on strengthening protection measures for women and children in disaster-prone areas.',
    featured_image: '/gadMeeting.jpg',
    excerpt: 'Key stakeholders gathered to discuss protection measures.',
    status: 'published',
    author_id: 'admin',
    published_at: '2026-04-10T10:00:00Z',
    created_at: '2026-04-10T10:00:00Z',
  },
  {
    id: '2',
    title: 'PDRRMO Conducts Emergency Response Training',
    slug: 'pdrrmo-conduct-emergency-response-training',
    content: 'A comprehensive emergency response training was conducted for all PDRRMO personnel.',
    featured_image: '/training.jpg',
    excerpt: 'Personnel undergo intensive emergency response training.',
    status: 'draft',
    author_id: 'admin',
    published_at: '',
    created_at: '2026-04-12T14:30:00Z',
  },
  {
    id: '3',
    title: 'Flood Preparedness Seminar for Baranggay Officials',
    slug: 'flood-preparedness-seminar-baranggay-officials',
    content: 'Seminar focused on flood preparedness and evacuation protocols for baranggay officials.',
    featured_image: '/seminar.jpg',
    excerpt: 'Baranggay officials learn flood preparedness strategies.',
    status: 'published',
    author_id: 'admin',
    published_at: '2026-04-08T09:00:00Z',
    created_at: '2026-04-08T09:00:00Z',
  },
];

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>(initialNews);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<NewsItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    featured_image: '',
    status: 'draft' as 'draft' | 'published' | 'archived',
  });

  const filteredNews = news.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingItem) {
      setNews(news.map(item => 
        item.id === editingItem.id 
          ? { ...item, ...formData, updated_at: new Date().toISOString() }
          : item
      ));
    } else {
      const newItem: NewsItem = {
        id: Date.now().toString(),
        ...formData,
        slug: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
        author_id: 'admin',
        published_at: formData.status === 'published' ? new Date().toISOString() : '',
        created_at: new Date().toISOString(),
      };
      setNews([newItem, ...news]);
    }
    
    setShowForm(false);
    setEditingItem(null);
    setFormData({ title: '', content: '', excerpt: '', featured_image: '', status: 'draft' });
  };

  const handleEdit = (item: NewsItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      content: item.content,
      excerpt: item.excerpt,
      featured_image: item.featured_image,
      status: item.status,
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this news item?')) {
      setNews(news.filter(item => item.id !== id));
    }
  };

  const handlePublish = (id: string) => {
    setNews(news.map(item => 
      item.id === id 
        ? { ...item, status: 'published' as const, published_at: new Date().toISOString() }
        : item
    ));
  };

  const handleArchive = (id: string) => {
    setNews(news.map(item => 
      item.id === id 
        ? { ...item, status: 'archived' as const }
        : item
    ));
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      published: 'bg-green-100 text-green-800',
      draft: 'bg-yellow-100 text-yellow-800',
      archived: 'bg-gray-100 text-gray-800',
    };
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">News & Updates</h1>
          <p className="text-gray-600">Manage news articles and updates</p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingItem(null);
            setFormData({ title: '', content: '', excerpt: '', featured_image: '', status: 'draft' });
          }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#002E5D] text-white rounded-lg hover:bg-[#001f45] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add News
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search news..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">
                  <button className="inline-flex items-center gap-1">
                    Title <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Excerpt</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Status</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Date</th>
                <th className="text-right px-4 py-3 text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredNews.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    No news items found
                  </td>
                </tr>
              ) : (
                filteredNews.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{item.title}</p>
                        <p className="text-sm text-gray-500">{item.slug}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600 max-w-xs truncate">
                      {item.excerpt}
                    </td>
                    <td className="px-4 py-4">
                      {getStatusBadge(item.status)}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      {item.published_at ? new Date(item.published_at).toLocaleDateString() : '—'}
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
                        {item.status !== 'published' && (
                          <button
                            onClick={() => handlePublish(item.id)}
                            className="p-1.5 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Publish"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                        {item.status !== 'archived' && (
                          <button
                            onClick={() => handleArchive(item.id)}
                            className="p-1.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Archive"
                          >
                            <ArrowUpDown className="w-4 h-4" />
                          </button>
                        )}
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
                {editingItem ? 'Edit News' : 'Add News'}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingItem(null);
                }}
                className="p-1 hover:bg-gray-100 rounded-lg"
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
                  placeholder="Enter news title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F58220]"
                  rows={2}
                  placeholder="Brief summary of the news"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F58220]"
                  rows={6}
                  placeholder="Full news content"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Featured Image URL</label>
                <input
                  type="text"
                  value={formData.featured_image}
                  onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F58220]"
                  placeholder="/images/news/example.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'draft' | 'published' | 'archived' })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F58220]"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
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
