import ListLayout from '@components/ListLayout';
import Image from 'next/image';

function Post() {
  return (
    <ListLayout>
      <div className="xl:rlative h-full">
        <div className="tags mt-2 overflow-x-scroll md:mt-6 xl:absolute xl:z-30 xl:-mt-1 xl:-ml-56">
          <h6 className="mb-3 hidden w-48 border-b-2 border-l-mainColor pb-2 dark:border-d-mainColor xl:block">
            태그 목록
          </h6>
          <nav>
            <ul className="flex h-10 w-max select-none items-center space-x-4 overflow-x-scroll whitespace-nowrap text-xs xl:block xl:h-full xl:w-48 xl:space-x-0 xl:overflow-scroll xl:px-0 xl:text-sm">
              <li className="w-max cursor-pointer rounded-full bg-l-mainColor bg-opacity-10 px-3 py-1 first:ml-0 xl:flex xl:bg-transparent xl:px-0">
                <p className="xl:max-w-[10.5rem] xl:overflow-hidden xl:text-ellipsis">
                  전체보기ㅁㄴㅇㅁㄴㅇasdasdasdasdasd
                </p>
                <p className="hidden xl:block xl:pl-2">(3)</p>
              </li>
              <li className="w-max cursor-pointer rounded-full bg-l-mainColor bg-opacity-10 px-3 py-1 xl:flex xl:bg-transparent xl:px-0">
                <p className="xl:max-w-[10.5rem] xl:overflow-hidden xl:text-ellipsis">
                  전체보기ㅁㄴㅇㅁㄴㅇasdasdasdasdasd
                </p>
                <p className="hidden xl:block xl:pl-2">(3)</p>
              </li>
              <li className="w-max cursor-pointer rounded-full bg-l-mainColor bg-opacity-10 px-3 py-1 xl:flex xl:bg-transparent xl:px-0">
                <p className="xl:max-w-[10.5rem] xl:overflow-hidden xl:text-ellipsis">
                  전체보기ㅁㄴㅇㅁㄴㅇasdasdasdasdasd
                </p>
                <p className="hidden xl:block xl:pl-2">(3)</p>
              </li>
              <li className="w-max cursor-pointer rounded-full bg-l-mainColor bg-opacity-10 px-3 py-1 xl:flex xl:bg-transparent xl:px-0">
                <p className="xl:max-w-[10.5rem] xl:overflow-hidden xl:text-ellipsis">
                  전체보기ㅁㄴ
                </p>
                <p className="hidden xl:block xl:pl-2">(3)</p>
              </li>
            </ul>
          </nav>
        </div>
        <ol>
          <li className="my-6 h-full w-full border-b-2 border-l-mainColor border-opacity-20 last:border-0 dark:border-d-mainColor">
            <Image src="/image/sample.png" width={1280} height={720} />
            <div className="mt-3">
              <h6 className="font-medium md:text-xl">테스트 제목입니다.</h6>
              <div className="mt-2 text-sm font-light md:text-lg">
                글 설명입니다.
              </div>
            </div>
            <ul className="flex h-full w-full select-none flex-wrap content-between items-center py-3 text-xs md:text-sm">
              <li className="mb-2 mr-2 w-max rounded-full bg-l-mainColor bg-opacity-10 px-3 py-1">
                전체보기ㅁㄴㅇㅁㄴㅇasdasdasdasdasd
              </li>
              <li className="mb-2 mr-2 w-max rounded-full bg-l-mainColor bg-opacity-10 px-3 py-1">
                전체보기
              </li>
              <li className="mb-2 mr-2 w-max rounded-full bg-l-mainColor bg-opacity-10 px-3 py-1">
                전체보기ㅁㄴㅇ
              </li>
              <li className="mb-2 mr-2 w-max rounded-full bg-l-mainColor bg-opacity-10 px-3 py-1">
                전체보기ㅁㄴ
              </li>
            </ul>
            <div className="mb-5 text-xs md:text-sm">
              <time>2022년 5월 5일</time>
            </div>
          </li>
          <li className="my-6 h-full w-full border-b-2 border-l-mainColor border-opacity-20 last:border-0 dark:border-d-mainColor">
            <Image src="/image/sample.png" width={1280} height={720} />
            <div className="mt-3">
              <h6 className="font-medium md:text-xl">테스트 제목입니다.</h6>
              <div className="mt-2 text-sm font-light md:text-lg">
                글 설명입니다.
              </div>
            </div>
            <ul className="flex h-full w-full select-none flex-wrap content-between items-center py-3 text-xs md:text-sm">
              <li className="mb-2 mr-2 w-max rounded-full bg-l-mainColor bg-opacity-10 px-3 py-1">
                전체보기ㅁㄴㅇㅁㄴㅇasdasdasdasdasd
              </li>
              <li className="mb-2 mr-2 w-max rounded-full bg-l-mainColor bg-opacity-10 px-3 py-1">
                전체보기
              </li>
              <li className="mb-2 mr-2 w-max rounded-full bg-l-mainColor bg-opacity-10 px-3 py-1">
                전체보기ㅁㄴㅇ
              </li>
              <li className="mb-2 mr-2 w-max rounded-full bg-l-mainColor bg-opacity-10 px-3 py-1">
                전체보기ㅁㄴ
              </li>
            </ul>
            <div className="mb-5 text-xs md:text-sm">
              <time>2022년 5월 5일</time>
            </div>
          </li>
          <li className="my-6 h-full w-full border-b-2 border-l-mainColor border-opacity-20 last:border-0 dark:border-d-mainColor">
            <Image src="/image/sample.png" width={1280} height={720} />
            <div className="mt-3">
              <h6 className="font-medium md:text-xl">테스트 제목입니다.</h6>
              <div className="mt-2 text-sm font-light md:text-lg">
                글 설명입니다.
              </div>
            </div>
            <ul className="flex h-full w-full select-none flex-wrap content-between items-center py-3 text-xs md:text-sm">
              <li className="mb-2 mr-2 w-max rounded-full bg-l-mainColor bg-opacity-10 px-3 py-1">
                전체보기ㅁㄴㅇㅁㄴㅇasdasdasdasdasd
              </li>
              <li className="mb-2 mr-2 w-max rounded-full bg-l-mainColor bg-opacity-10 px-3 py-1">
                전체보기
              </li>
              <li className="mb-2 mr-2 w-max rounded-full bg-l-mainColor bg-opacity-10 px-3 py-1">
                전체보기ㅁㄴㅇ
              </li>
              <li className="mb-2 mr-2 w-max rounded-full bg-l-mainColor bg-opacity-10 px-3 py-1">
                전체보기ㅁㄴ
              </li>
            </ul>
            <div className="mb-5 text-xs md:text-sm">
              <time>2022년 5월 5일</time>
            </div>
          </li>
          <li className="my-6 h-full w-full border-b-2 border-l-mainColor border-opacity-20 last:border-0 dark:border-d-mainColor">
            <Image src="/image/sample.png" width={1280} height={720} />
            <div className="mt-3">
              <h6 className="font-medium md:text-xl">테스트 제목입니다.</h6>
              <div className="mt-2 text-sm font-light md:text-lg">
                글 설명입니다.
              </div>
            </div>
            <ul className="flex h-full w-full select-none flex-wrap content-between items-center py-3 text-xs md:text-sm">
              <li className="mb-2 mr-2 w-max rounded-full bg-l-mainColor bg-opacity-10 px-3 py-1">
                전체보기ㅁㄴㅇㅁㄴㅇasdasdasdasdasd
              </li>
              <li className="mb-2 mr-2 w-max rounded-full bg-l-mainColor bg-opacity-10 px-3 py-1">
                전체보기
              </li>
              <li className="mb-2 mr-2 w-max rounded-full bg-l-mainColor bg-opacity-10 px-3 py-1">
                전체보기ㅁㄴㅇ
              </li>
              <li className="mb-2 mr-2 w-max rounded-full bg-l-mainColor bg-opacity-10 px-3 py-1">
                전체보기ㅁㄴ
              </li>
            </ul>
            <div className="mb-5 text-xs md:text-sm">
              <time>2022년 5월 5일</time>
            </div>
          </li>
          <li className="my-6 h-full w-full border-b-2 border-l-mainColor border-opacity-20 last:border-0 dark:border-d-mainColor">
            <Image src="/image/sample.png" width={1280} height={720} />
            <div className="mt-3">
              <h6 className="font-medium md:text-xl">테스트 제목입니다.</h6>
              <div className="mt-2 text-sm font-light md:text-lg">
                글 설명입니다.
              </div>
            </div>
            <ul className="flex h-full w-full select-none flex-wrap content-between items-center py-3 text-xs md:text-sm">
              <li className="mb-2 mr-2 w-max rounded-full bg-l-mainColor bg-opacity-10 px-3 py-1">
                전체보기ㅁㄴㅇㅁㄴㅇasdasdasdasdasd
              </li>
              <li className="mb-2 mr-2 w-max rounded-full bg-l-mainColor bg-opacity-10 px-3 py-1">
                전체보기
              </li>
              <li className="mb-2 mr-2 w-max rounded-full bg-l-mainColor bg-opacity-10 px-3 py-1">
                전체보기ㅁㄴㅇ
              </li>
              <li className="mb-2 mr-2 w-max rounded-full bg-l-mainColor bg-opacity-10 px-3 py-1">
                전체보기ㅁㄴ
              </li>
            </ul>
            <div className="mb-5 text-xs md:text-sm">
              <time>2022년 5월 5일</time>
            </div>
          </li>
          <li className="my-6 h-full w-full border-b-2 border-l-mainColor border-opacity-20 last:border-0 dark:border-d-mainColor">
            <Image src="/image/sample.png" width={1280} height={720} />
            <div className="mt-3">
              <h6 className="font-medium md:text-xl">테스트 제목입니다.</h6>
              <div className="mt-2 text-sm font-light md:text-lg">
                글 설명입니다.
              </div>
            </div>
            <ul className="flex h-full w-full select-none flex-wrap content-between items-center py-3 text-xs md:text-sm">
              <li className="mb-2 mr-2 w-max rounded-full bg-l-mainColor bg-opacity-10 px-3 py-1">
                전체보기ㅁㄴㅇㅁㄴㅇasdasdasdasdasd
              </li>
              <li className="mb-2 mr-2 w-max rounded-full bg-l-mainColor bg-opacity-10 px-3 py-1">
                전체보기
              </li>
              <li className="mb-2 mr-2 w-max rounded-full bg-l-mainColor bg-opacity-10 px-3 py-1">
                전체보기ㅁㄴㅇ
              </li>
              <li className="mb-2 mr-2 w-max rounded-full bg-l-mainColor bg-opacity-10 px-3 py-1">
                전체보기ㅁㄴ
              </li>
            </ul>
            <div className="mb-5 text-xs md:text-sm">
              <time>2022년 5월 5일</time>
            </div>
          </li>
        </ol>
      </div>
    </ListLayout>
  );
}

export default Post;
