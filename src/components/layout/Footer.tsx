import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Instagram,
  Facebook,
  Mail,
  Twitter,
  Linkedin,
  HelpCircle,
  Users,
} from "lucide-react";
import api from "../../services/api";
import logo from "../../assets/logo.png";

interface NavigationLinkSet {
  title: string;
  links: { to: string; label: string }[];
}

interface SocialLink {
  platform: string;
  href: string;
}

interface CompanyInfo {
  name: string;
  description: string;
}

interface FooterProps {
  navigationLinks: NavigationLinkSet[];
  socialLinks: SocialLink[];
  companyInfo: CompanyInfo;
}

const SocialIcon = ({ platform, size }: { platform: string; size: number }) => {
  const platforms: Record<string, any> = {
    instagram: Instagram,
    facebook: Facebook,
    mail: Mail,
    twitter: Twitter,
    linkedin: Linkedin,
  };
  const Icon = platforms[platform.toLowerCase()] || HelpCircle;
  return <Icon size={size} />;
};

export default function Footer({
  navigationLinks,
  socialLinks,
  companyInfo,
}: FooterProps) {
  const [visitorCount, setVisitorCount] = useState<number | null>(null);

  useEffect(() => {
    api
      .get("/visitors")
      .then((res) => {
        if (res.data?.visitors) {
          setVisitorCount(res.data.visitors);
        }
      })
      .catch((err) => console.error("Error fetching visitor count:", err));
  }, []);

  return (
    <footer className="relative bg-[#07050F] border-t border-white/[0.06] pt-20 pb-10 z-10">
      {/* Brand gradient accent bar at top */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-pink-500 via-purple-500 to-sky-400" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand column */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3 group w-fit">
              <div
                className="flex items-center justify-center rounded-xl px-2.5 py-1.5
                bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-sky-500/10
                border border-purple-400/20
                group-hover:border-purple-400/35
                transition-all duration-300"
              >
                <img
                  src={logo}
                  alt="Eager Minds Club logo"
                  className="h-10 w-auto max-w-[180px] object-contain
                    drop-shadow-[0_0_8px_rgba(168,85,247,0.40)]
                    group-hover:scale-[1.03] transition-transform duration-300"
                />
              </div>
              <span className="text-sm font-semibold text-white/90">
                {companyInfo.name}
              </span>
            </Link>
            <p
              className="text-[11px] font-medium leading-relaxed max-w-xs uppercase tracking-widest"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {companyInfo.description}
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-2.5">
              {socialLinks.map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-xl border border-white/[0.07] bg-white/[0.02]
                    flex items-center justify-center
                    hover:bg-gradient-to-br hover:from-pink-500/15 hover:to-purple-500/15
                    hover:border-purple-400/35 hover:text-white
                    transition-all duration-300"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  <SocialIcon platform={social.platform} size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {navigationLinks.map((col, i) => (
            <div key={i}>
              <h4
                className="text-[10px] font-bold uppercase tracking-[0.28em] text-white/90 mb-5
                pb-2 border-b border-pink-400/25"
              >
                {col.title}
              </h4>
              <ul className="space-y-3">
                {col.links.map((link, j) => (
                  <li key={j}>
                    <Link
                      to={link.to}
                      className="text-[11px] uppercase tracking-widest font-medium
                        hover:text-white transition-all flex items-center group"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      {link.label}
                      <ArrowUpRight
                        size={10}
                        className="ml-1 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-pink-400"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/[0.05] flex flex-col md:flex-row justify-between items-center gap-5">
          <p
            className="text-[9px] font-medium uppercase tracking-[0.3em]"
            style={{ color: "var(--color-text-secondary)" }}
          >
            &copy; {new Date().getFullYear()} {companyInfo.name}. All rights
            reserved.
          </p>

          <div className="flex flex-col items-center gap-1 border-y md:border-y-0 md:border-x border-white/5 py-4 md:py-0 px-6">
            <div className="flex items-center gap-2">
              <div className="relative flex items-center justify-center">
                <div className="absolute w-2 h-2 rounded-full bg-emerald-500 animate-ping opacity-60" />
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 z-10" />
              </div>
              <span className="text-[8px] uppercase font-black tracking-widest text-white/50">
                Global Visitors
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={12} className="text-pink-400/80" />
              <span
                className="text-white/90 text-sm font-black tracking-widest"
                style={{ textShadow: "0 0 10px rgba(255,255,255,0.2)" }}
              >
                {visitorCount !== null ? visitorCount.toLocaleString() : "---"}
              </span>
            </div>
          </div>

          <div
            className="flex items-center gap-5 text-[9px] font-medium uppercase tracking-[0.3em]"
            style={{ color: "var(--color-text-secondary)" }}
          >
            <Link to="/terms" className="hover:text-white transition-all">
              Legal
            </Link>
            <Link
              to="/privacy-policy"
              className="hover:text-white transition-all"
            >
              Privacy
            </Link>
            <Link to="/safety-gdpr" className="hover:text-white transition-all">
              Security
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
