export type BusStopTypes<T> = {
  busStopId: number | null
  busStopName: string
  status: T
  rank: number
}

export type AreaDataTypes<T = string> = {
  id: number
  plantId: number
  rank: number
  name: string
  totalBusStop: number
  status: T
  createdAt: string
  updatedAt: string
  deletedAt: string
  busStops: BusStopTypes<T>[]
}
