import { validateSelectQuery } from "../validator";
import { QueryInterface, RedisCommand } from "../queries";

export class SelectQuery implements QueryInterface {
  constructor(rawQuery: string) {
    validateSelectQuery(rawQuery);
  }

  getRedisCommand(): RedisCommand {
    throw new Error("Method not implemented.");
  }
}
