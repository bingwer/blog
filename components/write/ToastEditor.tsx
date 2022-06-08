import React from 'react';

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
import useDarkMode from '@hooks/useDarkMode';

export interface ToastEditorProps extends EditorProps {
  ref: React.ForwardedRef<Editor>;
}

function ToastEditor(props: ToastEditorProps) {
  return (
    <Editor
      {...props}
      language="ko-KR"
      plugins={[colorSyntax, [codeSyntaxHighlight, { highlighter: Prism }]]}
    />
  );
}

export default ToastEditor;
