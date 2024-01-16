// Next Imports
import Document, { Html, Head, Main, NextScript } from "next/document";

// Imports from Emotion - For Caching and Cache Servers
import createCache from "@emotion/cache";
import createEmotionServer from "@emotion/server/create-instance";

// Document Layout for all of the pages - since all pages are client-side-rendered
class MyDocument extends Document {
  render() {
    return (
      // Marking the language as en (English) or he (Hebrew)
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <meta name="theme-color" content="#171717" />
          {/* Google Font Imports */}
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
          />
          <link
            href="https://fonts.googleapis.com/css?family=Material+Icons|Material+Icons+Outlined|Material+Icons+Two+Tone|Material+Icons+Round|Material+Icons+Sharp&display=swap"
            rel="stylesheet"
          />

          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Arimo&family=Assistant&family=Heebo&family=Open+Sans&family=Rubik&family=Tinos&family=Varela+Round&display=swap"
            rel="stylesheet"
          />

          {/* Any Stlye Tags to be Used by Emotion */}
          {this.props.emotionStyleTags}
        </Head>
        <body>
          {/* Main Component - It contains our app */}
          <Main />
          {/* Next Script Instance Initialization - for Fast Refresh and other utilities */}
          <NextScript />
        </body>
      </Html>
    );
  }
}

// Get Initial Props marks the comonent as Server-side-rendered and receives a prop of Context
MyDocument.getInitialProps = async (ctx) => {
  // Getting the original page renderer for the current context
  const originalRenderPage = ctx.renderPage;

  // Creating Emotion Cache for CSS
  const cache = createCache({ key: "css", prepend: true });
  // Creating Emotion Server for Caching
  const { extractCriticalToChunks } = createEmotionServer(cache);

  // Call the Original Page Renderer and passing our custom app with emotion cache in `enhanceApp` prop
  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App) =>
        function EnhanceApp(props) {
          return <App emotionCache={cache} {...props} />;
        },
    });

  // Getting the original initial props of the super class `Document`
  const initialProps = await Document.getInitialProps(ctx);

  // Extracting styles for the default HTML tags
  const emotionStyles = extractCriticalToChunks(initialProps.html);

  // Appending the emotion styles to the default styles to create emotion style tags (to be used in the above Document Layout Class Component)
  const emotionStyleTags = emotionStyles.styles.map((style) => (
    <style
      data-emotion={`${style.key} ${style.ids.join(" ")}`}
      key={style.key}
      dangerouslySetInnerHTML={{ __html: style.css }}
    />
  ));

  // Return the props
  return {
    ...initialProps,
    emotionStyleTags,
  };
};

export default MyDocument;
