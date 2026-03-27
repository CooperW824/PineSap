export class DatabaseObject {
  protected object_id: string;
  // This would be a base class for all database objects, and would handle common functionality like saving to the database, etc.

  constructor(id: string) {
    // Fetch the object from the database using the id, and populate the fields of the object.
    // Throw an error if the object is not found.
    this.object_id = id;
  }

  static create(data: any): Promise<DatabaseObject> {
    // Create a new object in the database with the given data, and return an instance of the object.
    return new Promise((resolve) => resolve(new DatabaseObject("")));
  }

  delete(): Promise<void> {
    // Delete the object from the database.
    return new Promise((resolve) => resolve());
  }

  get id(): string {
    return this.object_id;
  }
}
