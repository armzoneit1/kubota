/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/display-name */
/* eslint-disable react/no-children-prop */
import { useMemo, useEffect, useState } from "react"
import {
  Box,
  Flex,
  Button,
  Text,
  Link,
  Center,
  Divider,
} from "@chakra-ui/react"
import Table from "../../Table"
import { useForm, Controller } from "react-hook-form"
import { BookingDataTypes } from "../../../data-hooks/bookings/types"
import TableLoading from "../../TableLoading"
import { DateTime } from "luxon"
import { Option } from "../../../data-hooks/bookings/getListTime"
import Head from "next/head"
import Toolbar from "../../Toolbar"
import SelectInput from "../../input/SelectInput"
import DatePicker from "../../input/Datepicker"
import { useRouter } from "next/router"
import filterLodash from "lodash/filter"

type BookingListProps = {
  setPage?: React.Dispatch<React.SetStateAction<number>>
  setSearch?: React.Dispatch<React.SetStateAction<string>>
  setSort?: React.Dispatch<
    React.SetStateAction<{ id: string; desc: boolean | undefined } | undefined>
  >
  setDateTime: React.Dispatch<
    React.SetStateAction<{ date: string; time: string }>
  >
  sortBy: { id: string; desc: boolean | undefined } | undefined
  search?: string
  pageCount?: number
  data: BookingDataTypes[] | undefined
  isLoading: boolean
  currentPage?: number
  listTime: Option[]
  isFetching: boolean
}

const BookingList = ({
  setPage,
  data,
  pageCount,
  isLoading,
  currentPage,
  setSort,
  sortBy,
  listTime,
  setDateTime,
  setSearch,
  search,
  isFetching,
}: BookingListProps) => {
  const [selectedDate, setSelectedDate] = useState("")
  const router = useRouter()
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    control,
    watch,
    setValue,
  } = useForm()

  const onSubmit = (values: any) => {
    if (setDateTime) {
      if (setPage) setPage(1)
      setDateTime({
        date: values?.date
          ? DateTime.fromJSDate(new Date(values.date)).toFormat("y-MM-dd")
          : "",
        time: values?.time?.value ? values?.time?.value : "",
      })
      if (values?.date)
        router.query.date = values?.date
          ? DateTime.fromJSDate(new Date(values.date)).toFormat("y-MM-dd")
          : ""
      else delete router.query.date

      if (values?.time?.value)
        router.query.time = values?.time?.value ? values?.time?.value : ""
      else delete router.query.time
      router.push(router)
    }
  }

  useEffect(() => {
    if (data && setDateTime && (router?.query?.date || router?.query?.time)) {
      const filteredTimeOption =
        router?.query?.time && listTime
          ? listTime.filter((t: Option) => t.value === router?.query?.time)
          : null
      setValue(
        "time",
        filteredTimeOption && filteredTimeOption.length > 0
          ? filteredTimeOption[0]
          : ""
      )

      setValue(
        "date",
        router?.query?.date ? new Date(`${router?.query?.date}`) : null
      )
      setDateTime({
        date: router?.query?.date ? `${router?.query?.date}` : "",
        time:
          filteredTimeOption && filteredTimeOption.length > 0
            ? `${filteredTimeOption[0]?.value}`
            : "",
      })
    }
  }, [router.query, data, listTime])

  const columns = useMemo(
    () => [
      {
        Header: "วัน/เดือน/ปี",
        accessor: "date",
        Cell: ({ value }: any) =>
          DateTime.fromJSDate(new Date(value)).toFormat("dd/MM/y (ccc)", {
            locale: "th",
          }),
      },
      {
        Header: "ชื่อผู้โดยสาร",
        accessor: "firstName",
        Cell: ({ value, row }: any) => (
          <Flex flexDirection="column">
            <Text fontSize="14px" fontWeight={500}>
              {`${row.original.prefixName}${row.original.firstName} ${row.original.lastName}`}
            </Text>
            <Text
              fontSize="14px"
              fontWeight={400}
              color="gray.500"
            >{`${row.original.employeeNo}`}</Text>
          </Flex>
        ),
      },
      {
        Header: "ชื่อผู้จอง",
        accessor: "bookedBy.firstName",
        Cell: ({ value, row }: any) => (
          <Flex flexDirection="column">
            <Text fontSize="14px" fontWeight={500}>
              {`${row.original.bookedBy.prefixName}${row.original.bookedBy.firstName} ${row.original.bookedBy.lastName}`}
            </Text>
            <Text
              fontSize="14px"
              fontWeight={400}
              color="gray.500"
            >{`${row.original.bookedBy.employeeNo}`}</Text>
          </Flex>
        ),
      },
      {
        Header: "จุดจอดรถ",
        accessor: "busStopName",
      },
      {
        Header: "รอบที่ขึ้น",
        accessor: "time",
      },
      {
        Header: "สถานะการจอง",
        accessor: "status",
      },
    ],
    []
  )

  return (
    <>
      <Head>
        <title>การจองรถ</title>
        <meta name="description" content="booking" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Flex flexDirection="column" p="2">
        <Toolbar title="การจองรถ" setSearch={setSearch} search={search} />

        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex
            justifyContent="flex-start"
            mb={{ base: "16px", md: "32px" }}
            flexDirection={{ base: "column", md: "row" }}
          >
            <Flex
              width={{ base: "100%", md: "inherit" }}
              mb={{ base: 6, md: 0 }}
            >
              <Box width={{ base: "50%", md: 40 }}>
                <Controller
                  name="date"
                  control={control}
                  render={({ field, fieldState }) => (
                    <DatePicker
                      date={selectedDate}
                      setDate={setSelectedDate}
                      field={field}
                      fieldState={fieldState}
                    />
                  )}
                />
              </Box>
              <Center mx={6}>
                <Divider
                  orientation="vertical"
                  borderColor="#000000"
                  height="20px"
                />
              </Center>
              <Box width={{ base: "50%", md: 40 }} mr={{ base: 0, md: 4 }}>
                <Controller
                  name="time"
                  control={control}
                  render={({ field, fieldState }) => (
                    <SelectInput
                      options={listTime}
                      placeholder=""
                      {...field}
                      {...fieldState}
                      isClearable={true}
                    />
                  )}
                />
              </Box>
            </Flex>
            <Box>
              <Button
                variant="outline"
                type="submit"
                leftIcon={
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M19.5 2H5.5C5.23478 2 4.98043 2.10536 4.79289 2.29289C4.60536 2.48043 4.5 2.73478 4.5 3V21C4.5 21.2652 4.60536 21.5196 4.79289 21.7071C4.98043 21.8946 5.23478 22 5.5 22H19.5C19.7652 22 20.0196 21.8946 20.2071 21.7071C20.3946 21.5196 20.5 21.2652 20.5 21V3C20.5 2.73478 20.3946 2.48043 20.2071 2.29289C20.0196 2.10536 19.7652 2 19.5 2V2Z"
                      stroke="#00A5A8"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M8.5 15H15.5"
                      stroke="#00A5A8"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M8.5 18H12"
                      stroke="#00A5A8"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M8.5 6H15.5V11H8.5V6Z"
                      stroke="#00A5A8"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                }
                isLoading={isSubmitting || isFetching}
                _focus={{ boxShadow: "none" }}
              >
                แสดงข้อมูล
              </Button>
            </Box>
          </Flex>
        </form>
      </Flex>
      <Box p="2">
        {isLoading || !data ? (
          <TableLoading columnsLength={columns.length + 1} />
        ) : (
          <Table
            resources={`bookings`}
            data={data ? data : []}
            columns={columns}
            hasDelete={false}
            setPage={setPage}
            pageCount={pageCount}
            currentPage={currentPage}
            setSort={setSort}
            sortBy={sortBy}
            hasEdit={false}
          />
        )}
      </Box>
    </>
  )
}

export default BookingList
