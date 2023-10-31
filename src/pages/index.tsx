import Head from "next/head";
import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { api } from "~/utils/api";
import type { RouterOutputs } from "~/utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import { LoadingPage, LoadingSpinner } from "~/components/loading";
import { useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import PageLayout from "~/components/layout";

dayjs.extend(relativeTime);

const CreatePostWizard = () => {
  const { user } = useUser();
  const ctx = api.useContext();

  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      setInput("");
      void ctx.posts.getAll.invalidate();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      if (errorMessage?.[0]) {
        toast.error(errorMessage[0]);
      } else {
        toast.error("Failed to post. Please try again later.");
      }
    },
  });

  const [input, setInput] = useState<string>("");

  if (!user) return null;

  return (
    <div className="flex w-full gap-2">
      <Image
        src={user.imageUrl}
        alt={`${user.username} profile image`}
        className="h-12 w-12 rounded-full"
        width={48}
        height={48}
      />
      <input
        className="grow bg-transparent p-2 outline-none"
        placeholder="Type some emojis :D"
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key == "Enter") {
            e.preventDefault();
            if (input !== "") {
              mutate({ content: input });
            }
          }
        }}
        disabled={isPosting}
        value={input}
      />
      {input !== "" && !isPosting && (
        <button disabled={isPosting} onClick={() => mutate({ content: input })}>
          Post
        </button>
      )}
      {isPosting && (
        <div className="flex items-center justify-center">
          <LoadingSpinner size={20} />
        </div>
      )}
    </div>
  );
};

type PostWithUser = RouterOutputs["posts"]["getAll"][number];
const PostView = (props: PostWithUser) => {
  const { post, author } = props;

  return (
    <div key={post.id} className="flex gap-3 border-b border-slate-400 p-4">
      <Image
        src={author.profileImageUrl}
        alt={`${author.username} profile image`}
        className="h-12 w-12 rounded-full"
        width={48}
        height={48}
      />
      <div className="flex flex-col">
        <div className="text-slate-400">
          <Link href={`/@${author.username}`}>{`@${author.username}`}</Link>
          <Link href={`/post/${post.id}`}>
            <span className="font-thin">
              {" • "}
              {dayjs(post.createdAt).fromNow()}
            </span>
          </Link>
        </div>
        <div className="text-xl">{post.content}</div>
      </div>
    </div>
  );
};

const Feed = () => {
  const { data, isLoading: postsLoading } = api.posts.getAll.useQuery();

  if (postsLoading) return <LoadingPage />;

  if (!data) return <div>Something went wrong.</div>;

  return (
    <div className="flex flex-col">
      {data.map((d) => (
        <PostView {...d} key={d.post.id} />
      ))}
    </div>
  );
};

export default function Home() {
  const { user, isSignedIn, isLoaded: userLoaded } = useUser();

    // start fetching early and use cache later in Feed component
  api.posts.getAll.useQuery();

  // return empty div since user tends to load fast
  if (!userLoaded) return <div />;

  return (
    <PageLayout>
      <div className="flex border-b border-slate-400 p-4">
        {!isSignedIn && <SignInButton />}
        {!!isSignedIn && <CreatePostWizard />}
      </div>
      <Feed />
    </PageLayout>
  );
}
