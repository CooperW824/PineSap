import { prisma } from "../prisma"

// may need this
//import { RequestStatus } from "@prisma/client"
//status: RequestStatus

export class Request {
    // Local variables
    id: number
    constructor(data: {
        id: number
    }) {
        this.id= data.id
    }
    
    //constructor(itemId: string) {{
    // Fetch item attrs. from the database
    //}

    //static Item create(name: string, price: number, link: string ...){
    // Create the item in the database and return the object
    //}

// Getter methods can use the local values stored in the object

// Setter methods should update the database and the local object attributes

}