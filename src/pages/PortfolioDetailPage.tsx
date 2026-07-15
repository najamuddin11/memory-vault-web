import { memo, Suspense } from "react";
import { useParams } from "react-router";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePortfolioById } from "../hooks/usePortfolioById";
import PortfolioDetails from "../components/main/PortfolioDetails";
import ParticleLayout from "../components/layout/ParticleLayout";
import PageLoader, {
  Shimmer,
  ShimmerPills,
  ShimmerLines,
  ShimmerCardGrid,
} from "../components/general/PageLoader";
import ErrorState from "../components/general/ErrorState";

gsap.registerPlugin(ScrollTrigger);

const DetailLoadingContent = () => (
  <>
    <Shimmer style={{ aspectRatio: "21 / 9", marginBottom: "40px" }} />
    <ShimmerPills count={3} />
    <ShimmerLines lines={3} />
    <ShimmerCardGrid count={4} minWidth="200px" aspectRatio="4 / 3" />
  </>
);

const PortfolioDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const {
    data: portfolio,
    isLoading,
    isError,
    error,
    refetch,
  } = usePortfolioById(id);

  if (isLoading) {
    return (
      <PageLoader header="secondary">
        <DetailLoadingContent />
      </PageLoader>
    );
  }

  if (isError) {
    return (
      <ErrorState
        detail={error instanceof Error ? error.message : undefined}
        onRetry={() => refetch()}
      />
    );
  }

  if (!portfolio) {
    return (
      <ErrorState
        variant="notFound"
        title="Project not found"
        description="We couldn't find a project with that link. It may have been renamed or removed."
      />
    );
  }

  return (
    <div>
      <Suspense
        fallback={
          <PageLoader header="secondary">
            <DetailLoadingContent />
          </PageLoader>
        }
      >
        <ParticleLayout
          fixed
          background={portfolio.projectColor}
          particlesColor={portfolio.projectText}
        >
          <PortfolioDetails data={portfolio} />
        </ParticleLayout>
      </Suspense>
    </div>
  );
};

export default memo(PortfolioDetailPage);
