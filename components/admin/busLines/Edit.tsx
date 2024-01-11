import { useForm, Controller, useFieldArray } from "react-hook-form"
import React, { useState, useEffect, useRef } from "react"
import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button,
  Container,
  Flex,
  Box,
  Text,
  RadioGroup,
  Radio,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  IconButton,
  MenuList,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Link,
  useDisclosure,
} from "@chakra-ui/react"
import { AddIcon } from "@chakra-ui/icons"
import TextInput from "../../input/TextInput"
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd"
import SelectInput from "../../input/SelectInput"
import { MdMoreVert } from "react-icons/md"
import { BusLineDataTypes } from "../../../data-hooks/busLines/types"
import { GroupChoice } from "../../../data-hooks/busLines/getList"
import Head from "next/head"
import get from "lodash/get"
import isBoolean from "lodash/isBoolean"
import NextLink from "next/link"
import ConfirmDialog from "../../ConfirmDialog"

type BusLineProps = {
  data: BusLineDataTypes
  onSubmit: (values: any) => void
  isLoading: boolean
  options: GroupChoice
  isLoadingDelete: boolean
  onDelete: (values: any) => void
}

const BusLineEdit = ({
  data,
  options,
  isLoading,
  onSubmit: submit,
  isLoadingDelete,
  onDelete,
}: BusLineProps) => {
  const ref = useRef<any>(null)
  const [height, setHeight] = useState<number>(0)
  const { isOpen, onClose, onOpen } = useDisclosure()
  const [values, setValues] = useState<any | null>(null)
  const [isOpenInactive, setOpenInactive] = useState<boolean>(false)
  const [isEditBusStop, setIsEditBusStop] = useState<boolean>(false)

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
      name: "busStops",
    }
  )

  useEffect(() => {
    setHeight(ref.current ? ref.current?.offsetHeight : 0)
  }, [ref.current?.offsetHeigh, fields])

  function onSubmit(values: BusLineDataTypes<boolean>) {
    const status: boolean | string = get(values, "status")
    let isEditOrDeleteBusStops: any[] = []
    const busStopIds: (any | null)[] = values?.busStops
      ?.map((b) => ({
        busStopId: +get(b, "busStop.value"),
        busStopLineMappingId: b?.busStopLineMappingId ?? null,
      }))
      ?.filter((b) => b?.busStopId != null && b?.busStopLineMappingId != null)

    const busStops = values.busStops.map((busStop, index) => {
      const oldData = data?.busStops?.find(
        (b) =>
          b?.busStopId === busStop?.busStopId &&
          b?.busStopLineMappingId === busStop?.busStopLineMappingId
      )
      const busStopId: number = get(busStop, "busStop.value")
      const busStopLineMappingId = busStop?.busStopLineMappingId
        ? busStop.busStopLineMappingId
        : null

      return {
        busStopId: +busStopId,
        rank: index + 1,
        busStopLineMappingId: busStopLineMappingId,
      }
    })

    values.status = isBoolean(status)
      ? status
      : status === "active"
      ? true
      : false

    busStops?.forEach((b) => {
      if (b?.busStopId != null && b?.busStopLineMappingId != null) {
        const oldData = data?.busStops?.find(
          (bus) =>
            bus?.busStopId === b?.busStopId &&
            bus?.busStopLineMappingId === b?.busStopLineMappingId
        )

        if (oldData != null) {
          isEditOrDeleteBusStops.push({
            busStopId: b?.busStopId,
            busStopLineMappingId: b?.busStopLineMappingId ?? null,
            isEditOrDelete: false,
          })
        } else {
          isEditOrDeleteBusStops.push({
            busStopId: b?.busStopId,
            busStopLineMappingId: b?.busStopLineMappingId ?? null,
            isEditOrDelete: true,
          })
        }
      } else {
        isEditOrDeleteBusStops.push({
          busStopId: b?.busStopId,
          busStopLineMappingId: b?.busStopLineMappingId ?? null,
          isEditOrDelete: false,
        })
      }
    })

    data?.busStops
      ?.filter(
        (b) =>
          !busStopIds?.includes({
            busStopId: b?.busStopId,
            busStopLineMappingId: b?.busStopLineMappingId ?? null,
          })
      )
      ?.forEach((b) => {
        isEditOrDeleteBusStops.push({
          busStopId: b?.busStopId,
          busStopLineMappingId: b?.busStopLineMappingId ?? null,
          isEditOrDelete: true,
        })
      })

    if (values.status) {
      if (isEditOrDeleteBusStops?.find((b) => b.isEditOrDelete)) {
        setValues({
          id: data.id,
          data: {
            name: values.name,
            status: values.status,
            busStops: busStops,
          },
        })
        setIsEditBusStop(true)
      } else {
        submit({
          id: data.id,
          data: {
            name: values.name,
            status: values.status,
            busStops: busStops,
            periodOfDay: data.periodOfDay,
          },
        })
      }
    } else {
      setValues({
        id: data.id,
        data: {
          name: values.name,
          status: values.status,
          busStops: busStops,
        },
      })
      setOpenInactive(true)
    }
  }

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return
    }

    if (result.destination.index === result.source.index) {
      return
    }

    move(result.source.index, result.destination.index)
  }

  return (
    <Container
      minHeight="80vh"
      minW="100%"
      paddingInlineStart={{ base: 2, md: 0 }}
      paddingInlineEnd={{ base: 2, md: 0 }}
    >
      <Head>
        <title>สายรถ</title>
        <meta name="description" content="busLine" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ConfirmDialog
        title="ลบสายรถ"
        content={`การลบสายรถ ${data?.name} รายการจองในอนาคตทั้งหมดของพนักงานที่ลงจุดจอดในสายรถนี้จะถูกยกเลิก`}
        type="error"
        acceptLabel="ยืนยัน"
        isOpen={isOpen}
        onClose={onClose}
        isLoading={isLoadingDelete}
        onSubmit={() => {
          onDelete({
            busLineId: data?.id,
            from: "edit",
            onClose: onClose,
            periodOfDay: data?.periodOfDay,
          })
        }}
      />
      <ConfirmDialog
        title=""
        content="การ inactive สายรถ รายการจองในอนาคตทั้งหมดของพนักงานที่ลงจุดจอดในสายรถนี้จะถูกยกเลิก"
        onSubmit={() => {
          submit(values)
        }}
        isLoading={isLoading}
        isOpen={isOpenInactive}
        onClose={() => {
          setOpenInactive(false)
        }}
        type="error"
      />
      <ConfirmDialog
        title=""
        content="หากยืนยันการแก้ไขข้อมูลสายรถ รายการจองในอนาคตทั้งหมดของพนักงานที่ลงจุดจอดในสายรถนี้จะถูกยกเลิก"
        onSubmit={() => {
          submit(values)
        }}
        isLoading={isLoading}
        isOpen={isEditBusStop}
        onClose={() => {
          setIsEditBusStop(false)
        }}
        type="error"
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Flex flexDirection="column">
          <Flex width="100%" justifyContent="space-between" my={5}>
            <Flex justifyContent="center" flexDirection="column">
              <Text mb={3} fontSize="32px">
                สายรถ ({data?.periodOfDay === "morning" ? "รอบไป" : "รอบกลับ"})
              </Text>
              <HStack>
                <NextLink
                  href={`/admin/busLines/${data?.periodOfDay}`}
                  passHref
                >
                  <Link _hover={{}} _focus={{}}>
                    <Text fontStyle="italic" color="#00A5A8" cursor="pointer">
                      สายรถ
                    </Text>
                  </Link>
                </NextLink>
                <Text>{">"}</Text>
                <Text fontStyle="italic">เเก้ไข</Text>
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
                ข้อมูลสายรถ
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
              <Box w={{ base: "100%", md: "70%" }}>
                <TextInput
                  name="name"
                  label="ชื่อสาย"
                  register={register}
                  errors={errors}
                  validation={{
                    required: "กรุณากรอกชื่อสาย",
                  }}
                />
              </Box>
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
                จุดจอดรถ
              </Text>
            </Box>
            <Box
              bgColor="#F5F5F5"
              width={{ base: "100%", md: "80%" }}
              p={12}
              borderRadius="8px"
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
            >
              {fields && fields.length > 0 && (
                <Box w="100%" ref={ref} minH={height}>
                  <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="list">
                      {(provided) => (
                        <Table
                          variant="unstyled"
                          mb={10}
                          w="80%"
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                        >
                          <Thead>
                            <Tr>
                              <Th px={1}></Th>
                              <Th pl={2} fontSize="16px">
                                จุดจอดรถ
                              </Th>
                              <Th pl={2}></Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {fields.map((field, index) => (
                              <Draggable
                                draggableId={field.id}
                                key={field.id}
                                index={index}
                              >
                                {(provided) => (
                                  <Tr
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                  >
                                    <Td w="1%" px={1} textAlign="left">
                                      {index + 1}
                                      {"."}
                                    </Td>
                                    <Td
                                      w={{ base: "40%", md: "25%" }}
                                      minW={{ base: "300px", md: "200px" }}
                                      px={1}
                                    >
                                      <Flex
                                        w="100%"
                                        height="100%"
                                        alignItems="center"
                                      >
                                        <IconButton
                                          {...provided.dragHandleProps}
                                          aria-label="move"
                                          variant="ghost"
                                          icon={
                                            <svg
                                              width="24"
                                              height="24"
                                              viewBox="0 0 24 24"
                                              fill="none"
                                              xmlns="http://www.w3.org/2000/svg"
                                            >
                                              <path
                                                d="M3.97461 8H19.9746M3.97461 12.5249H19.9746M3.97461 17.0249H19.9746"
                                                stroke="#333333"
                                                strokeOpacity="0.4"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                              />
                                            </svg>
                                          }
                                          mr={2}
                                          _focus={{ boxShadow: "none" }}
                                        />
                                        <FormControl
                                          w="100%"
                                          mr={{ base: 2, md: 5 }}
                                        >
                                          <Flex w="100%">
                                            <Flex
                                              flexDirection="column"
                                              w="100%"
                                            >
                                              <FormControl
                                                isInvalid={
                                                  !!(
                                                    errors.busStops &&
                                                    errors.busStops[index] &&
                                                    errors.busStops[index]
                                                      ?.busStop
                                                  )
                                                }
                                              >
                                                <Controller
                                                  name={`busStops.${index}.busStop`}
                                                  control={control}
                                                  render={({
                                                    field,
                                                    fieldState,
                                                  }) => (
                                                    <SelectInput
                                                      options={options}
                                                      placeholder=""
                                                      {...field}
                                                      {...fieldState}
                                                    />
                                                  )}
                                                  rules={{
                                                    required: true,
                                                  }}
                                                />
                                                <FormErrorMessage>
                                                  {errors.busStops &&
                                                    errors.busStops[index] &&
                                                    errors.busStops[index]
                                                      ?.busStop &&
                                                    "กรุณาเลือกจุดจอด"}
                                                </FormErrorMessage>
                                              </FormControl>
                                            </Flex>
                                          </Flex>
                                        </FormControl>
                                      </Flex>
                                    </Td>

                                    <Td w="5%" px={2}>
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
                                    </Td>
                                  </Tr>
                                )}
                              </Draggable>
                            ))}
                          </Tbody>
                        </Table>
                      )}
                    </Droppable>
                  </DragDropContext>
                </Box>
              )}
              <Box>
                <Button
                  onClick={() =>
                    append({
                      busStop: undefined,
                    })
                  }
                  leftIcon={<AddIcon />}
                  _focus={{ boxShadow: "none" }}
                >
                  เพิ่มจุดจอด
                </Button>
              </Box>
            </Box>
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
              ลบสายรถ
            </Button>
          </Flex>
        </Flex>
      </form>
    </Container>
  )
}

export default BusLineEdit
