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
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

const OfferTypes = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

export {UserActions, TripPointStates, ApiMethod, OfferTypes, UpdateType};
