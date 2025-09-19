import { Routes, Route, BrowserRouter } from "react-router-dom";
import LoginPage from "./views/login/LoginPage";
import HeroPage from "./views/hero/HeroPage";
import HomePage from "./views/home/HomePage";
import { ThemeProvider } from "./components/theme-provider";
import RegisterPage from "./views/login/RegisterPage";
import { Toaster } from "./components/ui/sonner";
import NotFound from "./views/NotFound";
import SessionLayout from "./layouts/SessionLayout";
import TrackersPage from "./views/trackers/TrackersPage";
import HistoryPage from "./views/history/HistoryPage";
import Dashboard from "./components/Dashboard";
import NotificactionsPage from "./views/notifications/NotificactionsPage";
import NewTrackerPage from "./views/trackers/NewTrackerPage";

function App() {
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <BrowserRouter>
          <Routes>
            <Route path="*" element={<NotFound />} />
            <Route path="/" element={<HeroPage />} />
            <Route path="/" element={<SessionLayout />}>
              <Route path="/home" element={<HomePage />}>
                <Route path="" element={<Dashboard />} />
                <Route path="history" element={<HistoryPage />} />
                <Route path="Trackers" element={<TrackersPage />} />
                <Route path="notifications" element={<NotificactionsPage />} />
                <Route path="new-tracker" element={<NewTrackerPage />} />
              </Route>
            </Route>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
      <Toaster />
    </>
  );
}

export default App;
