import HeroSection from "../components/home/HeroSection";
import FeatureGrid from "../components/home/FeatureGrid";
import SubjectGrid from "../components/home/SubjectGrid";
import WordOfTheDay from "../components/home/WordOfTheDay";
import CompetitionsSection from "../components/home/CompetitionsSection";
import BlogSection from "../components/home/BlogSection";
import TestimonialSection from "../components/home/TestimonialSection";

export default function Home() {
  return (
    <main className="flex flex-col">
      <div id="home">
        <HeroSection />
      </div>
      <div id="features">
        <FeatureGrid />
      </div>
      <div id="subjects">
        <SubjectGrid />
      </div>
      <WordOfTheDay />
      <div id="competitions">
        <CompetitionsSection />
      </div>
      <div id="blog">
        <BlogSection />
      </div>
      <div id="testimonials">
        <TestimonialSection />
      </div>
    </main>
  );
}
