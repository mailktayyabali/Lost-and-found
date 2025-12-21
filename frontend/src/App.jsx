import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import { UserProfileProvider } from "./context/UserProfileContext";
import { MessagingProvider } from "./context/MessagingContext";
import { SearchAlertsProvider } from "./context/SearchAlertsContext";
import MainLayout from "./layouts/MainLayout";
import DashboardLayout from "./layouts/DashboardLayout";

import Home from "./pages/Home";
import Auth from "./pages/Auth";
import About from "./pages/About";
import Feed from "./pages/Feed";
import ReportItem from "./pages/ReportItem";
import UserDashboard from "./pages/UserDashboard";
import MyReports from "./pages/MyReports";
import ItemDetail from "./pages/ItemDetail";
import Contact from "./pages/Contact";
import AdminDashboard from "./pages/AdminDashboard";
import Favorites from "./pages/Favorites";
import UserProfile from "./pages/UserProfile";
import Messages from "./pages/Messages";
import Chat from "./pages/Chat";
import SearchAlerts from "./pages/SearchAlerts";

function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <UserProfileProvider>
          <MessagingProvider>
            <SearchAlertsProvider>
              <Routes>
        {/* Public / Website Layout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/lost-items" element={<Feed type="lost" />} />
          <Route path="/found-items" element={<Feed type="found" />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/report" element={<ReportItem />} />
          <Route path="/item/:id" element={<ItemDetail />} />
          <Route path="/profile/:userId" element={<UserProfile />} />
        </Route>

        {/* Dashboard Layout (Authenticated) */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/my-reports" element={<MyReports />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/chat/:itemId/:userId" element={<Chat />} />
          <Route path="/search-alerts" element={<SearchAlerts />} />
        </Route>
      </Routes>
            </SearchAlertsProvider>
          </MessagingProvider>
        </UserProfileProvider>
      </FavoritesProvider>
    </AuthProvider>
  );
}

export default App;
