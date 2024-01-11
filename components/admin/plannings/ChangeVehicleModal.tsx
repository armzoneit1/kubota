import { useState, useEffect } from "react"
import {
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Flex,
  Box,
  Text,
  Table,
  Thead,
  Tbody,
  Th,
  Tr,
  Td,
  Radio,
  useBreakpointValue,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from "@chakra-ui/react"
import TextInput from "../../input/TextInput"
import SelectInput from "../../input/SelectInput"
import { useForm, Controller, useFieldArray } from "react-hook-form"
import { DateTime } from "luxon"
import { useRouter } from "next/router"
import get from "lodash/get"

type ChangeVehicleModalProps = {
  isOpen: boolean
  onClose: () => void
  data: any
  differenceBusLineOptions: { value: number; label: string }[]
  sameBusLineOptions: { value: number; label: string }[]
  onSubmit: (values: any) => void
  isLoading: boolean
}

const ChangeVehicleModal = ({
  isOpen,
  onClose,
  data,
  differenceBusLineOptions,
  sameBusLineOptions,
  onSubmit: submit,
  isLoading,
}: ChangeVehicleModalProps) => {
  const router = useRouter()
  const bookingVehicleId = router?.query?.bookingVehicleId
  const scheduleId = router?.query?.id
  const size = useBreakpointValue({ base: "full", md: "5xl" })
  const [radioValue, setRadioValue] = useState("1")

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    control,
    setValue,
  } = useForm()

  useEffect(() => {
    setValue(
      "date",
      data?.data?.reservation?.date
        ? DateTime.fromJSDate(new Date(data?.data?.reservation?.date)).toFormat(
            "dd/MM/y"
          )
        : null
    )
    setValue(
      "time",
      data?.data?.reservation?.arrangements.timeTableRounds[0]?.time
    )
    setValue(
      "busLineName",
      data?.data?.reservation?.arrangements.timeTableRounds[0]?.busLines[0]
        ?.name
    )
    setValue(
      "vehicleTypeName",
      `${data?.data?.reservation?.arrangements.timeTableRounds[0]?.busLines[0]?.arrangedVehicles[0]?.vehicleTypeName} (${data?.data?.reservation?.arrangements.timeTableRounds[0]?.busLines[0]?.arrangedVehicles[0]?.totalBookingPassenger}/${data?.data?.reservation?.arrangements.timeTableRounds[0]?.busLines[0]?.arrangedVehicles[0]?.seatCapacity})`
    )
    if (
      data?.data?.reservation?.busStops &&
      data?.data?.reservation?.busStops.length > 0
    ) {
      data?.data?.reservation?.busStops.map((busStop: any, index: number) => {
        setValue(
          `busStops[${index}].busStopName`,
          `${index + 1}. ${busStop.busStopName}`
        )
      })
    }
    if (data?.data?.passengers && data?.data?.passengers.length > 0) {
      data?.data?.passengers.map((passenger: any, index: number) => {
        setValue(
          `passengers[${index}].name`,
          `${index + 1}. ${passenger.title}${passenger.firstName} ${
            passenger.lastName
          }`
        )
      })
    }
  }, [isOpen, data, setValue])

  function onSubmit(values: any) {
    const passengerBookingIds = data?.data?.passengers.map(
      (passenger: any) => passenger.bookingId
    )
    if (radioValue === "1") {
      values.transferToBookingVehicleId = get(values, "diffLine.value")
    } else if (radioValue === "2") {
      values.transferToBookingVehicleId = get(values, "sameLine.value")
    }

    submit({
      data: {
        passengerBookingIds,
        currentBookingVehicleId: bookingVehicleId && +bookingVehicleId,
        transferToBookingVehicleId: values.transferToBookingVehicleId,
        transferToBusStopLineMappingId: null,
      },
      scheduleId: scheduleId,
      periodOfDay: data?.data?.reservation?.periodOfDay,
      timeTableRoundId:
        data?.data?.reservation?.arrangements.timeTableRounds[0]
          ?.timeTableRoundId,
    })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={size}>
      <ModalOverlay />
      <ModalContent p={{ base: 2, md: 12 }}>
        <ModalHeader
          color="primary.500"
          mb={10}
          fontSize="28px"
          fontWeight={700}
        >
          ย้ายสายรถ
        </ModalHeader>
        {size === "full" && <ModalCloseButton />}
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <Flex flexDirection="column">
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
                    ข้อมูลการจอง
                  </Text>
                </Box>
                <Box
                  bgColor="#F5F5F5"
                  width={{ base: "100%", md: "80%" }}
                  p={{ base: 8, md: 12 }}
                  borderRadius="8px"
                >
                  <Flex mb={10} w={{ base: "100%", md: "80%" }}>
                    <Box w="50%" mr={{ base: 2, md: 5 }}>
                      <TextInput
                        name="date"
                        label="วันที่ขึ้น"
                        defaultValue={
                          data?.data?.reservation?.date
                            ? DateTime.fromJSDate(
                                new Date(data?.data?.reservation?.date)
                              ).toFormat("dd/MM/y")
                            : null
                        }
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
                        name="time"
                        label="เวลาที่ขึ้นรถ"
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
                  <Flex w={{ base: "100%", md: "80%" }} flexWrap="wrap">
                    {data?.data?.reservation?.busStops &&
                      data?.data?.reservation?.busStops.map(
                        (busStop: any, index: number) => (
                          <Box w="50%" key={index} display="flex">
                            <TextInput
                              name={`busStops[${index}].busStopName`}
                              label="จุดจอด"
                              colorLabel={
                                index === 0 ? "primary.500" : "#F5F5F5"
                              }
                              register={register}
                              errors={errors}
                              variant="unstyles"
                              bgColor="inherit"
                              isDisabled={true}
                              p={
                                index % 2 === 0
                                  ? 0
                                  : { base: "0 4px", md: "0 10px" }
                              }
                            />
                          </Box>
                        )
                      )}
                  </Flex>
                </Box>
              </Flex>
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
                    รายชื่อคนจอง
                  </Text>
                </Box>
                <Box
                  bgColor="#F5F5F5"
                  width={{ base: "100%", md: "80%" }}
                  p={{ base: 8, md: 12 }}
                  borderRadius="8px"
                >
                  <Flex w={{ base: "100%", md: "80%" }} flexWrap="wrap">
                    {data?.data?.passengers &&
                      data?.data?.passengers.map(
                        (passenger: any, index: number) => (
                          <Box w="50%" key={index} display="flex">
                            <TextInput
                              name={`passengers[${index}].name`}
                              label={index > 1 ? null : "ชื่อ-นามสกุล"}
                              colorLabel={
                                index === 0 ? "primary.500" : "#F5F5F5"
                              }
                              register={register}
                              errors={errors}
                              variant="unstyles"
                              bgColor="inherit"
                              isDisabled={true}
                              p={
                                index % 2 === 0
                                  ? 0
                                  : { base: "0 4px", md: "0 10px" }
                              }
                            />
                          </Box>
                        )
                      )}
                  </Flex>
                </Box>
              </Flex>
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
                  <Radio
                    value="1"
                    isChecked={radioValue === "1"}
                    onChange={(e) => {
                      setRadioValue(e.target.value)
                    }}
                  >
                    <Text fontSize="20px" fontWeight={600}>
                      ย้ายสายรถ
                    </Text>
                  </Radio>
                </Box>
                <Box
                  bgColor={"#F5F5F5"}
                  width={{ base: "100%", md: "80%" }}
                  p={{ base: 8, md: 12 }}
                  borderRadius="8px"
                  cursor={radioValue === "1" ? "inherit" : "not-allowed"}
                >
                  <Box
                    w={{ base: "100%", md: "80%" }}
                    mr={{ base: 2, md: 5 }}
                    mb={10}
                  >
                    <TextInput
                      name="busLineName"
                      label="สายรถเดิม"
                      colorLabel="primary.500"
                      register={register}
                      errors={errors}
                      variant="unstyles"
                      bgColor="inherit"
                      isDisabled={true}
                      p={0}
                    />
                  </Box>
                  <FormControl
                    isInvalid={!!errors.diffLine}
                    w={{ base: "100%", md: "80%" }}
                    mr={{ base: 2, md: 5 }}
                  >
                    <FormLabel htmlFor="diffLine">
                      สายรถที่ต้องการย้าย
                    </FormLabel>
                    <Controller
                      name="diffLine"
                      control={control}
                      render={({ field, fieldState }) => (
                        <SelectInput
                          options={differenceBusLineOptions}
                          placeholder=""
                          {...field}
                          {...fieldState}
                          isDisabled={radioValue !== "1"}
                          isOptionDisabled={(option: any) =>
                            option?.disabled ||
                            option?.totalBookingPassenger +
                              data?.data?.passengers.length >
                              option?.seatCapacity
                          }
                        />
                      )}
                      rules={{
                        required:
                          radioValue === "1" ? "กรุณาเลือกสายรถ" : false,
                      }}
                    />
                    <FormErrorMessage>
                      {errors.diffLine && errors.diffLine.message}
                    </FormErrorMessage>
                  </FormControl>
                </Box>
              </Flex>
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
                  <Radio
                    value="2"
                    isChecked={radioValue === "2"}
                    onChange={(e) => {
                      setRadioValue(e.target.value)
                    }}
                  >
                    <Text fontSize="20px" fontWeight={600}>
                      ย้ายรถ
                    </Text>
                  </Radio>
                </Box>
                <Box
                  bgColor={"#F5F5F5"}
                  width={{ base: "100%", md: "80%" }}
                  p={{ base: 8, md: 12 }}
                  borderRadius="8px"
                  cursor={radioValue === "2" ? "inherit" : "not-allowed"}
                >
                  <Box
                    w={{ base: "100%", md: "80%" }}
                    mr={{ base: 2, md: 5 }}
                    mb={10}
                  >
                    <TextInput
                      name="vehicleTypeName"
                      label="รถคันเดิม"
                      colorLabel="primary.500"
                      register={register}
                      errors={errors}
                      variant="unstyles"
                      bgColor="inherit"
                      isDisabled={true}
                      p={0}
                    />
                  </Box>
                  <FormControl
                    isInvalid={!!errors.sameLine}
                    w={{ base: "100%", md: "80%" }}
                    mr={{ base: 2, md: 5 }}
                  >
                    <FormLabel htmlFor="sameLine">
                      รถที่ต้องการย้าย (ในสายเดียวกัน)
                    </FormLabel>
                    <Controller
                      name="sameLine"
                      control={control}
                      render={({ field, fieldState }) => (
                        <SelectInput
                          options={sameBusLineOptions}
                          placeholder=""
                          {...field}
                          {...fieldState}
                          isDisabled={radioValue !== "2"}
                          isOptionDisabled={(option: any) =>
                            option?.disabled ||
                            option?.totalBookingPassenger +
                              data?.data?.passengers.length >
                              option?.seatCapacity
                          }
                        />
                      )}
                      rules={{
                        required: radioValue === "2" ? "กรุณาเลือกรถ" : false,
                      }}
                    />
                    <FormErrorMessage>
                      {errors.sameLine && errors.sameLine.message}
                    </FormErrorMessage>
                  </FormControl>
                </Box>
              </Flex>
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="ghost"
              color="#333333"
              onClick={onClose}
              mr={3}
              _focus={{ boxShadow: "none" }}
            >
              ยกเลิก
            </Button>
            <Button
              _focus={{ boxShadow: "none" }}
              type="submit"
              isLoading={isSubmitting || isLoading}
            >
              ยืนยัน
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}

export default ChangeVehicleModal
