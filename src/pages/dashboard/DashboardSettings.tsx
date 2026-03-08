import { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  User,
  Mail,
  Lock,
  Bell,
  Eye,
  EyeOff,
  Shield,
  Palette,
  Globe,
  ChevronRight,
  Save,
  LogOut,
  Trash2,
  Crown,
} from "lucide-react";
import { Card, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { useAuth } from "../../context/AuthContext";
import { cn } from "../../lib/utils";

interface SettingSection {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
}

export default function DashboardSettings() {
  const { user, logout, isPremium } = useAuth();
  const [activeSection, setActiveSection] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form states
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Notification settings
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    competitions: true,
    newsletters: false,
    reminders: true,
  });

  // Privacy settings
  const [privacy, setPrivacy] = useState({
    showProgress: true,
    showRankings: true,
    allowAnalytics: true,
  });

  const sections: SettingSection[] = [
    {
      id: "profile",
      title: "Profile",
      description: "Manage your account details",
      icon: User,
    },
    {
      id: "security",
      title: "Security",
      description: "Password and authentication",
      icon: Lock,
    },
    {
      id: "notifications",
      title: "Notifications",
      description: "Email and push preferences",
      icon: Bell,
    },
    {
      id: "privacy",
      title: "Privacy",
      description: "Control your data",
      icon: Shield,
    },
    {
      id: "appearance",
      title: "Appearance",
      description: "Theme and display",
      icon: Palette,
    },
  ];

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);
  };

  return (
    <div className="space-y-12 pb-32 pt-10">
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/5 bg-white/[0.02] text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
          <Settings size={12} className="text-white/60" />
          <span>Configuration</span>
        </div>
        <h1 className="text-4xl md:text-7xl font-black tracking-tighter text-white">
          Settings <span className="text-white/40">Panel.</span>
        </h1>
        <p className="text-white/40 text-lg font-medium max-w-xl leading-relaxed">
          Customize your experience and manage your account preferences.
        </p>
      </motion.header>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 scrollbar-none">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={cn(
                "flex-shrink-0 lg:w-full flex items-center gap-3 lg:gap-4 p-3 lg:p-4 rounded-xl lg:rounded-2xl transition-all text-left",
                activeSection === section.id
                  ? "bg-white text-black"
                  : "bg-white/[0.01] text-white/60 hover:bg-white/[0.02] hover:text-white border border-white/5",
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl flex items-center justify-center shrink-0",
                  activeSection === section.id
                    ? "bg-black text-white"
                    : "bg-white/5",
                )}
              >
                <section.icon size={16} className="lg:w-[18px]" />
              </div>
              <div className="pr-2 lg:pr-0">
                <p className="font-bold text-xs lg:text-sm whitespace-nowrap">{section.title}</p>
                <p
                  className={cn(
                    "text-[8px] lg:text-[10px] font-medium hidden lg:block",
                    activeSection === section.id
                      ? "text-black/50"
                      : "text-white/30",
                  )}
                >
                  {section.description}
                </p>
              </div>
            </button>
          ))}

          {/* Logout Button (Desktop only here, mobile at bottom of content) */}
          <button
            onClick={logout}
            className="hidden lg:flex w-full items-center gap-4 p-4 rounded-2xl bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 transition-all mt-6"
          >
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
              <LogOut size={18} />
            </div>
            <div className="text-left">
              <p className="font-bold text-sm">Sign Out</p>
              <p className="text-[10px] font-medium text-red-500/60">
                End your session
              </p>
            </div>
          </button>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          {/* Profile Section */}
          {activeSection === "profile" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Membership Card */}
              <Card
                className={cn(
                  "rounded-[2rem] overflow-hidden",
                  isPremium
                    ? "bg-gradient-to-br from-amber-500/20 to-orange-500/10 border-amber-500/20"
                    : "bg-white/[0.01] border-white/5",
                )}
              >
                <CardContent className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 text-center md:text-left">
                    <div
                      className={cn(
                        "w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center text-2xl md:text-3xl font-black shrink-0",
                        isPremium
                          ? "bg-amber-500 text-black"
                          : "bg-white/5 text-white",
                      )}
                    >
                      {user?.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div>
                      <h2 className="text-xl md:text-2xl font-black text-white leading-tight">
                        {user?.name}
                      </h2>
                      <p className="text-white/40 font-medium text-sm md:text-base">{user?.email}</p>
                      <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
                        {isPremium ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500 text-black text-[9px] md:text-[10px] font-black uppercase tracking-widest">
                            <Crown size={12} /> Premium
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full bg-white/5 text-white/40 text-[9px] md:text-[10px] font-black uppercase tracking-widest">
                            Free Plan
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {!isPremium && (
                    <Button className="w-full md:w-auto h-12 px-6 rounded-xl bg-amber-500 text-black font-bold uppercase tracking-wider hover:scale-[1.02] transition-transform">
                      Upgrade <ChevronRight size={16} className="ml-1" />
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Profile Form */}
              <Card className="border-white/5 bg-white/[0.01] rounded-[2rem]">
                <CardContent className="p-6 md:p-8 space-y-6">
                  <h3 className="text-lg md:text-xl font-black text-white mb-6">
                    Personal Information
                  </h3>

                  <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                        Full Name
                      </label>
                      <div className="relative">
                        <User
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20"
                          size={18}
                        />
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full pl-12 pr-4 py-3.5 md:py-4 bg-white/[0.02] border border-white/5 rounded-xl text-white placeholder:text-white/20 text-sm font-medium outline-none focus:border-white/20 transition-colors"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20"
                          size={18}
                        />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-12 pr-4 py-3.5 md:py-4 bg-white/[0.02] border border-white/5 rounded-xl text-white placeholder:text-white/20 text-sm font-medium outline-none focus:border-white/20 transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                      Language
                    </label>
                    <div className="relative">
                      <Globe
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20"
                        size={18}
                      />
                      <select className="w-full pl-12 pr-4 py-3.5 md:py-4 bg-white/[0.02] border border-white/5 rounded-xl text-white text-sm font-medium outline-none focus:border-white/20 transition-colors appearance-none cursor-pointer">
                        <option value="en" className="bg-black">
                          English (UK)
                        </option>
                        <option value="en-us" className="bg-black">
                          English (US)
                        </option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button
                      onClick={handleSave}
                      disabled={saving}
                      className="w-full md:w-auto h-12 px-8 rounded-xl bg-white text-black font-bold uppercase tracking-wider hover:scale-[1.02] transition-transform disabled:opacity-50"
                    >
                      {saving ? (
                        "Saving..."
                      ) : (
                        <>
                          <Save size={16} className="mr-2" /> Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Security Section */}
          {activeSection === "security" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <Card className="border-white/5 bg-white/[0.01] rounded-[2rem]">
                <CardContent className="p-8 space-y-6">
                  <h3 className="text-xl font-black text-white mb-6">
                    Change Password
                  </h3>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                        Current Password
                      </label>
                      <div className="relative">
                        <Lock
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20"
                          size={18}
                        />
                        <input
                          type={showPassword ? "text" : "password"}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="Enter current password"
                          autoComplete="current-password"
                          className="w-full pl-12 pr-12 py-4 bg-white/[0.02] border border-white/5 rounded-xl text-white placeholder:text-white/20 text-sm font-medium outline-none focus:border-white/20 transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/40 transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                        New Password
                      </label>
                      <div className="relative">
                        <Lock
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20"
                          size={18}
                        />
                        <input
                          type={showPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Enter new password"
                          autoComplete="new-password"
                          className="w-full pl-12 pr-4 py-4 bg-white/[0.02] border border-white/5 rounded-xl text-white placeholder:text-white/20 text-sm font-medium outline-none focus:border-white/20 transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button className="h-12 px-8 rounded-xl bg-white text-black font-bold uppercase tracking-wider hover:scale-[1.02] transition-transform">
                      <Lock size={16} className="mr-2" /> Update Password
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-red-500/20 bg-red-500/5 rounded-[2rem]">
                <CardContent className="p-8">
                  <div className="flex items-start gap-6">
                    <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center flex-shrink-0">
                      <Trash2 size={20} className="text-red-500" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-lg font-bold text-red-500 mb-1">
                        Delete Account
                      </h3>
                      <p className="text-red-500/60 text-sm mb-4">
                        Permanently delete your account and all associated data.
                        This action cannot be undone.
                      </p>
                      <Button className="h-10 px-6 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 font-bold text-sm uppercase tracking-wider hover:bg-red-500/20 transition-colors">
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Notifications Section */}
          {activeSection === "notifications" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="border-white/5 bg-white/[0.01] rounded-[2rem]">
                <CardContent className="p-8 space-y-6">
                  <h3 className="text-xl font-black text-white mb-6">
                    Notification Preferences
                  </h3>

                  {[
                    {
                      key: "email",
                      label: "Email Notifications",
                      description: "Receive updates via email",
                    },
                    {
                      key: "push",
                      label: "Push Notifications",
                      description: "Browser push notifications",
                    },
                    {
                      key: "competitions",
                      label: "Competition Alerts",
                      description: "New competition announcements",
                    },
                    {
                      key: "newsletters",
                      label: "Newsletters",
                      description: "Weekly educational content",
                    },
                    {
                      key: "reminders",
                      label: "Study Reminders",
                      description: "Daily practice reminders",
                    },
                  ].map((item) => (
                    <div
                      key={item.key}
                      className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5"
                    >
                      <div>
                        <p className="font-bold text-white text-sm">
                          {item.label}
                        </p>
                        <p className="text-[11px] text-white/40">
                          {item.description}
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          setNotifications((prev) => ({
                            ...prev,
                            [item.key]: !prev[item.key as keyof typeof prev],
                          }))
                        }
                        className={cn(
                          "w-14 h-8 rounded-full transition-all relative",
                          notifications[item.key as keyof typeof notifications]
                            ? "bg-emerald-500"
                            : "bg-white/10",
                        )}
                      >
                        <div
                          className={cn(
                            "w-6 h-6 rounded-full bg-white absolute top-1 transition-all",
                            notifications[
                              item.key as keyof typeof notifications
                            ]
                              ? "left-7"
                              : "left-1",
                          )}
                        />
                      </button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Privacy Section */}
          {activeSection === "privacy" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="border-white/5 bg-white/[0.01] rounded-[2rem]">
                <CardContent className="p-8 space-y-6">
                  <h3 className="text-xl font-black text-white mb-6">
                    Privacy Settings
                  </h3>

                  {[
                    {
                      key: "showProgress",
                      label: "Show Progress Publicly",
                      description: "Allow others to see your learning progress",
                    },
                    {
                      key: "showRankings",
                      label: "Show in Leaderboards",
                      description: "Appear in competition rankings",
                    },
                    {
                      key: "allowAnalytics",
                      label: "Analytics & Improvement",
                      description: "Help us improve with anonymous usage data",
                    },
                  ].map((item) => (
                    <div
                      key={item.key}
                      className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5"
                    >
                      <div>
                        <p className="font-bold text-white text-sm">
                          {item.label}
                        </p>
                        <p className="text-[11px] text-white/40">
                          {item.description}
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          setPrivacy((prev) => ({
                            ...prev,
                            [item.key]: !prev[item.key as keyof typeof prev],
                          }))
                        }
                        className={cn(
                          "w-14 h-8 rounded-full transition-all relative",
                          privacy[item.key as keyof typeof privacy]
                            ? "bg-emerald-500"
                            : "bg-white/10",
                        )}
                      >
                        <div
                          className={cn(
                            "w-6 h-6 rounded-full bg-white absolute top-1 transition-all",
                            privacy[item.key as keyof typeof privacy]
                              ? "left-7"
                              : "left-1",
                          )}
                        />
                      </button>
                    </div>
                  ))}

                  <div className="pt-4 border-t border-white/5">
                    <Button className="h-12 px-6 rounded-xl bg-white/5 text-white border border-white/10 font-bold uppercase tracking-wider hover:bg-white/10 transition-colors">
                      Download My Data
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Appearance Section */}
          {activeSection === "appearance" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="border-white/5 bg-white/[0.01] rounded-[2rem]">
                <CardContent className="p-8 space-y-6">
                  <h3 className="text-xl font-black text-white mb-6">
                    Theme & Display
                  </h3>

                  <div className="space-y-4">
                    <p className="text-sm font-bold text-white">Color Theme</p>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        {
                          name: "Dark",
                          active: true,
                          colors: ["#000", "#111", "#222"],
                        },
                        {
                          name: "Light",
                          active: false,
                          colors: ["#fff", "#f5f5f5", "#eee"],
                        },
                        {
                          name: "System",
                          active: false,
                          colors: ["#000", "#fff", "#888"],
                        },
                      ].map((theme) => (
                        <button
                          key={theme.name}
                          className={cn(
                            "p-4 rounded-2xl border transition-all",
                            theme.active
                              ? "border-white bg-white/5"
                              : "border-white/5 hover:border-white/20",
                          )}
                        >
                          <div className="flex gap-1 mb-3">
                            {theme.colors.map((color, i) => (
                              <div
                                key={i}
                                className="w-6 h-6 rounded-lg"
                                style={{
                                  backgroundColor: color,
                                  border: "1px solid rgba(255,255,255,0.1)",
                                }}
                              />
                            ))}
                          </div>
                          <p
                            className={cn(
                              "text-sm font-bold",
                              theme.active ? "text-white" : "text-white/40",
                            )}
                          >
                            {theme.name}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/5 text-center">
                    <p className="text-white/30 text-sm">
                      More customization options coming soon...
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>

      {/* Mobile Logout Button */}
      <div className="lg:hidden">
        <button
          onClick={logout}
          className="w-full flex items-center justify-between p-6 rounded-[2rem] bg-red-500/10 text-red-500 border border-red-500/20 active:bg-red-500/20 transition-all font-black uppercase tracking-[0.2em] text-xs"
        >
          <div className="flex items-center gap-4">
            <LogOut size={20} />
            <span>Sign Out</span>
          </div>
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
