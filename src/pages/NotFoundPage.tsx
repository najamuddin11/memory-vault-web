import { memo } from "react";
import ErrorState from "../components/general/ErrorState";

const NotFoundPage = () => {
  return <ErrorState variant="notFound" />;
};

export default memo(NotFoundPage);
