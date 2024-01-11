import {
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Flex,
  FormErrorMessage,
  FormLabel,
  FormControl,
  Box,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Text,
  Link,
  Input,
} from "@chakra-ui/react"
import { useForm, Controller } from "react-hook-form"
import TextInput from "../../input/TextInput"
import SelectInput from "../../input/SelectInput"
import Datepicker from "../../input/Datepicker"
import { DateTime } from "luxon"
import { MdMoreVert } from "react-icons/md"
import { useState, useMemo } from "react"
import { BookingDataTypes } from "../../../data-hooks/requests/types"
import { BusLineDataTypes } from "../../../data-hooks/busLines/types"
import filter from "lodash/filter"
import get from "lodash/get"
import RequestSelectInput from "./RequestSelectInput"
import ConfirmDialog from "../../ConfirmDialog"
import NextLink from "next/link"
import { AreaDataTypes } from "../../../data-hooks/requests/types"
import uniq from "lodash/uniq"
import sortBy from "lodash/sortBy"

type RequestEditFormProps = {
  onClose: () => void
  data: BookingDataTypes
  onSubmit: (values: any) => void
  isLoading: boolean
  onCancel: (values: any) => void
  isLoadingCancel: boolean
  busLine: BusLineDataTypes<boolean>[]
  periodOfDay: "morning" | "evening"
  areas: AreaDataTypes[]
}

const RequestEditForm = ({
  onClose,
  data,
  onSubmit: submit,
  isLoading,
  onCancel,
  isLoadingCancel,
  busLine,
  periodOfDay,
  areas,
}: RequestEditFormProps) => {
  const [date, setDate] = useState<Date | string | null>(null)
  const [isOpenConfirm, setOpenConfirm] = useState<boolean>(false)
  const [warning, setWarning] = useState<any | null>(null)
  const busLineOptions = useMemo(
    () =>
      busLine
        ? filter(busLine, { status: true }).map((busLine) => {
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
    [busLine]
  )

  const areaOptions = useMemo(
    () =>
      areas && busLine
        ? filter(areas, { status: true }).map((area) => {
            const busStopIds = filter(area.busStops, {
              status: true,
            }).map((busStop) => ({
              busStopId: busStop.busStopId,
              name: busStop.busStopName,
            }))

            const busStops = uniq(busStopIds).reduce((acc: any[], curr) => {
              const findBusStop = filter(busLine, { status: true })
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
    [areas, busLine]
  )

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    control,
    setValue,
    watch,
    unregister,
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      ...data,
      employee: `${data?.employeeNo} / ${data?.prefixName}${data?.firstName} ${data?.lastName}`,
      date: data?.date ? new Date(data.date) : null,
      busLineId:
        areaOptions && data?.busStopLineMappingId
          ? filter(areaOptions, (value) => {
              return (
                filter(value.busStops, {
                  value: data?.busStopLineMappingId,
                }).length > 0
              )
            })[0]
          : null,
      timeTableRoundId: data?.timeTableRoundId
        ? { value: data?.timeTableRoundId, label: data?.time }
        : null,
      busStopLineMappingId:
        areaOptions && data?.busStopLineMappingId
          ? filter(
              filter(areaOptions, (value) => {
                return (
                  filter(value.busStops, {
                    value: data?.busStopLineMappingId,
                  }).length > 0
                )
              })[0]?.busStops,
              {
                value: data?.busStopLineMappingId,
              }
            )[0]
          : null,
    },
  })

  const watchBusStopLineMappingId = watch("busStopLineMappingId")
  const watchBusLineId = watch("busLineId")
  const watchDate = watch("date")

  const onSubmit = (values: any) => {
    const timeTableRoundId = get(values?.timeTableRoundId, "value")
    const busStopLineMappingId = get(values?.busStopLineMappingId, "value")
    const date = DateTime.fromJSDate(new Date(values?.date)).toFormat("y-MM-dd")
    submit({
      bookingId: data.id,
      data: { timeTableRoundId, busStopLineMappingId, date },
      onClose,
    })
  }

  const handleSetWarning = (warning: any, field: any) => {
    setWarning(warning)
  }

  return (
    <>
      <ConfirmDialog
        isOpen={isOpenConfirm}
        onClose={() => {
          setOpenConfirm(false)
        }}
        title="ยกเลิกการจอง"
        content="คุณยืนยันที่จะยกเลิกการจอง ใช่หรือไม่ ?"
        type="error"
        isLoading={isLoadingCancel}
        onSubmit={() => {
          onCancel({ bookingId: data.id, onClose, from: "list" })
        }}
      />
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader
            px={10}
            py={8}
            display="flex"
            justifyContent="space-between"
          >
            <Text>แก้ไขการจอง</Text>
            <Menu placement="left-start">
              <MenuButton
                as={IconButton}
                icon={<MdMoreVert />}
                variant="ghost"
                fontSize="20px"
                color="#333333"
                _focus={{ boxShadow: "none" }}
                px={0}
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
                  fontSize="16px"
                  onClick={() => {
                    setOpenConfirm(true)
                  }}
                >
                  ยกเลิกการจอง
                </MenuItem>
              </MenuList>
            </Menu>
          </ModalHeader>
          <ModalBody px={10}>
            <Flex flexDirection="column">
              <Flex
                mb={10}
                width={{ base: "100%", md: "80%", lg: "60%" }}
                justifyContent="space-between"
              >
                <Box mr={3}>
                  <TextInput
                    name="employee"
                    label="รหัส / ชื่อพนักงาน"
                    errors={errors}
                    register={register}
                    variant="unstyled"
                    disabled={true}
                    autocomplete="off"
                    minWidth={250}
                    fontWeightLabel={600}
                  />
                </Box>
                <Box mr={3}>
                  <FormControl isInvalid={!!errors.requestId}>
                    <FormLabel htmlFor="requestId" fontWeight={600}>
                      ID การจอง
                    </FormLabel>
                    <NextLink
                      href={`/employee/requests/requestId/${data.requestId}`}
                      passHref
                    >
                      <Link _focus={{}} _hover={{}}>
                        <Input
                          id="requestId"
                          borderColor="#B2CCCC"
                          _focus={{
                            borderColor: "#B2CCCC",
                            boxShadow: "0 0 0 1px #00A5A8",
                          }}
                          {...register("requestId")}
                          minWidth="250px"
                          fontWeight={500}
                          color="#00A5A8"
                          variant="unstyled"
                          disabled={true}
                          cursor="pointer"
                        />
                      </Link>
                    </NextLink>
                    <FormErrorMessage>
                      {errors.requestId && errors.requestId.message}
                    </FormErrorMessage>
                  </FormControl>
                </Box>
              </Flex>
              <Flex
                mb={10}
                width="100%"
                justifyContent="space-between"
                alignItems={{ base: "flex-end", md: "inherit" }}
              >
                <Box width="50%" mr={3}>
                  <FormLabel
                    htmlFor={`date`}
                    display="flex"
                    flexDirection={{ base: "column", md: "row" }}
                  >
                    วัน/เดือน/ปี{" "}
                    <Text color="#E53E3E" ml={{ base: 0, md: 4 }}>
                      {warning ? `(${warning})` : ""}
                    </Text>
                  </FormLabel>
                  <Controller
                    name="date"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Datepicker
                        date={date}
                        setDate={setDate}
                        field={field}
                        fieldState={fieldState}
                        dateFormat="dd/MM/yyyy (ccc)"
                        customOnChange={true}
                        minDate={new Date()}
                        onChange={(date: any) => {
                          setDate(date)
                          field.onChange(date)
                          if (!(date === watchDate))
                            setValue(`timeTableRoundId`, null)
                          unregister(`timeTableRoundId`)
                        }}
                      />
                    )}
                    rules={{ required: "กรุณาเลือกวันที่" }}
                  />
                </Box>
                <FormControl isInvalid={!!errors.timeTableRoundId} width="50%">
                  <FormLabel fontWeight={400} htmlFor="timeTableRoundId">
                    รอบเวลา
                  </FormLabel>
                  <Controller
                    name="timeTableRoundId"
                    control={control}
                    render={({ field, fieldState }) => (
                      <RequestSelectInput
                        placeholder=""
                        {...field}
                        {...fieldState}
                        isDisabled={!watchDate}
                        date={watchDate ? watchDate : null}
                        periodOfDay={periodOfDay}
                        handleSetWarning={handleSetWarning}
                        fieldName={"warning"}
                      />
                    )}
                    rules={{
                      required: "กรุณาเลือกรอบเวลา",
                      validate: (value: any) => {
                        if (value) {
                          if (!value?.status) return "รอบเวลาที่เลือกปิดการจอง"
                        } else return
                      },
                    }}
                  />
                  <FormErrorMessage>
                    {errors.timeTableRoundId &&
                      get(errors.timeTableRoundId, "message")}
                  </FormErrorMessage>
                </FormControl>
              </Flex>
              <Flex mb={10} width="100%" justifyContent="space-between">
                <FormControl isInvalid={!!errors.busLineId} width="50%" mr={3}>
                  <FormLabel fontWeight={400} htmlFor="busLine">
                    พื้นที่
                  </FormLabel>
                  <Controller
                    name="busLineId"
                    control={control}
                    render={({ field, fieldState }) => (
                      <SelectInput
                        options={areaOptions}
                        placeholder=""
                        {...field}
                        {...fieldState}
                        onChange={(v: any) => {
                          field.onChange(v)
                          if (!v) {
                            setValue("busStopLineMappingId", null)
                            unregister("busStopLineMappingId")
                          }
                          if (v) {
                            const busStopLineMappingId = get(
                              watchBusStopLineMappingId,
                              "value"
                            )
                            if (busStopLineMappingId) {
                              const filteredBusStop = filter(v?.busStops, {
                                busStopLineMappingId: busStopLineMappingId,
                              })
                              if (
                                !filteredBusStop ||
                                filteredBusStop.length === 0
                              ) {
                                setValue("busStopLineMappingId", null)
                                unregister("busStopLineMappingId")
                              }
                            }
                          }
                        }}
                      />
                    )}
                  />
                  <FormErrorMessage>
                    {errors.busLineId && "กรุณาเลือกพื้นที่"}
                  </FormErrorMessage>
                </FormControl>
                <FormControl
                  isInvalid={!!errors.busStopLineMappingId}
                  width="50%"
                >
                  <FormLabel fontWeight={400} htmlFor="busStopLineMappingId">
                    จุดลงรถ
                  </FormLabel>
                  <Controller
                    name="busStopLineMappingId"
                    control={control}
                    render={({ field, fieldState }) => (
                      <>
                        <SelectInput
                          options={
                            get(watchBusLineId, "value")
                              ? filter(areaOptions, {
                                  value: get(watchBusLineId, "value"),
                                })[0]?.busStops
                              : []
                          }
                          placeholder=""
                          {...field}
                          {...fieldState}
                          isDisabled={!get(watchBusLineId, "value")}
                        />
                        <Text
                          fontStyle="italic"
                          fontWeight={300}
                          color="#333333"
                          mt={2}
                          fontSize="14px"
                        >
                          (สายรถแสดงหลังจากที่จัดรถสำเร็จ)
                        </Text>
                      </>
                    )}
                    rules={
                      get(watchBusLineId, "value")
                        ? { required: "กรุณาเลือกจุดจอด" }
                        : {}
                    }
                  />
                  <FormErrorMessage>
                    {errors.busStopLineMappingId && "กรุณาเลือกจุดจอด"}
                  </FormErrorMessage>
                </FormControl>
              </Flex>
            </Flex>
          </ModalBody>
          <ModalFooter>
            <ModalFooter>
              <Button
                variant="ghost"
                _focus={{ boxShadow: "none" }}
                onClick={onClose}
                color="#333333"
                mr={4}
              >
                ยกเลิก
              </Button>
              <Button
                _focus={{ boxShadow: "none" }}
                type="submit"
                isLoading={isSubmitting || isLoading}
              >
                บันทึก
              </Button>
            </ModalFooter>
          </ModalFooter>
        </form>
      </ModalContent>
    </>
  )
}

export default RequestEditForm
