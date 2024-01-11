export type VehicleTypes = {
  transportationProviderVehicleTypeMappingId?: number
  vehicleTypeId: number | { value: number; label: string }
  vehicleTypeName?: string
  seatCapacity: number
}

export type TransportationProviderDataTypes<T = string> = {
  id: number
  plantId: number
  companyName: string
  companyMobileNo: string
  firstName: string
  lastName: string
  email: string
  mobileNo: string
  address: string
  district: string
  subDistrict: string
  postalCode: string
  status: T
  createdAt: string
  updatedAt: string
  deletedAt: string
  name: string
  province: string | { value: string; label: string }
  vehicleTypes: VehicleTypes[]
}
