import React from 'react';
import TagItem from './TagItem';

function TagList() {
  return (
    <div className="tags scrollbar-thumb-rounded-full mt-2 overflow-x-scroll pb-2 scrollbar-thin scrollbar-thumb-gray-400 md:mt-6 xl:absolute xl:z-30 xl:-mt-1 xl:-ml-56 xl:overflow-hidden">
      <p className="mb-3 hidden w-48 border-b-2 border-l-mainColor pb-2 dark:border-d-mainColor xl:block">
        태그 목록
      </p>
      <nav>
        <ul className="flex h-10 w-max select-none items-center space-x-4 whitespace-nowrap text-xs xl:block xl:h-full xl:w-48 xl:space-x-0 xl:px-0 xl:text-sm">
          {[1, 2, 3, 4, 5].map(key => (
            <TagItem
              title="전체보기ㅁㄴㅇㅁㄴㅇasdasdasdasdasd"
              count={3}
              key={key}
            />
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default TagList;
