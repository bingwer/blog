import useMutation from '@hooks/useMutation';
import { v4 as uuidV4 } from 'uuid';
import { ResponseType } from '@libs/server/withHandler';
import { RefObject, useCallback, useEffect, useRef, useState } from 'react';
import path from 'path';
import {
  useForm,
  UseFormGetValues,
  UseFormHandleSubmit,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form';
import { AxiosRequestConfig } from 'axios';
import axiosClient from '@libs/client/axiosClient';
import { makeAlert, makeConfirmAlert } from '@libs/util';
import useDarkMode from '@hooks/useDarkMode';
import { useRouter } from 'next/router';
import { Editor } from '@toast-ui/react-editor';
import { Post } from '@prisma/client';
import useTags, { UseTagReturnType } from './useTags';
import useSeries, { UseSeriesReturnType } from './useSeries';

interface UploadImageResponseType extends ResponseType {
  data: { filePath: string };
}
export interface WriteFormType {
  title: string;
  description: string;
  url: string;
}
export interface WriteFormActionType {
  getValues: UseFormGetValues<WriteFormType>;
  register: UseFormRegister<WriteFormType>;
  handleSubmit: UseFormHandleSubmit<WriteFormType>;
  setValue: UseFormSetValue<WriteFormType>;
  watch: UseFormWatch<WriteFormType>;
}

export interface PostWithTags extends Post {
  Tags: string[];
  Series?: number;
}

export interface UploadPostType {
  uploadPost: (
    FormData: WriteFormType,
    options: { isPrivate: boolean; selectedSeries: undefined | number },
  ) => Promise<void>;
  loading: boolean;
}

export interface ThumbnailType {
  uploadImage: (
    file: File,
    type: 'image' | 'thumbnail',
    callback?: ((url: string, flag: string) => void) | undefined,
  ) => Promise<void>;
  thumbnailPath: string | undefined;
  deleteThumbnail: () => void;
}
export interface UseWritePostReturnType {
  upload: UploadPostType;
  thumbnail: ThumbnailType;
  tag: UseTagReturnType;
  series: UseSeriesReturnType;
  formAction: WriteFormActionType;
}

const toastEditorEmptyString = '<p><br class="ProseMirror-trailingBreak"></p>';

function useWritePost(
  editorRef: RefObject<Editor>,
  post?: PostWithTags,
): UseWritePostReturnType {
  const router = useRouter();
  const [uuid] = useState(uuidV4());
  const needCleanUp = useRef(false);
  const [darkMode] = useDarkMode();
  const [thumbnailPath, setThumbnailPath] = useState<string | undefined>();
  const [tags, { addTag, deleteTagFromEnd, deleteTagByClick }] = useTags();
  const [uploadPostAPI, { data, loading, error }] =
    useMutation<ResponseType>('/api/write');
  const { register, handleSubmit, getValues, setValue, watch } =
    useForm<WriteFormType>();

  const uploadPost = async (
    formData: WriteFormType,
    params: { isPrivate: boolean; selectedSeries: number | undefined },
  ) => {
    if (loading) return;
    const editor = editorRef.current;
    const { title, url, description } = formData;
    const { isPrivate, selectedSeries } = params;
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
      ...(thumbnailPath && { thumbnailPath }),
      tags,
      url,
      description,
      isPrivate,
      ...(selectedSeries && { selectedSeries }),
    };

    uploadPostAPI(body);
  };

  const uploadImage = useCallback(
    async (file: File, callback?: (url: string, flag: string) => void) => {
      const uuidFile = new File([file], `${uuid}${path.extname(file.name)}`);

      const body = new FormData();
      body.append('file', uuidFile);
      try {
        const {
          data: { filePath },
        }: UploadImageResponseType = await axiosClient.post(
          '/api/write/image',
          body,
        );

        setThumbnailPath(filePath);

        if (callback) callback(filePath, 'ImageURL');
      } catch (e) {
        console.error(e);
      }
    },
    [uuid, setThumbnailPath],
  );

  const deleteTempImage = useCallback((postUuid: string) => {
    const body: AxiosRequestConfig = {
      params: {
        uuid: postUuid,
      },
    };
    axiosClient.delete('/api/write/image', body);
  }, []);

  const deleteThumbnail = () => {
    setThumbnailPath(undefined);
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
    return () => {
      if (!uuid || !needCleanUp.current) {
        needCleanUp.current = true;
        return;
      }
      deleteTempImage(uuid);
    };
  }, [uuid, deleteTempImage]);

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

  return {
    upload: {
      uploadPost,
      loading,
    },
    thumbnail: {
      thumbnailPath,
      uploadImage,
      deleteThumbnail,
    },
    tag: {
      tags,
      actions: {
        addTag,
        deleteTagFromEnd,
        deleteTagByClick,
      },
    },
    formAction: {
      register,
      handleSubmit,
      getValues,
      setValue,
      watch,
    },
  };
}

export default useWritePost;
