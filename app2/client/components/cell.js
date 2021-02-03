import '../styles/codemirror.css';
import '../styles/cell.css';
import 'codemirror/mode/clike/clike.js';

import CodeMirror from 'codemirror';
import { List } from 'immutable';
import React from 'react';

import { useDebouncedEffect } from '../hooks/useDebouncedEffect.js';
import { query } from '../utils/database.js';

/**
 * Renders a cell output when its present.
 *
 * @param {{
 *   cell: Map<K, V>;
 *   id: string;
 * }} props
 */
function CellOutput({ id, cell }) {
  // Output will be a data structure mapping RelPath to column.
  return (
    <rel-cell-output key={id}>
      {(cell.get('output') || List()).map(outputRelation => {
        const columns = outputRelation.get('columns');
        const relationPath = outputRelation.get('relPath');
        return (
          <div key={relationPath}>
            <span>{relationPath}</span>
            <table>
              <thead>
                {columns.map((tuple, indexT) => (
                  <tr key={indexT}>
                    {tuple.map((value, indexV) => (
                      <td key={indexV}>{value}</td>
                    ))}
                  </tr>
                ))}
              </thead>
            </table>
          </div>
        );
      })}
    </rel-cell-output>
  );
}

/**
 * Component that wraps a `CodeMirror` editor and lets users input logic.
 *
 * @param {{
 *   id: String;
 *   cell: Map<K, V>;
 *   dispatch: Function;
 * }} props
 */
function CellInput({ id, cell, dispatch }) {
  const dom_node_reference = React.useRef(null);
  const source = cell.get('source', '');

  // 500 ms timeout.
  useDebouncedEffect(
    500,
    () => {
      // Run the query ...
      /* eslint-disable no-unused-vars */
      query('cljs-test-db', source, ['out'], (error, result, response) => {
        // result is a `QueryActionResult`.
        const relationDict = result.output.map(
          ({ rel_key: { keys }, columns }) => {
            const relationPath = keys
              .filter(key => key.startsWith(':'))
              .join('/');
            return {
              columns: columns,
              relPath: relationPath,
            };
          },
        );

        // Also fetch all problems that we might got for that query! We are going
        // to create a single string from all problems by concatenating them.
        const problems = result.problems;

        /// ... And finally dispatch the changes.
        dispatch({
          type: 'db.cell/mutate',
          payload: { id: id, output: relationDict, problems: problems },
        });
      });
    },
    [source],
  );

  /// `useLayoutEffect` will run synchronouysly after the DOM
  /// mutations and before all other `useEffect`.
  React.useLayoutEffect(() => {
    const cm = CodeMirror(
      element => {
        dom_node_reference.current.append(element);
      },
      { mode: 'text/x-scala' },
    );

    const onChange = () => {
      dispatch({
        type: 'db.cell/mutate',
        payload: { id: id, source: cm.getValue() },
      });
    };

    /// Set the input value in the code editor window, to whatever might be already in the cell.
    cm.setValue(source);

    /// Register an onChange method to dispatch when the user edits code.
    cm.on('change', onChange);

    // Its important to add `[]` as the second argument else React
    // will rerun the effect on every render. That would entail appending
    // more editor elements.
  }, []);

  return <rel-cell-input ref={dom_node_reference} />;
}

/**
 * Component to render potential problems/errors of a cell.
 *
 * @param {string} id
 * @param {Map<K, V>} cell
 */
function CellSelector({ id, selection, dispatch }) {
  const onBlur = element =>
    dispatch({
      type: 'db.cell/mutate',
      payload: { id: id, type: element.target.value },
    });

  return (
    <select onBlur={onBlur} defaultValue={selection}>
      <option> query </option>
      <option> install </option>
    </select>
  );
}

/**
 * Component to render potential problems/errors of a cell.
 *
 * @param {string} id
 * @param {Map<K, V>} cell
 */
function CellProblem({ id, cell }) {
  return <div></div>;
}

/**
 * Component to add/delete cells of `selection` type.
 *
 * @param {Function} dispatch
 * @param {string} id
 * @param {string} selection
 */
function CellControl({ dispatch, id, selection }) {
  return (
    <div>
      <button
        onClick={() =>
          dispatch({
            type: 'db.cell/add',
            payload: { type: selection, prev_id: id },
          })
        }
      >
        +
      </button>
      <button
        onClick={() =>
          dispatch({ type: 'db.cell/delete', payload: { id: id } })
        }
      >
        -
      </button>
    </div>
  );
}

/**
 * Root cell component. Renders a cell depending on the `cell.get('type')`
 * field. Currently we support `install` and `query` cells.
 *
 * @param {{
 *   id: String;
 *   cell: Map<K, V>;
 *   dispatch: Function;
 * }} props
 */
const Cell = ({ id, cell, dispatch }) =>
  React.useMemo(() => {
    const selection = cell.get('type') || 'query';

    return (
      <div>
        <span>
          <CellSelector id={id} selection={selection} dispatch={dispatch} />
          <CellControl id={id} selection={selection} dispatch={dispatch} />
          <CellInput id={id} cell={cell} dispatch={dispatch} />
          <CellOutput id={id} cell={cell} />
          <CellProblem id={id} cell={cell} />
        </span>
      </div>
    );
  }, [id, cell]);

export { Cell };
