const AUTHORIZATION = 'Basic 3cdher8jgen4n83l';
const END_POINT = 'https://18.ecmascript.pages.academy/big-trip';

const UserAction = {
  ADD: 'add',
  EDIT: 'edit',
  DELETE: 'delete'
};

const TripPointState = {
  POINT: 'point',
  EDIT: 'edit',
  NEW: 'new',
  NULL: 'null'
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
  NONE: 'NONE'
};

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export { AUTHORIZATION, END_POINT, UserAction, TripPointState, ApiMethod, UpdateType, TimeLimit };
