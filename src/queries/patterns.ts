/** Represents the valid parts of an insert query */
export const insertPattern = new RegExp(
  /(INSERT|insert) (INTO|into) (?<table>[a-zA-Z_]*) (?<columns>\([a-zA-Z0-9, ]*\)) (VALUES|values) (?<values>\([a-zA-Z0-9, ]*\))/g,
);

/** Represents the valid parts of a select query */
export const selectPattern = new RegExp(
  /(SELECT|select) (?<requested>[a-zA-Z0-9\*\, _]*) (FROM|from) (?<table>[a-zA-Z_]*) ?(WHERE|where)? ?(?<conditions>[a-zA-Z0-9=!<> '"]*)?/g,
);

/** Represents the valid parts of an update query */
export const updatePattern = new RegExp(
  /(UPDATE|update) (?<table>[a-zA-Z_]*) (SET|set) (?<updates>[a-zA-Z0-9 =,]*) (WHERE|where) (?<condition>[a-zA-Z0-9=!<> '"]*)/g,
);

/** Represents the valid parts of a delete query */
export const deletePattern = new RegExp(
  /(DELETE|delete) (FROM|from) (?<table>[a-zA-Z_]*) (WHERE|where) (?<conditions>[a-zA-Z0-9=!<> '"]*)/g,
);
