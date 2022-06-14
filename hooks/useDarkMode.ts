import { useSelector } from '@store';
import { commonActions } from '@store/common';
import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';

type useDarkModeProps = [boolean, (flag: boolean) => void];

export default function useDarkMode(): useDarkModeProps {
  const dispatch = useDispatch();
  const isDarkMode = useSelector(state => state.commmon.darkMode);

  const checkStorage = useCallback(() => {
    const savedTheme = localStorage.getItem('polarScriptTheme');
    return savedTheme;
  }, []);

  const setDarkMode = useCallback(
    (flag: boolean) => {
      try {
        if (flag) {
          localStorage.setItem('polarScriptTheme', 'dark');
          dispatch(commonActions.set_darkMode());
        } else {
          localStorage.setItem('polarScriptTheme', 'light');
          dispatch(commonActions.set_lightMode());
        }
      } catch (e) {
        console.error(e);
      }
    },
    [dispatch],
  );

  useEffect(() => {
    const darkModeQuery =
      window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
    const theme = checkStorage();

    if (checkStorage()) {
      if (theme === 'dark') {
        setDarkMode(true);
      } else {
        setDarkMode(false);
      }
    } else {
      setDarkMode(darkModeQuery.matches);
    }

    try {
      darkModeQuery.addEventListener('change', e => {
        const detectedDarkMode = e.matches;
        setDarkMode(detectedDarkMode);
      });
    } catch (err) {
      console.error(err);
    }
  }, [setDarkMode, checkStorage]);

  return [isDarkMode, setDarkMode];
}
