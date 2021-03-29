import { Map } from 'immutable';
import React from 'react';

import { notebookStateReducer } from '../reducer/notebookStateReducer.js';
import { Cell } from './cell.js';

// Shared test
import sharedString from '../../../shared/string.js';

// We'll use this context to dispatch state transformations to our notebook state.
const NotebookDispatchContext = React.createContext();

function Cells({ notebook }) {
  // We use `useContext` to get access to our global dispatch method.
  const dispatch = React.useContext(NotebookDispatchContext);

  const cells = [
    ...notebook
      .get('cells')
      .mapEntries(([id, cell]) => [
        id,
        <Cell key={id} id={id} dispatch={dispatch} cell={cell} />,
      ])
      .values(),
  ];

  return cells.length === 0 ? (
    <button
      onClick={() =>
        dispatch({ type: 'db.cell/add', payload: { type: 'query' } })
      }
    >
      Add Cell
    </button>
  ) : (
    cells
  );
}

// React root component.
function App() {
  // This is our representation of the current notebook state. We are
  // following a single state atom approach together with immutable
  // datastructures.
  const initialNotebookState = Map({ cells: Map() });

  // Components can use `dispatch` to mutate the global state.
  const [notebook, dispatch] = React.useReducer(
    notebookStateReducer,
    initialNotebookState,
  );

  return (
    <NotebookDispatchContext.Provider value={dispatch}>
      <div>{sharedString}</div>
      <Cells notebook={notebook} />
    </NotebookDispatchContext.Provider>
  );
}

export { App };
