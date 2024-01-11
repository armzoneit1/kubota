/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/display-name */
/* eslint-disable react/no-children-prop */
import { useEffect, useState } from "react"
import { useToast } from "@chakra-ui/react"
import List from "../../../components/admin/schedules/List"
import TabLayout from "../../../components/admin/schedules/TabLayout"
import { getList } from "../../../data-hooks/schedules/getList"
import { getListYears } from "../../../data-hooks/schedules/getListYear"
import get from "lodash/get"

type SortByType = {
  id: string
  desc: boolean | undefined
}

const AllList = () => {
  const currentMonth = new Date().getMonth() + 1
  const currentYear = new Date().getFullYear()
  const [year, setYear] = useState<string>(`${currentYear}`)
  const [month, setMonth] = useState<string>(`${currentMonth}`)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState<string>("")
  const [sortBy, setSortBy] = useState<SortByType | undefined>(undefined)
  const toast = useToast()
  const toastId1 = "error_schedules"
  const toastId2 = "error_listYears"
  const schedules = getList("all", page, search, sortBy, year, month)
  const listYears = getListYears()

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
    <TabLayout index={0} setSearch={setSearch} search={search}>
      <List
        data={schedules.data?.data}
        setPage={setPage}
        pageCount={schedules.data?.pageCount}
        setSearch={setSearch}
        search={search}
        isLoading={schedules.isLoading}
        currentPage={schedules.data?.page}
        day="all"
        setYear={setYear}
        setMonth={setMonth}
        sortBy={sortBy}
        setSort={setSortBy}
        listYears={listYears.data?.data}
        hasCheckbox={schedules.data?.hasCheckbox}
      />
    </TabLayout>
  )
}

export default AllList
