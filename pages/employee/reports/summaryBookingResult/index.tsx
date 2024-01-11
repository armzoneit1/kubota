/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/display-name */
/* eslint-disable react/no-children-prop */
import { useEffect, useState } from "react"
import { useToast } from "@chakra-ui/react"
import List from "../../../../components/employee/reports/summaryBookingResult/List"
import {
  getList,
  getListDataForDownload,
} from "../../../../data-hooks/reports/summaryBookingResult/getList"
import { useExport } from "../../../../data-hooks/reports/summaryBookingResult/export"
import get from "lodash/get"

type SortByType = {
  id: string
  desc: boolean | undefined
}

const SummaryBookingResultList = () => {
  const [filter, setFilter] = useState<{ date: string; round: string }>({
    date: "",
    round: "",
  })
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState<string>("")
  const [sortBy, setSortBy] = useState<SortByType | undefined>(undefined)
  const toast = useToast()
  const toastId1 = "error_bookings"
  const toastId2 = "error_download"
  const toastId3 = "success_download"
  const toastId4 = "error_bookings_dataForDownload"
  const summaryBooking = getList(
    page,
    search,
    sortBy,
    filter.date,
    filter.round
  )
  const dataForDownload = getListDataForDownload(filter.date, filter.round)
  const download = useExport()

  useEffect(() => {
    if (download.isSuccess) {
      if (!toast.isActive(toastId3)) {
        toast({
          id: toastId3,
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
      if (!toast.isActive(toastId2) && get(download, "error.status") !== 401) {
        toast({
          id: toastId2,
          description: `${get(download, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [download.isError, download.error, toast])

  useEffect(() => {
    if (summaryBooking.error || summaryBooking.data?.error) {
      if (
        !toast.isActive(toastId1) &&
        get(summaryBooking, "error.status") !== 401
      ) {
        toast({
          id: toastId1,
          title: "summaryBooking",
          description: summaryBooking.data?.error?.message
            ? summaryBooking.data?.error?.message
            : `${get(summaryBooking, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
    if (dataForDownload.error || dataForDownload.data?.error) {
      if (
        !toast.isActive(toastId4) &&
        get(dataForDownload, "error.status") !== 401
      ) {
        toast({
          id: toastId4,
          title: "dataForDownload",
          description: dataForDownload.data?.error?.message
            ? dataForDownload.data?.error?.message
            : `${get(dataForDownload, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [
    summaryBooking.error,
    summaryBooking.data?.error,
    dataForDownload.error,
    dataForDownload.data?.error,
    toast,
  ])

  return (
    <List
      data={summaryBooking.data?.data}
      setPage={setPage}
      pageCount={summaryBooking.data?.pageCount}
      setSearch={setSearch}
      search={search}
      isLoading={summaryBooking.isLoading}
      currentPage={
        summaryBooking.data?.currentPage
          ? summaryBooking.data?.currentPage
          : page
      }
      sortBy={sortBy}
      setSort={setSortBy}
      setFilter={setFilter}
      filter={filter}
      isLoadingDownload={download.isLoading}
      download={download.mutate}
      dataForDownload={dataForDownload.data?.data}
      isFetching={summaryBooking?.isFetching}
    />
  )
}

export default SummaryBookingResultList
