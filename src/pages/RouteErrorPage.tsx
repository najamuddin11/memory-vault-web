import { memo } from "react";
import { useRouteError, isRouteErrorResponse } from "react-router";
import ErrorState from "../components/general/ErrorState";

const RouteErrorPage = () => {
  const error = useRouteError();

  const detail = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
      ? error.message
      : undefined;

  return (
    <ErrorState
      title="This page hit a snag"
      description="Something broke while loading this page. Try again, or head back home."
      detail={detail}
      onRetry={() => window.location.reload()}
    />
  );
};

export default memo(RouteErrorPage);
