import { validateSelectQuery } from '../validator';
import { QueryInterface, RedisCommand } from '../queries';
import { selectPattern } from './patterns';
import { isSelectGroup } from './guards';

/** Enumeration for the redis command parts */
enum Command {
  Get = 'GET',
}

type AdditionaInformation = {};

/**
 * Represents a select query for the redis instance
 */
export class SelectQuery implements QueryInterface {
  /** The table our query is operating on */
  private readonly table: string;

  /** Our private key if one is provided */
  private privateKey?: string;

  /** These are the conditions for the query */
  private conditions?: string;

  /** These are the requested fields */
  private requested?: string[];

  /** Ingets the query and handles parsing the request */
  constructor(rawQuery: string) {
    validateSelectQuery(rawQuery);

    const groups = selectPattern.exec(rawQuery)?.groups;

    if (!isSelectGroup(groups)) {
      throw new Error('You passed an invalid query');
    }

    const { table, conditions, requested } = groups;

    this.table = table;
    this.conditions = conditions;

    if (!requested.includes('*')) {
      this.requested = requested.split(',').map((entry) => entry.trim());
    }
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
    return {
      command: [
        Command.Get, // Command
        this.hasPrivateKey()
          ? `${this.table}:${this.getPrivateKey()}`
          : this.table, // Key
      ],
      additional: {
        requested: this.requested,
        conditions: this.conditions,
      },
    };
  };

  /** Check if we have a valid primary key */
  private hasPrivateKey = (): boolean => {
    return this.getPrivateKey() !== '';
  };

  /** Method for retrieving the private key that does sanity checks */
  private getPrivateKey = (): string => {
    if (this.privateKey) {
      return this.privateKey;
    }

    return '';
  };
}
