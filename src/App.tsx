import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import AdminLayout from "./components/admin/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import PremiumHome from "./pages/PremiumHome";
import ElevenPlusPrep from "./pages/ElevenPlusPrep";
import Competitions from "./pages/Competitions";
import ArtsCraft from "./pages/ArtsCraft";
import Activities from "./pages/Activities";
import WhatsOn from "./pages/WhatsOn";
import AboutUs from "./pages/AboutUs";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Magazines from "./pages/Magazines";
import PapersOnDemand from "./pages/PapersOnDemand";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import EnquireNow from "./pages/EnquireNow";
import FAQs from "./pages/FAQs";
import SafetyGDPR from "./pages/SafetyGDPR";
import Testimonials from "./pages/Testimonials";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminContent from "./pages/admin/AdminContent";
import AdminSubjects from "./pages/admin/AdminSubjects";
import AdminVocabulary from "./pages/admin/AdminVocabulary";
import AdminPapers from "./pages/admin/AdminPapers";
import AdminCompetitions from "./pages/admin/AdminCompetitions";
import AdminActivities from "./pages/admin/AdminActivities";
import AdminArtsCraft from "./pages/admin/AdminArtsCraft";
import AdminBlog from "./pages/admin/AdminBlog";
import AdminMagazines from "./pages/admin/AdminMagazines";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminFaqs from "./pages/admin/AdminFaqs";
import AdminTestimonials from "./pages/admin/AdminTestimonials";
import AdminEnquiries from "./pages/admin/AdminEnquiries";
import DashboardWorksheets from "./pages/dashboard/DashboardWorksheets";
import DashboardProgress from "./pages/dashboard/DashboardProgress";
import DashboardMagazines from "./pages/dashboard/DashboardMagazines";
import DashboardCompetitions from "./pages/dashboard/DashboardCompetitions";
import DashboardPapers from "./pages/dashboard/DashboardPapers";
import DashboardSettings from "./pages/dashboard/DashboardSettings";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<PremiumHome />} />
        <Route path="/11-plus-prep" element={<ElevenPlusPrep />} />
        <Route path="/competitions" element={<Competitions />} />
        <Route path="/arts-craft" element={<ArtsCraft />} />
        <Route path="/activities" element={<Activities />} />
        <Route path="/whats-on" element={<WhatsOn />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogPost />} />
        <Route path="/magazines" element={<Magazines />} />
        <Route path="/papers-on-demand" element={<PapersOnDemand />} />
        <Route path="/login" element={<Login />} />
        <Route path="/enquire" element={<EnquireNow />} />
        <Route path="/faqs" element={<FAQs />} />
        <Route path="/safety-gdpr" element={<SafetyGDPR />} />
        <Route path="/testimonials" element={<Testimonials />} />
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
          <Route path="/dashboard/magazines" element={<DashboardMagazines />} />
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
  );
}

export default App;
