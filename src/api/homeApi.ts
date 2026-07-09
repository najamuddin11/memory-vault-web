import graphqlClient from "./client";
import { HOME_DATA_QUERY, SEND_MESSAGE_MUTATION } from "../graphql/queries";
import type HomeDataType from "../models/state-types/HomeDataType";
import type FormControlType from "../models/component-types/FormControlType";
import { fetchCsrfToken } from "./csrf";
import type { ContactSubmitPayload } from "../models/component-types/FormControlType";

// GraphQL `ID` fields come back as strings; the rest of the app (e.g.
// WorkExperience/CompanyName.tsx comparing `item.id <= activeItem.id`)
// expects numbers, so every id is normalized back to a number here, in
// one place, right where the data enters the app.
const toNumber = (value: unknown): number => Number(value);

declare const grecaptcha: any;

interface GraphQLHomeDataResponse {
  homeData: {
    introData: Array<Record<string, unknown> & { id: string }>;
    serviceData: Array<Record<string, unknown> & { id: string }>;
    portfolioData: Array<
      Record<string, unknown> & {
        id: string;
        carousel: Array<Record<string, unknown> & { id: string }>;
      }
    >;
    workExperienceData: Array<Record<string, unknown> & { id: string }>;
    testimonialsData: Array<Record<string, unknown> & { id: string }>;
    educationData: Array<Record<string, unknown> & { id: string }>;
    skillsData: Array<Record<string, unknown> & { id: string }>;
    contactData: Array<Record<string, unknown> & { id: string }>;
  };
}

export const fetchHomeData = async (): Promise<HomeDataType> => {
  const { homeData } =
    await graphqlClient.request<GraphQLHomeDataResponse>(HOME_DATA_QUERY);

  console.log(homeData);
  console.log("GraphQL endpoint in use:", import.meta.env.VITE_GRAPHQL_URL);

  return {
    introData: homeData.introData.map((i) => ({
      ...i,
      id: toNumber(i.id),
    })),
    serviceData: homeData.serviceData.map((s) => ({
      ...s,
      id: toNumber(s.id),
    })),
    portfolioData: homeData.portfolioData.map((p) => ({
      ...p,
      id: toNumber(p.id),
      carousel: p.carousel.map((c) => ({ ...c, id: toNumber(c.id) })),
    })),
    workExperienceData: homeData.workExperienceData.map((w) => ({
      ...w,
      id: toNumber(w.id),
    })),
    testimonialsData: homeData.testimonialsData.map((t) => ({
      ...t,
      id: toNumber(t.id),
    })),
    educationData: homeData.educationData.map((e) => ({
      ...e,
      id: toNumber(e.id),
    })),
    skillsData: homeData.skillsData.map((s) => ({ ...s, id: toNumber(s.id) })),
    contactData: homeData.contactData.map((c) => ({
      ...c,
      id: toNumber(c.id),
    })),
  } as HomeDataType;
};

export const sendContactMessage = async (
  contactForm: FormControlType,
): Promise<unknown> => {
  const csrfToken = await fetchCsrfToken();
  // const recaptchaToken = await grecaptcha.execute(
  //   import.meta.env.VITE_RECAPTCHA_SITE_KEY,
  //   { action: "contact" },
  // );

  const input: ContactSubmitPayload = {
    ...contactForm,
    csrfToken,
    // recaptchaToken,
  };

  return await graphqlClient.request(SEND_MESSAGE_MUTATION, { input });
};
