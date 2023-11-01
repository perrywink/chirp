import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import PageLayout from "~/components/layout";
import { PostView } from "~/components/postview";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import { api } from "~/utils/api";

const SinglePostPage: NextPage<{ id: string }> = ({ id }) => {
  const { data } = api.posts.getById.useQuery({ postId: id });

  if (!data) return <div>404</div>;

  return (
    <>
      <Head>
        <title>{`${data.post.content}`}</title>
      </Head>
      <PageLayout>
        <PostView {...data}/>
      </PageLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const helpers = generateSSGHelper();

  const id = context.params?.id;

  if (typeof id !== "string") throw new Error("no id");

  await helpers.posts.getById.prefetch({ postId: id });

  return {
    props: {
      trpcState: helpers.dehydrate(),
      id,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default SinglePostPage;
