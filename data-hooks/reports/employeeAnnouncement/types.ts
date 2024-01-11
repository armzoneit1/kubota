export type VehicleDataTypes = {
  vehicleTypeName: string
  runningNumber: number
  totalPassenger: number
  vehicleLabel: string
  licensePlate: string
}

export type TimeTableRoundDataTypes = {
  time: string
  vehicles: VehicleDataTypes[]
}

export type BusLineSummaryDataTypes = {
  busLineName: string
  busLineRank: number
  timeTableRounds: TimeTableRoundDataTypes[]
}

export type EmployeeAnnouncementDataTypes = {
  date: string
  plantId: number
  periodOfDay: string
  busLineSummary: BusLineSummaryDataTypes[]
}
