'use client';

import { useState } from 'react';
import { ExternalLink, Eye, EyeOff, Pencil, Plus, Trash2, Video } from 'lucide-react';
import { useAdminApi } from '@/lib/hooks/useAdminApi';
import { getVideoEmbed } from '@/lib/videoEmbed';

interface PdrmoVideo {
  id: string;
  title: string;
  video_url: string;
  description: string;
  is_active: boolean;
  created_at: string;
}

interface VideoFormData {
  title: string;
  video_url: string;
  description: string;
  is_active: boolean;
}

const emptyForm: VideoFormData = {
  title: '',
  video_url: '',
  description: '',
  is_active: true,
};

export default function AdminVideosPage() {
  const { data: videos, loading, error, create, update, remove } =
    useAdminApi<PdrmoVideo>('/api/admin/videos');
  const [showForm, setShowForm] = useState(false);
  const [editingVideo, setEditingVideo] = useState<PdrmoVideo | null>(null);
  const [formData, setFormData] = useState<VideoFormData>(emptyForm);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [pageError, setPageError] = useState<string | null>(null);

  const openNewVideoForm = () => {
    setEditingVideo(null);
    setFormData({ ...emptyForm });
    setFormError(null);
    setShowForm(true);
  };

  const handleEdit = (video: PdrmoVideo) => {
    setEditingVideo(video);
    setFormData({
      title: video.title,
      video_url: video.video_url,
      description: video.description,
      is_active: video.is_active,
    });
    setFormError(null);
    setShowForm(true);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormLoading(true);
    setFormError(null);

    const videoUrl = getVideoEmbed(formData.video_url);
    if (!videoUrl) {
      setFormError('Enter a valid HTTPS YouTube or Google Drive video link.');
      setFormLoading(false);
      return;
    }

    try {
      const result = editingVideo
        ? await update(editingVideo.id, formData)
        : await create(formData);

      if (!result.success) {
        setFormError(result.error || 'Could not save the video.');
        return;
      }

      setShowForm(false);
      setEditingVideo(null);
      setFormData({ ...emptyForm });
    } catch (submitError) {
      setFormError(
        submitError instanceof Error ? submitError.message : 'Could not save the video.',
      );
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (video: PdrmoVideo) => {
    if (!confirm(`Delete "${video.title}"?`)) return;

    setPageError(null);
    try {
      const result = await remove(video.id);
      if (!result.success) setPageError(result.error || 'Could not delete the video.');
    } catch (deleteError) {
      setPageError(
        deleteError instanceof Error ? deleteError.message : 'Could not delete the video.',
      );
    }
  };

  const handleToggleActive = async (video: PdrmoVideo) => {
    setPageError(null);
    try {
      const result = await update(video.id, { is_active: !video.is_active });
      if (!result.success) setPageError(result.error || 'Could not update video status.');
    } catch (updateError) {
      setPageError(
        updateError instanceof Error ? updateError.message : 'Could not update video status.',
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Videos</h1>
          <p className="text-gray-600">Manage videos shown in the public video gallery.</p>
        </div>
        <button
          type="button"
          onClick={openNewVideoForm}
          className="inline-flex items-center gap-2 rounded-lg bg-[#002E5D] px-4 py-2 text-white hover:bg-[#001f45]"
        >
          <Plus className="h-4 w-4" />
          Add Video
        </button>
      </div>

      {(error || pageError) && (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {pageError || error}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        {loading ? (
          <p className="p-8 text-center text-gray-500">Loading videos...</p>
        ) : videos.length === 0 ? (
          <p className="p-8 text-center text-gray-500">No videos added yet.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {videos.map((video) => {
              const embed = getVideoEmbed(video.video_url);
              return (
                <li key={video.id} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                  <div className="flex h-12 w-20 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
                    <Video className="h-6 w-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="font-semibold text-gray-900">{video.title}</h2>
                    <p className="mt-1 truncate text-sm text-gray-500">{video.description || video.video_url}</p>
                    <p className="mt-1 text-xs font-medium uppercase text-gray-400">
                      {embed?.provider === 'google-drive' ? 'Google Drive' : 'YouTube'}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <a
                      href={video.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Open video source"
                      className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                    <button
                      type="button"
                      onClick={() => void handleToggleActive(video)}
                      title={video.is_active ? 'Hide from public gallery' : 'Show in public gallery'}
                      className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
                    >
                      {video.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEdit(video)}
                      title="Edit video"
                      className="rounded-lg p-2 text-gray-600 hover:bg-blue-50 hover:text-blue-700"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleDelete(video)}
                      title="Delete video"
                      className="rounded-lg p-2 text-gray-600 hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 p-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingVideo ? 'Edit Video' : 'Add Video'}
              </h2>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                disabled={formLoading}
                aria-label="Close form"
                className="rounded p-1 text-2xl text-gray-500 hover:bg-gray-100 disabled:opacity-50"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 p-5">
              <div>
                <label htmlFor="video-title" className="mb-1 block text-sm font-medium text-gray-700">
                  Video title
                </label>
                <input
                  id="video-title"
                  type="text"
                  required
                  maxLength={200}
                  value={formData.title}
                  onChange={(event) => setFormData({ ...formData, title: event.target.value })}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#F58220]"
                />
              </div>
              <div>
                <label htmlFor="video-url" className="mb-1 block text-sm font-medium text-gray-700">
                  YouTube or Google Drive link
                </label>
                <input
                  id="video-url"
                  type="url"
                  required
                  value={formData.video_url}
                  onChange={(event) => setFormData({ ...formData, video_url: event.target.value })}
                  placeholder="https://youtu.be/... or https://drive.google.com/file/d/..."
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#F58220]"
                />
                <p className="mt-2 text-xs leading-5 text-gray-500">
                  For Google Drive, set General access to “Anyone with the link” and Viewer. Drive videos may ask viewers to sign in if sharing is restricted.
                </p>
              </div>
              <div>
                <label htmlFor="video-description" className="mb-1 block text-sm font-medium text-gray-700">
                  Description (optional)
                </label>
                <textarea
                  id="video-description"
                  rows={3}
                  value={formData.description}
                  onChange={(event) => setFormData({ ...formData, description: event.target.value })}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#F58220]"
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(event) => setFormData({ ...formData, is_active: event.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                Show in public gallery
              </label>
              {formError && (
                <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                  {formError}
                </p>
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
                  {formLoading ? 'Saving...' : editingVideo ? 'Save Changes' : 'Add Video'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
