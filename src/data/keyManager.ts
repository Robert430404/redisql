import { RedisClient } from '../connection';

/** The type for the primary key */
type PrimaryKey = string;

/** Redis commands that we're going to use */
enum Command {
  Set = 'SET',
  Get = 'GET',
  Increment = 'INCR',
}

/**
 * Deals with Primary Keys for the redis setup
 */
export class KeyManager {
  /** Bootstraps the key manager instance */
  constructor(private readonly connection: RedisClient) {}

  /** Returns the next primary key from redis */
  public getNextPrimaryKey = async (table: string): Promise<PrimaryKey> => {
    const primaryRedisKey = `${table}:primaryKey`;
    const indexRedisKey = `${primaryRedisKey}:index`;

    // Setup the auto increment for the table if it's not already there
    await this.connection.sendCommand([
      Command.Set, // Command
      primaryRedisKey, // Key
      '0', // Value
      'NX', // If Not Exists
    ]);

    // Setup the primary key index for the table if it's not already there
    await this.connection.sendCommand([
      Command.Set, // Command
      `${primaryRedisKey}:index`, // Key
      '[]', // Value
      'NX', // If Not Exists
    ]);

    // Increment the key
    await this.connection.sendCommand([Command.Increment, primaryRedisKey]);

    // Retrieve the new key once it's been incremented
    const newKey: PrimaryKey = await this.connection.sendCommand([
      Command.Get,
      primaryRedisKey,
    ]);

    // Update the ID index
    const currentIDs: PrimaryKey[] = JSON.parse(
      await this.connection.sendCommand([Command.Get, indexRedisKey]),
    );

    currentIDs.push(newKey);

    await this.connection.sendCommand([
      Command.Set, // Command
      indexRedisKey, // Key
      JSON.stringify(currentIDs), // Value
    ]);

    return newKey;
  };
}
