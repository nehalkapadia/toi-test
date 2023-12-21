import React from "react";
import { useRouter } from "next/router";

const useQueryParams = () => {
  const router = useRouter();
  const { query } = router;
  const queryParams = query;

  const updateQueryParams = (newParams) => {
    if (Object.keys(newParams).length > 0) {
      const updatedParams = { ...queryParams, ...newParams };
      const searchParams = new URLSearchParams(updatedParams);
      const searchString = searchParams.toString();

      router.push({ pathname: router.pathname, search: searchString });
    } else {
      router.push(router.pathname);
    }
  };
  return { queryParams, updateQueryParams };
};

export default useQueryParams;
