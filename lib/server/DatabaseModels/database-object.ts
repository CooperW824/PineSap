export class DatabaseObject {
  protected object_id: string;
  // This would be a base class for all database objects, and would handle common functionality like saving to the database, etc.

  protected constructor(id: string) {
    // Fetch the object from the database using the id, and populate the fields of the object.
    // Throw an error if the object is not found.
    this.object_id = id;
  }

  static async getById(id: string): Promise<DatabaseObject | null> {
    // Fetch the object from the database using the id, and return an instance of the object.
    return new Promise((resolve) => resolve(new DatabaseObject(id)));
  }

  static create(data: any): Promise<DatabaseObject> {
    // Create a new object in the database with the given data, and return an instance of the object.
    return new Promise((resolve) => resolve(new DatabaseObject("")));
  }

  delete(): Promise<void> {
    // Delete the object from the database.
    return new Promise((resolve) => resolve());
  }

  static async count(): Promise<number> {
    // Return the total number of objects in the database.
    return 0;
  }

  static async list(page_size: number, page_number: number): Promise<Object[]> {
    // Return a paginated list of simple objects only containing the attributes of the object and none of the functionality
    // of updating the object.
    return [];
  }

  get id(): string {
    return this.object_id;
  }

  async save(): Promise<void> {
    // Save the current state of the object to the database.
    return new Promise((resolve) => resolve());
  }
}
