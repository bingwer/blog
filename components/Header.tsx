import { cls } from '@libs/util';
import { useSelector } from '@store';
import { commonActions } from '@store/common';
import React from 'react';
import { useDispatch } from 'react-redux';
import OutsideClickHandler from 'react-outside-click-handler';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useScrollPosition from '@libs/client/useScrollPosition';

interface HeaderProps {
  isAnim: boolean;
}

function Header({ isAnim }: HeaderProps) {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchMode = useSelector(state => state.commmon.searchMode);
  const isScrollUp = useSelector(state => state.commmon.scrollUp);

  const scrollPosition = useScrollPosition(500);

  return (
    <header
      className={cls(
        'sticky z-50 py-3 transition-all',
        isScrollUp ? 'top-0' : '-top-[5.4rem]',
        scrollPosition === 0
          ? 'bg-transparent'
          : 'bg-l-backgroundColor dark:bg-d-backgroundColor',
      )}
    >
      <div className="container relative z-10 my-0 mx-auto flex w-full max-w-4xl select-none items-center justify-between py-0 px-8">
        <Link href="/">
          <a className="logo flex cursor-pointer items-center">
            <img className="mr-2 mt-1 w-14" src="image/logo.png" alt="Logo" />
            <h1 className="text-2xl font-extrabold leading-5 text-text-dark dark:text-white">
              PolarScript
            </h1>
          </a>
        </Link>
        <button
          type="button"
          className="toggle-btn bg-l-darkTwo dark:bg-d-darkTwo absolute top-4 right-24 z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-[50%] border-0 text-xl text-text-dark  outline-none hover:bg-l-hoverColor dark:text-text-white dark:hover:bg-d-mainColor"
          onClick={() => {
            if (isAnim) return;
            dispatch(commonActions.toggle_darkMode());
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="ml-[0.1rem] h-6 w-6 dark:ml-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              className="block dark:hidden"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              className="hidden dark:block"
            />
          </svg>
        </button>
        <div
          className={cls(
            'searchWrap z-20 mt-1 flex justify-end pr-2  md:pr-0',
            searchMode
              ? 'w-56 rounded-2xl border-2 border-l-mainColor bg-l-backgroundColor dark:border-d-mainColor dark:bg-d-backgroundColor md:w-72'
              : 'w-14',
          )}
        >
          {searchMode && (
            <OutsideClickHandler
              display="inline"
              onOutsideClick={() => {
                dispatch(commonActions.set_nonSearchMode());
                router.back();
              }}
            >
              <input
                type="text"
                className={cls(
                  'font-md mt-1 border-none bg-transparent pl-3 text-text-dark focus:outline-none dark:text-text-white md:w-60',
                  searchMode ? 'block' : 'hidden',
                )}
                placeholder="포스트 검색"
              />
            </OutsideClickHandler>
          )}
          <button
            className="hamberger m-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full p-0 text-text-dark focus:outline-none dark:text-text-white"
            type="button"
            onClick={() => {
              dispatch(commonActions.toggle_searchMode());
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
