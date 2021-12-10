import { createClient } from "redis";
import { SqlQuery } from "./query";

/** The redis client type, derived from the return type of createClient */
type RedisClient = ReturnType<typeof createClient>;

/**
 * Handles the managment of the queries within the client connection
 */
export class QueryManager {
  /**
   * Bootstraps the manager instance and intakes a connection
   */
  constructor(private readonly connection: RedisClient) {}

  /**
   * Executes the passed query
   */
  public execute = (query: SqlQuery) => {
    this.connection.sendCommand(query.getQuery().getRedisCommand());
  };
}
