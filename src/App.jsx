
import './App.css'
import Hero from './components/hero/Hero';
import Navbar from './components/navbar/Navbar'
import { Outlet , useLocation} from 'react-router-dom'

function App() {
  const location = useLocation();
  return (
    <>
        <div className="mainContainer">
          <div className="navHeroContainer">
              <Navbar/>
              {location.pathname === "/" ? <Hero/> : <Outlet/>}
          </div>
        </div>
    </>
  )
}

export default App
