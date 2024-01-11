import {
  Box,
  Button,
  Checkbox,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Link,
} from "@chakra-ui/react"
import { useRouter } from "next/router"
import React, { useState, useEffect, useMemo } from "react"
import { useForm, Controller } from "react-hook-form"
import ChangeVehicleModal from "./ChangeVehicleModal"
import ChangeBusStopModal from "./ChangeBusStopModal"
import ConfirmDialog from "../../ConfirmDialog"
import TextInput from "../../input/TextInput"
import SelectInput from "../../input/SelectInput"
import NextLink from "next/link"
import Head from "next/head"
import {
  BusArrangementDataTypes,
  ListBookingPassenger,
  ListVehicleTypes,
  ListDifferenceBusLine,
  ListSameBusLine,
  ListBusStopLineMapping,
} from "../../../data-hooks/busArrangements/types"
import { DateTime } from "luxon"
import filterLodash from "lodash/filter"
import hasIn from "lodash/hasIn"
import get from "lodash/get"
import omit from "lodash/omit"

type BookingVehicleEditProps = {
  data: BusArrangementDataTypes
  vehicleTypes: ListVehicleTypes[]
  deleteEmptyBookingVehicle: (values: any) => void
  isLoadingDelete: boolean
  listDifferenceBusLine: ListDifferenceBusLine[]
  listSameBusLine: ListSameBusLine[]
  listBusStopLineMapping: ListBusStopLineMapping[]
  onTransfer: (values: any) => void
  isLoadingTransfer: boolean
  onSubmit: (values: any) => void
  isLoading: boolean
  totalBookingPassengerIsNormalBusStopBySetting: number
  totalBookingPassengerIsNotNormalBusStopBySetting: number
  bookingStatus: string
}

const BookingVehicleEdit = ({
  data,
  vehicleTypes,
  deleteEmptyBookingVehicle,
  isLoadingDelete,
  listSameBusLine,
  listDifferenceBusLine,
  listBusStopLineMapping,
  onTransfer,
  isLoadingTransfer,
  onSubmit: submit,
  isLoading,
  totalBookingPassengerIsNormalBusStopBySetting,
  totalBookingPassengerIsNotNormalBusStopBySetting,
  bookingStatus,
}: BookingVehicleEditProps) => {
  const router = useRouter()
  const id = router.query.id
  const bookingVehicleId = router?.query?.bookingVehicleId
  const [isOpenConfirm, setOpenConfirm] = useState(false)
  const [selectedPassenger, setSelectedPassenger] = useState<any[]>([])

  const [selectedBusStop, setSelectedBusStop] = useState<any>({})
  const [isOpen, setOpen] = useState<boolean>(false)
  const [isOpenChangeBusStop, setOpenChangeBusStop] = useState<boolean>(false)
  const [changeVehicle, setChangeVehicle] = useState<any>({
    type: null,
    busStopId: null,
    data: {
      reservation: null,
      passengers: null,
      busLineOptions: null,
      vehicleOption: null,
    },
  })

  const vehicleTypeOptions = useMemo(
    () =>
      vehicleTypes
        ? vehicleTypes.map((vehicle) => ({
            value: vehicle?.id,
            label: `${vehicle?.vehicleTypeName} / ${vehicle?.seatCapacity} ที่นั่ง (${vehicle?.transportationProviderName})`,
          }))
        : [],
    [vehicleTypes]
  )

  const busStopLineMappingOptions = useMemo(
    () =>
      listBusStopLineMapping
        ? listBusStopLineMapping.map((busLine) => ({
            value: busLine.busStopLineMappingId,
            // label: `${busLine.busLineName}(${busLine.totalBookingPassenger}/${busLine.seatCapacity}) / (${busLine?.assignedTimeTableRound})`,
            label: busLine.name,
            // disabled: busLine.totalBookingPassenger == busLine.seatCapacity,
            // totalBookingPassenger: busLine.totalBookingPassenger,
            // seatCapacity: busLine.seatCapacity,
          }))
        : [],
    [listBusStopLineMapping]
  )

  const differenceBusLineOptions = useMemo(
    () =>
      listDifferenceBusLine
        ? listDifferenceBusLine.map((busLine) => ({
            value: busLine.bookingVehicleId,
            label: `${busLine.busLineName}(${busLine.totalBookingPassenger}/${busLine.seatCapacity}) / (${busLine?.assignedTimeTableRound})`,
            disabled: busLine.totalBookingPassenger == busLine.seatCapacity,
            totalBookingPassenger: busLine.totalBookingPassenger,
            seatCapacity: busLine.seatCapacity,
          }))
        : [],
    [listDifferenceBusLine]
  )
  const sameBusLineOptions = useMemo(
    () =>
      listSameBusLine && bookingVehicleId
        ? listSameBusLine.map((busLine) => ({
            value: busLine.bookingVehicleId,
            label: `${busLine.vehicleTypeName}(${busLine.totalBookingPassenger}/${busLine.seatCapacity}) / (${busLine?.assignedTimeTableRound})`,
            disabled:
              busLine.bookingVehicleId == +bookingVehicleId ||
              busLine.totalBookingPassenger == busLine.seatCapacity,
            totalBookingPassenger: busLine.totalBookingPassenger,
            seatCapacity: busLine.seatCapacity,
          }))
        : [],
    [listSameBusLine, bookingVehicleId]
  )

  const onOpen = (type: "all" | "busStop", busStopId?: number) => {
    if (type === "all") {
      setChangeVehicle({
        type: "all",
        busStopId: null,
        data: {
          reservation: {
            ...data,
          },
          passengers: selectedPassenger,
        },
      })
      setOpen(true)
    } else {
      setChangeVehicle({
        type: "busStop",
        busStopId: busStopId,
        data: {
          reservation: {
            ...omit(data, ["busStops"]),
            busStops: filterLodash(data?.busStops, { busStopId: busStopId }),
          },
          passengers: filterLodash(selectedPassenger, { busStopId: busStopId }),
        },
      })
      setOpen(true)
    }
  }

  const onOpenChangeBusStop = (type: "all" | "busStop", busStopId?: number) => {
    if (type === "all") {
      setChangeVehicle({
        type: "all",
        busStopId: null,
        data: {
          reservation: {
            ...data,
          },
          passengers: selectedPassenger,
        },
      })
      setOpenChangeBusStop(true)
    } else {
      setChangeVehicle({
        type: "busStop",
        busStopId: busStopId,
        data: {
          reservation: {
            ...omit(data, ["busStops"]),
            busStops: filterLodash(data?.busStops, { busStopId: busStopId }),
          },
          passengers: filterLodash(selectedPassenger, { busStopId: busStopId }),
        },
      })
      setOpenChangeBusStop(true)
    }
  }

  const onClose = () => {
    setChangeVehicle({
      type: null,
      busStopId: null,
      data: {
        reservation: null,
        passengers: null,
      },
    })
    setOpen(false)
  }

  const onCloseChangeBusStopModal = () => {
    setChangeVehicle({
      type: null,
      busStopId: null,
      data: {
        reservation: null,
        passengers: null,
      },
    })
    setOpenChangeBusStop(false)
  }

  useEffect(() => {
    if (data) {
      if (data?.busStops && data?.busStops.length > 0) {
        const initialBusStops = data?.busStops.reduce((acc: any, curr) => {
          acc = { ...acc, [curr.busStopId]: [] }
          return acc
        }, {})
        setSelectedBusStop(initialBusStops)
      }
    }
  }, [data])

  useEffect(() => {
    let selectedAll: any[] = []
    Object.keys(selectedBusStop).map((key) => {
      selectedAll = [...selectedAll, ...selectedBusStop[key]]
    })
    setSelectedPassenger(selectedAll)
  }, [selectedBusStop])

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    control,
  } = useForm({
    defaultValues: {
      date: data?.date
        ? DateTime.fromJSDate(new Date(data?.date)).toFormat("dd/MM/y")
        : null,
      busLineName:
        data?.arrangements &&
        data?.arrangements?.timeTableRounds[0]?.busLines[0]?.name,
      time: data?.arrangements && data?.arrangements?.timeTableRounds[0]?.time,
      transportationProviderVehicleTypeMappingId:
        vehicleTypeOptions &&
        data?.arrangements &&
        data?.arrangements?.timeTableRounds[0]?.busLines[0]?.arrangedVehicles[0]
          ?.transportationProviderVehicleTypeMappingId
          ? filterLodash(vehicleTypeOptions, {
              value:
                data?.arrangements?.timeTableRounds[0]?.busLines[0]
                  ?.arrangedVehicles[0]
                  ?.transportationProviderVehicleTypeMappingId,
            })
          : null,
      licensePlate: "-",
    },
  })

  const onCloseConfirm = () => {
    setOpenConfirm(false)
  }

  const onOpenConfirm = () => {
    setOpenConfirm(true)
  }

  function onSubmit(values: any) {
    const transportationProviderVehicleTypeMappingId = get(
      values,
      "transportationProviderVehicleTypeMappingId.value"
    )
      ? get(values, "transportationProviderVehicleTypeMappingId.value")
      : get(values, "transportationProviderVehicleTypeMappingId.0.value")

    submit({
      scheduleId: id,
      periodOfDay: data?.periodOfDay,
      bookingVehicleId,
      data: { transportationProviderVehicleTypeMappingId },
    })
  }

  const handleSelectPassenger = (e: any, p: any) => {
    const selected = selectedBusStop
    const passenger = JSON.parse(e.target.value)
    const filtered = selected[p.busStopId].filter(
      (user: any) => user.employeeNo === passenger.employeeNo
    )

    if (filtered && filtered.length > 0) {
      const filteredData = selected[p.busStopId].filter(
        (user: any) => user.employeeNo !== passenger.employeeNo
      )
      selected[p.busStopId] = filteredData
      setSelectedBusStop({ ...selected })
    } else {
      selected[p.busStopId] = [...selected[p.busStopId], passenger]
      setSelectedBusStop({ ...selected })
    }
  }

  const handleSelectAllPassenger = (e: any) => {
    const selected = selectedBusStop

    if (e.target?.checked) {
      const busStops = data?.busStops.reduce((acc: any, curr) => {
        const passengers: any[] = curr.passengers.map((p) => ({
          ...p,
          busStopId: curr.busStopId,
        }))
        acc = {
          ...acc,
          [curr.busStopId]: [...passengers],
        }

        return acc
      }, {})
      setSelectedBusStop(busStops)
    } else {
      if (data?.busStops && data?.busStops.length > 0) {
        const initialBusStops = data?.busStops.reduce((acc: any, curr) => {
          acc = { ...acc, [curr.busStopId]: [] }
          return acc
        }, {})
        setSelectedBusStop(initialBusStops)
      }
    }
  }

  return (
    <>
      <Head>
        <title>การจัดรถ</title>
        <meta name="description" content="planning" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container
        minHeight="80vh"
        minW="100%"
        paddingInlineStart={{ base: 2, md: 0 }}
        paddingInlineEnd={{ base: 2, md: 0 }}
      >
        <ChangeBusStopModal
          onSubmit={onTransfer}
          isLoading={isLoadingTransfer}
          isOpen={isOpenChangeBusStop}
          onClose={onCloseChangeBusStopModal}
          data={changeVehicle}
          busStopLineMappingOptions={busStopLineMappingOptions}
        />
        <ChangeVehicleModal
          isOpen={isOpen}
          onClose={onClose}
          data={changeVehicle}
          differenceBusLineOptions={differenceBusLineOptions}
          sameBusLineOptions={sameBusLineOptions}
          onSubmit={onTransfer}
          isLoading={isLoadingTransfer}
        />
        <ConfirmDialog
          title="ลบรถ"
          content={`คุณยืนยันการลบรถ สาย${
            data?.arrangements &&
            data?.arrangements?.timeTableRounds[0]?.busLines[0]?.name
          } เวลา ${
            data?.arrangements && data?.arrangements?.timeTableRounds[0]?.time
          }น. ${
            data?.arrangements &&
            data?.arrangements?.timeTableRounds[0]?.busLines[0]
              ?.arrangedVehicles[0]?.vehicleTypeName
          } (${
            data?.arrangements &&
            data?.arrangements?.timeTableRounds[0]?.busLines[0]
              ?.arrangedVehicles[0]?.passengers.length
          }/${
            data?.arrangements &&
            data?.arrangements?.timeTableRounds[0]?.busLines[0]
              ?.arrangedVehicles[0]?.seatCapacity
          }) ใช่หรือไม่ ?`}
          acceptLabel="ลบ"
          type="error"
          isOpen={isOpenConfirm}
          onClose={onCloseConfirm}
          onSubmit={() => {
            deleteEmptyBookingVehicle({
              scheduleId: id,
              periodOfDay: data?.periodOfDay,
              bookingVehicleId,
              from: "edit",
            })
          }}
          isLoading={isLoadingDelete}
        />
        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex flexDirection="column">
            <Flex width="100%" justifyContent="space-between" my={5}>
              <Flex justifyContent="center" flexDirection="column">
                <Text mb={3} fontSize="32px">
                  แก้ไข
                </Text>
                <HStack>
                  <NextLink href="/admin/plannings" passHref>
                    <Link _hover={{}} _focus={{}}>
                      <Text fontStyle="italic" color="#00A5A8" cursor="pointer">
                        การจัดรถ
                      </Text>
                    </Link>
                  </NextLink>

                  <Text>{">"}</Text>
                  <NextLink
                    href={`/admin/plannings/${id}/${data?.periodOfDay}`}
                    passHref
                  >
                    <Link _hover={{}} _focus={{}}>
                      <Text fontStyle="italic" color="#00A5A8" cursor="pointer">
                        จัดรถ
                      </Text>
                    </Link>
                  </NextLink>
                  <Text>{">"}</Text>
                  <Text fontStyle="italic">แก้ไข</Text>
                </HStack>
              </Flex>
              <Flex alignItems="center">
                <Button
                  leftIcon={
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2 2V16H16V4.828L13.172 2H2ZM1 0H14L17.707 3.707C17.8946 3.89449 17.9999 4.14881 18 4.414V17C18 17.2652 17.8946 17.5196 17.7071 17.7071C17.5196 17.8946 17.2652 18 17 18H1C0.734784 18 0.48043 17.8946 0.292893 17.7071C0.105357 17.5196 0 17.2652 0 17V1C0 0.734784 0.105357 0.48043 0.292893 0.292893C0.48043 0.105357 0.734784 0 1 0ZM9 15C8.20435 15 7.44129 14.6839 6.87868 14.1213C6.31607 13.5587 6 12.7956 6 12C6 11.2044 6.31607 10.4413 6.87868 9.87868C7.44129 9.31607 8.20435 9 9 9C9.79565 9 10.5587 9.31607 11.1213 9.87868C11.6839 10.4413 12 11.2044 12 12C12 12.7956 11.6839 13.5587 11.1213 14.1213C10.5587 14.6839 9.79565 15 9 15ZM3 3H12V7H3V3Z"
                        fill="#F9F9F9"
                      />
                    </svg>
                  }
                  colorScheme="primary"
                  _focus={{ boxShadow: "none" }}
                  isLoading={isSubmitting || isLoading}
                  type="submit"
                  mr={4}
                  isDisabled={bookingStatus === "completed"}
                >
                  บันทึก
                </Button>
              </Flex>
            </Flex>
            <Flex
              width="100%"
              minH="100%"
              flexDirection={{ base: "column", md: "row" }}
              mb={{ base: 6, md: 10 }}
            >
              <Box width={{ base: "100%", md: "20%" }} mb={{ base: 4, md: 0 }}>
                <Text fontSize="20px" fontWeight={600}>
                  ข้อมูลรถ
                </Text>
              </Box>
              <Box
                bgColor="#F5F5F5"
                width={{ base: "100%", md: "80%" }}
                p={12}
                borderRadius="8px"
              >
                <Flex mb={10} w={{ base: "100%", md: "80%" }}>
                  <Box w="50%" mr={{ base: 2, md: 5 }}>
                    <TextInput
                      name="busLineName"
                      label="สายรถ"
                      colorLabel="primary.500"
                      register={register}
                      errors={errors}
                      variant="unstyles"
                      bgColor="inherit"
                      isDisabled={true}
                      p={0}
                    />
                  </Box>
                  <Box w="50%">
                    <TextInput
                      name="date"
                      label="วันที่บริการ"
                      colorLabel="primary.500"
                      register={register}
                      errors={errors}
                      variant="unstyles"
                      bgColor="inherit"
                      isDisabled={true}
                      p={0}
                    />
                  </Box>
                </Flex>
                <Flex mb={10} w={{ base: "100%", md: "80%" }}>
                  <Box w="50%" mr={{ base: 2, md: 5 }}>
                    <TextInput
                      name="time"
                      label="รอบ"
                      colorLabel="primary.500"
                      register={register}
                      errors={errors}
                      variant="unstyles"
                      bgColor="inherit"
                      isDisabled={true}
                      p={0}
                    />
                  </Box>
                </Flex>
                <Flex mb={10} w={{ base: "100%", md: "80%" }}>
                  <FormControl
                    isInvalid={
                      !!errors.transportationProviderVehicleTypeMappingId
                    }
                    w="50%"
                    mr={{ base: 2, md: 5 }}
                  >
                    <FormLabel htmlFor="transportationProviderVehicleTypeMappingId">
                      ประเภทรถ / ความจุ
                    </FormLabel>
                    <Controller
                      name="transportationProviderVehicleTypeMappingId"
                      control={control}
                      render={({ field, fieldState }) => (
                        <SelectInput
                          options={vehicleTypeOptions}
                          placeholder=""
                          {...field}
                          {...fieldState}
                          isDisabled={bookingStatus === "completed"}
                        />
                      )}
                      rules={{ required: "กรุณาเลือกประเภทรถ" }}
                    />
                    <FormErrorMessage>
                      {errors.transportationProviderVehicleTypeMappingId &&
                        "กรุณาเลือกประเภทรถ"}
                    </FormErrorMessage>
                  </FormControl>
                  <Box w="50%">
                    <TextInput
                      name="licensePlate"
                      label="ทะเบียน"
                      register={register}
                      errors={errors}
                      isDisabled={true}
                    />
                  </Box>
                </Flex>
              </Box>
            </Flex>
            <Flex
              width="100%"
              minH="100%"
              flexDirection={{ base: "column", md: "row" }}
              mb={{ base: 6, md: 10 }}
            >
              <Box width={{ base: "100%", md: "20%" }} mb={{ base: 4, md: 0 }}>
                <Text fontSize="20px" fontWeight={600}>
                  จุดจอด
                </Text>
              </Box>
              <Flex flexDirection="column" width={{ base: "100%", md: "80%" }}>
                <Flex width="100%" justifyContent="space-between" mb={6}>
                  <Checkbox
                    size="md"
                    borderColor="#333333"
                    isDisabled={
                      !data?.busStops ||
                      data?.busStops.length === 0 ||
                      (filterLodash(data?.busStops, {
                        isNormalBusStopBySetting: true,
                      }).length === 0 &&
                        filterLodash(data?.busStops, {
                          isNormalBusStopBySetting: false,
                        }).length === 0) ||
                      bookingStatus === "completed"
                    }
                    onChange={(e) => {
                      handleSelectAllPassenger(e)
                    }}
                    isChecked={
                      selectedPassenger.length ===
                        totalBookingPassengerIsNormalBusStopBySetting +
                          totalBookingPassengerIsNotNormalBusStopBySetting &&
                      (totalBookingPassengerIsNormalBusStopBySetting !== 0 ||
                        totalBookingPassengerIsNotNormalBusStopBySetting !== 0)
                    }
                  >
                    เลือกทั้งหมด
                  </Checkbox>
                  <Flex>
                    <Button
                      variant="outline"
                      leftIcon={
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M9 15.7499C8.0527 14.9419 7.17464 14.0561 6.375 13.1017C5.175 11.6684 3.75 9.53395 3.75 7.49995C3.74948 6.46117 4.05713 5.44558 4.63402 4.58172C5.21091 3.71785 6.0311 3.04454 6.9908 2.647C7.9505 2.24945 9.00656 2.14554 10.0253 2.34842C11.0441 2.55129 11.9798 3.05183 12.714 3.7867C13.2028 4.27334 13.5903 4.8521 13.8539 5.48948C14.1176 6.12685 14.2522 6.81019 14.25 7.49995C14.25 9.53395 12.825 11.6684 11.625 13.1017C10.8254 14.0561 9.94729 14.9419 9 15.7499ZM9 5.24995C8.40326 5.24995 7.83097 5.487 7.40901 5.90896C6.98705 6.33091 6.75 6.90321 6.75 7.49995C6.75 8.09668 6.98705 8.66898 7.40901 9.09094C7.83097 9.51289 8.40326 9.74995 9 9.74995C9.59674 9.74995 10.169 9.51289 10.591 9.09094C11.0129 8.66898 11.25 8.09668 11.25 7.49995C11.25 6.90321 11.0129 6.33091 10.591 5.90896C10.169 5.487 9.59674 5.24995 9 5.24995Z"
                            fill="currentColor"
                          />
                        </svg>
                      }
                      onClick={() => {
                        onOpenChangeBusStop("all")
                      }}
                      isDisabled={
                        !data?.busStops ||
                        data?.busStops.length === 0 ||
                        selectedPassenger.length === 0 ||
                        bookingStatus === "completed"
                      }
                      _disabled={{
                        color: "#33333399",
                        fill: "#33333399",
                        cursor: "not-allowed",
                      }}
                      marginRight="20px"
                      _focus={{ boxShadow: "none" }}
                    >
                      ย้ายจุดจอด
                    </Button>
                    <Button
                      variant="outline"
                      leftIcon={
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12 6V9L16 5L12 1V4C7.58 4 4 7.58 4 12C4 13.57 4.46 15.03 5.24 16.26L6.7 14.8C6.23728 13.9395 5.99667 12.977 6 12C6 8.69 8.69 6 12 6ZM18.76 7.74L17.3 9.2C17.74 10.04 18 10.99 18 12C18 15.31 15.31 18 12 18V15L8 19L12 23V20C16.42 20 20 16.42 20 12C20 10.43 19.54 8.97 18.76 7.74Z"
                            fill="currentColor"
                          />
                        </svg>
                      }
                      onClick={() => {
                        onOpen("all")
                      }}
                      isDisabled={
                        !data?.busStops ||
                        data?.busStops.length === 0 ||
                        selectedPassenger.length === 0 ||
                        bookingStatus === "completed"
                      }
                      _disabled={{
                        color: "#33333399",
                        fill: "#33333399",
                        cursor: "not-allowed",
                      }}
                      _focus={{ boxShadow: "none" }}
                    >
                      ย้ายรถ
                    </Button>
                  </Flex>
                </Flex>
                {data?.busStops &&
                filterLodash(data?.busStops, {
                  isNormalBusStopBySetting: true,
                }).length > 0 ? (
                  filterLodash(data?.busStops, {
                    isNormalBusStopBySetting: true,
                  }).map((busStop, index) => {
                    return (
                      <Box
                        bgColor="#F5F5F5"
                        width="100%"
                        p="48px 20px"
                        borderRadius="8px"
                        key={index}
                        mb={6}
                      >
                        <Table variant="unstyled" w="100%">
                          <Thead>
                            <Tr>
                              <Th
                                fontSize={{ base: "14px", md: "16px" }}
                                fontWeight={600}
                                color="primary.500"
                                padding={{
                                  base: "10px 14px",
                                  md: "12px 24px",
                                }}
                                w="25%"
                              >
                                จุดจอด
                              </Th>
                              <Th
                                fontSize={{ base: "14px", md: "16px" }}
                                fontWeight={600}
                                color="primary.500"
                                padding={{
                                  base: "10px 14px",
                                  md: "12px 24px",
                                }}
                                w="55%"
                              >
                                ชื่อ-นามสกุล
                              </Th>
                              <Th
                                fontSize={{ base: "14px", md: "16px" }}
                                fontWeight={600}
                                color="primary.500"
                                padding={{
                                  base: "10px 14px",
                                  md: "12px 24px",
                                }}
                                w="20%"
                                textAlign="right"
                              >
                                <Flex>
                                  <Button
                                    variant="outline"
                                    leftIcon={
                                      <svg
                                        width="18"
                                        height="18"
                                        viewBox="0 0 18 18"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          d="M9 15.7499C8.0527 14.9419 7.17464 14.0561 6.375 13.1017C5.175 11.6684 3.75 9.53395 3.75 7.49995C3.74948 6.46117 4.05713 5.44558 4.63402 4.58172C5.21091 3.71785 6.0311 3.04454 6.9908 2.647C7.9505 2.24945 9.00656 2.14554 10.0253 2.34842C11.0441 2.55129 11.9798 3.05183 12.714 3.7867C13.2028 4.27334 13.5903 4.8521 13.8539 5.48948C14.1176 6.12685 14.2522 6.81019 14.25 7.49995C14.25 9.53395 12.825 11.6684 11.625 13.1017C10.8254 14.0561 9.94729 14.9419 9 15.7499ZM9 5.24995C8.40326 5.24995 7.83097 5.487 7.40901 5.90896C6.98705 6.33091 6.75 6.90321 6.75 7.49995C6.75 8.09668 6.98705 8.66898 7.40901 9.09094C7.83097 9.51289 8.40326 9.74995 9 9.74995C9.59674 9.74995 10.169 9.51289 10.591 9.09094C11.0129 8.66898 11.25 8.09668 11.25 7.49995C11.25 6.90321 11.0129 6.33091 10.591 5.90896C10.169 5.487 9.59674 5.24995 9 5.24995Z"
                                          fill="currentColor"
                                        />
                                      </svg>
                                    }
                                    onClick={() => {
                                      onOpenChangeBusStop(
                                        "busStop",
                                        busStop.busStopId
                                      )
                                    }}
                                    isDisabled={
                                      selectedBusStop &&
                                      selectedBusStop[busStop.busStopId] &&
                                      selectedBusStop[busStop.busStopId]
                                        .length === 0
                                    }
                                    _disabled={{
                                      color: "#33333399",
                                      fill: "#33333399",
                                      cursor: "not-allowed",
                                    }}
                                    marginRight="20px"
                                    _focus={{ boxShadow: "none" }}
                                  >
                                    ย้ายจุดจอด
                                  </Button>
                                  <Button
                                    variant="outline"
                                    leftIcon={
                                      <svg
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          d="M12 6V9L16 5L12 1V4C7.58 4 4 7.58 4 12C4 13.57 4.46 15.03 5.24 16.26L6.7 14.8C6.23728 13.9395 5.99667 12.977 6 12C6 8.69 8.69 6 12 6ZM18.76 7.74L17.3 9.2C17.74 10.04 18 10.99 18 12C18 15.31 15.31 18 12 18V15L8 19L12 23V20C16.42 20 20 16.42 20 12C20 10.43 19.54 8.97 18.76 7.74Z"
                                          fill="currentColor"
                                        />
                                      </svg>
                                    }
                                    _disabled={{
                                      color: "#33333399",
                                      fill: "#33333399",
                                      cursor: "not-allowed",
                                    }}
                                    isDisabled={
                                      selectedBusStop &&
                                      selectedBusStop[busStop.busStopId] &&
                                      selectedBusStop[busStop.busStopId]
                                        .length === 0
                                    }
                                    _focus={{ boxShadow: "none" }}
                                    onClick={() => {
                                      onOpen("busStop", busStop.busStopId)
                                    }}
                                  >
                                    ย้ายรถ
                                  </Button>
                                </Flex>
                              </Th>
                            </Tr>
                          </Thead>
                          <Tbody fontSize={{ base: "14px", md: "16px" }}>
                            {busStop.passengers.map((passenger, i) => {
                              return (
                                <Tr key={i}>
                                  <Td
                                    padding={{
                                      base: "12px 16px",
                                      md: "16px 24px",
                                    }}
                                    w="25%"
                                  >
                                    {i === 0 ? busStop.busStopName : ""}
                                  </Td>
                                  <Td
                                    padding={{
                                      base: "12px 16px",
                                      md: "16px 24px",
                                    }}
                                    w="55%"
                                  >
                                    {bookingStatus === "completed" ? (
                                      <Text
                                        fontSize={{
                                          base: "14px",
                                          md: "16px",
                                        }}
                                      >{`${passenger.title}${passenger.firstName} ${passenger.lastName}`}</Text>
                                    ) : (
                                      <Checkbox
                                        borderColor="#333333"
                                        value={JSON.stringify({
                                          ...passenger,
                                          busStopId: busStop.busStopId,
                                        })}
                                        onChange={(e) => {
                                          handleSelectPassenger(e, busStop)
                                        }}
                                        isChecked={
                                          hasIn(selectedBusStop, [
                                            busStop.busStopId,
                                          ])
                                            ? get(selectedBusStop, [
                                                busStop.busStopId,
                                              ]).length > 0
                                              ? Boolean(
                                                  filterLodash(
                                                    get(selectedBusStop, [
                                                      busStop.busStopId,
                                                    ]),
                                                    {
                                                      employeeNo:
                                                        passenger.employeeNo,
                                                    }
                                                  ).length > 0
                                                )
                                              : false
                                            : false
                                        }
                                        isDisabled={
                                          bookingStatus === "completed"
                                        }
                                      >
                                        <Text
                                          fontSize={{
                                            base: "14px",
                                            md: "16px",
                                          }}
                                        >{`${passenger.title}${passenger.firstName} ${passenger.lastName}`}</Text>
                                      </Checkbox>
                                    )}
                                  </Td>
                                  <Td
                                    padding={{
                                      base: "12px 16px",
                                      md: "16px 24px",
                                    }}
                                    w="20%"
                                  ></Td>
                                </Tr>
                              )
                            })}
                          </Tbody>
                        </Table>
                      </Box>
                    )
                  })
                ) : (
                  <Box
                    bgColor="#F5F5F5"
                    width="100%"
                    p="48px 20px"
                    borderRadius="8px"
                    mb={4}
                    height="160px"
                  >
                    <Text
                      color="#33333399"
                      fontWeight={300}
                      fontStyle="italic"
                      height="100%"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      ยังไม่มีข้อมูล
                    </Text>
                  </Box>
                )}
                {filterLodash(data?.busStops, {
                  isNormalBusStopBySetting: false,
                }).length === 0 &&
                  filterLodash(data?.busStops, {
                    isNormalBusStopBySetting: true,
                  }).length === 0 &&
                  bookingStatus !== "completed" && (
                    <Box p={0}>
                      <Button
                        variant="ghost"
                        colorScheme="error"
                        px={0}
                        textDecoration="underline"
                        onClick={onOpenConfirm}
                        _focus={{ boxShadow: "none" }}
                      >
                        ลบรถ
                      </Button>
                    </Box>
                  )}
              </Flex>
            </Flex>
            {data?.busStops &&
              filterLodash(data?.busStops, {
                isNormalBusStopBySetting: false,
              }).length > 0 && (
                <Flex
                  width="100%"
                  minH="100%"
                  flexDirection={{ base: "column", md: "row" }}
                  mb={{ base: 6, md: 10 }}
                >
                  <Box
                    width={{ base: "100%", md: "20%" }}
                    mb={{ base: 4, md: 0 }}
                  >
                    <Text fontSize="20px" fontWeight={600}>
                      จุดจอด (เพิ่มเติม)
                    </Text>
                  </Box>
                  <Flex
                    flexDirection="column"
                    width={{ base: "100%", md: "80%" }}
                  >
                    {filterLodash(data?.busStops, {
                      isNormalBusStopBySetting: false,
                    }).map((busStop, index) => {
                      return (
                        <Box
                          bgColor="#F5F5F5"
                          width="100%"
                          p="48px 20px"
                          borderRadius="8px"
                          key={index}
                          mb={6}
                        >
                          <Table variant="unstyled" w="100%">
                            <Thead>
                              <Tr>
                                <Th
                                  fontSize={{ base: "14px", md: "16px" }}
                                  fontWeight={600}
                                  color="primary.500"
                                  padding={{
                                    base: "10px 14px",
                                    md: "12px 24px",
                                  }}
                                  w="25%"
                                >
                                  จุดจอด
                                </Th>
                                <Th
                                  fontSize={{ base: "14px", md: "16px" }}
                                  fontWeight={600}
                                  color="primary.500"
                                  padding={{
                                    base: "10px 14px",
                                    md: "12px 24px",
                                  }}
                                  w="55%"
                                >
                                  ชื่อ-นามสกุล
                                </Th>
                                <Th
                                  fontSize={{ base: "14px", md: "16px" }}
                                  fontWeight={600}
                                  color="primary.500"
                                  padding={{
                                    base: "10px 14px",
                                    md: "12px 24px",
                                  }}
                                  w="20%"
                                  textAlign="right"
                                >
                                  <Flex>
                                    <Button
                                      variant="outline"
                                      leftIcon={
                                        <svg
                                          width="18"
                                          height="18"
                                          viewBox="0 0 18 18"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                            d="M9 15.7499C8.0527 14.9419 7.17464 14.0561 6.375 13.1017C5.175 11.6684 3.75 9.53395 3.75 7.49995C3.74948 6.46117 4.05713 5.44558 4.63402 4.58172C5.21091 3.71785 6.0311 3.04454 6.9908 2.647C7.9505 2.24945 9.00656 2.14554 10.0253 2.34842C11.0441 2.55129 11.9798 3.05183 12.714 3.7867C13.2028 4.27334 13.5903 4.8521 13.8539 5.48948C14.1176 6.12685 14.2522 6.81019 14.25 7.49995C14.25 9.53395 12.825 11.6684 11.625 13.1017C10.8254 14.0561 9.94729 14.9419 9 15.7499ZM9 5.24995C8.40326 5.24995 7.83097 5.487 7.40901 5.90896C6.98705 6.33091 6.75 6.90321 6.75 7.49995C6.75 8.09668 6.98705 8.66898 7.40901 9.09094C7.83097 9.51289 8.40326 9.74995 9 9.74995C9.59674 9.74995 10.169 9.51289 10.591 9.09094C11.0129 8.66898 11.25 8.09668 11.25 7.49995C11.25 6.90321 11.0129 6.33091 10.591 5.90896C10.169 5.487 9.59674 5.24995 9 5.24995Z"
                                            fill="currentColor"
                                          />
                                        </svg>
                                      }
                                      onClick={() => {
                                        onOpenChangeBusStop(
                                          "busStop",
                                          busStop.busStopId
                                        )
                                      }}
                                      isDisabled={
                                        (selectedBusStop &&
                                          selectedBusStop[busStop.busStopId] &&
                                          selectedBusStop[busStop.busStopId]
                                            .length === 0) ||
                                        bookingStatus === "completed"
                                      }
                                      _disabled={{
                                        color: "#33333399",
                                        fill: "#33333399",
                                        cursor: "not-allowed",
                                      }}
                                      marginRight="20px"
                                      _focus={{ boxShadow: "none" }}
                                    >
                                      ย้ายจุดจอด
                                    </Button>
                                    <Button
                                      variant="outline"
                                      leftIcon={
                                        <svg
                                          width="24"
                                          height="24"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                            d="M12 6V9L16 5L12 1V4C7.58 4 4 7.58 4 12C4 13.57 4.46 15.03 5.24 16.26L6.7 14.8C6.23728 13.9395 5.99667 12.977 6 12C6 8.69 8.69 6 12 6ZM18.76 7.74L17.3 9.2C17.74 10.04 18 10.99 18 12C18 15.31 15.31 18 12 18V15L8 19L12 23V20C16.42 20 20 16.42 20 12C20 10.43 19.54 8.97 18.76 7.74Z"
                                            fill="currentColor"
                                          />
                                        </svg>
                                      }
                                      _disabled={{
                                        color: "#33333399",
                                        fill: "#33333399",
                                        cursor: "not-allowed",
                                      }}
                                      isDisabled={
                                        (selectedBusStop &&
                                          selectedBusStop[busStop.busStopId] &&
                                          selectedBusStop[busStop.busStopId]
                                            .length === 0) ||
                                        bookingStatus === "completed"
                                      }
                                      _focus={{ boxShadow: "none" }}
                                      onClick={() => {
                                        onOpen("busStop", busStop.busStopId)
                                      }}
                                    >
                                      ย้ายรถ
                                    </Button>
                                  </Flex>
                                </Th>
                              </Tr>
                            </Thead>
                            <Tbody fontSize={{ base: "14px", md: "16px" }}>
                              {busStop.passengers.map((passenger, i) => {
                                return (
                                  <Tr key={i}>
                                    <Td
                                      padding={{
                                        base: "12px 16px",
                                        md: "16px 24px",
                                      }}
                                      w="25%"
                                    >
                                      {i === 0 ? busStop.busStopName : ""}
                                    </Td>
                                    <Td
                                      padding={{
                                        base: "12px 16px",
                                        md: "16px 24px",
                                      }}
                                      w="55%"
                                    >
                                      {bookingStatus === "completed" ? (
                                        <Text
                                          fontSize={{
                                            base: "14px",
                                            md: "16px",
                                          }}
                                        >{`${passenger.title}${passenger.firstName} ${passenger.lastName}`}</Text>
                                      ) : (
                                        <Checkbox
                                          borderColor="#333333"
                                          value={JSON.stringify({
                                            ...passenger,
                                            busStopId: busStop.busStopId,
                                          })}
                                          onChange={(e) => {
                                            handleSelectPassenger(e, busStop)
                                          }}
                                          isChecked={
                                            hasIn(selectedBusStop, [
                                              busStop.busStopId,
                                            ])
                                              ? get(selectedBusStop, [
                                                  busStop.busStopId,
                                                ]).length > 0
                                                ? Boolean(
                                                    filterLodash(
                                                      get(selectedBusStop, [
                                                        busStop.busStopId,
                                                      ]),
                                                      {
                                                        employeeNo:
                                                          passenger.employeeNo,
                                                      }
                                                    ).length > 0
                                                  )
                                                : false
                                              : false
                                          }
                                          isDisabled={
                                            bookingStatus === "completed"
                                          }
                                        >
                                          <Text
                                            fontSize={{
                                              base: "14px",
                                              md: "16px",
                                            }}
                                          >{`${passenger.title}${passenger.firstName} ${passenger.lastName}`}</Text>
                                        </Checkbox>
                                      )}
                                    </Td>
                                    <Td
                                      padding={{
                                        base: "12px 16px",
                                        md: "16px 24px",
                                      }}
                                      w="20%"
                                    ></Td>
                                  </Tr>
                                )
                              })}
                            </Tbody>
                          </Table>
                        </Box>
                      )
                    })}
                  </Flex>
                </Flex>
              )}
          </Flex>
        </form>
      </Container>
    </>
  )
}

export default BookingVehicleEdit
