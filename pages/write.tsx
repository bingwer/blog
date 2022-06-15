import { ToastEditorProps } from '@components/write/ToastEditor';
import WriteTag from '@components/write/WriteTag';
import useDarkMode from '@hooks/useDarkMode';
import useUser from '@hooks/useUser';
import { cls, makeAlert, makeConfirmAlert } from '@libs/util';
import { Editor } from '@toast-ui/react-editor';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import useWindowWidth from '@hooks/useWindowWidth';
import { v4 as uuidV4 } from 'uuid';
import useMutation from '@hooks/useMutation';
import axiosClient from '@libs/client/axiosClient';
import { AxiosRequestConfig } from 'axios';
import { useForm } from 'react-hook-form';
import { ResponseType } from '@libs/server/withHandler';

interface writeFormType {
  title: string;
}

const toastEditorEmptyString = '<p><br class="ProseMirror-trailingBreak"></p>';

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

function Write() {
  useUser();
  const editorRef = useRef<Editor | null>(null);
  const tagInputRef = useRef<HTMLInputElement>(null);
  const needCleanUp = useRef(false);
  const thumbnailPath = useRef<undefined | string>(undefined);
  const [tags, setTags] = useState<string[]>([]);
  const [nextStep, setNextStep] = useState(false);
  const [uuid] = useState(uuidV4());
  const [darkMode] = useDarkMode();
  const windowWidth = useWindowWidth(500);
  const { register, handleSubmit } = useForm<writeFormType>();
  const [uploadPost, { data, loading, error }] =
    useMutation<ResponseType>('/api/write');

  const router = useRouter();

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

  const savePost = async (formData: writeFormType) => {
    if (loading) return;
    const editor = editorRef.current;
    const { title } = formData;
    if (!editor) return;

    const conf = await makeConfirmAlert(
      {
        content: '포스트를 등록하시겠어요?',
      },
      darkMode,
    );

    if (!conf) return;

    const content = editor.getInstance().getHTML();

    if (content === toastEditorEmptyString) {
      makeAlert({ content: '글 내용이 없습니다.' }, 'error', darkMode);
      return;
    }

    const body = {
      title,
      content,
      uuid,
      ...(thumbnailPath.current && { thumbnailPath: thumbnailPath.current }),
      isTemp: false,
      tags,
    };
    uploadPost(body);
  };

  const onSuccess = useCallback(async () => {
    await makeAlert(
      { content: '포스트가 등록되었습니다.' },
      'success',
      darkMode,
    );
    router.replace('/');
  }, [darkMode, router]);

  const onError = useCallback(async () => {
    await makeAlert(
      { content: '포스트 등록에 실패했습니다.' },
      'error',
      darkMode,
    );
  }, [darkMode]);

  useEffect(() => {
    const deleteTempImage = () => {
      const body: AxiosRequestConfig = {
        params: {
          uuid,
        },
      };
      axiosClient.delete('/api/write/image', body);
    };

    return () => {
      if (!uuid || !needCleanUp.current) {
        needCleanUp.current = true;
        return;
      }
      deleteTempImage();
    };
  }, [uuid]);

  useEffect(() => {
    if (data && data.ok) {
      needCleanUp.current = false;
      onSuccess();
    }
  }, [data, onSuccess]);

  useEffect(() => {
    if (error) {
      onError();
    }
  }, [error, onError]);

  return (
    <>
      <PortalWrap wrapperId="writePortal">
        <div
          className={cls(
            'absolute top-0 z-[99] h-full w-full overflow-y-scroll',
            darkMode ? 'dark' : 'light',
          )}
        >
          <form
            className="w-full bg-l-backgroundColor px-12 py-5 text-text-dark dark:bg-d-backgroundColor dark:text-text-white"
            onSubmit={handleSubmit(savePost)}
          >
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
                    setTags(prev => prev.filter(tagName => tagName !== tag));
                  }}
                />
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
              uuid={uuid}
              thumbnailPathRef={thumbnailPath}
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
      <PortalWrap wrapperId="writeconfirm">
        <div
          className={cls(
            'absolute top-0 w-full overflow-y-scroll transition-[height]',
            darkMode ? 'dark' : 'light',
            nextStep ? 'z-[100] h-auto' : 'z-[99] h-0',
          )}
        >
          <div className="flex min-h-screen w-full items-center justify-center bg-l-backgroundColor px-12 text-text-dark dark:bg-d-backgroundColor dark:text-text-white">
            <div className="grid grid-cols-1 space-y-6 md:grid-cols-2 md:space-y-0">
              <section className="h-96 w-96 border-l-mainColor px-6 dark:border-d-mainColor md:border-r-2">
                <div className="flex h-full w-full flex-col justify-between">
                  <p className="text-xl">포스트 미리보기</p>
                  <div className="flex h-48 w-full flex-col items-center justify-center space-y-3 bg-slate-200 dark:bg-slate-700">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-16 w-16"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <button
                      type="button"
                      className="h-9 w-32 rounded-md bg-d-mainColor text-sm text-text-white"
                    >
                      썸네일 업로드
                    </button>
                  </div>
                  <textarea
                    className="h-28 w-full resize-none bg-white p-3 text-sm text-text-dark focus:outline-none dark:bg-black dark:text-text-white"
                    placeholder="포스트 요약을 입력하세요"
                  />
                  <div className="flex w-full justify-end">
                    <p className="text-sm">0 / 150</p>
                  </div>
                </div>
              </section>
              <section className="flex h-96 w-96 flex-col justify-between px-6">
                <div className="flex h-[17rem] w-full flex-col justify-between">
                  <div>
                    <p className="mb-3 text-xl">공개 설정</p>
                    <div className="flex w-full justify-between">
                      <button
                        type="button"
                        className="flex h-12 w-40 items-center justify-center space-x-4 rounded-md bg-d-mainColor text-sm text-text-white"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>공개</span>
                      </button>
                      <button
                        type="button"
                        className="flex h-12 w-40 items-center justify-center space-x-4 rounded-md bg-d-mainColor text-sm text-text-white"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                        <span>비공개</span>
                      </button>
                    </div>
                  </div>
                  <div className="relative">
                    <p className="mb-3 text-xl">URL 설정</p>
                    <input
                      type="text"
                      className="h-10 w-full bg-white pb-1 pl-[7.6rem] pr-3 text-text-dark focus:outline-none dark:bg-black dark:text-text-white"
                    />
                    <span className="absolute left-3 top-[2.9rem]">
                      @/polarscript/
                    </span>
                  </div>
                  <div>
                    <p className="mb-3 text-xl">모음집 설정</p>
                    <div className="w-full">
                      <button
                        type="button"
                        className="flex h-12  w-full items-center justify-center space-x-4 rounded-md bg-d-mainColor text-sm text-text-white"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                          />
                        </svg>
                        <span>모음집에 추가하기</span>
                      </button>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex w-full justify-between">
                    <button
                      type="button"
                      className="flex h-12 w-40 items-center justify-center space-x-4 rounded-md bg-d-mainColor text-sm text-text-white"
                      onClick={() => setNextStep(false)}
                    >
                      취소
                    </button>
                    <button
                      type="button"
                      className="flex h-12 w-40 items-center justify-center space-x-4 rounded-md bg-d-mainColor text-sm text-text-white"
                    >
                      출간하기
                    </button>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </PortalWrap>
    </>
  );
}

export default Write;
