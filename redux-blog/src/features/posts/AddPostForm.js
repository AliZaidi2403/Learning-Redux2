import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postAdded, addNewpost } from "./postSlice";
import { selectAllUsers } from "../users/usersSlice";
function AddPostForm() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [userId, setUserId] = useState("");
  const [addRequestStatus, setRequestStatus] = useState("idle");
  const users = useSelector(selectAllUsers);
  const dispatch = useDispatch();
  const canSave = title && body && userId && addRequestStatus === "idle";
  const onSavePostClicked = (e) => {
    e.preventDefault();
    if (canSave) {
      try {
        setRequestStatus("pending");
        dispatch(addNewpost({ title, body, userId })).unwrap();
        //RTK add a unwrap funciton to the returned promise which returns a promise that either retutn
        //payload or throws an error
        setTitle("");
        setBody("");
        setUserId("");
      } catch (err) {
        console.log("Failed to save the post", err);
      } finally {
        setRequestStatus("idle");
      }
    }
  };
  const userOptions = users.map((user) => (
    <option key={user.id} value={user.id}>
      {user.name}
    </option>
  ));
  return (
    <section>
      <h2>Add a New Post</h2>
      <form>
        <label htmlFor="postTitle">Post Title : </label>
        <input
          id="postTitle"
          type="text"
          name="postTitle"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <label htmlFor="postAuthor">Author</label>
        <select
          id="postAuthor"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        >
          <option value=""></option>
          {userOptions}
        </select>
        <label htmlFor="postContent">Content: </label>
        <textarea
          id="postContent"
          name="postContent"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <button type="submit" onClick={onSavePostClicked} disabled={!canSave}>
          Save Post
        </button>
      </form>
    </section>
  );
}

export default AddPostForm;
