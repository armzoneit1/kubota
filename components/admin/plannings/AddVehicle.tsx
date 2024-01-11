import {
  Box,
  Button,
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
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Link,
} from "@chakra-ui/react"
import { useRouter } from "next/router"
import React, { useState, useEffect, useMemo } from "react"
import { useForm, Controller, useFieldArray } from "react-hook-form"
import SelectInput from "../../input/SelectInput"
import AsyncSelectInput from "../../input/AsyncSelectInput"
import { MdMoreVert } from "react-icons/md"
import Head from "next/head"
import { AddIcon } from "@chakra-ui/icons"
import NextLink from "next/link"
import {
  ListVehicleTypes,
  ListBookingPassenger,
} from "../../../data-hooks/busArrangements/types"
import { BusLineDataTypes } from "../../../data-hooks/busLines/types"
import { ScheduleDataTypes } from "../../../data-hooks/schedules/types"
import get from "lodash/get"
import uniqBy from "lodash/uniqBy"
import filter from "lodash/filter"
import findIndex from "lodash/findIndex"

type AddVehicleProps = {
  periodOfDay: "morning" | "evening"
  vehicleTypes: ListVehicleTypes[]
  bookingPassengers: ListBookingPassenger[]
  onSubmit: (values: any) => void
  isLoading: boolean
  rounds: ScheduleDataTypes[] | undefined
  busLines: BusLineDataTypes[] | undefined
}

type GroupOptions = {
  label: string
  options: {
    value: number
    label: string
  }[]
}

const AddVehicle = ({
  periodOfDay,
  vehicleTypes,
  bookingPassengers,
  onSubmit: submit,
  isLoading,
  rounds,
  busLines,
}: AddVehicleProps) => {
  const router = useRouter()
  const vehicleTypeOptions = useMemo(
    () =>
      vehicleTypes
        ? vehicleTypes.map((vehicle) => ({
            value: vehicle.id,
            label: `${vehicle.vehicleTypeName} / ${vehicle.seatCapacity} ที่นั่ง (${vehicle?.transportationProviderName})`,
            seatCapacity: vehicle.seatCapacity,
          }))
        : [],
    [vehicleTypes]
  )
  const busLineOptions = useMemo(
    () =>
      busLines
        ? busLines.map((busLine) => ({
            value: busLine.id,
            label: `${busLine.name}`,
          }))
        : [],
    [busLines]
  )

  const employeeOptions = useMemo(
    () =>
      bookingPassengers
        ? bookingPassengers.reduce((acc: any, curr) => {
            if (acc.length === 0) {
              acc.push({
                label: curr.busLineName,
                options: [
                  {
                    value: curr.id,
                    label: `${curr.employeeNo} ${curr.prefixName}${curr.firstName} ${curr.lastName} / ${curr.busStopName}`,
                  },
                ],
              })
            } else {
              const filtered = filter(acc, { label: curr.busLineName })
              if (filtered.length > 0) {
                const index = findIndex(acc, { label: curr.busLineName })

                const data = [...acc]

                data[index].options.push({
                  value: curr.id,
                  label: `${curr.employeeNo} ${curr.prefixName}${curr.firstName} ${curr.lastName} / ${curr.busStopName}`,
                })

                acc = [...data]
              } else {
                acc.push({
                  label: curr.busLineName,
                  options: [
                    {
                      value: curr.id,
                      label: `${curr.employeeNo} ${curr.prefixName}${curr.firstName} ${curr.lastName} / ${curr.busStopName}`,
                    },
                  ],
                })
              }
            }
            return acc
          }, [])
        : [],
    [bookingPassengers]
  )

  const timeTableRoundOptions = useMemo(
    () =>
      rounds
        ? get(
            rounds,
            `${
              periodOfDay === "morning"
                ? "timeTableMorning"
                : "timeTableEvening"
            }`
          )?.timeTableRound.map(
            (timeTableRound: { timeTableRoundId: number; time: string }) => ({
              value: timeTableRound.timeTableRoundId,
              label: `${timeTableRound.time}`,
            })
          )
        : [],
    [rounds, periodOfDay]
  )

  const scheduleId = router.query.id
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    control,
    watch,
  } = useForm()

  const { fields, append, remove } = useFieldArray({
    control,
    name: "passengerBookingIds",
  })

  const watchTransportationProviderVehicleTypeMappingId = watch(
    "transportationProviderVehicleTypeMappingId"
  )

  useEffect(() => {
    if (watchTransportationProviderVehicleTypeMappingId) {
      if (
        fields.length >
        watchTransportationProviderVehicleTypeMappingId?.seatCapacity
      ) {
        const removes = []
        for (
          let i = +watchTransportationProviderVehicleTypeMappingId?.seatCapacity;
          i < fields.length;
          i++
        ) {
          removes.push(i)
        }
        remove(removes)
      }
    }
  }, [watchTransportationProviderVehicleTypeMappingId])

  function onSubmit(values: any) {
    const busLineId = get(values, "busLineId.value")
    const timeTableRoundId = get(values, "timeTableRoundId.value")
    const transportationProviderVehicleTypeMappingId = get(
      values,
      "transportationProviderVehicleTypeMappingId.value"
    )
    const passengerBookingIds = get(values, "passengerBookingIds")
    values.busLineId = busLineId
    values.timeTableRoundId = timeTableRoundId
    values.transportationProviderVehicleTypeMappingId = transportationProviderVehicleTypeMappingId
    values.passengerBookingIds = passengerBookingIds.map(
      (passenger: any) => passenger.employeeNo.value
    )

    submit({ scheduleId, periodOfDay, data: values })
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex flexDirection="column">
            <Flex width="100%" justifyContent="space-between" my={5}>
              <Flex justifyContent="center" flexDirection="column">
                <Text mb={3} fontSize="32px">
                  เพิ่มรถ
                </Text>
                <HStack>
                  <NextLink href={"/admin/plannings"} passHref>
                    <Link _hover={{}} _focus={{}}>
                      <Text fontStyle="italic" color="#00A5A8" cursor="pointer">
                        การจัดรถ
                      </Text>
                    </Link>
                  </NextLink>
                  <Text>{">"}</Text>
                  <NextLink
                    href={`/admin/plannings/${scheduleId}/${periodOfDay}`}
                    passHref
                  >
                    <Link _hover={{}} _focus={{}}>
                      <Text fontStyle="italic" color="#00A5A8" cursor="pointer">
                        จัดรถ
                      </Text>
                    </Link>
                  </NextLink>
                  <Text>{">"}</Text>
                  <Text fontStyle="italic">เพิ่มรถ</Text>
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
                  ข้อมูลรถที่เพิ่ม
                </Text>
              </Box>
              <Box
                bgColor="#F5F5F5"
                width={{ base: "100%", md: "80%" }}
                p={12}
                borderRadius="8px"
              >
                <Flex
                  mb={10}
                  w={{ base: "100%", md: "70%" }}
                  flexDirection={{ base: "column", md: "row" }}
                >
                  <FormControl
                    isInvalid={!!errors.busLineId}
                    w={{ base: "100%", md: "50%" }}
                    mr={{ base: 0, md: 5 }}
                    mb={{ base: 10, md: 0 }}
                  >
                    <FormLabel htmlFor="busLineId">สายรถ</FormLabel>
                    <Controller
                      name="busLineId"
                      control={control}
                      render={({ field, fieldState }) => (
                        <SelectInput
                          options={busLineOptions}
                          placeholder=""
                          {...field}
                          {...fieldState}
                        />
                      )}
                      rules={{ required: "กรุณาเลือกสายรถ" }}
                    />
                    <FormErrorMessage>
                      {errors.busLineId && errors.busLineId.message}
                    </FormErrorMessage>
                  </FormControl>
                  <FormControl
                    isInvalid={!!errors.timeTableRoundId}
                    w={{ base: "100%", md: "50%" }}
                  >
                    <FormLabel htmlFor="timeTableRoundId">เวลา</FormLabel>
                    <Controller
                      name="timeTableRoundId"
                      control={control}
                      render={({ field, fieldState }) => (
                        <SelectInput
                          options={timeTableRoundOptions}
                          placeholder=""
                          {...field}
                          {...fieldState}
                        />
                      )}
                      rules={{ required: "กรุณาเลือกเวลา" }}
                    />
                    <FormErrorMessage>
                      {errors.timeTableRoundId &&
                        errors.timeTableRoundId.message}
                    </FormErrorMessage>
                  </FormControl>
                </Flex>
                <Flex
                  mb={10}
                  w={{ base: "100%", md: "70%" }}
                  flexDirection={{ base: "column", md: "row" }}
                >
                  <FormControl
                    isInvalid={
                      !!errors.transportationProviderVehicleTypeMappingId
                    }
                    w={{ base: "100%", md: "50%" }}
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
                        />
                      )}
                      rules={{ required: "กรุณาเลือกประเภทรถ" }}
                    />
                    <FormErrorMessage>
                      {errors.transportationProviderVehicleTypeMappingId &&
                        errors.transportationProviderVehicleTypeMappingId
                          .message}
                    </FormErrorMessage>
                  </FormControl>
                  <Box w="50%" display={{ base: "none", md: "block" }}></Box>
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
                  ผู้โดยสาร
                </Text>
              </Box>
              <Box
                bgColor="#F5F5F5"
                width={{ base: "100%", md: "80%" }}
                p={12}
                borderRadius="8px"
              >
                {fields && fields.length > 0 && (
                  <Table
                    variant="unstyled"
                    mb={10}
                    w={{ base: "100%", md: "70%" }}
                  >
                    <Thead>
                      <Tr>
                        <Th pl={2} fontSize="16px" width="95%">
                          ชื่อพนักงาน
                        </Th>
                        <Th pl={2} width="5%"></Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {fields.map((field, index) => {
                        return (
                          <Tr key={index}>
                            <Td px={2}>
                              <Flex alignItems="center">
                                <Text mr={4}>{`${index + 1}.`}</Text>
                                <FormControl
                                  isInvalid={
                                    !!(
                                      errors.passengerBookingIds &&
                                      errors.passengerBookingIds[index] &&
                                      errors.passengerBookingIds[index]
                                        ?.employeeNo
                                    )
                                  }
                                  w="90%"
                                >
                                  <Controller
                                    name={`passengerBookingIds.${index}.employeeNo`}
                                    control={control}
                                    render={({ field, fieldState }) => (
                                      <SelectInput
                                        options={employeeOptions}
                                        {...field}
                                        {...fieldState}
                                        placeholder=""
                                      />
                                    )}
                                    rules={{
                                      required: "กรุณาเลือกพนักงาน",
                                    }}
                                  />
                                  <FormErrorMessage>
                                    {errors.passengerBookingIds &&
                                      errors.passengerBookingIds[index] &&
                                      errors.passengerBookingIds[index]
                                        ?.employeeNo &&
                                      errors.passengerBookingIds[index]
                                        ?.employeeNo.message}
                                  </FormErrorMessage>
                                </FormControl>
                              </Flex>
                            </Td>
                            <Td px={2} textAlign="right">
                              <Menu>
                                <MenuButton
                                  as={IconButton}
                                  icon={<MdMoreVert />}
                                  variant="ghost"
                                  fontSize="20px"
                                  color="#333333"
                                  _focus={{ boxShadow: "none" }}
                                />
                                <MenuList
                                  borderColor="#B2CCCC"
                                  borderRadius="6px"
                                  p="8px"
                                  minWidth="150px"
                                >
                                  <MenuItem
                                    _hover={{
                                      bgColor: "#D4E3E3",
                                      borderRadius: "6px",
                                    }}
                                    _active={{ background: "none" }}
                                    _focus={{ background: "none" }}
                                    onClick={() => remove(index)}
                                  >
                                    ลบ
                                  </MenuItem>
                                </MenuList>
                              </Menu>
                            </Td>
                          </Tr>
                        )
                      })}
                    </Tbody>
                  </Table>
                )}
                {watchTransportationProviderVehicleTypeMappingId?.seatCapacity ? (
                  fields.length <
                    watchTransportationProviderVehicleTypeMappingId?.seatCapacity && (
                    <Box>
                      <Button
                        onClick={() => append({ employeeNo: undefined })}
                        leftIcon={<AddIcon />}
                        _focus={{ boxShadow: "none" }}
                      >
                        เพิ่มผู้โดยสาร
                      </Button>
                    </Box>
                  )
                ) : (
                  <Box>
                    <Button
                      onClick={() => append({ employeeNo: undefined })}
                      leftIcon={<AddIcon />}
                      _focus={{ boxShadow: "none" }}
                      isDisabled={true}
                    >
                      เพิ่มผู้โดยสาร
                    </Button>
                  </Box>
                )}
              </Box>
            </Flex>
          </Flex>
        </form>
      </Container>
    </>
  )
}

export default AddVehicle
