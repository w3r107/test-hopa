import React from "react";
import SVGIcon from "./SvgIcon";

class CustomErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.log(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div
          style={{
            width: "100vw",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <div style={{ display: "flex", justifyContent: "center", marginBottom:'2rem', textAlign:'center', margin:'20px 10px' }}>
            <SVGIcon />
          </div>
            I'm only human. We have faced some technical issues and we are
            working hard to fix that immediately. Please try to refresh the page
            in a couple of minutes.
        </div>
      );
    }

    return this.props.children;
  }
}

export default CustomErrorBoundary;
