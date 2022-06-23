import PostSaveContainer from '@containers/write/PostSaveContainer';
import PostWriteContainer from '@containers/write/PostWriteContainer';
import useDarkMode from '@hooks/useDarkMode';
import useWritePost, { PostWithTags } from '@hooks/write/useWritePost';
import axiosClient from '@libs/client/axiosClient';
import { makeConfirmAlert } from '@libs/util';
import { Editor } from '@toast-ui/react-editor';
import { GetServerSideProps } from 'next';
import React, { useCallback, useEffect, useRef, useState } from 'react';

interface PostEditProps {
  post: PostWithTags;
  // eslint-disable-next-line react/require-default-props
  postType?: 'temp' | 'posted';
}

function PostEdit({
  post: searchedPost,
  postType: searchedPostType,
}: PostEditProps) {
  const editorRef = useRef<Editor>(null);
  const [darkMode] = useDarkMode();
  const [nextStep, setNextStep] = useState(false);
  const [post, setPost] = useState(searchedPost);
  const [postType, setPostType] = useState(searchedPostType);
  const {
    upload,
    tag,
    formAction,
    series,
    thumbnail: { uploadImage, thumbnailPath, deleteThumbnail },
    isPrivate,
  } = useWritePost(editorRef, post, postType);
  const { uploadTempPost } = upload;

  const getTempPostedPost = useCallback(async () => {
    const conf = await makeConfirmAlert(
      {
        content: `임시저장된 포스트가 있습니다. 불러오시겠어요?`,
      },
      darkMode,
    );

    if (!conf) return;

    const param = `type=posted&id=${searchedPost.tempPostedPost?.id}`;

    const {
      data: { post: tempedPost },
    } = await axiosClient.get(`http://localhost:3000/api/write?${param}`);

    setPost(tempedPost);
    setPostType('posted');
  }, [darkMode, searchedPost]);

  useEffect(() => {
    if (searchedPost && searchedPost.tempPostedPost) {
      getTempPostedPost();
    }
  }, [searchedPost, getTempPostedPost]);

  return (
    <>
      <PostWriteContainer
        editorRef={editorRef as React.MutableRefObject<Editor>}
        setNextStep={setNextStep}
        uploadImage={uploadImage}
        tag={tag}
        formAction={formAction}
        content={post?.content}
        uploadTempPost={uploadTempPost}
      />
      <PostSaveContainer
        nextStep={nextStep}
        setNextStep={setNextStep}
        series={series}
        isPrivate={isPrivate}
        editorRef={editorRef as React.MutableRefObject<Editor>}
        thumbnail={{ uploadImage, thumbnailPath, deleteThumbnail }}
        formAction={formAction}
        upload={upload}
      />
    </>
  );
}

export default PostEdit;

export const getServerSideProps: GetServerSideProps = async context => {
  const {
    query: { id },
  } = context;

  if (!id)
    return {
      props: {
        post: undefined,
      },
    };

  const param =
    id && id.length > 1 ? `type=${id[0]}&id=${id[1]}` : `id=${id[0]}`;

  const {
    data: { post },
  } = await axiosClient.get(`http://localhost:3000/api/write?${param}`);

  return {
    props: { post, ...(id.length > 1 && { postType: id[0] }) },
  };
};
