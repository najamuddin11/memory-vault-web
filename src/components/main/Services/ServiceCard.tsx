import styles from "./serviceCard.module.css";
import Icon from "../../general/Icon";
import type ServiceDataType from "../../../models/state-types/ServiceDataType";
import { memo } from "react";

interface ServiceCardPropType {
  data: ServiceDataType;
  setRef?: (el: HTMLDivElement | null) => void;
}

const Card: React.FC<ServiceCardPropType> = ({ data, setRef }) => {
  return (
    <div ref={setRef} className={`hover_color ${styles.service_card}`}>
      <Icon
        source={{
          iconDark: import.meta.env.VITE_FILES_PATH + data.iconDark,
          iconLight: import.meta.env.VITE_FILES_PATH + data.iconLight,
        }}
        text={`${data.title} icon`}
        center={true}
      />
      <h4 className={styles.service_card_title}>{data.title}</h4>
      <div className={styles.service_card_detail}>{data.details}</div>
    </div>
  );
};

export default memo(Card);
