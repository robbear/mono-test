import {
  DefaultApi,
  InstallAction,
  LabeledAction,
  QueryAction,
  Source,
  Transaction,
} from 'rai_db_sdk';

/**
 * Runs a single action against the database `dbname`.
 *
 * @param {string} dbname
 * @param {LabeledAction} action
 * @param {bool} isReadOnly
 * @param {ModeEnum} mode
 * @param {Function} callback
 */
function runAction(dbname, action, isReadOnly, mode, callback) {
  return runActions(
    dbname,
    [action],
    isReadOnly,
    mode,
    (error, actions, response) => {
      callback(error, actions[0].result, response);
    },
  );
}

/**
 * Run `actions` against the database `dbname`.
 *
 * @param {string} dbname
 * @param {LabeledAction[]} actions
 * @param {bool} isReadOnly
 * @param {ModeEnum} mode
 * @param {Function} callback
 */
function runActions(dbname, actions, isReadOnly, mode, callback) {
  const api = new DefaultApi();

  var transaction = new Transaction();
  transaction.mode = mode;
  transaction.dbname = dbname;
  transaction.readonly = isReadOnly || true;

  transaction.actions = actions;

  return api.transactionPost(transaction, function (error, data, response) {
    callback(error, data.actions, response);
  });
}
/**
 * Construct an action for `id` that when used in a transaction runs the logic
 * `source` as a read-only ad-hoc query. Request `outputs`.
 *
 * @param {string} id - Name for this action.
 * @param {string} sourceString - The program.
 * @param {string[]} outputs - The requested outputs for this query.
 * @returns {LabeledAction}
 */
function queryAction(id, sourceString, outputs) {
  var source = new Source();

  source.name = 'query';
  source.path = '';
  source.value = sourceString;

  var action = new QueryAction();

  action.inputs = [];
  action.outputs = outputs;
  action.persist = [];
  action.type = 'QueryAction';
  action.source = source;

  var labeledAction = new LabeledAction();
  labeledAction.name = id;
  labeledAction.action = action;

  return labeledAction;
}

/**
 * Constructs an action to install a piece of source code, `sourceString`, into
 * the source `name`. `id` will be used as the name of the action.
 *
 * @param {string} id
 * @param {string} name
 * @param {string} sourceString
 * @returns {LabeledAction}
 */
function installAction(id, name, sourceString) {
  var source = new Source();

  source.name = name;
  source.path = name;
  source.value = sourceString;

  var action = new InstallAction();

  action.type = 'InstallAction';
  action.source = source;

  var labeledAction = new LabeledAction();
  labeledAction.name = id;
  labeledAction.action = action;

  return labeledAction;
}

//  API
// ==============================================================================

/**
 * Query the database `dbname` call `callback` on `outputs`.
 *
 * @example
 *   query('testdb', 'def foo = 1', [':foo'], (error, result, response) =>
 *     console.log(result),
 *   );
 *
 * @param {string} dbname
 * @param {string} queryString
 * @param {string[]} outputs
 * @param {Function} callback
 * @param {string} id
 */
function query(dbname, queryString, outputs, callback, id = 'single') {
  const action = queryAction(id, queryString, outputs);

  return runAction(dbname, action, true, Transaction.ModeEnum.OPEN, callback);
}

function install(dbname, name, sourceString, callback, id = 'single') {
  const action = installAction(id, name, sourceString);

  return runAction(dbname, action, false, Transaction.ModeEnum.OPEN, callback);
}

function update(dbname, queryString, callback, id = 'single') {
  const action = queryAction(id, queryString, []);

  // Update distinguishes itself from `query` simply because we set readonly to true!
  return runAction(dbname, action, false, Transaction.ModeEnum.OPEN, callback);
}

function queryBatch(dbname, ids, queryStrings, outputs, callback) {
  const actions = queryStrings.map((queryString, index) => {
    queryAction(ids[index], queryString, outputs[index]);
  });

  return runActions(
    dbname,
    actions,
    false,
    Transaction.ModeEnum.OPEN,
    callback,
  );
}

export { install, query, queryBatch, update };
