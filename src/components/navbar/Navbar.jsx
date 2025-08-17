import styles from "./Navbar.module.css";
import Button from "../button/Button";
import { useEffect, useState } from "react";
// ✅ 1. Import Link and remove useNavigate
import { Link } from "react-router-dom";
import { useTheme } from "../../ThemeContext";

import LightThemeIcon from "../svgicons/lightThemeIcon"
import DarkThemeIcon from "../svgicons/darkThemeIcon"
import LogoIcon from "../svgicons/logoIcon"

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
    { name: "Item 3", path: "/item3" },
    { name: "Item 4", path: "/item4" },
];

export default function Navbar() {
    const { theme: themeSelected, setTheme: setThemeSelected } = useTheme();
    const [navItemSelected, setNavItemSelected] = useState(navItemsArr[0].name);
    return (
        <nav className={styles.navbar}>
            <div className={styles.logoBit}>
                <LogoIcon dim={30}/>
                <div className={`${styles.navItem} ${styles.logo}`}>PRISM</div>
            </div>

            <div className={styles.pageRoutes}>
                {navItemsArr.map((navItem) => {
                    if (navItem.name === navItemSelected) {
                        return (
                            <Link key={navItem.name} to={navItem.path}>
                                <Button btnText={navItem.name} />
                            </Link>
                        );
                    }
                    return (
                        <Link
                            key={navItem.name}
                            to={navItem.path}
                            className={styles.navItem}
                            onClick={() => setNavItemSelected(navItem.name)}
                        >
                            {navItem.name}
                        </Link>
                    );
                })}
            </div>

            <div className={styles.pageCtrls}>
                <ToggleTheme themeSelected={themeSelected} setThemeSelected={setThemeSelected} />
            </div>
        </nav>
    );
}