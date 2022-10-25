import type { InferGetStaticPropsType, NextPage } from 'next';
import BlogCard from '../../components/BlogCard';
import { readPostsInfo } from '../../lib/helper';
import { PostApiResponse } from '../../utils/types';

type Props = InferGetStaticPropsType<typeof getStaticProps>;

const Blogs: NextPage<Props> = ({ posts }) => {
  return (
    <div className="max-w-3xl mx-auto p-5 space-y-5">
      {posts.map((post) => (
        <BlogCard
          key={post.slug}
          slug={post.slug}
          title={post.title}
          desc={post.meta}
        />
      ))}
    </div>
  );
};

export default Blogs;

export const getStaticProps = async () => {
  // No NO
  // const { postInfo }: PostApiResponse = await fetch(
  //   'http://localhost:3000/api/posts'
  // ).then((data) => data.json());

  const postInfo: PostApiResponse = await readPostsInfo();

  return {
    props: { posts: postInfo },
  };
};
