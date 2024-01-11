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
} from "@chakra-ui/react"
import { useForm } from "react-hook-form"
import TextInput from "../../input/TextInput"

type AddDriverModalProps = {
  isOpen: boolean
  onClose: () => void
  transportationProviderId?: number
  bookingVehicleId?: number
  timeTableRoundId?: number
  transportationProviderName?: string
  onSubmit: (values: any) => void
  isLoading: boolean
  handleSetDriver: (
    driver: any,
    timeTableRoundId: number,
    bookingVehicleId: number
  ) => void
}

const AddDriverModal = ({
  isOpen,
  onClose,
  transportationProviderId,
  transportationProviderName,
  onSubmit: submit,
  isLoading,
  bookingVehicleId,
  timeTableRoundId,
  handleSetDriver,
}: AddDriverModalProps) => {
  const size = useBreakpointValue({ base: "full", md: "5xl" })
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    control,
    reset,
  } = useForm({ defaultValues: { transportationProviderName } })

  function onSubmit(values: any) {
    submit({
      transportationProviderId,
      data: values,
      onClose,
      handleSetDriver,
      timeTableRoundId,
      bookingVehicleId,
    })
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        reset()
        onClose()
      }}
      size={size}
    >
      <ModalOverlay />
      <ModalContent p={{ base: 2, md: 12 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader
            color="primary.500"
            mb={10}
            fontSize="28px"
            fontWeight={700}
          >
            เพิ่มคนขับใหม่
          </ModalHeader>
          {size === "full" && <ModalCloseButton />}
          <ModalBody>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Flex
                width="100%"
                minH="100%"
                flexDirection={{ base: "column", md: "row" }}
                mb={{ base: 2, md: 6 }}
              >
                <Box
                  width={{ base: "100%", md: "20%" }}
                  mb={{ base: 4, md: 0 }}
                >
                  <Text fontSize="20px" fontWeight={600}>
                    ข้อมูลคนขับ
                  </Text>
                </Box>
                <Box
                  bgColor="#F5F5F5"
                  width={{ base: "100%", md: "80%" }}
                  p={{ base: 8, md: 12 }}
                  borderRadius="8px"
                >
                  <Flex
                    mb={10}
                    width={{ base: "100%", md: "80%" }}
                    justifyContent="space-between"
                  >
                    <Box w="50%" mr={3}>
                      <TextInput
                        name="transportationProviderName"
                        label="ผู้ให้บริการรถ"
                        errors={errors}
                        register={register}
                        variant="unstyled"
                        disabled={true}
                        autocomplete="off"
                        colorLabel="primary.500"
                        defaultValue="บริษัท exam 01"
                      />
                    </Box>
                  </Flex>
                  <Flex
                    width={{ base: "100%", md: "80%" }}
                    mb={10}
                    justifyContent="space-between"
                  >
                    <Box w="50%" mr={3}>
                      <TextInput
                        name="firstName"
                        label="ชื่อ"
                        register={register}
                        errors={errors}
                        validation={{ required: "กรุณากรอกชื่อ" }}
                      />
                    </Box>
                    <Box w="50%">
                      <TextInput
                        name="lastName"
                        label="นามสกุล"
                        register={register}
                        errors={errors}
                        validation={{ required: "กรุณากรอกนามสกุล" }}
                      />
                    </Box>
                  </Flex>
                  <Flex
                    width={{ base: "100%", md: "80%" }}
                    mb={10}
                    justifyContent="space-between"
                  >
                    <Box w="50%" mr={3}>
                      <TextInput
                        name="mobileNo"
                        label="เบอร์โทรศัพท์"
                        register={register}
                        errors={errors}
                        validation={{
                          required: "กรุณากรอกเบอร์โทรศัพท์",
                          maxLength: {
                            value: 10,
                            message: "จำนวนตัวอักษรเกิน",
                          },
                        }}
                      />
                    </Box>
                    <Box width="50%"></Box>
                  </Flex>
                </Box>
              </Flex>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="ghost"
              color="#333333"
              onClick={() => {
                reset()
                onClose()
              }}
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

export default AddDriverModal
