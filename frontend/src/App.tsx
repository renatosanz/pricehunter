import { Routes, Route, BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "./components/ui/sonner";
import { lazy, Suspense } from "react";
import { FallbackPage } from "./views/fallback/Fallback";
import DetailsTracker from "./views/trackers/detailsTracker/DetailsTracker";
import { TooltipProvider } from "@radix-ui/react-tooltip";

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
const Dashboard = lazy(() => import("./components/Dashboard"));
const NotificactionsPage = lazy(
  () => import("./views/notifications/NotificactionsPage")
);
const NewTrackerPage = lazy(
  () => import("./views/trackers/newTracker/NewTrackerPage")
);

function App() {
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
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
