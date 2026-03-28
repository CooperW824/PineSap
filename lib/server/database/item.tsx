import { prisma } from "../prisma"

/// Class for items in the DB
export class Item {
    // Local variables
    id: number
    name: string
    price: number
    description?: string


    /// Cosntructor
    // apparently its illegal to have an asynch contructor, so we can't fetch from DB here?
    constructor(data: {
    id: number
    name: string
    price: number
    description?: string
  }) {
    this.id = data.id
    this.name = data.name
    this.price = data.price
    this.description = data.description
  }

    // do we delete this function now? since fromID does basically the same thing. 
    /// Fetch from DB, returns null if the item doesn't exist
    static async fetchByID(itemId: number): Promise<Item | null> {
        const item = await prisma.item.findUnique({
            where: {id: itemId},
        })

        if (!item) return null

        return new Item({
            id: item.id,
            name: item.name,
            price: item.price,
            description: item.description ?? undefined, // says this desc may be null
        })
    }

    /// Create from DB by ID
    static async fromId(itemId: number): Promise<Item | null> {
        const item = await prisma.item.findUnique({
        where: { id: itemId },
        })

        if (!item) return null

        return new Item({
        id: item.id,
        name: item.name,
        price: Number(item.price),
        description: item.description ?? undefined,
        })
    }
    
    /// create item in DB function
    static async create(): Promise<Item> {
        const item = await prisma.item.create({
        data: {
            name: "",        // placeholder
            price: 0,        // placeholder
        },
        })

        return new Item({
        id: item.id,
        name: item.name,
        price: Number(item.price),
        description: item.description ?? undefined,
        })
    }

    //getters (send local data)
    getId(): number {
        return this.id
    }
    getName(): string {
        return this.name
    }
    getPrice(): number {
        return this.price
    }
    getDesc(): string | null {
        if(!this.description){return null}
        else{
            return this.description
        }
    }
    
    //setters (update local and DB data)
    async setName(newName: string): Promise<void> {
    // update DB
    await prisma.item.update({
      where: { id: this.id },
      data: { name: newName },
    })
    // update local object
    this.name = newName
  }
    async setPrice(newPrice: number): Promise<void> {
    await prisma.item.update({
      where: { id: this.id },
      data: { price: newPrice },
    })
    this.price = newPrice
  }
    async setDescription(newDescription: string): Promise<void> {
    // update DB
    await prisma.item.update({
      where: { id: this.id },
      data: { description: newDescription },
    })
    // update local object
    this.description = newDescription
  }

  // special functions


}