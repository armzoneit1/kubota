import { useForm, Controller, useFieldArray } from "react-hook-form"
import React, { useRef, useEffect, useState } from "react"
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
  IconButton,
  useBreakpointValue,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Link,
} from "@chakra-ui/react"
import { AddIcon } from "@chakra-ui/icons"
import TextInput from "../../input/TextInput"
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd"
import { MdMoreVert } from "react-icons/md"
import { AreaDataTypes } from "../../../data-hooks/areas/types"
import get from "lodash/get"
import isBoolean from "lodash/isBoolean"
import styles from "../../layout/layout.module.css"
import Head from "next/head"
import NextLink from "next/link"

type AreaInfoProps = {
  onSubmit: (values: any) => void
  isLoading: boolean
}

const AreaCreate = ({ onSubmit: submit, isLoading }: AreaInfoProps) => {
  const ref = useRef<any>(null)
  const [height, setHeight] = useState<number>(0)
  const px = useBreakpointValue({ base: "8px", md: "10px", xl: "24px" })

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    control,
  } = useForm()

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "busStops",
  })

  useEffect(() => {
    setHeight(ref.current ? ref.current?.offsetHeight : 0)
  }, [ref.current?.offsetHeigh, fields])

  function onSubmit(values: AreaDataTypes<string | boolean>) {
    const status: boolean | string = get(values, "status")
    values.status = isBoolean(status)
      ? status
      : status === "active"
      ? true
      : false
    const busStops = values.busStops.map((busStop, index) => {
      const status: boolean | string = get(busStop, "status")
      busStop.status = isBoolean(status)
        ? status
        : status === "active"
        ? true
        : false
      busStop.rank = index + 1
      return busStop
    })

    values.busStops = busStops

    submit(values)
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
        <title>จุดจอดรถ</title>
        <meta name="description" content="areas" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Flex flexDirection="column">
          <Flex width="100%" justifyContent="space-between" my={5}>
            <Flex justifyContent="center" flexDirection="column">
              <Text mb={3} fontSize="32px">
                จุดจอด
              </Text>
              <HStack>
                <NextLink href={"/admin/areas"} passHref>
                  <Link _hover={{}} _focus={{}}>
                    <Text fontStyle="italic" color="#00A5A8" cursor="pointer">
                      จุดจอดรถ
                    </Text>
                  </Link>
                </NextLink>
                <Text>{">"}</Text>
                <Text fontStyle="italic">เพิ่มจุดจอด</Text>
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
                พื้นที่
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
              <Box w={{ base: "100%", md: "80%" }}>
                <TextInput
                  name="name"
                  label="พื้นที่"
                  register={register}
                  errors={errors}
                  validation={{
                    required: "กรุณากรอกพื้นที่",
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
                จุดจอด
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
              overflowX="auto"
              className={styles.scroll}
              position="relative"
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
                              <Th px={0}></Th>
                              <Th px={2}></Th>
                              <Th px={px} pl={2} fontSize="16px">
                                จุดจอดรถ
                              </Th>
                              <Th textTransform="none" px={px} fontSize="16px">
                                Status
                              </Th>
                              <Th px={px} pl={2}></Th>
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
                                    <Td w="2%" px={0} textAlign="right">
                                      {index + 1}
                                      {"."}
                                    </Td>
                                    <Td w="5%" px={2}>
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
                                        _focus={{ boxShadow: "none" }}
                                      />
                                    </Td>
                                    <Td
                                      w={{ base: "40%", md: "30%" }}
                                      minW="200px"
                                      px={px}
                                      pl={2}
                                    >
                                      <FormControl
                                        w="100%"
                                        isInvalid={
                                          !!(
                                            errors.busStops &&
                                            errors.busStops[index] &&
                                            errors.busStops[index]?.busStopName
                                          )
                                        }
                                      >
                                        <Input
                                          id={`busStops.${index}.busStopName`}
                                          borderColor="#B2CCCC"
                                          _focus={{
                                            borderColor: "#B2CCCC",
                                            boxShadow: "0 0 0 1px #00A5A8",
                                          }}
                                          {...register(
                                            `busStops.${index}.busStopName`,
                                            { required: "กรุณากรอกจุดจอด" }
                                          )}
                                        />
                                        <FormErrorMessage>
                                          {errors.busStops &&
                                            errors.busStops[index] &&
                                            errors.busStops[index]
                                              ?.busStopName &&
                                            errors.busStops[index]?.busStopName
                                              .message}
                                        </FormErrorMessage>
                                      </FormControl>
                                    </Td>
                                    <Td w="15%" px={px}>
                                      <FormControl
                                        isInvalid={
                                          !!(
                                            errors.busStops &&
                                            errors.busStops[index] &&
                                            errors.busStops[index]?.status
                                          )
                                        }
                                        display="flex"
                                        flexDirection="column"
                                        justifyContent="flex-start"
                                      >
                                        <Controller
                                          name={`busStops.${index}.status`}
                                          control={control}
                                          render={({ field }) => (
                                            <RadioGroup
                                              {...field}
                                              display="flex"
                                              justifyContent={"flex-start"}
                                              alignItems="center"
                                            >
                                              <Radio
                                                value="active"
                                                borderColor="#00A5A8"
                                                colorScheme="primary"
                                                mr={16}
                                              >
                                                Active
                                              </Radio>
                                              <Radio
                                                value="inactive"
                                                borderColor="#00A5A8"
                                                colorScheme="primary"
                                              >
                                                Inactive
                                              </Radio>
                                            </RadioGroup>
                                          )}
                                          rules={{
                                            required: "กรุณาเลือก",
                                          }}
                                        />
                                        <FormErrorMessage>
                                          {errors.busStops &&
                                            errors.busStops[index] &&
                                            errors.busStops[index]?.status &&
                                            errors.busStops[index]?.status
                                              .message}
                                        </FormErrorMessage>
                                      </FormControl>
                                    </Td>
                                    <Td w="5%" px={2} align="right">
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
                      busStopName: "",
                      status: undefined,
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
        </Flex>
      </form>
    </Container>
  )
}

export default AreaCreate
