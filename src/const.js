const UserActions = {
  ADD: 'add',
  EDIT: 'edit',
  DELETE: 'delete'
};

const TripPointStates = {
  Point: 'point',
  Edit: 'edit',
  New: 'new',
  Null: 'null'
};

const ApiMethod = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE'
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export {UserActions, TripPointStates, ApiMethod, UpdateType, TimeLimit};
