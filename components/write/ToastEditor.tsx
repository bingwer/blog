import React, { useCallback, useEffect } from 'react';
import path from 'path';

import { Editor, EditorProps } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/editor/dist/theme/toastui-editor-dark.css';

import '@toast-ui/editor/dist/i18n/ko-kr';

import Prism from 'prismjs';
import 'prismjs/themes/prism.css';
import '@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css';
import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight';

import 'tui-color-picker/dist/tui-color-picker.css';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';

import colorSyntax from '@toast-ui/editor-plugin-color-syntax';
import { ResponseType } from '@libs/server/withHandler';
import axiosClient from '@libs/client/axiosClient';

export interface ToastEditorProps extends EditorProps {
  // eslint-disable-next-line react/require-default-props
  editorRef?: React.MutableRefObject<Editor>;
  uuid: string;
  setThumbnailPath: React.Dispatch<React.SetStateAction<string | undefined>>;
}

interface UploadImageResponseType extends ResponseType {
  data: { filePath: string };
}

function ToastEditor(props: ToastEditorProps) {
  const { editorRef, uuid, setThumbnailPath } = props;

  const uploadImage = useCallback(
    async (file: File, callback: (url: string, flag: string) => void) => {
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

        callback(filePath, 'ImageURL');
      } catch (e) {
        console.error(e);
      }
    },
    [uuid, setThumbnailPath],
  );

  useEffect(() => {
    if (!editorRef || !(editorRef && editorRef.current instanceof Editor))
      return;
    const editor = editorRef.current.getInstance();

    editor.removeHook('addImageBlobHook');
    editor.addHook('addImageBlobHook', async (file, callback) => {
      uploadImage(file, callback);
    });
  }, [editorRef, uploadImage]);
  return (
    <Editor
      {...props}
      ref={editorRef}
      language="ko-KR"
      plugins={[colorSyntax, [codeSyntaxHighlight, { highlighter: Prism }]]}
    />
  );
}

export default ToastEditor;
