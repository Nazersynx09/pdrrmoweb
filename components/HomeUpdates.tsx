import { supabase } from "@/lib/supabaseClient";
import UpdatesSection from "@/components/UpdatesSection";

export default async function HomeUpdates() {
  const [issuancesResult, newsResult] = await Promise.all([
    supabase
      .from("issuances")
      .select("id, title, number, date_issued, file_url:File")
      .eq("is_active", true)
      .order("date_issued", { ascending: false }),
    supabase
      .from("news")
      .select("id, title, featured_image, excerpt, published_at")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  const issuances = (issuancesResult.data || []).map((issuance) => ({
    id: issuance.id,
    text: issuance.number
      ? `${issuance.title} — ${issuance.number}`
      : issuance.title,
    href: issuance.file_url,
    date: issuance.date_issued
      ? new Date(issuance.date_issued).toLocaleDateString("en-PH", {
          month: "short",
          year: "numeric",
          timeZone: "Asia/Manila",
        })
      : "Date not set",
  }));

  return (
    <UpdatesSection
      issuances={issuances}
      issuancesError={issuancesResult.error?.message || null}
      latestNews={newsResult.data}
      newsError={newsResult.error?.message || null}
    />
  );
}
