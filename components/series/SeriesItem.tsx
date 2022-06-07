import Image from 'next/image';
import React from 'react';

function SeriesItem() {
  return (
    <li className="my-4 h-full w-full">
      <Image src="/image/sample.png" width={1280} height={720} />
      <div className="mt-3">
        <h6 className="font-medium md:text-lg">테스트 제목입니다.</h6>
      </div>
      <div className="mt-3 text-xs md:text-sm">
        <span>24개의 포스트 &nbsp;</span>
        <span>· 마지막 업데이트 </span>
        <time>2022년 5월 5일</time>
      </div>
    </li>
  );
}

export default SeriesItem;
