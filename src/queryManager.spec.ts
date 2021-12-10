import { QueryManager } from "./queryManager";
import { SqlQuery } from "./query";
import { RedisCommand } from "queries";

describe("QueryManager Class", () => {
  it("Should Execute Insert Query", () => {
    const mock = jest.fn();
    const instance = new mock();

    instance.sendCommand = (redisCommand: RedisCommand) => {
      expect(redisCommand.length).toEqual(1);
      expect(redisCommand[0]).toEqual("SET");
    };

    const manager = new QueryManager(instance);

    manager.execute(new SqlQuery("INSERT into MY_TABLE (one) VALUES (one)"));
  });
});
