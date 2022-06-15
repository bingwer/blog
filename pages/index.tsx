import PostList from '@components/posts/PostList';
import TagList from '@components/posts/TagList';
import SubLayout from '@components/SubLayout';
import useUser from '@hooks/useUser';

function Post() {
  return (
    <SubLayout>
      <TagList />
      <PostList />
    </SubLayout>
  );
}

export default Post;
