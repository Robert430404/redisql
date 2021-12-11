import { validateInsertQuery } from '../validator';
import { QueryInterface, RedisCommand } from '../queries';
import { insertPattern } from './patterns';
import { isInsertGroup } from './guards';

/** Enumeration for the redis command parts */
enum Command {
  Set = 'SET',
}

/** This type is for parsed records */
type ParsedRecord = { [key: string]: string | number | boolean };

/**
 * This represents a parsed and processed insert query
 */
export class InsertQuery implements QueryInterface {
  /** Represents a parsed insert record */
  private readonly parsedRecord: ParsedRecord = {};

  /** Store the table name for later use on the query */
  private readonly table: string;

  /** The private key for the query, the manager should set this for you */
  private privateKey: string;

  /** Ingests the query and handles parsing out the record */
  constructor(rawQuery: string) {
    validateInsertQuery(rawQuery);

    const groups = insertPattern.exec(rawQuery)?.groups;

    if (!isInsertGroup(groups)) {
      throw new Error('You passed an invalid query');
    }

    const { table, columns, values } = groups;

    const parsedColumns = columns.replace('(', '').replace(')', '').split(', ');
    const parsedValues = values.replace('(', '').replace(')', '').split(', ');

    if (parsedColumns.length !== parsedValues.length) {
      throw new Error('You passed an invalid query');
    }

    for (let i = 0; i < parsedColumns.length; i += 1) {
      this.parsedRecord[parsedColumns[i]] = parsedValues[i];
    }

    this.table = table;
  }

  /** Sets the private key on the instance of the query */
  public setPrivateKey = (privateKey: string): this => {
    this.privateKey = privateKey;

    return this;
  };

  /** Returns the parsed table name from the query */
  public getTable = (): string => {
    return this.table;
  };

  /** Returns the formatting redis command from the instruction set */
  public getRedisCommand = (): RedisCommand => {
    // Stringify the value for hashing and storage
    const encodedValues = JSON.stringify(this.parsedRecord);

    return [
      Command.Set, // Command
      `${this.table}:${this.getPrivateKey()}`, // Key
      encodedValues, // Value
      'NX', // If Not Exists
    ];
  };

  /** Method for retrieving the private key that does sanity checks */
  private getPrivateKey = (): string => {
    if (this.privateKey) {
      return this.privateKey;
    }

    throw new Error(
      'Please set a private key on the query. (Use the query manager to do this for you)',
    );
  };
}
