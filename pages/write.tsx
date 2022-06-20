import useUser from '@hooks/useUser';
import { Editor } from '@toast-ui/react-editor';
import React, { useRef, useState } from 'react';
import PostSaveContainer from '@containers/write/PostSaveContainer';
import PostWriteContainer from '@containers/write/PostWriteContainer';
import useWritePost from '@hooks/write/useWritePost';

export interface WriteFormType {
  title: string;
  description: string;
  url: string;
}

function Write() {
  useUser();
  const editorRef = useRef<Editor>(null);
  const [nextStep, setNextStep] = useState(false);
  const {
    upload,
    tag,
    formAction,
    thumbnail: { uploadImage, thumbnailPath, deleteThumbnail },
  } = useWritePost(editorRef);

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
        thumbnail={{ uploadImage, thumbnailPath, deleteThumbnail }}
        formAction={formAction}
        upload={upload}
      />
    </>
  );
}

export default Write;
