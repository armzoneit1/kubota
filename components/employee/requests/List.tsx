/* eslint-disable react/display-name */
import {
  Container,
  Box,
  Text,
  Button,
  Flex,
  FormErrorMessage,
  FormLabel,
  FormControl,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Link,
  Center,
  useDisclosure,
  Spinner,
} from "@chakra-ui/react"
import { useState, useMemo, useEffect } from "react"
import Head from "next/head"
import { useForm, Controller } from "react-hook-form"
import SelectInput from "../../input/SelectInput"
import {
  MdExpandMore,
  MdExpandLess,
  MdVisibility,
  MdEdit,
} from "react-icons/md"
import NextLink from "next/link"
import { DateTime } from "luxon"
import Datepicker from "../../input/Datepicker"
import Table from "../Table"
import get from "lodash/get"
import RequestModal from "./RequestModal"
import RequestEditModal from "./RequestEditModal"
import {
  ListOfRequestDataTypes,
  ListOfBookingStatusDataTypes,
  ListOfBusLineDataTypes,
  ListOfBusStopDataTypes,
  ListOfPassengerDataTypes,
  ListOfPeriodOfDayDataTypes,
  ListOfTimeDataTypes,
} from "../../../data-hooks/requests/types"
import { AiOutlineCloseCircle } from "react-icons/ai"
import { SubordinateDataTypes } from "../../../data-hooks/subordinates/types"
import filterLodash from "lodash/filter"
import { useAccountMe } from "../../../providers/account-me-provider"
import { RouteGuardContextType } from "../../../contexts/route-guard-context"

enum Status {
  processing = "กำลังจัดรถ",
  pending = "รอการจัดรถ",
  cancelledByAdmin = "ถูกยกเลิก",
  cancelledByEmployee = "ยกเลิกโดยพนักงาน",
  completed = "สำเร็จ",
  deprecated = "เลิกใช้งาน",
}

const EditButton = ({
  resources,
  id,
  data,
  subordinates,
  me,
}: {
  resources: string | null
  id: number | null
  data: any | null
  subordinates: SubordinateDataTypes[]
  me: RouteGuardContextType
}) => {
  const { isOpen, onClose, onOpen } = useDisclosure()
  return data.status === "pending" &&
    (filterLodash(subordinates, {
      employeeNo: data?.employeeNo,
    }).length > 0 ||
      me?.myHrEmployee?.employeeNo === data?.employeeNo) ? (
    <>
      <RequestEditModal
        isOpen={isOpen}
        onClose={onClose}
        bookingId={data?.id}
        periodOfDay={data?.periodOfDay}
      />
      <IconButton
        variant="unstyled"
        color="#00A5A8"
        aria-label="edit"
        fontSize="24px"
        icon={<MdEdit />}
        _focus={{ boxShadow: "none" }}
        onClick={onOpen}
      />
    </>
  ) : (
    <>
      <RequestModal
        isOpen={isOpen}
        onClose={onClose}
        bookingId={data?.id}
        periodOfDay={data?.periodOfDay}
      />
      <IconButton
        variant="unstyled"
        color="#00A5A8"
        aria-label="view"
        fontSize="24px"
        icon={<MdVisibility />}
        _focus={{ boxShadow: "none" }}
        onClick={onOpen}
      />
    </>
  )
}

export type RequestList = {
  setPage?: React.Dispatch<React.SetStateAction<number>>
  setSort?: React.Dispatch<
    React.SetStateAction<{ id: string; desc: boolean | undefined } | undefined>
  >
  sortBy: { id: string; desc: boolean | undefined } | undefined
  isLoading: boolean
  currentPage?: number
  pageCount?: number
  setFilter: React.Dispatch<
    React.SetStateAction<{
      startDate: string
      endDate: string
      periodOfDay: string
      time: string
      passenger: string
      bookingStatus: string
      busLine: string
      busStop: string
    }>
  >
  filter: {
    startDate: string
    endDate: string
    periodOfDay: string
    time: string
    passenger: string
    bookingStatus: string
    busLine: string
    busStop: string
  }
  setFilterOptions: React.Dispatch<
    React.SetStateAction<{
      startDate: string
      endDate: string
      periodOfDay: string
    }>
  >
  filterOptions: {
    startDate: string
    endDate: string
    periodOfDay: string
  }
  listOfBookingStatus: ListOfBookingStatusDataTypes | undefined
  listOfBusLine: ListOfBusLineDataTypes[] | undefined
  listOfBusStop: ListOfBusStopDataTypes[] | undefined
  listOfPassenger: ListOfPassengerDataTypes[] | undefined
  listOfTime: ListOfTimeDataTypes[] | undefined
  listOfPeriodOfDay: ListOfPeriodOfDayDataTypes[] | undefined
  data: ListOfRequestDataTypes[] | undefined
  isFetching: boolean
  subordinates: SubordinateDataTypes[]
}

const RequestList = ({
  data,
  isLoading,
  listOfBookingStatus,
  listOfPeriodOfDay,
  listOfBusLine,
  listOfBusStop,
  listOfPassenger,
  listOfTime,
  filter,
  setFilter,
  sortBy,
  currentPage,
  pageCount,
  setPage,
  setSort,
  setFilterOptions,
  filterOptions,
  isFetching,
  subordinates,
}: RequestList) => {
  const [startDate, setStartDate] = useState<any>(null)
  const [endDate, setEndDate] = useState<any>(null)
  const me = useAccountMe()

  const handleSetStartDate = (date: any) => {
    setStartDate(date)
  }

  const handleSetEndDate = (date: any) => {
    setEndDate(date)
  }

  useEffect(() => {
    if (filter.startDate) {
      setStartDate(filter.startDate ? new Date(filter.startDate) : null)
    }
    if (filter.endDate) {
      setEndDate(filter.endDate ? new Date(filter.endDate) : null)
    }
  }, [filter.startDate, filter.endDate])

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    control,
    watch,
    setValue,
    trigger,
  } = useForm({
    defaultValues: {
      date: {
        value: "currentMonth",
        label: "เดือนปัจจุบัน",
      },
      startDate: filter.startDate ? new Date(filter.startDate) : null,
      endDate: filter.endDate ? new Date(filter.endDate) : null,
      periodOfDay: null,
      time: null,
      passenger: null,
      bookingStatus: null,
      busLine: null,
      busStop: null,
    },
  })

  const watchStartDate = watch("startDate")
  const watchEndDate = watch("endDate")
  const watchDate = watch("date")
  const watchPeriodOfDay = watch("periodOfDay")

  useEffect(() => {
    if (watchStartDate && watchEndDate) {
      setFilterOptions((prevState) => ({
        ...prevState,
        startDate: DateTime.fromJSDate(watchStartDate).toFormat("y-MM-dd"),
        endDate: DateTime.fromJSDate(watchEndDate).toFormat("y-MM-dd"),
      }))
      setValue("passenger", null)
      setValue("busLine", null)
      setValue("busStop", null)
    } else {
      setFilterOptions((prevState) => ({
        ...prevState,
        startDate: "",
        endDate: "",
      }))
      setValue("passenger", null)
      setValue("busLine", null)
      setValue("busStop", null)
    }
  }, [watchStartDate, watchEndDate])

  useEffect(() => {
    if (watchPeriodOfDay) {
      const periodOfDay = get(watchPeriodOfDay, "value")
      setFilterOptions((prevState) => ({
        ...prevState,
        periodOfDay: `${periodOfDay}`,
      }))
      setValue("time", null)
    } else {
      setFilterOptions((prevState) => ({
        ...prevState,
        periodOfDay: "",
      }))
      setValue("time", null)
    }
  }, [watchPeriodOfDay])

  useEffect(() => {
    if (watchDate) {
      const currentMonth = new Date().getMonth()
      const currentYear = new Date().getFullYear()
      const currentDay = new Date()
      const firstDayOfcurrentMonth = new Date(currentYear, currentMonth, 1)
      const lastDayOfcurrentMonth = new Date(currentYear, currentMonth + 1, 0)
      const date = get(watchDate, "value")
      if (date === "today") {
        setFilterOptions((prevState) => ({
          ...prevState,
          startDate: DateTime.fromJSDate(currentDay).toFormat("y-MM-dd"),
          endDate: DateTime.fromJSDate(currentDay).toFormat("y-MM-dd"),
        }))
        setValue("passenger", null)
        setValue("busLine", null)
        setValue("busStop", null)
      } else if (date === "currentMonth") {
        setFilterOptions((prevState) => ({
          ...prevState,
          startDate: DateTime.fromJSDate(firstDayOfcurrentMonth).toFormat(
            "y-MM-dd"
          ),
          endDate: DateTime.fromJSDate(lastDayOfcurrentMonth).toFormat(
            "y-MM-dd"
          ),
        }))
        setValue("passenger", null)
        setValue("busLine", null)
        setValue("busStop", null)
      } else if (date === "nextMonth") {
        setFilterOptions((prevState) => ({
          ...prevState,
          startDate: DateTime.fromJSDate(
            new Date(currentYear, currentMonth === 11 ? 0 : currentMonth + 1, 1)
          ).toFormat("y-MM-dd"),
          endDate: DateTime.fromJSDate(
            new Date(currentYear, currentMonth === 11 ? 1 : currentMonth + 2, 0)
          ).toFormat("y-MM-dd"),
        }))
        setValue("passenger", null)
        setValue("busLine", null)
        setValue("busStop", null)
      } else if (date === "previousMonth") {
        setFilterOptions((prevState) => ({
          ...prevState,
          startDate: DateTime.fromJSDate(
            new Date(currentYear, currentMonth === 0 ? 11 : currentMonth - 1, 1)
          ).toFormat("y-MM-dd"),
          endDate: DateTime.fromJSDate(
            new Date(currentYear, currentMonth === 0 ? 12 : currentMonth, 0)
          ).toFormat("y-MM-dd"),
        }))
        setValue("passenger", null)
        setValue("busLine", null)
        setValue("busStop", null)
      }
    }
  }, [watchDate])

  const columns = useMemo(
    () => [
      {
        Header: "วัน/เดือน/ปี",
        accessor: "date",
        Cell: ({ value }: any) => (
          <Flex flexDirection="column">
            <Text>
              {DateTime.fromJSDate(new Date(value)).toFormat("dd/MM/y", {
                locale: "th",
              })}
            </Text>
            <Text>
              {DateTime.fromJSDate(new Date(value)).toFormat("(ccc)", {
                locale: "th",
              })}
            </Text>
          </Flex>
        ),
        minWidth: { base: 140, lg: "unset" },
        width: "5%",
      },
      {
        Header: "ชื่อพนักงาน",
        accessor: "firstName",
        disableSortBy: true,
        Cell: ({ value, row }: any) =>
          `${row.original.prefixName}${row.original.firstName} ${row.original.lastName}`,
        minWidth: { base: 170, lg: "unset" },
        width: "23%",
      },
      {
        Header: "สถานะการจอง",
        accessor: "status",
        disableSortBy: true,
        Cell: ({ value }: any) =>
          get(Status, value) ? get(Status, value) : "-",
        minWidth: { base: 150, lg: "unset" },
        width: "13%",
      },
      {
        Header: "เวลา / รอบ",
        accessor: "time",
        disableSortBy: true,
        Cell: ({ value, row }: any) => (
          <Flex flexDirection="column">
            <Text>{value}</Text>
            <Text>
              {row.original.periodOfDay === "morning" ? "รอบไป" : "รอบกลับ"}
            </Text>
          </Flex>
        ),
        minWidth: { base: 120, lg: "unset" },
        width: "11%",
      },
      {
        Header: "จุดจอด",
        accessor: "busStopName",
        disableSortBy: true,
        minWidth: { base: 130, lg: "unset" },
        width: "12%",
      },
      {
        Header: "สายรถ",
        accessor: "busLineName",
        disableSortBy: true,
        Cell: ({ value }: any) => (value ? value : "-"),
        minWidth: { base: 130, lg: "unset" },
        width: "11%",
      },
      {
        Header: "ข้อมูลรถ",
        accessor: "vehicleType",
        disableSortBy: true,
        Cell: ({ row }: any) => (
          <Flex flexDirection="column">
            <Text>
              {row?.original?.vehicleType
                ? `${row.original.vehicleType ?? "-"}`
                : "-"}
            </Text>
            <Text>{`(${
              row.original.licensePlate ? row.original.licensePlate : "-"
            })`}</Text>
          </Flex>
        ),
        minWidth: { base: 130, lg: "unset" },
        width: "9%",
      },
      {
        Header: "ข้อมูลคนขับ",
        accessor: "driverFirstName",
        disableSortBy: true,
        Cell: ({ row }: any) => (
          <Flex flexDirection="column">
            <Text>
              {row?.original?.driverFirstName
                ? `${row?.original?.driverFirstName ?? "-"} ${
                    row?.original?.driverLastName ?? "-"
                  }`
                : "-"}
            </Text>
            <Text>{row?.original?.driverMobileNo ?? "-"}</Text>
          </Flex>
        ),
        minWidth: { base: 170, lg: "unset" },
        width: "25%",
      },
      {
        Header: "ID การจอง",
        accessor: "requestId",
        Cell: ({ value }: any) => (
          <NextLink href={`/employee/requests/requestId/${value}`} passHref>
            <Link _hover={{}} _focus={{}}>
              <Text color="#00A5A8" cursor="pointer">
                {value}
              </Text>
            </Link>
          </NextLink>
        ),
        minWidth: {
          base: 24,
        },
        width: "10%",
      },
    ],
    []
  )

  function onSubmit(values: any) {
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    const currentDay = new Date()
    const firstDayOfcurrentMonth = new Date(currentYear, currentMonth, 1)
    const lastDayOfcurrentMonth = new Date(currentYear, currentMonth + 1, 0)

    const date = get(values, "date.value")

    if (date === "today") {
      values.startDate = currentDay
      values.endDate = currentDay
    } else if (date === "currentMonth") {
      values.startDate = firstDayOfcurrentMonth
      values.endDate = lastDayOfcurrentMonth
    } else if (date === "nextMonth") {
      values.startDate = new Date(
        currentMonth === 11 ? currentYear + 1 : currentYear,
        currentMonth === 11 ? 0 : currentMonth + 1,
        1
      )
      values.endDate = new Date(
        currentMonth === 11 ? currentYear + 1 : currentYear,
        currentMonth === 11 ? 1 : currentMonth + 2,
        0
      )
    } else if (date === "previousMonth") {
      values.startDate = new Date(
        currentMonth === 0 ? currentYear - 1 : currentYear,
        currentMonth === 0 ? 11 : currentMonth - 1,
        1
      )
      values.endDate = new Date(
        currentMonth === 0 ? currentYear - 1 : currentYear,
        currentMonth === 0 ? 11 : currentMonth,
        0
      )
    }

    setFilter({
      startDate: DateTime.fromJSDate(values?.startDate).toFormat("y-MM-dd"),
      endDate: DateTime.fromJSDate(values?.endDate).toFormat("y-MM-dd"),
      periodOfDay: values?.periodOfDay?.value
        ? values?.periodOfDay.value
        : null,
      time: values?.time?.value ? values?.time.value : null,
      passenger: values?.passenger?.value ? values?.passenger.value : null,
      bookingStatus: values?.bookingStatus?.value
        ? values?.bookingStatus.value
        : null,
      busLine: values?.busLine?.value ? values?.busLine.value : null,
      busStop: values?.busStop?.value ? values?.busStop.value : null,
    })
    if (setPage) setPage(1)
  }

  return (
    <>
      <Head>
        <title>จองรถ</title>
        <meta name="description" content="reservation" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container
        minW="100%"
        minHeight="100%"
        paddingInlineStart={{ base: 2, md: 0 }}
        paddingInlineEnd={{ base: 2, md: 0 }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex w="100%" justifyContent="space-between" mb={10}>
            <Text fontSize="32px" fontWeight={600}>
              ค้นหาข้อมูลการจองรถ
            </Text>
            <Menu>
              {({ isOpen }) => (
                <>
                  <MenuButton
                    as={Button}
                    _focus={{ boxShadow: "none" }}
                    rightIcon={
                      isOpen ? (
                        <MdExpandLess fontSize="20px" />
                      ) : (
                        <MdExpandMore fontSize="20px" />
                      )
                    }
                  >
                    จองรถ
                  </MenuButton>
                  <MenuList
                    borderColor="#B2CCCC"
                    borderRadius="6px"
                    p="8px"
                    minWidth="150px"
                  >
                    <NextLink
                      href="/employee/requests/reservation/morning"
                      passHref
                    >
                      <Link _focus={{}} _hover={{}}>
                        <MenuItem
                          _hover={{
                            bgColor: "#D4E3E3",
                            borderRadius: "6px",
                          }}
                          _active={{ background: "none" }}
                          _focus={{ background: "none" }}
                        >
                          จองรอบไป
                        </MenuItem>
                      </Link>
                    </NextLink>
                    <NextLink
                      href="/employee/requests/reservation/evening"
                      passHref
                    >
                      <Link _focus={{}} _hover={{}}>
                        <MenuItem
                          _hover={{
                            bgColor: "#D4E3E3",
                            borderRadius: "6px",
                          }}
                          _active={{ background: "none" }}
                          _focus={{ background: "none" }}
                        >
                          จองรอบกลับ
                        </MenuItem>
                      </Link>
                    </NextLink>
                  </MenuList>
                </>
              )}
            </Menu>
          </Flex>
          <Flex
            alignItems={{ base: "normal", md: "flex-end" }}
            w="100%"
            mb={{ base: 0, md: 10 }}
            flexDirection={{ base: "column", md: "row" }}
          >
            <Flex w={{ base: "100%", md: "30%" }} alignItems={"flex-end"}>
              {watchDate && watchDate?.value === "custom" && (
                <>
                  <Box w="50%" mr={{ base: 2, md: 4 }} mb={{ base: 4, md: 0 }}>
                    <FormLabel htmlFor="startDate">เลือกวัน</FormLabel>
                    <Controller
                      name="startDate"
                      control={control}
                      render={({ field, fieldState }) => (
                        <Datepicker
                          date={startDate}
                          // setDate={setStartDate}
                          customOnChange={true}
                          field={field}
                          fieldState={fieldState}
                          onChange={(date: any) => {
                            field.onChange(date)
                            handleSetStartDate(date)
                            trigger()
                          }}
                        />
                      )}
                      rules={{
                        required: "กรุณาเลือกวันที่เริ่มต้น",
                        validate: (value) => {
                          if (value && watchEndDate && value > watchEndDate) {
                            return "วันเริ่มต้นมากกว่าวันสิ้นสุด"
                          }

                          return
                        },
                      }}
                    />
                  </Box>
                  <Box w="50%" mb={{ base: 4, md: 0 }} mr={{ base: 2, md: 4 }}>
                    <Controller
                      name="endDate"
                      control={control}
                      render={({ field, fieldState }) => (
                        <Datepicker
                          date={endDate}
                          // setDate={setEndDate}
                          customOnChange={true}
                          field={field}
                          fieldState={fieldState}
                          onChange={(date: any) => {
                            field.onChange(date)
                            handleSetEndDate(date)
                            trigger()
                          }}
                        />
                      )}
                      rules={{
                        required: "กรุณาเลือกวันที่สิ้นสุด",
                        validate: (value) => {
                          if (
                            value &&
                            watchStartDate &&
                            value < watchStartDate
                          ) {
                            return "วันสิ้นสุดน้อยกว่าวันเริ่มต้น"
                          }

                          return
                        },
                      }}
                    />
                  </Box>
                  <Flex
                    height={{ base: "72px", md: "inherit" }}
                    alignItems="center"
                  >
                    <IconButton
                      variant="unstyled"
                      aria-label="close"
                      fontSize="24px"
                      icon={<AiOutlineCloseCircle />}
                      _focus={{ boxShadow: "none" }}
                      onClick={() => {
                        setValue("date", {
                          value: "currentMonth",
                          label: "เดือนปัจจุบัน",
                        })
                      }}
                    />
                  </Flex>
                </>
              )}
              {!(watchDate?.value === "custom") && (
                <FormControl
                  isInvalid={!!errors.time}
                  w={"100%"}
                  mb={{ base: 4, md: 0 }}
                  mr={{ base: 2, md: 4 }}
                >
                  <FormLabel htmlFor="date">วัน/เดือน/ปี</FormLabel>
                  <Controller
                    name="date"
                    control={control}
                    render={({ field }) => (
                      <SelectInput
                        options={[
                          { value: "today", label: "วันนี้" },
                          { value: "currentMonth", label: "เดือนปัจจุบัน" },
                          { value: "nextMonth", label: "เดือนถัดไป" },
                          { value: "previousMonth", label: "เดือนก่อนหน้า" },
                          { value: "custom", label: "กำหนดเอง" },
                        ]}
                        {...field}
                        placeholder=""
                      />
                    )}
                  />
                  <FormErrorMessage>
                    {errors.time && errors.time.message}
                  </FormErrorMessage>
                </FormControl>
              )}
            </Flex>
            <Flex
              w={{ base: "100%", md: "70%" }}
              alignItems={{ base: "flex-start", md: "flex-end" }}
              flexDirection={{ base: "column", md: "row" }}
            >
              <Flex width={{ base: "100%", md: "40%" }}>
                <FormControl
                  isInvalid={!!errors.periodOfDay}
                  w={"50%"}
                  mb={{ base: 4, md: 0 }}
                  mr={{ base: 2, md: 4 }}
                >
                  <FormLabel htmlFor="periodOfDay">รอบ</FormLabel>
                  <Controller
                    name="periodOfDay"
                    control={control}
                    render={({ field }) => (
                      <SelectInput
                        options={listOfPeriodOfDay}
                        {...field}
                        placeholder=""
                        isClearable
                      />
                    )}
                  />
                  <FormErrorMessage>
                    {errors.periodOfDay && errors.periodOfDay.message}
                  </FormErrorMessage>
                </FormControl>
                <FormControl
                  isInvalid={!!errors.time}
                  w={"50%"}
                  mb={{ base: 4, md: 0 }}
                  mr={{ base: 2, md: 4 }}
                >
                  <FormLabel htmlFor="time">เวลา</FormLabel>
                  <Controller
                    name="time"
                    control={control}
                    render={({ field, fieldState }) => (
                      <SelectInput
                        options={listOfTime}
                        {...field}
                        {...fieldState}
                        placeholder=""
                        isClearable
                        isDisabled={!watchPeriodOfDay}
                      />
                    )}
                  />
                  <FormErrorMessage>
                    {errors.time && errors.time.message}
                  </FormErrorMessage>
                </FormControl>
              </Flex>
              <Flex width={{ base: "100%", md: "60%" }}>
                <FormControl
                  isInvalid={!!errors.passenger}
                  w={{ base: "50%", md: "60%" }}
                  mb={{ base: 4, md: 0 }}
                  mr={{ base: 2, md: 4 }}
                >
                  <FormLabel htmlFor="passenger">ผู้ใช้บริการ</FormLabel>
                  <Controller
                    name="passenger"
                    control={control}
                    render={({ field, fieldState }) => (
                      <SelectInput
                        options={listOfPassenger}
                        {...field}
                        {...fieldState}
                        placeholder=""
                        isClearable
                      />
                    )}
                  />
                  <FormErrorMessage>
                    {errors.passenger && errors.passenger.message}
                  </FormErrorMessage>
                </FormControl>
                <FormControl
                  isInvalid={!!errors.bookingStatus}
                  w={{ base: "50%", md: "40%" }}
                  mb={{ base: 4, md: 0 }}
                  mr={{ base: 2, md: 4 }}
                >
                  <FormLabel htmlFor="bookingStatus">สถานะ</FormLabel>
                  <Controller
                    name="bookingStatus"
                    control={control}
                    render={({ field, fieldState }) => (
                      <SelectInput
                        options={listOfBookingStatus}
                        {...field}
                        {...fieldState}
                        placeholder=""
                        isClearable
                      />
                    )}
                  />
                  <FormErrorMessage>
                    {errors.bookingStatus && errors.bookingStatus.message}
                  </FormErrorMessage>
                </FormControl>
              </Flex>
            </Flex>
          </Flex>
          <Flex w="100%" alignItems="flex-end" mb={10}>
            <FormControl
              isInvalid={!!errors.busLine}
              w={{ base: "50%", md: "20%" }}
              mr={{ base: 2, md: 4 }}
            >
              <FormLabel htmlFor="busLine">สายรถ</FormLabel>
              <Controller
                name="busLine"
                control={control}
                render={({ field, fieldState }) => (
                  <SelectInput
                    options={listOfBusLine}
                    {...field}
                    {...fieldState}
                    placeholder=""
                    isClearable
                  />
                )}
              />
              <FormErrorMessage>
                {errors.busLine && errors.busLine.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl
              isInvalid={!!errors.busStop}
              w={{ base: "50%", md: "20%" }}
              mr={{ base: 2, md: 4 }}
            >
              <FormLabel htmlFor="busStop">จุดจอด</FormLabel>
              <Controller
                name="busStop"
                control={control}
                render={({ field, fieldState }) => (
                  <SelectInput
                    options={listOfBusStop}
                    {...field}
                    {...fieldState}
                    placeholder=""
                    isClearable
                  />
                )}
              />
              <FormErrorMessage>
                {errors.busStop && errors.busStop.message}
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
                  <path d="M8.5 18H12" stroke="#00A5A8" strokeLinecap="round" />
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
        </form>
        <Box mt={10}>
          {isLoading || !data ? (
            <Flex
              alignItems="center"
              width="100%"
              height="20vh"
              justifyContent="center"
            >
              <Center>
                <Spinner size="xl" color="primary.500" />
              </Center>
            </Flex>
          ) : (
            <Table
              resources="requests"
              columns={columns}
              data={data ? data : []}
              pageSize={30}
              editButton={
                <EditButton
                  resources={null}
                  id={null}
                  data={null}
                  subordinates={subordinates}
                  me={me}
                />
              }
              nullText="ยังไม่มีข้อมูลการจองรถ"
              setPage={setPage}
              setSort={setSort}
              pageCount={pageCount}
              currentPage={currentPage}
              sortBy={sortBy}
              paddingEditAndDelete="16px 10px"
            />
          )}
        </Box>
      </Container>
    </>
  )
}

export default RequestList
