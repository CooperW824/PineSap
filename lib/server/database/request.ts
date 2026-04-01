import { prisma } from "../prisma"
import { Item } from "./Item" 

//item definetion got getItems
// not sure if this is what you mean cooper
type ItemData = {
  id: number
    name: string
    price: number
    quantity: number
    description?: string | null
    physicalLocation ?: string | null
}


export class Request {
  id: number
  name: string
  status: string

  /// PRIVATE constructor
  private constructor(data: {
    id: number
    name: string
    status: string
  }) {
    this.id = data.id
    this.name = data.name
    this.status = data.status
  }

  /// Fetch from DB by ID
  static async fromId(requestId: number): Promise<Request | null> {
    const request = await prisma.request.findUnique({
      where: { id: requestId },
    })

    if (!request) return null

    return new Request({
      id: request.id,
      name: request.name,
      status: request.status,
    })
  }

  /// Create EMPTY request
  static async create(): Promise<Request> {
    const request = await prisma.request.create({
      data: {
        name: "",              // placeholder
        status: "PENDING",     // default
      },
    })

    return new Request({
      id: request.id,
      name: request.name,
      status: request.status,
    })
  }

  /// Get all items in this request
  async getItems(): Promise<ItemData[]> {
  const requestItems = await prisma.requestItem.findMany({
    where: { requestId: this.id },
    include: {
      item: true,
    },
  })

  return requestItems.map((ri: typeof requestItems[number]): ItemData => ({
    id: ri.item.id,
    name: ri.item.name,
    price: Number(ri.item.price),
    quantity: ri.quantity,
    description: ri.item.description,
    physicalLocation: ri.item.physicalLocation,
  }))
}

  // should this instead take in an item object and quantity? 
  /// Add item to request
  async addItem(itemId: number, quantity: number, price: number): Promise<void> {
    await prisma.requestItem.create({
      data: {
        requestId: this.id,
        itemId,
        quantity,
        price,
      },
    })
  }

  // GETTERS
  getId(): number {
    return this.id
  }

  getName(): string {
    return this.name
  }

  getStatus(): string {
    return this.status
  }

  // SETTERS
  async setName(newName: string): Promise<void> {
    await prisma.request.update({
      where: { id: this.id },
      data: { name: newName },
    })
    this.name = newName
  }

  async setStatus(newStatus: string): Promise<void> {
    await prisma.request.update({
      where: { id: this.id },
      data: { status: newStatus },
    })
    this.status = newStatus
  }

  // other methods
  async approve(): Promise<void> {
    await this.setStatus("APPROVED")
  }

  async deny(): Promise<void> {
    await this.setStatus("DENIED")
  }
}