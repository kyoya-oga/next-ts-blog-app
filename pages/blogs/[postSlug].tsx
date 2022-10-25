import fs from 'fs';
import matter from 'gray-matter';
import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
  NextPage,
} from 'next';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import path from 'path';
import { ParsedUrlQuery } from 'querystring';

type Props = InferGetStaticPropsType<typeof getStaticProps>;

const SinglePage: NextPage<Props> = ({ post }) => {
  const { content, title } = post;
  return (
    <div className="max-w-3xl mx-auto py-20">
      <h1 className="font-semibold text-3xl">{title}</h1>
      <div className="prose pt-5">
        <MDXRemote {...content} />
      </div>
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const dirPathToRead = path.join(process.cwd(), 'posts');
  const dirs = fs.readdirSync(dirPathToRead);
  const paths = dirs.map((filename) => {
    const filePathToRead = path.join(process.cwd(), `posts/${filename}`);
    const fileContent = fs.readFileSync(filePathToRead, { encoding: 'utf-8' });
    return {
      params: { postSlug: matter(fileContent).data.slug },
    };
  });

  return {
    paths,
    fallback: 'blocking',
  };
};

interface IStaticProps extends ParsedUrlQuery {
  postSlug: string;
}

type Post = {
  post: {
    title: string;
    content: MDXRemoteSerializeResult;
  };
};

export const getStaticProps: GetStaticProps<Post> = async (context) => {
  try {
    const { params } = context;
    const { postSlug } = params as IStaticProps;

    const filePathToRead = path.join(process.cwd(), `posts/${postSlug}.md`);
    const fileContent = fs.readFileSync(filePathToRead, { encoding: 'utf-8' });

    const source: any = await serialize(fileContent, {
      parseFrontmatter: true,
    });

    return {
      props: {
        post: {
          content: source,
          title: source.frontmatter.title,
        },
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};

export default SinglePage;
