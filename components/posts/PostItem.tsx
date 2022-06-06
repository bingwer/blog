import Image from 'next/image';
import React from 'react';
import PostItemTags from './PostItemTags';

interface PostItemProps {
  title: string;
  content: string;
}

function PostItem() {
  return (
    <li className="my-6 h-full w-full border-b-2 border-l-mainColor border-opacity-20 last:border-0 dark:border-d-mainColor">
      <Image src="/image/sample.png" width={1280} height={720} />
      <div className="mt-3">
        <h6 className="font-medium md:text-xl">테스트 제목입니다.</h6>
        <div className="mt-2 text-sm font-light md:text-lg">글 설명입니다.</div>
      </div>
      <ul className="flex h-full w-full select-none flex-wrap content-between items-center py-3 text-xs md:text-sm">
        {[1, 2, 3, 4, 5].map(key => (
          <PostItemTags key={key} />
        ))}
      </ul>
      <div className="mb-5 text-xs md:text-sm">
        <time>2022년 5월 5일</time>
      </div>
    </li>
  );
}

export default PostItem;
