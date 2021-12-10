/** Represents the valid parts of an insert query */
export const insertPattern = new RegExp(
  /([INSERTinsert]*) ([INTOinto]*) (?<table>[a-zA-Z_]*) (?<columns>\([a-zA-Z0-9, ]*\)) ([VALUESvalue]*) (?<values>\([a-zA-Z0-9, ]*\))/g
);

/** Represents the valid parts of a select query */
export const selectPattern = new RegExp(
  /([selectSELECT]*) (?<requeted>[a-zA-Z\*, _]*) ([FROMfrom]*) (?<table>[a-zA-Z_]*)/g
);

/** Represents the valid parts of an update query */
export const updatePattern = new RegExp(
  /([UPDATEupdate]*) (?<table>[a-zA-Z_]*) ([setSET]*) (?<updates>[a-zA-Z0-9 =,]*) ([whereWHERE]*) (?<condition>[a-zA-Z0-9=!<> '"]*)/g
);

/** Represents the valid parts of a delete query */
export const deletePattern = new RegExp(
  /([DELETEdelete]*) ([fromFROM]*) (?<table>[a-zA-Z_]*) ([whereWHERE]*) (?<conditions>[a-zA-Z0-9=!<> '"]*)/g
);
