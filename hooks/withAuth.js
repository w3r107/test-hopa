// Next Imports
import { useRouter } from "next/router";

const withAuth = (WrappedComponent) => {
  return (props) => {
    // checks whether we are on client / browser or server.
    if (typeof window !== "undefined") {
      const Router = useRouter();

      const isUserAuthenticated = localStorage.getItem("isLoggedIn");

      // If there is no access token we redirect to "/" page.
      // if (!isUserAuthenticated) {

      // Router.replace("/signin");
      // return null;
      // }

      // If this is an accessToken we just render the component that was passed with all its props

      return <WrappedComponent {...props} />;
    }

    // If we are on server, return null
    return null;
  };
};

export default withAuth;
