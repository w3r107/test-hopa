import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { setLanguage, useMaterialUIController } from "context";
import LanguageIcon from "@mui/icons-material/Language";
import CloseIcon from "@mui/icons-material/Close";
import Cookies from "js-cookie";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const LanguageSelector = () => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const { t } = useTranslation();
  const [{ language }] = useMaterialUIController();

  const isRTL = language === "he" || language === "ar";

  return (
    <div
      style={
        isRTL
          ? {
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 9999,
            display: "flex",
            flexDirection: "row",
            background: "red",
            height: "0px",
          }
          : {
            position: "fixed",
            top: 0,
            right: 0,
            zIndex: 9999,
            display: "flex",
            flexDirection: "row",
            background: "red",
            height: "0px",
          }
      }
    >
      <div
        style={{
          transition: "0.1s ease-in-out",
        }}
        onClick={() => setDrawerOpen(false)}
      />
      <div
        onClick={() => setDrawerOpen(true)}
        style={
          isRTL
            ? {
              width: isDrawerOpen ? 0 : "60px",
              visibility: isDrawerOpen ? "hidden" : "visible",
              height: "50px",
              background: "white",
              boxShadow: 100,
              cursor: "pointer",
              borderTopRightRadius: "20px",
              borderBottomRightRadius: "20px",
              marginTop: "80px",
              border: "1px solid lightgrey",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              // transition: "0.15s all ease-in-out",
              color: "black",
              zIndex: 99,
              overflow: "hidden",
              "&:hover": {
                width: "75px",
              },
              boxShadow: "rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px"
            }
            : {
              width: isDrawerOpen ? 0 : "60px",
              visibility: isDrawerOpen ? "hidden" : "visible",
              height: "50px",
              background: "white",
              boxShadow: 100,
              cursor: "pointer",
              borderTopLeftRadius: "20px",
              borderBottomLeftRadius: "20px",
              marginTop: "80px",
              border: "1px solid lightgrey",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              // transition: "0.15s all ease-in-out",
              color: "black",
              zIndex: 99,
              overflow: "hidden",
              "&:hover": {
                width: "75px",
              },
              boxShadow: "rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px"
            }
        }
      >
        <LanguageIcon />
      </div>
      <div
        style={{
          height: "100vh",
          width: isDrawerOpen ? "300px" : "0px",
          maxWidth: "100vw",
          background: "white",
          overflow: "hidden",
          boxShadow: 20,
          zIndex: 101,
          // transition: "0.25s all ease-in-out",
          boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "1.2rem",
          }}
        >
          <p className=" text-white font-kanit-regular text-[20px]">
            {t("SETTINGMODAL.SELECT_LANGUAGE_TO_SHOW")}
          </p>
          <CloseIcon
            style={{ cursor: "pointer" }}
            onClick={() => setDrawerOpen(false)}
          />
        </div>
        <Languages setDrawerOpen={setDrawerOpen} />
      </div>
    </div>
  );
};

const Languages = ({ setDrawerOpen }) => {
  const { t: translate } = useTranslation();
  const [{ language }] = useMaterialUIController();

  const LANGUAGES = [
    {
      flag: "🇮🇱",
      name: translate('SETTINGMODAL.HEBREW'),
      shorthand: "he",
    },
    {
      flag: "🇺🇸",
      name: translate('SETTINGMODAL.ENGLISH'),
      shorthand: "en",
    },
    {
      flag: "🇷🇺",
      name: translate('SETTINGMODAL.RUSSIAN'),
      shorthand: "ru",
    },
    {
      flag: "🇦🇪",
      name: translate('SETTINGMODAL.ARABIC'),
      shorthand: "ar",
    },
    {
      flag: "🇪🇸",
      name: translate('SETTINGMODAL.SPANISH'),
      shorthand: "es",
    },
    {
      flag: "fr",
      name: translate('SETTINGMODAL.FRENCH'),
      shorthand: "fr",
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        width: "100%",
        padding: "1.2rem",
      }}
    >
      <Language
        language={LANGUAGES[0]}
        currentLanguage={language}
        setDrawerOpen={setDrawerOpen}
      />
      <Language
        language={LANGUAGES[1]}
        currentLanguage={language}
        setDrawerOpen={setDrawerOpen}
      />
      <Language
        language={LANGUAGES[2]}
        currentLanguage={language}
        setDrawerOpen={setDrawerOpen}
      />
      <Language
        language={LANGUAGES[3]}
        currentLanguage={language}
        setDrawerOpen={setDrawerOpen}
      />
      <Language
        language={LANGUAGES[4]}
        currentLanguage={language}
        setDrawerOpen={setDrawerOpen}
      />
      <Language
        language={LANGUAGES[5]}
        currentLanguage={language}
        setDrawerOpen={setDrawerOpen}
      />
    </div>
  );
};

const Language = ({ language: { shorthand, name, flag }, setDrawerOpen }) => {
  const { t: translate, i18n } = useTranslation();
  const [{ language }, MUIDispatch] = useMaterialUIController();

  const isRTL = language === "he" || language === "ar";

  const langaugeToggle = (lang) => {
    i18n.changeLanguage(lang);
    setLanguage(MUIDispatch, lang);
    Cookies.set("i18next", lang, { expires: 10000000 });
    setDrawerOpen(false);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        width: "100%",
        padding: "8px 12px",
        marginTop: "4px",
        marginBottom: "4px",
        background: "#fafafa",
        borderRadius: 3,
        cursor: "pointer",
        justifyContent: "space-between",
        // transition: "0.25s all ease-in-out",
        "&:hover": {
          background: "#f0f0f0",
        },
      }}
      onClick={() => {
        if (shorthand !== language) {
          langaugeToggle(shorthand);
        }
      }}
    >
      <div
        className="flex flex-row"
        style={{ display: "flex", alignItems: "center" }}
      >
        <p
          style={
            isRTL
              ? { marginLeft: "10px" }
              : { fontSize: "20px", marginRight: "10px" }
          }
        >
          {flag}
        </p>
        <p
          style={{ fontSize: "16px" }}
          className=" text-black font-spectral-regular text-[16px] px-2"
        >
          {name}
        </p>
        {shorthand === language && (
          <CheckCircleIcon
            style={
              isRTL
                ? { color: "green", marginRight: "10px" }
                : { color: "green", marginLeft: "10px" }
            }
          />
        )}
      </div>
    </div>
  );
};

export default LanguageSelector;
