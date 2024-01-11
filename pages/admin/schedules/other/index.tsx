/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/display-name */
/* eslint-disable react/no-children-prop */
import { useEffect, useState } from "react"
import { useToast } from "@chakra-ui/react"
import List from "../../../../components/admin/schedules/List"
import TabLayout from "../../../../components/admin/schedules/TabLayout"
import { getList } from "../../../../data-hooks/schedules/getList"
import { getListYears } from "../../../../data-hooks/schedules/getListYear"
import { useDelete } from "../../../../data-hooks/schedules/daily/delete"
import { useCopy } from "../../../../data-hooks/schedules/copyFromPreviousYear"
import get from "lodash/get"

type SortByType = {
  id: string
  desc: boolean | undefined
}

const OtherList = () => {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState<string>("")
  const currentYear = new Date().getFullYear()
  const [year, setYear] = useState<string>(`${currentYear}`)
  const [sortBy, setSortBy] = useState<SortByType | undefined>(undefined)
  const toast = useToast()
  const onDelete = useDelete()
  const copy = useCopy()
  const toastId1 = "error_schedules"
  const toastId2 = "error_listYears"
  const toastId3 = "delete_success"
  const toastId4 = "delete_error"
  const toastId5 = "copy_error"
  const toastId6 = "copy_error"
  const schedules = getList("other", page, search, sortBy, year, "")
  const listYears = getListYears()

  useEffect(() => {
    if (onDelete.isSuccess) {
      if (!toast.isActive(toastId3)) {
        toast({
          id: toastId3,
          description: `ลบสำเร็จ`,
          status: "success",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [onDelete.isSuccess, toast])

  useEffect(() => {
    if (onDelete.isError) {
      if (!toast.isActive(toastId4) && get(onDelete, "error.status") !== 401) {
        toast({
          id: toastId4,
          title: "Delete",
          description: `${get(onDelete, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [onDelete.isError, onDelete.error, toast])

  useEffect(() => {
    if (copy.isSuccess) {
      if (!toast.isActive(toastId5)) {
        toast({
          id: toastId5,
          description: `คัดลอกสำเร็จ`,
          status: "success",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [copy.isSuccess, toast])

  useEffect(() => {
    if (copy.isError) {
      if (!toast.isActive(toastId6) && get(copy, "error.status") !== 401) {
        toast({
          id: toastId6,
          title: "Copy",
          description: `${get(copy, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [copy.isError, copy.error, toast])

  useEffect(() => {
    if (schedules.error || schedules.data?.error) {
      if (!toast.isActive(toastId1) && get(schedules, "error.status") !== 401) {
        toast({
          id: toastId1,
          title: "Schedules",
          description: schedules.data?.error?.message
            ? schedules.data?.error?.message
            : `${get(schedules, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [schedules.error, schedules.data?.error, toast])

  useEffect(() => {
    if (listYears.error || listYears.data?.error) {
      if (!toast.isActive(toastId2) && get(listYears, "error.status") !== 401) {
        toast({
          id: toastId2,
          title: "List Years",
          description: listYears.data?.error?.message
            ? listYears.data?.error?.message
            : `${get(listYears, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [listYears.error, listYears.data?.error, toast])

  return (
    <TabLayout index={3} setSearch={setSearch} search={search}>
      <List
        data={schedules.data?.data}
        setPage={setPage}
        pageCount={schedules.data?.pageCount}
        setSearch={setSearch}
        search={search}
        isLoading={
          schedules.isLoading || onDelete.isLoading || schedules.isFetching
        }
        currentPage={schedules.data?.page}
        day="other"
        setYear={setYear}
        sortBy={sortBy}
        setSort={setSortBy}
        listYears={listYears.data?.data}
        hasCheckbox={schedules.data?.hasCheckbox}
        onDelete={onDelete.mutate}
        copy={copy.mutate}
      />
    </TabLayout>
  )
}

export default OtherList
