import "./App.css";
import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import Navbar from "./components/navbar/Navbar";
import Hero from "./components/hero/Hero";
import UploadModal from "./components/modals/UploadModal.jsx";

import Home from "./pages/Home.jsx";

function App() {
  const location = useLocation();
  const [showUpload, setShowUpload] = useState(false);

  const handleStartSession = () => setShowUpload(true);
  const handleWatchDemo = () => {
    window.open(
      "https://www.youtube.com/results?search_query=pdf+insights+demo",
      "_blank"
    );
  };

  const isHome = location.pathname === "/";

  return (
    <>
      <div className="mainContainer">
        <div className="navHeroContainer">
          <Navbar />

          {isHome ? (
            <>
              {/* Existing hero */}
              {/* <Hero
                onStartSession={handleStartSession}
                onWatchDemo={handleWatchDemo}
              /> */}

              <div className="heroParent">
                  <Hero/>
              </div>

              {/* New: sections below hero (value props, how it works, terminal demo, CTA) */}
              <Home />
            </>
          ) : (
            <Outlet />
          )}
        </div>
      </div>

      <UploadModal open={showUpload} onClose={() => setShowUpload(false)} />
    </>
  );
}

export default App;
