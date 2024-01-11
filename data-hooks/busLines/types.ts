export type Option = {
  value: string | number
  label: string
}

export type BusStopTypes = {
  busStopLineMappingId: number | null
  busStopId: number
  name?: string
  busStopName?: string
  rank: number
  createdAt?: string
  updatedAt?: string
  deletedAt?: string
  busStop?: Option
}

export type BusLineDataTypes<T = string> = {
  id: number
  plantId: number
  periodOfDay: "morning" | "evening"
  status: T
  name: string
  rank: number
  totalBusStop: number
  busStops: BusStopTypes[]
  createdAt: string
  updatedAt: string
  deletedAt: string
}
