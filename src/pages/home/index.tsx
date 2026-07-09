import { useRef, memo, lazy, Suspense } from "react";
import { useHomeData } from "../../hooks/useHomeData";

const Header = lazy(() => import("../../components/layout/Header"));
const Services = lazy(() => import("../../components/main/home/Services"));
const Portfolio = lazy(() => import("../../components/main/home/Portfolio"));
const WorkExperience = lazy(
  () => import("../../components/main/home/WorkExperience"),
);
const Education = lazy(() => import("../../components/main/home/Education"));
const Contact = lazy(() => import("../../components/main/home/Contact"));

const Loader = () => (
  <div style={{ textAlign: "center", padding: "50px 0" }}>
    <p>Loading...</p>
  </div>
);

const ErrorMessage = ({ message }: { message: string }) => (
  <div style={{ textAlign: "center", padding: "50px 0" }}>
    <p>Something went wrong.</p>
    <small>{message}</small>
  </div>
);

const Home = () => {
  const portfolioPopup = useRef<HTMLDivElement>(null);

  const { data: homeData, isLoading, isError, error } = useHomeData();

  // Don't render anything until API data is loaded
  if (isLoading) {
    return <Loader />;
  }

  // Show error instead of rendering incomplete UI
  if (isError || !homeData) {
    return (
      <ErrorMessage
        message={error instanceof Error ? error.message : "Unknown error"}
      />
    );
  }

  return (
    <div>
      <div ref={portfolioPopup} />

      <Suspense fallback={<Loader />}>
        <Header intro={homeData.introData[0]} />
        <Services services={homeData.serviceData} />
        <Portfolio portfolio={homeData.portfolioData} />
        <WorkExperience experience={homeData.workExperienceData} />
        <Education
          education={homeData.educationData}
          skills={homeData.skillsData}
        />
        <Contact contact={homeData.contactData} />
      </Suspense>
    </div>
  );
};

export default memo(Home);
