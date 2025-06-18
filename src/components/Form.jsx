import { useState } from "react";
import { useRef, useLayoutEffect, useContext } from "react";
import { AddContext } from "../Context";

function Form() {
  const [name, setName] = useState("");
  const inputRef = useRef();
  const addTask = useContext(AddContext);

  function handleChange(event) {
    setName(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (name === "") {
      alert("Not yet key in.");
      inputRef.current.focus();
      return;
    }
    addTask(name);
    setName("");
    inputRef.current.focus();
  }

  useLayoutEffect(() => {
    // Focus the input element
    inputRef.current.focus();
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="label-wrapper">
        <label htmlFor="new-todo-input" className="label__lg">
          What needs to be done?
        </label>
      </h2>
      <input
        type="text"
        id="new-todo-input"
        className="input input__lg"
        name="text"
        autoComplete="off"
        value={name}
        onChange={handleChange}
        ref={inputRef}
      />
      <button type="submit" className="btn btn__primary btn__lg">
        Add
      </button>
    </form>
  );
}

export default Form;
