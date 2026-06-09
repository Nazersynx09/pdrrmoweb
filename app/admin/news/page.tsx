"use client";

import { useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  Search,
  Filter,
  ArrowUpDown,
} from "lucide-react";
import ContentEditor, { ContentBlock } from "@/components/admin/ContentEditor";
import ImageUpload from "@/components/ImageUpload";
import { useAdminApi } from "@/lib/hooks/useAdminApi";

interface NewsItem {
  id: string;
  title: string;
  slug: string;
  content: string;
  featured_image: string;
  excerpt: string;
  status: "draft" | "published" | "archived";
  author_id: string;
  published_at: string;
  created_at: string;
}

export default function NewsPage() {
  const { data: news, loading, error, refetch, create, update, remove } = useAdminApi<NewsItem>('/api/admin/news');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<NewsItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "", content: "", excerpt: "",
    featured_image: "", status: "draft" as "draft" | "published" | "archived",
  });
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);

  const filteredNews = news.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
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
        resetForm();
        refetch();
      } else {
        setFormError(result.error || 'Failed to save news item');
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setFormLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ title: "", content: "", excerpt: "", featured_image: "", status: "draft" });
    setContentBlocks([]);
  };

  const handleEdit = (item: NewsItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title, content: item.content,
      excerpt: item.excerpt, featured_image: item.featured_image,
      status: item.status,
    });
    setContentBlocks(parseContentToBlocks(item.content));
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this news item?")) await remove(id);
  };

  const handlePublish = async (id: string) => {
    await update(id, { status: "published", published_at: new Date().toISOString() });
  };

  const handleArchive = async (id: string) => {
    await update(id, { status: "archived" });
  };

  const parseContentToBlocks = (content: string): ContentBlock[] => {
    if (!content) return [{ id: "1", type: "paragraph", content: "" }];
    return content.split("\n\n").map((part, index) => {
      if (part.startsWith("## ")) return { id: String(index), type: "heading" as const, content: part.replace("## ", "") };
      if (part.startsWith("> ")) return { id: String(index), type: "quote" as const, content: part.replace("> ", "") };
      if (part.startsWith("- ")) return { id: String(index), type: "bullet" as const, content: part.replace("- ", "") };
      return { id: String(index), type: "paragraph" as const, content: part };
    }).filter(b => b.content);
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      published: "bg-green-100 text-green-800",
      draft: "bg-yellow-100 text-yellow-800",
      archived: "bg-gray-100 text-gray-800",
    };
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#002E5D]" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">News & Updates</h1>
          <p className="text-gray-600">Manage news articles and updates</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditingItem(null); resetForm(); }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#002E5D] text-white rounded-lg hover:bg-[#001f45] transition-colors"
        >
          <Plus className="w-4 h-4" /> Add News
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text" placeholder="Search news..." value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
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
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Title</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Excerpt</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Status</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Date</th>
                <th className="text-right px-4 py-3 text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredNews.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-500">No news items found</td></tr>
              ) : (
                filteredNews.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <p className="font-medium text-gray-900">{item.title}</p>
                      <p className="text-sm text-gray-500">{item.slug}</p>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600 max-w-xs truncate">{item.excerpt}</td>
                    <td className="px-4 py-4">{getStatusBadge(item.status)}</td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      {item.published_at ? new Date(item.published_at).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleEdit(item)}
                          className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Pencil className="w-4 h-4" />
                        </button>
                        {item.status !== "published" && (
                          <button onClick={() => handlePublish(item.id)}
                            className="p-1.5 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                        {item.status !== "archived" && (
                          <button onClick={() => handleArchive(item.id)}
                            className="p-1.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                            <ArrowUpDown className="w-4 h-4" />
                          </button>
                        )}
                        <button onClick={() => handleDelete(item.id)}
                          className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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
          <div className="bg-white rounded-xl shadow-xl w-full max-w-6xl max-h-[95vh] overflow-y-auto">
            <div className="sticky top-0 flex items-center justify-between p-4 border-b border-gray-200 bg-white rounded-t-xl">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingItem ? "Edit News" : "Add News"}
              </h2>
              <button onClick={() => { setShowForm(false); setEditingItem(null); }}
                className="p-1 hover:bg-gray-100 rounded-lg text-2xl">×</button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-1">Title</label>
                <input type="text" required value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F58220] text-gray-900"
                  placeholder="Enter news title" />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">Excerpt</label>
                <textarea value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F58220] text-gray-900"
                  rows={2} placeholder="Brief summary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">Content</label>
                <ContentEditor
                  initialBlocks={contentBlocks}
                  onChange={(blocks) => {
                    setContentBlocks(blocks);
                    setFormData(prev => ({
                      ...prev,
                      content: blocks.map((b) => {
                        if (b.type === "paragraph") return b.content;
                        if (b.type === "heading") return `## ${b.content}`;
                        if (b.type === "image") return `![${b.imageCaption || ""}](${b.imageUrl})`;
                        if (b.type === "quote") return `> ${b.content}`;
                        if (b.type === "bullet") return `- ${b.content}`;
                        if (b.type === "numbered") return `1. ${b.content}`;
                        return b.content;
                      }).join("\n\n"),
                    }));
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">Featured Image</label>
                <ImageUpload value={formData.featured_image}
                  onChange={(url) => setFormData({ ...formData, featured_image: url })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">Status</label>
                <select value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as "draft" | "published" | "archived" })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F58220]">
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              {formError && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm mb-4">
                  {formError}
                </div>
              )}
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => { setShowForm(false); setEditingItem(null); setFormError(null); }}
                  className="px-4 py-2 text-black border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                  disabled={formLoading}>
                  Cancel
                </button>
                <button type="submit"
                  disabled={formLoading}
                  className="px-4 py-2 bg-[#002E5D] text-white rounded-lg hover:bg-[#001f45] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  {formLoading ? (editingItem ? "Updating..." : "Creating...") : (editingItem ? "Update" : "Create")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
