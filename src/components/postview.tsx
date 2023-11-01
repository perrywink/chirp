import type { RouterOutputs } from "~/utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import Link from "next/link";

dayjs.extend(relativeTime);

type PostWithUser = RouterOutputs["posts"]["getAll"][number];
export const PostView = (props: PostWithUser) => {
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

