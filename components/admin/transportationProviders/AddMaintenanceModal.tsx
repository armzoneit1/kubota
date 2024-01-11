import React, { useState, useEffect } from "react"
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
  FormLabel,
  FormErrorMessage,
  NumberInput,
  NumberInputField,
  FormControl,
} from "@chakra-ui/react"
import { useForm, Controller } from "react-hook-form"
import TextInput from "../../input/TextInput"
import Datepicker from "../../input/Datepicker"
import { DateTime } from "luxon"
import isNumber from "lodash/isNumber"

type AddMaintenanceModalProps = {
  isOpen: boolean
  onClose: () => void
  onAdd: (add: any) => void
}

const AddMaintenanceModal = ({
  isOpen,
  onClose,
  onAdd,
}: AddMaintenanceModalProps) => {
  const size = useBreakpointValue({ base: "full", md: "5xl" })
  const [date, setDate] = useState<any>(null)

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    control,
    reset,
    watch,
  } = useForm()

  const watchMile = watch("mile")

  useEffect(() => {
    reset(undefined)
    setDate(null)
  }, [isOpen, reset])

  function onSubmit(values: any) {
    values = {
      ...values,
      date: values?.date
        ? DateTime.fromJSDate(new Date(values?.date)).toFormat("y-MM-dd")
        : null,
    }
    onAdd(values)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={size}>
      <ModalOverlay />
      <ModalContent p={{ base: 2, md: 12 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader mb={10} fontSize="28px" fontWeight={700}>
            เพิ่มการซ่อมบำรุง
          </ModalHeader>
          {size === "full" && <ModalCloseButton />}
          <ModalBody>
            <Flex
              width="100%"
              minH="100%"
              flexDirection={{ base: "column", md: "row" }}
              mb={{ base: 6, md: 10 }}
            >
              <Box width={{ base: "100%", md: "20%" }} mb={{ base: 4, md: 0 }}>
                <Text fontSize="20px" fontWeight={600}>
                  ข้อมูลการซ่อม
                </Text>
              </Box>
              <Box
                bgColor="#F5F5F5"
                width={{ base: "100%", md: "80%" }}
                p={{ base: 8, md: 12 }}
                borderRadius="8px"
              >
                <Box w={{ base: "100%", md: "50%" }} mb={10}>
                  <FormLabel htmlFor="date">วัน/เดือน/ปี</FormLabel>
                  <Controller
                    name="date"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Datepicker
                        date={date}
                        setDate={setDate}
                        field={field}
                        fieldState={fieldState}
                        maxDate={new Date()}
                      />
                    )}
                    rules={{ required: "กรุณากรอกวันที่" }}
                  />
                </Box>
                <FormControl
                  isInvalid={!!errors.mile}
                  w={{ base: "100%", md: "50%" }}
                  mb={10}
                >
                  <FormLabel htmlFor="mile">เลขไมล์รถ</FormLabel>
                  <NumberInput>
                    <NumberInputField
                      {...register("mile", {
                        required: "กรุณากรอกเลขไมล์",
                        valueAsNumber: true,
                      })}
                      borderColor="#B2CCCC"
                      _focus={{
                        borderColor: "#B2CCCC",
                        boxShadow: "0 0 0 1px #00A5A8",
                      }}
                    />
                  </NumberInput>
                  <FormErrorMessage>
                    {errors.mile && errors.mile.message}{" "}
                  </FormErrorMessage>
                  {watchMile && isNumber(watchMile)
                    ? watchMile > 200000 && (
                        <Flex alignItems="center" mt={2}>
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M7.99992 2.66683C10.9399 2.66683 13.3333 5.06016 13.3333 8.00016C13.3333 10.9402 10.9399 13.3335 7.99992 13.3335C5.05992 13.3335 2.66659 10.9402 2.66659 8.00016C2.66659 5.06016 5.05992 2.66683 7.99992 2.66683ZM7.99992 1.3335C4.31792 1.3335 1.33325 4.31816 1.33325 8.00016C1.33325 11.6822 4.31792 14.6668 7.99992 14.6668C11.6819 14.6668 14.6666 11.6822 14.6666 8.00016C14.6666 4.31816 11.6819 1.3335 7.99992 1.3335ZM8.66659 10.0002H7.33325V11.3335H8.66659V10.0002ZM7.33325 8.66683H8.66659L8.99992 4.66683H6.99992L7.33325 8.66683Z"
                              fill="#D61212"
                            />
                          </svg>
                          <Text ml={2} color="#E53E3E">
                            เลขไมล์รถเกิน 200,000 กม.
                          </Text>
                        </Flex>
                      )
                    : null}
                </FormControl>
                <Box w="100%">
                  <TextInput
                    name="detail"
                    label="รายละเอียด"
                    register={register}
                    errors={errors}
                    validation={{ required: "กรุณากรอกรายละเอียด" }}
                  />
                </Box>
              </Box>
            </Flex>
          </ModalBody>
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
              isLoading={isSubmitting}
            >
              ยืนยัน
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}

export default React.memo(AddMaintenanceModal)
