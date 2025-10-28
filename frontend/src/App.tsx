import { Routes, Route, BrowserRouter } from "react-router-dom";
import { ThemeProvider, useTheme } from "./components/theme-provider";
import { Toaster } from "./components/ui/sonner";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { lazy, Suspense } from "react";
import FallbackPage from "./views/fallback/Fallback";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboardView from "./views/admin/AdminDashboardView";

const DetailsTracker = lazy(
  () => import("./views/trackers/detailsTracker/DetailsTracker")
);
const SettingsPage = lazy(() => import("./views/settings/SettingsPage"));
const LoginPage = lazy(() => import("./views/login/LoginPage"));
const HeroPage = lazy(() => import("./views/hero/HeroPage"));
const HomePage = lazy(() => import("./views/home/HomePage"));
const RegisterPage = lazy(() => import("./views/login/RegisterPage"));
const NotFound = lazy(() => import("./views/NotFound"));
const SessionLayout = lazy(() => import("./layouts/SessionLayout"));
const TrackersPage = lazy(
  () => import("./views/trackers/allTrackers/TrackersPage")
);
const HistoryPage = lazy(() => import("./views/history/HistoryPage"));
const Dashboard = lazy(() => import("./views/home/Dashboard"));
const NotificactionsPage = lazy(
  () => import("./views/notifications/NotificactionsPage")
);
const NewTrackerPage = lazy(
  () => import("./views/trackers/newTracker/NewTrackerPage")
);

function App() {
  const { theme } = useTheme();
  return (
    <>
      <ThemeProvider defaultTheme={theme} storageKey="vite-ui-theme">
        <TooltipProvider>
          <BrowserRouter>
            <Suspense fallback={<FallbackPage />}>
              <Routes>
                <Route path="*" element={<NotFound />} />
                <Route path="/" element={<HeroPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                <Route path="/" element={<SessionLayout />}>
                  <Route path="/home" element={<HomePage />}>
                    <Route path="" element={<Dashboard />} />
                    <Route path="history" element={<HistoryPage />} />
                    <Route path="trackers" element={<TrackersPage />} />
                    <Route path="trackers/:id" element={<DetailsTracker />} />
                    <Route
                      path="notifications"
                      element={<NotificactionsPage />}
                    />
                    <Route path="new-tracker" element={<NewTrackerPage />} />
                    <Route path="settings" element={<SettingsPage />} />
                    <Route path="admin" element={<AdminLayout />}>
                      <Route path="" element={<AdminDashboardView />} />
                    </Route>
                  </Route>
                </Route>
              </Routes>
            </Suspense>
          </BrowserRouter>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
