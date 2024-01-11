/* eslint-disable react/no-children-prop */
import { useForm, Controller, useFieldArray } from "react-hook-form"
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
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Input,
} from "@chakra-ui/react"
import { AddIcon } from "@chakra-ui/icons"
import DatePicker from "../../../input/Datepicker"
import { DateTime } from "luxon"
import { MdMoreVert } from "react-icons/md"
import SelectInput from "../../../input/SelectInput"
import { Options } from "../../../../data-hooks/timeTables/types"
import { DayTypes } from "../../../../data-hooks/schedules/types"
import NextLink from "next/link"
import Head from "next/head"
import { CreateDataType } from "../../../../data-hooks/schedules/daily/create"

type SaturdayWorkdayCreateProps = {
  timeTableMorningOptions: Options[]
  timeTableEveningOptions: Options[]
  isLoading: boolean
  onSubmit: (values: any) => void
  day: "workday" | "saturdayWorkday" | "publicHoliday" | "other" | "weekend"
}

const SaturdayWorkdayCreate = ({
  timeTableMorningOptions,
  timeTableEveningOptions,
  isLoading,
  onSubmit: submit,
  day,
}: SaturdayWorkdayCreateProps) => {
  const [date, setDate] = useState<any>(null)

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting, isValid },
    control,
  } = useForm({
    defaultValues: {
      days: [{ date: null, detail: null }],
      timeTableMorningId: null,
      timeTableEveningId: null,
    },
  })

  function onSubmit(values: any) {
    const data: CreateDataType[] = values.days.map((d: any) => {
      d.date = DateTime.fromJSDate(d?.date).toFormat("y-MM-dd")
      return {
        ...d,
        timeTableMorningId: values.timeTableMorningId.value,
        timeTableEveningId: values.timeTableEveningId.value,
      }
    })
    submit({ day: day, data: data })
  }

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control,
      name: "days",
    }
  )

  return (
    <>
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
                {fields.map((_field, index) => (
                  <Flex
                    mb={10}
                    w={{ base: "100%", md: "80%" }}
                    alignItems="center"
                    key={index}
                  >
                    <FormControl
                      w="50%"
                      mr={{ base: 4, md: 10 }}
                      isInvalid={
                        !!(
                          errors.days &&
                          errors.days[index] &&
                          errors.days[index]?.date
                        )
                      }
                    >
                      <FormLabel htmlFor={`days.${index}.date`}>
                        วัน/เดือน/ปี
                      </FormLabel>
                      <Controller
                        name={`days.${index}.date`}
                        control={control}
                        render={({ field, fieldState }) => (
                          <DatePicker
                            date={date}
                            setDate={setDate}
                            field={field}
                            fieldState={fieldState}
                          />
                        )}
                        rules={{ required: "กรุณาเลือก" }}
                      />
                    </FormControl>
                    <FormControl
                      w="50%"
                      isInvalid={
                        !!(
                          errors.days &&
                          errors.days[index] &&
                          errors.days[index]?.detail
                        )
                      }
                    >
                      <FormLabel htmlFor={`days.${index}.detail`}>
                        รายละเอียด
                      </FormLabel>
                      <Input
                        {...register(`days.${index}.detail`)}
                        borderColor="#B2CCCC"
                        _focus={{
                          borderColor: "#B2CCCC",
                          boxShadow: "0 0 0 1px #00A5A8",
                        }}
                      />
                    </FormControl>
                    <Flex>
                      {fields.length > 1 && (
                        <Menu>
                          <MenuButton
                            as={IconButton}
                            icon={<MdMoreVert />}
                            variant="ghost"
                            fontSize="20px"
                            color="#333333"
                            transform={"translateY(15px)"}
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
                      )}
                    </Flex>
                  </Flex>
                ))}

                <Flex w="50%" mb={10}>
                  <Button
                    onClick={() =>
                      append({
                        date: null,
                        detail: null,
                      })
                    }
                    leftIcon={<AddIcon />}
                  >
                    เพิ่มวันที่
                  </Button>
                </Flex>

                <Flex
                  mb={10}
                  w={{ base: "100%", md: "80%" }}
                  alignItems="center"
                >
                  <FormControl
                    isInvalid={!!errors.timeTableMorningId}
                    w="50%"
                    mr={{ base: 4, md: 10 }}
                  >
                    <FormLabel htmlFor="timeTableMorningId">รอบไป</FormLabel>
                    <Controller
                      name="timeTableMorningId"
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
                      {errors.timeTableMorningId &&
                        errors.timeTableMorningId.message}
                    </FormErrorMessage>
                  </FormControl>
                  <FormControl isInvalid={!!errors.timeTableEveningId} w="50%">
                    <FormLabel htmlFor="timeTableEveningId">รอบกลับ</FormLabel>
                    <Controller
                      name="timeTableEveningId"
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
                      {errors.timeTableEveningId &&
                        errors.timeTableEveningId.message}
                    </FormErrorMessage>
                  </FormControl>
                </Flex>
              </Box>
            </Flex>
          </Flex>
        </form>
      </Container>
    </>
  )
}

export default SaturdayWorkdayCreate
