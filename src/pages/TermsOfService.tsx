import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

export default function TermsOfService() {
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
          Terms of <span className="text-white/40">Service.</span>
        </h1>
        <p className="text-white/40 text-lg font-medium max-w-2xl leading-relaxed">
          The structural rules and agreements governing your use of the Eager Minds platform.
        </p>
      </motion.header>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="max-w-4xl space-y-12 text-white/70"
      >
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white tracking-tight">1. Acceptance of Terms</h2>
          <p className="leading-relaxed">
            By accessing or using the Eager Minds Club website and services, you agree to be bound by these Terms of Service. If you do not agree to all the terms and conditions outlined here, you may not access our services.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white tracking-tight">2. Use of Services</h2>
          <p className="leading-relaxed">
            Our platform provides academic resources, competition access, and creative tutorials. You agree to use these services only for lawful purposes. You must not use our platform to distribute malicious content, attempt unauthorized access, or harass other members. We reserve the right to terminate accounts that violate these rules.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white tracking-tight">3. Intellectual Property</h2>
          <p className="leading-relaxed">
            All content on the Eager Minds platform, including text, graphics, logos, video tutorials, worksheets, and competition structures, is the property of Eager Minds Club or its content suppliers and is protected by international copyright laws. You may not reproduce, distribute, or create derivative works without explicit permission.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white tracking-tight">4. Competitions and Rewards</h2>
          <p className="leading-relaxed">
            Participation in our competitions is subject to specific rules provided for each event. We reserve the right to disqualify any participant found to be cheating or violating the competition protocol. Any rewards or prizes are issued at our sole discretion and are non-transferable.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white tracking-tight">5. Limitation of Liability</h2>
          <p className="leading-relaxed">
            Eager Minds Club shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service. We provide our services on an "as is" and "as available" basis without any warranties.
          </p>
        </section>
      </motion.div>
    </div>
  );
}
