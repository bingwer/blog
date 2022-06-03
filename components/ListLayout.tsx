import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { cls } from '@libs/util';

interface ListLayoutProps {
  children: React.ReactNode[] | React.ReactNode;
}

function ListLayout({ children }: ListLayoutProps) {
  const { pathname } = useRouter();
  const [path, setPath] = useState('');

  useEffect(() => {
    const basepath = pathname.split('/')[1];
    setPath(basepath);
  }, [pathname]);

  return (
    <section className="z-10 mx-auto w-full max-w-4xl px-8 py-10 text-text-dark dark:text-text-white">
      <header>
        <div className="profile h-full w-full items-center space-y-4 md:flex md:justify-between md:space-y-0">
          <div className="avatar flex h-full w-full items-center md:h-40 md:w-40">
            <img
              src="image/avatar.jpeg"
              alt="avatar"
              className="h-24 w-24 rounded-3xl md:h-32 md:w-32"
            />
          </div>
          <div className="intro h-full w-full space-y-4 md:ml-4 md:space-y-2 md:py-0">
            <h2 className="text-lg font-semibold md:text-xl">PolarScript</h2>
            <p className="text-sm font-light md:text-base">
              소개글을 쓸 자리입니다.소개글을 쓸 자리입니다.소개글을 쓸
              자리입니다.소개글을 쓸 자리입니다.소개글을 쓸 자리입니다.소개글을
              쓸 자리입니다.소개글을 쓸 자리입니다.소개글을 쓸 자리입니다.
            </p>
          </div>
        </div>
        <address className="contact mt-4 flex justify-start space-x-3 border-t-2 border-l-mainColor pt-4 dark:border-d-mainColor">
          <a href="https://github.com/bingwer">
            <FontAwesomeIcon
              icon={faGithub}
              className="h-6 w-6 cursor-pointer text-l-mainColor hover:text-l-highlightColor dark:text-d-mainColor dark:hover:text-d-highlightColor md:h-8 md:w-8"
            />
          </a>
          <a href="mailto:nick.lee.5002@gmail.com">
            <FontAwesomeIcon
              icon={faEnvelope}
              className="h-6 w-6 cursor-pointer text-l-mainColor hover:text-l-highlightColor dark:text-d-mainColor dark:hover:text-d-highlightColor md:h-8 md:w-8"
            />
          </a>
        </address>
        <nav className="menu mt-10 select-none border-t-8 border-l-mainColor dark:border-d-mainColor md:border-0">
          <ul className="mx-auto flex justify-between text-base md:w-[35rem] md:justify-center md:text-xl">
            <li
              className={cls(
                'h-full w-full border-l-mainColor py-2 text-center dark:border-d-mainColor md:w-32 md:py-3',
                path === ''
                  ? 'border-b-2 text-l-mainColor dark:text-d-mainColor'
                  : 'border-0',
              )}
            >
              <Link href="/">
                <a>글</a>
              </Link>
            </li>
            <li
              className={cls(
                'h-full w-full border-l-mainColor py-2 text-center dark:border-d-mainColor md:w-32 md:py-3',
                path === 'series'
                  ? 'border-b-2 text-l-mainColor dark:text-d-mainColor'
                  : 'border-0',
              )}
            >
              <Link href="/series">
                <a>연재</a>
              </Link>
            </li>
            <li
              className={cls(
                'h-full w-full border-l-mainColor py-2 text-center dark:border-d-mainColor md:w-32 md:py-3',
                path === 'about'
                  ? 'border-b-2 text-l-mainColor dark:text-d-mainColor'
                  : 'border-0',
              )}
            >
              <Link href="/about">
                <a>소개</a>
              </Link>
            </li>
          </ul>
        </nav>
      </header>
      <main className="min-h-[30rem]">{children}</main>
    </section>
  );
}

export default ListLayout;
