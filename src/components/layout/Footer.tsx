import { Link } from "react-router-dom";
import { ArrowUpRight, Instagram, Facebook, Mail, Twitter, Linkedin, HelpCircle } from "lucide-react";

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

export default function Footer({ navigationLinks, socialLinks, companyInfo }: FooterProps) {
  return (
    <footer className="bg-black border-t border-white/[0.05] pt-24 pb-12 relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          <div className="space-y-6">
            <Link to="/" className="text-xl font-black tracking-tighter text-white flex items-center gap-3 group">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center shadow-[0_0_20px_var(--color-accent-glow)] group-hover:rotate-12 transition-transform">
                <div className="w-1.5 h-1.5 bg-white rounded-full" />
              </div>
              <span className="uppercase tracking-[0.2em] text-[11px] font-bold">{companyInfo.name}</span>
            </Link>
            <p className="text-text-secondary text-[11px] font-medium leading-relaxed max-w-xs uppercase tracking-widest">
              {companyInfo.description}
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social, i) => (
                <a 
                  key={i} 
                  href={social.href} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-9 h-9 rounded-xl border border-white/[0.05] bg-white/[0.02] flex items-center justify-center text-text-secondary hover:text-white hover:bg-accent/10 hover:border-accent/40 transition-all"
                >
                  <SocialIcon platform={social.platform} size={16} />
                </a>
              ))}
            </div>
          </div>

          {navigationLinks.map((col, i) => (
            <div key={i}>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white mb-6 underline underline-offset-8 decoration-accent/30">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((link, j) => (
                  <li key={j}>
                    <Link to={link.to} className="text-text-secondary text-[10px] uppercase tracking-widest hover:text-white transition-all flex items-center group">
                      {link.label}
                      <ArrowUpRight size={10} className="ml-1 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-10 border-t border-white/[0.05] flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-text-secondary text-[9px] font-medium uppercase tracking-[0.3em]">
            &copy; {new Date().getFullYear()} {companyInfo.name}. Futuristic Learning Excellence.
          </p>
          <div className="flex items-center gap-6 text-[9px] font-medium uppercase tracking-[0.3em] text-text-secondary">
            <Link to="/safety-gdpr" className="hover:text-white transition-all">Legal</Link>
            <Link to="/safety-gdpr" className="hover:text-white transition-all">Privacy</Link>
            <Link to="/safety-gdpr" className="hover:text-white transition-all">Security</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
