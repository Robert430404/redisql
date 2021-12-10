import { validateDeleteQuery } from "../validator";
import { QueryInterface, RedisCommand } from "../queries";

export class DeleteQuery implements QueryInterface {
  constructor(rawQuery: string) {
    validateDeleteQuery(rawQuery);
  }

  getRedisCommand(): RedisCommand {
    throw new Error("Method not implemented.");
  }
}
