import React, { memo } from "react";
import styles from "./contact.module.css";
import Icon from "../../general/Icon";
import type ContactDataType from "../../../models/state-types/ContactDataType";

interface ContactCardPropType {
  data: ContactDataType;
}

const ContactCard: React.FC<ContactCardPropType> = (props) => {
  const { data } = props;
  return (
    <div className={`${styles.contact_card}`}>
      <a href={data.link} target="_blank" rel="noopener noreferrer">
        <Icon
          source={{
            iconLight: import.meta.env.VITE_FILES_PATH + data.iconLight,
            iconDark: import.meta.env.VITE_FILES_PATH + data.iconDark,
          }}
          text={"icons"}
        />
      </a>
      <div className={`${styles.contact_card_text}`}>
        {data.text.map((item) => (
          <p key={item}>{item}</p>
        ))}
      </div>
    </div>
  );
};

export default memo(ContactCard);
