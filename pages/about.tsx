import SubLayout from '@components/SubLayout';
import Three from '@components/Three';
import Link from 'next/link';

function Home() {
  return (
    <SubLayout>
      <div className="showcase-area">
        <div className="z-10 my-0 mx-auto grid w-full max-w-4xl grid-cols-1 items-center justify-center gap-8 px-12 py-10 lg:grid-cols-2 lg:gap-0 lg:py-0">
          <div className="left">
            <div className="big-title text-l-darkOne dark:text-d-darkOne space-y-6 text-3xl font-bold capitalize leading-6">
              <h1>Test Message</h1>
              <h1>Test Message Test Message</h1>
            </div>
            <p className="text text-l-lightOne dark:text-d-lightOne mx-0 mt-8 mb-10 max-w-xl leading-9">
              asdasdasdadadasdasda asdasdasdadadasdasda asdasdasdadadasdasda
              asdasdasdadadasdasda asdasdasdadadasdasda asdasdasdadadasdasda
            </p>
            <div className="cta">
              <Link href="/#">
                <a className="inline-block rounded-2xl bg-l-mainColor py-4 px-8 capitalize text-white shadow-lg transition-[.3s] hover:bg-l-hoverColor dark:bg-d-mainColor dark:hover:bg-l-hoverColor">
                  Get started
                </a>
              </Link>
            </div>
          </div>
          <div className="right relative h-64 w-full transform-none">
            <Three />
          </div>
        </div>
      </div>
    </SubLayout>
  );
}

export default Home;
