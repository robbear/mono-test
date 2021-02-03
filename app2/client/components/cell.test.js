import { Map } from 'immutable';

import { notebookStateReducer } from '../reducer/notebookStateReducer.js';

test('create a new query cell', () => {
  const action = {
    type: 'db.cell/add',
    payload: {
      id: '1',
      type: 'query',
    },
  };

  const notebook = Map({ cells: Map() });

  const updated = notebookStateReducer(notebook, action);

  expect(updated.get('cells')).toEqual(Map({ 1: Map({ type: 'query' }) }));
});
