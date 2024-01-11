/* eslint-disable react/no-children-prop */
import { useForm, Controller } from "react-hook-form"
import React, { useState } from "react"
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
  Input,
  Tooltip,
  Icon,
} from "@chakra-ui/react"
import DatePicker from "../../input/Datepicker"
import { DateTime } from "luxon"
import Head from "next/head"
import SelectInput from "../../input/SelectInput"
import NextLink from "next/link"
import { ManageScheduleTypes } from "../../../data-hooks/schedules/types"
import get from "lodash/get"
import isBoolean from "lodash/isBoolean"
import { IoMdAlert } from "react-icons/io"

type ManageSchduleProps = {
  isLoading: boolean
  onSubmit: (values: any) => void
}

const ManageSchdule = ({ isLoading, onSubmit: submit }: ManageSchduleProps) => {
  const [startDate, setStartDate] = useState<any>(null)
  const [endDate, setEndDate] = useState<any>(null)

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    control,
    watch,
  } = useForm()

  const watchStartDate = watch("startDate")
  const watchEndDate = watch("endDate")
  const watchStatus = watch("status")

  function onSubmit(values: ManageScheduleTypes) {
    const status: boolean | string = get(values, "status")
    values.status = isBoolean(status)
      ? status
      : status === "open"
      ? true
      : false
    const periodOfDay: "all" | "morning" | "evening" = get(
      values,
      "periodOfDay.value"
    )
    values.periodOfDay = periodOfDay
    values.startDate = values?.startDate
      ? DateTime.fromJSDate(new Date(values?.startDate)).toFormat("y-MM-dd")
      : ""
    values.endDate = values?.endDate
      ? DateTime.fromJSDate(new Date(values?.endDate)).toFormat("y-MM-dd")
      : ""
    values.remark = values?.remark && !values.status ? values?.remark : null

    submit(values)
  }

  return (
    <>
      <Head>
        <title>จัดการปฏิทิน</title>
        <meta name="description" content="schedules" />
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
                  จัดการวันจองรถ
                </Text>
                <HStack>
                  <NextLink href={"/admin/schedules"} passHref>
                    <Link _focus={{}} _hover={{}}>
                      <Text fontStyle="italic" color="#00A5A8">
                        จัดการปฏิทิน
                      </Text>
                    </Link>
                  </NextLink>
                  <Text>{">"}</Text>
                  <Text fontStyle="italic">จัดการวันจองรถ</Text>
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
            <Flex
              width="100%"
              minH="100%"
              flexDirection={{ base: "column", md: "row" }}
              mb={{ base: 6, md: 10 }}
            >
              <Box width={{ base: "100%", md: "20%" }} mb={{ base: 4, md: 0 }}>
                <Text fontSize="20px" fontWeight={600}>
                  รายละเอียดวัน
                </Text>
              </Box>
              <Box
                bgColor="#F5F5F5"
                width={{ base: "100%", md: "80%" }}
                p={12}
                borderRadius="8px"
              >
                <Flex
                  w={{ base: "100%", md: "50%" }}
                  alignItems="center"
                  mb={10}
                >
                  <Box w="50%">
                    <Controller
                      name="startDate"
                      control={control}
                      render={({ field, fieldState }) => (
                        <DatePicker
                          date={startDate}
                          setDate={setStartDate}
                          field={field}
                          fieldState={fieldState}
                        />
                      )}
                      rules={{
                        required: "กรุณาเลือกวันที่เริ่มต้น",
                        validate: (value) => {
                          if (value && watchEndDate && value > watchEndDate) {
                            return "วันเริ่มต้นมากกว่าวันสิ้นสุด"
                          }
                        },
                      }}
                    />
                  </Box>
                  <Flex
                    alignItems={
                      !!errors.startDate || !!errors.endDate
                        ? "flex-start"
                        : "center"
                    }
                  >
                    <Text mx={2}>{"-"}</Text>
                  </Flex>
                  <Box w="50%">
                    <Controller
                      name="endDate"
                      control={control}
                      render={({ field, fieldState }) => (
                        <DatePicker
                          date={endDate}
                          setDate={setEndDate}
                          field={field}
                          fieldState={fieldState}
                        />
                      )}
                      rules={{
                        required: "กรุณาเลือกวันที่สิ้นสุด",
                        validate: (value) => {
                          if (
                            value &&
                            watchStartDate &&
                            value < watchStartDate
                          ) {
                            return "วันสิ้นสุดมากกว่าวันเริ่มต้น"
                          }
                        },
                      }}
                    />
                  </Box>
                </Flex>
                <Flex
                  mb={10}
                  w={{ base: "100%", md: "80%" }}
                  alignItems="center"
                >
                  <FormControl
                    isInvalid={!!errors.periodOfDay}
                    w={{ base: "50%", md: "40%" }}
                    mr={{ base: 4, md: 10 }}
                  >
                    <FormLabel htmlFor="periodOfDay">รอบ</FormLabel>
                    <Controller
                      name="periodOfDay"
                      control={control}
                      render={({ field, fieldState }) => (
                        <SelectInput
                          options={[
                            { value: "all", label: "ทั้งหมด" },
                            { value: "morning", label: "รอบไป" },
                            { value: "evening", label: "รอบกลับ" },
                          ]}
                          placeholder=""
                          {...field}
                          {...fieldState}
                        />
                      )}
                      rules={{ required: "กรุณาเลือกรอบ" }}
                    />
                    <FormErrorMessage>
                      {errors.periodOfDay && errors.periodOfDay.message}
                    </FormErrorMessage>
                  </FormControl>
                  <FormControl isInvalid={!!errors.status} w="50%">
                    <FormLabel htmlFor="status">สถานะ</FormLabel>
                    <Controller
                      name="status"
                      control={control}
                      render={({ field }) => (
                        <RadioGroup {...field} display="flex">
                          <Radio
                            value="open"
                            mr={{ base: 8, md: 20 }}
                            borderColor="#00A5A8"
                            colorScheme="primary"
                          >
                            เปิดจอง
                          </Radio>
                          <Radio
                            value="close"
                            borderColor="#00A5A8"
                            colorScheme="primary"
                          >
                            ปิดจอง
                          </Radio>
                        </RadioGroup>
                      )}
                      rules={{ required: "กรุณาเลือก" }}
                    />
                    <FormErrorMessage>
                      {errors.status && errors.status.message}
                    </FormErrorMessage>
                  </FormControl>
                  {watchStatus && watchStatus === "close" && (
                    <FormControl isInvalid={!!errors.remark} w="50%">
                      <FormLabel
                        display="flex"
                        htmlFor="remark"
                        alignItems="center"
                      >
                        หมายเหตุ
                        <Tooltip
                          label=" ข้อความในหมายเหตุ
                        จะเเสดงในอีเมลเเจ้งพนักงานในกรณีที่รายการจองล่วงหน้าถูกยกเลิก"
                          shouldWrapChildren
                        >
                          <IoMdAlert
                            fontSize="20"
                            style={{ marginLeft: "10px" }}
                          />
                        </Tooltip>
                      </FormLabel>
                      <Input
                        id={`remark`}
                        borderColor="#B2CCCC"
                        _focus={{
                          borderColor: "#B2CCCC",
                          boxShadow: "0 0 0 1px #00A5A8",
                        }}
                        {...register(`remark`)}
                      />

                      <FormErrorMessage>
                        {errors.remark && errors.remark.message}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                </Flex>
              </Box>
            </Flex>
          </Flex>
        </form>
      </Container>
    </>
  )
}

export default ManageSchdule
