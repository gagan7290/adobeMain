import styles from "./Navbar.module.css";
import Button from "../button/Button";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../ThemeContext";
import LightThemeIcon from "../svgicons/lightThemeIcon";
import DarkThemeIcon from "../svgicons/darkThemeIcon";
import LogoIcon from "../svgicons/logoIcon";

function ToggleTheme({ themeSelected, setThemeSelected }) {
  return (
    <div className={styles.toggleTheme}>
      <div
        className={`${styles.lightTheme} ${themeSelected === "light" ? styles.selected : ""}`}
        onClick={() => setThemeSelected("light")}
      >
        <LightThemeIcon />
      </div>
      <div
        className={`${styles.darkTheme} ${themeSelected === "purpleTheme" ? styles.selected : ""}`}
        onClick={() => setThemeSelected("purpleTheme")}
      >
        <DarkThemeIcon />
      </div>
    </div>
  );
}

const navItemsArr = [
  { name: "Home", path: "/" },
  { name: "Library", path: "/library" },
  { name: "Workspace", path: "/workspace" },
];

export default function Navbar() {
  const { theme: themeSelected, setTheme: setThemeSelected } = useTheme();
  const [navItemSelected, setNavItemSelected] = useState(navItemsArr[0].name);

  return (
    <nav className={styles.navbar}>
      <div className={styles.logoBit}>
        <LogoIcon dim={30} />
        <div className={`${styles.navItem} ${styles.logo}`}>PRISM</div>
      </div>

      <div className={styles.pageRoutes}>
        {navItemSelected === navItemsArr[0].name ? (
          <Link to={navItemsArr[0].path}><Button btnText="Home" /></Link>
        ) : (
          <Link to="/" className={styles.navItem} onClick={() => setNavItemSelected("Home")}>Home</Link>
        )}

        <Link
          to="/library"
          className={navItemSelected === "Library" ? "" : styles.navItem}
          onClick={() => setNavItemSelected("Library")}
        >
          {navItemSelected === "Library" ? <Button btnText="Library" /> : "Library"}
        </Link>

        <Link
          to="/workspace"
          className={navItemSelected === "Workspace" ? "" : styles.navItem}
          onClick={() => setNavItemSelected("Workspace")}
        >
          {navItemSelected === "Workspace" ? <Button btnText="Workspace" /> : "Workspace"}
        </Link>
      </div>

      <div className={styles.pageCtrls}>
        <ToggleTheme themeSelected={themeSelected} setThemeSelected={setThemeSelected} />
      </div>
    </nav>
  );
}
