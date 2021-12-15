import { QueryManager } from './queryManager';
import { SqlQuery } from './query';

describe('Unit QueryManager Class', () => {
  it('Should Execute Insert Query', () => {
    const mock = jest.fn();
    const redisClientInstance = new mock();
    const keyManagerInstance = new mock();

    // Mock out the primary key and validate the table is correct
    keyManagerInstance.getNextPrimaryKey = (table: string): string => {
      expect(table).toBe('MY_TABLE');

      return 'test-key';
    };

    redisClientInstance.sendCommand = (redisCommand: string[]) => {
      // Make sure the array is the right length
      expect(typeof redisCommand?.length).toEqual('number');
    };

    // Create our manager instance
    const manager = new QueryManager(redisClientInstance, keyManagerInstance);

    // Send the command through to the mocked instances
    manager.execute(new SqlQuery('INSERT into MY_TABLE (one) VALUES (one)'));
  });
});
