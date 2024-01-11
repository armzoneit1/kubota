import { useEffect, useState } from "react"
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
  useBreakpointValue,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Center,
  Spinner,
  RadioGroup,
  Radio,
  FormErrorMessage,
  FormLabel,
  FormControl,
  NumberInput,
  NumberInputField,
  Input,
} from "@chakra-ui/react"
import { AddIcon } from "@chakra-ui/icons"
import { useFieldArray, useForm, Controller } from "react-hook-form"
import TextInput from "../../input/TextInput"
import { MdMoreVert } from "react-icons/md"
import { VehicleTypes } from "../../../data-hooks/vehicleTypes/types"
import isNumber from "lodash/isNumber"
import filter from "lodash/filter"
import isArray from "lodash/isArray"
import get from "lodash/get"

type VehicleTypeFormProps = {
  onClose: () => void
  onSubmit?: () => void
  vehicleTypes: VehicleTypes[]
  isSubmitLoading: boolean
  onCreate: (values: any) => void
  onUpdate: (values: any) => void
  onDelete: (values: any) => void
  setDeleteData: React.Dispatch<React.SetStateAction<number[] | null>>
  deleteData: number[] | null
}

const VehicleTypeForm = ({
  onClose,
  onSubmit: submit,
  vehicleTypes: data,
  isSubmitLoading,
  onCreate,
  onUpdate,
  onDelete,
  setDeleteData,
  deleteData,
}: VehicleTypeFormProps) => {
  const size = useBreakpointValue({ base: "full", md: "5xl" })
  const px = useBreakpointValue({ base: "4px", md: "10px", xl: "24px" })

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    control,
    setValue,
    watch,
    unregister,
    clearErrors,
  } = useForm({
    defaultValues: { vehicleTypes: data },
  })

  const watchVehicleTypes = watch("vehicleTypes")

  const { fields, append, remove } = useFieldArray({
    control,
    name: "vehicleTypes",
  })

  const onRemove = (index: number) => {
    const deleteField = fields[index]

    if (isNumber(deleteField.id)) {
      setDeleteData((prevState) =>
        prevState ? [...prevState, deleteField.id] : [deleteField.id]
      )
    }
    remove(index)
  }

  const onSubmit = async (values: { vehicleTypes: VehicleTypes<string>[] }) => {
    const vehicleTypes: VehicleTypes<string>[] = get(values, "vehicleTypes")
    const mappingVehicleTypes: {
      id?: number
      name: string
      isUseForArrangement: boolean
      limit: number | null
    }[] = vehicleTypes.map((vehicle: VehicleTypes) => {
      if (vehicle.id) {
        return {
          id: vehicle.id,
          name: vehicle.name,
          isUseForArrangement:
            vehicle?.isUseForArrangement === "use" ? true : false,
          limit: vehicle?.isUseForArrangement === "use" ? vehicle.limit : null,
        }
      } else {
        return {
          name: vehicle.name,
          isUseForArrangement:
            vehicle?.isUseForArrangement === "use" ? true : false,
          limit: vehicle?.isUseForArrangement === "use" ? vehicle.limit : null,
        }
      }
    })
    const create = filter(mappingVehicleTypes, (value) => !isNumber(value.id))
    const update = filter(mappingVehicleTypes, (value) => isNumber(value.id))
    const dataDelete = deleteData

    if (update && update.length > 0) {
      for (let i = 0; i < update.length; i++) {
        await onUpdate({ id: update[i].id, data: update[i] })
      }
    }

    if (dataDelete && dataDelete.length > 0) {
      for (let i = 0; i < dataDelete.length; i++) {
        await onDelete(dataDelete[i])
      }
    }

    if (create && create.length > 0) {
      for (let i = 0; i < create.length; i++) {
        await onCreate(create[i])
      }
    }

    setDeleteData(null)

    onClose()
  }

  return (
    <ModalContent p={{ base: 2, md: 12 }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalHeader mb={10} fontSize="28px" fontWeight={700}>
          จัดการประเภทรถ
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
                ประเภทรถ
              </Text>
            </Box>
            <Box
              bgColor="#F5F5F5"
              width={{ base: "100%", md: "80%" }}
              p={{ base: 8, md: 12 }}
              borderRadius="8px"
            >
              <Table variant="unstyled" mb={10} w="100%">
                <Thead>
                  <Tr>
                    <Th px={2}></Th>
                    <Th px={px} pl={2}></Th>
                    <Th px={px}></Th>
                    <Th px={px} pl={2}></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {fields.map((field, index) => {
                    return (
                      <Tr key={index}>
                        <Td
                          w="2%"
                          px={2}
                          textAlign="right"
                          verticalAlign="initial"
                        >
                          {index + 1}
                          {"."}
                        </Td>
                        <Td w="80%" px={px} pl={2}>
                          <Flex w="100%" flexDirection="column">
                            <FormControl
                              w="100%"
                              mb={6}
                              isInvalid={
                                !!(
                                  errors.vehicleTypes &&
                                  errors.vehicleTypes[index] &&
                                  errors.vehicleTypes[index]?.name
                                )
                              }
                            >
                              <FormLabel htmlFor={`vehicleTypes.${index}.name`}>
                                ชื่อประเภท
                              </FormLabel>
                              <Input
                                id={`vehicleTypes.${index}.name`}
                                borderColor="#B2CCCC"
                                _focus={{
                                  borderColor: "#B2CCCC",
                                  boxShadow: "0 0 0 1px #00A5A8",
                                }}
                                {...register(`vehicleTypes.${index}.name`, {
                                  required: "กรุณากรอกชื่อประเภท",
                                })}
                              />
                              <FormErrorMessage>
                                {errors.vehicleTypes &&
                                  errors.vehicleTypes[index] &&
                                  errors.vehicleTypes[index]?.name &&
                                  errors.vehicleTypes[index]?.name?.message}
                              </FormErrorMessage>
                            </FormControl>
                            <Flex w="100%">
                              <FormControl
                                isInvalid={
                                  !!(
                                    errors.vehicleTypes &&
                                    errors.vehicleTypes[index] &&
                                    errors.vehicleTypes[index]
                                      ?.isUseForArrangement
                                  )
                                }
                                width="50%"
                                mr={2}
                              >
                                <FormLabel
                                  htmlFor={`vehicleTypes.${index}.isUseForArrangement`}
                                >
                                  นำข้อมูลไปจัดรถอัตโนมัติหรือไม่
                                </FormLabel>
                                <Controller
                                  name={`vehicleTypes.${index}.isUseForArrangement`}
                                  control={control}
                                  render={({ field }) => (
                                    <RadioGroup
                                      {...field}
                                      display="flex"
                                      justifyContent="space-between"
                                      width={"100%"}
                                      height="40px"
                                    >
                                      <Radio
                                        value="use"
                                        borderColor="#00A5A8"
                                        colorScheme="primary"
                                        mr={4}
                                      >
                                        ใช้
                                      </Radio>
                                      <Radio
                                        value="unused"
                                        borderColor="#00A5A8"
                                        colorScheme="primary"
                                        mr={4}
                                      >
                                        ไม่ใช้
                                      </Radio>
                                    </RadioGroup>
                                  )}
                                  rules={{
                                    required: "กรุณาเลือก",
                                  }}
                                />
                                <FormErrorMessage>
                                  {errors.vehicleTypes &&
                                    errors.vehicleTypes[index] &&
                                    errors.vehicleTypes[index]
                                      ?.isUseForArrangement &&
                                    errors.vehicleTypes[index]
                                      ?.isUseForArrangement?.message}
                                </FormErrorMessage>
                              </FormControl>
                              {get(
                                watchVehicleTypes,
                                `${index}.isUseForArrangement`
                              ) &&
                                get(
                                  watchVehicleTypes,
                                  `${index}.isUseForArrangement`
                                ) === "use" && (
                                  <FormControl
                                    isInvalid={
                                      !!(
                                        errors.vehicleTypes &&
                                        errors.vehicleTypes[index] &&
                                        errors.vehicleTypes[index]?.limit
                                      )
                                    }
                                    w="50%"
                                  >
                                    <FormLabel
                                      htmlFor={`vehicleTypes.${index}.limit`}
                                    >
                                      จำกัดจำนวน (ต่อสาย/ต่อรอบ)
                                    </FormLabel>
                                    <NumberInput>
                                      <NumberInputField
                                        {...register(
                                          `vehicleTypes.${index}.limit`,
                                          {
                                            valueAsNumber: true,
                                          }
                                        )}
                                        borderColor="#B2CCCC"
                                        _focus={{
                                          borderColor: "#B2CCCC",
                                          boxShadow: "0 0 0 1px #00A5A8",
                                        }}
                                      />
                                    </NumberInput>
                                    <FormErrorMessage>
                                      {errors.vehicleTypes &&
                                        errors.vehicleTypes[index] &&
                                        errors.vehicleTypes[index]?.limit &&
                                        "กรุณากรอกจำนวนคัน"}
                                    </FormErrorMessage>
                                  </FormControl>
                                )}
                            </Flex>
                          </Flex>
                        </Td>
                        <Td w="10%" px={2}>
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
                                onClick={() => onRemove(index)}
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
              <Button
                onClick={() =>
                  append({
                    name: "",
                    isUseForArrangement: undefined,
                    limit: 0,
                  })
                }
                leftIcon={<AddIcon />}
              >
                เพิ่มประเภทรถ
              </Button>
            </Box>
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="ghost"
            _focus={{ boxShadow: "none" }}
            onClick={() => {
              setDeleteData(null)
              onClose()
            }}
            color="#333333"
            mr={4}
          >
            ยกเลิก
          </Button>
          <Button
            _focus={{ boxShadow: "none" }}
            type="submit"
            isLoading={isSubmitting || isSubmitLoading}
          >
            บันทึก
          </Button>
        </ModalFooter>
      </form>
    </ModalContent>
  )
}

export default VehicleTypeForm
