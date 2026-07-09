import React, { memo } from "react";
import styles from "./work-experience.module.css";
import Clip from "../../../general/Clip";
import type WorkExperienceDataType from "../../../../models/state-types/WorkExperienceDataType";

interface CompanyDetailsPropType {
  item: WorkExperienceDataType | null;
}

const CompanyDetails: React.FC<CompanyDetailsPropType> = (props) => {
  const { item } = props;
  return (
    <div className={`${styles.work_experience_right_col} `}>
      <h3 className="d-desk">
        {item?.designation}{" "}
        <a href={item?.companySite ?? ""} target="_blank">
          @<span>{item?.company}</span>
        </a>
      </h3>
      <p className={`d-desk ${styles.work_experience_content}`}>
        {item?.location}
      </p>
      <p className={`d-desk ${styles.work_experience_content}`}>
        {item?.duration}
      </p>
      <div className={`d-desk ${styles.clip_container}`}>
        {item?.skillsUsed?.map((item, index) => (
          <Clip value={item} key={index} />
        ))}
      </div>
      <div className={`d-desk ${styles.work_experience_spliter}`}></div>
      <ul className={`${styles.list}`}>
        {item?.whatIdid?.map((item, index) => (
          <li className={`${styles.work_experience_content}`} key={index}>
            <span className={`${styles.whatIdidTitle}`}>{item.title}:</span>{" "}
            {item.desc}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default memo(CompanyDetails);
