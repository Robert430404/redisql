import { DeleteQuery, InsertQuery, SelectQuery, UpdateQuery } from "./queries";
import { SqlQuery, SupportedTypes } from "./query";

describe("SQLQuery Class", () => {
  it("Should correctly detect SELECT queries", () => {
    const queries = [
      "select * from table",
      "SELECT * from table",
      "select * from table WHERE id < 0",
      "SELECT * from table WHERE id > 0",
      "select * from table where id < 0",
      "SELECT * from table where id > 0",
      "select * from table where id == 0",
      "SELECT * from table where id != 0",
    ];

    queries.forEach((query) => {
      const sqlQuery = new SqlQuery(query);

      expect(sqlQuery.getQueryType()).toBe(SupportedTypes.Select);
      expect(sqlQuery.getQuery()).toBeInstanceOf(SelectQuery);
    });
  });

  it("Should correctly detect INSERT queries", () => {
    const queries = [
      "insert INTO TABLE_NAME (column1, column2, column3) VALUES (value1, value2, value3)",
      "INSERT INTO TABLE_NAME (column1, column2, column3) VALUES (value1, value2, value3)",
    ];

    queries.forEach((query) => {
      const sqlQuery = new SqlQuery(query);

      expect(sqlQuery.getQueryType()).toBe(SupportedTypes.Insert);
      expect(sqlQuery.getQuery()).toBeInstanceOf(InsertQuery);
    });
  });

  it("Should correctly detect UPDATE queries", () => {
    const queries = [
      "update table_name SET column1 = value1 WHERE condition",
      "UPDATE table_name SET column1 = value1 WHERE condition",
    ];

    queries.forEach((query) => {
      const sqlQuery = new SqlQuery(query);

      expect(sqlQuery.getQueryType()).toBe(SupportedTypes.Update);
      expect(sqlQuery.getQuery()).toBeInstanceOf(UpdateQuery);
    });
  });

  it("Should correctly detect DELETE queries", () => {
    const queries = [
      "delete FROM table_name WHERE column < 1",
      "DELETE FROM table_name WHERE column < 1",
    ];

    queries.forEach((query) => {
      const sqlQuery = new SqlQuery(query);

      expect(sqlQuery.getQueryType()).toBe(SupportedTypes.Delete);
      expect(sqlQuery.getQuery()).toBeInstanceOf(DeleteQuery);
    });
  });
});
