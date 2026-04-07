import { Twitter, Instagram, Linkedin, Facebook } from "lucide-react";
import { Link } from "react-router-dom";

const footerLinks = [
  {
    title: "Platform",
    links: ["11+ Preparation", "Curriculum", "Pricing", "Methodology"]
  },
  {
    title: "Resources",
    links: ["Papers", "Blog", "Success Stories", "Word of the Day"]
  },
  {
    title: "Competitions",
    links: ["Mathematics Olympiad", "Writing Challenge", "Artistic Minds", "Previous Results"]
  },
  {
    title: "Contact",
    links: ["Support", "Partnerships", "Safety & GDPR", "FAQ"]
  }
];

export default function PremiumFooter() {
  return (
    <footer className="pt-24 pb-12 px-6 border-t border-white/5 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-20">
          <div className="col-span-2 lg:col-span-1">
            <div className="text-2xl font-black text-white tracking-tighter mb-6">
              EAGER<span className="text-accent">MINDS.</span>
            </div>
            <p className="text-text-secondary text-sm leading-relaxed mb-8 max-w-xs">
              Elite academic preparation for the next generation of global thinkers and problem solvers.
            </p>
            <div className="flex gap-4">
              {[Twitter, Instagram, Linkedin, Facebook].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-text-secondary hover:text-white hover:border-white/20 transition-all">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {footerLinks.map((group) => (
            <div key={group.title}>
              <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-6">{group.title}</h4>
              <ul className="space-y-4">
                {group.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-text-secondary hover:text-accent transition-colors text-sm font-medium">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-text-secondary text-xs font-medium">
            © 2026 Eager Minds Club. All rights reserved.
          </div>
          <div className="flex gap-8">
            <Link to="/privacy-policy" className="text-text-secondary hover:text-white text-xs transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-text-secondary hover:text-white text-xs transition-colors">Terms of Service</Link>
            <a href="#" className="text-text-secondary hover:text-white text-xs transition-colors">Cookie Settings</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
