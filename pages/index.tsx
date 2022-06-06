import PostList from '@components/posts/PostList';
import TagList from '@components/posts/TagList';
import SubLayout from '@components/SubLayout';

function Post() {
  return (
    <SubLayout>
      <div className="xl:rlative h-full">
        <TagList />
        <PostList />
      </div>
    </SubLayout>
  );
}

export default Post;
