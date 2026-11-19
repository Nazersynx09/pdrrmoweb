import Carousel, { type CarouselSlide } from "@/components/Carousel";
import { supabase } from "@/lib/supabaseClient";

export default async function HomeCarousel() {
  const { data, error } = await supabase
    .from("carousel_slides")
    .select("title, type, image, description, cta, cta_link")
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Failed to fetch homepage carousel slides:", error);
    return <Carousel />;
  }

  const slides: CarouselSlide[] = (data || []).map((slide) => ({
    title: slide.title,
    type: slide.type,
    image: slide.image,
    description: slide.description,
    cta: slide.cta,
    ctaLink: slide.cta_link || "/",
  }));

  return <Carousel initialSlides={slides} />;
}
