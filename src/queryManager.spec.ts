import { QueryManager } from './queryManager';
import { SqlQuery } from './query';
import { RedisCommand } from 'queries';

describe('QueryManager Class', () => {
  it('Should Execute Insert Query', () => {
    const mock = jest.fn();
    const redisClientInstance = new mock();
    const keyManagerInstance = new mock();

    // Mock out the primary key and validate the table is correct
    keyManagerInstance.getNextPrimaryKey = (table: string): string => {
      expect(table).toBe('MY_TABLE');

      return 'test-key';
    };

    redisClientInstance.sendCommand = (redisCommand: RedisCommand) => {
      // Make sure the array is the right length
      expect(redisCommand.length).toEqual(4);

      // Make sure all of the values match the expected arguments
      expect(redisCommand[0]).toEqual('SET');
      expect(redisCommand[1]).toEqual('MY_TABLE:test-key');
      expect(redisCommand[2]).toEqual('{"one":"one"}');
      expect(redisCommand[3]).toEqual('NX');
    };

    // Create our manager instance
    const manager = new QueryManager(redisClientInstance, keyManagerInstance);

    // Send the command through to the mocked instances
    manager.execute(new SqlQuery('INSERT into MY_TABLE (one) VALUES (one)'));
  });
});
