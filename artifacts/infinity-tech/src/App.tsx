import { lazy, Suspense, useEffect } from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider, useLanguage } from "@/contexts/LanguageContext";
import { trackPageView } from "@/lib/analytics";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

// Home is eager-loaded (it's the LCP page — no lazy penalty)
import { Home } from "@/pages/Home";

// All other pages are lazy-loaded (route-level code splitting)
const Projects    = lazy(() => import("@/pages/Projects").then(m => ({ default: m.Projects })));
const ProjectDetail = lazy(() => import("@/pages/ProjectDetail").then(m => ({ default: m.ProjectDetail })));
const About       = lazy(() => import("@/pages/About").then(m => ({ default: m.About })));
const Contact     = lazy(() => import("@/pages/Contact").then(m => ({ default: m.Contact })));
const NotFound    = lazy(() => import("@/pages/not-found"));

// Admin section is fully lazy — contains recharts + all admin components
const AdminSection = lazy(() => import("@/admin/AdminSection"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    }
  }
});

// Minimal skeleton that doesn't cause CLS — same bg, no layout impact
function PageFallback() {
  return (
    <div
      className="flex-grow"
      style={{ minHeight: "60vh" }}
      aria-hidden="true"
    />
  );
}

function PublicRoutes() {
  const [location] = useLocation();
  const { lang } = useLanguage();

  useEffect(() => {
    trackPageView(location, lang);
  }, [location, lang]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.22, ease: "easeInOut" }}
        className="flex-grow"
      >
        <Suspense fallback={<PageFallback />}>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/projects" component={Projects} />
            <Route path="/projects/:id" component={ProjectDetail} />
            <Route path="/about" component={About} />
            <Route path="/contact" component={Contact} />
            <Route component={NotFound} />
          </Switch>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
}

function AppContent() {
  const [location] = useLocation();
  const isAdmin = location === "/admin" || location.startsWith("/admin/");

  if (isAdmin) {
    return (
      <Suspense fallback={<PageFallback />}>
        <AdminSection />
      </Suspense>
    );
  }

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <Navbar />
      <PublicRoutes />
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <AppContent />
            </WouterRouter>
            <Toaster />
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
