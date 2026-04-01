import prisma from "../prisma"

// Class for items in the DB
export class Item {

    // Local variables

    //added createdAt and placeOfPurchase to better match our app/item-selection/page.tsx
    id: number
    createdAt: Date
    name: string
    price: number
    quantity: number
    description?: string
    physicalLocation?: string
    placeOfPurchase?: string

    /// Constructor
    protected constructor(data: {
    id: number
    createdAt: Date
    name: string
    price: number
    quantity: number
    description?: string
    physicalLocation ?: string
    placeOfPurchase?: string
  }) {
    this.id = data.id
    this.createdAt = data.createdAt
    this.name = data.name
    this.price = data.price
    this.quantity = data.quantity
    this.description = data.description
    this.physicalLocation = data.physicalLocation
    this.placeOfPurchase = data.placeOfPurchase
  }

    // do we delete this function now? since fromID does basically the same thing. 
    /// Fetch from DB, returns null if the item doesn't exist
    static async fetchByID(itemId: number): Promise<Item | null> {
        const item = await prisma.item.findUnique({
            where: { id: itemId },
        })

        if (!item) return null

        return new Item({
            id: item.id,
            createdAt: item.createdAt,
            name: item.name,
            price: Number(item.price),
            quantity: item.stockQuantity, //change to stockQuantity to match scheme.prisma
            description: item.description ?? undefined,
            physicalLocation: item.physicalLocation ?? undefined,
            placeOfPurchase: item.placeOfPurchase ?? undefined,
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

        // once again just showing I added createdAt and placeOfPurchase
        return new Item({
            id: item.id,
            createdAt: item.createdAt,
            name: item.name,
            price: Number(item.price), //
            quantity: item.stockQuantity,
            description: item.description ?? undefined,
            physicalLocation: item.physicalLocation ?? undefined,
            placeOfPurchase: item.placeOfPurchase ?? undefined,
        })
    }

    //getters (send local data)
    getId(): number {
        return this.id
    }
    getCreatedAt(): Date {
        return this.createdAt
    }
    getName(): string {
        return this.name
    }
    getPrice(): number {
        return this.price
    }
    getQuantity(): number {
        return this.quantity
    }
    getDesc(): string | null {
        if (!this.description) { return null }
        else { return this.description }
    }
    getPhysicalLocation(): string | null {
        if (!this.physicalLocation) { return null }
        else { return this.physicalLocation }
    }
    getPlaceOfPurchase(): string | null {
        if (!this.placeOfPurchase) { return null }
        else { return this.placeOfPurchase }
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
    async setQuantity(newQuantity: number): Promise<void> {
        await prisma.item.update({
            where: { id: this.id },
            data: { stockQuantity: newQuantity },
        })
        this.quantity = newQuantity
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
            data: { physicalLocation: newPhysicalLocation },
        })
        // update local object
        this.physicalLocation = newPhysicalLocation
    }

    // special functions

    // Fetch all items from DB
    static async list(): Promise<Item[]> {
        const items = await prisma.item.findMany()

        return items.map(item => new Item({
            id: item.id,
            createdAt: item.createdAt,
            name: item.name,
            price: Number(item.price),
            quantity: item.stockQuantity,
            description: item.description ?? undefined,
            physicalLocation: item.physicalLocation ?? undefined,
            placeOfPurchase: item.placeOfPurchase ?? undefined,
        }))
    }
}