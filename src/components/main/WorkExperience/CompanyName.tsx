import React, { memo } from "react";
import styles from "./work-experience.module.css";
import type WorkExperienceDataType from "../../../models/state-types/WorkExperienceDataType";
import CompanyDetails from "./CompanyDetails";

interface CompanyNamePropType {
  item: WorkExperienceDataType;
  size: number;
  setActiveItem: (item: WorkExperienceDataType | null) => void;
  activeItem: WorkExperienceDataType | null;
}

const CompanyName: React.FC<CompanyNamePropType> = (props) => {
  const { item, activeItem, size } = props;
  return (
    <>
      <div
        data-companyname-id={item.id}
        className={`${styles.work_experience_wrapper}`}
        key={item.id}
        data-company-name
        data-company-id={item.id}
      >
        <div
          className={`${styles.work_experience_title} ${
            activeItem && item.id <= activeItem.id
              ? styles.work_experience_active
              : ""
          }`}
        >
          <h3 className={styles.work_experience_company}>{item.company}</h3>
          <p className={styles.work_experience_role}>{item.designation}</p>
          <h6 className={styles.work_experience_duration}>{item.duration}</h6>
          {size < 1024 && <CompanyDetails item={item} />}
        </div>
      </div>
    </>
  );
};

export default memo(CompanyName);
