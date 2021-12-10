import { validateInsertQuery } from "../validator";
import { QueryInterface, RedisCommand } from "../queries";
import { insertPattern } from "./patterns";

/** Enumeration for the redis command parts */
enum Command {
  Set = "SET",
}

/** This type is for parsed records */
type ParsedRecord = { [key: string]: string | number | boolean };

/**
 * This represents a parsed and processed insert query
 */
export class InsertQuery implements QueryInterface {
  /** Represents a parsed insert record */
  private readonly parsedRecord: ParsedRecord = {};

  /** Ingests the query and handles parsing out the record */
  constructor(rawQuery: string) {
    validateInsertQuery(rawQuery);

    const groups = insertPattern.exec(rawQuery)?.groups;

    if (!groups) {
      throw new Error("You passed an invalid query");
    }

    const parsedColumns = groups?.columns
      .replace("(", "")
      .replace(")", "")
      .split(", ");

    const parsedValues = groups?.values
      .replace("(", "")
      .replace(")", "")
      .split(", ");

    if (parsedColumns.length !== parsedValues.length) {
      throw new Error("You passed an invalid query");
    }

    for (let i = 0; i < parsedColumns.length; i += 1) {
      this.parsedRecord[parsedColumns[i]] = parsedValues[i];
    }
  }

  /** Returns the formatting redis command from the instruction set */
  getRedisCommand(): RedisCommand {
    // Array format: command, key, value, not exists
    return [Command.Set, "", "", "NX"];
  }
}
