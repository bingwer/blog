import { useEffect, useState } from 'react';

const useScrollPosition = (throttleTime: number) => {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    let timer: null | NodeJS.Timeout = null;
    const updatePosition = () => {
      if (!timer) {
        timer = setTimeout(() => {
          timer = null;
          setScrollPosition(window.pageYOffset);
        }, throttleTime);
      }
    };
    updatePosition();
    window.addEventListener('scroll', updatePosition);
    return () => window.removeEventListener('scroll', updatePosition);
  }, [throttleTime]);

  return scrollPosition;
};

export default useScrollPosition;
