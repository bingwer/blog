import React from 'react';
import PostItem from './PostItem';

function PostList() {
  return (
    <ol>
      {[1, 2, 3, 4, 5].map(key => (
        <PostItem key={key} />
      ))}
    </ol>
  );
}

export default PostList;
