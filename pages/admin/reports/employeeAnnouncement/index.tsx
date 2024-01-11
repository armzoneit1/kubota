/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/display-name */
/* eslint-disable react/no-children-prop */
import { useEffect, useState } from "react"
import { useToast } from "@chakra-ui/react"
import List from "../../../../components/admin/reports/employeeAnnouncement/List"
import { getList } from "../../../../data-hooks/reports/employeeAnnouncement/getList"
import { useExport } from "../../../../data-hooks/reports/employeeAnnouncement/export"
import get from "lodash/get"

type SortByType = {
  id: string
  desc: boolean | undefined
}

const EmployeeAnnouncementList = () => {
  const [filter, setFilter] = useState<{ date: string; round: string }>({
    date: "",
    round: "",
  })
  const [sortBy, setSortBy] = useState<SortByType | undefined>(undefined)
  const toast = useToast()
  const toastId1 = "error_employeeAnnouncement"
  const toastId2 = "error_download"
  const toastId3 = "success_download"
  const employeeAnnouncement = getList(sortBy, filter.date, filter.round)
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
    if (employeeAnnouncement.error || employeeAnnouncement.data?.error) {
      if (
        !toast.isActive(toastId1) &&
        get(employeeAnnouncement, "error.status") !== 401
      ) {
        toast({
          id: toastId1,
          title: "employeeAnnouncement",
          description: employeeAnnouncement.data?.error?.message
            ? employeeAnnouncement.data?.error?.message
            : `${get(employeeAnnouncement, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [employeeAnnouncement.error, employeeAnnouncement.data?.error, toast])

  return (
    <List
      data={employeeAnnouncement.data?.data}
      isLoading={employeeAnnouncement.isLoading}
      isFetching={employeeAnnouncement.isFetching}
      sortBy={sortBy}
      setSort={setSortBy}
      setFilter={setFilter}
      filter={filter}
      timeTableRounds={employeeAnnouncement?.data?.timeTableRounds}
      isLoadingDownload={download.isLoading}
      download={download.mutate}
      dataForDownload={employeeAnnouncement.data?.dataForDownload}
      busLineSummary={employeeAnnouncement.data?.busLineSummary}
    />
  )
}

export default EmployeeAnnouncementList
