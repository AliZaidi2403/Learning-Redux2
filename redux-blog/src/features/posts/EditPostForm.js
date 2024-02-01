import { useState } from "react";
import { UseDispatch, useDispatch, useSelector } from "react-redux";
import { selectPostById, updatePost, deletePost } from "./postSlice";
import { useParams, useNavigate } from "react-router-dom";

import { selectAllUsers } from "../users/usersSlice";

function EditPostForm() {
  const { postId } = useParams();
  const navigate = useNavigate();

  const post = useSelector((state) => selectPostById(state, Number(postId)));
  const users = useSelector(selectAllUsers);

  const [title, setTitle] = useState(post?.title);
  const [body, setBody] = useState(post?.body);
  const [userId, setUserId] = useState(post?.userId);
  const [requestStatus, setRequestStatus] = useState("idle");

  const dispatch = useDispatch();
  if (!post) {
    return (
      <section>
        <h2>Post not found</h2>
      </section>
    );
  }
  const canSave = title && body && userId && requestStatus === "idle";
  const handleSave = () => {
    if (canSave) {
      try {
        setRequestStatus("pending");
        dispatch(
          updatePost({
            id: post.id,
            title,
            body,
            userId,
            reactions: post.reactions,
          })
        ).unwrap();
        setTitle("");
        setBody("");
        setUserId("");
        navigate(`/post/${postId}`);
      } catch (err) {
        console.error("Failed to edit the post", err);
      } finally {
        setRequestStatus("idle");
      }
    }
  };
  const userOptions = users.map((user) => (
    <option value={user.id} key={user.id}>
      {user.name}
    </option>
  ));

  const handleDelete = () => {
    try {
      setRequestStatus("pending");
      dispatch(deletePost({ id: post.id })).unwrap();
      setTitle("");
      setBody("");
      setUserId("");
      navigate("/");
    } catch (err) {
      console.error("Failed to delete the post", err);
    } finally {
      setRequestStatus("idle");
    }
  };
  return (
    <section>
      <h2>Edit Post</h2>
      <form>
        <label htmlFor="postTitle">Post Title</label>
        <input
          type="text"
          id="postTitle"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <label htmlFor="postAuthor">Author : </label>
        <select
          id="postAuthor"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        >
          <option value=""></option>
          {userOptions}
        </select>
        <label htmlFor="postContent">Content</label>
        <textarea
          id="postContent"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <button type="button" onClick={handleSave} disabled={!canSave}>
          Save Post
        </button>
        <button type="button" onClick={handleDelete}>
          Delete Post
        </button>
      </form>
    </section>
  );
}

export default EditPostForm;
