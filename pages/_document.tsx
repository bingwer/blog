import { Main, NextScript, Html, Head } from 'next/document';
import React from 'react';

function Document() {
  return (
    <Html lang="ko">
      <Head>
        {/*   <title>PolarScript | 곰같은 개발자</title> */}
        <link rel="icon" href="favicon.ico" />
      </Head>
      <body className="scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-gray-400">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

export default Document;
