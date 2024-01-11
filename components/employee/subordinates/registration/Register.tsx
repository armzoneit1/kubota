import {
  Container,
  Box,
  Text,
  Button,
  Flex,
  FormErrorMessage,
  FormLabel,
  FormControl,
  RadioGroup,
  Radio,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  HStack,
  Link,
  Checkbox,
  useToast,
} from "@chakra-ui/react"
import Head from "next/head"
import { useForm, Controller } from "react-hook-form"
import TextInput from "../../../input/TextInput"
import styles from "../../../layout/layout.module.css"
import SelectInput from "../../../input/SelectInput"
import NextLink from "next/link"
import { BusLineDataTypes } from "../../../../data-hooks/busLines/types"
import { SubordinateDataTypes } from "../../../../data-hooks/subordinates/types"
import filter from "lodash/filter"
import get from "lodash/get"
import isBoolean from "lodash/isBoolean"
import { useMemo, useState, useEffect } from "react"
import { useAccountMe } from "../../../../providers/account-me-provider"
import ConfirmDialog from "../../../ConfirmDialog"
import { AreaDataTypes } from "../../../../data-hooks/requests/types"
import uniq from "lodash/uniq"
import sortBy from "lodash/sortBy"
import isEmpty from "lodash/isEmpty"

type RegisterProps = {
  data: SubordinateDataTypes
  busLineMorning: BusLineDataTypes<boolean>[]
  busLineEvening: BusLineDataTypes<boolean>[]
  onSubmit: (values: any) => void
  isLoading: boolean
  onDeleteSubordinate: (values: any) => void
  isLoadingDelete: boolean
  areas: AreaDataTypes[]
}

const Register = ({
  data,
  busLineMorning,
  busLineEvening,
  onSubmit: submit,
  isLoading,
  onDeleteSubordinate,
  isLoadingDelete,
  areas,
}: RegisterProps) => {
  const me = useAccountMe()
  const toast = useToast()
  const toastId1 = "error_employeeUsageInfo"
  const [isOpenConfirmDelete, setOpenConfirmDelete] = useState<boolean>(false)
  const busLineMorningOptions = useMemo(
    () =>
      busLineMorning
        ? busLineMorning.map((busLine) => {
            const busStops = busLine.busStops.map((busStop) => ({
              value: busStop.busStopLineMappingId,
              label: busStop.name,
            }))
            return {
              value: busLine.id,
              label: busLine.name,
              busStops: busStops,
            }
          })
        : [],
    [busLineMorning]
  )

  const areaMorningOptions = useMemo(
    () =>
      areas && busLineMorning
        ? filter(areas, { status: true }).map((area) => {
            const busStopIds = filter(area.busStops, {
              status: true,
            }).map((busStop) => ({
              busStopId: busStop.busStopId,
              name: busStop.busStopName,
            }))

            const busStops = uniq(busStopIds).reduce((acc: any[], curr) => {
              const findBusStop = filter(busLineMorning, { status: true })
                .map((busLine) => {
                  if (curr.busStopId) {
                    const filteredBusStop = filter(busLine.busStops, {
                      busStopId: curr.busStopId,
                    })

                    if (filteredBusStop.length > 0) {
                      return {
                        value: filteredBusStop[0]?.busStopLineMappingId,
                        label: filteredBusStop[0]?.name,
                        rank: filteredBusStop[0]?.rank,
                        busStopId: filteredBusStop[0]?.busStopId,
                      }
                    }
                  }
                })
                .filter((v) => v)

              if (findBusStop.length > 0 && findBusStop[0]) {
                acc.push(findBusStop[0])
              }
              return acc
            }, [])

            return {
              value: area.id,
              label: area.name,
              busStops: sortBy(busStops, ["rank"]),
              busStopIds: busStopIds.map((b) => b.busStopId),
            }
          })
        : [],
    [areas, busLineMorning]
  )

  const busLineEveningOptions = useMemo(
    () =>
      busLineEvening
        ? busLineEvening.map((busLine) => {
            const busStops = busLine.busStops.map((busStop) => ({
              value: busStop.busStopLineMappingId,
              label: busStop.name,
            }))
            return {
              value: busLine.id,
              label: busLine.name,
              busStops: busStops,
            }
          })
        : [],
    [busLineEvening]
  )

  const areaEveningOptions = useMemo(
    () =>
      areas && busLineEvening
        ? filter(areas, { status: true }).map((area) => {
            const busStopIds = filter(area.busStops, {
              status: true,
            }).map((busStop) => ({
              busStopId: busStop.busStopId,
              name: busStop.busStopName,
            }))

            const busStops = uniq(busStopIds).reduce((acc: any[], curr) => {
              const findBusStop = filter(busLineEvening, { status: true })
                .map((busLine) => {
                  if (curr.busStopId) {
                    const filteredBusStop = filter(busLine.busStops, {
                      busStopId: curr.busStopId,
                    })

                    if (filteredBusStop.length > 0) {
                      return {
                        value: filteredBusStop[0]?.busStopLineMappingId,
                        label: filteredBusStop[0]?.name,
                        rank: filteredBusStop[0]?.rank,
                        busStopId: filteredBusStop[0]?.busStopId,
                      }
                    }
                  }
                })
                .filter((v) => v)

              if (findBusStop.length > 0 && findBusStop[0]) {
                acc.push(findBusStop[0])
              }
              return acc
            }, [])

            return {
              value: area.id,
              label: area.name,
              busStops: sortBy(busStops, ["rank"]),
              busStopIds: busStopIds.map((b) => b.busStopId),
            }
          })
        : [],
    [areas, busLineEvening]
  )
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    control,
    watch,
    setValue,
    unregister,
  } = useForm({
    defaultValues: {
      ...data,
      status: undefined,
      isDisplayDefaultForSubordinateBooking: true,
      supervisorEmployeeNo: data?.supervisorEmployeeNo
        ? data?.supervisorEmployeeNo === me.myHrEmployee.employeeNo
          ? `${me?.myHrEmployee?.title}${me?.myHrEmployee?.firstName} ${me?.myHrEmployee?.lastName}`
          : `${data?.supervisorTitle}${data?.supervisorFirstName} ${data?.supervisorLastName}`
        : data?.supervisorEmployeeNoFromApproval
        ? `${data?.supervisorTitleFromApproval}${data?.supervisorFirstNameFromApproval} ${data?.supervisorLastNameFromApproval}`
        : "-",
      phoneNo: data?.phoneNo ? data?.phoneNo : "-",
      employeeUsageInfo: {
        morning: [
          {
            dayOfWeek: "monday",
            busLineId: null,
            busStopLineMappingId: null,
          },
          {
            dayOfWeek: "tuesday",
            busLineId: null,
            busStopLineMappingId: null,
          },
          {
            dayOfWeek: "wednesday",
            busLineId: null,
            busStopLineMappingId: null,
          },
          {
            dayOfWeek: "thursday",
            busLineId: null,
            busStopLineMappingId: null,
          },
          {
            dayOfWeek: "friday",
            busLineId: null,
            busStopLineMappingId: null,
          },
          {
            dayOfWeek: "saturday",
            busLineId: null,
            busStopLineMappingId: null,
          },
          {
            dayOfWeek: "sunday",
            busLineId: null,
            busStopLineMappingId: null,
          },
        ],
        evening: [
          {
            dayOfWeek: "monday",
            busLineId: null,
            busStopLineMappingId: null,
          },
          {
            dayOfWeek: "tuesday",
            busLineId: null,
            busStopLineMappingId: null,
          },
          {
            dayOfWeek: "wednesday",
            busLineId: null,
            busStopLineMappingId: null,
          },
          {
            dayOfWeek: "thursday",
            busLineId: null,
            busStopLineMappingId: null,
          },
          {
            dayOfWeek: "friday",
            busLineId: null,
            busStopLineMappingId: null,
          },
          {
            dayOfWeek: "saturday",
            busLineId: null,
            busStopLineMappingId: null,
          },
          {
            dayOfWeek: "sunday",
            busLineId: null,
            busStopLineMappingId: null,
          },
        ],
      },
    },
  })

  useEffect(() => {
    if (errors?.employeeUsageInfo && !isEmpty(errors?.employeeUsageInfo)) {
      if (!toast.isActive(toastId1)) {
        toast({
          id: toastId1,
          description: `กรอกข้อมูลไม่ครบถ้วน`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [errors.employeeUsageInfo, toast, isSubmitting])

  const employeeUsageInfo = watch("employeeUsageInfo")

  const onSubmit = (values: any) => {
    const status: boolean | string = get(values, "status")
    const employeeUsageInfo: {
      morning: {
        dayOfWeek: string
        busLineId: { value: string | number; label: string | number } | null
        busStopLineMappingId: {
          value: string | number
          label: string | number
        }
      }[]
      evening: {
        dayOfWeek: string
        busLineId: { value: string | number; label: string | number } | null
        busStopLineMappingId: {
          value: string | number
          label: string | number
        }
      }[]
    } = get(values, "employeeUsageInfo")

    values.employeeUsageInfo.morning = employeeUsageInfo.morning.map(
      (employee) => {
        return {
          dayOfWeek: employee?.dayOfWeek,
          busLineId: employee?.busLineId?.value,
          busStopLineMappingId: employee?.busStopLineMappingId?.value,
        }
      }
    )
    values.employeeUsageInfo.evening = employeeUsageInfo.evening.map(
      (employee) => {
        return {
          dayOfWeek: employee?.dayOfWeek,
          busLineId: employee?.busLineId?.value,
          busStopLineMappingId: employee?.busStopLineMappingId?.value,
        }
      }
    )
    values.status = isBoolean(status)
      ? status
      : status === "active"
      ? true
      : false

    submit({
      employeeNo: data.employeeNo,
      status: values.status,
      employeeUsageInfo: values.employeeUsageInfo,
      isDisplayDefaultForSubordinateBooking:
        values?.isDisplayDefaultForSubordinateBooking ?? false,
    })
  }

  return (
    <>
      <Head>
        <title>พนักงานในความดูแล</title>
        <meta name="description" content="subordinates" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ConfirmDialog
        title="ลบออกจากความดูแล"
        content={`ยืนยันที่จะลบ ${data?.title}${data?.firstName} ${data?.lastName} ออกจากความดูแล`}
        onSubmit={() => {
          onDeleteSubordinate({
            subordinateEmployeeNos: [data?.employeeNo],
            from: "edit",
          })
        }}
        isLoading={isLoadingDelete}
        isOpen={isOpenConfirmDelete}
        onClose={() => {
          setOpenConfirmDelete(false)
        }}
        type="error"
      />
      <Container
        minW="100%"
        minHeight="100%"
        paddingInlineStart={{ base: 2, md: 0 }}
        paddingInlineEnd={{ base: 2, md: 0 }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex width="100%" justifyContent="space-between" mt={5} mb={12}>
            <Flex justifyContent="center" flexDirection="column">
              <HStack spacing={6}>
                <NextLink href={"/employee/subordinates"} passHref>
                  <Link _hover={{}} _focus={{}}>
                    <Text color="#00A5A8">พนักงานในความดูแล</Text>
                  </Link>
                </NextLink>
                <Text>{">"}</Text>
                <Text color="#00000080">ลงทะเบียน</Text>
              </HStack>
            </Flex>
          </Flex>
          <Flex w="100%" justifyContent="space-between" mb={10}>
            <Text fontSize="32px" fontWeight={600}>
              สมัครใช้บริการ
            </Text>
            <Button isLoading={isSubmitting || isLoading} type="submit">
              ยืนยันการสมัคร
            </Button>
          </Flex>
          <Flex flexDirection="column" position="relative">
            <Box
              border="1px solid #B2CCCC"
              borderRadius="6px"
              pt="40px"
              pb="40px"
              pl="48px"
              mb={{ base: 6, md: 10 }}
              overflowX="auto"
              className={styles.scroll}
              position="relative"
            >
              <Text fontSize="24px" fontWeight="600" mb={10}>
                ข้อมูลส่วนตัว
              </Text>
              <FormControl isInvalid={!!errors.status} mb={10}>
                <FormLabel htmlFor="status">Status</FormLabel>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      {...field}
                      display="flex"
                      justifyContent="space-between"
                      width={{ base: "60%", md: "50%", lg: "35%" }}
                    >
                      <Radio
                        value="active"
                        borderColor="#00A5A8"
                        colorScheme="primary"
                        mr={4}
                      >
                        Active
                      </Radio>
                      <Radio
                        value="inactive"
                        borderColor="#00A5A8"
                        colorScheme="primary"
                        mr={4}
                      >
                        Inactive
                      </Radio>
                    </RadioGroup>
                  )}
                  rules={{ required: "กรุณาเลือก" }}
                />
                <FormErrorMessage>
                  {errors.status && errors.status.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl
                isInvalid={!!errors.isDisplayDefaultForSubordinateBooking}
              >
                <FormLabel htmlFor="isDisplayDefaultForSubordinateBooking">
                  ให้ระบบ Default ใส่ชื่อพนักงานเวลาจองรถ
                </FormLabel>
                <Controller
                  name="isDisplayDefaultForSubordinateBooking"
                  control={control}
                  render={({ field: { onChange, value, ref } }) => (
                    <Checkbox
                      onChange={onChange}
                      textTransform="capitalize"
                      ref={ref}
                      isChecked={value}
                    >
                      Default
                    </Checkbox>
                  )}
                />
                <FormErrorMessage>
                  {errors.isDisplayDefaultForSubordinateBooking &&
                    errors.isDisplayDefaultForSubordinateBooking.message}
                </FormErrorMessage>
              </FormControl>
              <Table
                variant="unstyled"
                width={{ base: "100%", md: "80%" }}
                mb={10}
              >
                <Thead>
                  <Tr>
                    <Th px={0}></Th>
                    <Th px={0}></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td px={0} minWidth={200}>
                      <TextInput
                        name="employeeNo"
                        label="รหัสพนักงาน"
                        errors={errors}
                        register={register}
                        variant="unstyled"
                        disabled={true}
                        autocomplete="off"
                        minWidth={250}
                      />
                    </Td>
                    <Td px={0} pl={28}>
                      <TextInput
                        name="workAreaName"
                        label="สังกัด"
                        errors={errors}
                        register={register}
                        variant="unstyled"
                        disabled={true}
                        autocomplete="off"
                        minWidth={250}
                      />
                    </Td>
                  </Tr>
                  <Tr>
                    <Td px={0} minWidth={200}>
                      <TextInput
                        name="firstName"
                        label="ชื่อ"
                        errors={errors}
                        register={register}
                        variant="unstyled"
                        disabled={true}
                        autocomplete="off"
                      />
                    </Td>
                    <Td px={0} pl={28}>
                      <TextInput
                        name="lastName"
                        label="นามสกุล"
                        errors={errors}
                        register={register}
                        variant="unstyled"
                        disabled={true}
                        autocomplete="off"
                      />
                    </Td>
                  </Tr>
                  <Tr>
                    <Td px={0} minWidth={200}>
                      <TextInput
                        name="jobName"
                        label="หน่วยงาน"
                        errors={errors}
                        register={register}
                        variant="unstyled"
                        disabled={true}
                        autocomplete="off"
                      />
                    </Td>
                    <Td px={0} pl={28}>
                      <TextInput
                        name="positionName"
                        label="ส่วนงาน"
                        errors={errors}
                        register={register}
                        variant="unstyled"
                        disabled={true}
                        autocomplete="off"
                      />
                    </Td>
                  </Tr>
                  <Tr>
                    <Td px={0} width="100%" colSpan={2}>
                      <TextInput
                        name="email"
                        label="อีเมล"
                        errors={errors}
                        register={register}
                        variant="unstyled"
                        disabled={true}
                        autocomplete="off"
                      />
                    </Td>
                  </Tr>
                  <Tr>
                    <Td px={0} minWidth={200}>
                      <TextInput
                        name="phoneNo"
                        label="เบอร์ภายใน"
                        errors={errors}
                        register={register}
                        variant="unstyled"
                        disabled={true}
                        autocomplete="off"
                        minWidth={250}
                      />
                    </Td>
                    <Td px={0} pl={28}>
                      <TextInput
                        name="supervisorEmployeeNo"
                        label="ผู้ดูแล"
                        errors={errors}
                        register={register}
                        variant="unstyled"
                        disabled={true}
                        autocomplete="off"
                      />
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
            </Box>
            <Box
              border="1px solid #B2CCCC"
              borderRadius="6px"
              pt="40px"
              pb="40px"
              pl="48px"
              mb={2}
              width="100%"
              overflowX="scroll"
              className={styles.scroll}
            >
              <Text fontSize="24px" fontWeight="600" mb={10}>
                ข้อมูลการใช้บริการ
              </Text>
              <Box
                position="relative"
                width={{ base: "100%", md: "90%" }}
                mb={10}
              >
                <Table variant="unstyled" width="100%">
                  <Thead>
                    <Tr>
                      <Th width="8%" pl={0}></Th>
                      <Th
                        width="23%"
                        minW="175px"
                        pl={{ base: 1, md: 4 }}
                        pr={{ base: 1, md: 2 }}
                      >
                        พื้นที่ (รอบไป)
                      </Th>
                      <Th
                        width="23%"
                        minW="175px"
                        pl={{ base: 1, md: 2 }}
                        pr={{ base: 1, md: 4 }}
                      >
                        จุดจอด (รอบไป)
                      </Th>
                      <Th
                        width="23%"
                        minW="175px"
                        pl={{ base: 1, md: 4 }}
                        pr={{ base: 1, md: 2 }}
                      >
                        พื้นที่ (รอบกลับ)
                      </Th>
                      <Th
                        width="23%"
                        minW="175px"
                        pl={{ base: 1, md: 2 }}
                        pr={{ base: 1, md: 4 }}
                      >
                        จุดจอด (รอบกลับ)
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    <Tr>
                      <Td pl={0}>จันทร์:</Td>
                      <Td pl={{ base: 1, md: 4 }} pr={{ base: 1, md: 2 }}>
                        <FormControl
                          isInvalid={
                            !!(
                              errors?.employeeUsageInfo &&
                              errors?.employeeUsageInfo?.morning &&
                              errors?.employeeUsageInfo?.morning[0] &&
                              errors?.employeeUsageInfo?.morning[0]?.busLineId
                            )
                          }
                        >
                          <Controller
                            name="employeeUsageInfo.morning.0.busLineId"
                            control={control}
                            render={({ field, fieldState }) => (
                              <SelectInput
                                isClearable
                                options={areaMorningOptions}
                                placeholder=""
                                {...field}
                                {...fieldState}
                                onChange={(v: any) => {
                                  field.onChange(v)
                                  if (!v) {
                                    setValue(
                                      "employeeUsageInfo.morning.0.busStopLineMappingId",
                                      null
                                    )
                                    unregister(
                                      "employeeUsageInfo.morning.0.busStopLineMappingId"
                                    )
                                  }
                                  if (v) {
                                    const busStopLineMappingId = get(
                                      employeeUsageInfo,
                                      "morning.0.busStopLineMappingId"
                                    )
                                    if (busStopLineMappingId) {
                                      const filteredBusStop = filter(
                                        v?.busStops,
                                        {
                                          busStopLineMappingId:
                                            busStopLineMappingId.value,
                                        }
                                      )
                                      if (
                                        !filteredBusStop ||
                                        filteredBusStop.length === 0
                                      ) {
                                        setValue(
                                          "employeeUsageInfo.morning.0.busStopLineMappingId",
                                          null
                                        )
                                        unregister(
                                          "employeeUsageInfo.morning.0.busStopLineMappingId"
                                        )
                                      }
                                    }
                                  }
                                }}
                              />
                            )}
                            rules={{ required: true }}
                          />
                          <FormErrorMessage>
                            {errors?.employeeUsageInfo &&
                              errors?.employeeUsageInfo?.morning &&
                              errors?.employeeUsageInfo?.morning[0]
                                ?.busLineId &&
                              "กรุณาเลือกพื้นที่"}
                          </FormErrorMessage>
                        </FormControl>
                      </Td>
                      <Td pl={{ base: 1, md: 2 }} pr={{ base: 1, md: 4 }}>
                        <FormControl
                          isInvalid={
                            !!(
                              errors?.employeeUsageInfo &&
                              errors?.employeeUsageInfo?.morning &&
                              errors?.employeeUsageInfo?.morning[0] &&
                              errors?.employeeUsageInfo?.morning[0]
                                ?.busStopLineMappingId
                            )
                          }
                        >
                          <Controller
                            name="employeeUsageInfo.morning.0.busStopLineMappingId"
                            control={control}
                            render={({ field, fieldState }) => (
                              <SelectInput
                                isClearable
                                options={
                                  get(
                                    employeeUsageInfo,
                                    "morning.0.busLineId.value"
                                  )
                                    ? filter(areaMorningOptions, {
                                        value: get(
                                          employeeUsageInfo,
                                          "morning.0.busLineId.value"
                                        ),
                                      })[0]?.busStops
                                    : []
                                }
                                placeholder=""
                                {...field}
                                {...fieldState}
                                isDisabled={
                                  !get(employeeUsageInfo, "morning.0.busLineId")
                                }
                              />
                            )}
                            rules={
                              get(employeeUsageInfo, "morning.0.busLineId")
                                ? { required: "กรุณาเลือกจุดจอด" }
                                : {}
                            }
                          />
                          <FormErrorMessage>
                            {errors?.employeeUsageInfo &&
                              errors?.employeeUsageInfo?.morning &&
                              errors?.employeeUsageInfo?.morning[0]
                                ?.busStopLineMappingId &&
                              "กรุณาเลือกจุดจอด"}
                          </FormErrorMessage>
                        </FormControl>
                      </Td>
                      <Td pl={{ base: 1, md: 4 }} pr={{ base: 1, md: 2 }}>
                        <FormControl
                          isInvalid={
                            !!(
                              errors?.employeeUsageInfo &&
                              errors?.employeeUsageInfo?.evening &&
                              errors?.employeeUsageInfo?.evening[0] &&
                              errors?.employeeUsageInfo?.evening[0]?.busLineId
                            )
                          }
                        >
                          <Controller
                            name="employeeUsageInfo.evening.0.busLineId"
                            control={control}
                            render={({ field, fieldState }) => (
                              <SelectInput
                                isClearable
                                options={areaEveningOptions}
                                placeholder=""
                                {...field}
                                {...fieldState}
                                onChange={(v: any) => {
                                  field.onChange(v)
                                  if (!v) {
                                    setValue(
                                      "employeeUsageInfo.evening.0.busStopLineMappingId",
                                      null
                                    )
                                    unregister(
                                      "employeeUsageInfo.evening.0.busStopLineMappingId"
                                    )
                                  }
                                  if (v) {
                                    const busStopLineMappingId = get(
                                      employeeUsageInfo,
                                      "evening.0.busStopLineMappingId"
                                    )
                                    if (busStopLineMappingId) {
                                      const filteredBusStop = filter(
                                        v?.busStops,
                                        {
                                          busStopLineMappingId:
                                            busStopLineMappingId.value,
                                        }
                                      )
                                      if (
                                        !filteredBusStop ||
                                        filteredBusStop.length === 0
                                      ) {
                                        setValue(
                                          "employeeUsageInfo.evening.0.busStopLineMappingId",
                                          null
                                        )
                                        unregister(
                                          "employeeUsageInfo.evening.0.busStopLineMappingId"
                                        )
                                      }
                                    }
                                  }
                                }}
                              />
                            )}
                            rules={{ required: true }}
                          />
                          <FormErrorMessage>
                            {errors?.employeeUsageInfo &&
                              errors?.employeeUsageInfo?.evening &&
                              errors?.employeeUsageInfo?.evening[0]
                                ?.busLineId &&
                              "กรุณาเลือกพื้นที่"}
                          </FormErrorMessage>
                        </FormControl>
                      </Td>
                      <Td pl={{ base: 1, md: 2 }} pr={{ base: 1, md: 4 }}>
                        <FormControl
                          isInvalid={
                            !!(
                              errors?.employeeUsageInfo &&
                              errors?.employeeUsageInfo?.evening &&
                              errors?.employeeUsageInfo?.evening[0] &&
                              errors?.employeeUsageInfo?.evening[0]
                                ?.busStopLineMappingId
                            )
                          }
                        >
                          <Controller
                            name="employeeUsageInfo.evening.0.busStopLineMappingId"
                            control={control}
                            render={({ field, fieldState }) => (
                              <SelectInput
                                isClearable
                                options={
                                  get(
                                    employeeUsageInfo,
                                    "evening.0.busLineId.value"
                                  )
                                    ? filter(areaEveningOptions, {
                                        value: get(
                                          employeeUsageInfo,
                                          "evening.0.busLineId.value"
                                        ),
                                      })[0]?.busStops
                                    : []
                                }
                                placeholder=""
                                {...field}
                                {...fieldState}
                                isDisabled={
                                  !get(employeeUsageInfo, "evening.0.busLineId")
                                }
                              />
                            )}
                            rules={
                              get(employeeUsageInfo, "evening.0.busLineId")
                                ? { required: "กรุณาเลือกจุดจอด" }
                                : {}
                            }
                          />
                          <FormErrorMessage>
                            {errors?.employeeUsageInfo &&
                              errors?.employeeUsageInfo?.evening &&
                              errors?.employeeUsageInfo?.evening[0]
                                ?.busStopLineMappingId &&
                              "กรุณาเลือกจุดจอด"}
                          </FormErrorMessage>
                        </FormControl>
                      </Td>
                    </Tr>
                    <Tr>
                      <Td pl={0}>อังคาร:</Td>
                      <Td pl={{ base: 1, md: 4 }} pr={{ base: 1, md: 2 }}>
                        <FormControl
                          isInvalid={
                            !!(
                              errors?.employeeUsageInfo &&
                              errors?.employeeUsageInfo?.morning &&
                              errors?.employeeUsageInfo?.morning[1] &&
                              errors?.employeeUsageInfo?.morning[1]?.busLineId
                            )
                          }
                        >
                          <Controller
                            name="employeeUsageInfo.morning.1.busLineId"
                            control={control}
                            render={({ field, fieldState }) => (
                              <SelectInput
                                isClearable
                                options={areaMorningOptions}
                                placeholder=""
                                {...field}
                                {...fieldState}
                                onChange={(v: any) => {
                                  field.onChange(v)
                                  if (!v) {
                                    setValue(
                                      "employeeUsageInfo.morning.1.busStopLineMappingId",
                                      null
                                    )
                                    unregister(
                                      "employeeUsageInfo.morning.1.busStopLineMappingId"
                                    )
                                  }
                                  if (v) {
                                    const busStopLineMappingId = get(
                                      employeeUsageInfo,
                                      "morning.1.busStopLineMappingId"
                                    )
                                    if (busStopLineMappingId) {
                                      const filteredBusStop = filter(
                                        v?.busStops,
                                        {
                                          busStopLineMappingId:
                                            busStopLineMappingId.value,
                                        }
                                      )
                                      if (
                                        !filteredBusStop ||
                                        filteredBusStop.length === 0
                                      ) {
                                        setValue(
                                          "employeeUsageInfo.morning.1.busStopLineMappingId",
                                          null
                                        )
                                        unregister(
                                          "employeeUsageInfo.morning.1.busStopLineMappingId"
                                        )
                                      }
                                    }
                                  }
                                }}
                              />
                            )}
                            rules={{ required: true }}
                          />
                          <FormErrorMessage>
                            {errors?.employeeUsageInfo &&
                              errors?.employeeUsageInfo?.morning &&
                              errors?.employeeUsageInfo?.morning[1]
                                ?.busLineId &&
                              "กรุณาเลือกพื้นที่"}
                          </FormErrorMessage>
                        </FormControl>
                      </Td>
                      <Td pl={{ base: 1, md: 2 }} pr={{ base: 1, md: 4 }}>
                        <FormControl
                          isInvalid={
                            !!(
                              errors?.employeeUsageInfo &&
                              errors?.employeeUsageInfo?.morning &&
                              errors?.employeeUsageInfo?.morning[1] &&
                              errors?.employeeUsageInfo?.morning[1]
                                ?.busStopLineMappingId
                            )
                          }
                        >
                          <Controller
                            name="employeeUsageInfo.morning.1.busStopLineMappingId"
                            control={control}
                            render={({ field, fieldState }) => (
                              <SelectInput
                                isClearable
                                options={
                                  get(
                                    employeeUsageInfo,
                                    "morning.1.busLineId.value"
                                  )
                                    ? filter(areaMorningOptions, {
                                        value: get(
                                          employeeUsageInfo,
                                          "morning.1.busLineId.value"
                                        ),
                                      })[0]?.busStops
                                    : []
                                }
                                placeholder=""
                                {...field}
                                {...fieldState}
                                isDisabled={
                                  !get(employeeUsageInfo, "morning.1.busLineId")
                                }
                              />
                            )}
                            rules={
                              get(employeeUsageInfo, "morning.1.busLineId")
                                ? { required: "กรุณาเลือกจุดจอด" }
                                : {}
                            }
                          />
                          <FormErrorMessage>
                            {errors?.employeeUsageInfo &&
                              errors?.employeeUsageInfo?.morning &&
                              errors?.employeeUsageInfo?.morning[1]
                                ?.busStopLineMappingId &&
                              "กรุณาเลือกจุดจอด"}
                          </FormErrorMessage>
                        </FormControl>
                      </Td>
                      <Td pl={{ base: 1, md: 4 }} pr={{ base: 1, md: 2 }}>
                        <FormControl
                          isInvalid={
                            !!(
                              errors?.employeeUsageInfo &&
                              errors?.employeeUsageInfo?.evening &&
                              errors?.employeeUsageInfo?.evening[1] &&
                              errors?.employeeUsageInfo?.evening[1]?.busLineId
                            )
                          }
                        >
                          <Controller
                            name="employeeUsageInfo.evening.1.busLineId"
                            control={control}
                            render={({ field, fieldState }) => (
                              <SelectInput
                                isClearable
                                options={areaEveningOptions}
                                placeholder=""
                                {...field}
                                {...fieldState}
                                onChange={(v: any) => {
                                  field.onChange(v)
                                  if (!v) {
                                    setValue(
                                      "employeeUsageInfo.evening.1.busStopLineMappingId",
                                      null
                                    )
                                    unregister(
                                      "employeeUsageInfo.evening.1.busStopLineMappingId"
                                    )
                                  }
                                  if (v) {
                                    const busStopLineMappingId = get(
                                      employeeUsageInfo,
                                      "evening.1.busStopLineMappingId"
                                    )
                                    if (busStopLineMappingId) {
                                      const filteredBusStop = filter(
                                        v?.busStops,
                                        {
                                          busStopLineMappingId:
                                            busStopLineMappingId.value,
                                        }
                                      )
                                      if (
                                        !filteredBusStop ||
                                        filteredBusStop.length === 0
                                      ) {
                                        setValue(
                                          "employeeUsageInfo.evening.1.busStopLineMappingId",
                                          null
                                        )
                                        unregister(
                                          "employeeUsageInfo.evening.1.busStopLineMappingId"
                                        )
                                      }
                                    }
                                  }
                                }}
                              />
                            )}
                            rules={{ required: true }}
                          />
                          <FormErrorMessage>
                            {errors?.employeeUsageInfo &&
                              errors?.employeeUsageInfo?.evening &&
                              errors?.employeeUsageInfo?.evening[1]
                                ?.busLineId &&
                              "กรุณาเลือกพื้นที่"}
                          </FormErrorMessage>
                        </FormControl>
                      </Td>
                      <Td pl={{ base: 1, md: 2 }} pr={{ base: 1, md: 4 }}>
                        <FormControl
                          isInvalid={
                            !!(
                              errors?.employeeUsageInfo &&
                              errors?.employeeUsageInfo?.evening &&
                              errors?.employeeUsageInfo?.evening[1] &&
                              errors?.employeeUsageInfo?.evening[1]
                                ?.busStopLineMappingId
                            )
                          }
                        >
                          <Controller
                            name="employeeUsageInfo.evening.1.busStopLineMappingId"
                            control={control}
                            render={({ field, fieldState }) => (
                              <SelectInput
                                isClearable
                                options={
                                  get(
                                    employeeUsageInfo,
                                    "evening.1.busLineId.value"
                                  )
                                    ? filter(areaEveningOptions, {
                                        value: get(
                                          employeeUsageInfo,
                                          "evening.1.busLineId.value"
                                        ),
                                      })[0]?.busStops
                                    : []
                                }
                                placeholder=""
                                {...field}
                                {...fieldState}
                                isDisabled={
                                  !get(employeeUsageInfo, "evening.1.busLineId")
                                }
                              />
                            )}
                            rules={
                              get(employeeUsageInfo, "evening.1.busLineId")
                                ? { required: "กรุณาเลือกจุดจอด" }
                                : {}
                            }
                          />
                          <FormErrorMessage>
                            {errors?.employeeUsageInfo &&
                              errors?.employeeUsageInfo?.evening &&
                              errors?.employeeUsageInfo?.evening[1]
                                ?.busStopLineMappingId &&
                              "กรุณาเลือกจุดจอด"}
                          </FormErrorMessage>
                        </FormControl>
                      </Td>
                    </Tr>
                    <Tr>
                      <Td pl={0}>พุธ:</Td>
                      <Td pl={{ base: 1, md: 4 }} pr={{ base: 1, md: 2 }}>
                        <FormControl
                          isInvalid={
                            !!(
                              errors?.employeeUsageInfo &&
                              errors?.employeeUsageInfo?.morning &&
                              errors?.employeeUsageInfo?.morning[2] &&
                              errors?.employeeUsageInfo?.morning[2]?.busLineId
                            )
                          }
                        >
                          <Controller
                            name="employeeUsageInfo.morning.2.busLineId"
                            control={control}
                            render={({ field, fieldState }) => (
                              <SelectInput
                                isClearable
                                options={areaMorningOptions}
                                placeholder=""
                                {...field}
                                {...fieldState}
                                onChange={(v: any) => {
                                  field.onChange(v)
                                  if (!v) {
                                    setValue(
                                      "employeeUsageInfo.morning.2.busStopLineMappingId",
                                      null
                                    )
                                    unregister(
                                      "employeeUsageInfo.morning.2.busStopLineMappingId"
                                    )
                                  }
                                  if (v) {
                                    const busStopLineMappingId = get(
                                      employeeUsageInfo,
                                      "morning.2.busStopLineMappingId"
                                    )
                                    if (busStopLineMappingId) {
                                      const filteredBusStop = filter(
                                        v?.busStops,
                                        {
                                          busStopLineMappingId:
                                            busStopLineMappingId.value,
                                        }
                                      )
                                      if (
                                        !filteredBusStop ||
                                        filteredBusStop.length === 0
                                      ) {
                                        setValue(
                                          "employeeUsageInfo.morning.2.busStopLineMappingId",
                                          null
                                        )
                                        unregister(
                                          "employeeUsageInfo.morning.2.busStopLineMappingId"
                                        )
                                      }
                                    }
                                  }
                                }}
                              />
                            )}
                            rules={{ required: true }}
                          />
                          <FormErrorMessage>
                            {errors?.employeeUsageInfo &&
                              errors?.employeeUsageInfo?.morning &&
                              errors?.employeeUsageInfo?.morning[2]
                                ?.busLineId &&
                              "กรุณาเลือกพื้นที่"}
                          </FormErrorMessage>
                        </FormControl>
                      </Td>
                      <Td pl={{ base: 1, md: 2 }} pr={{ base: 1, md: 4 }}>
                        <FormControl
                          isInvalid={
                            !!(
                              errors?.employeeUsageInfo &&
                              errors?.employeeUsageInfo?.morning &&
                              errors?.employeeUsageInfo?.morning[2] &&
                              errors?.employeeUsageInfo?.morning[2]
                                ?.busStopLineMappingId
                            )
                          }
                        >
                          <Controller
                            name="employeeUsageInfo.morning.2.busStopLineMappingId"
                            control={control}
                            render={({ field, fieldState }) => (
                              <SelectInput
                                isClearable
                                options={
                                  get(
                                    employeeUsageInfo,
                                    "morning.2.busLineId.value"
                                  )
                                    ? filter(areaMorningOptions, {
                                        value: get(
                                          employeeUsageInfo,
                                          "morning.2.busLineId.value"
                                        ),
                                      })[0]?.busStops
                                    : []
                                }
                                placeholder=""
                                {...field}
                                {...fieldState}
                                isDisabled={
                                  !get(employeeUsageInfo, "morning.2.busLineId")
                                }
                              />
                            )}
                            rules={
                              get(employeeUsageInfo, "morning.2.busLineId")
                                ? { required: "กรุณาเลือกจุดจอด" }
                                : {}
                            }
                          />
                          <FormErrorMessage>
                            {errors?.employeeUsageInfo &&
                              errors?.employeeUsageInfo?.morning &&
                              errors?.employeeUsageInfo?.morning[2]
                                ?.busStopLineMappingId &&
                              "กรุณาเลือกจุดจอด"}
                          </FormErrorMessage>
                        </FormControl>
                      </Td>
                      <Td pl={{ base: 1, md: 4 }} pr={{ base: 1, md: 2 }}>
                        <FormControl
                          isInvalid={
                            !!(
                              errors?.employeeUsageInfo &&
                              errors?.employeeUsageInfo?.evening &&
                              errors?.employeeUsageInfo?.evening[2] &&
                              errors?.employeeUsageInfo?.evening[2]?.busLineId
                            )
                          }
                        >
                          <Controller
                            name="employeeUsageInfo.evening.2.busLineId"
                            control={control}
                            render={({ field, fieldState }) => (
                              <SelectInput
                                isClearable
                                options={areaEveningOptions}
                                placeholder=""
                                {...field}
                                {...fieldState}
                                onChange={(v: any) => {
                                  field.onChange(v)
                                  if (!v) {
                                    setValue(
                                      "employeeUsageInfo.evening.2.busStopLineMappingId",
                                      null
                                    )
                                    unregister(
                                      "employeeUsageInfo.evening.2.busStopLineMappingId"
                                    )
                                  }
                                  if (v) {
                                    const busStopLineMappingId = get(
                                      employeeUsageInfo,
                                      "evening.2.busStopLineMappingId"
                                    )

                                    if (busStopLineMappingId) {
                                      const filteredBusStop = filter(
                                        v?.busStops,
                                        {
                                          busStopLineMappingId:
                                            busStopLineMappingId.value,
                                        }
                                      )

                                      if (
                                        !filteredBusStop ||
                                        filteredBusStop.length === 0
                                      ) {
                                        setValue(
                                          "employeeUsageInfo.evening.2.busStopLineMappingId",
                                          null
                                        )
                                        unregister(
                                          "employeeUsageInfo.evening.2.busStopLineMappingId"
                                        )
                                      }
                                    }
                                  }
                                }}
                              />
                            )}
                            rules={{ required: true }}
                          />
                          <FormErrorMessage>
                            {errors?.employeeUsageInfo &&
                              errors?.employeeUsageInfo?.evening &&
                              errors?.employeeUsageInfo?.evening[2]
                                ?.busLineId &&
                              "กรุณาเลือกพื้นที่"}
                          </FormErrorMessage>
                        </FormControl>
                      </Td>
                      <Td pl={{ base: 1, md: 2 }} pr={{ base: 1, md: 4 }}>
                        <FormControl
                          isInvalid={
                            !!(
                              errors?.employeeUsageInfo &&
                              errors?.employeeUsageInfo?.evening &&
                              errors?.employeeUsageInfo?.evening[2] &&
                              errors?.employeeUsageInfo?.evening[2]
                                ?.busStopLineMappingId
                            )
                          }
                        >
                          <Controller
                            name="employeeUsageInfo.evening.2.busStopLineMappingId"
                            control={control}
                            render={({ field, fieldState }) => (
                              <SelectInput
                                isClearable
                                options={
                                  get(
                                    employeeUsageInfo,
                                    "evening.2.busLineId.value"
                                  )
                                    ? filter(areaEveningOptions, {
                                        value: get(
                                          employeeUsageInfo,
                                          "evening.2.busLineId.value"
                                        ),
                                      })[0]?.busStops
                                    : []
                                }
                                placeholder=""
                                {...field}
                                {...fieldState}
                                isDisabled={
                                  !get(employeeUsageInfo, "evening.2.busLineId")
                                }
                              />
                            )}
                            rules={
                              get(employeeUsageInfo, "evening.2.busLineId")
                                ? { required: "กรุณาเลือกจุดจอด" }
                                : {}
                            }
                          />
                          <FormErrorMessage>
                            {errors?.employeeUsageInfo &&
                              errors?.employeeUsageInfo?.evening &&
                              errors?.employeeUsageInfo?.evening[2]
                                ?.busStopLineMappingId &&
                              "กรุณาเลือกจุดจอด"}
                          </FormErrorMessage>
                        </FormControl>
                      </Td>
                    </Tr>
                    <Tr>
                      <Td pl={0}>พฤหัสบดี:</Td>
                      <Td pl={{ base: 1, md: 4 }} pr={{ base: 1, md: 2 }}>
                        <FormControl
                          isInvalid={
                            !!(
                              errors?.employeeUsageInfo &&
                              errors?.employeeUsageInfo?.morning &&
                              errors?.employeeUsageInfo?.morning[3] &&
                              errors?.employeeUsageInfo?.morning[3]?.busLineId
                            )
                          }
                        >
                          <Controller
                            name="employeeUsageInfo.morning.3.busLineId"
                            control={control}
                            render={({ field, fieldState }) => (
                              <SelectInput
                                isClearable
                                options={areaMorningOptions}
                                placeholder=""
                                {...field}
                                {...fieldState}
                                onChange={(v: any) => {
                                  field.onChange(v)
                                  if (!v) {
                                    setValue(
                                      "employeeUsageInfo.morning.3.busStopLineMappingId",
                                      null
                                    )
                                    unregister(
                                      "employeeUsageInfo.morning.3.busStopLineMappingId"
                                    )
                                  }
                                  if (v) {
                                    const busStopLineMappingId = get(
                                      employeeUsageInfo,
                                      "morning.3.busStopLineMappingId"
                                    )
                                    if (busStopLineMappingId) {
                                      const filteredBusStop = filter(
                                        v?.busStops,
                                        {
                                          busStopLineMappingId:
                                            busStopLineMappingId.value,
                                        }
                                      )
                                      if (
                                        !filteredBusStop ||
                                        filteredBusStop.length === 0
                                      ) {
                                        setValue(
                                          "employeeUsageInfo.morning.3.busStopLineMappingId",
                                          null
                                        )
                                        unregister(
                                          "employeeUsageInfo.morning.3.busStopLineMappingId"
                                        )
                                      }
                                    }
                                  }
                                }}
                              />
                            )}
                            rules={{ required: true }}
                          />
                          <FormErrorMessage>
                            {errors?.employeeUsageInfo &&
                              errors?.employeeUsageInfo?.morning &&
                              errors?.employeeUsageInfo?.morning[3]
                                ?.busLineId &&
                              "กรุณาเลือกพื้นที่"}
                          </FormErrorMessage>
                        </FormControl>
                      </Td>
                      <Td pl={{ base: 1, md: 2 }} pr={{ base: 1, md: 4 }}>
                        <FormControl
                          isInvalid={
                            !!(
                              errors?.employeeUsageInfo &&
                              errors?.employeeUsageInfo?.morning &&
                              errors?.employeeUsageInfo?.morning[3] &&
                              errors?.employeeUsageInfo?.morning[3]
                                ?.busStopLineMappingId
                            )
                          }
                        >
                          <Controller
                            name="employeeUsageInfo.morning.3.busStopLineMappingId"
                            control={control}
                            render={({ field, fieldState }) => (
                              <SelectInput
                                isClearable
                                options={
                                  get(
                                    employeeUsageInfo,
                                    "morning.3.busLineId.value"
                                  )
                                    ? filter(areaMorningOptions, {
                                        value: get(
                                          employeeUsageInfo,
                                          "morning.3.busLineId.value"
                                        ),
                                      })[0]?.busStops
                                    : []
                                }
                                placeholder=""
                                {...field}
                                {...fieldState}
                                isDisabled={
                                  !get(employeeUsageInfo, "morning.3.busLineId")
                                }
                              />
                            )}
                            rules={
                              get(employeeUsageInfo, "morning.3.busLineId")
                                ? { required: "กรุณาเลือกจุดจอด" }
                                : {}
                            }
                          />
                          <FormErrorMessage>
                            {errors?.employeeUsageInfo &&
                              errors?.employeeUsageInfo?.morning &&
                              errors?.employeeUsageInfo?.morning[3]
                                ?.busStopLineMappingId &&
                              "กรุณาเลือกจุดจอด"}
                          </FormErrorMessage>
                        </FormControl>
                      </Td>
                      <Td pl={{ base: 1, md: 4 }} pr={{ base: 1, md: 2 }}>
                        <FormControl
                          isInvalid={
                            !!(
                              errors?.employeeUsageInfo &&
                              errors?.employeeUsageInfo?.evening &&
                              errors?.employeeUsageInfo?.evening[3] &&
                              errors?.employeeUsageInfo?.evening[3]?.busLineId
                            )
                          }
                        >
                          <Controller
                            name="employeeUsageInfo.evening.3.busLineId"
                            control={control}
                            render={({ field, fieldState }) => (
                              <SelectInput
                                isClearable
                                options={areaEveningOptions}
                                placeholder=""
                                {...field}
                                {...fieldState}
                                onChange={(v: any) => {
                                  field.onChange(v)
                                  if (!v) {
                                    setValue(
                                      "employeeUsageInfo.evening.3.busStopLineMappingId",
                                      null
                                    )
                                    unregister(
                                      "employeeUsageInfo.evening.3.busStopLineMappingId"
                                    )
                                  }
                                  if (v) {
                                    const busStopLineMappingId = get(
                                      employeeUsageInfo,
                                      "evening.3.busStopLineMappingId"
                                    )
                                    if (busStopLineMappingId) {
                                      const filteredBusStop = filter(
                                        v?.busStops,
                                        {
                                          busStopLineMappingId:
                                            busStopLineMappingId.value,
                                        }
                                      )
                                      if (
                                        !filteredBusStop ||
                                        filteredBusStop.length === 0
                                      ) {
                                        setValue(
                                          "employeeUsageInfo.evening.3.busStopLineMappingId",
                                          null
                                        )
                                        unregister(
                                          "employeeUsageInfo.evening.3.busStopLineMappingId"
                                        )
                                      }
                                    }
                                  }
                                }}
                              />
                            )}
                            rules={{ required: true }}
                          />
                          <FormErrorMessage>
                            {errors?.employeeUsageInfo &&
                              errors?.employeeUsageInfo?.evening &&
                              errors?.employeeUsageInfo?.evening[3]
                                ?.busLineId &&
                              "กรุณาเลือกพื้นที่"}
                          </FormErrorMessage>
                        </FormControl>
                      </Td>
                      <Td pl={{ base: 1, md: 2 }} pr={{ base: 1, md: 4 }}>
                        <FormControl
                          isInvalid={
                            !!(
                              errors?.employeeUsageInfo &&
                              errors?.employeeUsageInfo?.evening &&
                              errors?.employeeUsageInfo?.evening[3] &&
                              errors?.employeeUsageInfo?.evening[3]
                                ?.busStopLineMappingId
                            )
                          }
                        >
                          <Controller
                            name="employeeUsageInfo.evening.3.busStopLineMappingId"
                            control={control}
                            render={({ field, fieldState }) => (
                              <SelectInput
                                isClearable
                                options={
                                  get(
                                    employeeUsageInfo,
                                    "evening.3.busLineId.value"
                                  )
                                    ? filter(areaEveningOptions, {
                                        value: get(
                                          employeeUsageInfo,
                                          "evening.3.busLineId.value"
                                        ),
                                      })[0]?.busStops
                                    : []
                                }
                                placeholder=""
                                {...field}
                                {...fieldState}
                                isDisabled={
                                  !get(employeeUsageInfo, "evening.3.busLineId")
                                }
                              />
                            )}
                            rules={
                              get(employeeUsageInfo, "evening.3.busLineId")
                                ? { required: "กรุณาเลือกจุดจอด" }
                                : {}
                            }
                          />
                          <FormErrorMessage>
                            {errors?.employeeUsageInfo &&
                              errors?.employeeUsageInfo?.evening &&
                              errors?.employeeUsageInfo?.evening[3]
                                ?.busStopLineMappingId &&
                              "กรุณาเลือกจุดจอด"}
                          </FormErrorMessage>
                        </FormControl>
                      </Td>
                    </Tr>
                    <Tr>
                      <Td pl={0}>ศุกร์:</Td>
                      <Td pl={{ base: 1, md: 4 }} pr={{ base: 1, md: 2 }}>
                        <FormControl
                          isInvalid={
                            !!(
                              errors?.employeeUsageInfo &&
                              errors?.employeeUsageInfo?.morning &&
                              errors?.employeeUsageInfo?.morning[4] &&
                              errors?.employeeUsageInfo?.morning[4]?.busLineId
                            )
                          }
                        >
                          <Controller
                            name="employeeUsageInfo.morning.4.busLineId"
                            control={control}
                            render={({ field, fieldState }) => (
                              <SelectInput
                                menuPlacement="top"
                                isClearable
                                options={areaMorningOptions}
                                placeholder=""
                                {...field}
                                {...fieldState}
                                onChange={(v: any) => {
                                  field.onChange(v)
                                  if (!v) {
                                    setValue(
                                      "employeeUsageInfo.morning.4.busStopLineMappingId",
                                      null
                                    )
                                    unregister(
                                      "employeeUsageInfo.morning.4.busStopLineMappingId"
                                    )
                                  }
                                  if (v) {
                                    const busStopLineMappingId = get(
                                      employeeUsageInfo,
                                      "morning.4.busStopLineMappingId"
                                    )
                                    if (busStopLineMappingId) {
                                      const filteredBusStop = filter(
                                        v?.busStops,
                                        {
                                          busStopLineMappingId:
                                            busStopLineMappingId.value,
                                        }
                                      )
                                      if (
                                        !filteredBusStop ||
                                        filteredBusStop.length === 0
                                      ) {
                                        setValue(
                                          "employeeUsageInfo.morning.4.busStopLineMappingId",
                                          null
                                        )
                                        unregister(
                                          "employeeUsageInfo.morning.4.busStopLineMappingId"
                                        )
                                      }
                                    }
                                  }
                                }}
                              />
                            )}
                            rules={{ required: true }}
                          />
                          <FormErrorMessage>
                            {errors?.employeeUsageInfo &&
                              errors?.employeeUsageInfo?.morning &&
                              errors?.employeeUsageInfo?.morning[4]
                                ?.busLineId &&
                              "กรุณาเลือกพื้นที่"}
                          </FormErrorMessage>
                        </FormControl>
                      </Td>
                      <Td pl={{ base: 1, md: 2 }} pr={{ base: 1, md: 4 }}>
                        <FormControl
                          isInvalid={
                            !!(
                              errors?.employeeUsageInfo &&
                              errors?.employeeUsageInfo?.morning &&
                              errors?.employeeUsageInfo?.morning[4] &&
                              errors?.employeeUsageInfo?.morning[4]
                                ?.busStopLineMappingId
                            )
                          }
                        >
                          <Controller
                            name="employeeUsageInfo.morning.4.busStopLineMappingId"
                            control={control}
                            render={({ field, fieldState }) => (
                              <SelectInput
                                menuPlacement="top"
                                isClearable
                                options={
                                  get(
                                    employeeUsageInfo,
                                    "morning.4.busLineId.value"
                                  )
                                    ? filter(areaMorningOptions, {
                                        value: get(
                                          employeeUsageInfo,
                                          "morning.4.busLineId.value"
                                        ),
                                      })[0]?.busStops
                                    : []
                                }
                                placeholder=""
                                {...field}
                                {...fieldState}
                                isDisabled={
                                  !get(employeeUsageInfo, "morning.4.busLineId")
                                }
                              />
                            )}
                            rules={
                              get(employeeUsageInfo, "morning.4.busLineId")
                                ? { required: "กรุณาเลือกจุดจอด" }
                                : {}
                            }
                          />
                          <FormErrorMessage>
                            {errors?.employeeUsageInfo &&
                              errors?.employeeUsageInfo?.morning &&
                              errors?.employeeUsageInfo?.morning[4]
                                ?.busStopLineMappingId &&
                              "กรุณาเลือกจุดจอด"}
                          </FormErrorMessage>
                        </FormControl>
                      </Td>
                      <Td pl={{ base: 1, md: 4 }} pr={{ base: 1, md: 2 }}>
                        <FormControl
                          isInvalid={
                            !!(
                              errors?.employeeUsageInfo &&
                              errors?.employeeUsageInfo?.evening &&
                              errors?.employeeUsageInfo?.evening[4] &&
                              errors?.employeeUsageInfo?.evening[4]?.busLineId
                            )
                          }
                        >
                          <Controller
                            name="employeeUsageInfo.evening.4.busLineId"
                            control={control}
                            render={({ field, fieldState }) => (
                              <SelectInput
                                menuPlacement="top"
                                isClearable
                                options={areaEveningOptions}
                                placeholder=""
                                {...field}
                                {...fieldState}
                                onChange={(v: any) => {
                                  field.onChange(v)
                                  if (!v) {
                                    setValue(
                                      "employeeUsageInfo.evening.4.busStopLineMappingId",
                                      null
                                    )
                                    unregister(
                                      "employeeUsageInfo.evening.4.busStopLineMappingId"
                                    )
                                  }
                                  if (v) {
                                    const busStopLineMappingId = get(
                                      employeeUsageInfo,
                                      "evening.4.busStopLineMappingId"
                                    )
                                    if (busStopLineMappingId) {
                                      const filteredBusStop = filter(
                                        v?.busStops,
                                        {
                                          busStopLineMappingId:
                                            busStopLineMappingId.value,
                                        }
                                      )
                                      if (
                                        !filteredBusStop ||
                                        filteredBusStop.length === 0
                                      ) {
                                        setValue(
                                          "employeeUsageInfo.evening.4.busStopLineMappingId",
                                          null
                                        )
                                        unregister(
                                          "employeeUsageInfo.evening.4.busStopLineMappingId"
                                        )
                                      }
                                    }
                                  }
                                }}
                              />
                            )}
                            rules={{ required: true }}
                          />
                          <FormErrorMessage>
                            {errors?.employeeUsageInfo &&
                              errors?.employeeUsageInfo?.evening &&
                              errors?.employeeUsageInfo?.evening[4]
                                ?.busLineId &&
                              "กรุณาเลือกพื้นที่"}
                          </FormErrorMessage>
                        </FormControl>
                      </Td>
                      <Td pl={{ base: 1, md: 2 }} pr={{ base: 1, md: 4 }}>
                        <FormControl
                          isInvalid={
                            !!(
                              errors?.employeeUsageInfo &&
                              errors?.employeeUsageInfo?.evening &&
                              errors?.employeeUsageInfo?.evening[4] &&
                              errors?.employeeUsageInfo?.evening[4]
                                ?.busStopLineMappingId
                            )
                          }
                        >
                          <Controller
                            name="employeeUsageInfo.evening.4.busStopLineMappingId"
                            control={control}
                            render={({ field, fieldState }) => (
                              <SelectInput
                                menuPlacement="top"
                                isClearable
                                options={
                                  get(
                                    employeeUsageInfo,
                                    "evening.4.busLineId.value"
                                  )
                                    ? filter(areaEveningOptions, {
                                        value: get(
                                          employeeUsageInfo,
                                          "evening.4.busLineId.value"
                                        ),
                                      })[0]?.busStops
                                    : []
                                }
                                placeholder=""
                                {...field}
                                {...fieldState}
                                isDisabled={
                                  !get(employeeUsageInfo, "evening.4.busLineId")
                                }
                              />
                            )}
                            rules={
                              get(employeeUsageInfo, "evening.4.busLineId")
                                ? { required: "กรุณาเลือกจุดจอด" }
                                : {}
                            }
                          />
                          <FormErrorMessage>
                            {errors?.employeeUsageInfo &&
                              errors?.employeeUsageInfo?.evening &&
                              errors?.employeeUsageInfo?.evening[4]
                                ?.busStopLineMappingId &&
                              "กรุณาเลือกจุดจอด"}
                          </FormErrorMessage>
                        </FormControl>
                      </Td>
                    </Tr>
                    <Tr>
                      <Td pl={0}>เสาร์:</Td>
                      <Td pl={{ base: 1, md: 4 }} pr={{ base: 1, md: 2 }}>
                        <FormControl
                          isInvalid={
                            !!(
                              errors?.employeeUsageInfo &&
                              errors?.employeeUsageInfo?.morning &&
                              errors?.employeeUsageInfo?.morning[5] &&
                              errors?.employeeUsageInfo?.morning[5]?.busLineId
                            )
                          }
                        >
                          <Controller
                            name="employeeUsageInfo.morning.5.busLineId"
                            control={control}
                            render={({ field, fieldState }) => (
                              <SelectInput
                                menuPlacement="top"
                                isClearable
                                options={areaMorningOptions}
                                placeholder=""
                                {...field}
                                {...fieldState}
                                onChange={(v: any) => {
                                  field.onChange(v)
                                  if (!v) {
                                    setValue(
                                      "employeeUsageInfo.morning.5.busStopLineMappingId",
                                      null
                                    )
                                    unregister(
                                      "employeeUsageInfo.morning.5.busStopLineMappingId"
                                    )
                                  }
                                  if (v) {
                                    const busStopLineMappingId = get(
                                      employeeUsageInfo,
                                      "morning.5.busStopLineMappingId"
                                    )
                                    if (busStopLineMappingId) {
                                      const filteredBusStop = filter(
                                        v?.busStops,
                                        {
                                          busStopLineMappingId:
                                            busStopLineMappingId.value,
                                        }
                                      )
                                      if (
                                        !filteredBusStop ||
                                        filteredBusStop.length === 0
                                      ) {
                                        setValue(
                                          "employeeUsageInfo.morning.5.busStopLineMappingId",
                                          null
                                        )
                                        unregister(
                                          "employeeUsageInfo.morning.5.busStopLineMappingId"
                                        )
                                      }
                                    }
                                  }
                                }}
                              />
                            )}
                            rules={{ required: true }}
                          />
                          <FormErrorMessage>
                            {errors?.employeeUsageInfo &&
                              errors?.employeeUsageInfo?.morning &&
                              errors?.employeeUsageInfo?.morning[5]
                                ?.busLineId &&
                              "กรุณาเลือกพื้นที่"}
                          </FormErrorMessage>
                        </FormControl>
                      </Td>
                      <Td pl={{ base: 1, md: 2 }} pr={{ base: 1, md: 4 }}>
                        <FormControl
                          isInvalid={
                            !!(
                              errors?.employeeUsageInfo &&
                              errors?.employeeUsageInfo?.morning &&
                              errors?.employeeUsageInfo?.morning[5] &&
                              errors?.employeeUsageInfo?.morning[5]
                                ?.busStopLineMappingId
                            )
                          }
                        >
                          <Controller
                            name="employeeUsageInfo.morning.5.busStopLineMappingId"
                            control={control}
                            render={({ field, fieldState }) => (
                              <SelectInput
                                menuPlacement="top"
                                isClearable
                                options={
                                  get(
                                    employeeUsageInfo,
                                    "morning.5.busLineId.value"
                                  )
                                    ? filter(areaMorningOptions, {
                                        value: get(
                                          employeeUsageInfo,
                                          "morning.5.busLineId.value"
                                        ),
                                      })[0]?.busStops
                                    : []
                                }
                                placeholder=""
                                {...field}
                                {...fieldState}
                                isDisabled={
                                  !get(employeeUsageInfo, "morning.5.busLineId")
                                }
                              />
                            )}
                            rules={
                              get(employeeUsageInfo, "morning.5.busLineId")
                                ? { required: "กรุณาเลือกจุดจอด" }
                                : {}
                            }
                          />
                          <FormErrorMessage>
                            {errors?.employeeUsageInfo &&
                              errors?.employeeUsageInfo?.morning &&
                              errors?.employeeUsageInfo?.morning[5]
                                ?.busStopLineMappingId &&
                              "กรุณาเลือกจุดจอด"}
                          </FormErrorMessage>
                        </FormControl>
                      </Td>
                      <Td pl={{ base: 1, md: 4 }} pr={{ base: 1, md: 2 }}>
                        <FormControl
                          isInvalid={
                            !!(
                              errors?.employeeUsageInfo &&
                              errors?.employeeUsageInfo?.evening &&
                              errors?.employeeUsageInfo?.evening[5] &&
                              errors?.employeeUsageInfo?.evening[5]?.busLineId
                            )
                          }
                        >
                          <Controller
                            name="employeeUsageInfo.evening.5.busLineId"
                            control={control}
                            render={({ field, fieldState }) => (
                              <SelectInput
                                menuPlacement="top"
                                isClearable
                                options={areaEveningOptions}
                                placeholder=""
                                {...field}
                                {...fieldState}
                                onChange={(v: any) => {
                                  field.onChange(v)
                                  if (!v) {
                                    setValue(
                                      "employeeUsageInfo.evening.5.busStopLineMappingId",
                                      null
                                    )
                                    unregister(
                                      "employeeUsageInfo.evening.5.busStopLineMappingId"
                                    )
                                  }
                                  if (v) {
                                    const busStopLineMappingId = get(
                                      employeeUsageInfo,
                                      "evening.5.busStopLineMappingId"
                                    )
                                    if (busStopLineMappingId) {
                                      const filteredBusStop = filter(
                                        v?.busStops,
                                        {
                                          busStopLineMappingId:
                                            busStopLineMappingId.value,
                                        }
                                      )
                                      if (
                                        !filteredBusStop ||
                                        filteredBusStop.length === 0
                                      ) {
                                        setValue(
                                          "employeeUsageInfo.evening.5.busStopLineMappingId",
                                          null
                                        )
                                        unregister(
                                          "employeeUsageInfo.evening.5.busStopLineMappingId"
                                        )
                                      }
                                    }
                                  }
                                }}
                              />
                            )}
                            rules={{ required: true }}
                          />
                          <FormErrorMessage>
                            {errors?.employeeUsageInfo &&
                              errors?.employeeUsageInfo?.evening &&
                              errors?.employeeUsageInfo?.evening[5]
                                ?.busLineId &&
                              "กรุณาเลือกพื้นที่"}
                          </FormErrorMessage>
                        </FormControl>
                      </Td>
                      <Td pl={{ base: 1, md: 2 }} pr={{ base: 1, md: 4 }}>
                        <FormControl
                          isInvalid={
                            !!(
                              errors?.employeeUsageInfo &&
                              errors?.employeeUsageInfo?.evening &&
                              errors?.employeeUsageInfo?.evening[5] &&
                              errors?.employeeUsageInfo?.evening[5]
                                ?.busStopLineMappingId
                            )
                          }
                        >
                          <Controller
                            name="employeeUsageInfo.evening.5.busStopLineMappingId"
                            control={control}
                            render={({ field, fieldState }) => (
                              <SelectInput
                                menuPlacement="top"
                                isClearable
                                options={
                                  get(
                                    employeeUsageInfo,
                                    "evening.5.busLineId.value"
                                  )
                                    ? filter(areaEveningOptions, {
                                        value: get(
                                          employeeUsageInfo,
                                          "evening.5.busLineId.value"
                                        ),
                                      })[0]?.busStops
                                    : []
                                }
                                placeholder=""
                                {...field}
                                {...fieldState}
                                isDisabled={
                                  !get(employeeUsageInfo, "evening.5.busLineId")
                                }
                              />
                            )}
                            rules={
                              get(employeeUsageInfo, "evening.5.busLineId")
                                ? { required: "กรุณาเลือกจุดจอด" }
                                : {}
                            }
                          />
                          <FormErrorMessage>
                            {errors?.employeeUsageInfo &&
                              errors?.employeeUsageInfo?.evening &&
                              errors?.employeeUsageInfo?.evening[5]
                                ?.busStopLineMappingId &&
                              "กรุณาเลือกจุดจอด"}
                          </FormErrorMessage>
                        </FormControl>
                      </Td>
                    </Tr>
                    <Tr>
                      <Td pl={0}>อาทิตย์:</Td>
                      <Td pl={{ base: 1, md: 4 }} pr={{ base: 1, md: 2 }}>
                        <FormControl
                          isInvalid={
                            !!(
                              errors?.employeeUsageInfo &&
                              errors?.employeeUsageInfo?.morning &&
                              errors?.employeeUsageInfo?.morning[6] &&
                              errors?.employeeUsageInfo?.morning[6]?.busLineId
                            )
                          }
                        >
                          <Controller
                            name="employeeUsageInfo.morning.6.busLineId"
                            control={control}
                            render={({ field, fieldState }) => (
                              <SelectInput
                                menuPlacement="top"
                                isClearable
                                options={areaMorningOptions}
                                placeholder=""
                                {...field}
                                {...fieldState}
                                onChange={(v: any) => {
                                  field.onChange(v)
                                  if (!v) {
                                    setValue(
                                      "employeeUsageInfo.morning.6.busStopLineMappingId",
                                      null
                                    )
                                    unregister(
                                      "employeeUsageInfo.morning.6.busStopLineMappingId"
                                    )
                                  }
                                  if (v) {
                                    const busStopLineMappingId = get(
                                      employeeUsageInfo,
                                      "morning.6.busStopLineMappingId"
                                    )
                                    if (busStopLineMappingId) {
                                      const filteredBusStop = filter(
                                        v?.busStops,
                                        {
                                          busStopLineMappingId:
                                            busStopLineMappingId.value,
                                        }
                                      )
                                      if (
                                        !filteredBusStop ||
                                        filteredBusStop.length === 0
                                      ) {
                                        setValue(
                                          "employeeUsageInfo.morning.6.busStopLineMappingId",
                                          null
                                        )
                                        unregister(
                                          "employeeUsageInfo.morning.6.busStopLineMappingId"
                                        )
                                      }
                                    }
                                  }
                                }}
                              />
                            )}
                            rules={{ required: true }}
                          />
                          <FormErrorMessage>
                            {errors?.employeeUsageInfo &&
                              errors?.employeeUsageInfo?.morning &&
                              errors?.employeeUsageInfo?.morning[6]
                                ?.busLineId &&
                              "กรุณาเลือกพื้นที่"}
                          </FormErrorMessage>
                        </FormControl>
                      </Td>
                      <Td pl={{ base: 1, md: 2 }} pr={{ base: 1, md: 4 }}>
                        <FormControl
                          isInvalid={
                            !!(
                              errors?.employeeUsageInfo &&
                              errors?.employeeUsageInfo?.morning &&
                              errors?.employeeUsageInfo?.morning[6] &&
                              errors?.employeeUsageInfo?.morning[6]
                                ?.busStopLineMappingId
                            )
                          }
                        >
                          <Controller
                            name="employeeUsageInfo.morning.6.busStopLineMappingId"
                            control={control}
                            render={({ field, fieldState }) => (
                              <SelectInput
                                menuPlacement="top"
                                isClearable
                                options={
                                  get(
                                    employeeUsageInfo,
                                    "morning.6.busLineId.value"
                                  )
                                    ? filter(areaMorningOptions, {
                                        value: get(
                                          employeeUsageInfo,
                                          "morning.6.busLineId.value"
                                        ),
                                      })[0]?.busStops
                                    : []
                                }
                                placeholder=""
                                {...field}
                                {...fieldState}
                                isDisabled={
                                  !get(employeeUsageInfo, "morning.6.busLineId")
                                }
                              />
                            )}
                            rules={
                              get(employeeUsageInfo, "morning.6.busLineId")
                                ? { required: "กรุณาเลือกจุดจอด" }
                                : {}
                            }
                          />
                          <FormErrorMessage>
                            {errors?.employeeUsageInfo &&
                              errors?.employeeUsageInfo?.morning &&
                              errors?.employeeUsageInfo?.morning[6]
                                ?.busStopLineMappingId &&
                              "กรุณาเลือกจุดจอด"}
                          </FormErrorMessage>
                        </FormControl>
                      </Td>
                      <Td pl={{ base: 1, md: 4 }} pr={{ base: 1, md: 2 }}>
                        <FormControl
                          isInvalid={
                            !!(
                              errors?.employeeUsageInfo &&
                              errors?.employeeUsageInfo?.evening &&
                              errors?.employeeUsageInfo?.evening[6] &&
                              errors?.employeeUsageInfo?.evening[6]?.busLineId
                            )
                          }
                        >
                          <Controller
                            name="employeeUsageInfo.evening.6.busLineId"
                            control={control}
                            render={({ field, fieldState }) => (
                              <SelectInput
                                menuPlacement="top"
                                isClearable
                                options={areaEveningOptions}
                                placeholder=""
                                {...field}
                                {...fieldState}
                                onChange={(v: any) => {
                                  field.onChange(v)
                                  if (!v) {
                                    setValue(
                                      "employeeUsageInfo.evening.6.busStopLineMappingId",
                                      null
                                    )
                                    unregister(
                                      "employeeUsageInfo.evening.6.busStopLineMappingId"
                                    )
                                  }
                                  if (v) {
                                    const busStopLineMappingId = get(
                                      employeeUsageInfo,
                                      "evening.6.busStopLineMappingId"
                                    )
                                    if (busStopLineMappingId) {
                                      const filteredBusStop = filter(
                                        v?.busStops,
                                        {
                                          busStopLineMappingId:
                                            busStopLineMappingId.value,
                                        }
                                      )
                                      if (
                                        !filteredBusStop ||
                                        filteredBusStop.length === 0
                                      ) {
                                        setValue(
                                          "employeeUsageInfo.evening.6.busStopLineMappingId",
                                          null
                                        )
                                        unregister(
                                          "employeeUsageInfo.evening.6.busStopLineMappingId"
                                        )
                                      }
                                    }
                                  }
                                }}
                              />
                            )}
                            rules={{ required: true }}
                          />
                          <FormErrorMessage>
                            {errors?.employeeUsageInfo &&
                              errors?.employeeUsageInfo?.evening &&
                              errors?.employeeUsageInfo?.evening[6]
                                ?.busLineId &&
                              "กรุณาเลือกพื้นที่"}
                          </FormErrorMessage>
                        </FormControl>
                      </Td>
                      <Td pl={{ base: 1, md: 2 }} pr={{ base: 1, md: 4 }}>
                        <FormControl
                          isInvalid={
                            !!(
                              errors?.employeeUsageInfo &&
                              errors?.employeeUsageInfo?.evening &&
                              errors?.employeeUsageInfo?.evening[6] &&
                              errors?.employeeUsageInfo?.evening[6]
                                ?.busStopLineMappingId
                            )
                          }
                        >
                          <Controller
                            name="employeeUsageInfo.evening.6.busStopLineMappingId"
                            control={control}
                            render={({ field, fieldState }) => (
                              <SelectInput
                                menuPlacement="top"
                                isClearable
                                options={
                                  get(
                                    employeeUsageInfo,
                                    "evening.6.busLineId.value"
                                  )
                                    ? filter(areaEveningOptions, {
                                        value: get(
                                          employeeUsageInfo,
                                          "evening.6.busLineId.value"
                                        ),
                                      })[0]?.busStops
                                    : []
                                }
                                placeholder=""
                                {...field}
                                {...fieldState}
                                isDisabled={
                                  !get(employeeUsageInfo, "evening.6.busLineId")
                                }
                              />
                            )}
                            rules={
                              get(employeeUsageInfo, "evening.6.busLineId")
                                ? { required: "กรุณาเลือกจุดจอด" }
                                : {}
                            }
                          />
                          <FormErrorMessage>
                            {errors?.employeeUsageInfo &&
                              errors?.employeeUsageInfo?.evening &&
                              errors?.employeeUsageInfo?.evening[6]
                                ?.busStopLineMappingId &&
                              "กรุณาเลือกจุดจอด"}
                          </FormErrorMessage>
                        </FormControl>
                      </Td>
                    </Tr>
                  </Tbody>
                </Table>
              </Box>
            </Box>
            <Box>
              {data?.subordinateChannel === "manual" && (
                <Button
                  variant="ghost"
                  _focus={{ boxShadow: "none" }}
                  color="error.500"
                  textDecoration="underline"
                  onClick={() => {
                    setOpenConfirmDelete(true)
                  }}
                  p={0}
                >
                  ลบออกจากความดูแล
                </Button>
              )}
            </Box>
          </Flex>
        </form>
      </Container>
    </>
  )
}

export default Register
