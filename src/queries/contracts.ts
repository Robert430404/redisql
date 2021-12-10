export type RedisCommand = string[];

/**
 * Represents the interface of a query for the data
 */
export interface QueryInterface {
  /** Returns the command that the manager will send to redis */
  getRedisCommand(): RedisCommand;
}
