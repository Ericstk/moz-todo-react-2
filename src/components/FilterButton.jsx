import { useContext } from "react";
import { FilterContext } from "../Context";

function FilterButton(props) {
  const filterHook = useContext(FilterContext);
  const filter = filterHook[0];
  const setFilter = filterHook[1];

  return (
    <button
      type="button"
      className="btn toggle-btn"
      aria-pressed={props.name === filter}
      onClick={() => setFilter(props.name)}>
      <span className="visually-hidden">Show </span>
      <span>{props.name}</span>
      <span className="visually-hidden"> tasks</span>
    </button>
  );
}

export default FilterButton;
