import { KeyManager } from './data/keyManager';
import { QueryManager } from './queryManager';
import { createClient } from 'redis';
import { DeleteQuery, InsertQuery, SelectQuery, UpdateQuery } from './queries';
import { SqlQuery, SupportedTypes } from './query';
import { RedisClient } from './connection';

type TableNameSchema = {
  id: string;
  column1: string;
  column2: string;
  column3: string;
};

type TableNameCollection = TableNameSchema[];

describe('Unit SQLQuery Class', () => {
  it('Should correctly detect SELECT queries', () => {
    const queries = [
      'select * from table',
      'SELECT * from table',
      'select * from table WHERE id < 0',
      'SELECT * from table WHERE id > 0',
      'select * from table where id < 0',
      'SELECT * from table where id > 0',
      'select * from table where id == 0',
      'SELECT * from table where id != 0',
    ];

    queries.forEach((query) => {
      const sqlQuery = new SqlQuery(query);

      expect(sqlQuery.getQueryType()).toBe(SupportedTypes.Select);
      expect(sqlQuery.getQuery()).toBeInstanceOf(SelectQuery);
    });
  });

  it('Should correctly detect INSERT queries', () => {
    const queries = [
      'insert INTO TABLE_NAME (column1, column2, column3) VALUES (value1, value2, value3)',
      'INSERT INTO TABLE_NAME (column1, column2, column3) VALUES (value1, value2, value3)',
    ];

    queries.forEach((query) => {
      const sqlQuery = new SqlQuery(query);

      expect(sqlQuery.getQueryType()).toBe(SupportedTypes.Insert);
      expect(sqlQuery.getQuery()).toBeInstanceOf(InsertQuery);
    });
  });

  it('Should correctly detect UPDATE queries', () => {
    const queries = [
      'update table_name SET column1 = value1 WHERE condition',
      'UPDATE table_name SET column1 = value1 WHERE condition',
    ];

    queries.forEach((query) => {
      const sqlQuery = new SqlQuery(query);

      expect(sqlQuery.getQueryType()).toBe(SupportedTypes.Update);
      expect(sqlQuery.getQuery()).toBeInstanceOf(UpdateQuery);
    });
  });

  it('Should correctly detect DELETE queries', () => {
    const queries = [
      'delete FROM table_name WHERE column < 1',
      'DELETE FROM table_name WHERE column < 1',
    ];

    queries.forEach((query) => {
      const sqlQuery = new SqlQuery(query);

      expect(sqlQuery.getQueryType()).toBe(SupportedTypes.Delete);
      expect(sqlQuery.getQuery()).toBeInstanceOf(DeleteQuery);
    });
  });
});

describe('Integration SQLQuery Class', () => {
  let redisClient: RedisClient;
  let keyManager: KeyManager;
  let queryManager: QueryManager;

  /** Bootstrap the actual integrated dependencies */
  beforeEach(async () => {
    redisClient = createClient() as RedisClient;
    keyManager = new KeyManager(redisClient);
    queryManager = new QueryManager(redisClient, keyManager);

    await redisClient.connect();
  });

  /** Cleanup the redis connection */
  afterEach(async () => {
    await redisClient.disconnect();
  });

  it('Should Persist Record And Retrieve It', async () => {
    const insertQuery = new SqlQuery(
      'insert INTO TABLE_NAME (column1, column2, column3) VALUES (value1, value2, value3)',
    );

    const insertResult = await queryManager.execute<TableNameSchema>(
      insertQuery,
    );

    expect(insertResult.column1).toEqual('value1');
    expect(insertResult.column2).toEqual('value2');
    expect(insertResult.column3).toEqual('value3');

    const selectQuery = new SqlQuery('select * from TABLE_NAME');

    const selectResult = await queryManager.execute<TableNameCollection>(
      selectQuery,
    );

    expect(Array.isArray(selectResult)).toBeTruthy();

    selectResult.forEach((result) => {
      expect(result.column1).toEqual('value1');
      expect(result.column2).toEqual('value2');
      expect(result.column3).toEqual('value3');
    });

    const selectFieldsQuery = new SqlQuery('select column1 from TABLE_NAME');

    const selectFieldsResult = await queryManager.execute<TableNameCollection>(
      selectFieldsQuery,
    );

    expect(Array.isArray(selectFieldsResult)).toBeTruthy();

    selectFieldsResult.forEach((result) => {
      expect(result.column1).toEqual('value1');
      expect(result.column2).toEqual(undefined);
      expect(result.column3).toEqual(undefined);
    });
  });
});
