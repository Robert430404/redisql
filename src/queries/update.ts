import { validateUpdateQuery } from "../validator";
import { QueryInterface, RedisCommand } from "../queries";

export class UpdateQuery implements QueryInterface {
  constructor(rawQuery: string) {
    validateUpdateQuery(rawQuery);
  }

  getRedisCommand(): RedisCommand {
    throw new Error("Method not implemented.");
  }
}
