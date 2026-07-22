// import { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import type { ReactNode } from 'react';
// import type { RootState } from '../store/store';
// import { syncSystemTheme } from '../store/slice/uiSlice';

// const THEME_META_NAME = 'theme-color';

// const ensureThemeMetaTag = () => {
//   let metaTag = document.querySelector<HTMLMetaElement>(`meta[name="${THEME_META_NAME}"]`);

//   if (!metaTag) {
//     metaTag = document.createElement('meta');
//     metaTag.name = THEME_META_NAME;
//     document.head.appendChild(metaTag);
//   }

//   return metaTag;
// };

// type ThemeProviderProps = {
//   children: ReactNode;
// };

// const ThemeProvider = ({ children }: ThemeProviderProps) => {
//   const dispatch = useDispatch();
//   const { themeMode, themePreference } = useSelector((state: RootState) => state.ui);

//   useEffect(() => {
//     const root = document.documentElement;
//     root.classList.toggle('dark', themeMode === 'dark');
//     root.style.colorScheme = themeMode;
//     document.body.dataset.theme = themeMode;

//     const metaTag = ensureThemeMetaTag();
//     metaTag.content = themeMode === 'dark' ? '#09090f' : '#f8fafc';
//   }, [themeMode]);

//   useEffect(() => {
//     if (themePreference === 'system') {
//       window.localStorage.removeItem('theme-preference');
//     } else {
//       window.localStorage.setItem('theme-preference', themePreference);
//     }
//   }, [themePreference]);

//   useEffect(() => {
//     const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
//     const handleSystemThemeChange = () => dispatch(syncSystemTheme());

//     handleSystemThemeChange();
//     mediaQuery.addEventListener('change', handleSystemThemeChange);

//     return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
//   }, [dispatch]);

//   return <>{children}</>;
// };

// export default ThemeProvider;
