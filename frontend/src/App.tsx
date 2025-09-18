import { Routes, Route, BrowserRouter } from "react-router-dom";
import LoginPage from "./views/LoginPage";
import HeroPage from "./views/HeroPage";
import HomePage from "./views/HomePage";
import { ThemeProvider } from "./components/theme-provider";
import RegisterPage from "./views/RegisterPage";
import { Toaster } from "./components/ui/sonner";
import NotFound from "./views/NotFound";
import SessionLayout from "./layouts/SessionLayout";
import CrawlersPage from "./views/CrawlersPage";
import HistoryPage from "./views/HistoryPage";
import Dashboard from "./components/Dashboard";
import NotificactionsPage from "./views/NotificactionsPage";

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
                <Route path="crawlers" element={<CrawlersPage />} />
                <Route path="notifications" element={<NotificactionsPage />} />
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
