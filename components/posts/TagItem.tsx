import React from 'react';

interface TagItemProps {
  title: string;
  count: number;
}

function TagItem({ title, count }: TagItemProps) {
  return (
    <li className="w-max cursor-pointer rounded-full bg-l-mainColor bg-opacity-10 px-3 py-1 first:ml-0 xl:flex xl:bg-transparent xl:px-0">
      <p className="xl:max-w-[10.5rem] xl:overflow-hidden xl:text-ellipsis">
        {title}
      </p>
      <p className="hidden xl:block xl:pl-2">({count})</p>
    </li>
  );
}

export default TagItem;
