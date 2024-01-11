export type UserDataTypes = {
  employeeNo: string
  plantId: number
  role: string
  status: boolean
  title: string
  firstName: string
  lastName: string
  name?: string
  email: string
  createdAt: string
  updatedAt: string
  deletedAt: string
}

export type EmpListTypes = {
  id: number
  empRunId: number
  employeeNo: string
  plantId: number
  title: string
  firstName: string
  lastName: string
  email: string
  mobileNo: string
  phoneNo: string
  workAreaId: string
  workAreaName: string
  positionName: string
  jobName: string
  employeeGroupName: string
  status: string
  createdAt: string
  updatedAt: null
  deletedAt: null
}
