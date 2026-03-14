import { useEffect, useState } from "react";
import api from "../services/api";
import Hero from "../components/home/Hero";
import FeaturesGrid from "../components/home/FeaturesGrid";
import SubjectsGrid from "../components/home/SubjectsGrid";
import WordOfDay from "../components/home/WordOfDay";
import ChallengesList from "../components/home/ChallengesList";
import BlogGrid from "../components/home/BlogGrid";
import Testimonials from "../components/home/Testimonials";

export default function PremiumHome() {
  const [data, setData] = useState<{
    subjects: any[];
    wordOfDay: any;
    challenges: any[];
    blogPosts: any[];
    testimonials: any[];
  }>({
    subjects: [],
    wordOfDay: null,
    challenges: [],
    blogPosts: [],
    testimonials: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subjectsRes, wordRes, challengesRes, blogRes, testimonialsRes] =
          await Promise.all([
            api.get("/prep/subjects"),
            api.get("/prep/word-of-the-day"),
            api.get("/competitions"),
            api.get("/blog"),
            api.get("/testimonials"),
          ]);

        setData({
          subjects: subjectsRes.data,
          wordOfDay: wordRes.data,
          challenges: challengesRes.data,
          blogPosts: blogRes.data.posts,
          testimonials: testimonialsRes.data,
        });
      } catch (error) {
        console.error("Error fetching landing page data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const heroConfig = {
    headline: "Where Creativity Meets Curiosity",
    subheading:
      "Expert preparation for the next generation of innovators. Master the 11+ with futuristic learning strategies.",
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
      title: "Focused Prep",
      description: "Specific 11+ preparation modules designed for success.",
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
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
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
