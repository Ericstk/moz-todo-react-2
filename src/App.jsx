import Form from './components/Form';
import FilterButton from './components/FilterButton';
import Todo from './components/Todo';
import { useState, useRef, useLayoutEffect, useReducer } from 'react';
import { nanoid } from 'nanoid';
import usePrevious from './components/usePrevious';
import { FilterContext, UpdateConext, AddContext } from './Context';

const initialTasks = [
  { id: 'todo-0', name: 'Eat', completed: true },
  { id: 'todo-1', name: 'Sleep', completed: false },
  { id: 'todo-2', name: 'Repeat', completed: false }
];

function tasksReducer (tasks, action) {
  switch (action.type) {
    case 'added': {
      const newTask = {
        id: `todo-${nanoid()}`,
        name: action.name,
        completed: false
      };
      return [...tasks, newTask];
    }
    case 'updated': {
      const updatedTasks = tasks.map(task => {
        // if this task has the same ID as the edited task
        if (action.id === task.id) {
          // use object spread to make a new object
          // whose `completed` prop has been inverted
          return { ...task, completed: !task.completed };
        }
        return task;
      });
      return updatedTasks;
    }
    case 'deleted': {
      const remainingTasks = tasks.filter(task => action.id !== task.id);
      return remainingTasks;
    }
    case 'edited': {
      const editedTaskList = tasks.map(task => {
        // if this task has the same ID as the edited task
        if (action.id === task.id) {
          // Copy the task and update its name
          return { ...task, name: action.name };
        }
        // Return the original task if it's not the edited task
        return task;
      });
      return editedTaskList;
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

const FILTER_MAP = {
  All: () => true,
  Active: task => !task.completed,
  Completed: task => task.completed
};

const FILTER_NAMES = Object.keys(FILTER_MAP);

export default function App () {
  const [filter, setFilter] = useState('All');
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);

  function addTask (name) {
    dispatch({
      type: 'added',
      name: name
    });
  }

  function toggleTaskCompleted (id) {
    dispatch({
      type: 'updated',
      id: id
    });
  }

  function deleteTask (id) {
    dispatch({
      type: 'deleted',
      id: id
    });
  }

  function editTask (id, newName) {
    dispatch({
      type: 'edited',
      id: id,
      name: newName
    });
  }

  const taskList = tasks
    .filter(FILTER_MAP[filter])
    .map(task => (
      <Todo
        id={task.id}
        name={task.name}
        completed={task.completed}
        key={task.id}
      />
    ));

  const filterList = FILTER_NAMES.map(name => (
    <FilterButton key={name} name={name} />
  ));

  const tasksNoun = taskList.length !== 1 ? 'tasks' : 'task';
  const headingText = `${taskList.length} ${tasksNoun} remaining`;
  const listHeadingRef = useRef(null);
  const prevTaskLength = usePrevious(tasks.length);

  useLayoutEffect(() => {
    if (tasks.length < prevTaskLength) {
      listHeadingRef.current.focus();
    }
  }, [tasks.length, prevTaskLength]);

  return (
    <FilterContext.Provider value={[filter, setFilter]}>
      <UpdateConext.Provider
        value={[toggleTaskCompleted, deleteTask, editTask]}>
        <AddContext.Provider value={addTask}>
          <div className='todoapp stack-large'>
            <h1>TodoMatic</h1>
            <Form />
            <div className='filters btn-group stack-exception'>
              {filterList}
            </div>
            <h2 id='list-heading' tabIndex='-1' ref={listHeadingRef}>
              {headingText}
            </h2>
            <ul
              role='list'
              className='todo-list stack-large stack-exception'
              aria-labelledby='list-heading'>
              {taskList}
            </ul>
          </div>
        </AddContext.Provider>
      </UpdateConext.Provider>
    </FilterContext.Provider>
  );
}
