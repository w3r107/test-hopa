// React Imports
import { useEffect } from "react";

// Next Imports
import { useRouter } from "next/router";

// Local Component Imports
import { Loader } from "/components";

// Default Page - to be mapped on `/` route
const Index = () => {
  // Getting the Next Router from the hook
  const router = useRouter();

  useEffect(() => {
    // Redirect to the SigIn Page
    router.replace("/signin");
  }, []);

  // Return Loader - because we don't have anything else to show on `/` route
  return <Loader />;
};

export default Index;
