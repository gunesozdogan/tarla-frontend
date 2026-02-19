import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import LoginPage from "./components/LoginPage/LoginPage";
import InitialPage from "./components/InitialPage/InitialPage";
import FavoritesPage from "./components/FavoritesPage/FavoritesPage";
import AddListing from "./components/AddListing/AddListing";
import SignupPage from "./components/SignupPage/SignupPage";
import ViewDetailsPage from "./components/ViewDetailsPage/ViewDetailsPage";
import ProfilePage from "./components/ProfilePage/ProfilePage";
import AdminNavbar from "./components/AdminNavbar/AdminNavbar";
import AdminFields from "./components/AdminFields/AdminFields";
import MyListings from "./components/MyListings/MyListings";
import ListingAnalytics from "./components/ListingAnalytics/ListingAnalytics";
import ListingEdit from "./components/ListingEdit/ListingEdit";
import NotificationPage from "./components/NotificationPage/NotificationPage";
import ListingSearch from "./components/ListingSearch/ListingSearch";
import PolygonTest from "./PolygonTest";
import ProtectedRoute from "./ProtectedRoute";
import { useTranslation } from "react-i18next";
import "./App.css";
import FieldsView from "./FieldsView";
import OAuthSuccess from "./0AuthSuccess";
import { Footer } from "./components/Footer/Footer";
import { HowItWorks } from "./components/HowItWorks/HowItWorks";

function App() {
  const { t } = useTranslation();
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        if (parsed.expiresAt && Date.now() < parsed.expiresAt) {
          return parsed.data;
        } else {
          localStorage.removeItem("user");
          return null;
        }
      }
      return null;
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
      return null;
    }
  });

  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );

  var isAdmin = false;
  if (user) {
    isAdmin = user?.user?.role === "admin";
  }

  useEffect(() => {
    if (user) {
      const expirationTime = Date.now() + 1000 * 60 * 60;
      const userWithExpiry = {
        data: user,
        expiresAt: expirationTime,
      };
      localStorage.setItem("user", JSON.stringify(userWithExpiry));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const RenderNavbar = () => {
    const location = useLocation();
    const hideNavbarRoutes = [];
    if (isAdmin && location.pathname.startsWith("/admin")) {
      return <AdminNavbar />;
    }
    return (
      !hideNavbarRoutes.includes(location.pathname) && (
        <Navbar
          user={user}
          setUser={setUser}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />
      )
    );
  };

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  return (
    <Router>
      <div className="main-container">
        <RenderNavbar />
        <Routes>
          {/* Open Routes (Accessible by everyone) */}
          <Route path="/" element={<InitialPage />} />
          <Route path="/login" element={<LoginPage setUser={setUser} />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route
            path="/oauth-success"
            element={<OAuthSuccess setUser={setUser} />}
          />

          {/* 🔒 Protected Routes (Show Login Warning if user is not logged in) */}
          <Route
            path="/favorites"
            element={
              <ProtectedRoute user={user}>
                <FavoritesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-listing"
            element={
              <ProtectedRoute user={user}>
                <AddListing />
              </ProtectedRoute>
            }
          />
          <Route
            path="/viewdetails/:id"
            element={
              <ProtectedRoute user={user}>
                <ViewDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute user={user}>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mylistings"
            element={
              <ProtectedRoute user={user}>
                <MyListings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mylistings/:fieldId/analytics"
            element={
              <ProtectedRoute user={user}>
                <ListingAnalytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/editlisting/:listingId"
            element={
              <ProtectedRoute user={user}>
                <ListingEdit />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute user={user}>
                <NotificationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/search"
            element={
              <ProtectedRoute user={user}>
                <ListingSearch />
              </ProtectedRoute>
            }
          />
          <Route
            path="/fieldsView"
            element={
              <ProtectedRoute user={user}>
                <FieldsView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/polygontest"
            element={
              <ProtectedRoute user={user}>
                <PolygonTest />
              </ProtectedRoute>
            }
          />

          {isAdmin && (
            <>
              <Route
                path="/admin/dashboard"
                element={<h1>{t("app.adminDashboard")}</h1>}
              />
              <Route
                path="/admin/requests"
                element={<h1>{t("app.adminRequests")}</h1>}
              />
              <Route path="/admin/fields" element={<AdminFields />} />
            </>
          )}
          {/* Redirect non-admin users */}
          <Route
            path="/admin/*"
            element={!isAdmin ? <Navigate to="/" /> : null}
          />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
