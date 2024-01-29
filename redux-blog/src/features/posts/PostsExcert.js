import PostAuthor from "./PostAuthor";
import TimeAgo from "./TimeAgo";
import ReactionsButton from "./ReactionsButton";
function PostsExcert({ post }) {
  return (
    <article>
      <h3>{post.title}</h3>
      <p>{post.body.substring(0, 100)}</p>
      <p className="postCredit">
        <PostAuthor userId={post.userId} />
        <TimeAgo timestamp={post.date} />
      </p>
      <ReactionsButton post={post} />
    </article>
  );
}

export default PostsExcert;
