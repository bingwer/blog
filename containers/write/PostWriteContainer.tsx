import { ToastEditorProps } from '@components/write/ToastEditor';
import useDarkMode from '@hooks/useDarkMode';
import useWindowWidth from '@hooks/useWindowWidth';
import { UseTagReturnType } from '@hooks/write/useTags';
import { WriteFormActionType } from '@hooks/write/useWritePost';
import { cls } from '@libs/util';
import { Editor } from '@toast-ui/react-editor';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { WriteFormType } from 'pages/write';
import React, { forwardRef, useRef } from 'react';
import { UseFormRegister } from 'react-hook-form';
import WriteTag from '../../components/write/WriteTag';

const PortalWrap = dynamic(() => import('@libs/client/PortalWrap'), {
  ssr: false,
});

const ToastEditor = dynamic<ToastEditorProps>(
  () => import('@components/write/ToastEditor').then(m => m.default),
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

interface PostWriteContainerProps {
  editorRef: React.MutableRefObject<Editor>;
  uploadImage: (
    file: File,
    type: 'image' | 'thumbnail',
    callback?: ((url: string, flag: string) => void) | undefined,
  ) => Promise<void>;
  tag: UseTagReturnType;
  formAction: WriteFormActionType;
  setNextStep: React.Dispatch<React.SetStateAction<boolean>>;
  // eslint-disable-next-line react/require-default-props
  content?: string;
}

function PostWriteContainer(props: PostWriteContainerProps) {
  const {
    editorRef,
    uploadImage,
    formAction: { register },
    tag: [tags, { addTag, deleteTagByClick, deleteTagFromEnd }],
    setNextStep,
    content,
  } = props;
  const tagInputRef = useRef<HTMLInputElement>(null);
  const [darkMode] = useDarkMode();
  const windowWidth = useWindowWidth(500);
  const router = useRouter();

  return (
    <PortalWrap wrapperId="writePortal">
      <div
        className={cls(
          'absolute top-0 z-[99] h-full w-full overflow-y-scroll',
          darkMode ? 'dark' : 'light',
        )}
      >
        <form className="w-full bg-l-backgroundColor px-12 py-5 text-text-dark dark:bg-d-backgroundColor dark:text-text-white">
          <div className="mb-4 w-full border-b-2 border-l-mainColor dark:border-d-mainColor">
            <input
              placeholder="제목을 입력하세요"
              type="text"
              className="h-20 w-full bg-inherit px-3 text-3xl focus:outline-none"
              required
              {...register('title', {
                required: true,
              })}
            />
          </div>
          <div className="mb-3 flex flex-wrap  ">
            {tags.map((tag, index) => (
              <WriteTag
                // eslint-disable-next-line react/no-array-index-key
                key={`${tag}_${index}`}
                title={tag}
                onClick={() => {
                  deleteTagByClick(tag);
                }}
              />
            ))}
            <input
              placeholder="태그를 입력하세요"
              type="text"
              className="text-md h-8 w-fit bg-inherit px-3 focus:outline-none"
              onChange={addTag}
              onKeyDown={e => deleteTagFromEnd(e, tagInputRef.current)}
              ref={tagInputRef}
            />
          </div>
          <EditorWrap
            previewStyle={windowWidth > 720 ? 'vertical' : 'tab'}
            uploadImage={uploadImage}
            initialValue=" "
            language="ko-kr"
            height="700px"
            theme={darkMode ? 'dark' : 'light'}
            autofocus={false}
            ref={editorRef}
            content={content}
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
                onClick={() => setNextStep(true)}
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

export default PostWriteContainer;
