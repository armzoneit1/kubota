/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/display-name */
/* eslint-disable react/no-children-prop */
import { useEffect, useState } from "react"
import { useToast } from "@chakra-ui/react"
import List from "../../../../components/admin/reports/compareBusStop/List"
import {
  getList,
  getListDataForDownload,
} from "../../../../data-hooks/reports/compareBusStop/getList"
import { getListTime } from "../../../../data-hooks/reports/compareBusStop/getListTime"
import { useExport } from "../../../../data-hooks/reports/compareBusStop/export"
import get from "lodash/get"

type SortByType = {
  id: string
  desc: boolean | undefined
}

const CompareBusStopList = () => {
  const [filter, setFilter] = useState<{
    startDate: string
    endDate: string
    time: string
    display: string
  }>({
    startDate: "",
    endDate: "",
    time: "",
    display: "",
  })
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState<SortByType | undefined>(undefined)
  const toast = useToast()
  const toastId1 = "error_compareBusStop"
  const toastId2 = "error_getListTime"
  const toastId3 = "error_download"
  const toastId4 = "success_download"
  const toastId5 = "error_compareBusStop_dataForDownload"
  const dataForDownload = getListDataForDownload(
    filter.startDate,
    filter.endDate,
    filter.time,
    filter.display
  )
  const compareBusStop = getList(
    page,
    sortBy,
    filter.startDate,
    filter.endDate,
    filter.time,
    filter.display
  )
  const listTime = getListTime()
  const download = useExport()

  useEffect(() => {
    if (download.isSuccess) {
      if (!toast.isActive(toastId4)) {
        toast({
          id: toastId4,
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
      if (!toast.isActive(toastId3) && get(download, "error.status") !== 401) {
        toast({
          id: toastId3,
          description: `${get(download, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [download.isError, download.error, toast])

  useEffect(() => {
    if (compareBusStop.error || compareBusStop.data?.error) {
      if (
        !toast.isActive(toastId1) &&
        get(compareBusStop, "error.status") !== 401
      ) {
        toast({
          id: toastId1,
          title: "compareBusStop",
          description: compareBusStop.data?.error?.message
            ? compareBusStop.data?.error?.message
            : `${get(compareBusStop, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
    if (listTime.error || listTime.data?.error) {
      if (!toast.isActive(toastId2) && get(listTime, "error.status") !== 401) {
        toast({
          id: toastId2,
          title: "ListTime",
          description: listTime.data?.error?.message
            ? listTime.data?.error?.message
            : `${get(listTime, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
    if (dataForDownload.error || dataForDownload.data?.error) {
      if (
        !toast.isActive(toastId5) &&
        get(dataForDownload, "error.status") !== 401
      ) {
        toast({
          id: toastId5,
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
    compareBusStop.error,
    compareBusStop.data?.error,
    listTime.error,
    listTime.data?.error,
    dataForDownload.error,
    dataForDownload.data?.error,
    toast,
  ])

  return (
    <List
      data={compareBusStop.data?.data}
      setPage={setPage}
      pageCount={compareBusStop.data?.pageCount}
      isLoading={compareBusStop.isLoading}
      currentPage={
        compareBusStop.data?.currentPage
          ? compareBusStop.data?.currentPage
          : page
      }
      sortBy={sortBy}
      setSort={setSortBy}
      setFilter={setFilter}
      filter={filter}
      listTime={listTime.data?.data}
      isLoadingDownload={download.isLoading}
      download={download.mutate}
      dataForDownload={dataForDownload?.data?.data}
      isFetching={compareBusStop.isFetching}
    />
  )
}

export default CompareBusStopList
