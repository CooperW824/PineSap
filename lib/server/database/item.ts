import { Decimal } from "@prisma/client/runtime/client"
import prisma from "../prisma" //fixed the import, was wrong

/// Class for items in the DB
export class Item {
    // Local variables
    id: number
    name: string
    price: Decimal
    quantity: number
    description?: string
    physicalLocation ?: string


    /// Cosntructor
    // apparently its illegal to have an asynch contructor, so we can't fetch from DB here?
    protected constructor(data: {
    id: number
    name: string
    price: Decimal
    quantity: number
    description?: string
    physicalLocation ?: string
  }) {
    this.id = data.id
    this.name = data.name
    this.price = data.price
    this.quantity = data.quantity
    this.description = data.description
    this.physicalLocation = data.physicalLocation
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
            quantity: item.stockQuantity,
            description: item.description ?? undefined, // says this desc may be null
            physicalLocation: item.physicalLocation ?? undefined, // says this desc may be null
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
        price: item.price,
        quantity: Number(item.stockQuantity),
        description: item.description ?? undefined,
        physicalLocation: item.physicalLocation ?? undefined,
        })
    }

    //getters (send local data)
    getId(): number {
        return this.id
    }
    getName(): string {
        return this.name
    }
    getPrice(): Decimal {
        return this.price
    }
    getQuantity(): number {
        return this.quantity
    }
    getDesc(): string | null {
        if(!this.description){return null}
        else{
            return this.description
        }
    }
    getPhysicalLocation(): string | null {
        if(!this.physicalLocation){return null}
        else{
            return this.physicalLocation
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
    async setPrice(newPrice: Decimal): Promise<void> {
    await prisma.item.update({
      where: { id: this.id },
      data: { price: newPrice },
    })
    this.price = newPrice
  }
    async setQuantity(newQuantity: Decimal): Promise<void> {
    await prisma.item.update({
      where: { id: this.id },
      data: { price: newQuantity },
    })
    this.price = newQuantity
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
    async setPhysicalLocation(newPhysicalLocation: string): Promise<void> {
    // update DB
    await prisma.item.update({
      where: { id: this.id },
      data: { description: newPhysicalLocation },
    })
    // update local object
    this.description = newPhysicalLocation
  }

  // special functions


}