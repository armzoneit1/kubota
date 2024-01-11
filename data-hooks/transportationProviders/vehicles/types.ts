export type VehicleMaintenanceLogsTypes = {
  vehicleMaintenanceLogId: number | null
  date: string
  mile: number
  detail: string
  createdAt?: string
  updatedAt?: string
  deletedAt?: string
}

export type TransportationVehicleTypes = {
  id: number
  plantId: number
  transportationProviderId: number
  vehicleTypeId: number
  vehicleTypeName: string
  seatCapacity: number
  createdAt: string
  updatedAt: string
  deletedAt: string
}

export type VehicleDataTypes = {
  id?: number
  plantId?: number
  transportationProviderId?: number
  transportationProviderVehicleTypeMappingId: number
  licencePlate: string
  vehicleTypeId: number
  vehicleTypeName: string
  vehicleAgeMonth: number
  seatCapacity: string | number
  driverId?: number | null
  driverFirstName?: string | null
  driverLastName?: string | null
  driverName?: string | null
  status: boolean
  createdAt?: string
  updatedAt?: string
  deletedAt?: string
  purchaseDate: string | null
  vehicleAgeYear: number
  registrationDate: string | null
  insuranceExpirationDate: string | null
  taxExpirationDate: string | null
  actExpirationDate: string | null
  vehicleMaintenanceLogs: VehicleMaintenanceLogsTypes[]
  vehicleType: {
    value: string | number
    label: string
    seatCapacity: string | number
  }
}
