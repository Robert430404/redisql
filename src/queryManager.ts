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
  public execute = async (query: SqlQuery): Promise<void> => {
    const queryInstance = query.getQuery();

    queryInstance.setPrivateKey(
      await this.keyManager.getNextPrimaryKey(queryInstance.getTable()),
    );

    try {
      await this.connection.sendCommand(queryInstance.getRedisCommand());
    } catch (e) {
      console.error('could not operate on the redis instance', e);
    }
  };
}
