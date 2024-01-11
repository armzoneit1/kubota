export type BookedByTypes = {
  employeeNo: string
  prefixName: string
  firstName: string
  lastName: string
}

export type BookingDataTypes = {
  id: number
  plantId: number
  scheduleId: number
  date: string
  employeeNo: string
  prefixName: string
  firstName: string
  lastName: string
  bookedBy: BookedByTypes
  timeTableRoundId: number
  time: BookedByTypes
  busStopLineMappingId: number
  busStopId: number
  busStopName: string
  busLineId: string
  busLineName: string
  status: string
  sentEmailAt: string
  cancelledAt: string
  createdAt: string
  updatedAt: string
  deletedAt: string
}

export const STATUS = {
  completed: "สำเร็จ",
  pending: "รอการจัดรถ",
  processing: "กำลังจัดรถ",
  cancelledByAdmin: "ถูกยกเลิก",
  cancelledByEmployee: "ยกเลิกโดยพนักงาน",
  deprecated: "เลิกใช้งาน",
  resigned: "ลาออก",
}
