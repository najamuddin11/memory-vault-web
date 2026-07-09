import type React from "react";
import type { DropdownItemType } from "../../../models/component-types/DropdownItemType";
import styles from "./drop-down.module.css";
import DropdownItems from "./DropdownItems";

interface DropdownPropsType {
  items: DropdownItemType[];
  onClick: () => void;
  onMouseLeave?: () => void;
}

const Dropdown: React.FC<DropdownPropsType> = (props) => {
  const { items, onClick, onMouseLeave } = props;
  return (
    <div className={styles.dropdown} onMouseLeave={onMouseLeave}>
      {items.map((item) => (
        <DropdownItems key={item.id} data={item} onClick={onClick} />
      ))}
    </div>
  );
};

export default Dropdown;
