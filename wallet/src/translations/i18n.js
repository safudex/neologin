import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from './en.json'
import zh from './zh.json'

i18n
    .use(initReactI18next)
    .init({
        // we init with resources
        resources: {
            en: en,
            zh: zh
        },
        fallbackLng: "en",
        debug: true,

        // have a common namespace used around the full app
        ns: ["common", "inverse"],
        defaultNS: "common",

        keySeparator: false, // we use content as keys

        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
