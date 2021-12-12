import { validateSelectQuery } from '../validator';
import { QueryInterface, RedisCommand } from '../queries';
import { selectPattern } from './patterns';
import { isSelectGroup } from './guards';

/** Enumeration for the redis command parts */
enum Command {
  Get = 'GET',
}

/**
 * Represents a select query for the redis instance
 */
export class SelectQuery implements QueryInterface {
  /** The table our query is operating on */
  private readonly table: string;

  /** Our private key if one is provided */
  private privateKey?: string;

  private conditions: string;

  /** Ingets the query and handles parsing the request */
  constructor(rawQuery: string) {
    validateSelectQuery(rawQuery);

    const groups = selectPattern.exec(rawQuery)?.groups;

    if (!isSelectGroup(groups)) {
      throw new Error('You passed an invalid query');
    }

    console.log(groups);
  }

  /** Sets the private key on the instance of the query */
  public setPrivateKey = (privateKey: string): this => {
    this.privateKey = privateKey;

    return this;
  };

  /** Returns the table name for the query */
  public getTable = (): string => {
    return this.table;
  };

  /** Returns the formatting redis command from the instruction set */
  public getRedisCommand = (): RedisCommand => {
    return [
      Command.Get, // Command
      `${this.table}:${this.getPrivateKey()}`, // Key
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
