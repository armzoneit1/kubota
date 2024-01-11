/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/display-name */
/* eslint-disable react/no-children-prop */
import { useEffect, useState } from "react"
import { useToast } from "@chakra-ui/react"
import List from "../../../components/admin/bookings/List"
import { getList } from "../../../data-hooks/bookings/getList"
import { getListTime } from "../../../data-hooks/bookings/getListTime"
import get from "lodash/get"

type SortByType = {
  id: string
  desc: boolean | undefined
}

const BookingList = () => {
  const [dateTime, setDateTime] = useState<{ date: string; time: string }>({
    date: "",
    time: "",
  })
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState<string>("")
  const [sortBy, setSortBy] = useState<SortByType | undefined>(undefined)
  const toast = useToast()
  const toastId1 = "error_bookings"
  const toastId2 = "error_listTime"
  const bookings = getList(page, search, sortBy, dateTime.date, dateTime.time)
  const listTime = getListTime()

  useEffect(() => {
    if (bookings.error || bookings.data?.error) {
      if (!toast.isActive(toastId1) && get(bookings, "error.status") !== 401) {
        toast({
          id: toastId1,
          title: "bookings",
          description: bookings.data?.error?.message
            ? bookings.data?.error?.message
            : `${get(bookings, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [bookings.error, bookings.data?.error, toast])

  useEffect(() => {
    if (listTime.error || listTime.data?.error) {
      if (!toast.isActive(toastId2) && get(listTime, "error.status") !== 401) {
        toast({
          id: toastId2,
          title: "List Years",
          description: listTime.data?.error?.message
            ? listTime.data?.error?.message
            : `${get(listTime, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [listTime.error, listTime.data?.error, toast])
  return (
    <List
      data={bookings.data?.data}
      setPage={setPage}
      pageCount={bookings.data?.pageCount}
      setSearch={setSearch}
      search={search}
      isLoading={bookings.isLoading || listTime.isLoading}
      currentPage={
        bookings.data?.currentPage ? bookings.data?.currentPage : page
      }
      sortBy={sortBy}
      setSort={setSortBy}
      listTime={listTime.data?.data}
      setDateTime={setDateTime}
      isFetching={bookings?.isFetching}
    />
  )
}

export default BookingList
