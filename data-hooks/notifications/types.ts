export type NotificationDataTypes = {
  id: number
  plantId: number
  notificationDate: string
  notificationType:
    | "maxDriverAge"
    | "maxDriverAge"
    | "driverLicenseExpired"
    | "insuranceExpired"
    | "taxExpired"
    | "actExpired"
  driverId: number
  vehicleId: number
  detail: string
  isComplete: boolean
  sendEmailAt: string
  createdAt: string
  updatedAt: string
  deletedAt: string
  transportationProviderId: number
}
