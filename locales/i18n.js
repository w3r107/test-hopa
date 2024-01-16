import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "./en/common.json";
import he from "./he/common.json";
import ru from "./ru/common.json";
import ar from "./ar/common.json";
import es from "./es/common.json";

i18next
  .use(initReactI18next) // passes i18n down to react-i18next
  .use(LanguageDetector)
  // .use(HttpApi)
  .init({
    supportedLngs: ["he", "en", "ru", "ar","es"],
    fallbackLng: "he",
    debug: false,
    defaultLocale: "he",
    // the translations
    // (tip move them in a JSON file and import them,
    // or even better, manage them via a UI: https://react.i18next.com/guides/multiple-translation-files#manage-your-translations-with-a-management-gui)
    resources: {
      he: { translation: he },
      en: { translation: en },
      ru: { translation: ru },
      ar: { translation: ar },
      es: { translation: es },
    },
    detection: {
      order: ["cookie", "path", "htmlTag"],
      caches: ["cookie"],
    },

    interpolation: {
      escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
    },
    // backend: {
    //   loadPath: "./locales/{{lng}}/common.json",
    // },
  });
