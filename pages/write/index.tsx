import useUser from '@hooks/useUser';
import { Editor } from '@toast-ui/react-editor';
import React, { useRef, useState } from 'react';
import PostSaveContainer from '@containers/write/PostSaveContainer';
import PostWriteContainer from '@containers/write/PostWriteContainer';
import useWritePost from '@hooks/write/useWritePost';

function Write() {
  useUser();
  const editorRef = useRef<Editor>(null);
  const [nextStep, setNextStep] = useState(false);
  const {
    upload,
    tag,
    formAction,
    series,
    thumbnail: { uploadImage, thumbnailPath, deleteThumbnail },
    isPrivate,
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
        series={series}
        formAction={formAction}
        upload={upload}
        isPrivate={isPrivate}
      />
    </>
  );
}

export default Write;
