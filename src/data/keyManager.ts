type PrimaryKey = string;

export class KeyManager {
  public getNextPrimaryKey = (table: string): PrimaryKey => {
    return '0';
  };
}
