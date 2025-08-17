
import './App.css'
import Hero from './components/hero/Hero';
import Navbar from './components/navbar/Navbar'
import { Outlet , useLocation} from 'react-router-dom'
import ParallelWiperContainer from './components/parallelWiperAnimation/parallelWiperContainer';
import {useRef, useEffect} from "react"
function App() {
  const location = useLocation();
  const isFirstRender = useRef(true);
  
  useEffect(() => {
          isFirstRender.current = false;
  }, []);

  return (
    <>
        <ParallelWiperContainer/>
        <div className="mainContainer">
          <div className="navHeroContainer">
              <Navbar/>
              {location.pathname === "/" ? <Hero isFirstRender={isFirstRender.current}/> : <Outlet/>}
          </div>
        </div>
    </>
  )
}

export default App
