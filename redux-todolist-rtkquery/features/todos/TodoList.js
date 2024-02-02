import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faUpload } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useGetTodosQuery } from "../api/apiSlice";
function TodoList() {
  const [newTodo, setNewTodo] = useState();
  const {
    data: todos,
    isError,
    isFetching,
    isSuccess,
    error,
  } = useGetTodosQuery();
  const handleSubmit = (e) => {
    e.preventDefault();
    setNewTodo("");
  };
  const newItemSection = (
    <form onSubmit={handleSubmit}>
      <label htmlFor="new-todo">Enter a new todo item</label>
      <div className="new-todo">
        <input
          type="text"
          id="new-todo"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Enter a new todo"
        />
      </div>
      <button type="button" className="submit">
        <FontAwesomeIcon icon={faUpload} />
      </button>
    </form>
  );
  let content;
  if (isFetching) {
    content = <p>Loading...</p>;
  } else if (isSuccess) {
    content = JSON.stringify(todos);
  } else if (isError) {
    content = <p>{error}</p>;
  }
  return (
    <main>
      <h1>Todo List </h1>
      {newItemSection}
      {content}
    </main>
  );
}

export default TodoList;
