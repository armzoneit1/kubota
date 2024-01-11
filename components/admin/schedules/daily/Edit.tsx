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
  HStack,
  Link,
  Input,
} from "@chakra-ui/react"
import { DateTime } from "luxon"
import SelectInput from "../../../input/SelectInput"
import { Options } from "../../../../data-hooks/timeTables/types"
import {
  DayTypes,
  ScheduleDataTypes,
  weekDay,
} from "../../../../data-hooks/schedules/types"
import NextLink from "next/link"
import Head from "next/head"
import { UpdateDataType } from "../../../../data-hooks/schedules/daily/update"
import TextInput from "../../../input/TextInput"
import get from "lodash/get"
import ConfirmDialog from "../../../ConfirmDialog"

const conditionShowDelete = (date: string) => new Date(date) > new Date()

type DailyEditProps = {
  data: ScheduleDataTypes
  timeTableMorningOptions: Options[]
  timeTableEveningOptions: Options[]
  isLoading: boolean
  onSubmit: (values: any) => void
  day: "workday" | "saturdayWorkday" | "publicHoliday" | "other" | "weekend"
  onDelete: (values: any) => void
}

const DailyEdit = ({
  timeTableMorningOptions,
  timeTableEveningOptions,
  isLoading,
  onSubmit: submit,
  day,
  data,
  onDelete,
}: DailyEditProps) => {
  const dayOfweek = data?.date ? new Date(`${data?.date}`).getDay() : 1
  const [isOpen, setOpen] = useState(false)
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting, isValid },
    control,
  } = useForm({
    defaultValues: {
      ...data,
      date: data?.date
        ? `${DateTime.fromJSDate(new Date(`${data?.date}`)).toFormat(
            "dd/MM/y"
          )} (${weekDay[dayOfweek]})`
        : "",
    },
  })

  const onOpen = () => {
    setOpen(true)
  }
  const onClose = () => {
    setOpen(false)
  }

  function onSubmit(values: ScheduleDataTypes) {
    const timeTableMorningId: number = get(
      values,
      "timeTableMorning.timeTableId.value"
    )
    values.timeTableMorningId = timeTableMorningId
    const timeTableEveningId: number = get(
      values,
      "timeTableEvening.timeTableId.value"
    )
    values.timeTableEveningId = timeTableEveningId

    submit({
      id: data.id,
      day: day,
      data: {
        detail: values.detail,
        timeTableMorningId: values.timeTableMorningId,
        timeTableEveningId: values.timeTableEveningId,
      },
    })
  }

  return (
    <>
      <ConfirmDialog
        isOpen={isOpen}
        onClose={onClose}
        type="error"
        title={"ลบข้อมูล"}
        content={`คุณยืนยันการลบข้อมูลของวันที่ ${DateTime.fromJSDate(
          new Date(`${data?.date}`)
        ).toFormat("dd/MM/y")} ใช่หรือไม่ ?`}
        acceptLabel="ลบ"
        onSubmit={() => {
          onDelete({ scheduleIds: [data.id], day: day })
        }}
        isLoading={isLoading}
      />
      <Head>
        <title>จัดการปฏิทิน</title>
        <meta name="description" content="schedule" />
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
                  {DayTypes[day]}
                </Text>
                <HStack>
                  <NextLink href={`/admin/schedules/${day}`} passHref>
                    <Link _hover={{}} _focus={{}}>
                      <Text fontStyle="italic" color="#00A5A8">
                        จัดการปฏิทิน
                      </Text>
                    </Link>
                  </NextLink>
                  <Text>{">"}</Text>
                  <Text fontStyle="italic">เพิ่มวัน</Text>
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
                  mb={10}
                  w={{ base: "100%", md: "80%" }}
                  alignItems="center"
                >
                  <Box w="50%" mr={{ base: 4, md: 10 }}>
                    <TextInput
                      name="date"
                      label="วัน/เดือน/ปี"
                      colorLabel="primary.500"
                      register={register}
                      errors={errors}
                      variant="unstyles"
                      p={0}
                      isDisabled={true}
                    />
                  </Box>
                  <FormControl w="50%" isInvalid={!!errors.detail}>
                    <FormLabel htmlFor="detail">รายละเอียด</FormLabel>
                    <Input
                      {...register(`detail`)}
                      borderColor="#B2CCCC"
                      _focus={{
                        borderColor: "#B2CCCC",
                        boxShadow: "0 0 0 1px #00A5A8",
                      }}
                    />
                    <FormErrorMessage>
                      {errors.detail && errors.detail.message}
                    </FormErrorMessage>
                  </FormControl>
                </Flex>
                <Flex
                  mb={10}
                  w={{ base: "100%", md: "80%" }}
                  alignItems="center"
                >
                  <FormControl
                    isInvalid={!!errors.timeTableMorning?.timeTableId}
                    w="50%"
                    mr={{ base: 4, md: 10 }}
                  >
                    <FormLabel htmlFor="timeTableMorning.timeTableId">
                      รอบไป
                    </FormLabel>
                    <Controller
                      name="timeTableMorning.timeTableId"
                      control={control}
                      render={({ field, fieldState }) => (
                        <SelectInput
                          options={timeTableMorningOptions}
                          placeholder=""
                          {...field}
                          {...fieldState}
                        />
                      )}
                      rules={{ required: "กรุณาเลือก" }}
                    />
                    <FormErrorMessage>
                      {errors.timeTableMorning?.timeTableId &&
                        errors.timeTableMorning?.timeTableId.message}
                    </FormErrorMessage>
                  </FormControl>
                  <FormControl
                    isInvalid={!!errors.timeTableEvening?.timeTableId}
                    w="50%"
                  >
                    <FormLabel htmlFor="timeTableEvening.timeTableId">
                      รอบกลับ
                    </FormLabel>
                    <Controller
                      name="timeTableEvening.timeTableId"
                      control={control}
                      render={({ field, fieldState }) => (
                        <SelectInput
                          options={timeTableEveningOptions}
                          placeholder=""
                          {...field}
                          {...fieldState}
                        />
                      )}
                      rules={{ required: "กรุณาเลือก" }}
                    />
                    <FormErrorMessage>
                      {errors.timeTableEvening?.timeTableId &&
                        errors.timeTableEvening?.timeTableId.message}
                    </FormErrorMessage>
                  </FormControl>
                </Flex>
              </Box>
            </Flex>
            {conditionShowDelete(data.date) && (
              <Flex
                width="100%"
                minH="100%"
                flexDirection={{ base: "column", md: "row" }}
                mb={{ base: 6, md: 10 }}
              >
                <Box
                  width={{ base: "100%", md: "20%" }}
                  mb={{ base: 4, md: 0 }}
                ></Box>
                <Box width={{ base: "100%", md: "80%" }}>
                  <Button
                    variant="text"
                    color="error.500"
                    px={0}
                    textDecoration="underline"
                    _focus={{ boxShadow: "none" }}
                    onClick={onOpen}
                  >
                    ลบข้อมูล
                  </Button>
                </Box>
              </Flex>
            )}
          </Flex>
        </form>
      </Container>
    </>
  )
}

export default DailyEdit
