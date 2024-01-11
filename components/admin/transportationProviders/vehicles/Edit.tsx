import { useState, useEffect, useCallback } from "react"
import { useForm, Controller } from "react-hook-form"
import React from "react"
import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Button,
  Flex,
  Box,
  Text,
  Radio,
  RadioGroup,
  Table,
  Thead,
  Tbody,
  Th,
  Tr,
  Td,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Input,
  useDisclosure,
} from "@chakra-ui/react"
import TextInput from "../../../input/TextInput"
import AddMaintenanceModal from "../AddMaintenanceModal"
import EditMaintenanceModal from "../EditMaintenanceModal"
import SelectInput from "../../../input/SelectInput"
import Datepicker from "../../../input/Datepicker"
import { MdEdit, MdMoreVert } from "react-icons/md"
import { AddIcon } from "@chakra-ui/icons"
import { DateTime } from "luxon"
import {
  VehicleDataTypes,
  VehicleMaintenanceLogsTypes,
} from "../../../../data-hooks/transportationProviders/vehicles/types"
import get from "lodash/get"
import isBoolean from "lodash/isBoolean"
import styles from "../../../layout/layout.module.css"
import { Option } from "../../../../data-hooks/vehicleTypes/getList"
import Head from "next/head"
import omit from "lodash/omit"
import ConfirmDialog from "../../../ConfirmDialog"

type VehicleEditProps = {
  data: VehicleDataTypes
  vehicleTypes: {
    value: string | number
    label: string
    seatCapacity: string | number
  }
  drivers: Option
  transportationProviderId: string | string[] | undefined
  onSubmit: (values: any) => void
  isLoading: boolean
  isLoadingDelete: boolean
  onDelete: (values: any) => void
}

type VehicleDateTypes = {
  purchaseDate: Date | string | null
  registrationDate: Date | string | null
  actExpirationDate: Date | string | null
  insuranceExpirationDate: Date | string | null
  taxExpirationDate: Date | string | null
}

const VehicleEdit = ({
  data,
  vehicleTypes,
  drivers,
  transportationProviderId,
  onSubmit: submit,
  isLoading,
  isLoadingDelete,
  onDelete,
}: VehicleEditProps) => {
  const { isOpen, onClose, onOpen } = useDisclosure()
  const today = DateTime.fromJSDate(new Date()).toFormat("y-MM-dd")
  const [date, setDate] = useState<VehicleDateTypes>({
    purchaseDate: null,
    registrationDate: null,
    actExpirationDate: null,
    insuranceExpirationDate: null,
    taxExpirationDate: null,
  })
  const [isOpenAdd, setOpenAdd] = useState<boolean>(false)
  const [isOpenEdit, setOpenEdit] = useState<boolean>(false)
  const [edit, setEdit] = useState<any>({ data: null, index: null })
  const [vehicleMaintenanceLogs, setVehicleMaintenanceLogs] = useState<
    VehicleMaintenanceLogsTypes[]
  >([])

  useEffect(() => {
    if (data) {
      setDate({
        purchaseDate: data.purchaseDate ? new Date(data.purchaseDate) : null,
        registrationDate: data.registrationDate
          ? new Date(data.registrationDate)
          : null,
        actExpirationDate: data.actExpirationDate
          ? new Date(data.actExpirationDate)
          : null,
        insuranceExpirationDate: data.insuranceExpirationDate
          ? new Date(data.insuranceExpirationDate)
          : null,
        taxExpirationDate: data.taxExpirationDate
          ? new Date(data.taxExpirationDate)
          : null,
      })
      setVehicleMaintenanceLogs(data.vehicleMaintenanceLogs)
    }
  }, [data])

  const setPurchaseDate = (value: any) => {
    setDate((prevState) => ({ ...prevState, purchaseDate: value }))
  }
  const setRegistrationDate = (value: any) => {
    setDate((prevState) => ({ ...prevState, registrationDate: value }))
  }
  const setActExpirationDate = (value: any) => {
    setDate((prevState) => ({ ...prevState, actExpirationDate: value }))
  }

  const setInsuranceExpirationDate = (value: any) => {
    setDate((prevState) => ({ ...prevState, insuranceExpirationDate: value }))
  }
  const setTaxExpirationDate = (value: any) => {
    setDate((prevState) => ({ ...prevState, taxExpirationDate: value }))
  }

  const onCloseAdd = () => {
    setOpenAdd(false)
  }

  const onCloseEdit = () => {
    setOpenEdit(false)
  }

  const onOpenEdit = (edit: any, index: number) => {
    setEdit({ data: edit, index: index })
    setOpenEdit(true)
  }

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    control,
    watch,
    setValue,
  } = useForm({
    defaultValues: data
      ? {
          ...data,
          status: data.status ? "active" : "inactive",
          purchaseDate: data.purchaseDate ? new Date(data.purchaseDate) : null,
          actExpirationDate: data.actExpirationDate
            ? new Date(data.actExpirationDate)
            : null,
          insuranceExpirationDate: data.insuranceExpirationDate
            ? new Date(data.insuranceExpirationDate)
            : null,
          registrationDate: data.registrationDate
            ? new Date(data.registrationDate)
            : null,
          taxExpirationDate: data.taxExpirationDate
            ? new Date(data.taxExpirationDate)
            : null,
        }
      : {
          id: null,
          plantId: null,
          transportationProviderId: null,
          transportationProviderVehicleTypeMappingId: null,
          licencePlate: null,
          vehicleTypeId: null,
          vehicleTypeName: null,
          vehicleAgeMonth: null,
          seatCapacity: null,
          driverId: null,
          driverFirstName: null,
          driverLastName: null,
          driverName: null,
          status: undefined,
          createdAt: null,
          updatedAt: null,
          deletedAt: null,
          purchaseDate: null,
          vehicleAgeYear: null,
          registrationDate: null,
          insuranceExpirationDate: null,
          taxExpirationDate: null,
          actExpirationDate: null,
          vehicleMaintenanceLogs: [],
          vehicleType: null,
          driver: null,
        },
  })

  const watchVehicleType = watch("vehicleType")
  const watchPurchaseDate = watch("purchaseDate")

  useEffect(() => {
    const purchaseDate = watchPurchaseDate
      ? DateTime.fromJSDate(new Date(watchPurchaseDate)).toFormat("y-MM-dd")
      : null
    if (purchaseDate) {
      const end = DateTime.fromISO(today)
      const start = DateTime.fromISO(purchaseDate)
      const diffInMonths = end.diff(start, "months")
      const months = diffInMonths.toObject().months

      const vehicleAgeYear = months ? Math.floor(months / 12) : 0
      const vehicleAgeMonth = months ? Math.floor(months) % 12 : 0

      setValue("vehicleAgeYear", vehicleAgeYear)
      setValue("vehicleAgeMonth", vehicleAgeMonth)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchPurchaseDate])

  useEffect(() => {
    if (watchVehicleType)
      setValue("seatCapacity", `${watchVehicleType?.seatCapacity}`)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchVehicleType])

  function onSubmit(values: VehicleDataTypes) {
    const status: boolean | string = get(values, "status")
    const vehicleType: number = get(values, "vehicleType.value")
    values.transportationProviderVehicleTypeMappingId = vehicleType
    const driverId: number = get(values, "driver.value")
    values.driverId = driverId
    values.status = isBoolean(status)
      ? status
      : status === "active"
      ? true
      : false
    values.insuranceExpirationDate = values.insuranceExpirationDate
      ? DateTime.fromJSDate(new Date(values.insuranceExpirationDate)).toFormat(
          "y-MM-dd"
        )
      : null
    values.purchaseDate = values.purchaseDate
      ? DateTime.fromJSDate(new Date(values.purchaseDate)).toFormat("y-MM-dd")
      : null
    values.registrationDate = values.registrationDate
      ? DateTime.fromJSDate(new Date(values.registrationDate)).toFormat(
          "y-MM-dd"
        )
      : null
    values.taxExpirationDate = values.taxExpirationDate
      ? DateTime.fromJSDate(new Date(values.taxExpirationDate)).toFormat(
          "y-MM-dd"
        )
      : null
    values.actExpirationDate = values.actExpirationDate
      ? DateTime.fromJSDate(new Date(values.actExpirationDate)).toFormat(
          "y-MM-dd"
        )
      : null
    values.vehicleMaintenanceLogs = vehicleMaintenanceLogs.map((log) => {
      return {
        mile: log.mile,
        detail: log.detail,
        date: log.date
          ? DateTime.fromJSDate(new Date(log.date)).toFormat("y-MM-dd")
          : "",
        vehicleMaintenanceLogId: log.vehicleMaintenanceLogId
          ? log.vehicleMaintenanceLogId
          : null,
      }
    })
    submit({
      transportationProviderId: transportationProviderId,
      id: data.id,
      data: omit(values, [
        "driver",
        "vehicleType",
        "createdAt",
        "deletedAt",
        "driverFirstName",
        "driverLastName",
        "plantId",
        "id",
        "updatedAt",
        "transportationProviderId",
      ]),
    })
  }

  const addMaintenance = (add: any) => {
    setVehicleMaintenanceLogs((prevState) =>
      [...prevState, add]?.sort(
        (a, b) => new Date(b?.date)?.getTime() - new Date(a?.date)?.getTime()
      )
    )
  }

  const onDeleteMaintenance = (index: number) => {
    const maintain = [...vehicleMaintenanceLogs]
    maintain.splice(index, 1)

    setVehicleMaintenanceLogs(maintain)
  }

  const onEditMaintenance = (update: any, index: number) => {
    const maintain = [...vehicleMaintenanceLogs]
    maintain.splice(index, 1, update)
    setVehicleMaintenanceLogs(maintain)
  }

  return (
    <>
      <Head>
        <title>รถ</title>
        <meta name="description" content="vehicle" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AddMaintenanceModal
        isOpen={isOpenAdd}
        onClose={onCloseAdd}
        onAdd={addMaintenance}
      />
      <EditMaintenanceModal
        isOpen={isOpenEdit}
        onClose={onCloseEdit}
        edit={edit}
        onEdit={onEditMaintenance}
      />
      <ConfirmDialog
        title="ลบข้อมูลรถ"
        content={`คุณต้องการลบข้อมูลรถทะเบียน ${data?.licencePlate} ใช่หรือไม่ ?`}
        type="error"
        acceptLabel="ลบ"
        isOpen={isOpen}
        onClose={onClose}
        isLoading={isLoadingDelete}
        onSubmit={() => {
          onDelete({
            vehicleId: data?.id,
            providerId: data?.transportationProviderId,
            from: "edit",
            onClose: onClose,
          })
        }}
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <Flex
          alignItems="center"
          justifyContent="flex-end"
          mb={{ base: 6, md: 12 }}
        >
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
        <Flex flexDirection="column">
          <Flex
            width="100%"
            minH="100%"
            flexDirection={{ base: "column", md: "row" }}
            mb={{ base: 6, md: 10 }}
          >
            <Box width={{ base: "100%", md: "20%" }} mb={{ base: 4, md: 0 }}>
              <Text fontSize="20px" fontWeight={600}>
                ข้อมูลรถ
              </Text>
            </Box>
            <Box
              bgColor="#F5F5F5"
              width={{ base: "100%", md: "80%" }}
              p={{ base: 8, md: 12 }}
              borderRadius="8px"
            >
              <FormControl isInvalid={!!errors.status} mb={10}>
                <FormLabel fontWeight={400} htmlFor="status">
                  Status
                </FormLabel>
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
              <Flex mb={10} w={{ base: "100%", md: "80%" }}>
                <FormControl
                  mr={{ base: 2, md: 5 }}
                  isInvalid={!!errors.vehicleType}
                  w="50%"
                >
                  <FormLabel fontWeight={400} htmlFor="vehicleType">
                    ประเภทรถที่ให้บริการ
                  </FormLabel>
                  <Controller
                    name="vehicleType"
                    control={control}
                    render={({ field, fieldState }) => (
                      <SelectInput
                        options={vehicleTypes}
                        placeholder=""
                        {...field}
                        {...fieldState}
                      />
                    )}
                    rules={{ required: "กรุณาเลือกประเภทรถ" }}
                  />
                  <FormErrorMessage>
                    {errors.vehicleType && "กรุณาเลือกประเภทรถ"}
                  </FormErrorMessage>
                </FormControl>
                <Flex w="50%">
                  <FormControl
                    mr={{ base: 2, md: 4 }}
                    w={{ base: "80%", md: "85%", lg: "90%" }}
                    isInvalid={!!errors.seatCapacity}
                  >
                    <FormLabel htmlFor="seatCapacity">ความจุ</FormLabel>
                    <Input
                      {...register("seatCapacity")}
                      disabled={true}
                      borderColor="#B2CCCC99"
                      _disabled={{ color: "#33333399" }}
                    />
                    <FormErrorMessage>
                      {errors.seatCapacity && errors.seatCapacity.message}
                    </FormErrorMessage>
                  </FormControl>
                  <Flex
                    w={{ base: "20%", md: "15%", lg: "10%" }}
                    justifyContent="flex-end"
                  >
                    <Text transform="translateY(40px)">ที่นั่ง</Text>
                  </Flex>
                </Flex>
              </Flex>
              <Flex mb={10} w={{ base: "100%", md: "80%" }}>
                <Box
                  mr={{ base: 2, md: 5 }}
                  w={{ base: "100%", md: "100%", xl: "50%" }}
                  mb={{ base: 10, md: 0 }}
                >
                  <FormLabel fontWeight={400} htmlFor="purchaseDate">
                    วันที่ซื้อรถ
                  </FormLabel>
                  <Controller
                    name="purchaseDate"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Datepicker
                        date={date.purchaseDate}
                        setDate={setPurchaseDate}
                        field={field}
                        fieldState={fieldState}
                        maxDate={new Date()}
                      />
                    )}
                    rules={{ required: "กรุณาเลือกวันที่ซื้อรถ" }}
                  />
                </Box>
                <Box w={{ base: "100%", md: "100%", xl: "50%" }}>
                  <FormLabel fontWeight={400} htmlFor="registrationDate">
                    วันที่จดทะเบียนรถ
                  </FormLabel>
                  <Controller
                    name="registrationDate"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Datepicker
                        date={date.registrationDate}
                        setDate={setRegistrationDate}
                        field={field}
                        fieldState={fieldState}
                        maxDate={new Date()}
                      />
                    )}
                    rules={{ required: "กรุณาเลือกวันที่จดทะเบียน" }}
                  />
                </Box>
              </Flex>
              <Flex mb={10} w={{ base: "100%", md: "80%" }}>
                <Flex
                  w="50%"
                  mr={{ base: 2, md: 5 }}
                  alignItems="flex-end"
                  flexDirection="column"
                >
                  <FormLabel fontWeight={400} w="100%" marginInlineEnd={0}>
                    อายุรถในปัจจุบัน
                  </FormLabel>
                  <Flex w="100%">
                    <Flex
                      flexDirection="column"
                      w={{ base: "30%", md: "40%" }}
                      mr={2}
                    >
                      <FormControl isInvalid={!!errors.vehicleAgeYear}>
                        <Input
                          {...register("vehicleAgeYear")}
                          disabled={true}
                          borderColor="#B2CCCC99"
                          _disabled={{ color: "#33333399" }}
                        />
                        <FormErrorMessage>
                          {errors.vehicleAgeYear &&
                            errors.vehicleAgeYear.message}
                        </FormErrorMessage>
                      </FormControl>
                    </Flex>
                    <Flex
                      alignItems="center"
                      height={
                        errors.vehicleAgeYear || errors.vehicleAgeMonth
                          ? "60%"
                          : "100%"
                      }
                      justifyContent="center"
                      w={{ base: "20%", md: "10%" }}
                    >
                      <Text>ปี</Text>
                    </Flex>
                    <FormControl
                      w={{ base: "30%", md: "40%" }}
                      ml={2}
                      mr={2}
                      isInvalid={!!errors.vehicleAgeMonth}
                    >
                      <Input
                        {...register("vehicleAgeMonth")}
                        disabled={true}
                        borderColor="#B2CCCC99"
                        _disabled={{ color: "#33333399" }}
                      />
                      <FormErrorMessage>
                        {errors.vehicleAgeMonth &&
                          errors.vehicleAgeMonth.message}
                      </FormErrorMessage>
                    </FormControl>
                    <Flex
                      alignItems="center"
                      height={
                        errors.vehicleAgeYear || errors.vehicleAgeMonth
                          ? "60%"
                          : "100%"
                      }
                      justifyContent="center"
                      w={{ base: "20%", md: "10%" }}
                    >
                      <Text>เดือน</Text>
                    </Flex>
                  </Flex>
                </Flex>
                <Box w="50%">
                  <TextInput
                    name="licencePlate"
                    label="ทะเบียนรถ"
                    validation={{
                      required: "กรุณากรอกทะเบียน",
                    }}
                    errors={errors}
                    register={register}
                  />
                </Box>
              </Flex>
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
                พรบ. / ภาษี / ประกัน
              </Text>
            </Box>
            <Box
              bgColor="#F5F5F5"
              width={{ base: "100%", md: "80%" }}
              p={{ base: 8, md: 12 }}
              borderRadius="8px"
            >
              <Box mb={10} w={{ base: "100%", md: "40%" }}>
                <FormLabel fontWeight={400} htmlFor="actExpirationDate">
                  รายละเอียดวันครบกำหนดพรบ.
                </FormLabel>
                <Controller
                  name="actExpirationDate"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Datepicker
                      date={date.actExpirationDate}
                      setDate={setActExpirationDate}
                      field={field}
                      fieldState={fieldState}
                    />
                  )}
                  rules={{ required: "กรุณาเลือกวันครบกำหนด" }}
                />
              </Box>
              <Box mb={10} w={{ base: "100%", md: "40%" }}>
                <FormLabel fontWeight={400} htmlFor="taxExpirationDate">
                  รายละเอียดวันครบกำหนดภาษี
                </FormLabel>
                <Controller
                  name="taxExpirationDate"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Datepicker
                      date={date.taxExpirationDate}
                      setDate={setTaxExpirationDate}
                      field={field}
                      fieldState={fieldState}
                    />
                  )}
                  rules={{ required: "กรุณาเลือกวันครบกำหนด" }}
                />
              </Box>
              <Box mb={10} w={{ base: "100%", md: "40%" }}>
                <FormLabel fontWeight={400} htmlFor="insuranceExpirationDate">
                  รายละเอียดวันครบกำหนดประกันภัย
                </FormLabel>
                <Controller
                  name="insuranceExpirationDate"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Datepicker
                      date={date.insuranceExpirationDate}
                      setDate={setInsuranceExpirationDate}
                      field={field}
                      fieldState={fieldState}
                    />
                  )}
                  rules={{ required: "กรุณาเลือกวันครบกำหนด" }}
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
                คนขับรถปัจจุบัน
              </Text>
            </Box>
            <Box
              bgColor="#F5F5F5"
              width={{ base: "100%", md: "80%" }}
              p={{ base: 8, md: 12 }}
              borderRadius="8px"
            >
              <Box mb={10} w={{ base: "100%", md: "80%" }}>
                <FormControl
                  mr={{ base: 2, md: 5 }}
                  isInvalid={!!errors.driver}
                  w="100%"
                >
                  <FormLabel fontWeight={400} htmlFor="driver">
                    ชื่อ-นามสกุล
                  </FormLabel>
                  <Controller
                    name="driver"
                    control={control}
                    render={({ field, fieldState }) => (
                      <SelectInput
                        options={drivers}
                        placeholder=""
                        {...field}
                        {...fieldState}
                      />
                    )}
                  />
                  <FormErrorMessage>
                    {errors.driver && errors.driver.message}
                  </FormErrorMessage>
                </FormControl>
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
              <Text fontSize="20px" fontWeight={600} px={{ base: 0, md: 4 }}>
                รายละเอียด การซ่อมบำรุง
              </Text>
            </Box>
            <Box
              bgColor="#F5F5F5"
              width={{ base: "100%", md: "80%" }}
              p={{ base: 8, md: 12 }}
              borderRadius="8px"
            >
              {vehicleMaintenanceLogs.length > 0 && (
                <Box
                  overflowX="auto"
                  width={{ base: "100%", md: "80%" }}
                  mb={10}
                  className={styles.scroll}
                >
                  <Table variant="unstyled" width="100%">
                    <Thead>
                      <Tr>
                        <Th
                          fontWeight={600}
                          color="primary.500"
                          padding={{ base: "10px 14px", md: "12px 20px" }}
                          w="20%"
                        >
                          วันที่
                        </Th>
                        <Th
                          fontWeight={600}
                          color="primary.500"
                          padding={{ base: "10px 14px", md: "12px 20px" }}
                          w="20%"
                          minW="100px"
                        >
                          เลขไมล์
                        </Th>
                        <Th
                          fontWeight={600}
                          color="primary.500"
                          padding={{ base: "10px 14px", md: "12px 20px" }}
                          w="50%"
                          minW="200px"
                        >
                          รายละเอียด
                        </Th>
                        <Th
                          padding={{
                            base: "10px 14px",
                            md: "16px 0px 16px 24px",
                          }}
                          w="10%"
                          pr={0}
                        ></Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {vehicleMaintenanceLogs &&
                        vehicleMaintenanceLogs.length > 0 &&
                        vehicleMaintenanceLogs.map((m: any, index: number) => {
                          const miles = +m.mile
                          return (
                            <Tr key={index}>
                              <Td
                                padding={{ base: "12px 16px", md: "16px 20px" }}
                                w="20%"
                              >
                                {DateTime.fromJSDate(
                                  new Date(m?.date)
                                ).toFormat("dd/MM/y")}
                              </Td>
                              <Td
                                padding={{ base: "12px 16px", md: "16px 20px" }}
                                w="20%"
                                color={+m.mile > 200000 ? "#D61212" : "inherit"}
                              >
                                {miles > 200000 ? (
                                  <Flex alignItems="center">
                                    <Text mr={2}>{miles.toLocaleString()}</Text>
                                    <svg
                                      width="16"
                                      height="16"
                                      viewBox="0 0 16 16"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M8.00004 2.66683C10.94 2.66683 13.3334 5.06016 13.3334 8.00016C13.3334 10.9402 10.94 13.3335 8.00004 13.3335C5.06004 13.3335 2.66671 10.9402 2.66671 8.00016C2.66671 5.06016 5.06004 2.66683 8.00004 2.66683ZM8.00004 1.3335C4.31804 1.3335 1.33337 4.31816 1.33337 8.00016C1.33337 11.6822 4.31804 14.6668 8.00004 14.6668C11.682 14.6668 14.6667 11.6822 14.6667 8.00016C14.6667 4.31816 11.682 1.3335 8.00004 1.3335ZM8.66671 10.0002H7.33337V11.3335H8.66671V10.0002ZM7.33337 8.66683H8.66671L9.00004 4.66683H7.00004L7.33337 8.66683Z"
                                        fill="#D61212"
                                      />
                                    </svg>
                                  </Flex>
                                ) : (
                                  miles.toLocaleString()
                                )}
                              </Td>
                              <Td
                                padding={{ base: "12px 16px", md: "16px 20px" }}
                                w="50%"
                              >
                                {m.detail}
                              </Td>
                              <Td
                                w="10%"
                                padding={{
                                  base: "12px 16px",
                                  md: "16px 0px 16px 20px",
                                }}
                                pr={0}
                              >
                                <Flex justifyContent="flex-end">
                                  <IconButton
                                    variant="unstyled"
                                    color="#00A5A8"
                                    aria-label="Call Sage"
                                    fontSize="20px"
                                    icon={<MdEdit />}
                                    _focus={{ boxShadow: "none" }}
                                    onClick={() => {
                                      onOpenEdit(m, index)
                                    }}
                                  />
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
                                          onDeleteMaintenance(index)
                                        }}
                                      >
                                        ลบ
                                      </MenuItem>
                                    </MenuList>
                                  </Menu>
                                </Flex>
                              </Td>
                            </Tr>
                          )
                        })}
                    </Tbody>
                  </Table>
                </Box>
              )}

              <Box
                w={{ base: "50%", md: "30%" }}
                padding={{ base: "10px 0px", md: "12px 20px" }}
              >
                <Button
                  _focus={{ boxShadow: "none" }}
                  leftIcon={<AddIcon />}
                  onClick={() => {
                    setOpenAdd(true)
                  }}
                >
                  เพิ่มการซ่อมบำรุง
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
              ลบข้อมูลรถ
            </Button>
          </Flex>
        </Flex>
      </form>
    </>
  )
}

export default React.memo(VehicleEdit)
