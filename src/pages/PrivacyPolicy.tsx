import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="page-container pb-32 pt-40 md:pt-52">
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-20 space-y-6"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-sky-400/20 bg-sky-500/5 text-[10px] font-black uppercase tracking-[0.3em] text-sky-300/70">
          <ShieldCheck size={12} className="text-sky-400" />
          <span>Legal Protocol</span>
        </div>
        <h1 className="text-4xl md:text-7xl font-black tracking-tighter text-white">
          Privacy <span className="text-white/40">Policy.</span>
        </h1>
        <p className="text-white/40 text-lg font-medium max-w-2xl leading-relaxed">
          How we collect, use, and protect your data across our platforms and digital spaces.
        </p>
      </motion.header>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="max-w-4xl space-y-12 text-white/70"
      >
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white tracking-tight">1. Information We Collect</h2>
          <p className="leading-relaxed">
            We collect information you provide directly to us when you create an account, register for a competition, or use our interactive arts & crafts features. This may include your name, email address, password, educational details, and content you voluntarily submit.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white tracking-tight">2. How We Use Your Information</h2>
          <p className="leading-relaxed">
            We use the information we collect to operate, maintain, and provide the features and functionality of the Eager Minds Club platform. We may also use your information to communicate with you about updates, new competitions, or support-related inquiries.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white tracking-tight">3. Data Security and GDPR Compliance</h2>
          <p className="leading-relaxed">
            Eager Minds Club takes data security very seriously. We use commercially reasonable physical, managerial, and technical safeguards to preserve the integrity and security of your personal information. We operate in compliance with the General Data Protection Regulation (GDPR) and ensure you have full rights to your data.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white tracking-tight">4. Third-Party Services</h2>
          <p className="leading-relaxed">
            We may share your information with third-party service providers solely to perform services on our behalf, such as hosting, database management, and analytics. These third parties have access to your personal information only to perform these tasks and are obligated not to disclose or use it for any other purpose.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white tracking-tight">5. Contact Us</h2>
          <p className="leading-relaxed">
            If you have any questions about this Privacy Policy, please contact our Data Protection Officer through the platform support channels. By continuing to use Eager Minds Club, you consent to the practices described in this policy.
          </p>
        </section>
      </motion.div>
    </div>
  );
}
