/* eslint-disable react/display-name */
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
  Link,
  Spinner,
} from "@chakra-ui/react"
import Datepicker from "../../../input/Datepicker"
import ReportTable from "../ReportTable"
import SelectInput from "../../../input/SelectInput"
import { DateTime } from "luxon"
import Head from "next/head"
import NextLink from "next/link"
import { EmployeeAttendanceDataTypes } from "../../../../data-hooks/reports/employeeAttendance/types"

type EmployeeAttendanceListProps = {
  setFilter: React.Dispatch<
    React.SetStateAction<{
      date: string
      time: string
      busLineName: string
      bookingVehicleId: string
    }>
  >
  filter: {
    date: string
    time: string
    busLineName: string
    bookingVehicleId: string
  }
  data: EmployeeAttendanceDataTypes | undefined
  listOfTime: any[] | undefined
  listOfBusLine: any[] | undefined
  listOfBookingVehicle: any[] | undefined
  isLoading: boolean
  setRequest: React.Dispatch<React.SetStateAction<boolean>>
  isFetching: boolean
  download: (values: any) => void
  isLoadingDownload: boolean
  dataForDownload: EmployeeAttendanceDataTypes | undefined
}

const EmployeeAttendanceList = ({
  setFilter,
  filter,
  data,
  listOfTime,
  listOfBusLine,
  listOfBookingVehicle,
  isLoading,
  setRequest,
  isFetching,
  download,
  isLoadingDownload,
  dataForDownload,
}: EmployeeAttendanceListProps) => {
  const [date, setDate] = useState<any>(null)
  const isShow = useBreakpointValue({ base: false, md: true })

  const columns = useMemo(
    () => [
      {
        Header: "ลำดับ",
        accessor: "",
        Cell: (props: any) => {
          return <div>{props.row.index + 1}</div>
        },
        width: 75,
        maxWidth: 75,
        minWidth: 75,
        disableSortBy: true,
      },

      {
        Header: "รหัสพนักงาน",
        accessor: "employeeNo",
        width: 150,
        minWidth: 150,
        maxWidth: 175,
        disableSortBy: true,
      },
      {
        Header: "ชื่อพนักงาน",
        accessor: "firstName",
        minWidth: 250,
        width: 250,
        maxWidth: 350,
        disableSortBy: true,

        Cell: ({ row }: any) =>
          `${row.original.title}${row.original.firstName} ${row.original.lastName}`,
      },
      {
        Header: "หน่วยงาน / ส่วน",
        accessor: "jobName",
        minWidth: 200,
        width: 200,
        maxWidth: 275,
        disableSortBy: true,
        Cell: ({ row, value }: any) =>
          `${value} / ${row?.original?.positionName}`,
      },
      {
        Header: "จุดลงรถ",
        accessor: "busStopName",
        minWidth: 150,
        width: 150,
        maxWidth: 175,
        disableSortBy: true,
      },
      {
        Header: "ลายเซ็นต์",
        accessor: "",
        minWidth: 175,
        width: 175,
        maxWidth: 175,
        disableSortBy: true,
      },
    ],
    []
  )

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    control,
    watch,
    setValue,
  } = useForm()

  const watchDate = watch("date")
  const watchTime = watch("time")
  const watchBusLine = watch("busLineName")

  useEffect(() => {
    if (watchDate)
      setFilter((prevState) => ({
        ...prevState,
        date: DateTime.fromJSDate(watchDate).toFormat("y-MM-dd"),
      }))
    else {
      setValue("time", null)
      setValue("busLineName", null)
      setValue("bookingVehicleId", null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchDate])

  useEffect(() => {
    if (watchTime)
      setFilter((prevState) => ({
        ...prevState,
        time: watchTime.value,
      }))
    else {
      setValue("bookingVehicleId", null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchTime])

  useEffect(() => {
    if (watchBusLine)
      setFilter((prevState) => ({
        ...prevState,
        busLineName: watchBusLine.value,
      }))
    else {
      setValue("bookingVehicleId", null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchBusLine])

  function onSubmit(values: any) {
    setFilter({
      date: DateTime.fromJSDate(values?.date).toFormat("y-MM-dd"),
      time: values?.time?.value,
      busLineName: values?.busLineName?.value,
      bookingVehicleId: values?.bookingVehicleId?.value,
    })
    setRequest(true)
  }

  return (
    <>
      <Head>
        <title>ใบลงนามของพนักงาน</title>
        <meta name="description" content="employeeAttendance" />
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
                  ใบลงนามของพนักงาน
                </Text>
                <HStack>
                  <NextLink href="/admin/reports" passHref>
                    <Link _hover={{}} _focus={{}}>
                      <Text fontStyle="italic" color="#00A5A8" cursor="pointer">
                        รายงาน
                      </Text>
                    </Link>
                  </NextLink>
                  <Text>{">"}</Text>
                  <Text fontStyle="italic">ใบลงนามของพนักงาน</Text>
                </HStack>
              </Flex>
            </Flex>
            <Flex
              alignItems={{ base: "normal", md: "flex-end" }}
              w="100%"
              mb={{ base: 0, md: 6 }}
              flexDirection={{ base: "column", md: "row" }}
            >
              <Flex
                w={{ base: "100%", md: "50%", lg: "40%" }}
                alignItems={
                  !!errors.time || !!errors.date ? "center" : "flex-end"
                }
              >
                <Box
                  w={"50%"}
                  mb={{ base: 2, md: 0 }}
                  height={!!errors.time ? "99px" : "100%"}
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
                    rules={{
                      required: "กรุณาเลือกวันที่",
                    }}
                  />
                </Box>
                <Center mx={4} height={{ base: "70px", md: "40px" }}>
                  <Divider
                    orientation="vertical"
                    borderColor="#000000"
                    height="20px"
                  />
                </Center>
                <FormControl
                  isInvalid={!!errors.time}
                  w={"50%"}
                  mb={{ base: 2, md: 0 }}
                  height={!!errors.date ? "99px" : "100%"}
                >
                  <FormLabel htmlFor="time">เลือกรอบเวลา</FormLabel>
                  <Controller
                    name="time"
                    control={control}
                    render={({ field, fieldState }) => (
                      <SelectInput
                        options={listOfTime}
                        {...field}
                        {...fieldState}
                        placeholder=""
                        isDisabled={!watchDate}
                      />
                    )}
                    rules={{
                      required: "กรุณาเลือกรอบเวลา",
                    }}
                  />
                  <FormErrorMessage>
                    {errors.time && errors.time.message}
                  </FormErrorMessage>
                </FormControl>
                {isShow && (
                  <Center mx={4} height="40px">
                    <Divider
                      orientation="vertical"
                      borderColor="#000000"
                      height="20px"
                    />
                  </Center>
                )}
              </Flex>
              <FormControl
                isInvalid={!!errors.busLineName}
                w={{ base: "100%", md: "20%" }}
                mr={{ base: 0, md: 4 }}
                mb={{ base: 2, md: 0 }}
                height={{
                  base: "inherit",
                  md: !!errors.date || !!errors.time ? "99px" : "100%",
                }}
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
                      isDisabled={!watchDate}
                    />
                  )}
                />
                <FormErrorMessage>
                  {errors.busLineName && errors.busLineName.message}
                </FormErrorMessage>
              </FormControl>
            </Flex>
            <Flex w={"100%"} mb={{ base: 4, md: 10 }}>
              <FormControl
                isInvalid={!!errors.bookingVehicleId}
                w={{ base: "100%", md: "20%" }}
                mr={{ base: 0, md: 4 }}
              >
                <FormLabel htmlFor="bookingVehicleId">เลือกรถ</FormLabel>
                <Controller
                  name="bookingVehicleId"
                  control={control}
                  render={({ field }) => (
                    <SelectInput
                      options={listOfBookingVehicle}
                      {...field}
                      placeholder=""
                      isClearable
                      isDisabled={!watchDate || !watchTime || !watchBusLine}
                    />
                  )}
                />
                <FormErrorMessage>
                  {errors.bookingVehicleId && errors.bookingVehicleId.message}
                </FormErrorMessage>
              </FormControl>
            </Flex>
            <Flex mb={10}>
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
                _focus={{ boxShadow: "none" }}
                isDisabled={
                  !(
                    dataForDownload &&
                    data &&
                    data?.attendanceDetails &&
                    data?.attendanceDetails.length > 0
                  )
                }
                onClick={() => {
                  download(dataForDownload)
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
            ) : data &&
              data?.attendanceDetails &&
              data?.attendanceDetails.length > 0 ? (
              data?.attendanceDetails.map((attendanceDetail) =>
                attendanceDetail?.busLines &&
                attendanceDetail?.busLines.length > 0 ? (
                  attendanceDetail.busLines.map((busLine, busLineIndex) => (
                    <Box key={busLineIndex} mb={10}>
                      <Flex flexDirection="column" mb={10}>
                        <Text
                          color="primary.500"
                          fontWeight={600}
                          fontSize="24px"
                        >
                          วันที่ :{" "}
                          {DateTime.fromJSDate(
                            new Date(`${data?.date}`)
                          ).toFormat("dd/MM/y")}
                        </Text>
                        <Text
                          color="primary.500"
                          fontWeight={600}
                          fontSize="24px"
                        >
                          รอบเวลา : {attendanceDetail.time} น.
                        </Text>
                        <Text
                          color="primary.500"
                          fontWeight={600}
                          fontSize="24px"
                        >
                          สายรถ : {busLine.busLineName}
                        </Text>
                      </Flex>
                      {busLine?.vehicles && busLine?.vehicles.length > 0 ? (
                        busLine.vehicles.map((vehicle, vehicleIndex) => (
                          <Box w="100%" mb={6} key={vehicleIndex}>
                            <Text fontSize="20px" fontWeight={600} mb={4}>
                              {vehicle.vehicleType}({vehicle.totalPassenger}/
                              {vehicle.seatCapacity}) /{" "}
                              {vehicle.licensePlate
                                ? vehicle.licensePlate
                                : "-"}
                            </Text>
                            <ReportTable
                              resources="employeeAttendance"
                              columns={columns}
                              data={vehicle?.passengers}
                              pageSize={
                                vehicle?.passengers
                                  ? vehicle?.passengers.length
                                  : 0
                              }
                            />
                          </Box>
                        ))
                      ) : (
                        <ReportTable
                          resources="employeeAttendance"
                          columns={columns}
                          data={[]}
                          pageSize={0}
                        />
                      )}
                    </Box>
                  ))
                ) : (
                  <ReportTable
                    key={"employeeAttendance"}
                    resources="employeeAttendance"
                    columns={columns}
                    data={[]}
                    pageSize={0}
                  />
                )
              )
            ) : (
              <ReportTable
                resources="employeeAttendance"
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

export default EmployeeAttendanceList
