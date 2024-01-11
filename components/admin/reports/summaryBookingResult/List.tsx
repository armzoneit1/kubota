/* eslint-disable react/display-name */
import { useRouter } from "next/router"
import { useForm, Controller } from "react-hook-form"
import React, { useState, useMemo, useEffect } from "react"
import {
  FormLabel,
  FormControl,
  Button,
  Container,
  Flex,
  Box,
  Text,
  HStack,
  Divider,
  Center,
  useBreakpointValue,
  Spinner,
  Link,
  FormErrorMessage,
} from "@chakra-ui/react"
import Datepicker from "../../../input/Datepicker"
import ReportTable from "../ReportTable"
import { DateTime } from "luxon"
import SelectInput from "../../../input/SelectInput"
import { SummaryBookingResultDataTypes } from "../../../../data-hooks/reports/summaryBookingResult/types"
import Head from "next/head"
import NextLink from "next/link"
import uniq from "lodash/uniq"
import filterLodash from "lodash/filter"

type SummaryBookingResultListProps = {
  setPage?: React.Dispatch<React.SetStateAction<number>>
  setSearch?: React.Dispatch<React.SetStateAction<string>>
  setSort?: React.Dispatch<
    React.SetStateAction<{ id: string; desc: boolean | undefined } | undefined>
  >
  setFilter: React.Dispatch<
    React.SetStateAction<{ date: string; round: string }>
  >
  filter: { date: string; round: string }
  sortBy: { id: string; desc: boolean | undefined } | undefined
  search?: string
  pageCount?: number
  data: SummaryBookingResultDataTypes[] | undefined
  dataForDownload: SummaryBookingResultDataTypes | undefined
  isLoading: boolean
  currentPage?: number
  download: (values: any) => void
  isLoadingDownload: boolean
  isFetching: boolean
}

const options = [
  { value: "morning", label: "รอบไป" },
  { value: "evening", label: "รอบกลับ" },
]

type Option = {
  value: string
  label: string
}

const SummaryBookingResultList = ({
  setPage,
  data,
  pageCount,
  isLoading,
  currentPage,
  setSort,
  sortBy,
  setFilter,
  setSearch,
  search,
  filter,
  download,
  isLoadingDownload,
  dataForDownload,
  isFetching,
}: SummaryBookingResultListProps) => {
  const router = useRouter()
  const [date, setDate] = useState<any>(
    filter.date ? new Date(filter.date) : null
  )
  const isShow = useBreakpointValue({ base: false, md: true })

  const timeTableRounds = useMemo(
    () =>
      data
        ? uniq(
            [...data]
              .reduce((acc: any[], curr) => {
                curr.timeTableRounds.map((timeTable) =>
                  acc.push(timeTable.time)
                )
                return acc
              }, [])
              .sort()
          )
        : [],
    [data]
  )

  const columns = useMemo(
    () => [
      {
        Header: "ลำดับ",
        accessor: "busLineRank",
        minWidth: 100,
        maxWidth: 120,
      },
      {
        Header: "สายรถ",
        accessor: "busLineName",
        minWidth: 250,
        maxWidth: 400,
      },
      ...timeTableRounds.map((timeTable) => ({
        Header: timeTable,
        accessor: timeTable,
        minWidth: 275,
        maxWidth: 400,
        disableSortBy: true,
        Cell: ({ row }: any) => {
          const timeTableRound = filterLodash(row.original.timeTableRounds, {
            time: timeTable,
          })

          const bookingVehicles =
            timeTableRound && timeTableRound.length > 0
              ? timeTableRound[0].bookingVehicles.map(
                  (bookingVehicle: any, index: number) => {
                    return (
                      <span key={index}>
                        {bookingVehicle.totalPassenger > 0 ? (
                          <>
                            {bookingVehicle.vehicleTypeName}{" "}
                            <NextLink
                              href={`/admin/reports/summaryBookingResult/${bookingVehicle.bookingVehicleId}`}
                              passHref
                            >
                              <Link color="primary.500" _focus={{}}>
                                {bookingVehicle.totalPassenger} คน
                              </Link>
                            </NextLink>
                            {timeTableRound[0].bookingVehicles[index + 1]
                              ? ", "
                              : ""}
                          </>
                        ) : (
                          "-"
                        )}
                      </span>
                    )
                  }
                )
              : []

          return bookingVehicles && bookingVehicles.length > 0 ? (
            <>{bookingVehicles.map((bookingVehicle: any) => bookingVehicle)}</>
          ) : (
            "-"
          )
        },
      })),
    ],
    [timeTableRounds]
  )

  useEffect(() => {
    if (setFilter && (router?.query?.date || router?.query?.round)) {
      const filteredRoundOption =
        router?.query?.round && options
          ? options.filter((t: Option) => t.value === router?.query?.round)
          : null
      setValue(
        "round",
        filteredRoundOption && filteredRoundOption.length > 0
          ? filteredRoundOption[0]
          : null
      )
      setValue(
        "date",
        router?.query?.date ? new Date(`${router?.query?.date}`) : null
      )
      setFilter({
        date: router?.query?.date ? `${router?.query?.date}` : "",
        round:
          filteredRoundOption && filteredRoundOption.length > 0
            ? filteredRoundOption[0].value
            : "",
      })
    }
  }, [router.query, data])

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    control,
    setValue,
  } = useForm({
    defaultValues: {
      date: filter.date ? new Date(filter.date) : null,
      round: filter.round
        ? filterLodash(options, { value: filter.round })[0]
        : null,
    },
  })

  function onSubmit(values: any) {
    setFilter({
      date: DateTime.fromJSDate(values?.date).toFormat("y-MM-dd"),
      round: values?.round?.value,
    })
    if (values?.date)
      router.query.date = values?.date
        ? DateTime.fromJSDate(new Date(values.date)).toFormat("y-MM-dd")
        : ""
    else delete router.query.date

    if (values?.round?.value)
      router.query.round = values?.round?.value ? values?.round?.value : ""
    else delete router.query.round
    router.push(router)
  }

  return (
    <>
      <Head>
        <title>สรุปการจัดรถ</title>
        <meta name="description" content="summaryBookingResult" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container
        minHeight="80vh"
        minW="100%"
        paddingInlineStart={{ base: 2, md: 0 }}
        paddingInlineEnd={{ base: 2, md: 0 }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex flexDirection="column">
            <Flex width="100%" justifyContent="space-between" my={5}>
              <Flex justifyContent="center" flexDirection="column">
                <Text mb={3} fontSize="32px">
                  สรุปการจัดรถ
                </Text>
                <HStack>
                  <NextLink href={"/admin/reports"} passHref>
                    <Link _hover={{}} _focus={{}}>
                      <Text fontStyle="italic" color="#00A5A8" cursor="pointer">
                        รายงาน
                      </Text>
                    </Link>
                  </NextLink>
                  <Text>{">"}</Text>
                  <Text fontStyle="italic">สรุปการจัดรถ</Text>
                </HStack>
              </Flex>
            </Flex>
            <Flex
              alignItems={
                !!errors.round || !!errors.date ? "center" : "flex-end"
              }
              w="100%"
              mb={{ base: 6, md: 0 }}
            >
              <Box
                w={{ base: "35%", md: "15%" }}
                mr={{ base: 2, md: 0 }}
                height={!!errors.round ? "99px" : "100%"}
              >
                <FormLabel htmlFor="date">เลือกวัน</FormLabel>
                <Controller
                  name="date"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Datepicker
                      date={date}
                      setDate={setDate}
                      field={field}
                      fieldState={fieldState}
                    />
                  )}
                  rules={{ required: "กรุณาเลือกวันที่" }}
                />
              </Box>
              {isShow && (
                <Center mx={4} height="40px">
                  <Divider
                    orientation="vertical"
                    borderColor="#000000"
                    height="20px"
                  />
                </Center>
              )}
              <FormControl
                w={{ base: "35%", md: "15%" }}
                mr={4}
                isInvalid={!!errors.round}
                height={!!errors.date ? "99px" : "100%"}
              >
                <FormLabel htmlFor="round">เลือกรอบเวลา</FormLabel>
                <Controller
                  name="round"
                  control={control}
                  render={({ field, fieldState }) => (
                    <SelectInput
                      options={options}
                      {...field}
                      {...fieldState}
                      placeholder=""
                    />
                  )}
                  rules={{ required: "กรุณาเลือกรอบเวลา" }}
                />

                <FormErrorMessage>
                  {errors.round && "กรุณาเลือกรอบเวลา"}
                </FormErrorMessage>
              </FormControl>
              <Button
                variant="outline"
                type="submit"
                isLoading={isSubmitting || isFetching}
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
                    <path d="M8.5 15H15.5" stroke="#00A5A8" strokeWidth="2" />
                    <path
                      d="M8.5 18H12"
                      stroke="#00A5A8"
                      strokeLinecap="round"
                    />
                    <path
                      d="M8.5 6H15.5V11H8.5V6Z"
                      stroke="#00A5A8"
                      strokeLinejoin="round"
                    />
                  </svg>
                }
                _focus={{ boxShadow: "none" }}
              >
                แสดงข้อมูล
              </Button>
            </Flex>
            <Flex
              justifyContent={{ base: "flex-start", md: "flex-end" }}
              mb={6}
            >
              <Button
                leftIcon={
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2.85902 2.87722L15.429 1.08222C15.5 1.07204 15.5723 1.07723 15.641 1.09744C15.7098 1.11765 15.7734 1.1524 15.8275 1.19935C15.8817 1.24629 15.9251 1.30433 15.9549 1.36952C15.9846 1.43472 16 1.50555 16 1.57722V22.4232C16 22.4948 15.9846 22.5655 15.9549 22.6306C15.9252 22.6957 15.8819 22.7537 15.8279 22.8007C15.7738 22.8476 15.7103 22.8824 15.6417 22.9026C15.5731 22.9229 15.5009 22.9282 15.43 22.9182L2.85802 21.1232C2.61964 21.0893 2.40152 20.9704 2.24371 20.7886C2.08591 20.6067 1.99903 20.374 1.99902 20.1332V3.86722C1.99903 3.62643 2.08591 3.39373 2.24371 3.21186C2.40152 3.02999 2.61964 2.91117 2.85802 2.87722H2.85902ZM17 3.00022H21C21.2652 3.00022 21.5196 3.10557 21.7071 3.29311C21.8947 3.48064 22 3.735 22 4.00022V20.0002C22 20.2654 21.8947 20.5198 21.7071 20.7073C21.5196 20.8949 21.2652 21.0002 21 21.0002H17V3.00022ZM10.2 12.0002L13 8.00022H10.6L9.00002 10.2862L7.40002 8.00022H5.00002L7.80002 12.0002L5.00002 16.0002H7.40002L9.00002 13.7142L10.6 16.0002H13L10.2 12.0002Z"
                      fill="#F9F9F9"
                    />
                  </svg>
                }
                _focus={{ boxShadow: "none" }}
                isDisabled={!(dataForDownload && data && data.length > 0)}
                onClick={() => {
                  download(dataForDownload)
                }}
                isLoading={isLoadingDownload}
              >
                ดาวน์โหลดเป็น Excel
              </Button>
            </Flex>
            <Box w="100%">
              {isLoading ? (
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
              ) : (
                <ReportTable
                  columns={columns}
                  data={data ? data : []}
                  setPage={setPage}
                  setSort={setSort}
                  pageCount={pageCount}
                  currentPage={currentPage}
                  sortBy={sortBy}
                />
              )}
            </Box>
          </Flex>
        </form>
      </Container>
    </>
  )
}

export default SummaryBookingResultList
