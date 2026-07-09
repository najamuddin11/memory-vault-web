import type { CarouselItemType } from "../component-types/CarouselItemType";

export default interface PortfolioDataType {
  id: number;
  featured?: boolean;
  title: string;
  companyBuiltWith: string;
  desc: string;
  projectColor?: string;
  projectText?: string;
  outcome?: string;
  link?: string;
  moreInfoLink?: string;
  projectLogo?: string;
  image: string;
  status: string;
  carousel: CarouselItemType[];
  skills: string[];
}
