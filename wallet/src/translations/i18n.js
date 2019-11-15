import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n
    .use(initReactI18next)
    .init({
        // we init with resources
        resources: {
            en: {
                common: {
                    "tittle": "WALLET",
                    "txt_login": "Login",
                    "menu_settings": "Settings",
                    "menu_issues": "Issues",
                    "info_0founds": "You have nothing:)",
                    "mainNet": "MainNet",
                    "testNet": "TestNet",
                    "subtittle_sendAsset": "SEND ASSET TO",
                    "label_address": "ADDRESS",
                    "label_amount": "AMOUNT",
                    "button_send": "SEND",
                },
                inverse: {
                    "menu_language": "Switch to ZH"
                }
            },
            zh: {
                common: {
                    "tittle": "zh_WALLET",
                    "txt_login": "zh_Login",
                    "menu_settings": "zh_Settings",
                    "menu_issues": "zh_Issues",
                    "info_0founds": "zh_You have nothing:)",
                    "mainNet": "zh_MainNet",
                    "testNet": "zh_TestNet",
                    "subtittle_sendAsset": "zh_SEND ASSET TO",
                    "label_address": "zh_ADDRESS",
                    "label_amount": "zh_AMOUNT",
                    "button_send": "zh_SEND",
                },
                inverse: {
                    "menu_language": "Switch to EN"
                }
            }
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
