import { ToastEditorProps } from '@components/write/ToastEditor';
import WriteTag from '@components/write/WriteTag';
import useDarkMode from '@hooks/useDarkMode';
import useUser from '@hooks/useUser';
import { cls } from '@libs/util';
import { Editor } from '@toast-ui/react-editor';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { forwardRef, useRef, useState } from 'react';
import useWindowWidth from '@hooks/useWindowWidth';

const PortalWrap = dynamic(() => import('@libs/client/PortalWrap'), {
  ssr: false,
});

const ToastEditor = dynamic<ToastEditorProps>(
  () => import('@components/write/ToastEditor'),
  {
    ssr: false,
  },
);

const EditorWrap = forwardRef<Editor, ToastEditorProps>((props, ref) => {
  return (
    <ToastEditor {...props} editorRef={ref as React.MutableRefObject<Editor>} />
  );
});

EditorWrap.displayName = 'EditorWarp';

function Write() {
  useUser();
  const editorRef = useRef<Editor | null>(null);
  const [darkMode] = useDarkMode();
  const windowWidth = useWindowWidth(500);
  const tagInputRef = useRef<HTMLInputElement>(null);
  const [tags, setTags] = useState<string[]>([]);

  const router = useRouter();

  const isTagDuplicated = (string: string) => tags.find(tag => tag === string);

  const addTag = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputString = e.target.value;
    if (!inputString.includes(',')) return;
    const targetIndex = inputString.lastIndexOf(',');
    const inputTag = inputString.substring(0, targetIndex);
    if (!isTagDuplicated(inputTag)) {
      setTags(prev => [...prev, inputTag]);
      e.target.value = '';
    }
  };

  const deleteTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const inputElement = tagInputRef.current;
    if (
      !(inputElement instanceof HTMLInputElement) ||
      e.key !== 'Backspace' ||
      tags.length === 0 ||
      inputElement.value !== ''
    )
      return;

    setTags(prev => prev.slice(0, -1));
  };

  return (
    <PortalWrap wrapperId="writePortal">
      <div
        className={cls(
          'absolute top-0 z-[100] h-full w-full',
          darkMode ? 'dark' : 'light',
        )}
      >
        <form className="h-full w-full bg-l-backgroundColor px-12 py-5 text-text-dark dark:bg-d-backgroundColor dark:text-text-white">
          <div className="mb-4 w-full border-b-2 border-l-mainColor dark:border-d-mainColor">
            <input
              placeholder="제목을 입력하세요"
              type="text"
              className="h-20 w-full bg-inherit px-3 text-3xl focus:outline-none"
            />
          </div>
          <div className="mb-3 flex flex-wrap  ">
            {tags.map(tag => (
              <WriteTag key={tag} title={tag} onClick={() => {}} />
            ))}
            <input
              placeholder="태그를 입력하세요"
              type="text"
              className="text-md h-8 w-fit bg-inherit px-3 focus:outline-none"
              onChange={addTag}
              onKeyDown={deleteTag}
              ref={tagInputRef}
            />
          </div>
          <EditorWrap
            previewStyle={windowWidth > 720 ? 'vertical' : 'tab'}
            initialValue=" "
            language="ko-kr"
            height="700px"
            theme={darkMode ? 'dark' : 'light'}
            autofocus={false}
            ref={editorRef}
          />
          <div className="flex h-16 w-full items-center justify-between">
            <button type="button" onClick={() => router.back()}>
              <span className="flex w-fit cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-3 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                뒤로가기
              </span>
            </button>
            <div className="space-x-4">
              <button type="button">임시저장</button>
              <button
                type="button"
                className="rounded-lg bg-l-mainColor py-2 px-3 dark:bg-d-mainColor"
              >
                저장하기
              </button>
            </div>
          </div>
        </form>
      </div>
    </PortalWrap>
  );
}

export default Write;
