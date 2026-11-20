import type { Metadata } from 'next';
import { connection } from 'next/server';
import Footer from '@/components/Footer';
import VideoPlayer from '@/components/VideoPlayer';
import { supabaseAdmin } from '@/lib/supabaseAdminClient';
import { getVideoEmbed } from '@/lib/videoEmbed';

interface PdrmoVideo {
  id: string;
  title: string;
  video_url: string;
  description: string;
}

export const metadata: Metadata = {
  title: 'Videos | PDRRMO Iloilo',
};

export default async function VideosPage() {
  await connection();

  const { data, error } = await supabaseAdmin
    .from('pdrmo_videos')
    .select('id, title, video_url, description')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Public video list query failed:', error.message);
  }

  const videos = (data ?? []) as PdrmoVideo[];

  return (
    <>
      <section className="bg-[#002E5D] px-4 py-14 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#F58220]">
            PDRRMO Iloilo
          </p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Videos</h1>
          <p className="mt-3 max-w-2xl text-white/80">
            Watch PDRRMO activities, preparedness information, and community updates.
          </p>
        </div>
      </section>

      <section className="mx-auto min-h-[40vh] w-full max-w-7xl px-4 py-10">
        {error ? (
          <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
            Videos are temporarily unavailable. Please try again later.
          </p>
        ) : videos.length === 0 ? (
          <p className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-600">
            No videos are available right now.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((video) => {
              const embed = getVideoEmbed(video.video_url);

              return (
                <article key={video.id} className="rounded-xl border border-gray-200 bg-white shadow-sm">
                  {embed ? (
                    <VideoPlayer title={video.title} embedUrl={embed.url} />
                  ) : (
                    <div role="alert" className="flex aspect-video items-center justify-center bg-gray-100 p-4 text-center text-sm text-gray-600">
                      This video link is invalid.
                    </div>
                  )}
                  <div className="p-5">
                    <h2 className="text-lg font-semibold text-gray-900">{video.title}</h2>
                    {video.description && (
                      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-600">
                        {video.description}
                      </p>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
      <Footer />
    </>
  );
}
