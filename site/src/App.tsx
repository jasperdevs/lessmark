import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Home } from "@/pages/Home";
import { PlaygroundPage } from "@/pages/PlaygroundPage";
import { DocsPage } from "@/pages/DocsPage";
import { ExamplesIndex } from "@/pages/ExamplesIndex";
import { ExamplePage } from "@/pages/ExamplePage";
import { allSources, docs } from "@/lib/content";
import { LiveSourceProvider } from "@/lib/live-source";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <LiveSourceProvider defaults={allSources}>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col">
        <SiteHeader />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/playground" element={<PlaygroundPage />} />
            <Route path="/docs" element={<Navigate to={`/docs/${docs[0].slug}`} replace />} />
            <Route path="/docs/:slug" element={<DocsPage />} />
            <Route path="/examples" element={<ExamplesIndex />} />
            <Route path="/examples/:slug" element={<ExamplePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <SiteFooter />
      </div>
    </LiveSourceProvider>
  );
}

export default App;
