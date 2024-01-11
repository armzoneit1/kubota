/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/display-name */
/* eslint-disable react/no-children-prop */
import { useEffect, useState } from "react"
import { useToast } from "@chakra-ui/react"
import List from "../../../../components/admin/reports/employeeAttendance/List"
import { getList } from "../../../../data-hooks/reports/employeeAttendance/getList"
import {
  getListTime,
  getListBusLine,
  getListBookingVehicle,
} from "../../../../data-hooks/reports/employeeAttendance/getFilterOptions"
import { useExport } from "../../../../data-hooks/reports/employeeAttendance/export"
import get from "lodash/get"

const EmployeeAttendanceList = () => {
  const [request, setRequest] = useState<boolean>(false)
  const [filter, setFilter] = useState<{
    date: string
    time: string
    busLineName: string
    bookingVehicleId: string
  }>({
    date: "",
    time: "",
    busLineName: "",
    bookingVehicleId: "",
  })
  const toast = useToast()
  const toastId1 = "error_employeeAttendance"
  const toastId2 = "error_listOfTime"
  const toastId3 = "error_listOfBusLine"
  const toastId4 = "error_listOfBookingVehicle"
  const toastId5 = "error_download"
  const toastId6 = "success_download"
  const employeeAttendance = getList(
    filter.date,
    filter.time,
    filter.busLineName,
    filter.bookingVehicleId,
    request,
    setRequest
  )
  const listOfTime = getListTime(filter.date)
  const listOfBusLine = getListBusLine(filter.date)
  const listOfBookingVehicle = getListBookingVehicle(
    filter.date,
    filter.time,
    filter.busLineName
  )
  const download = useExport()

  useEffect(() => {
    if (download.isSuccess) {
      if (!toast.isActive(toastId6)) {
        toast({
          id: toastId6,
          description: `ดาวน์โหลดสำเร็จ`,
          status: "success",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [download.isSuccess, toast])

  useEffect(() => {
    if (download.isError) {
      if (!toast.isActive(toastId5) && get(download, "error.status") !== 401) {
        toast({
          id: toastId5,
          description: `${get(download, "error.messsage")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [download.isError, download.error, toast])

  useEffect(() => {
    if (employeeAttendance.error || employeeAttendance.data?.error) {
      if (
        !toast.isActive(toastId1) &&
        get(employeeAttendance, "error.status") !== 401
      ) {
        toast({
          id: toastId1,
          title: "employeeAttendance",
          description: employeeAttendance.data?.error?.message
            ? employeeAttendance.data?.error?.message
            : `${get(employeeAttendance, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [employeeAttendance.error, employeeAttendance.data?.error, toast])

  useEffect(() => {
    if (listOfTime.error || listOfTime.data?.error) {
      if (
        !toast.isActive(toastId2) &&
        get(listOfTime, "error.status") !== 401
      ) {
        toast({
          id: toastId2,
          title: "listOfTime",
          description: listOfTime.data?.error?.message
            ? listOfTime.data?.error?.message
            : `${get(listOfTime, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [listOfTime.error, listOfTime.data?.error, toast])

  useEffect(() => {
    if (listOfBusLine.error || listOfBusLine.data?.error) {
      if (
        !toast.isActive(toastId3) &&
        get(listOfBusLine, "error.status") !== 401
      ) {
        toast({
          id: toastId3,
          title: "listOfBusLine",
          description: listOfBusLine.data?.error?.message
            ? listOfBusLine.data?.error?.message
            : `${get(listOfBusLine, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [listOfBusLine.error, listOfBusLine.data?.error, toast])
  useEffect(() => {
    if (listOfBookingVehicle.error || listOfBookingVehicle.data?.error) {
      if (
        !toast.isActive(toastId4) &&
        get(listOfBookingVehicle, "error.status") !== 401
      ) {
        toast({
          id: toastId4,
          title: "listOfBookingVehicle",
          description: listOfBookingVehicle.data?.error?.message
            ? listOfBookingVehicle.data?.error?.message
            : `${get(listOfBookingVehicle, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [listOfBookingVehicle.error, listOfBookingVehicle.data?.error, toast])

  return (
    <List
      data={employeeAttendance.data?.data}
      listOfTime={listOfTime.data?.data}
      listOfBusLine={listOfBusLine.data?.data}
      listOfBookingVehicle={listOfBookingVehicle.data?.data}
      isLoading={employeeAttendance.isLoading || employeeAttendance.isFetching}
      setFilter={setFilter}
      filter={filter}
      setRequest={setRequest}
      isLoadingDownload={download.isLoading}
      download={download.mutate}
      dataForDownload={employeeAttendance.data?.dataForDownload}
      isFetching={employeeAttendance?.isFetching}
    />
  )
}

export default EmployeeAttendanceList
