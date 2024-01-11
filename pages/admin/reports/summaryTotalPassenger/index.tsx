/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/display-name */
/* eslint-disable react/no-children-prop */
import { useEffect, useState } from "react"
import { useToast } from "@chakra-ui/react"
import List from "../../../../components/admin/reports/summaryTotalPassenger/List"
import { getList } from "../../../../data-hooks/reports/summaryTotalPassenger/getList"
import {
  getListBusLine,
  getListTime,
  getListTypeOfTotalPassenger,
} from "../../../../data-hooks/reports/summaryTotalPassenger/getFilterOptions"
import { useExport } from "../../../../data-hooks/reports/summaryTotalPassenger/export"
import get from "lodash/get"

const SummaryTotalPassengerList = () => {
  const [query, setQuery] = useState(false)
  const [filter, setFilter] = useState<{
    startDate: string
    endDate: string
    typeOfTotalPassenger: string
    time: string
    busLineName: string
  }>({
    startDate: "",
    endDate: "",
    typeOfTotalPassenger: "",
    time: "",
    busLineName: "",
  })
  const toast = useToast()
  const toastId1 = "error_bookings"
  const toastId2 = "error_listOfTime"
  const toastId3 = "error_listOfBusLine"
  const toastId4 = "error_listTypeOfTotalPassenger"
  const toastId5 = "error_download"
  const toastId6 = "success_download"
  const summaryTotalPassenger = getList(
    filter.startDate,
    filter.endDate,
    filter.typeOfTotalPassenger,
    filter.time,
    filter.busLineName,
    query,
    setQuery
  )
  const listOfTime = getListTime(filter.startDate, filter.endDate)
  const listOfBusLine = getListBusLine(filter.startDate, filter.endDate)
  const listTypeOfTotalPassenger = getListTypeOfTotalPassenger()
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
          description: `${get(download, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [download.isError, download.error, toast])

  useEffect(() => {
    if (summaryTotalPassenger.error || summaryTotalPassenger.data?.error) {
      if (
        !toast.isActive(toastId1) &&
        get(summaryTotalPassenger, "error.status") !== 401
      ) {
        toast({
          id: toastId1,
          title: "summaryTotalPassenger",
          description: summaryTotalPassenger.data?.error?.message
            ? summaryTotalPassenger.data?.error?.message
            : `${get(summaryTotalPassenger, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [summaryTotalPassenger.error, summaryTotalPassenger.data?.error, toast])

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
    if (
      listTypeOfTotalPassenger.error ||
      listTypeOfTotalPassenger.data?.error
    ) {
      if (
        !toast.isActive(toastId4) &&
        get(listTypeOfTotalPassenger, "error.status") !== 401
      ) {
        toast({
          id: toastId4,
          title: "listTypeOfTotalPassenger",
          description: listTypeOfTotalPassenger.data?.error?.message
            ? listTypeOfTotalPassenger.data?.error?.message
            : `${get(listTypeOfTotalPassenger, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [
    listTypeOfTotalPassenger.error,
    listTypeOfTotalPassenger.data?.error,
    toast,
  ])

  return (
    <List
      data={summaryTotalPassenger.data?.data}
      dates={summaryTotalPassenger.data?.dates}
      busLines={summaryTotalPassenger.data?.busLines}
      listOfTime={listOfTime.data?.data}
      listOfBusLine={listOfBusLine.data?.data}
      listTypeOfTotalPassenger={listTypeOfTotalPassenger.data?.data}
      isLoading={summaryTotalPassenger.isLoading}
      isFetching={summaryTotalPassenger.isFetching}
      setFilter={setFilter}
      filter={filter}
      isLoadingDownload={download.isLoading}
      download={download.mutate}
      dataForDownload={summaryTotalPassenger.data?.dataForDownload}
      setQuery={setQuery}
    />
  )
}

export default SummaryTotalPassengerList
