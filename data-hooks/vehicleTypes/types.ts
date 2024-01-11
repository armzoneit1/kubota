export type VehicleTypes<T = string> = {
  id: number
  plantId?: number
  name: string
  isUseForArrangement: T
  limit: number | null
  createdAt?: string
  updatedAt?: string
  deletedAt?: string
  reatedAt?: string
}
