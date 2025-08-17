import styles from "./Hero.module.css";
import Button from "../button/Button";
import hotAirBaloon from "../../assets/images/hotAirBaloon.webp";
import skyline from "../../assets/images/skyline.webp";
import cloud from "../../assets/images/cloud1.webp";
import cloudAtBack from "../../assets/images/cloudback.webp";
import moon from "../../assets/images/mooon.webp";
import { useState } from "react";
import UploadModal from "../modals/UploadModal.jsx";
import DemoModal from "../modals/DemoModal.jsx";
import { useNavigate } from "react-router-dom";

function HeroText({ children, highlight, color, from, to }) {
  if (!highlight) return children;
  const words = children.split(" ");
  return (
    <div>
      {words.map((word, index) => {
        if (index >= from && index <= to) {
          return (
            <span key={index} style={{ color: color || "hsla(var(--clr-text-secondary))" }}>
              {word}{" "}
            </span>
          );
        }
        return word + " ";
      })}
    </div>
  );
}

function HeroIllus() {
  return (
    <div className={styles.heroIllus}>
      <img src={hotAirBaloon} alt="" className={`${styles.hotAirBaloon} ${styles.heroImg}`} />
      <img src={skyline} className={`${styles.skyline}  ${styles.heroImg}`} />
      <img src={cloud} alt="" className={`${styles.cloud} ${styles.heroImg}`} />
      <img src={cloud} alt="" className={`${styles.cloud2} ${styles.heroImg}`} />
      <img src={cloudAtBack} alt="" className={`${styles.cloud2} ${styles.heroImg}`} />
      <img src={moon} alt="" className={`${styles.moon} ${styles.heroImg}`} />
    </div>
  );
}

export default function Hero() {
  const [openUpload, setOpenUpload] = useState(false);
  const [openDemo, setOpenDemo] = useState(false);
  const nav = useNavigate();

  return (
    <div className={styles.heroContainer}>
      <div className={styles.heroContent}>
        <div className={styles.heading}>
          <div>{"Beyond the Page.".toUpperCase()}</div>
          <HeroText highlight={true} from={1} to={1}>
            {"Deeper Insights.".toUpperCase()}
          </HeroText>
        </div>

        <div className={styles.subHeading}>
          Prism connects the dots across your documents, revealing hidden knowledge and accelerating your research.
        </div>

        <div className={styles.ctaBtns}>
          <div onClick={() => setOpenUpload(true)}>
            <Button btnText={"Start a New Session"} bgColor={"205, 91%, 65%"} />
          </div>
          <div onClick={() => setOpenDemo(true)}>
            <Button btnText={"Watch Demo"} />
          </div>
        </div>
      </div>

      <HeroIllus />

      <UploadModal
        open={openUpload}
        onClose={() => setOpenUpload(false)}
        onReady={() => nav("/workspace")}
      />
      <DemoModal open={openDemo} onClose={() => setOpenDemo(false)} />
    </div>
  );
}
