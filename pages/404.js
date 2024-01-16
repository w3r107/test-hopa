// Next Imports
import Router from "next/router";

const _404 = () => {
  // Function to redirect to the Menu
  const redirect = () => Router.push("/dashboard");

  return (
    <div
      style={{
        height: "100vh",
        width: "100%",

        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <h1>404</h1>
      <h5>Page Not Found</h5>
      <button
        style={{
          border: "1px solid #171717",
          background: "#FAFAFA",
          borderRadius: 5,
          padding: 12,
          margin: 10,
          cursor: "pointer",
        }}
        onClick={redirect}
      >
        Go to Dashboard
      </button>
    </div>
  );
};

export default _404;
