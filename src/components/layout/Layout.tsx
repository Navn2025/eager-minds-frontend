import { Outlet } from "react-router-dom";
import FullscreenNavbar from "./FullscreenNavbar";
import Footer from "./Footer";
import HeroBackground from "../ui/HeroBackground";

export default function Layout() {
  const footerData = {
    companyInfo: {
      name: "Eager Minds",
      description: "Where Curious Minds Become Brilliant Thinkers. Expert preparation for the next generation of innovators.",
    },
    socialLinks: [
      { platform: "instagram", href: "https://www.instagram.com/eagermindsclub" },
      { platform: "facebook", href: "https://www.facebook.com/share/1Hh1zoJ4r3/" },
      { platform: "mail", href: "mailto:eagermindsclub@gmail.com" },
    ],
    navigationLinks: [
      {
        title: "Resources",
        links: [
          { to: "/11-plus-prep", label: "11+ Preparation" },
          { to: "/papers-on-demand", label: "Practice Papers" },
          { to: "/magazines", label: "Learning Magazines" },
          { to: "/blog", label: "Educational Blog" },
        ]
      },
      {
        title: "The Club",
        links: [
          { to: "/about", label: "About Us" },
          { to: "/competitions", label: "Competitions" },
          { to: "/activities", label: "Activities" },
          { to: "/testimonials", label: "Success Stories" },
        ]
      },
      {
        title: "Support",
        links: [
          { to: "/faqs", label: "Assistance" },
          { to: "/enquire", label: "Contact Us" },
          { to: "/safety-gdpr", label: "Privacy Policy" },
          { to: "/safety-gdpr", label: "Terms" },
        ]
      }
    ]
  };

  return (
    <div className="app-layout min-h-screen relative overflow-x-hidden">
      <HeroBackground />
      <FullscreenNavbar />
      <main className="min-h-screen relative z-10">
        <Outlet />
      </main>
      <div id="contact" className="relative z-10">
        <Footer {...footerData} />
      </div>
    </div>
  );
}
