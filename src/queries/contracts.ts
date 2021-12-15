export type RedisCommand = {
  command: string[];
  additional: { [key: string]: unknown };
};

/**
 * Represents the interface of a query for the data
 */
export interface QueryInterface {
  /** Returns the command that the manager will send to redis */
  getRedisCommand(): RedisCommand;

  /** Sets the private key for the query */
  setPrivateKey(privateKey: string): this;

  /** Returns the table we're operating on */
  getTable(): string;
}
