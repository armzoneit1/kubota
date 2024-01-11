export type BusLineDataTypes = {
  busLineName: string
  busLineRank: number
  totalPassenger: number
}

export type BookingVehicleDataTypes = {
  vehicleTypeName: string
  transportationProviderName: string
  busLines: BusLineDataTypes[]
}

export type TimeDataTypes = {
  time: string
  bookingVehicles: BookingVehicleDataTypes[]
}

export type DateDataTypes = {
  date: string
  times: TimeDataTypes[]
}

export type SummaryTotalPassengerDataTypes = {
  plantId: number
  startDate: string
  endDAte: string
  typeOfTotalPassenger: string
  total: number
  dates: DateDataTypes[]
}
