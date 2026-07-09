import { useRef } from "react";
import styles from "./popup.module.css";

interface PopupPropType {
  handlePopup: () => void;
  children: React.ReactNode;
}

const Popup: React.FC<PopupPropType> = (props) => {
  const popup = useRef<HTMLDivElement | null>(null);
  function closeModalDone(e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation();
    props.handlePopup();
  }

  return (
    <div className={`${styles.popup}`} onClick={closeModalDone} ref={popup}>
      <div
        className={`${styles.popup_content}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`${styles.popup_content_container}`}>
          <div
            className={`hover_size ${styles.popup_close}`}
            onClick={closeModalDone}
          >
            &times;
          </div>
          {props.children}
        </div>
      </div>
    </div>
  );
};

export default Popup;
