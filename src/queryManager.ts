import { RedisClient } from './connection';
import { KeyManager } from 'data/keyManager';
import { SqlQuery, SupportedTypes } from './query';

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
    if (query.getQueryType() === SupportedTypes.Insert) {
      return this.handleInsert<T>(query);
    }

    if (query.getQueryType() === SupportedTypes.Select) {
      return this.handleSelect<T>(query);
    }

    return JSON.parse('{}') as T;
  };

  /** Handles the insert queries */
  private handleInsert = async <T>(query: SqlQuery): Promise<T> => {
    const queryInstance = query.getQuery();
    const table = queryInstance.getTable();
    const primaryKey = await this.keyManager.getNextPrimaryKey(table);

    queryInstance.setPrivateKey(primaryKey);

    const command = queryInstance.getRedisCommand().command;

    try {
      await this.connection.sendCommand(command);
    } catch (e) {
      console.error('could not operate on the redis instance', e);
    }

    return JSON.parse(
      await this.connection.sendCommand(['GET', `${table}:${primaryKey}`]),
    ) as T;
  };

  /** Handles the select queries */
  private handleSelect = async <T>(query: SqlQuery): Promise<T> => {
    const queryInstance = query.getQuery();
    const redisCommand = queryInstance.getRedisCommand();

    // Pluck the type of command and the command string
    const [type, key] = redisCommand.command;

    // Pull the other metadata
    const requested = redisCommand.additional?.requested;

    // If it's not a compound key assume it's just
    // the table so theres no primary key. This is a special case
    if (!key.includes(':')) {
      const indexes: string[] = JSON.parse(
        await this.connection.sendCommand([
          'GET',
          `${queryInstance.getTable()}:primaryKey:index`,
        ]),
      );

      // Create our data bag
      const results = [];

      // Loop the index and pull all of the entries
      for (let i = 0; i < indexes.length; i += 1) {
        const result = JSON.parse(
          await this.connection.sendCommand([
            'GET',
            `${queryInstance.getTable()}:${indexes[i]}`,
          ]),
        );

        const transformed: { [key: string]: string | number | boolean } = {};

        if (requested) {
          (requested as string[]).forEach((field) => {
            transformed[field] = result[field];
          });

          results.push(transformed);

          continue;
        }

        results.push(result);
      }

      // The generic will be the type
      return results as unknown as T;
    }

    const result = JSON.parse(
      await this.connection.sendCommand(redisCommand.command),
    ) as T;

    return result.map((entry) => {});
  };
}
