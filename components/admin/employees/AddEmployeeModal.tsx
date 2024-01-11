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
  FormControl,
  IconButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react"
import { useForm, Controller, useFieldArray } from "react-hook-form"
import { DateTime } from "luxon"
import { Option } from "../../../data-hooks/subordinates/getMyEmployee"
import AsyncSelectInput from "../../input/AsyncSelectInput"
import { AddIcon } from "@chakra-ui/icons"
import { MdClose } from "react-icons/md"
import uniq from "lodash/uniq"

type AddEmployeeModalProps = {
  isOpen: boolean
  onClose: () => void
  employeeList: Option[]
  onSubmit: (values: any) => void
  isLoading: boolean
  employeeNo: string
}

const AddEmployeeModal = ({
  isOpen,
  onClose,
  employeeList,
  onSubmit: submit,
  isLoading,
  employeeNo,
}: AddEmployeeModalProps) => {
  const size = useBreakpointValue({ base: "full", md: "5xl" })

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    control,
    reset,
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      subordinates: [
        {
          employeeNo: undefined,
        },
      ],
    },
  })

  const {
    fields: fieldsSubordinates,
    append: appendSubordinates,
    remove: removeSubordinates,
  } = useFieldArray({
    control,
    name: "subordinates",
  })

  useEffect(() => {
    reset(undefined)
  }, [isOpen, reset])

  const onSubmit = (values: any) => {
    const subordinateEmployeeNos = values.subordinates.map(
      (subordinate: any) => subordinate.employeeNo.value
    )
    submit({
      subordinateEmployeeNos: uniq(subordinateEmployeeNos),
      onClose: onClose,
      employeeNo,
    })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={size}>
      <ModalOverlay />
      <ModalContent p={{ base: 2, md: 12 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader mb={10} fontSize="28px" fontWeight={700}>
            เพิ่มพนักงาน
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
                  ข้อมูลพนักงาน
                </Text>
              </Box>
              <Box
                bgColor="#F5F5F5"
                width={{ base: "100%", md: "80%" }}
                p={{ base: 8, md: 12 }}
                borderRadius="8px"
              >
                <Table variant="unstyled" width="100%">
                  <Thead>
                    <Tr>
                      <Th width="2%" px={2}></Th>
                      <Th
                        width={{ base: "88%", md: "80%" }}
                        px={{ base: 4, md: 2 }}
                      ></Th>
                      <Th width="10%" px={2}></Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {fieldsSubordinates.map((field, index) => (
                      <Tr key={field.id}>
                        <Td
                          verticalAlign={
                            !!(
                              errors.subordinates &&
                              errors.subordinates[index] &&
                              errors.subordinates[index]?.employeeNo
                            )
                              ? "middle"
                              : "bottom"
                          }
                          px={2}
                        >
                          <Text h="40px" display="flex" alignItems="center">
                            {index + 1}.
                          </Text>
                        </Td>
                        <Td px={{ base: 4, md: 2 }}>
                          <FormControl
                            isInvalid={
                              !!(
                                errors.subordinates &&
                                errors.subordinates[index] &&
                                errors.subordinates[index]?.employeeNo
                              )
                            }
                            w="100%"
                          >
                            <FormLabel
                              htmlFor={`subordinates.${index}.employeeNo`}
                            >
                              รหัส / ชื่อพนักงาน
                            </FormLabel>
                            <Controller
                              name={`subordinates.${index}.employeeNo`}
                              control={control}
                              render={({ field, fieldState }) => (
                                <AsyncSelectInput
                                  options={employeeList}
                                  {...field}
                                  {...fieldState}
                                  placeholder=""
                                />
                              )}
                              rules={{
                                required: "กรุณาเลือกพนักงาน",
                                validate: (value: any) => {
                                  if (value && value?.supervisorEmployeeNo) {
                                    return "พนักงานที่เลือกมีผู้ดูแลอยู่แล้ว"
                                  }
                                },
                              }}
                            />
                            <FormErrorMessage>
                              <FormErrorMessage>
                                {errors.subordinates &&
                                  errors.subordinates[index] &&
                                  errors.subordinates[index]?.employeeNo &&
                                  errors.subordinates[index]?.employeeNo
                                    ?.message}
                              </FormErrorMessage>
                            </FormErrorMessage>
                          </FormControl>
                        </Td>
                        <Td
                          verticalAlign={
                            !!(
                              errors.subordinates &&
                              errors.subordinates[index] &&
                              errors.subordinates[index]?.employeeNo
                            )
                              ? "middle"
                              : "bottom"
                          }
                          px={2}
                        >
                          <IconButton
                            icon={<MdClose />}
                            aria-label="delete"
                            variant="ghost"
                            color="#333333"
                            fontSize="20px"
                            onClick={() => {
                              removeSubordinates(index)
                            }}
                            _focus={{ boxShadow: "none" }}
                          />
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
                <Button
                  variant="text"
                  textDecoration="underline"
                  color="primary.500"
                  px={0}
                  leftIcon={<AddIcon fontSize="12px" />}
                  _focus={{ boxShadow: "none" }}
                  onClick={() => {
                    appendSubordinates({
                      employeeNo: undefined,
                    })
                  }}
                  mt={10}
                >
                  เพิ่มรายชื่อ
                </Button>
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

export default React.memo(AddEmployeeModal)
