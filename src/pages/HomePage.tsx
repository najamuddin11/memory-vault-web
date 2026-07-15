import { useRef, memo, lazy, Suspense } from "react";
import { useHomeData } from "../hooks/useHomeData";
import ParticleLayout from "../components/layout/ParticleLayout";
import PageLoader, { ShimmerCardGrid } from "../components/general/PageLoader";
import ErrorState from "../components/general/ErrorState";

const Header = lazy(() => import("../components/layout/Header"));
const Services = lazy(() => import("../components/main/Services"));
const Portfolio = lazy(() => import("../components/main/HomePortfolio"));
const WorkExperience = lazy(() => import("../components/main/WorkExperience"));
const Education = lazy(() => import("../components/main/Education"));
const Contact = lazy(() => import("../components/main/Contact"));

/**
 * Generic homepage content shimmer: this page is a stack of distinct
 * sections (services, portfolio, experience, education), not one uniform
 * shape - so rather than hand-modeling each section, it's a rhythm of the
 * same ShimmerCardGrid primitive at different densities. Good enough to
 * hold the page's weight/scroll-height without a jump, without coupling
 * the loader to every section's real layout.
 */
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
          <Portfolio portfolio={homeData.portfolioData} />
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
