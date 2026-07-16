import { useRef, memo, Suspense } from "react";
import { useHomeData } from "../hooks/useHomeData";
import ParticleLayout from "../components/layout/ParticleLayout";
import PageLoader, { ShimmerCardGrid } from "../components/general/PageLoader";
import ErrorState from "../components/general/ErrorState";
import Header from "../components/layout/Header";
import Services from "../components/main/Services";
import HomePortfolio from "../components/main/HomePortfolio";
import WorkExperience from "../components/main/WorkExperience";
import Education from "../components/main/Education";
import Contact from "../components/main/Contact";

const HomeLoadingContent = () => (
  <>
    <ShimmerCardGrid count={3} minWidth="260px" aspectRatio="1 / 1" />
    <ShimmerCardGrid count={4} minWidth="220px" aspectRatio="4 / 3" />
  </>
);

const Home = () => {
  const portfolioPopup = useRef<HTMLDivElement>(null);

  const { data: homeData, isLoading, isError, error, refetch } = useHomeData();

  // Don't render anything until API data is loaded
  if (isLoading) {
    return (
      <PageLoader header="primary">
        <HomeLoadingContent />
      </PageLoader>
    );
  }

  // Show error instead of rendering incomplete UI
  if (isError || !homeData) {
    return (
      <ErrorState
        detail={error instanceof Error ? error.message : undefined}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div>
      <div ref={portfolioPopup} />

      <Suspense
        fallback={
          <PageLoader header="primary">
            <HomeLoadingContent />
          </PageLoader>
        }
      >
        <ParticleLayout fixed>
          <Header
            eyebrow="MY NAME IS"
            title={homeData.introData[0].firstName}
            titleHighlight={homeData.introData[0].lastName}
            img={homeData.introData[0].img}
            description={homeData.introData[0].summary}
          />

          <Services services={homeData.serviceData} />
          <HomePortfolio portfolio={homeData.portfolioData} />
          <WorkExperience experience={homeData.workExperienceData} />
          <Education
            education={homeData.educationData}
            skills={homeData.skillsData}
          />
          <Contact contact={homeData.contactData} />
        </ParticleLayout>
      </Suspense>
    </div>
  );
};

export default memo(Home);
