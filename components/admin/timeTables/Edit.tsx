import { useRouter } from "next/router"
import { useForm, useFieldArray } from "react-hook-form"
import React, { useState } from "react"
import {
  FormErrorMessage,
  FormControl,
  Button,
  Container,
  Flex,
  Box,
  Text,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Input,
  Link,
  useDisclosure,
} from "@chakra-ui/react"
import { AddIcon } from "@chakra-ui/icons"
import TextInput from "../../input/TextInput"
import { MdMoreVert } from "react-icons/md"
import { TimeTableDataTypes } from "../../../data-hooks/timeTables/types"
import get from "lodash/get"
import Head from "next/head"
import NextLink from "next/link"
import ConfirmDialog from "../../ConfirmDialog"
import { DateTime } from "luxon"
import isEqual from "lodash/isEqual"

type TimeTableEditProps = {
  data: TimeTableDataTypes
  isLoading: boolean
  onSubmit: (values: any) => void
}

const TimeTableEdit = ({
  data,
  isLoading,
  onSubmit: submit,
}: TimeTableEditProps) => {
  const router = useRouter()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [values, setValues] = useState<any | null>(null)

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    control,
  } = useForm({ defaultValues: data })

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control,
      name: "timeTableRounds",
    }
  )

  function onSubmit(values: TimeTableDataTypes) {
    const oldDataIds = data.timeTableRounds.map((t) => t.timeTableRoundId)

    const timeTableRounds = get(values, "timeTableRounds")
    const timeTableRoundIds = get(values, "timeTableRounds")
      .map((t) => t.timeTableRoundId)
      .filter((v) => v)
    const showAlert = !isEqual(oldDataIds, timeTableRoundIds)
    values.timeTableRounds = timeTableRounds.map((timeTableRound) => ({
      ...timeTableRound,
      time:
        timeTableRound.hours && timeTableRound.minute
          ? `${
              `${timeTableRound.hours}`.trim().length === 1
                ? `0${`${timeTableRound.hours}`.trim()}`
                : `${`${timeTableRound.hours}`.trim()}`
            }:${
              `${timeTableRound.minute}`.trim().length === 1
                ? `0${`${timeTableRound.minute}`.trim()}`
                : `${`${timeTableRound.minute}`.trim()}`
            }`
          : null,
    }))
    if (showAlert) {
      setValues({ id: data.id, data: values })
      onOpen()
    } else {
      submit({ id: data.id, data: values })
    }
  }

  return (
    <>
      <Head>
        <title>รอบการจัดรถ</title>
        <meta name="description" content="timeTable" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ConfirmDialog
        isOpen={isOpen}
        onClose={onClose}
        title="ยืนยันการแก้ไขเวลา"
        content={
          <>
            คุณยืนยันการแก้ไขเวลา
            {data?.periodOfDay === "morning" ? "รอบไป" : "รอบกลับ"}ของ{" "}
            {data?.name} ใช่หรือไม่ ? <br />
            <br /> <br />
            หมายเหตุ
            การเปลี่ยนแปลงเวลารอบการออกรถจะส่งผลให้รายการจองด้วยเวลาเดิมถูกยกเลิก
          </>
        }
        onSubmit={() => {
          submit(values)
        }}
        isLoading={isSubmitting || isLoading}
      />
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
                  รอบการจัดรถ (
                  {data?.periodOfDay === "morning" ? "รอบไป" : "รอบกลับ"})
                </Text>
                <HStack>
                  <NextLink
                    href={`/admin/timeTables/${data?.periodOfDay}`}
                    passHref
                  >
                    <Link _hover={{}} _focus={{}}>
                      <Text fontStyle="italic" color="#00A5A8" cursor="pointer">
                        รอบการจัดรถ
                      </Text>
                    </Link>
                  </NextLink>
                  <Text>{">"}</Text>
                  <Text fontStyle="italic">แก้ไข</Text>
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
              minH="70vh"
              flexDirection={{ base: "column", md: "row" }}
            >
              <Box width={{ base: "100%", md: "20%" }} mb={{ base: 4, md: 0 }}>
                <Text fontSize="20px" fontWeight={600}>
                  ข้อมูลการจัดรอบ
                </Text>
              </Box>
              <Box
                bgColor="#F5F5F5"
                width={{ base: "100%", md: "80%" }}
                p={12}
                borderRadius="8px"
              >
                <Box w={{ base: "100%", md: "80%", lg: "50%" }} mb={10}>
                  <TextInput
                    name="name"
                    label="ชื่อรอบ"
                    register={register}
                    errors={errors}
                    validation={{
                      required: "กรุณากรอกชื่อรอบ",
                    }}
                  />
                </Box>
                {fields.map((field, index: any) => {
                  return (
                    <Flex
                      mb={10}
                      w={{ base: "100%", md: "80%", lg: "50%" }}
                      key={index}
                      flexDirection="column"
                    >
                      <Flex w="100%">
                        <Text mb={2}>เวลาขึ้น/ลงรถ</Text>
                      </Flex>
                      <Flex>
                        <Flex w="40%">
                          <FormControl
                            isInvalid={
                              !!(
                                errors.timeTableRounds &&
                                errors.timeTableRounds[index] &&
                                errors.timeTableRounds[index]?.hours
                              )
                            }
                            w="100%"
                          >
                            <Input
                              {...register(`timeTableRounds.${index}.hours`, {
                                required: "กรุณากรอก",
                                pattern: {
                                  value: /^(([0-9]*)|(([0-9]*).([0-9]*)))$/i,
                                  message: "Invalid time",
                                },
                                max: {
                                  value: 23,
                                  message: "กรอกข้อมูลระหว่าง 0 ถึง 23",
                                },
                                min: {
                                  value: 0,
                                  message: "กรอกข้อมูลระหว่าง 0 ถึง 23",
                                },
                              })}
                              borderColor="#B2CCCC"
                              _focus={{
                                borderColor: "#B2CCCC",
                                boxShadow: "0 0 0 1px #00A5A8",
                              }}
                              isReadOnly={Boolean(field?.timeTableRoundId)}
                            />

                            <FormErrorMessage>
                              {errors.timeTableRounds &&
                                errors.timeTableRounds[index] &&
                                errors.timeTableRounds[index]?.hours &&
                                errors.timeTableRounds[index]?.hours?.message}
                            </FormErrorMessage>
                          </FormControl>
                        </Flex>
                        <Flex
                          alignItems="flex-start"
                          justifyContent="center"
                          w="5%"
                          mx={2}
                        >
                          <Text
                            height="40px"
                            display="inline-flex"
                            alignItems="center"
                          >{`:`}</Text>
                        </Flex>
                        <Flex w="40%">
                          <FormControl
                            isInvalid={
                              !!(
                                errors.timeTableRounds &&
                                errors.timeTableRounds[index] &&
                                errors.timeTableRounds[index]?.minute
                              )
                            }
                            w="100%"
                          >
                            <Input
                              {...register(`timeTableRounds.${index}.minute`, {
                                required: "กรุณากรอก",
                                pattern: {
                                  value: /^(([0-9]*)|(([0-9]*).([0-9]*)))$/i,
                                  message: "Invalid time",
                                },
                                max: {
                                  value: 59,
                                  message: "กรอกข้อมูลระหว่าง 0 ถึง 59",
                                },
                                min: {
                                  value: 0,
                                  message: "กรอกข้อมูลระหว่าง 0 ถึง 59",
                                },
                              })}
                              borderColor="#B2CCCC"
                              _focus={{
                                borderColor: "#B2CCCC",
                                boxShadow: "0 0 0 1px #00A5A8",
                              }}
                              isReadOnly={Boolean(field?.timeTableRoundId)}
                            />

                            <FormErrorMessage>
                              {errors.timeTableRounds &&
                                errors.timeTableRounds[index] &&
                                errors.timeTableRounds[index]?.minute &&
                                errors.timeTableRounds[index]?.minute?.message}
                            </FormErrorMessage>
                          </FormControl>
                        </Flex>
                        <Flex
                          alignItems="flex-start"
                          justifyContent="flex-end"
                          w="15%"
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
                    </Flex>
                  )
                })}
                <Button
                  onClick={() =>
                    append({
                      hours: "",
                      minute: "",
                    })
                  }
                  leftIcon={<AddIcon />}
                >
                  เพิ่มเวลา
                </Button>
              </Box>
            </Flex>
          </Flex>
        </form>
      </Container>
    </>
  )
}

export default TimeTableEdit
