import List from "../../../components/employee/requests/List"
import { useEffect, useState } from "react"
import { getListRequest } from "../../../data-hooks/requests/getList"
import {
  getListOfBookingStatus,
  getListOfBusLine,
  getListOfBusStop,
  getListOfPassenger,
  getListOfPeriodOfDay,
  getListOfTime,
} from "../../../data-hooks/requests/getListFilter"
import { useToast } from "@chakra-ui/react"
import { DateTime } from "luxon"
import { getList } from "../../../data-hooks/subordinates/getList"
import get from "lodash/get"

type SortByType = {
  id: string
  desc: boolean | undefined
}

const RequestList = () => {
  const [filterOptions, setFilterOptions] = useState<{
    startDate: string
    endDate: string
    periodOfDay: string
  }>({
    startDate: DateTime.fromJSDate(
      new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    ).toFormat("y-MM-dd"),
    endDate: DateTime.fromJSDate(
      new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
    ).toFormat("y-MM-dd"),
    periodOfDay: "",
  })
  const [filter, setFilter] = useState<{
    startDate: string
    endDate: string
    periodOfDay: string
    time: string
    passenger: string
    bookingStatus: string
    busLine: string
    busStop: string
  }>({
    startDate: DateTime.fromJSDate(
      new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    ).toFormat("y-MM-dd"),
    endDate: DateTime.fromJSDate(
      new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
    ).toFormat("y-MM-dd"),
    periodOfDay: "",
    time: "",
    bookingStatus: "",
    passenger: "",
    busLine: "",
    busStop: "",
  })
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState<SortByType | undefined>(undefined)
  const toast = useToast()
  const toastId1 = "error_requests"
  const toastId2 = "error_listOfBookingStatus"
  const toastId3 = "error_listOfBusLine"
  const toastId4 = "error_listOfBusStop"
  const toastId5 = "error_listOfPassenger"
  const toastId6 = "error_listOfTime"
  const toastId7 = "error_listOfPeriodOfDay"
  const toastId8 = "error_subordinates"

  const requests = getListRequest(
    page,
    sortBy,
    filter.startDate,
    filter.endDate,
    filter.periodOfDay,
    filter.time,
    filter.passenger,
    filter.bookingStatus,
    filter.busLine,
    filter.busStop
  )
  const listOfBookingStatus = getListOfBookingStatus()
  const listOfBusLine = getListOfBusLine(
    filterOptions.startDate,
    filterOptions.endDate
  )
  const listOfBusStop = getListOfBusStop(
    filterOptions.startDate,
    filterOptions.endDate
  )
  const listOfPassenger = getListOfPassenger(
    filterOptions.startDate,
    filterOptions.endDate
  )
  const listOfTime = getListOfTime(
    filterOptions.startDate,
    filterOptions.endDate,
    filterOptions.periodOfDay
  )
  const listOfPeriodOfDay = getListOfPeriodOfDay()
  const subordinates = getList(undefined)

  useEffect(() => {
    if (requests.error || requests.data?.error) {
      if (!toast.isActive(toastId1) && get(requests, "error.status") !== 401) {
        toast({
          id: toastId1,
          title: "Requests",
          description: requests.data?.error?.message
            ? requests.data?.error?.message
            : `${get(requests, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
    if (listOfBookingStatus.error || listOfBookingStatus.data?.error) {
      if (
        !toast.isActive(toastId2) &&
        get(listOfBookingStatus, "error.status") !== 401
      ) {
        toast({
          id: toastId2,
          title: "listOfBookingStatus",
          description: listOfBookingStatus.data?.error?.message
            ? listOfBookingStatus.data?.error?.message
            : `${get(listOfBookingStatus, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
    if (listOfBusLine.error || listOfBusLine.data?.error) {
      if (
        !toast.isActive(toastId3) &&
        get(listOfBusLine, "error.status") !== 401
      ) {
        toast({
          id: toastId3,
          title: "ListOfBusLine",
          description: listOfBusLine.data?.error?.message
            ? listOfBusLine.data?.error?.message
            : `${get(listOfBusLine, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
    if (listOfBusStop.error || listOfBusStop.data?.error) {
      if (
        !toast.isActive(toastId4) &&
        get(listOfBusStop, "error.status") !== 401
      ) {
        toast({
          id: toastId4,
          title: "ListOfBusStop",
          description: listOfBusStop.data?.error?.message
            ? listOfBusStop.data?.error?.message
            : `${get(listOfBusStop, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
    if (listOfPassenger.error || listOfPassenger.data?.error) {
      if (
        !toast.isActive(toastId5) &&
        get(listOfPassenger, "error.status") !== 401
      ) {
        toast({
          id: toastId5,
          title: "ListOfPassenger",
          description: listOfPassenger.data?.error?.message
            ? listOfPassenger.data?.error?.message
            : `${get(listOfPassenger, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
    if (listOfTime.error || listOfTime.data?.error) {
      if (
        !toast.isActive(toastId6) &&
        get(listOfTime, "error.status") !== 401
      ) {
        toast({
          id: toastId6,
          title: "ListOfTime",
          description: listOfTime.data?.error?.message
            ? listOfTime.data?.error?.message
            : `${get(listOfTime, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
    if (listOfPeriodOfDay.error || listOfPeriodOfDay.data?.error) {
      if (
        !toast.isActive(toastId7) &&
        get(listOfPeriodOfDay, "error.status") !== 401
      ) {
        toast({
          id: toastId7,
          title: "ListOfPeriodOfDay",
          description: listOfPeriodOfDay.data?.error?.message
            ? listOfPeriodOfDay.data?.error?.message
            : `${get(listOfPeriodOfDay, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
    if (subordinates.error || subordinates.data?.error) {
      if (
        !toast.isActive(toastId8) &&
        get(subordinates, "error.status") !== 401
      ) {
        toast({
          id: toastId8,
          title: "Subordinates",
          description: subordinates.data?.error?.message
            ? subordinates.data?.error?.message
            : `${get(subordinates, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [
    requests.error,
    requests.data?.error,
    listOfBookingStatus.error,
    listOfBookingStatus.data?.error,
    listOfBusLine.error,
    listOfBusLine.data?.error,
    listOfBusStop.error,
    listOfBusStop.data?.error,
    listOfPassenger.error,
    listOfPassenger.data?.error,
    listOfTime.error,
    listOfTime.data?.error,
    listOfPeriodOfDay.error,
    listOfPeriodOfDay.data?.error,
    subordinates.error,
    subordinates.data?.error,
    toast,
  ])

  return (
    <List
      data={requests?.data?.data}
      isLoading={requests?.isLoading}
      listOfBookingStatus={listOfBookingStatus?.data?.data}
      listOfPeriodOfDay={listOfPeriodOfDay?.data?.data}
      listOfBusLine={listOfBusLine?.data?.data}
      listOfBusStop={listOfBusStop?.data?.data}
      listOfPassenger={listOfPassenger?.data?.data}
      listOfTime={listOfTime?.data?.data}
      setFilter={setFilter}
      filter={filter}
      sortBy={sortBy}
      setSort={setSortBy}
      setPage={setPage}
      pageCount={requests.data?.pageCount}
      currentPage={requests.data?.page ? requests.data?.page : page}
      setFilterOptions={setFilterOptions}
      filterOptions={filterOptions}
      isFetching={requests?.isFetching}
      subordinates={subordinates?.data?.data}
    />
  )
}

export default RequestList
