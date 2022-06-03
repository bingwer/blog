import { useSelector } from '@store';
import React, { useEffect, useRef, useState } from 'react';
import Header from '@components/Header';
import { cls } from '@libs/util';
import ReactScrollWheelHandler from 'react-scroll-wheel-handler';
import { useDispatch } from 'react-redux';
import { commonActions } from '@store/common';

interface LayoutProps {
  children: React.ReactNode[];
}
const hiddenStyle = {
  'z-index': '-20',
  dislay: 'hidden',
};

const visibleStyle = {
  'z-index': '-10',
  display: 'block',
};

function Layout({ children }: LayoutProps) {
  const dispatch = useDispatch();
  const scrollState = useRef('down');
  const [isAnim, setIsAnim] = useState(false);
  const initWrap = useRef<HTMLDivElement>(null);
  const darkWrap = useRef<HTMLDivElement>(null);
  const lightkWrap = useRef<HTMLDivElement>(null);
  const darkMode = useSelector(state => state.commmon.darkMode);

  useEffect(() => {
    if (isAnim) return;
    if (
      darkWrap.current instanceof HTMLDivElement &&
      lightkWrap.current instanceof HTMLElement
    ) {
      if (darkMode) {
        darkWrap.current.classList.add('animate-darkModeChange');
        lightkWrap.current.style.zIndex = hiddenStyle['z-index'];
        darkWrap.current.style.zIndex = visibleStyle['z-index'];
        darkWrap.current.style.display = visibleStyle.display;
      } else {
        lightkWrap.current.classList.add('animate-darkModeChange');
        darkWrap.current.style.zIndex = hiddenStyle['z-index'];
        lightkWrap.current.style.zIndex = visibleStyle['z-index'];
        lightkWrap.current.style.display = visibleStyle.display;
      }
    }
  }, [darkMode, isAnim]);

  return (
    <ReactScrollWheelHandler
      upHandler={() => {
        if (scrollState.current === 'down') {
          dispatch(commonActions.set_scrollUp());
          scrollState.current = 'up';
        }
      }}
      downHandler={() => {
        if (scrollState.current === 'up') {
          dispatch(commonActions.set_scrollDown());
          scrollState.current = 'down';
        }
      }}
      timeout={15}
      wheelConfig={[7, 10, 0.05, 1]}
    >
      <div className={cls('relative h-full', darkMode ? 'dark' : 'light')}>
        <div
          className="absolute -z-10 min-h-full w-full bg-l-backgroundColor dark:bg-d-backgroundColor"
          ref={initWrap}
        />
        <div
          className="absolute -z-20 min-h-full w-full bg-l-backgroundColor"
          ref={lightkWrap}
          onAnimationStart={() => {
            setIsAnim(true);
          }}
          onAnimationEnd={() => {
            if (darkWrap.current instanceof HTMLDivElement) {
              darkWrap.current.style.display = 'none';
              if (initWrap.current instanceof HTMLDivElement) {
                initWrap.current.remove();
              }
              setIsAnim(false);
            }
          }}
        />
        <div
          className="absolute -z-20 hidden min-h-full w-full bg-d-backgroundColor"
          ref={darkWrap}
          onAnimationStart={() => {
            setIsAnim(true);
          }}
          onAnimationEnd={() => {
            if (lightkWrap.current instanceof HTMLDivElement) {
              lightkWrap.current.style.display = 'none';
              if (initWrap.current instanceof HTMLDivElement) {
                initWrap.current.remove();
              }
              setIsAnim(false);
            }
          }}
        />
        <div className="bigWrapper relative flex min-h-screen w-full flex-col justify-between px-0">
          <Header isAnim={isAnim} />
          {children}
          <div className="bottom-area">
            <div className="container z-10 my-0 mx-auto flex w-full max-w-4xl items-center justify-between py-0 px-8">
              <a
                href="https://www.flaticon.com/free-icons/polar-bear"
                title="polar bear icons"
              >
                Polar bear icons created by smalllikeart - Flaticon
              </a>
            </div>
          </div>
        </div>
      </div>
    </ReactScrollWheelHandler>
  );
}

export default Layout;
