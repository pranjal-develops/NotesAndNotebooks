// import { BsMoonStarsFill, BsSunFill } from 'react-icons/bs';
// import { useDispatch, useSelector } from 'react-redux';
// import type { RootState } from '../store/store';
// import { setThemePreference } from '../store/slice/uiSlice';
// import { IconButton } from './ui/Primitives';

// const ThemeToggle = () => {
//   const dispatch = useDispatch();
//   const { themeMode } = useSelector((state: RootState) => state.ui);

//   const toggleTheme = () => {
//     dispatch(setThemePreference(themeMode === 'dark' ? 'light' : 'dark'));
//   };

//   return (
//     <IconButton
//       onClick={toggleTheme}
//       aria-label={`Switch to ${themeMode === 'dark' ? 'light' : 'dark'} theme`}
//       className="rounded-xl border-0 bg-transparent shadow-none hover:bg-slate-100 dark:hover:bg-slate-800"
//     >
//       <span className="flex items-center justify-center text-slate-600 dark:text-slate-100">
//         {themeMode === 'dark' ? <BsSunFill size={16} /> : <BsMoonStarsFill size={16} />}
//       </span>
//     </IconButton>
//   );
// };

// export default ThemeToggle;
