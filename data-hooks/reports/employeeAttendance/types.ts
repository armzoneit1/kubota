export type PassengerDataTypes = {
  employeeGroupName: string
  employeeNo: string
  title: string
  firstName: string
  lastName: string
  positionName: string
  jobName: string
  busStopName: string
  busStopRank: number
}

export type VehicleDataTypes = {
  bookingVehicleId: number
  vehicleType: string
  seatCapacity: number
  totalPassenger: number
  licensePlate: string
  passengers: PassengerDataTypes[]
}

export type BusLineDataTypes = {
  busLineName: string
  vehicles: VehicleDataTypes[]
}

export type AttendanceDetailDataTypes = {
  time: string
  busLines: BusLineDataTypes[]
}

export type EmployeeAttendanceDataTypes = {
  date: string
  plantId: number
  attendanceDetails: AttendanceDetailDataTypes[]
}
