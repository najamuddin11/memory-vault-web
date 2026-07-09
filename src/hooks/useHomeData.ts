import { useQuery } from "@tanstack/react-query";
import { fetchHomeData } from "../api/homeApi";

/**
 * Fetches home page content from the backend.
 *
 * `initialData` is the current local/static data set. This means the page
 * renders immediately with known-good content (no loading spinner, no
 * layout shift), and then silently revalidates in the background once the
 * real backend endpoint is live. Once your API is serving this data for
 * real, you can delete `helper/homeData.ts` and the `initialData` line below.
 */
export const useHomeData = () =>
  useQuery({
    queryKey: ["homeData"],
    queryFn: fetchHomeData,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
