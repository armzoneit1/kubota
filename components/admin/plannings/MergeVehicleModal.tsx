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
  useBreakpointValue,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Select,
} from "@chakra-ui/react"
import { useForm, Controller } from "react-hook-form"
import SelectInput from "../../input/SelectInput"
import { useMemo } from "react"
import get from "lodash/get"

type MergeVehicleModalProps = {
  isOpen: boolean
  onClose: () => void
  vehicleSelected: any[]
  isDiffBusLine: boolean
  onMergeVehiclesSameBusLine: (values: any) => void
  onMergeVehiclesDifferenceBusLine: (values: any) => void
  isLoadingMergeVehiclesSameBusLine: boolean
  isLoadingMergeVehiclesDifferenceBusLine: boolean
  vehicleTypeOptions: { value: number; label: string; seatCapacity: number }[]
  scheduleId: string | string[] | undefined
  periodOfDay: string
  timeTableRoundId: number | null
}

const MergeVehicleModal = ({
  isOpen,
  onClose,
  vehicleSelected,
  isDiffBusLine,
  onMergeVehiclesSameBusLine,
  onMergeVehiclesDifferenceBusLine,
  isLoadingMergeVehiclesSameBusLine,
  isLoadingMergeVehiclesDifferenceBusLine,
  vehicleTypeOptions,
  scheduleId,
  periodOfDay,
  timeTableRoundId,
}: MergeVehicleModalProps) => {
  const totalPassenger = useMemo(
    () =>
      vehicleSelected
        ? vehicleSelected.reduce((acc, curr) => {
            acc += curr.totalBookingPassenger
            return acc
          }, 0)
        : 0,
    [vehicleSelected]
  )

  const size = useBreakpointValue({ base: "full", md: "5xl" })

  const busLineOptions = useMemo(
    () =>
      vehicleSelected
        ? vehicleSelected.map((vehicle) => ({
            value: vehicle.busLineId,
            label: `สาย${vehicle.busLineName} ${vehicle.time}  ${vehicle.vehicleTypeName}(${vehicle.passengers.length}/${vehicle.seatCapacity})`,
            timeTableRoundId: vehicle?.timeTableRoundId,
          }))
        : [],
    [vehicleSelected]
  )

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    control,
  } = useForm({ mode: "onBlur" })

  function onSubmit(values: any) {
    if (isDiffBusLine) {
      const mergeToTransportationProviderBookingVehicleTypeMappingId = get(
        values,
        "mergeToTransportationProviderBookingVehicleTypeMappingId.value"
      )
      const mainBusLineId = get(values, "mainBusLineId.value")
      const roundId = get(values, "mainBusLineId.timeTableRoundId")
      const mergeBookingVehicleIds = vehicleSelected.map(
        (vehicle) => vehicle.bookingVehicleId
      )
      onMergeVehiclesDifferenceBusLine({
        scheduleId,
        periodOfDay,
        timeTableRoundId: roundId,
        data: {
          mergeToTransportationProviderBookingVehicleTypeMappingId,
          mainBusLineId,
          mergeBookingVehicleIds,
        },
        onClose: onClose,
      })
    } else {
      const mergeToTransportationProviderBookingVehicleTypeMappingId = get(
        values,
        "mergeToTransportationProviderBookingVehicleTypeMappingId.value"
      )
      const mergeBookingVehicleIds = vehicleSelected.map(
        (vehicle) => vehicle.bookingVehicleId
      )
      onMergeVehiclesSameBusLine({
        scheduleId,
        periodOfDay,
        timeTableRoundId: vehicleSelected?.[0]?.timeTableRoundId,
        data: {
          mergeToTransportationProviderBookingVehicleTypeMappingId,
          mergeBookingVehicleIds,
        },
        onClose: onClose,
      })
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={size}>
      <ModalOverlay />
      <ModalContent p={{ base: 2, md: 12 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader
            color="primary.500"
            mb={10}
            fontSize="28px"
            fontWeight={700}
          >
            รวมรถ
          </ModalHeader>
          {size === "full" && <ModalCloseButton />}
          <ModalBody>
            <Flex
              width="100%"
              minH="100%"
              flexDirection={{ base: "column", md: "row" }}
              mb={{ base: 2, md: 6 }}
            >
              <Box width={{ base: "100%", md: "20%" }} mb={{ base: 4, md: 0 }}>
                <Text fontSize="20px" fontWeight={600}>
                  ข้อมูลการย้ายรถ
                </Text>
              </Box>
              <Box
                bgColor="#F5F5F5"
                width={{ base: "100%", md: "80%" }}
                p={{ base: 8, md: 12 }}
                borderRadius="8px"
              >
                <Flex flexDirection="column">
                  <Text color="primary.500" fontWeight={600} mb={2}>
                    สายรถเดิม
                  </Text>
                  {vehicleSelected &&
                    vehicleSelected.length > 0 &&
                    vehicleSelected.map((v, index) => (
                      <Flex key={index} mb={2}>
                        <Text>{index + 1}.&nbsp;&nbsp; </Text>
                        <Text>{v.busLineName}&nbsp;&nbsp;</Text>
                        <Text>เวลา {v.time}น.&nbsp;&nbsp;</Text>
                        <Text>
                          {v.vehicleTypeName}({v.passengers.length}/
                          {v.seatCapacity})
                        </Text>
                      </Flex>
                    ))}
                  {isDiffBusLine && (
                    <FormControl
                      isInvalid={!!errors.mainBusLineId}
                      w={{ base: "100%", md: "80%" }}
                      mt={4}
                    >
                      <FormLabel htmlFor="mainBusLineId">
                        สายรถหลัก (ที่ต้องการย้ายไป)
                      </FormLabel>
                      <Controller
                        name="mainBusLineId"
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
                        {errors.mainBusLineId && errors.mainBusLineId.message}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                  <FormControl
                    isInvalid={
                      !!errors.mergeToTransportationProviderBookingVehicleTypeMappingId
                    }
                    w={{ base: "100%", md: "80%" }}
                    mt={4}
                  >
                    <FormLabel htmlFor="mergeToTransportationProviderBookingVehicleTypeMappingId">
                      ประเภทรถที่เกิดจากการรวมรถ
                    </FormLabel>
                    <Controller
                      name="mergeToTransportationProviderBookingVehicleTypeMappingId"
                      control={control}
                      render={({ field, fieldState }) => (
                        <SelectInput
                          options={vehicleTypeOptions}
                          placeholder=""
                          {...field}
                          {...fieldState}
                        />
                      )}
                      rules={{
                        required: "กรุณาเลือกประเภทรถ",
                        validate: (value) => {
                          if (value?.seatCapacity < totalPassenger) {
                            return "ประเภทรถที่เลือกมีจำนวนที่นั่งไม่พอ"
                          }
                        },
                      }}
                    />
                    <FormErrorMessage>
                      {errors.mergeToTransportationProviderBookingVehicleTypeMappingId &&
                        errors
                          .mergeToTransportationProviderBookingVehicleTypeMappingId
                          .message}
                    </FormErrorMessage>
                  </FormControl>
                </Flex>
              </Box>
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
              isLoading={
                isSubmitting ||
                isLoadingMergeVehiclesSameBusLine ||
                isLoadingMergeVehiclesDifferenceBusLine
              }
            >
              ยืนยัน
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}

export default MergeVehicleModal
