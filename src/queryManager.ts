import { RedisClient } from './connection';
import { KeyManager } from 'data/keyManager';
import { SqlQuery } from './query';

/**
 * Handles the managment of the queries within the client connection
 */
export class QueryManager {
  /**
   * Bootstraps the manager instance and intakes a connection
   */
  constructor(
    private readonly connection: RedisClient,
    private readonly keyManager: KeyManager,
  ) {}

  /**
   * Executes the passed query
   */
  public execute = async <T>(query: SqlQuery): Promise<T> => {
    const queryInstance = query.getQuery();
    const table = queryInstance.getTable();
    const primaryKey = await this.keyManager.getNextPrimaryKey(table);

    queryInstance.setPrivateKey(primaryKey);

    try {
      await this.connection.sendCommand(queryInstance.getRedisCommand());
    } catch (e) {
      console.error('could not operate on the redis instance', e);
    }

    return JSON.parse(
      await this.connection.sendCommand(['GET', `${table}:${primaryKey}`]),
    ) as T;
  };
}
