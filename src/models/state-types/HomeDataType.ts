import type ContactDataType from "./ContactDataType";
import type EducationDataType from "./EducationDataType";
import type IntroDataType from "./IntroDataType";
import type PortfolioDataType from "./PortfolioDataType";
import type ServiceDataType from "./ServiceDataType";
import type SkillsDataType from "./SkillsDataType";
import type TestimonialsDataType from "./TestimonialDataType";
import type WorkExperienceDataType from "./WorkExperienceDataType";

export default interface HomeDataType {
  introData: IntroDataType[];
  serviceData: ServiceDataType[];
  portfolioData: PortfolioDataType[];
  workExperienceData: WorkExperienceDataType[];
  testimonialsData: TestimonialsDataType[];
  educationData: EducationDataType[];
  skillsData: SkillsDataType[];
  contactData: ContactDataType[];
}
