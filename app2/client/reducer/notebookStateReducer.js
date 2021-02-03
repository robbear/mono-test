import { fromJS } from 'immutable';
import { v4 as uuidv4 } from 'uuid';

// Reduce `action` through `state`. Our state is a immutable `Map` and
// our `action` a js object.
function notebookStateReducer(state, action) {
  const id = action.payload.id || uuidv4();

  switch (action.type) {
    case 'db.cell/add': {
      return state.setIn(['cells', id], fromJS({ type: action.payload.type }));
    }
    case 'db.cell/mutate': {
      return state.updateIn(['cells', id], cell =>
        cell.merge(fromJS(action.payload)),
      );
    }
    case 'db.cell/delete': {
      return state.deleteIn(['cells', id]);
    }
    default:
      throw new Error('unknown action.type: ' + action.type);
  }
}

export { notebookStateReducer };
