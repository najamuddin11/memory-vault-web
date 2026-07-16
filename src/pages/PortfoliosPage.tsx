import { memo, Suspense } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePortfolios } from "../hooks/usePortfolios";
import PortfolioList from "../components/main/PortfolioList";
import PortfolioGridShimmer from "../components/main/PortfolioList/PortfolioGridShimmer";
import ParticleLayout from "../components/layout/ParticleLayout";
import PageLoader from "../components/general/PageLoader";
import ErrorState from "../components/general/ErrorState";
import Header from "../components/layout/Header";

gsap.registerPlugin(ScrollTrigger);

const PortfolioPage = () => {
  const {
    data: portfolios,
    isLoading,
    isError,
    error,
    refetch,
  } = usePortfolios();

  if (isLoading) {
    return (
      <PageLoader header="secondary">
        <PortfolioGridShimmer />
      </PageLoader>
    );
  }

  if (isError || !portfolios) {
    return (
      <ErrorState
        detail={error instanceof Error ? error.message : undefined}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div>
      <Suspense
        fallback={
          <PageLoader header="secondary">
            <PortfolioGridShimmer />
          </PageLoader>
        }
      >
        <ParticleLayout fixed>
          <Header
            eyebrow="MY WORK"
            title=""
            titleHighlight="Projects"
            description="A collection of projects I've designed and built over 6+ years as a frontend developer - from SaaS platforms to marketing sites - using React, TypeScript, and modern tooling to turn ideas into fast, polished products."
            secondary
          />
          <PortfolioList porfolios={portfolios} />
        </ParticleLayout>
      </Suspense>
    </div>
  );
};

export default memo(PortfolioPage);
