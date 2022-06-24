/* eslint-disable react/require-default-props */
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

export interface ToastEditorProps extends EditorProps {
  // eslint-disable-next-line react/require-default-props
  editorRef?: React.MutableRefObject<Editor>;
  content?: string;
  uploadImage: (
    file: File,
    type: 'image' | 'thumbnail',
    callback?: ((url: string, flag: string) => void) | undefined,
  ) => Promise<void>;
}

function ToastEditor(props: ToastEditorProps) {
  const { editorRef, uploadImage, content } = props;

  const addImage = useCallback(
    async (file: File, callback: any) => {
      if (!editorRef || !(editorRef && editorRef.current instanceof Editor))
        return;
      await uploadImage(file, 'image', callback);
    },
    [uploadImage, editorRef],
  );

  useEffect(() => {
    if (!editorRef || !(editorRef && editorRef.current instanceof Editor))
      return;
    const editor = editorRef.current.getInstance();

    if (!editor) return;

    editor.removeHook('addImageBlobHook');
    editor.addHook('addImageBlobHook', addImage);
    if (content) editor.setHTML(content);
  }, [editorRef, uploadImage, content, addImage]);

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
