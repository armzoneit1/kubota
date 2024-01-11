/* eslint-disable react/display-name */
/* eslint-disable react/no-children-prop */
import { useMemo, useEffect } from "react"
import Head from "next/head"
import { Box, Flex, Text, Button, Link, FormControl } from "@chakra-ui/react"
import Table from "../../Table"
import { useForm, Controller } from "react-hook-form"
import Toolbar from "../../Toolbar"
import { DateTime } from "luxon"
import NextLink from "next/link"
import { Option } from "../../../data-hooks/plannings/getListYear"
import { PlanningDataTypes } from "../../../data-hooks/plannings/types"
import SelectInput from "../../input/SelectInput"
import filter from "lodash/filter"
import TableLoading from "../../TableLoading"

const EditButton = ({ resources, id }: any) => {
  return (
    <NextLink href={`/admin/${resources}/${id}/morning`} passHref>
      <Link _hover={{}} _focus={{}}>
        <Button
          color="#00A5A8"
          textDecoration="underline"
          variant="ghost"
          _focus={{ boxShadow: "none" }}
        >
          จัดรถ
        </Button>
      </Link>
    </NextLink>
  )
}

type PlanningListProps = {
  setPage?: React.Dispatch<React.SetStateAction<number>>
  setSearch?: React.Dispatch<React.SetStateAction<string>>
  setYear?: React.Dispatch<React.SetStateAction<string>>
  setMonth?: React.Dispatch<React.SetStateAction<string>>
  setSort?: React.Dispatch<
    React.SetStateAction<{ id: string; desc: boolean | undefined } | undefined>
  >
  sortBy: { id: string; desc: boolean | undefined } | undefined
  search?: string
  pageCount?: number
  data: PlanningDataTypes[] | undefined
  isLoading: boolean
  currentPage?: number
  listYears: Option[]
}

const monthOptions = [
  { value: "1", label: "มกราคม" },
  { value: "2", label: "กุมภาพันธ์" },
  { value: "3", label: "มีนาคม" },
  { value: "4", label: "เมษายน" },
  { value: "5", label: "พฤษภาคม" },
  { value: "6", label: "มิถุนายน" },
  { value: "7", label: "กรกฎาคม" },
  { value: "8", label: "สิงหาคม" },
  { value: "9", label: "กันยายน" },
  { value: "10", label: "ตุลาคม" },
  { value: "11", label: "พฤศจิกายน" },
  { value: "12", label: "ธันวาคม" },
]

const PlanningList = ({
  setPage,
  data,
  pageCount,
  setYear,
  setMonth,
  isLoading,
  currentPage,
  setSort,
  sortBy,
  listYears,
  setSearch,
  search,
}: PlanningListProps) => {
  const currentMonth = new Date().getMonth() + 1
  const currentYear = new Date().getFullYear()

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    control,
    watch,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      year:
        listYears && filter(listYears, (v) => v.value === `${currentYear}`)[0],
      month: filter(monthOptions, (v) => v.value === `${currentMonth}`)[0],
    },
  })

  const watchYear = watch("year")
  const watchMonth = watch("month")

  useEffect(() => {
    if (setYear && watchYear?.value) setYear(`${watchYear?.value}`)
  }, [watchYear, setYear])
  useEffect(() => {
    if (setMonth && watchMonth?.value) setMonth(`${watchMonth?.value}`)
  }, [watchMonth, setMonth])

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
        Header: "รอบไป",
        accessor: "timeTableMorning.name",
        Cell: ({ value, row }: any) => (
          <Flex alignItems="center">
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="6"
                cy="6"
                r="6"
                fill={
                  row.original.isMorningOpenForBooking
                    ? row.original.timeTableMorning.status === "open"
                      ? "#2CBF4C"
                      : "#D61212"
                    : "#C4C4C4"
                }
              />
            </svg>

            <Text ml={4}>
              {value}{" "}
              <NextLink
                href={`/admin/bookings?date=${DateTime.fromJSDate(
                  new Date(row?.original?.date)
                ).toFormat("y-MM-dd")}&time=morning`}
                passHref
              >
                <Link
                  _hover={{}}
                  _focus={{}}
                  textDecoration="underline"
                  color="primary.500"
                >
                  {row.original.timeTableMorning.totalBooking}
                  {" คน"}
                </Link>
              </NextLink>
            </Text>
          </Flex>
        ),
      },

      {
        Header: "รอบกลับ",
        accessor: "timeTableEvening.name",
        Cell: ({ value, row }: any) => (
          <Flex alignItems="center">
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="6"
                cy="6"
                r="6"
                fill={
                  row.original.isEveningOpenForBooking
                    ? row.original.timeTableEvening.status === "open"
                      ? "#2CBF4C"
                      : "#D61212"
                    : "#C4C4C4"
                }
              />
            </svg>

            <Text ml={4}>
              {value}{" "}
              <NextLink
                href={`/admin/bookings?date=${DateTime.fromJSDate(
                  new Date(row?.original?.date)
                ).toFormat("y-MM-dd")}&time=evening`}
                passHref
              >
                <Link
                  _hover={{}}
                  _focus={{}}
                  textDecoration="underline"
                  color="primary.500"
                >
                  {row.original.timeTableEvening.totalBooking}
                  {" คน"}
                </Link>
              </NextLink>
            </Text>
          </Flex>
        ),
      },
    ],
    []
  )

  return (
    <Box>
      <Head>
        <title>การจัดรถ</title>
        <meta name="description" content="planning" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box>
        <Flex flexDirection="column" p="2">
          <Toolbar title="การจัดรถ" showSearchInput={false} />
          <Flex justifyContent="flex-start" mb={{ base: "16px", md: "32px" }}>
            <Box width={40} mr={4}>
              <Controller
                name="year"
                control={control}
                render={({ field }) => (
                  <SelectInput
                    options={listYears}
                    placeholder=""
                    menuBackgroundColor="#ffffff"
                    {...field}
                  />
                )}
              />
            </Box>
            <Box width={40}>
              <Controller
                name="month"
                control={control}
                render={({ field }) => (
                  <SelectInput
                    options={monthOptions}
                    placeholder=""
                    menuBackgroundColor="#ffffff"
                    {...field}
                  />
                )}
              />
            </Box>
          </Flex>
        </Flex>
        <Box>
          {isLoading || !data ? (
            <TableLoading columnsLength={columns.length + 1} />
          ) : (
            <Table
              resources="plannings"
              data={data ? data : []}
              columns={columns}
              hasDelete={false}
              setPage={setPage}
              pageCount={pageCount}
              currentPage={currentPage}
              setSort={setSort}
              sortBy={sortBy}
              editButton={<EditButton />}
            />
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default PlanningList
