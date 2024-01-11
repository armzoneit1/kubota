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
  busStopLineMappingOptions: { value: number; label: string }[]
  onSubmit: (values: any) => void
  isLoading: boolean
}

const ChangeVehicleModal = ({
  isOpen,
  onClose,
  data,
  busStopLineMappingOptions,
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

    submit({
      data: {
        passengerBookingIds,
        currentBookingVehicleId: bookingVehicleId && +bookingVehicleId,
        transferToBookingVehicleId: bookingVehicleId && +bookingVehicleId,
        transferToBusStopLineMappingId:
          values.transferToBusStopLineMappingId.value ?? null,
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
          ย้ายจุดจอด
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
                    ผู้โดยสาร
                  </Text>
                </Box>
                <Box
                  bgColor="#F5F5F5"
                  width={{ base: "100%", md: "80%" }}
                  p={{ base: 8, md: 12 }}
                  borderRadius="8px"
                >
                  <Table variant="unstyled">
                    <Thead>
                      <Tr>
                        <Th px={2} color="primary.500" fontSize={"md"}>
                          ชื่อผู้โดยสาร
                        </Th>
                        <Th px={2} color="primary.500" fontSize={"md"}>
                          จุดจอดเดิม
                        </Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {data?.data?.passengers?.map(
                        (passenger: any, index: number) => {
                          return (
                            <Tr key={index}>
                              <Td px={2}>
                                <Text>
                                  {`${index + 1}. ${passenger.firstName} ${
                                    passenger.lastName
                                  }`}
                                </Text>
                              </Td>
                              <Td px={2}>
                                <Text>
                                  {passenger.busStopLineMapping.busStopName}
                                </Text>
                              </Td>
                            </Tr>
                          )
                        }
                      )}
                    </Tbody>
                  </Table>
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
                    ย้ายไป
                  </Text>
                </Box>
                <Box
                  bgColor="#F5F5F5"
                  width={{ base: "100%", md: "80%" }}
                  p={{ base: 8, md: 12 }}
                  borderRadius="8px"
                >
                  <Flex mb={10} w={{ base: "100%", md: "80%" }}>
                    <FormControl
                      isInvalid={!!errors.transferToBusStopLineMappingId}
                      w={{ base: "100%", md: "80%" }}
                      mr={{ base: 2, md: 5 }}
                    >
                      <FormLabel htmlFor="transferToBusStopLineMappingId">
                        {data?.data?.reservation?.arrangements
                          ?.timeTableRounds[0]?.busLines[0]?.name ?? "-"}
                      </FormLabel>
                      <Controller
                        name="transferToBusStopLineMappingId"
                        control={control}
                        render={({ field, fieldState }) => (
                          <SelectInput
                            options={busStopLineMappingOptions}
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
                      />
                      <FormErrorMessage>
                        {errors.transferToBusStopLineMappingId &&
                          errors.transferToBusStopLineMappingId.message}
                      </FormErrorMessage>
                    </FormControl>
                  </Flex>
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
