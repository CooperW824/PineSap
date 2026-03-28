import { prisma } from "../prisma"

/// Class for items in the DB
export class Item {
    // Local variables
    id: number
    name: string
    price: number
    description?: string


    /// Cosntructor
    constructor(data: {
        id: number
        name: string
        price: number
        description?: string
    }) {
        this.id= data.id
        this.name= data.name
        this.price= data.price
        this.description= data.description
    }

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
    
    /// create item in DB function
     static async create(
        itemId: number,
        itemName: string,
        itemPrice: number,
        itemDescription?: string,
    ): Promise<Item | null> {
        const item = await prisma.item.create({
            data: {
                itemName,
                itemPrice,
                itemDescription,
            },
        })
        return new Item({
            id: item.itemId,
            name: item.itemName,
            price: Number(item.itemPrice),
            description: item.itemDescription ?? undefined,
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