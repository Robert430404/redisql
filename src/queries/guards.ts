/** Represents the expected groups for the insert pattern */
export type InsertGroup = {
  table: string;
  columns: string;
  values: string;
};

/** Checks to make sure we have a valid insert group */
export const isInsertGroup = (x: unknown): x is InsertGroup => {
  if (typeof x !== 'object') {
    return false;
  }

  const { table, columns, values } = x as InsertGroup;

  if (typeof table !== 'string') {
    return false;
  }

  if (typeof columns !== 'string') {
    return false;
  }

  if (typeof values !== 'string') {
    return false;
  }

  return true;
};

/** Represents the expected groups for the insert pattern */
export type SelectGroup = {
  table: string;
  requested: string;
  conditions?: string;
};

/** Checks to make sure we have a valid insert group */
export const isSelectGroup = (x: unknown): x is SelectGroup => {
  if (typeof x !== 'object') {
    return false;
  }

  const { table, requested } = x as SelectGroup;

  if (typeof table !== 'string') {
    return false;
  }

  if (typeof requested !== 'string') {
    return false;
  }

  return true;
};
