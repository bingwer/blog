import useMutation from '@hooks/useMutation';
import { v4 as uuidV4 } from 'uuid';
import { ResponseType } from '@libs/server/withHandler';
import React, {
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
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
import { Post, Series } from '@prisma/client';
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
  tags: string[];
  series?: Series;
}

export interface UploadPostType {
  uploadPost: (
    FormData: WriteFormType,
    options: { isPrivate: boolean; selectedSeries: undefined | number },
  ) => Promise<void>;
  uploadTempPost: (FormData: WriteFormType) => Promise<void>;
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

export interface PrivateType {
  isPrivate: boolean;
  setIsPrivate: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface UseWritePostReturnType {
  upload: UploadPostType;
  thumbnail: ThumbnailType;
  tag: UseTagReturnType;
  series: UseSeriesReturnType;
  formAction: WriteFormActionType;
  isPrivate: PrivateType;
}

const toastEditorEmptyString = '<p><br class="ProseMirror-trailingBreak"></p>';

function useWritePost(
  editorRef: RefObject<Editor>,
  post?: PostWithTags,
  postType?: 'temp',
): UseWritePostReturnType {
  const router = useRouter();
  const [uuid] = useState(uuidV4());
  const needCleanUp = useRef(false);
  const [darkMode] = useDarkMode();
  const [thumbnailPath, setThumbnailPath] = useState<string | undefined>();
  const [isPrivate, setIsPrivate] = useState(false);
  const series = useSeries(thumbnailPath);
  const {
    actions: { setSelectedSeries },
  } = series;
  const tag = useTags();
  const [tags, { setTags }] = tag;
  const [uploadPostAPI, { data, loading, error }] = useMutation<ResponseType>(
    '/api/write',
    'POST',
  );
  const [
    updatePostAPI,
    { data: updateData, loading: updateLoading, error: updateError },
  ] = useMutation<ResponseType>('/api/write', 'PUT');
  const { register, handleSubmit, getValues, setValue, watch } =
    useForm<WriteFormType>();

  const [
    uploadTempPostAPI,
    {
      data: uploadTempData,
      loading: uploadTempLoading,
      error: uploadTempError,
    },
  ] = useMutation<ResponseType>('/api/write/temp', 'POST');

  const uploadPost = async (
    formData: WriteFormType,
    params: { selectedSeries: number | undefined },
  ) => {
    if (loading || updateLoading) return;
    const editor = editorRef.current;
    const { title, url, description } = formData;
    const { selectedSeries } = params;
    if (!editor) return;

    const conf = await makeConfirmAlert(
      {
        content: `포스트를 ${post ? '수정' : '등록'}하시겠어요?`,
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
      ...(post?.id && { id: post.id }),
      title,
      content,
      ...{ uuid: post?.uuid ? post.uuid : uuid },
      ...(thumbnailPath && { thumbnailPath }),
      tags,
      url,
      description,
      isPrivate,
      ...(selectedSeries && { selectedSeries }),
      ...(postType && { postType }),
    };

    if (!post) uploadPostAPI(body);
    else updatePostAPI(body);
  };

  const uploadTempPost = async (formData: WriteFormType) => {
    if (uploadTempLoading) return;
    const editor = editorRef.current;
    const { title } = formData;
    if (!editor) return;

    const conf = await makeConfirmAlert(
      {
        content: `포스트를 임시저장 하시겠어요?`,
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
      ...(post?.id && { id: post.id }),
      title,
      content,
      ...{ uuid: post?.uuid ? post.uuid : uuid },
      ...(thumbnailPath && { thumbnailPath }),
      tags: tags.join(','),
    };

    uploadTempPostAPI(body);
  };

  const uploadImage = useCallback(
    async (
      file: File,
      type: 'image' | 'thumbnail',
      callback?: (url: string, flag: string) => void,
    ) => {
      const uuidFile = new File(
        [file],
        `${post?.uuid || uuid}${path.extname(file.name)}`,
      );

      const body = new FormData();
      body.append('file', uuidFile);
      try {
        const {
          data: { filePath },
        }: UploadImageResponseType = await axiosClient.post(
          '/api/write/image',
          body,
        );

        if (type === 'thumbnail' || (type === 'image' && !thumbnailPath))
          setThumbnailPath(filePath);

        if (callback) callback(filePath, 'ImageURL');
      } catch (e) {
        console.error(e);
      }
    },
    [uuid, setThumbnailPath, thumbnailPath, post],
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

  const onSuccess = useCallback(
    async (flag: string) => {
      await makeAlert(
        { content: `포스트가 ${flag}되었습니다.` },
        'success',
        darkMode,
      );
      router.replace('/');
    },
    [darkMode, router],
  );

  const onError = useCallback(
    async (flag: string) => {
      await makeAlert(
        { content: `포스트 ${flag}에 실패했습니다.` },
        'error',
        darkMode,
      );
    },
    [darkMode],
  );

  useEffect(() => {
    if (post) {
      const {
        title,
        description,
        tags: postTags,
        thumbnailPath: thumbnail,
        url,
        series: postSeries,
        isPrivate: isPostPrivate,
      } = post;

      setValue('title', title);
      if (description) setValue('description', description);
      if (url) setValue('url', url);
      if (isPostPrivate !== undefined) setIsPrivate(isPostPrivate);
      if (thumbnail) setThumbnailPath(thumbnail);
      if (postTags && postTags.length > 0) setTags(postTags);
      if (postSeries) setSelectedSeries(postSeries.id);
      return;
    }

    if (router.pathname !== '/write') router.replace('/write');
  }, [post, setValue, setTags, setSelectedSeries, router]);

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
      onSuccess('등록');
    }
    if (updateData && updateData.ok) {
      needCleanUp.current = false;
      onSuccess('수정');
    }

    if (uploadTempData && uploadTempData.ok) {
      needCleanUp.current = false;
      onSuccess('임시저장');
    }
  }, [data, updateData, onSuccess, uploadTempData]);

  useEffect(() => {
    if (error) {
      onError('등록');
    }
    if (updateError) {
      onError('수정');
    }
    if (uploadTempError) {
      onError('임시저장');
    }
  }, [error, updateError, onError, uploadTempError]);

  return {
    upload: {
      uploadPost,
      uploadTempPost,
      loading,
    },
    thumbnail: {
      thumbnailPath,
      uploadImage,
      deleteThumbnail,
    },
    isPrivate: {
      isPrivate,
      setIsPrivate,
    },
    tag,
    series,
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
