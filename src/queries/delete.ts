import { validateDeleteQuery } from "../validator";
import { QueryInterface, RedisCommand } from "../queries";

export class DeleteQuery implements QueryInterface {
  constructor(rawQuery: string) {
    validateDeleteQuery(rawQuery);
  }

  getRedisCommand(): RedisCommand {
    throw new Error("Method not implemented.");
  }

  /** Sets the private key on the instance of the query */
  public setPrivateKey = (privateKey: string): this => {
    this.privateKey = privateKey;

    return this;
  };

  /** Returns the formatting redis command from the instruction set */
  public getRedisCommand = (): RedisCommand => {
    // Stringify the value for hashing and storage
    const encodedValues = JSON.stringify(this.parsedRecord);

    return [
      Command.Set, // Command
      `${this.table}:${this.getPrivateKey()}`, // Key
      encodedValues, // Value
      "NX", // If Not Exists
    ];
  };

  /** Method for retrieving the private key that does sanity checks */
  private getPrivateKey = (): string => {
    if (this.privateKey) {
      return this.privateKey;
    }

    throw new Error(
      "Please set a private key on the query. (Use the query manager to do this for you)"
    );
  };
}
