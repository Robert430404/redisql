import {
  deletePattern,
  insertPattern,
  selectPattern,
  updatePattern,
} from "./queries/patterns";
import { QueryString } from "./query";

/** Validates an insert query */
export const validateInsertQuery = (query: QueryString) => {
  if (!query.match(insertPattern)) {
    throw new Error(`Your query is invalid: ${query}`);
  }
};

/** Validates a select query */
export const validateSelectQuery = (query: QueryString) => {
  if (!query.match(selectPattern)) {
    throw new Error(`Your query is invalid: ${query}`);
  }
};

/** Validates an update query */
export const validateUpdateQuery = (query: QueryString) => {
  if (!query.match(updatePattern)) {
    throw new Error(`Your query is invalid: ${query}`);
  }
};

/** Validates a delete query */
export const validateDeleteQuery = (query: QueryString) => {
  if (!query.match(deletePattern)) {
    throw new Error(`Your query is invalid: ${query}`);
  }
};
