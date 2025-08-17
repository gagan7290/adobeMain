import "./App.css";
import { useState } from "react";
import Hero from "./components/hero/Hero";
import Navbar from "./components/navbar/Navbar";
import { Outlet, useLocation } from "react-router-dom";
import UploadModal from "./components/modals/UploadModal.jsx";

function App() {
  const location = useLocation();

  const [showUpload, setShowUpload] = useState(false);

  const handleStartSession = () => setShowUpload(true);
  const handleWatchDemo = () => {
    window.open("https://www.youtube.com/results?search_query=pdf+insights+demo", "_blank");
  };

  return (
    <>
      <div className="mainContainer">
        <div className="navHeroContainer">
          <Navbar />
          {location.pathname === "/" ? (
            <Hero onStartSession={handleStartSession} onWatchDemo={handleWatchDemo} />
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
