/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/display-name */
/* eslint-disable react/no-children-prop */
import { useEffect, useState } from "react"
import { Flex, Center, Spinner, useToast } from "@chakra-ui/react"
import List from "../../../components/admin/plannings/List"
import { getList } from "../../../data-hooks/plannings/getList"
import { getListYears } from "../../../data-hooks/plannings/getListYear"
import get from "lodash/get"

type SortByType = {
  id: string
  desc: boolean | undefined
}

const PlanningList = () => {
  const currentMonth = new Date().getMonth() + 1
  const currentYear = new Date().getFullYear()
  const [year, setYear] = useState<string>(`${currentYear}`)
  const [month, setMonth] = useState<string>(`${currentMonth}`)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState<string>("")
  const [sortBy, setSortBy] = useState<SortByType | undefined>(undefined)
  const toast = useToast()
  const toastId1 = "error_plannings"
  const toastId2 = "error_listYears"
  const plannings = getList(page, search, sortBy, year, month)
  const listYears = getListYears()

  useEffect(() => {
    if (plannings.error || plannings.data?.error) {
      if (!toast.isActive(toastId1) && get(plannings, "error.status") !== 401) {
        toast({
          id: toastId1,
          title: "plannings",
          description: plannings.data?.error?.message
            ? plannings.data?.error?.message
            : `${get(plannings, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [plannings.error, plannings.data?.error, toast])

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

  if (listYears.isLoading || listYears.isFetching)
    return (
      <Flex
        alignItems="center"
        width="100%"
        height="100vh"
        justifyContent="center"
      >
        <Center>
          <Spinner size="xl" color="primary.500" />
        </Center>
      </Flex>
    )

  return (
    <List
      data={plannings.data?.data}
      setPage={setPage}
      pageCount={plannings.data?.pageCount}
      setSearch={setSearch}
      search={search}
      isLoading={plannings.isLoading}
      currentPage={plannings.data?.page}
      setYear={setYear}
      setMonth={setMonth}
      sortBy={sortBy}
      setSort={setSortBy}
      listYears={listYears.data?.data}
    />
  )
}

export default PlanningList
