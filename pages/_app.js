// React Imports
import { useState, useEffect, useMemo } from "react";

// Redux imports
import Store from "store/store";
import { Provider } from "react-redux";

// Next Imports
import Head from "next/head";
import { useRouter } from "next/router";
import { appWithTranslation, useTranslation } from "next-i18next";

// External Package Imports
import { ToastContainer } from "react-toastify";
import rtlPlugin from "stylis-plugin-rtl";
import Cookies from "js-cookie";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";

// MUI Imports
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

// Local Component Imports
import { Loader, Sidenav, Configurator } from "/components";

// import Script from "next/script";

// Context API Imports
import {
    MaterialUIControllerProvider,
    useMaterialUIController,
    setMiniSidenav,
    setDirection,
} from "/context";

// Asset Imports
import theme from "/assets/theme";
import themeRTL from "/assets/theme/theme-rtl";
import themeDark from "/assets/theme-dark";
import themeDarkRTL from "/assets/theme-dark/theme-rtl";
import favicon from "/assets/images/favicon.png";
import appleIcon from "/assets/images/apple-icon.png";
import brandWhite from "/assets/images/logo-ct.png";
import brandDark from "/assets/images/logo-ct-dark.png";

import "react-image-crop/dist/ReactCrop.css";
// CSS Imports for External Packages
import "react-toastify/dist/ReactToastify.css";
import "html5-device-mockups/dist/device-mockups.min.css";

// Global CSS Imports
import "../styles/global.css";

// Vanilla JS Imports
import "../locales/i18n";
import LanguageSelector from "components/elements/LanguageSelector";
import { getCookie } from "utils/cookies";
import { checkLogin } from "store/auth/auth.action";
import { useDispatch } from "react-redux";
import { restaurantActions, useRestaurant } from "store/restaurant/restaurant.slice";


// Caching the CSS
const clientSideEmotionCache = createCache({ key: "css", prepend: true });

// Main Higher Order Component
const Main = ({ Component, pageProps }) => {
    const { data } = useRestaurant();
    const { t: translate } = useTranslation();

    const [
        // The first item is the Context State
        // We're destructuring the items we require
        {
            miniSidenav,
            direction,
            language,
            layout,
            sidenavColor,
            transparentSidenav,
            whiteSidenav,
            darkMode,
        },
        // Dispatch to be used for updating the states
        dispatch,
    ] = useMaterialUIController();

    // Mouse enter state maintained for sidebar
    const [onMouseEnter, setOnMouseEnter] = useState(false);



    // Handle Cookies whenever the language is changed
    useEffect(() => {
        if (language === "he" || language === "ar") {
            // Setting current language in cookie
            Cookies.set("i18next", "he", { expires: 1000 });
            // For Hebrew, the direction will be right-to-left
            setDirection(dispatch, "rtl");
        } else {
            // Setting current language in cookie
            Cookies.set("i18next", "en", { expires: 1000 });
            // For English, the direction will be left-to-right
            setDirection(dispatch, "ltr");
        }
    }, [language]);



    // Event listener for mouse entering the sidebar
    const handleOnMouseEnter = () => {
        // If the sidenav is minimized and the mouse isn't already over it
        if (miniSidenav && !onMouseEnter) {
            // Maximize the sidenav
            setMiniSidenav(dispatch, false);
            // Update state marking mouse is over the sidenav
            setOnMouseEnter(true);
        }
    };

    // Event listener for mouse leaving the sidebar
    const handleOnMouseLeave = () => {
        // If the mouse is over the sidenav
        if (onMouseEnter) {
            // Minimize the sidenav
            setMiniSidenav(dispatch, true);
            // Update state marking mouse is not over the sidenav
            setOnMouseEnter(false);
        }
    };

    // Getting the next router
    const {
        //Destructuring the current route/pathname from the router
        pathname,
    } = useRouter();

    // Scroll to top when the route changes
    useEffect(() => {
        document.documentElement.scrollTop = 0;
        document.scrollingElement.scrollTop = 0;
    }, [pathname]);

    // If the sidebar is transparent in dark mode: show white logo
    // If the sidebar is transparet in light mode: show dark logo
    // If the sidebar is white: show dark logo
    // otherwise show light logo
    const brandIcon =
        transparentSidenav && !darkMode
            ? brandDark
            : whiteSidenav
                ? brandDark
                : brandWhite;

    return (
        <Wrapper direction={direction} darkMode={darkMode}>
            <CssBaseline />
            <div style={{ marginTop: "4rem" }}>
                <Component {...pageProps} />
            </div>
            {typeof window !== "undefined" && (
                <>
                    {layout === "dashboard" && (
                        <>
                            <Sidenav
                                color={sidenavColor}
                                brand={brandIcon}
                                brandName={data.name && data.name[language] + ' - ' + translate("HOPATITLE") || translate("HOPATITLE")}
                                onMouseEnter={handleOnMouseEnter}
                                onMouseLeave={handleOnMouseLeave}
                            />
                            <Configurator />
                        </>
                    )}
                    {layout === "vr" && <Configurator />}
                </>
            )}
            <ToastContainer theme="dark" />
        </Wrapper>
    );
};

const Wrapper = ({ direction, darkMode, children }) => {
    // State for Text/Layout Direction Caching
    const [rtlCache, setRtlCache] = useState(null);

    // Memorizing the layout direction cache
    useMemo(() => {
        // Creatng the cache with key and cache plugin
        const cacheRtl = createCache({
            key: "muirtl",
            stylisPlugins: [rtlPlugin],
        });

        // updating state with cache
        setRtlCache(cacheRtl);
    }, []);

    // Updating the direction attribute of body everytime the direction changes
    useEffect(() => {
        document.body.setAttribute("dir", direction);
    }, [direction]);




    return (
        <>
            {
                direction === "rtl" ? (
                    <CacheProvider value={rtlCache}>
                        <ThemeProvider theme={darkMode ? themeDarkRTL : themeRTL}>
                            {children}
                        </ThemeProvider>
                    </CacheProvider>
                ) : (
                    <ThemeProvider theme={darkMode ? themeDark : theme}>
                        {children}
                    </ThemeProvider>
                )
            }
        </>
    );
};


const App = ({
    Component,
    pageProps,
    emotionCache = clientSideEmotionCache,
}) => {


    return (
        <Provider store={Store}>
            <MaterialUIControllerProvider suppressHydrationWarning={true}>
                <CacheProvider value={emotionCache}>
                    <Head>
                        <meta name="viewport" content="width=device-width, initial-scale=1" />
                        <link rel="shortcut icon" href={favicon.src} />
                        <link rel="apple-touch-icon" sizes="76x76" href={appleIcon.src} />
                        <title>Hopa Admin</title>
                    </Head>
                    {Component.auth ? (
                        <Auth>
                            <Main Component={Component} pageProps={pageProps} />
                            <LanguageSelector />
                        </Auth>
                    ) : (
                        <Main Component={Component} pageProps={pageProps} />
                    )}
                </CacheProvider>
            </MaterialUIControllerProvider>
        </Provider>
    );
};
{/* Add the google tag manager id below */ }
{/* <Script
id="ga4"
strategy="afterInteractive"
dangerouslySetInnerHTML={{
__html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', 'G-');`,
}}
/> */}
{/* Add the google tag manager id below */ }
{/* <Script
strategy="afterInteractive"
src={`https://www.googletagmanager.com/gtag/js?id=G-`}
/> */}
{/* Add the hotjar id below here without inverted commans */ }
{/* <Script
id="hotjar"
strategy="afterInteractive"
dangerouslySetInnerHTML={{
__html: `(function(h,o,t,j,a,r){
h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
h._hjSettings={hjid:'',hjsv:6};
a=o.getElementsByTagName('head')[0];
r=o.createElement('script');r.async=1;
r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
a.appendChild(r);
})(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`,
}}
/> */}



// Constant
const LOADER_MESSAGE = "Loading...";

// Authenticator HOC
const Auth = ({ children }) => {
    // Get the Next Router from the hook
    const router = useRouter();
    const dispatch = useDispatch();

    // State to mark the user as authenticated or unauthenticated
    const [isUserAuthenticated, setUserAuthenticated] = useState(false);

    useEffect(() => {
        // Flag to track if the component is still mounted
        let isMounted = true;
        const ignoredPage = ["/signin"]

        const path = router.pathname;
        console.log(path);
        if (ignoredPage.includes(path)) {
            setUserAuthenticated(true)
            return;
        }

        dispatch(checkLogin())
            .unwrap()
            .then((res) => {
                setUserAuthenticated(true)
                dispatch(restaurantActions.setRole({
                    role: res?.data?.role
                }))
            })
            .catch((err) => {
                router.replace("/signin")
            })

        // if (idToken && isMounted) {
        //     setUserAuthenticated(true);
        // } else {
        //     // Redirect to Signin Page
        //     Router.replace("/signin");
        // }

        // Cleanup function to run when the component unmounts
        return () => {
            isMounted = false;
        };
    }, []);

    // If the user is marked as authenticated, approve
    if (isUserAuthenticated) return children;
    // otherwise show a loader
    else return <Loader message={LOADER_MESSAGE} />;
};

// Export App and Link it to next-i18next
export default appWithTranslation(App);
