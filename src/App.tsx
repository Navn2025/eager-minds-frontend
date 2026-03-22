import { Suspense, lazy, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

const Layout = lazy(() => import("./components/layout/Layout"));
const DashboardLayout = lazy(
  () => import("./components/dashboard/DashboardLayout"),
);
const AdminLayout = lazy(() => import("./components/admin/AdminLayout"));

const PremiumHome = lazy(() => import("./pages/PremiumHome"));
const ElevenPlusPrep = lazy(() => import("./pages/ElevenPlusPrep"));
const Competitions = lazy(() => import("./pages/Competitions"));
const ArtsCraft = lazy(() => import("./pages/ArtsCraft"));
const Activities = lazy(() => import("./pages/Activities"));
const WhatsOn = lazy(() => import("./pages/WhatsOn"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const OurClubs = lazy(() => import("./pages/OurClubs"));
const ClubPage = lazy(() => import("./pages/ClubPage"));
const Gallery = lazy(() => import("./pages/Gallery"));
const Workshops = lazy(() => import("./pages/Workshops"));
const ContactUs = lazy(() => import("./pages/ContactUs"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const Magazines = lazy(() => import("./pages/Magazines"));
const PapersOnDemand = lazy(() => import("./pages/PapersOnDemand"));
const WordOfTheDayPage = lazy(() => import("./pages/WordOfTheDayPage"));
const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const EnquireNow = lazy(() => import("./pages/EnquireNow"));
const FAQs = lazy(() => import("./pages/FAQs"));
const SafetyGDPR = lazy(() => import("./pages/SafetyGDPR"));
const Testimonials = lazy(() => import("./pages/Testimonials"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const MediaArchiveLayout = lazy(
  () => import("./components/layout/MediaArchiveLayout"),
);

const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminContent = lazy(() => import("./pages/admin/AdminContent"));
const AdminSubjects = lazy(() => import("./pages/admin/AdminSubjects"));
const AdminVocabulary = lazy(() => import("./pages/admin/AdminVocabulary"));
const AdminPapers = lazy(() => import("./pages/admin/AdminPapers"));
const AdminCompetitions = lazy(() => import("./pages/admin/AdminCompetitions"));
const AdminActivities = lazy(() => import("./pages/admin/AdminActivities"));
const AdminArtsCraft = lazy(() => import("./pages/admin/AdminArtsCraft"));
const AdminBlog = lazy(() => import("./pages/admin/AdminBlog"));
const AdminMagazines = lazy(() => import("./pages/admin/AdminMagazines"));
const AdminEvents = lazy(() => import("./pages/admin/AdminEvents"));
const AdminFaqs = lazy(() => import("./pages/admin/AdminFaqs"));
const AdminTestimonials = lazy(() => import("./pages/admin/AdminTestimonials"));
const AdminEnquiries = lazy(() => import("./pages/admin/AdminEnquiries"));

const DashboardWorksheets = lazy(
  () => import("./pages/dashboard/DashboardWorksheets"),
);
const DashboardProgress = lazy(
  () => import("./pages/dashboard/DashboardProgress"),
);
const DashboardMagazines = lazy(
  () => import("./pages/dashboard/DashboardMagazines"),
);
const DashboardCompetitions = lazy(
  () => import("./pages/dashboard/DashboardCompetitions"),
);
const DashboardPapers = lazy(() => import("./pages/dashboard/DashboardPapers"));
const DashboardSettings = lazy(
  () => import("./pages/dashboard/DashboardSettings"),
);

function RouteFallback() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  return null;
}

function App() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          {/* ── Main public routes (tab order) ── */}
          <Route path="/" element={<PremiumHome />} />
          <Route path="/about" element={<AboutUs />} />

          {/* Our Clubs */}
          <Route path="/clubs" element={<OurClubs />} />
          <Route path="/clubs/arts-craft" element={<ClubPage />} />
          <Route path="/clubs/science" element={<ClubPage />} />
          <Route path="/clubs/coding" element={<ClubPage />} />
          <Route path="/clubs/reading" element={<ClubPage />} />
          <Route path="/clubs/music" element={<ClubPage />} />
          <Route path="/clubs/global" element={<ClubPage />} />

          {/* Workshops */}
          <Route path="/workshops" element={<Workshops />} />

          {/* Gallery */}
          <Route path="/gallery" element={<Gallery />} />

          {/* Word of the Day */}
          <Route path="/word-of-the-day" element={<WordOfTheDayPage />} />

          {/* 11+ Prep */}
          <Route path="/11-plus-prep" element={<ElevenPlusPrep />} />

          {/* Competitions */}
          <Route path="/competitions" element={<Competitions />} />

          {/* Magazines */}
          <Route path="/magazines" element={<Magazines />} />

          {/* Blog */}
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogPost />} />

          {/* Contact */}
          <Route path="/contact" element={<ContactUs />} />

          {/* Legacy / other pages */}
          <Route path="/arts-craft" element={<ArtsCraft />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/whats-on" element={<WhatsOn />} />
          <Route path="/papers-on-demand" element={<PapersOnDemand />} />
          <Route path="/login" element={<Login />} />
          <Route path="/enquire" element={<EnquireNow />} />
          <Route path="/faqs" element={<FAQs />} />
          <Route path="/safety-gdpr" element={<SafetyGDPR />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/media" element={<MediaArchiveLayout />} />
        </Route>

        {/* Authenticated routes - Standalone Layouts */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route
              path="/dashboard/worksheets"
              element={<DashboardWorksheets />}
            />
            <Route path="/dashboard/progress" element={<DashboardProgress />} />
            <Route
              path="/dashboard/magazines"
              element={<DashboardMagazines />}
            />
            <Route
              path="/dashboard/competitions"
              element={<DashboardCompetitions />}
            />
            <Route path="/dashboard/papers" element={<DashboardPapers />} />
            <Route path="/dashboard/settings" element={<DashboardSettings />} />
          </Route>
        </Route>

        {/* Admin routes - Standalone Layouts */}
        <Route element={<ProtectedRoute requiredRole="admin" />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/content" element={<AdminContent />} />
            <Route path="/admin/subjects" element={<AdminSubjects />} />
            <Route path="/admin/vocabulary" element={<AdminVocabulary />} />
            <Route path="/admin/papers" element={<AdminPapers />} />
            <Route path="/admin/competitions" element={<AdminCompetitions />} />
            <Route path="/admin/activities" element={<AdminActivities />} />
            <Route path="/admin/arts-craft" element={<AdminArtsCraft />} />
            <Route path="/admin/blog" element={<AdminBlog />} />
            <Route path="/admin/magazines" element={<AdminMagazines />} />
            <Route path="/admin/events" element={<AdminEvents />} />
            <Route path="/admin/faqs" element={<AdminFaqs />} />
            <Route path="/admin/testimonials" element={<AdminTestimonials />} />
            <Route path="/admin/enquiries" element={<AdminEnquiries />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
