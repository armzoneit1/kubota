export type VehicleDataTypes = {
  vehicleId: number
  licensePlate: string
}

export type BusLineDataTypes = {
  busLineName: string
  busLineRank: number
  totalVehicles: number
  vehicles: VehicleDataTypes[]
}

export type BookingVehicleTypeDataTypes = {
  vehicleTypeName: string
  transportationProviderName: string
  seatCapacity: number
  transportationProviderVehicleTypeMappingId: number
  busLines: BusLineDataTypes[]
}

export type TimeDataTypes = {
  time: string
  bookingVehicleTypes: BookingVehicleTypeDataTypes[]
}

export type DateDataTypes = {
  date: string
  times: TimeDataTypes[]
}

export type SummaryTotalVehicleDataTypes = {
  plantId: number
  startDate: string
  endDate: string
  total: number
  dates: DateDataTypes[]
}
