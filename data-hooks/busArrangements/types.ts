export type BusArrangementDataTypes = {
  scheduleId: number
  date: string
  periodOfDay: "morning" | "evening"
  status: "open" | "close"
  arrangements: ArrangementDataTypes | null
  busStops: BusStopDataTypes[]
}

export type BusStopDataTypes = {
  busStopId: number
  busStopName: string
  isNormalBusStopBySetting: boolean
  passengers: {
    timeTableRoundId: number
    time: string
    busLineId: number
    busLineName: string
    bookingId: number
    bookingStatus: string
    busStopLineMapping: BusStopLineMappingDataTypes
    employeeNo: string
    title: string
    firstName: string
    lastName: string
  }[]
}

export type BusLineDataTypes = {
  id: number
  name: string
  arrangedVehicles: ArrangedVehicleDataTypes[]
  defaultSettingBusStopIds: number[]
}

export type TimeTableRoundDataTypes = {
  timeTableRoundId: number
  time: string
  busLines: BusLineDataTypes[]
}

export type TimeTableRoundMoreInformationDataTypes = {
  timeTableRoundId: number
  time: string
  date: string
  busLines: BusLineDataTypes[]
}

export type ArrangedVehicleDataTypes = {
  bookingVehicleId: number
  transportationProviderVehicleTypeMappingId: number
  vehicleTypeName: string
  seatCapacity: number
  driverId: number
  vehicleId: number
  passengerHeadCount: string
  passengers: PassengerDataTypes[]
  transportationProviderId: number
  transportationProviderName: string
  totalBookingPassenger: number
  firstName: string
  lastName: string
  licensePlate: string
  keyBusLine?: string
  isNormalBusStopBySetting?: boolean
}

export type BusStopLineMappingDataTypes = {
  busStopLineMappingId: number
  busStopId: number
  busStopName: string
  busLineId: number
  busLineName: string
}

export type PassengerDataTypes = {
  bookingId: number
  bookingStatus: string
  busStopLineMapping: BusStopLineMappingDataTypes
  employeeNo: string
  title: string
  firstName: string
  lastName: string
  sentEmailAt: string
  scheduledEmailAt: string
  emailStatus: string
}

export type ArrangementDataTypes = {
  timeTableRounds: TimeTableRoundDataTypes[]
}

export type ListVehicleTypes = {
  id: number
  plantId: number
  transportationProviderId: number
  transportationProviderName: string
  vehicleTypeId: number
  vehicleTypeName: string
  isUseForArrangement: boolean
  limit: number
  seatCapacity: number
  createdAt: string
  updatedAt: string
  deletedAt: string
}

export type ListVehicle = {
  id: number
  plantId: number
  transportationProviderId: number
  licencePlate: string
  transportationProviderVehicleTypeMappingId: number
  vehicleTypeName: string
  seatCapacity: number
  purchaseDate: string
  vehicleAgeYear: number
  vehicleAgeMonth: number
  registrationDate: string
  insuranceExpirationDate: string
  taxExpirationDate: string
  actExpirationDate: string
  driverId: number
  driverFirstName: string
  driverLastName: string
  status: boolean
  createdAt: string
  updatedAt: string
  deletedAt: string
}

export type DriverList = {
  id: number
  plantId: number
  transportationProviderId: number
  firstName: string
  lastName: string
  nickName: string
  dateOfBirth: string
  ageYear: number
  ageMonth: number
  mobileNo: string
  profileImageUrl: string
  driverLicenseImageUrl: string
  licenseExpirationDate: string
  licencePlate: string
  status: boolean
  createdAt: string
  updatedAt: string
  deletedAt: string
}

export type ListBookingPassenger = {
  id: number
  requestId: number
  plantId: number
  scheduleId: number
  date: string
  employeeNo: string
  prefixName: string
  firstName: string
  lastName: string
  bookedByEmployeeNo: string
  periodOfDay: "morning" | "evening"
  timeTableId: number
  timeTableRoundId: number
  time: string
  busStopLineMappingId: number
  busStopId: number
  busStopName: string
  busLineId: number
  busLineName: string
  status: string
  sentEmailAt: string
  cancelledAt: string
  createdAt: string
  updatedAt: string
  deletedAt: null
}

export type ListDifferenceBusLine = {
  bookingVehicleId: number
  plantId: number
  busLineId: number
  busLineName: string
  transportationProviderVehicleTypeMappingId: number
  vehicleTypeName: string
  seatCapacity: number
  totalBookingPassenger: number
  vehicleId: number
  licensePlate: string
  passengerHeadCount: number
  driverId: number
  assignedTimeTableRound: string
}

export type ListSameBusLine = {
  bookingVehicleId: number
  plantId: number
  busLineId: number
  busLineName: string
  transportationProviderVehicleTypeMappingId: number
  vehicleTypeName: string
  seatCapacity: number
  totalBookingPassenger: number
  vehicleId: number
  licensePlate: string
  passengerHeadCount: number
  driverId: number
  assignedTimeTableRound: string
}

export type ListBusStopLineMapping = {
  busStopLineMappingId: number
  busStopId: number
  name: string
  rank: number
  createdAt: string
  updatedAt: string
  deletedAt: string
}
