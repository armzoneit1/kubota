import {
  Container,
  Box,
  Text,
  Button,
  Flex,
  FormErrorMessage,
  FormLabel,
  FormControl,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  HStack,
  Link,
  UnorderedList,
  ListItem,
} from "@chakra-ui/react"
import Head from "next/head"
import { useForm, Controller, useFieldArray } from "react-hook-form"
import { MdClose } from "react-icons/md"
import NextLink from "next/link"
import { AddIcon } from "@chakra-ui/icons"
import { Option } from "../../../data-hooks/subordinates/getMyEmployee"
import AsyncSelectInput from "../../input/AsyncSelectInput"
import uniq from "lodash/uniq"
import { useAccountMe } from "../../../providers/account-me-provider"
import filter from "lodash/filter"
import { useMemo, useState } from "react"
import ConfirmDialog from "../../ConfirmDialog"

type SubordinateCreateProps = {
  onSubmit: (values: any) => void
  isLoading: boolean
  employeeList: Option[]
}

const SubordinateCreate = ({
  onSubmit: submit,
  isLoading,
  employeeList,
}: SubordinateCreateProps) => {
  const me = useAccountMe()
  const [isOpen, setOpen] = useState<boolean>(false)
  const [employeeHasSupervisor, setEmployeeHasSupervisor] = useState<any>(null)
  const [values, setValues] = useState<any | null>(null)

  const employeeOptions = useMemo(
    () =>
      employeeList
        ? filter(employeeList, (v) => v.value !== me?.myHrEmployee?.employeeNo)
        : [],
    [employeeList, me?.myHrEmployee?.employeeNo]
  )

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    control,
    watch,
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      subordinates: [
        {
          employeeNo: undefined,
        },
      ],
    },
  })

  const {
    fields: fieldsSubordinates,
    append: appendSubordinates,
    remove: removeSubordinates,
  } = useFieldArray({
    control,
    name: "subordinates",
  })

  const watchSubordinates = watch("subordinates")

  const onSubmit = (values: any) => {
    const filteredEmployee = filter(
      values.subordinates,
      (emp) =>
        emp?.employeeNo?.supervisorEmployeeNo ||
        emp?.employeeNo?.supervisorEmployeeNoFromApproval
    )

    const subordinateEmployeeNos = values.subordinates.map(
      (subordinate: any) => subordinate.employeeNo.value
    )

    if (filteredEmployee.length > 0) {
      setValues({ subordinateEmployeeNos: uniq(subordinateEmployeeNos) })
      setEmployeeHasSupervisor(
        filteredEmployee.map((emp) => emp?.employeeNo?.label)
      )
      setOpen(true)
    } else {
      submit({ subordinateEmployeeNos: uniq(subordinateEmployeeNos) })
    }
  }

  return (
    <>
      <Head>
        <title>พนักงานในความดูแล</title>
        <meta name="description" content="subordinates" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ConfirmDialog
        title=""
        content={
          <>
            <Text>
              พนักงานมีผู้ดูแลอยู่แล้วต้องการเปลี่ยนให้มาอยู่ในความดูแลของตัวเองใช่หรือไม่
            </Text>
            <br />
            <UnorderedList>
              {employeeHasSupervisor?.map((emp: any) => (
                <ListItem key={emp}>{emp}</ListItem>
              ))}
            </UnorderedList>
          </>
        }
        onSubmit={() => {
          submit(values)
        }}
        isLoading={isLoading}
        isOpen={isOpen}
        onClose={() => {
          setOpen(false)
        }}
        type="error"
        acceptLabel="ใช่"
        size="2xl"
      />
      <Container
        minW="100%"
        minHeight="100%"
        paddingInlineStart={{ base: 2, md: 0 }}
        paddingInlineEnd={{ base: 2, md: 0 }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex width="100%" justifyContent="space-between" my={5}>
            <Flex justifyContent="center" flexDirection="column">
              <HStack spacing={6}>
                <NextLink href={"/employee/subordinates"} passHref>
                  <Link _hover={{}} _focus={{}}>
                    <Text color="#00A5A8">พนักงานในความดูแล</Text>
                  </Link>
                </NextLink>
                <Text>{">"}</Text>
                <Text color="#00000080">เพิ่มพนักงาน</Text>
              </HStack>
            </Flex>
          </Flex>
          <Flex w="100%" justifyContent="space-between" mb={10}>
            <Text fontSize="32px" fontWeight={600}>
              เพิ่มพนักงาน
            </Text>
            <Button
              isLoading={isSubmitting || isLoading}
              type="submit"
              disabled={
                watchSubordinates?.length === 0 || watchSubordinates == null
              }
            >
              บันทึก
            </Button>
          </Flex>
          <Flex flexDirection="column">
            <Box mb={10}>
              <Box
                border="1px solid #B2CCCC"
                borderRadius="6px"
                width="100%"
                mb={10}
                px={{ base: 6, md: 12 }}
                py={12}
              >
                <Text fontSize="20px" fontWeight={600} mb={4}>
                  รายชื่อพนักงาน
                </Text>
                <Box width={{ base: "100%", md: "80%", xl: "60%" }} mb={10}>
                  <Table variant="unstyled" width="100%">
                    <Thead>
                      <Tr>
                        <Th width="2%" px={2}></Th>
                        <Th
                          width={{ base: "88%", md: "80%" }}
                          px={{ base: 4, md: 2 }}
                        ></Th>
                        <Th width="10%" px={2}></Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {fieldsSubordinates.map((field, index) => (
                        <Tr key={field.id}>
                          <Td
                            verticalAlign={
                              !!(
                                errors.subordinates &&
                                errors.subordinates[index] &&
                                errors.subordinates[index]?.employeeNo
                              )
                                ? "middle"
                                : "bottom"
                            }
                            px={2}
                          >
                            <Text h="40px" display="flex" alignItems="center">
                              {index + 1}.
                            </Text>
                          </Td>
                          <Td px={{ base: 4, md: 2 }}>
                            <FormControl
                              isInvalid={
                                !!(
                                  errors.subordinates &&
                                  errors.subordinates[index] &&
                                  errors.subordinates[index]?.employeeNo
                                )
                              }
                              w="100%"
                            >
                              <FormLabel
                                htmlFor={`subordinates.${index}.employeeNo`}
                              >
                                รหัส / ชื่อพนักงาน
                              </FormLabel>
                              <Controller
                                name={`subordinates.${index}.employeeNo`}
                                control={control}
                                render={({ field, fieldState }) => (
                                  <AsyncSelectInput
                                    options={employeeOptions}
                                    {...field}
                                    {...fieldState}
                                    placeholder=""
                                  />
                                )}
                                rules={{
                                  required: "กรุณาเลือกพนักงาน",
                                }}
                              />
                              <FormErrorMessage>
                                <FormErrorMessage>
                                  {errors.subordinates &&
                                    errors.subordinates[index] &&
                                    errors.subordinates[index]?.employeeNo &&
                                    errors.subordinates[index]?.employeeNo
                                      ?.message}
                                </FormErrorMessage>
                              </FormErrorMessage>
                            </FormControl>
                          </Td>
                          <Td
                            verticalAlign={
                              !!(
                                errors.subordinates &&
                                errors.subordinates[index] &&
                                errors.subordinates[index]?.employeeNo
                              )
                                ? "middle"
                                : "bottom"
                            }
                            px={2}
                          >
                            <IconButton
                              icon={<MdClose />}
                              aria-label="delete"
                              variant="ghost"
                              color="#333333"
                              fontSize="20px"
                              onClick={() => {
                                removeSubordinates(index)
                              }}
                              _focus={{ boxShadow: "none" }}
                            />
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
                <Button
                  variant="text"
                  textDecoration="underline"
                  color="primary.500"
                  px={0}
                  leftIcon={<AddIcon fontSize="12px" />}
                  _focus={{ boxShadow: "none" }}
                  onClick={() => {
                    appendSubordinates({
                      employeeNo: undefined,
                    })
                  }}
                >
                  เพิ่มรายชื่อ
                </Button>
              </Box>
            </Box>
          </Flex>
        </form>
      </Container>
    </>
  )
}

export default SubordinateCreate
