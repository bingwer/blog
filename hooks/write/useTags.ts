import React, { useState } from 'react';

type UseTagReturnType = [
  string[],
  {
    addTag: (e: React.ChangeEvent<HTMLInputElement>) => void;
    deleteTagFromEnd: (
      e: React.KeyboardEvent<HTMLInputElement>,
      inputElement: HTMLInputElement | null,
    ) => void;
    deleteTagByClick: (tagId: string) => void;
  },
];

function useTags(): UseTagReturnType {
  const [tags, setTags] = useState<string[]>([]);

  const isTagDuplicated = (string: string) => tags.find(tag => tag === string);

  const addTag = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputString = e.target.value.trim();
    if (!inputString.includes(',')) return;
    const targetIndex = inputString.lastIndexOf(',');
    const inputTag = inputString.substring(0, targetIndex);
    if (!isTagDuplicated(inputTag) && inputTag !== '') {
      setTags(prev => [...prev, inputTag]);
      e.target.value = '';
    }
  };

  const deleteTagFromEnd = (
    e: React.KeyboardEvent<HTMLInputElement>,
    inputElement: HTMLInputElement | null,
  ) => {
    if (
      !(inputElement instanceof HTMLInputElement) ||
      e.key !== 'Backspace' ||
      tags.length === 0 ||
      inputElement.value !== ''
    )
      return;

    setTags(prev => prev.slice(0, -1));
  };

  const deleteTagByClick = (tag: string) => {
    setTags(prev => prev.filter(tagName => tagName !== tag));
  };

  return [tags, { addTag, deleteTagFromEnd, deleteTagByClick }];
}

export default useTags;
