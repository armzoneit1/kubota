import { useForm, Controller } from "react-hook-form"
import React from "react"
import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Button,
  Container,
  Flex,
  Box,
  Text,
  RadioGroup,
  Radio,
  HStack,
  Link,
} from "@chakra-ui/react"
import NextLink from "next/link"
import Head from "next/head"
import get from "lodash/get"
import isBoolean from "lodash/isBoolean"
import { UserDataTypes } from "../../../data-hooks/users/types"
import { Option } from "../../../data-hooks/users/getEmployeeList"
import AsyncSelectInput from "../../input/AsyncSelectInput"

type UserCreateProps = {
  onSubmit: (values: any) => void
  isLoading: boolean
  employeeList: Option[]
}

const UserCreate = ({
  onSubmit: submit,
  isLoading,
  employeeList,
}: UserCreateProps) => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    control,
  } = useForm()

  function onSubmit(values: UserDataTypes) {
    const status: boolean | string = get(values, "status")
    const employeeNo = get(values.employeeNo, "value")
    values.status = isBoolean(status)
      ? status
      : status === "active"
      ? true
      : false
    values.employeeNo = employeeNo
    submit(values)
  }

  return (
    <>
      <Head>
        <title>บัญชีผู้ใช้</title>
        <meta name="description" content="users" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container
        minHeight="80vh"
        minW="100%"
        paddingInlineStart={{ base: 2, md: 0 }}
        paddingInlineEnd={{ base: 2, md: 0 }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex flexDirection="column">
            <Flex width="100%" justifyContent="space-between" my={5}>
              <Flex justifyContent="center" flexDirection="column">
                <Text mb={3} fontSize="32px">
                  เพิ่มบัญชี
                </Text>
                <HStack>
                  <NextLink href={"/admin/users"} passHref>
                    <Link _hover={{}} _focus={{}}>
                      <Text fontStyle="italic" color="#00A5A8" cursor="pointer">
                        บัญชีผู้ใช้
                      </Text>
                    </Link>
                  </NextLink>
                  <Text>{">"}</Text>
                  <Text fontStyle="italic">เพิ่มบัญชี</Text>
                </HStack>
              </Flex>
              <Flex alignItems="center">
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
            </Flex>
            <Flex width="100%" flexDirection={{ base: "column", md: "row" }}>
              <Box width={{ base: "100%", md: "20%" }} mb={{ base: 4, md: 0 }}>
                <Text fontSize="20px" fontWeight={600}>
                  ข้อมูลผู้ใช้
                </Text>
              </Box>
              <Box
                bgColor="#F5F5F5"
                width={{ base: "100%", md: "80%" }}
                p={12}
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
                    rules={{ required: "กรุณาเลือก" }}
                  />
                  <FormErrorMessage>
                    {errors.status && errors.status.message}
                  </FormErrorMessage>
                </FormControl>
                <FormControl
                  isInvalid={!!errors.employeeNo}
                  width={{ base: "100%", md: "60%", lg: "40%" }}
                  mb={10}
                >
                  <FormLabel htmlFor="employeeNo">รหัสพนักงาน</FormLabel>
                  <Controller
                    name={`employeeNo`}
                    control={control}
                    render={({ field, fieldState }) => (
                      <AsyncSelectInput
                        options={employeeList}
                        placeholder=""
                        {...field}
                        {...fieldState}
                      />
                    )}
                    rules={{
                      required: "กรุณาเลือกพนักงาน",
                    }}
                  />
                  <FormErrorMessage>
                    {errors.employeeNo && errors.employeeNo.message}
                  </FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!errors.role} mb={10}>
                  <FormLabel htmlFor="role">Role</FormLabel>
                  <Controller
                    name="role"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup
                        {...field}
                        display="flex"
                        justifyContent="space-between"
                        width={{ base: "80%", md: "60%", lg: "35%" }}
                      >
                        <Radio
                          value="user"
                          borderColor="#00A5A8"
                          colorScheme="primary"
                          mr={4}
                        >
                          User
                        </Radio>
                        <Radio
                          value="admin"
                          borderColor="#00A5A8"
                          colorScheme="primary"
                          mr={4}
                        >
                          Admin
                        </Radio>
                      </RadioGroup>
                    )}
                    rules={{ required: "กรุณาเลือก" }}
                  />
                  <FormErrorMessage>
                    {errors.role && errors.role.message}
                  </FormErrorMessage>
                </FormControl>
              </Box>
            </Flex>
          </Flex>
        </form>
      </Container>
    </>
  )
}

export default UserCreate
