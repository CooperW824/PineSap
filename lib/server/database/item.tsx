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

    /// Fetch from DB
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

    //create item in DB function
    
    //getters (send local data)
    
    //setters (update local and DB data)
}