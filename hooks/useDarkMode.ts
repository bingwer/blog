import { useSelector } from '@store';
import { commonActions } from '@store/common';
import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';

type useDarkModeProps = [boolean, (flag: boolean) => void];

export default function useDarkMode(): useDarkModeProps {
  const dispatch = useDispatch();
  const isDarkMode = useSelector(state => state.commmon.darkMode);

  const setDarkMode = useCallback(
    (flag: boolean) => {
      if (flag) {
        dispatch(commonActions.set_darkMode());
      } else {
        dispatch(commonActions.set_lightMode());
      }
    },
    [dispatch],
  );

  useEffect(() => {
    const darkModeQuery =
      window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');

    setDarkMode(darkModeQuery.matches);

    try {
      darkModeQuery.addEventListener('change', e => {
        const detectedDarkMode = e.matches;
        setDarkMode(detectedDarkMode);
      });
    } catch (err) {
      try {
        //safari test 필요
      } catch (err2) {
        console.error(err2);
      }
    }
  }, [setDarkMode]);

  return [isDarkMode, setDarkMode];
}
