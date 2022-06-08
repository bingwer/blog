import { useEffect, useState } from 'react';

const useWindowWidth = (throttleTime: number) => {
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    let timer: null | NodeJS.Timeout = null;
    const updateWidth = () => {
      if (!timer) {
        timer = setTimeout(() => {
          timer = null;
          setWindowWidth(window.innerWidth);
        }, throttleTime);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, [throttleTime]);

  return windowWidth;
};

export default useWindowWidth;
