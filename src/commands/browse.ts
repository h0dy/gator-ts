import { getPostsForUser } from "src/lib/db/queries/posts";
import { User } from "src/lib/db/schema";

export const handlerBrowse = async (
  cmdName: string,
  user: User,
  ...args: string[]
) => {
  let limit = 2;
  let actualLimit = parseInt(args[0]);
  if (actualLimit) {
    limit = actualLimit;
  }
  const posts = await getPostsForUser(user.id, limit);

  console.log(`Found ${posts.length} posts for user ${user.name}`);
  for (let post of posts) {
    console.log(`
${post.publishedAt} from ${post.feedName}
--- ${post.title} ---
    ${post.description}
Link: ${post.url}
=====================================`);
  }
};
