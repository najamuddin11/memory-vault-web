type WhatIDidItem = {
  title: string;
  desc: string;
};

export default interface WorkExperienceDataType {
  id: number;
  duration: string;
  designation: string;
  company: string;
  location: string;
  icon: string | null;
  companyDescription: string;
  whatIdid: WhatIDidItem[];
  skillsUsed: string[];
  companySite: string | null;
};
