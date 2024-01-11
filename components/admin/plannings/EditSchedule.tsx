import { useRouter } from "next/router"
import { useForm, Controller } from "react-hook-form"
import React, { useState, useEffect, useMemo } from "react"
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
  useDisclosure,
  Link,
  Input,
  Icon,
  Tooltip,
} from "@chakra-ui/react"
import TextInput from "../../input/TextInput"
import SelectInput from "../../input/SelectInput"
import ConfirmDialog from "../../ConfirmDialog"
import NextLink from "next/link"
import Head from "next/head"
import { BusArrangementDataTypes } from "../../../data-hooks/busArrangements/types"
import { TimeTableDataTypes } from "../../../data-hooks/timeTables/types"
import { DateTime } from "luxon"
import get from "lodash/get"
import filter from "lodash/filter"
import { ScheduleDataTypes } from "../../../data-hooks/schedules/types"
import { IoMdAlert } from "react-icons/io"

type EditScheduleProps = {
  periodOfDay: "morning" | "evening"
  data: BusArrangementDataTypes | undefined
  timeTables: TimeTableDataTypes[] | undefined
  schedule: ScheduleDataTypes
  isLoading: boolean
  onSubmit: (values: any) => void
}

const EditSchedule = ({
  periodOfDay,
  data,
  timeTables,
  schedule,
  isLoading,
  onSubmit: submit,
}: EditScheduleProps) => {
  const router = useRouter()
  const scheduleId = router?.query?.id
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [values, setValues] = useState<any | null>(null)

  const timeTableOptions = useMemo(
    () =>
      timeTables
        ? timeTables.map((timeTable) => ({
            value: timeTable.id,
            label: timeTable.name,
            timeTableRounds: timeTable.timeTableRounds,
          }))
        : [],
    [timeTables]
  )

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    control,
    watch,
  } = useForm({
    defaultValues: {
      date: data?.date
        ? `${DateTime.fromJSDate(new Date(`${data?.date}`)).toFormat(
            "dd/MM/y"
          )}`
        : "",
      timeTableId:
        schedule && timeTableOptions
          ? filter(timeTableOptions, {
              value: get(
                schedule,
                `${
                  periodOfDay === "morning"
                    ? "timeTableMorning"
                    : "timeTableEvening"
                }`
              )?.timeTableId,
            })[0]
          : null,
      remark: undefined,
    },
  })

  const watchTimeTableId = watch("timeTableId")

  function onSubmit(values: any) {
    const timeTableId = get(values, "timeTableId.value")

    if (
      timeTableId !==
      filter(timeTableOptions, {
        value: get(
          schedule,
          `${
            periodOfDay === "morning" ? "timeTableMorning" : "timeTableEvening"
          }`
        )?.timeTableId,
      })[0]?.value
    ) {
      setValues({
        scheduleId: scheduleId,
        periodOfDay,
        data: {
          timeTableId,
          remark:
            values?.remark &&
            timeTableId !==
              filter(timeTableOptions, {
                value: get(
                  schedule,
                  `${
                    periodOfDay === "morning"
                      ? "timeTableMorning"
                      : "timeTableEvening"
                  }`
                )?.timeTableId,
              })[0]?.value
              ? values?.remark
              : null,
        },
      })
      onOpen()
    } else {
      submit({
        scheduleId: scheduleId,
        periodOfDay,
        data: {
          timeTableId,
          remark:
            values?.remark &&
            timeTableId !==
              filter(timeTableOptions, {
                value: get(
                  schedule,
                  `${
                    periodOfDay === "morning"
                      ? "timeTableMorning"
                      : "timeTableEvening"
                  }`
                )?.timeTableId,
              })[0]?.value
              ? values?.remark
              : null,
        },
      })
    }
  }

  return (
    <>
      <Head>
        <title>การจัดรถ</title>
        <meta name="description" content="planning" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container
        minHeight="80vh"
        minW="100%"
        paddingInlineStart={{ base: 2, md: 0 }}
        paddingInlineEnd={{ base: 2, md: 0 }}
      >
        <ConfirmDialog
          isOpen={isOpen}
          onClose={onClose}
          title="ยืนยันการแก้ไขเวลา"
          content={
            <>
              คุณยืนยันการแก้ไขเวลา
              {periodOfDay === "morning" ? "รอบไป" : "รอบกลับ"}ของวันที่
              {DateTime.fromJSDate(new Date(`${data?.date}`)).toFormat(
                "dd/MM/y"
              )}{" "}
              {periodOfDay === "morning" ? "รอบไป" : "รอบกลับ"} ใช่หรือไม่ ?
              <br /> <br />
              หมายเหตุ
              การเปลี่ยนแปลงเวลารอบการออกรถจะส่งผลให้รายการจองด้วยเวลาเดิมถูกยกเลิก
            </>
          }
          onSubmit={() => {
            submit(values)
          }}
          isLoading={isLoading || isSubmitting}
        />
        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex flexDirection="column">
            <Flex width="100%" justifyContent="space-between" my={5}>
              <Flex justifyContent="center" flexDirection="column">
                <Text mb={3} fontSize="32px">
                  แก้ไขเวลา ({periodOfDay === "morning" ? "รอบไป" : "รอบกลับ"})
                </Text>
                <HStack>
                  <NextLink href="/admin/plannings" passHref>
                    <Link _focus={{}} _hover={{}}>
                      <Text fontStyle="italic" color="#00A5A8" cursor="pointer">
                        การจัดรถ
                      </Text>
                    </Link>
                  </NextLink>
                  <Text>{">"}</Text>
                  <NextLink
                    href={`/admin/plannings/${scheduleId}/${periodOfDay}`}
                    passHref
                  >
                    <Link _focus={{}} _hover={{}}>
                      <Text fontStyle="italic" color="#00A5A8" cursor="pointer">
                        จัดรถ
                      </Text>
                    </Link>
                  </NextLink>
                  <Text>{">"}</Text>
                  <Text fontStyle="italic">เเก้ไขเวลา</Text>
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
                  ข้อมูลการจัดรอบ
                </Text>
                <Text fontSize="12px" fontWeight={300} pr={4} pt={2}>
                  หากไม่มีรอบเวลาที่คุณต้องการ กรุณาไปเพิ่มที่เมนู “รอบการจัดรถ”
                </Text>
              </Box>
              <Box
                bgColor="#F5F5F5"
                width={{ base: "100%", md: "80%" }}
                p={12}
                borderRadius="8px"
              >
                <Box w="50%" mb={10}>
                  <TextInput
                    name="date"
                    label="วัน/เดือน/ปี"
                    errors={errors}
                    register={register}
                    variant="unstyled"
                    disabled={true}
                    autocomplete="off"
                    colorLabel="primary.500"
                    defaultValue="13/08/2021"
                  />
                </Box>
                <Flex>
                  <FormControl
                    isInvalid={!!errors.timeTableId}
                    w="50%"
                    mb={10}
                    mr={{ base: 2, md: 4 }}
                  >
                    <FormLabel htmlFor="timeTableId">ชื่อรอบ</FormLabel>
                    <Controller
                      name="timeTableId"
                      control={control}
                      render={({ field }) => (
                        <SelectInput
                          options={timeTableOptions}
                          placeholder=""
                          {...field}
                        />
                      )}
                      rules={{ required: "กรุณาเลือกรอบ" }}
                    />
                    <FormErrorMessage>
                      {errors.timeTableId && "กรุณาเลือกรอบ"}
                    </FormErrorMessage>
                  </FormControl>
                  {watchTimeTableId !==
                    filter(timeTableOptions, {
                      value: get(
                        schedule,
                        `${
                          periodOfDay === "morning"
                            ? "timeTableMorning"
                            : "timeTableEvening"
                        }`
                      )?.timeTableId,
                    })[0] && (
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
                <Flex flexDirection="column">
                  {watchTimeTableId &&
                    get(watchTimeTableId, "timeTableRounds") &&
                    [...get(watchTimeTableId, "timeTableRounds")]?.length >
                      0 && (
                      <>
                        <Text color="#00A5A8" fontWeight={600} mb={4}>
                          เวลาขึ้น/ลงรถ
                        </Text>
                        {[...get(watchTimeTableId, "timeTableRounds")].map(
                          (timeTable: any, index: number) => (
                            <Text mb={4} key={index}>
                              {timeTable?.time}
                            </Text>
                          )
                        )}
                      </>
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

export default EditSchedule
