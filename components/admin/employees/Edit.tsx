import { useForm, Controller } from "react-hook-form"
import React, { useState, useMemo } from "react"
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
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Link,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Spinner,
  Center,
} from "@chakra-ui/react"
import TextInput from "../../input/TextInput"
import styles from "../../layout/layout.module.css"
import { EmployeeDataTypes } from "../../../data-hooks/employees/types"
import NextLink from "next/link"
import Head from "next/head"
import hasIn from "lodash/hasIn"
import get from "lodash/get"
import filter from "lodash/filter"
import isBoolean from "lodash/isBoolean"
import { MdMoreVert } from "react-icons/md"
import Status from "../../TableComponent/Status"
import { AddIcon } from "@chakra-ui/icons"
import AddEmployeeModal from "./AddEmployeeModal"
import { Option } from "../../../data-hooks/employees/getEmpList"
import { SubordinateDataTypes } from "../../../data-hooks/employees/types"
import ConfirmDialog from "../../ConfirmDialog"
import AsyncSelectInput from "../../input/AsyncSelectInput"
import { useAccountMe } from "../../../providers/account-me-provider"

const DayOfWeeks = {
  monday: "จันทร์",
  tuesday: "อังคาร",
  wednesday: "พุธ",
  thursday: "พฤหัสบดี",
  friday: "ศุกร์",
  saturday: "เสาร์",
  sunday: "อาทิตย์",
}

type EmployeeEditProps = {
  data: EmployeeDataTypes
  isLoading: boolean
  isLoadingAdd: boolean
  isLoadingDelete: boolean
  isLoadingDeleteSubordinate: boolean
  isLoadingDeleteSupervisor: boolean
  isFetchingSubordinateList: boolean
  onSubmit: (values: any) => void
  onAdd: (values: any) => void
  onDeleteSubordinate: (values: any) => void
  onDelete: (values: any) => void
  onDeleteSupervisor: (values: any) => void
  employeeList: Option[]
  subordinateList: SubordinateDataTypes[]
}

const EmployeeEdit = ({
  data,
  isLoading,
  onSubmit: submit,
  employeeList,
  subordinateList,
  isFetchingSubordinateList,
  isLoadingAdd,
  isLoadingDeleteSubordinate,
  onAdd,
  onDeleteSubordinate,
  isLoadingDelete,
  onDelete,
  isLoadingDeleteSupervisor,
  onDeleteSupervisor,
}: EmployeeEditProps) => {
  const me = useAccountMe()
  const employeeOptions = useMemo(
    () =>
      employeeList
        ? filter(employeeList, (v) => v.value !== data?.employeeNo)
        : [],
    [employeeList, data?.employeeNo]
  )

  const [isOpen, setOpen] = useState<boolean>(false)
  const [isOpenInactive, setOpenInactive] = useState<boolean>(false)
  const [
    isOpenConfirmDeleteSubordinate,
    setOpenConfirmDeleteSubordinate,
  ] = useState<boolean>(false)
  const [isOpenConfirmDelete, setOpenConfirmDelete] = useState<boolean>(false)
  const [
    isOpenConfirmDeleteSupervisor,
    setOpenConfirmDeleteSupervisor,
  ] = useState<boolean>(false)
  const [values, setValues] = useState<any | null>(null)

  const [selected, setSelected] = useState<{
    employeeNo: string
    name: string
  }>({ employeeNo: "", name: "" })
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    control,
  } = useForm({
    defaultValues: {
      ...data,
      status: data?.status ? "active" : "inactive",
      supervisorEmployeeNo:
        employeeOptions && data?.supervisorEmployeeNo
          ? filter(employeeOptions, { value: data?.supervisorEmployeeNo })[0]
          : employeeOptions && data?.supervisorEmployeeNoFromApproval
          ? filter(employeeOptions, {
              value: data?.supervisorEmployeeNoFromApproval,
            })[0]
          : null,
      phoneNo: data?.phoneNo && data?.phoneNo != "" ? data?.phoneNo : "-",
    },
  })

  function onSubmit(values: EmployeeDataTypes) {
    const status: boolean | string = get(values, "status")
    const supervisorEmployeeNo = values.supervisorEmployeeNo
      ? get(values, "supervisorEmployeeNo.value")
      : null

    values.status = isBoolean(status)
      ? status
      : status === "active"
      ? true
      : false
    values.supervisorEmployeeNo = supervisorEmployeeNo
    if (values.status) {
      submit({
        id: data.employeeNo,
        data: {
          status: values.status,
          supervisorEmployeeNo: values.supervisorEmployeeNo,
        },
      })
    } else {
      setValues({
        id: data.employeeNo,
        data: {
          status: values.status,
          supervisorEmployeeNo: values.supervisorEmployeeNo,
        },
      })
      setOpenInactive(true)
    }
  }

  const onOpenSubordinate = () => {
    setOpenConfirmDeleteSubordinate(true)
  }

  const onCloseSubordinate = () => {
    setOpenConfirmDeleteSubordinate(false)
  }
  const onOpenSupervisor = () => {
    setOpenConfirmDeleteSupervisor(true)
  }

  const onCloseSupervisor = () => {
    setOpenConfirmDeleteSupervisor(false)
  }
  const onOpen = () => {
    setOpenConfirmDelete(true)
  }

  const onClose = () => {
    setOpenConfirmDelete(false)
  }

  const handleDelete = (field: any) => {
    setSelected({
      employeeNo: `${field?.employeeNo}`,
      name: `${field?.title}${field?.firstName} ${field?.lastName}`,
    })
    onOpenSubordinate()
  }

  return (
    <>
      <Head>
        <title>พนักงาน</title>
        <meta name="description" content="employee" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ConfirmDialog
        title=""
        content="หากยืนยันการปิดใช้งานบัญชี รายการจองในอนาคตทั้งหมดของพนักงานที่ Inactive จะถูกยกเลิก"
        onSubmit={() => {
          submit(values)
          setOpenInactive(false)
        }}
        isLoading={isLoading}
        isOpen={isOpenInactive}
        onClose={() => {
          setOpenInactive(false)
        }}
        type="error"
      />
      <ConfirmDialog
        title="ลบออกจากความดูแล"
        content={`ยืนยันที่จะลบ ${selected.name} ออกจากความดูแล`}
        onSubmit={() => {
          onDeleteSubordinate({
            subordinateEmployeeNos: [selected.employeeNo],
            employeeNo: data.employeeNo,
            onClose: onCloseSubordinate,
          })
        }}
        isLoading={isLoadingDeleteSubordinate}
        isOpen={isOpenConfirmDeleteSubordinate}
        onClose={onCloseSubordinate}
        type="error"
      />
      <ConfirmDialog
        title="ลบบัญชีผู้ใช้"
        content={`คุณต้องการลบบัญชีผู้ใช้ของ ${data?.firstName} ${data?.lastName} ใช่หรือไม่ ?`}
        onSubmit={() => {
          onDelete({
            employeeNo: data.employeeNo,
            from: "edit",
          })
          setTimeout(() => {
            onClose()
          }, 500)
        }}
        isLoading={isLoadingDelete}
        isOpen={isOpenConfirmDelete}
        onClose={onClose}
        type="error"
      />
      <AddEmployeeModal
        isOpen={isOpen}
        onClose={() => {
          setOpen(false)
        }}
        employeeList={employeeOptions}
        onSubmit={onAdd}
        isLoading={isLoadingAdd}
        employeeNo={data?.employeeNo}
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
                  แก้ไข
                </Text>
                <HStack>
                  <NextLink href={"/admin/employees"} passHref>
                    <Link _hover={{}} _focus={{}}>
                      <Text fontStyle="italic" color="#00A5A8">
                        พนักงาน
                      </Text>
                    </Link>
                  </NextLink>
                  <Text>{">"}</Text>
                  <Text fontStyle="italic">แก้ไข</Text>
                </HStack>
              </Flex>
            </Flex>
            <Flex
              width="100%"
              minH="100%"
              flexDirection={{ base: "column", md: "row" }}
              mb={4}
            >
              <Box width={{ base: "100%", md: "20%" }} mb={{ base: 4, md: 0 }}>
                <Text fontSize="20px" fontWeight={600}>
                  ข้อมูลส่วนตัว
                </Text>
              </Box>
              <Box
                bgColor="#F5F5F5"
                width={{ base: "100%", md: "80%" }}
                p={12}
                borderRadius="8px"
                overflowX="auto"
                className={styles.scroll}
                position="relative"
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
                        width={{ base: "60%", md: "35%" }}
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
                <Table
                  variant="unstyled"
                  width={{ base: "100%", md: "80%" }}
                  mb={10}
                >
                  <Thead>
                    <Tr>
                      <Th px={0}></Th>
                      <Th px={0}></Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    <Tr>
                      <Td px={0} minWidth={200}>
                        <TextInput
                          name="employeeNo"
                          label="รหัสพนักงาน"
                          errors={errors}
                          register={register}
                          variant="unstyled"
                          disabled={true}
                          autocomplete="off"
                          colorLabel="primary.500"
                        />
                      </Td>
                      <Td px={0} pl={28}>
                        <TextInput
                          name="workAreaName"
                          label="สังกัด"
                          errors={errors}
                          register={register}
                          variant="unstyled"
                          disabled={true}
                          autocomplete="off"
                          colorLabel="primary.500"
                        />
                      </Td>
                    </Tr>
                    <Tr>
                      <Td px={0} minWidth={200}>
                        <TextInput
                          name="firstName"
                          label="ชื่อ"
                          errors={errors}
                          register={register}
                          variant="unstyled"
                          disabled={true}
                          autocomplete="off"
                          colorLabel="primary.500"
                          minWidth={250}
                        />
                      </Td>
                      <Td px={0} pl={28}>
                        <TextInput
                          name="lastName"
                          label="นามสกุล"
                          errors={errors}
                          register={register}
                          variant="unstyled"
                          disabled={true}
                          autocomplete="off"
                          colorLabel="primary.500"
                          minWidth={400}
                        />
                      </Td>
                    </Tr>
                    <Tr>
                      <Td px={0} minWidth={200}>
                        <TextInput
                          name="jobName"
                          label="หน่วยงาน"
                          errors={errors}
                          register={register}
                          variant="unstyled"
                          disabled={true}
                          autocomplete="off"
                          colorLabel="primary.500"
                        />
                      </Td>
                      <Td px={0} pl={28}>
                        <TextInput
                          name="positionName"
                          label="ส่วนงาน"
                          errors={errors}
                          register={register}
                          variant="unstyled"
                          disabled={true}
                          autocomplete="off"
                          colorLabel="primary.500"
                        />
                      </Td>
                    </Tr>
                    <Tr>
                      <Td px={0} width="100%" colSpan={2}>
                        <TextInput
                          name="email"
                          label="อีเมล"
                          errors={errors}
                          register={register}
                          variant="unstyled"
                          disabled={true}
                          autocomplete="off"
                          colorLabel="primary.500"
                        />
                      </Td>
                    </Tr>
                    <Tr>
                      <Td px={0} minWidth={200}>
                        <TextInput
                          name="phoneNo"
                          label="เบอร์ภายใน"
                          errors={errors}
                          register={register}
                          variant="unstyled"
                          disabled={true}
                          autocomplete="off"
                          colorLabel="primary.500"
                        />
                      </Td>
                      <Td px={0} pl={28}>
                        <TextInput
                          name="mobileNo"
                          label="เบอร์โทรศัพท์(ส่วนตัว)"
                          errors={errors}
                          register={register}
                          variant="unstyled"
                          disabled={true}
                          autocomplete="off"
                          colorLabel="primary.500"
                        />
                      </Td>
                    </Tr>
                  </Tbody>
                </Table>
                <Flex mr={{ base: 1, md: 3 }} alignItems="flex-end">
                  <FormControl
                    isInvalid={!!errors.supervisorEmployeeNo}
                    w={{ base: "100%", md: "50%" }}
                  >
                    <FormLabel htmlFor={`supervisorEmployeeNo`}>
                      ผู้ดูแล
                    </FormLabel>
                    <Flex width="100%" style={{ gap: "10px" }}>
                      <Box width="80%">
                        <Controller
                          name={`supervisorEmployeeNo`}
                          control={control}
                          render={({ field, fieldState }) => (
                            <AsyncSelectInput
                              options={employeeOptions}
                              {...field}
                              {...fieldState}
                              placeholder=""
                              menuPortalTarget={document.body}
                            />
                          )}
                        />
                      </Box>
                      <Flex w="20%" alignItems="center">
                        {data?.supervisorEmployeeNo != null
                          ? "(Manual)"
                          : data?.supervisorEmployeeNoFromApproval != null
                          ? "(HrConnect)"
                          : null}
                      </Flex>
                    </Flex>

                    <FormErrorMessage>
                      <FormErrorMessage>
                        {errors.supervisorEmployeeNo &&
                          get(errors.supervisorEmployeeNo, "message")}
                      </FormErrorMessage>
                    </FormErrorMessage>
                  </FormControl>
                </Flex>
              </Box>
            </Flex>
            <Flex mb={{ base: 6, md: 10 }}>
              <Box
                width={{ base: "100%", md: "20%" }}
                display={{ base: "none", md: "block" }}
              ></Box>
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
            <Flex
              width="100%"
              minH="100%"
              flexDirection={{ base: "column", md: "row" }}
              mb={{ base: 6, md: 10 }}
            >
              <Box width={{ base: "100%", md: "20%" }} mb={{ base: 4, md: 0 }}>
                <Text fontSize="20px" fontWeight={600}>
                  ข้อมูลการใช้บริการ
                </Text>
              </Box>
              <Box
                bgColor="#F5F5F5"
                width={{ base: "100%", md: "80%" }}
                p={12}
                borderRadius="8px"
                overflowX="auto"
                className={styles.scroll}
                position="relative"
              >
                <Table variant="unstyled" width={{ base: "100%", md: "80%" }}>
                  <Thead>
                    <Tr>
                      <Th
                        padding={{
                          base: "10px 10px 10px 0px",
                          md: "12px 24px 12px 0px",
                        }}
                        w="5%"
                      ></Th>
                      <Th
                        fontSize={{ base: "14px", md: "16px" }}
                        fontWeight={600}
                        color="primary.500"
                        padding={{ base: "10px 14px", md: "12px 24px" }}
                        minW="200px"
                        w="30%"
                      >
                        จุดจอด / สายรถ (รอบไป)
                      </Th>
                      <Th
                        fontSize={{ base: "14px", md: "16px" }}
                        fontWeight={600}
                        color="primary.500"
                        padding={{ base: "10px 14px", md: "12px 24px" }}
                        minW="200px"
                        w="30%"
                      >
                        จุดจอด / สายรถ (รอบกลับ)
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody fontSize={"16px"}>
                    {filter(data?.employeeUsageInfos, {
                      periodOfDay: "morning",
                    }).map((employeeUsageInfo) => {
                      const employeeUsageInfoEvening = filter(
                        data?.employeeUsageInfos,
                        {
                          periodOfDay: "evening",
                          dayOfWeek: employeeUsageInfo.dayOfWeek,
                        }
                      )
                      return (
                        <Tr key={employeeUsageInfo.id}>
                          <Td
                            padding={{
                              base: "10px 10px 10px 0px",
                              md: "12px 24px 12px 0px",
                            }}
                          >
                            {hasIn(DayOfWeeks, `${employeeUsageInfo.dayOfWeek}`)
                              ? get(
                                  DayOfWeeks,
                                  `${employeeUsageInfo.dayOfWeek}`
                                )
                              : "-"}
                            :
                          </Td>
                          <Td padding={{ base: "10px 14px", md: "12px 24px" }}>
                            {employeeUsageInfo.periodOfDay === "morning"
                              ? employeeUsageInfo?.busStopName &&
                                employeeUsageInfo?.busLineName
                                ? `${employeeUsageInfo.busStopName}/${employeeUsageInfo.busLineName}`
                                : "-"
                              : "-"}
                          </Td>
                          <Td padding={{ base: "10px 14px", md: "12px 24px" }}>
                            {employeeUsageInfoEvening &&
                            employeeUsageInfoEvening.length > 0
                              ? employeeUsageInfoEvening[0]?.busStopName &&
                                employeeUsageInfoEvening[0]?.busLineName
                                ? `${employeeUsageInfoEvening[0].busStopName}/${employeeUsageInfoEvening[0].busLineName}`
                                : "-"
                              : "-"}
                          </Td>
                        </Tr>
                      )
                    })}
                  </Tbody>
                </Table>
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
                  พนักงานในความดูแล
                </Text>
              </Box>
              <Box
                bgColor="#F5F5F5"
                width={{ base: "100%", md: "80%" }}
                p={12}
                borderRadius="8px"
                overflowX={{ base: "auto", lg: "unset" }}
                className={styles.scroll}
                position="relative"
              >
                {isLoading ? (
                  <Flex
                    alignItems="center"
                    width="100%"
                    height="100vh"
                    justifyContent="center"
                  >
                    <Center>
                      <Spinner size="xl" color="primary.500" />
                    </Center>
                  </Flex>
                ) : (
                  <Table variant="unstyled" width={"100%"}>
                    <Thead>
                      <Tr>
                        <Th
                          fontSize={{ base: "14px", md: "16px" }}
                          fontWeight={600}
                          color="primary.500"
                          padding={{
                            base: "10px 10px 10px 0px",
                            md: "12px 16px 12px 0px",
                          }}
                          w="5%"
                        ></Th>
                        <Th
                          fontSize={{ base: "14px", md: "16px" }}
                          fontWeight={600}
                          color="primary.500"
                          padding={{ base: "10px 14px", md: "12px 16px" }}
                          w="15%"
                          minWidth={{ base: "160px", lg: "unset" }}
                        >
                          รหัสพนักงาน
                        </Th>
                        <Th
                          fontSize={{ base: "14px", md: "16px" }}
                          fontWeight={600}
                          color="primary.500"
                          padding={{ base: "10px 14px", md: "12px 16px" }}
                          w="25%"
                          minWidth={{ base: "180px", lg: "unset" }}
                        >
                          ชื่อ-นามสกุล
                        </Th>
                        <Th
                          fontSize={{ base: "14px", md: "16px" }}
                          fontWeight={600}
                          color="primary.500"
                          padding={{ base: "10px 14px", md: "12px 16px" }}
                          w="15%"
                          minWidth={{ base: "180px", lg: "unset" }}
                        >
                          หน่วยงาน/ส่วน
                        </Th>
                        <Th
                          fontSize={{ base: "14px", md: "16px" }}
                          fontWeight={600}
                          color="primary.500"
                          padding={{ base: "10px 14px", md: "12px 16px" }}
                          w="15%"
                          minWidth={{ base: "200px", lg: "unset" }}
                        >
                          เบอร์ภายใน
                        </Th>
                        <Th
                          fontSize={{ base: "14px", md: "16px" }}
                          fontWeight={600}
                          color="primary.500"
                          padding={{ base: "10px 14px", md: "12px 16px" }}
                          w="10%"
                          minWidth={{ base: "200px", lg: "unset" }}
                        >
                          ที่มา
                        </Th>
                        <Th
                          fontSize={{ base: "14px", md: "16px" }}
                          fontWeight={600}
                          color="primary.500"
                          padding={{ base: "10px 14px", md: "12px 16px" }}
                          textTransform="none"
                          w="10%"
                        >
                          Status
                        </Th>
                        <Th
                          padding={{ base: "10px 10px", md: "12px 16px" }}
                          w="5%"
                        ></Th>
                      </Tr>
                    </Thead>
                    <Tbody fontSize={"16px"}>
                      {subordinateList && subordinateList.length > 0 ? (
                        subordinateList.map((subordinate, index) => {
                          return (
                            <Tr key={subordinate.employeeNo}>
                              <Td
                                padding={{
                                  base: "10px 10px 10px 0px",
                                  md: "12px 16px 12px 0px",
                                }}
                              >
                                {index + 1}.
                              </Td>
                              <Td
                                padding={{
                                  base: "10px 14px",
                                  md: "12px 16px",
                                }}
                              >
                                {subordinate.employeeNo}
                              </Td>
                              <Td
                                padding={{
                                  base: "10px 14px",
                                  md: "12px 16px",
                                }}
                              >
                                {`${subordinate.title}${subordinate.firstName} ${subordinate.lastName}`}
                              </Td>
                              <Td
                                padding={{
                                  base: "10px 14px",
                                  md: "12px 16px",
                                }}
                              >
                                {subordinate.jobName}/{subordinate.positionName}
                              </Td>
                              <Td
                                padding={{
                                  base: "10px 14px",
                                  md: "12px 16px",
                                }}
                              >
                                {subordinate.phoneNo}
                              </Td>
                              <Td
                                padding={{
                                  base: "10px 14px",
                                  md: "12px 16px",
                                }}
                                textTransform="capitalize"
                              >
                                {subordinate?.subordinateChannel}
                              </Td>
                              <Td
                                padding={{
                                  base: "10px 14px",
                                  md: "12px 16px",
                                }}
                              >
                                <Status
                                  value={
                                    subordinate?.registerBookingBusInfo?.status
                                  }
                                />
                              </Td>
                              <Td
                                padding={{
                                  base: "10px 10px",
                                  md: "12px 16px",
                                }}
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
                                      onClick={() => {
                                        handleDelete(subordinate)
                                      }}
                                      isDisabled={
                                        subordinate?.subordinateChannel !==
                                        "manual"
                                      }
                                    >
                                      ลบ
                                    </MenuItem>
                                  </MenuList>
                                </Menu>
                              </Td>
                            </Tr>
                          )
                        })
                      ) : (
                        <Td colSpan={7} minWidth="100%" align="center">
                          <Center height="250px">
                            <Text
                              color="#33333399"
                              fontStyle="italic"
                              fontWeight={400}
                            >
                              ไม่มีพนักงานในความดูแล
                            </Text>
                          </Center>
                        </Td>
                      )}
                    </Tbody>
                  </Table>
                )}
                <Box mt={8}>
                  <Button
                    leftIcon={<AddIcon />}
                    onClick={() => {
                      setOpen(true)
                    }}
                    _focus={{ boxShadow: "none" }}
                  >
                    เพิ่มพนักงาน
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
                ลบบัญชีผู้ใช้
              </Button>
            </Flex>
          </Flex>
        </form>
      </Container>
    </>
  )
}

export default EmployeeEdit
