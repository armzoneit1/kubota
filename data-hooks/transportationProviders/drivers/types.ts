type VehicleTypes = {
  vehicleId: number
  transportationProviderVehicleTypeMappingId: number
  vehicleTypeName: string
  seatCapacity: number
  licencePlate: string
}

export type DriverDocumentTypes = {
  documentId: number
  documentUrl: string
  documentName: string
  createdAt: string
  updatedAt: string
  deletedAt: string
}

export type DriverDataTypes = {
  id: number
  plantId: number
  transportationProviderId: number
  firstName: string
  lastName: string
  nickName: string
  name: string
  dateOfBirth: string | null
  licencePlate: string
  ageYear: number | string
  ageMonth: number | string
  mobileNo: string
  profileImageUrl: string
  driverLicenseImageUrl: string
  licenseExpirationDate: string | null
  status: boolean
  createdAt: string
  updatedAt: string
  deletedAt: string
  vehicle: VehicleTypes[]
  driverDocuments: DriverDocumentTypes[]
  vehicleId: number | null
  typeAndSeatCapacity: string | null
}
