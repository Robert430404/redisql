import { KeyManager } from 'data/keyManager';
import { createClient } from 'redis';
import { SqlQuery } from './query';

/** The redis client type, derived from the return type of createClient */
type RedisClient = ReturnType<typeof createClient>;

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
  public execute = (query: SqlQuery) => {
    const queryInstance = query.getQuery();

    queryInstance.setPrivateKey(
      this.keyManager.getNextPrimaryKey(queryInstance.getTable()),
    );

    this.connection.sendCommand(queryInstance.getRedisCommand());
  };
}
