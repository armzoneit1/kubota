/* eslint-disable react/display-name */
import { useRouter } from "next/router"
import { useForm, Controller } from "react-hook-form"
import React, { useState, useMemo, useEffect } from "react"
import {
  FormErrorMessage,
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
} from "@chakra-ui/react"
import Datepicker from "../../../input/Datepicker"
import ReportTable from "../ReportTable"
import SelectInput from "../../../input/SelectInput"
import { DateTime } from "luxon"
import { SummaryTotalPassengerDataTypes } from "../../../../data-hooks/reports/summaryTotalPassenger/types"
import Head from "next/head"
import NextLink from "next/link"

type SummaryTotalPassengerListProps = {
  setQuery: React.Dispatch<React.SetStateAction<boolean>>
  setFilter: React.Dispatch<
    React.SetStateAction<{
      startDate: string
      endDate: string
      typeOfTotalPassenger: string
      time: string
      busLineName: string
    }>
  >
  filter: {
    startDate: string
    endDate: string
    typeOfTotalPassenger: string
    time: string
    busLineName: string
  }
  data: SummaryTotalPassengerDataTypes | undefined
  dates: any | undefined
  listOfTime: any[] | undefined
  listOfBusLine: any[] | undefined
  listTypeOfTotalPassenger: any[] | undefined
  isLoading: boolean
  busLines: string[] | undefined
  isFetching: boolean
  download: (values: any) => void
  isLoadingDownload: boolean
  dataForDownload: SummaryTotalPassengerDataTypes | undefined
}

const SummaryTotalPassengerList = ({
  setFilter,
  filter,
  data,
  listOfTime,
  listOfBusLine,
  listTypeOfTotalPassenger,
  isLoading,
  dates,
  busLines,
  isFetching,
  download,
  isLoadingDownload,
  dataForDownload,
  setQuery,
}: SummaryTotalPassengerListProps) => {
  const router = useRouter()
  const isShow = useBreakpointValue({ base: false, md: true })
  const [startDate, setStartDate] = useState<any>(null)
  const [endDate, setEndDate] = useState<any>(null)

  const busLineColumns = useMemo(
    () =>
      busLines
        ? busLines.map((busLine) => ({
            Header: busLine,
            accessor: `${busLine}.totalPassenger`,
            disableSortBy: true,
            minWidth: 100,
            width: 100,
            maxWidth: 100,
          }))
        : [],
    [busLines]
  )

  const columns = useMemo(
    () => [
      {
        Header: "รอบเวลา",
        accessor: "time",
        disableSortBy: true,
        minWidth: 100,
        width: 100,
        maxWidth: 100,
      },
      {
        Header: "ประเภทรถ",
        accessor: "vehicleTypeName",
        disableSortBy: true,
        minWidth: 120,
        width: 120,
        maxWidth: 140,
      },
      {
        Header: "ชื่อผู้ให้บริการ",
        accessor: "transportationProviderName",
        disableSortBy: true,
        minWidth: 140,
        width: 140,
        maxWidth: 170,
      },
      ...busLineColumns,
      {
        Header: "รวม",
        accessor: "totalPassengerBookingVehicle",
        disableSortBy: true,
        minWidth: 75,
        width: 75,
        maxWidth: 75,
      },
    ],
    [busLineColumns]
  )

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    control,
    watch,
  } = useForm()

  const watchStartDate = watch("startDate")
  const watchEndDate = watch("endDate")

  useEffect(() => {
    if (watchStartDate && watchEndDate) {
      setFilter((prevState) => ({
        ...prevState,
        startDate: DateTime.fromJSDate(watchStartDate).toFormat("y-MM-dd"),
        endDate: DateTime.fromJSDate(watchEndDate).toFormat("y-MM-dd"),
      }))
    }
  }, [watchStartDate, watchEndDate])

  function onSubmit(values: any) {
    setFilter({
      startDate: DateTime.fromJSDate(values?.startDate).toFormat("y-MM-dd"),
      endDate: DateTime.fromJSDate(values?.endDate).toFormat("y-MM-dd"),
      time: values?.time?.value,
      busLineName: values?.busLineName?.value,
      typeOfTotalPassenger: values?.typeOfTotalPassenger?.value,
    })
    setQuery(true)
  }

  return (
    <>
      <Head>
        <title>สรุปจำนวนผู้ใช้บริการรถ</title>
        <meta name="description" content="summaryTotalPassenger" />
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
                  สรุปจำนวนผู้ใช้บริการรถ
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
                  <Text fontStyle="italic">สรุปจำนวนผู้ใช้บริการรถ</Text>
                </HStack>
              </Flex>
            </Flex>
            <Flex
              alignItems={{
                base: "flex-end",
                md:
                  !!errors.startDate || !!errors.endDate
                    ? "center"
                    : "flex-end",
              }}
              w="100%"
              mb={{ base: 0, md: 10 }}
              flexDirection={{ base: "column", md: "row" }}
            >
              <Flex
                w={{ base: "100%", md: "40%", lg: "30%" }}
                alignItems={"flex-end"}
              >
                <Box
                  w="50%"
                  mb={{ base: 4, md: 0 }}
                  height={!!errors.endDate ? "99px" : "100%"}
                >
                  <FormLabel htmlFor="startDate">เลือกวัน</FormLabel>
                  <Controller
                    name="startDate"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Datepicker
                        date={startDate}
                        setDate={setStartDate}
                        field={field}
                        fieldState={fieldState}
                      />
                    )}
                    rules={{
                      required: "กรุณาเลือกวันที่เริ่มต้น",
                      validate: (value) => {
                        if (value && watchEndDate && value > watchEndDate) {
                          return "วันเริ่มต้นมากกว่าวันสิ้นสุด"
                        }
                      },
                    }}
                  />
                </Box>
                <Center
                  mx={4}
                  height={{
                    base:
                      !!errors.startDate || !!errors.endDate ? "99px" : "70px",
                    md:
                      !!errors.startDate || !!errors.endDate ? "99px" : "40px",
                  }}
                >
                  <Divider
                    orientation="horizontal"
                    borderColor="#000000"
                    width="5px"
                  />
                </Center>
                <Flex
                  w="50%"
                  mb={{ base: 4, md: 0 }}
                  height={{
                    base:
                      !!errors.startDate || !!errors.endDate ? "99px" : "100%",
                    md:
                      !!errors.startDate || !!errors.endDate ? "99px" : "100%",
                  }}
                  justifyContent={
                    !!errors.startDate && !!errors.endDate
                      ? "flex-end"
                      : !!errors.endDate
                      ? "flex-end"
                      : "center"
                  }
                  flexDirection="column"
                >
                  <FormLabel></FormLabel>
                  <Controller
                    name="endDate"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Datepicker
                        date={endDate}
                        setDate={setEndDate}
                        field={field}
                        fieldState={fieldState}
                      />
                    )}
                    rules={{
                      required: "กรุณาเลือกวันที่สิ้นสุด",
                      validate: (value) => {
                        if (value && watchStartDate && value < watchStartDate) {
                          return "วันสิ้นสุดมากกว่าวันเริ่มต้น"
                        }
                      },
                    }}
                  />
                </Flex>
              </Flex>
              {isShow && (
                <Center
                  mx={4}
                  height={{
                    base: "70px",
                    md:
                      !!errors.startDate || !!errors.endDate ? "99px" : "40px",
                  }}
                >
                  <Divider
                    orientation="vertical"
                    borderColor="#000000"
                    height="20px"
                  />
                </Center>
              )}
              <Flex
                w={{ base: "100%", md: "40%", lg: "30%" }}
                alignItems={
                  !!errors.startDate || !!errors.endDate
                    ? "flex-start"
                    : "flex-end"
                }
                height={
                  !!errors.startDate || !!errors.endDate ? "99px" : "100%"
                }
              >
                <FormControl
                  isInvalid={!!errors.time}
                  w={"50%"}
                  mb={{ base: 4, md: 0 }}
                >
                  <FormLabel htmlFor="time">เลือกรอบเวลา</FormLabel>
                  <Controller
                    name="time"
                    control={control}
                    render={({ field }) => (
                      <SelectInput
                        options={listOfTime}
                        {...field}
                        placeholder=""
                        isClearable
                      />
                    )}
                  />
                  <FormErrorMessage>
                    {errors.time && errors.time.message}
                  </FormErrorMessage>
                </FormControl>
                <Center
                  mx={4}
                  height={{
                    base: "70px",
                    md:
                      !!errors.startDate || !!errors.endDate ? "99px" : "40px",
                  }}
                >
                  <Divider
                    orientation="vertical"
                    borderColor="#000000"
                    height="20px"
                  />
                </Center>
                <FormControl
                  isInvalid={!!errors.busLineName}
                  w={"50%"}
                  mb={{ base: 4, md: 0 }}
                >
                  <FormLabel htmlFor="busLineName">สายรถ</FormLabel>
                  <Controller
                    name="busLineName"
                    control={control}
                    render={({ field }) => (
                      <SelectInput
                        options={listOfBusLine}
                        {...field}
                        placeholder=""
                        isClearable
                      />
                    )}
                  />
                  <FormErrorMessage>
                    {errors.busLineName && errors.busLineName.message}
                  </FormErrorMessage>
                </FormControl>
              </Flex>
            </Flex>
            <Flex w="100%" alignItems="flex-end" mb={10}>
              <FormControl
                isInvalid={!!errors.typeOfTotalPassenger}
                w={{ base: "50%", md: "20%", lg: "15%" }}
              >
                <FormLabel htmlFor="typeOfTotalPassenger">
                  ดึงข้อมูลจาก
                </FormLabel>
                <Controller
                  name="typeOfTotalPassenger"
                  control={control}
                  render={({ field, fieldState }) => (
                    <SelectInput
                      options={listTypeOfTotalPassenger}
                      {...field}
                      {...fieldState}
                      placeholder=""
                    />
                  )}
                  rules={{ required: "กรุณาเลือก" }}
                />
                <FormErrorMessage>
                  {errors.typeOfTotalPassenger &&
                    errors.typeOfTotalPassenger.message}
                </FormErrorMessage>
              </FormControl>
            </Flex>
            <Flex>
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
                isLoading={isSubmitting || isFetching}
              >
                แสดงข้อมูล
              </Button>
            </Flex>

            <Flex justifyContent="flex-end" mb={6}>
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
                isDisabled={
                  !(
                    filter.startDate &&
                    filter.endDate &&
                    filter.typeOfTotalPassenger &&
                    data &&
                    dates &&
                    dates.length > 0
                  )
                }
                onClick={() => {
                  download({
                    startDate: filter.startDate,
                    endDate: filter.endDate,
                    typeOfTotalPassenger: filter.typeOfTotalPassenger,
                    time: filter.time,
                    busLineName: filter.busLineName,
                    data: dataForDownload,
                  })
                }}
                isLoading={isLoadingDownload}
              >
                ดาวน์โหลดเป็น Excel
              </Button>
            </Flex>
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
            ) : dates && dates.length > 0 ? (
              <>
                <Flex flexDirection="column" mb={10}>
                  <Text color="primary.500" fontWeight={600} fontSize="24px">
                    รวมผู้ใช้บริการทั้งหมด {data?.total} คน
                  </Text>
                </Flex>

                {dates.map((date: any, index: number) => {
                  return (
                    <Box w="100%" mb={12} key={index}>
                      <Text fontSize="20px" fontWeight={600} mb={4}>
                        วันที่ :{" "}
                        {DateTime.fromJSDate(
                          new Date(`${date?.date}`)
                        ).toFormat("dd/MM/y")}
                      </Text>
                      <ReportTable
                        resources="summaryTotalPassenger"
                        columns={columns}
                        data={date?.times}
                        pageSize={date?.times ? date?.times.length : 0}
                        totalPassenger={date.totalPassenger}
                      />
                    </Box>
                  )
                })}
              </>
            ) : (
              <ReportTable
                resources="summaryTotalPassenger"
                columns={columns}
                data={[]}
                pageSize={0}
              />
            )}
          </Flex>
        </form>
      </Container>
    </>
  )
}

export default SummaryTotalPassengerList
