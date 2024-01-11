/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/display-name */
/* eslint-disable react/no-children-prop */
import { useEffect, useState } from "react"
import { useToast } from "@chakra-ui/react"
import List from "../../../../components/admin/reports/notUseService/List"
import {
  getList,
  getListDataForDownload,
} from "../../../../data-hooks/reports/notUseService/getList"
import get from "lodash/get"
import { useExport } from "../../../../data-hooks/reports/notUseService/export"

type SortByType = {
  id: string
  desc: boolean | undefined
}

const NotUseServiceList = () => {
  const [filter, setFilter] = useState<{ startDate: string; endDate: string }>({
    startDate: "",
    endDate: "",
  })
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState<SortByType | undefined>(undefined)
  const toast = useToast()
  const toastId1 = "error_notUseService"
  const toastId2 = "error_download"
  const toastId3 = "success_download"
  const toastId4 = "error_notUseService_dataForDownload"
  const notUseService = getList(page, sortBy, filter.startDate, filter.endDate)
  const download = useExport()
  const dataForDownload = getListDataForDownload(
    filter.startDate,
    filter.endDate
  )

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
    if (notUseService.error || notUseService.data?.error) {
      if (
        !toast.isActive(toastId1) &&
        get(notUseService, "error.status") !== 401
      ) {
        toast({
          id: toastId1,
          title: "NotUseService",
          description: notUseService.data?.error?.message
            ? notUseService.data?.error?.message
            : `${get(notUseService, "error.message")}`,
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
    notUseService.error,
    notUseService.data?.error,
    dataForDownload.error,
    dataForDownload.data?.error,
    toast,
  ])

  return (
    <List
      data={notUseService.data?.data}
      setPage={setPage}
      pageCount={notUseService.data?.pageCount}
      isLoading={notUseService.isLoading}
      currentPage={
        notUseService.data?.currentPage ? notUseService.data?.currentPage : page
      }
      sortBy={sortBy}
      setSort={setSortBy}
      setFilter={setFilter}
      filter={filter}
      isLoadingDownload={download.isLoading}
      download={download.mutate}
      dataForDownload={dataForDownload?.data?.data}
      isFetching={notUseService.isFetching}
    />
  )
}

export default NotUseServiceList
