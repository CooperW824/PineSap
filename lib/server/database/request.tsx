import { request } from "node:http"
import { prisma } from "../prisma"

// may need this
//import { RequestStatus } from "@prisma/client"
//status: RequestStatus

export class Request {
    // Local variables
    id: number
    name: string
    status: string


    /// Cosntructor
    constructor(data: {
        id: number
        name: string
        status: string
    }) {
        this.id= data.id
        this.name= data.name
        this.status = data.status
    }

    //fetch from DB 
    static async fetchByID(requestId: number): Promise<Request | null> {
        const request = await prisma.request.findUnique({
            where: {id: requestId},
        })

        if (!request) return null

        return new Request({
            id: request.id,
            name: request.name,
            status: request.status 
        })
    }

    //create request in DB
    /// create request in DB function
     static async create(
        requestId: number,
        requestName: string,
        requestStatus: string,
    ): Promise<Request | null> {
        const request = await prisma.request.create({
            data: {
                requestName,
                requestStatus,
            },
        })
        return new request({
            id: request.requestId,
            name: request.requestName,
            satus: request.requestDescription,
        })

    }

    //constructor(requestId: string) {{
    // Fetch request attrs. from the database
    //}

    //static request create(name: string, price: number, link: string ...){
    // Create the request in the database and return the object
    //}

// Getter methods can use the local values stored in the object

// Setter methods should update the database and the local object attributes

}