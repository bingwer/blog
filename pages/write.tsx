import { ToastEditorProps } from '@components/write/ToastEditor';
import useDarkMode from '@hooks/useDarkMode';
import useUser from '@hooks/useUser';
import { makeAlert, makeConfirmAlert } from '@libs/util';
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
import { v4 as uuidV4 } from 'uuid';
import useMutation from '@hooks/useMutation';
import axiosClient from '@libs/client/axiosClient';
import { AxiosRequestConfig } from 'axios';
import { useForm } from 'react-hook-form';
import { ResponseType } from '@libs/server/withHandler';
import useTags from '@hooks/write/useTags';
import PostSaveContainer from '@components/write/PostSaveContainer';
import PostWriteContainer from '@components/write/PostWriteContainer';

export interface writeFormType {
  title: string;
}

const toastEditorEmptyString = '<p><br class="ProseMirror-trailingBreak"></p>';

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
  const editorRef = useRef<Editor>(null);
  const needCleanUp = useRef(false);
  const thumbnailPath = useRef<undefined | string>(undefined);
  const [nextStep, setNextStep] = useState(false);
  const [uuid] = useState(uuidV4());
  const [tags, { addTag, deleteTagFromEnd, deleteTagByClick }] = useTags();
  const [darkMode] = useDarkMode();
  const { register, handleSubmit } = useForm<writeFormType>();
  const [uploadPost, { data, loading, error }] =
    useMutation<ResponseType>('/api/write');

  const router = useRouter();

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
      <PostWriteContainer
        editorRef={editorRef as React.MutableRefObject<Editor>}
        register={register}
        handleSubmit={handleSubmit}
        tags={tags}
        addTag={addTag}
        deleteTagFromEnd={deleteTagFromEnd}
        deleteTagByClick={deleteTagByClick}
        setNextStep={setNextStep}
        uuid={uuid}
        savePost={savePost}
        thumbnailPath={thumbnailPath}
      />
      <PostSaveContainer
        nextStep={nextStep}
        setNextStep={setNextStep}
        thumbnailPath={thumbnailPath.current}
      />
    </>
  );
}

export default Write;
