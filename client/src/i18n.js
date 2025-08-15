import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// English translations
import enHome from './locales/en/home.json';
import enLogin from './locales/en/login.json';
import enDashboard from './locales/en/dashboard.json';
import enSidebar from './locales/en/sidebar.json';
import enAddChild from './locales/en/addChild.json';
import enViewChildren from './locales/en/viewChildren.json';
import enAddMother from './locales/en/addMother.json';
import enViewMothers from './locales/en/viewMothers.json';
import enProfile from './locales/en/profile.json';
import enUserProfile from './locales/en/userProfile.json';

// Nepali translations
import neHome from './locales/ne/home.json';
import neLogin from './locales/ne/login.json';
import neDashboard from './locales/ne/dashboard.json';
import neSidebar from './locales/ne/sidebar.json';
import neAddChild from './locales/ne/addChild.json';
import neViewChildren from './locales/ne/viewChildren.json';
import neAddMother from './locales/ne/addMother.json';
import neViewMothers from './locales/ne/viewMothers.json'
import neProfile from './locales/ne/profile.json';
import neUserProfile from './locales/ne/userProfile.json';
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        home: enHome,
        login: enLogin,
        dashboard: enDashboard,
        sidebar: enSidebar,
        addChild: enAddChild,
        viewChildren: enViewChildren,
        addMother: enAddMother,
        viewMothers: enViewMothers,
        profile: enProfile,
        UserProfile: enUserProfile,       },
      ne: {
        home: neHome,
        login: neLogin,
        dashboard: neDashboard,
        sidebar: neSidebar,
        addChild: neAddChild,
        viewChildren: neViewChildren,
        addMother: neAddMother,
        viewMothers: neViewMothers,
        profile: neProfile,
        UserProfile: neUserProfile,       },
    },
    lng: 'ne', // Default language: Nepali
    fallbackLng: 'en', // Fallback to English
    ns: ['home', 'login', 'dashboard', 'sidebar', 'addChild', 'viewChildren','addMother','viewMothers'], // Include viewChildren namespace
    defaultNS: 'home',
    interpolation: {
      escapeValue: false, // React handles XSS
    },
    react: {
      useSuspense: false, // Disable suspense
    },
  });

export default i18n;