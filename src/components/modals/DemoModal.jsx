import Modal from "../common/Modal.jsx";
import styles from "./DemoModal.module.css";

export default function DemoModal({ open, onClose }) {
  return (
    <Modal open={open} onClose={onClose} title="Prism — Watch Demo" width={960}>
      <div className={styles.frame}>
        <video src="/demo.mp4" controls playsInline />
      </div>
    </Modal>
  );
}
