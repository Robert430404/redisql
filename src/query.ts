import {
  QueryInterface,
  DeleteQuery,
  InsertQuery,
  SelectQuery,
  UpdateQuery,
} from "./queries";

/** The type of the SQL query we handle */
export type QueryString = string;

/** These are the supported query types */
export enum SupportedTypes {
  Select,
  Insert,
  Update,
  Delete,
}

/**
 * Represents a new SQL query we're going to operate on
 */
export class SqlQuery {
  /** The query type we're operating on */
  private queryType: SupportedTypes;

  /** The instance of the query we're going to be operating on */
  private queryInstance: QueryInterface;

  /**
   * Sets up the query instance
   */
  constructor(private readonly query: QueryString) {
    // Register supported query types
    const handlers: { [key: string]: Function } = {
      SELECT: () => {
        this.queryType = SupportedTypes.Select;
        this.queryInstance = new SelectQuery(query);
      },
      INSERT: () => {
        this.queryType = SupportedTypes.Insert;
        this.queryInstance = new InsertQuery(query);
      },
      UPDATE: () => {
        this.queryType = SupportedTypes.Update;
        this.queryInstance = new UpdateQuery(query);
      },
      DELETE: () => {
        this.queryType = SupportedTypes.Delete;
        this.queryInstance = new DeleteQuery(query);
      },
    };

    // Try and pluck a handler
    const handler = handlers[query.toUpperCase().substr(0, 6)];

    // If no handler throw an error
    if (typeof handler === "undefined") {
      throw new Error(
        "You provided us an invalid query, we only support: [SELECT, INSERT, UPDATE, DELETE] queries"
      );
    }

    // Execute the handler if it's found
    handler();
  }

  /**
   * Returns the raw query
   */
  public getRawQuery = (): QueryString => this.query;

  /**
   * Returns the query type
   */
  public getQueryType = (): SupportedTypes => this.queryType;

  /**
   * Returns the query instance that was created
   */
  public getQuery = (): QueryInterface => this.queryInstance;
}
