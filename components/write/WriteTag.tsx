import React from 'react';

interface WriteTagsProps {
  title: string;
  onClick: () => void;
}

function WriteTag({ title, onClick }: WriteTagsProps) {
  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
    <button
      className="mb-2 mr-2 w-max cursor-pointer rounded-full bg-l-mainColor bg-opacity-10 px-3 py-1"
      type="button"
      onClick={onClick}
    >
      {title}
    </button>
  );
}

export default WriteTag;
