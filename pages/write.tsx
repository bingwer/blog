import useUser from '@hooks/useUser';
import { Editor } from '@toast-ui/react-editor';
import React, { useRef, useState } from 'react';
import PostSaveContainer from '@components/write/PostSaveContainer';
import PostWriteContainer from '@components/write/PostWriteContainer';
import useWritePost from '@hooks/write/useWritePost';

export interface WriteFormType {
  title: string;
  summary: string;
  url: string;
}

function Write() {
  useUser();
  const editorRef = useRef<Editor>(null);
  const [nextStep, setNextStep] = useState(false);
  const { savePost, uploadImage, tag, thumbnailPath, formAction } =
    useWritePost(editorRef);

  return (
    <>
      <PostWriteContainer
        editorRef={editorRef as React.MutableRefObject<Editor>}
        setNextStep={setNextStep}
        uploadImage={uploadImage}
        tag={tag}
        formAction={formAction}
      />
      <PostSaveContainer
        nextStep={nextStep}
        setNextStep={setNextStep}
        editorRef={editorRef as React.MutableRefObject<Editor>}
        thumbnailPath={thumbnailPath}
        formAction={formAction}
        savePost={savePost}
      />
    </>
  );
}

export default Write;
