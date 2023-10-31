import Head from "next/head";
import Image from "next/image";
import { api } from "~/utils/api";

export default function ProfilePage() {
  const { data, isLoading } = api.profile.getUserByUsername.useQuery({
    username: "perrywink",
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data) return <div>404</div>;

  return (
    <>
      <Head>
        <title>{data.username}</title>
      </Head>
      <PageLayout>
        <div className="relative h-24 border-b border-slate-400 bg-slate-600">
          <Image
            src={data.profileImageUrl}
            alt={`${data.username ?? ""}'s profile picture`}
            width={128}
            height={128}
            className="rounded-full absolute bottom-0 left-0 ml-4 -mb-[64px] border-4 border-black"
          />
        </div>
        <div className="h-[64px]"/>
        <div className="p-4 text-2xl font-bold">
          {`@${data.username}`}
        </div>
        <div className="border-b border-slate-400 w-full"/>
      </PageLayout>
    </>
  );
}

import { createServerSideHelpers } from "@trpc/react-query/server";
import superjson from "superjson";
import { appRouter } from "~/server/api/root";
import { db } from "~/server/db";
import { GetStaticProps } from "next";
import PageLayout from "~/components/layout";

export const getStaticProps: GetStaticProps = async (context) => {
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: { db: db, currentUserId: null },
    transformer: superjson, // optional - adds superjson serialization
  });

  const slug = context.params?.slug;

  if (typeof slug !== "string") throw new Error("no slug");

  const username = slug.replace("@", "");

  await helpers.profile.getUserByUsername.prefetch({ username: username });

  return {
    props: {
      trpcState: helpers.dehydrate(),
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};
