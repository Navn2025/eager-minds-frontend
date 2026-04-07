import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import Hero from "../components/home/Hero";
import FeaturesGrid from "../components/home/FeaturesGrid";
import SubjectsGrid from "../components/home/SubjectsGrid";
import WordOfDay from "../components/home/WordOfDay";
import ChallengesList from "../components/home/ChallengesList";
import BlogGrid from "../components/home/BlogGrid";
import Testimonials from "../components/home/Testimonials";
import BrandLoader from "../components/ui/BrandLoader";

type HomeData = {
  subjects: any[];
  wordOfDay: any;
  challenges: any[];
  blogPosts: any[];
  testimonials: any[];
};

const EMPTY_HOME_DATA: HomeData = {
  subjects: [],
  wordOfDay: null,
  challenges: [],
  blogPosts: [],
  testimonials: [],
};

let cachedHomeData: HomeData | null = null;
let pendingHomeDataRequest: Promise<HomeData> | null = null;

async function fetchHomeData(): Promise<HomeData> {
  if (cachedHomeData) return cachedHomeData;
  if (pendingHomeDataRequest) return pendingHomeDataRequest;

  pendingHomeDataRequest = Promise.all([
    api.get("/prep/subjects"),
    api.get("/prep/word-of-the-day"),
    api.get("/competitions"),
    api.get("/blog"),
    api.get("/testimonials"),
  ])
    .then(([subjectsRes, wordRes, challengesRes, blogRes, testimonialsRes]) => {
      const nextData: HomeData = {
        subjects: subjectsRes.data,
        wordOfDay: wordRes.data,
        challenges: challengesRes.data,
        blogPosts: blogRes.data.posts,
        testimonials: testimonialsRes.data,
      };

      cachedHomeData = nextData;
      return nextData;
    })
    .finally(() => {
      pendingHomeDataRequest = null;
    });

  return pendingHomeDataRequest;
}

export default function PremiumHome() {
  const [data, setData] = useState<HomeData>(cachedHomeData || EMPTY_HOME_DATA);
  const [loading, setLoading] = useState(!cachedHomeData);

  useEffect(() => {
    let isMounted = true;
    const shouldShowLoader = !cachedHomeData;

    const loadData = async () => {
      try {
        const nextData = await fetchHomeData();
        if (isMounted) {
          setData(nextData);
        }
      } catch (error) {
        console.error("Error fetching landing page data:", error);
      } finally {
        if (isMounted && shouldShowLoader) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const heroConfig = {
    headline: "Where Creativity Meets Curiosity",
    subheading:
      "A creative learning club designed to inspire curiosity, creativity, and confidence in children through arts, science projects, Coding and skill-based activities.",
    primaryCTA: { text: "Join the Club", link: "/login" },
    secondaryCTA: { text: "Learn More", link: "/about" },
  };

  const features = [
    {
      icon: "Shield",
      title: "Secure Platform",
      description:
        "Our platform is built with the latest security standards to ensure your data is safe.",
    },
    {
      icon: "Zap",
      title: "Interactive Learning",
      description:
        "Engage with dynamic content that makes learning fun and effective.",
    },
    {
      icon: "Target",
      title: "Free Sheets",
      description:
        "Open-access worksheets and answer sheets for daily structured practice.",
    },
    {
      icon: "Users",
      title: "Expert Community",
      description:
        "Learn from the best educators and join a thriving student community.",
    },
    {
      icon: "Layers",
      title: "Deep Insights",
      description:
        "Track your progress with detailed analytics and performance reports.",
    },
    {
      icon: "Cpu",
      title: "AI-Powered",
      description:
        "Personalized learning paths driven by advanced AI technology.",
    },
  ];

  if (loading) {
    return <BrandLoader />;
  }

  return (
    <main className="flex flex-col bg-background">
      <Hero {...heroConfig} />

      <section className="page-container">
        <h2 className="section-title">Elevate Your Potential</h2>
        <FeaturesGrid features={features} />
      </section>

      <section className="page-container">
        <h2 className="section-title">Core Disciplines</h2>
        <SubjectsGrid
          subjects={data.subjects.map((s) => ({
            icon: "Book",
            title: s.name,
            shortDescription: `${s._count?.topics || 0} Topics • ${s._count?.worksheets || 0} Worksheets`,
            slug: s.slug || s.name.toLowerCase().replace(/\s+/g, "-"),
          }))}
        />
      </section>

      <section className="page-container">
        <h2 className="section-title">Term Break Focus</h2>
        <div className="rounded-[2.2rem] border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.01] p-8 md:p-10">
          <p className="text-white/70 text-lg max-w-3xl leading-relaxed mb-6">
            We are currently focused on Arts & Craft and workshop-based holiday
            learning. Use Free Sheets and Word of the Day for daily home
            practice while 11+ pathways are expanded next year.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/arts-craft"
              className="inline-flex h-12 px-6 items-center justify-center rounded-xl bg-gradient-to-r from-pink-500 to-violet-600 text-white font-bold"
            >
              Explore Arts & Craft
            </Link>
            <Link
              to="/workshops"
              className="inline-flex h-12 px-6 items-center justify-center rounded-xl border border-white/15 text-white/90 font-bold hover:bg-white/[0.04] transition-colors"
            >
              View Workshops
            </Link>
            <Link
              to="/11-plus-prep"
              className="inline-flex h-12 px-6 items-center justify-center rounded-xl border border-white/15 text-white/90 font-bold hover:bg-white/[0.04] transition-colors"
            >
              Open Free Sheets
            </Link>
            <Link
              to="/word-of-the-day"
              className="inline-flex h-12 px-6 items-center justify-center rounded-xl border border-white/15 text-white/90 font-bold hover:bg-white/[0.04] transition-colors"
            >
              Word of the Day
            </Link>
          </div>
        </div>
      </section>

      {data.wordOfDay && (
        <WordOfDay
          word={data.wordOfDay.word}
          pronunciation={data.wordOfDay.pronunciation}
          partOfSpeech="Vocabulary"
          definition={data.wordOfDay.meaning}
          examples={[data.wordOfDay.exampleSentence]}
        />
      )}

      <section className="page-container">
        <h2 className="section-title">Upcoming Challenges</h2>
        <ChallengesList
          challenges={data.challenges.slice(0, 3).map((c) => ({
            image:
              c.image ||
              "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
            title: c.title,
            description: c.description,
            registrationLink: c.registrationLink || "/competitions",
          }))}
        />
      </section>

      <section className="page-container">
        <h2 className="section-title">Educational Insights</h2>
        <BlogGrid
          posts={data.blogPosts.slice(0, 3).map((p) => ({
            image:
              p.image ||
              "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=2070&auto=format&fit=crop",
            category: "Insight",
            title: p.title,
            slug: p.slug,
          }))}
        />
      </section>

      <Testimonials
        testimonials={data.testimonials.map((t) => ({
          rating: t.rating || 5,
          quote: t.content,
          author: t.parentName,
          role: "Parent",
        }))}
      />
    </main>
  );
}
