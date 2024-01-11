import { useForm, useFieldArray, Controller } from "react-hook-form"
import React, { useState } from "react"
import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Button,
  Flex,
  Box,
  Text,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  RadioGroup,
  Radio,
  NumberInput,
  NumberInputField,
  Container,
  useDisclosure,
} from "@chakra-ui/react"
import { AddIcon } from "@chakra-ui/icons"
import TextInput from "../../input/TextInput"
import SelectInput from "../../input/SelectInput"
import { MdMoreVert } from "react-icons/md"
import {
  TransportationProviderDataTypes,
  VehicleTypes,
} from "../../../data-hooks/transportationProviders/types"
import get from "lodash/get"
import { Option } from "../../../data-hooks/provinces/getList"
import isBoolean from "lodash/isBoolean"
import Head from "next/head"
import ConfirmDialog from "../../ConfirmDialog"

type ProviderInfo = {
  data: TransportationProviderDataTypes
  provinces: Option
  vehicleTypes: {
    value: number
    label: string
  }
  onSubmit: (values: any) => void
  isLoading: boolean
  isLoadingDelete: boolean
  onDelete: (values: any) => void
}

const ProviderInfo = ({
  data,
  provinces,
  vehicleTypes,
  onSubmit: submit,
  isLoading,
  isLoadingDelete,
  onDelete,
}: ProviderInfo) => {
  const { isOpen, onClose, onOpen } = useDisclosure()
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    control,
  } = useForm({
    defaultValues: data,
  })

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control,
      name: "vehicleTypes",
    }
  )

  function onSubmit(values: TransportationProviderDataTypes<boolean>) {
    const provice = get(values.province, "value")
    const status: boolean | string = get(values, "status")
    const vehicleTypes = get(values, "vehicleTypes").map(
      (vehicle: VehicleTypes) => {
        const vehicleTypeId = get(vehicle, "vehicleTypeId.value")

        if (vehicle.transportationProviderVehicleTypeMappingId)
          return {
            transportationProviderVehicleTypeMappingId:
              vehicle.transportationProviderVehicleTypeMappingId,
            vehicleTypeId: vehicleTypeId,
            seatCapacity: vehicle.seatCapacity,
          }
        else
          return {
            vehicleTypeId: vehicleTypeId,
            seatCapacity: +vehicle.seatCapacity,
          }
      }
    )
    values.vehicleTypes = vehicleTypes
    values.province = provice
    values.status = isBoolean(status)
      ? status
      : status === "active"
      ? true
      : false

    submit({ id: data.id, data: values })
  }
  return (
    <>
      <Head>
        <title>ผู้ให้บริการรถ</title>
        <meta name="description" content="transportationProviders" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ConfirmDialog
        title="ลบบัญชีผู้ให้บริการ"
        content={`คุณต้องการลบบัญชีผู้ให้บริการ ${data?.companyName} ใช่หรือไม่ ?`}
        type="error"
        acceptLabel="ลบ"
        isOpen={isOpen}
        onClose={onClose}
        isLoading={isLoadingDelete}
        onSubmit={() => {
          onDelete({ providerId: data.id, from: "edit", onClose: onClose })
        }}
      />
      <Container
        minHeight="80vh"
        minW="100%"
        paddingInlineStart={{ base: 2, md: 0 }}
        paddingInlineEnd={{ base: 2, md: 0 }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex
            alignItems="center"
            justifyContent="flex-end"
            mb={{ base: 6, md: 12 }}
          >
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
              isLoading={isSubmitting || isLoading}
              type="submit"
              mr={4}
            >
              บันทึก
            </Button>
          </Flex>
          <Flex flexDirection="column">
            <Flex
              width="100%"
              minH="100%"
              flexDirection={{ base: "column", md: "row" }}
              mb={{ base: 6, md: 10 }}
            >
              <Box width={{ base: "100%", md: "20%" }} mb={{ base: 4, md: 0 }}>
                <Text fontSize="20px" fontWeight={600}>
                  ข้อมูลบริษัท
                </Text>
              </Box>
              <Box
                bgColor="#F5F5F5"
                width={{ base: "100%", md: "80%" }}
                p={{ base: 8, md: 12 }}
                borderRadius="8px"
              >
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
                        width={{ base: "80%", md: "60%", lg: "35%" }}
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
                  />
                  <FormErrorMessage>
                    {errors.status && errors.status.message}
                  </FormErrorMessage>
                </FormControl>
                <Box width={{ base: "100%", md: "90%", xl: "80%" }} mb={10}>
                  <TextInput
                    name="companyName"
                    label="ชื่อบริษัท"
                    errors={errors}
                    register={register}
                    validation={{
                      required: "กรุณากรอกชื่อบริษัท",
                    }}
                  />
                </Box>
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
                  ข้อมูลการติดต่อ
                </Text>
              </Box>
              <Box
                bgColor="#F5F5F5"
                width={{ base: "100%", md: "80%" }}
                p={{ base: 8, md: 12 }}
                borderRadius="8px"
              >
                <Box width={{ base: "100%", md: "90%", xl: "80%" }} mb={10}>
                  <TextInput
                    name="address"
                    label="รายละเอียดที่อยู่บริษัท"
                    errors={errors}
                    register={register}
                    validation={{
                      required: "กรุณากรอกที่อยู่",
                    }}
                  />
                </Box>
                <Flex mb={10} w={{ base: "100%", md: "90%", xl: "80%" }}>
                  <Box width="50%" mr={{ base: 2, md: 5 }}>
                    <TextInput
                      name="subDistrict"
                      label="แขวง / ตำบล"
                      errors={errors}
                      register={register}
                    />
                  </Box>
                  <Box width="50%">
                    <TextInput
                      name="district"
                      label="เขต / อำเภอ"
                      errors={errors}
                      register={register}
                    />
                  </Box>
                </Flex>
                <Flex mb={10} w={{ base: "100%", md: "90%", xl: "80%" }}>
                  <FormControl
                    mr={{ base: 2, md: 5 }}
                    isInvalid={!!errors.province}
                    w="50%"
                  >
                    <FormLabel htmlFor="province">จังหวัด</FormLabel>
                    <Controller
                      name="province"
                      control={control}
                      render={({ field }) => (
                        <SelectInput
                          options={provinces}
                          placeholder=""
                          {...field}
                        />
                      )}
                    />
                  </FormControl>
                  <Box width="50%">
                    <TextInput
                      name="postalCode"
                      label="รหัสไปรษณีย์"
                      errors={errors}
                      register={register}
                    />
                  </Box>
                </Flex>
                <Flex width={{ base: "100%", md: "90%", xl: "80%" }} mb={10}>
                  <Box w={{ base: "100%", md: "49%" }}>
                    <TextInput
                      name="companyMobileNo"
                      label="เบอร์โทรศัพท์ (บริษัท)"
                      errors={errors}
                      register={register}
                      validation={{
                        required: "กรุณากรอกเบอร์โทรศัพท์ (บริษัท)",
                      }}
                    />
                  </Box>
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
                  ผู้ติดต่อ
                </Text>
              </Box>
              <Box
                bgColor="#F5F5F5"
                width={{ base: "100%", md: "80%" }}
                p={{ base: 8, md: 12 }}
                borderRadius="8px"
              >
                <Flex mb={10} w={{ base: "100%", md: "90%", xl: "80%" }}>
                  <Box w="50%" mr={{ base: 2, md: 2, xl: 4 }}>
                    <TextInput
                      name="firstName"
                      label="ชื่อ (ผู้ติดต่อ)"
                      errors={errors}
                      register={register}
                    />
                  </Box>
                  <Box w="50%">
                    <TextInput
                      name="lastName"
                      label="นามสกุล (ผู้ติดต่อ)"
                      errors={errors}
                      register={register}
                    />
                  </Box>
                </Flex>
                <Flex mb={10} w={{ base: "100%", md: "90%", xl: "80%" }}>
                  <Box w="50%" mr={{ base: 2, md: 2, xl: 4 }}>
                    <TextInput
                      name="mobileNo"
                      label="เบอร์โทรศัพท์ (ผู้ติดต่อ)"
                      errors={errors}
                      register={register}
                      validation={{
                        required: "กรุณากรอกเบอร์โทรศัพท์ (ผู้ติดต่อ)",
                      }}
                    />
                  </Box>
                  <Box w="50%">
                    <TextInput
                      name="email"
                      label="อีเมล (ผู้ติดต่อ)"
                      errors={errors}
                      register={register}
                      validation={{
                        required: "กรุณากรอกอีเมล (ผู้ติดต่อ)",
                      }}
                    />
                  </Box>
                </Flex>
              </Box>
            </Flex>
            <Flex
              width="100%"
              minH="100%"
              flexDirection={{ base: "column", md: "row" }}
              mb={4}
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
                {fields.map((field, index) => (
                  <Flex
                    mb={10}
                    w={{ base: "100%", md: "95%", xl: "90%" }}
                    key={field.id}
                  >
                    <Box w="60%" mr={{ base: 2, md: 2, xl: 6 }}>
                      <Flex
                        w="100%"
                        alignItems={
                          !!(
                            errors.vehicleTypes &&
                            errors.vehicleTypes[index] &&
                            errors.vehicleTypes[index]?.vehicleTypeId
                          )
                            ? "center"
                            : "none"
                        }
                      >
                        <Text
                          mr={4}
                          transform={
                            !!(
                              errors.vehicleTypes &&
                              errors.vehicleTypes[index] &&
                              errors.vehicleTypes[index]?.vehicleTypeId
                            )
                              ? "none"
                              : "translateY(55%)"
                          }
                        >
                          {index + 1}
                          {"."}
                        </Text>
                        <FormControl
                          w="100%"
                          isInvalid={
                            !!(
                              errors.vehicleTypes &&
                              errors.vehicleTypes[index] &&
                              errors.vehicleTypes[index]?.vehicleTypeId
                            )
                          }
                        >
                          <FormLabel
                            htmlFor={`vehicleTypes.${index}.vehicleTypeId`}
                          >
                            ประเภทรถที่ให้บริการ
                          </FormLabel>
                          <Controller
                            name={`vehicleTypes.${index}.vehicleTypeId`}
                            control={control}
                            render={({ field, fieldState }) => (
                              <SelectInput
                                options={vehicleTypes}
                                placeholder=""
                                {...fieldState}
                                {...field}
                              />
                            )}
                            rules={{ required: true }}
                          />
                          <FormErrorMessage>
                            {errors.vehicleTypes &&
                              errors.vehicleTypes[index] &&
                              errors.vehicleTypes[index]?.vehicleTypeId &&
                              "กรุณาเลือกประเภทรถ"}
                          </FormErrorMessage>
                        </FormControl>
                      </Flex>
                    </Box>
                    <Flex
                      w="20%"
                      mr={{ base: 2, md: 2, xl: 4 }}
                      alignItems="flex-end"
                      transform={
                        !!!(
                          errors.vehicleTypes &&
                          errors.vehicleTypes[index] &&
                          errors.vehicleTypes[index]?.vehicleTypeId
                        ) &&
                        !!(
                          errors.vehicleTypes &&
                          errors.vehicleTypes[index] &&
                          errors.vehicleTypes[index]?.seatCapacity
                        )
                          ? "translateY(29px)"
                          : "none"
                      }
                    >
                      <FormControl
                        isInvalid={
                          !!(
                            errors.vehicleTypes &&
                            errors.vehicleTypes[index] &&
                            errors.vehicleTypes[index]?.seatCapacity
                          )
                        }
                        w="100%"
                      >
                        <NumberInput>
                          <NumberInputField
                            {...register(`vehicleTypes.${index}.seatCapacity`, {
                              required: true,
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
                          {errors.vehicleTypes &&
                            errors.vehicleTypes[index] &&
                            errors.vehicleTypes[index]?.seatCapacity &&
                            "กรุณากรอก"}
                        </FormErrorMessage>
                      </FormControl>
                    </Flex>

                    <Flex
                      alignItems={
                        !!(
                          errors.vehicleTypes &&
                          errors.vehicleTypes[index] &&
                          errors.vehicleTypes[index]?.vehicleTypeId
                        )
                          ? "center"
                          : "none"
                      }
                    >
                      <Text
                        mr={{ base: 4, md: 4, xl: 2 }}
                        transform={
                          !!(
                            errors.vehicleTypes &&
                            errors.vehicleTypes[index] &&
                            errors.vehicleTypes[index]?.vehicleTypeId
                          )
                            ? "none"
                            : "translateY(55%)"
                        }
                        whiteSpace="nowrap"
                      >
                        ที่นั่ง
                      </Text>
                    </Flex>

                    <Flex
                      alignItems={
                        !!(
                          errors.vehicleTypes &&
                          errors.vehicleTypes[index] &&
                          errors.vehicleTypes[index]?.vehicleTypeId
                        )
                          ? "center"
                          : "flex-end"
                      }
                    >
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
                    </Flex>
                  </Flex>
                ))}
                <Button
                  onClick={() =>
                    append({
                      vehicleTypeName: undefined,
                      seatCapacity: undefined,
                    })
                  }
                  leftIcon={<AddIcon />}
                >
                  เพิ่มรถ
                </Button>
              </Box>
            </Flex>
          </Flex>
          <Flex>
            <Box
              width={{ base: "100%", md: "20%" }}
              display={{ base: "none", md: "block" }}
            ></Box>
            <Button
              variant="ghost"
              _focus={{ boxShadow: "none" }}
              color="error.500"
              textDecoration="underline"
              onClick={onOpen}
              p={0}
            >
              ลบบัญชีผู้ให้บริการ
            </Button>
          </Flex>
        </form>
      </Container>
    </>
  )
}

export default ProviderInfo
