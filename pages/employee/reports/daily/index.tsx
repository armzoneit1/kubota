import { useEffect, useState } from "react"
import { useToast } from "@chakra-ui/react"
import get from "lodash/get"
import { getList } from "../../../../data-hooks/reports/daily/getList"
import { useExport } from "../../../../data-hooks/reports/daily/export"
import List from "../../../../components/employee/reports/daily/List"
import { getListTime } from "../../../../data-hooks/reports/summaryTotalPassenger/getFilterOptions"

const DailyList = () => {
  const [request, setRequest] = useState<boolean>(false)
  const [filter, setFilter] = useState<{ date: string; time: string }>({
    date: "",
    time: "",
  })
  const toast = useToast()
  const toastId1 = "error_daily"
  const toastId2 = "error_listOfTime"
  const toastId3 = "error_listOfBusLine"
  const toastId4 = "error_download"
  const toastId5 = "success_download"
  const daily = getList(filter.date, filter.time, request, setRequest)
  const listOfTime = getListTime(filter.date, filter.date)
  const download = useExport()

  useEffect(() => {
    if (listOfTime.error || listOfTime.data?.error) {
      if (
        !toast.isActive(toastId3) &&
        get(listOfTime, "error.status") !== 401
      ) {
        toast({
          id: toastId3,
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
    if (download.isSuccess) {
      if (!toast.isActive(toastId5)) {
        toast({
          id: toastId5,
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
      if (!toast.isActive(toastId4) && get(download, "error.status") !== 401) {
        toast({
          id: toastId4,
          description: `${get(download, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [download.isError, download.error, toast])

  useEffect(() => {
    if (daily.error || daily.data?.error) {
      if (!toast.isActive(toastId1) && get(daily, "error.status") !== 401) {
        toast({
          id: toastId1,
          title: "daily",
          description: daily.data?.error?.message
            ? daily.data?.error?.message
            : `${get(daily, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [daily.error, daily.data?.error, toast])

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

  return (
    <List
      data={daily.data?.data}
      isFetching={daily.isFetching}
      isLoading={daily.isLoading}
      setFilter={setFilter}
      filter={filter}
      dataForDownload={daily?.data?.dataForDownload}
      timeTableRounds={daily?.data?.timeTableRounds}
      listOfTime={listOfTime.data?.data}
      isLoadingDownload={download.isLoading}
      download={download.mutate}
      setRequest={setRequest}
    />
  )
}

export default DailyList
