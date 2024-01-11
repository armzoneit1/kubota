import { useForm, Controller } from "react-hook-form"
import { useState, useEffect } from "react"
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
  NumberInputField,
  NumberInput,
  Input,
  useDisclosure,
} from "@chakra-ui/react"
import TextInput from "../../../input/TextInput"
import ImageUpload from "../../../input/ImageUpload"
import FileUpload from "../../../input/FileUpload"
import Datepicker from "../../../input/Datepicker"
import SelectInput from "../../../input/SelectInput"
import { DriverDataTypes } from "../../../../data-hooks/transportationProviders/drivers/types"
import { Option } from "../../../../data-hooks/transportationProviders/vehicles/getList"
import Head from "next/head"
import { VehicleDataTypes } from "../../../../data-hooks/transportationProviders/vehicles/types"
import get from "lodash/get"
import isBoolean from "lodash/isBoolean"
import { DateTime } from "luxon"
import ConfirmDialog from "../../../ConfirmDialog"

type DriverEditProps = {
  vehicles: { options: Option; vehicles: VehicleDataTypes[] }
  data: DriverDataTypes
  transportationProviderId: string | string[] | undefined
  onSubmit: (values: any) => void
  isLoading: boolean
  isLoadingDelete: boolean
  onDelete: (values: any) => void
}

type DriverDateTypes = {
  licenseExpirationDate: Date | string | null
  dateOfBirth: Date | string | null
}

const DriverEdit = ({
  data,
  vehicles,
  transportationProviderId,
  isLoading,
  onSubmit: submit,
  isLoadingDelete,
  onDelete,
}: DriverEditProps) => {
  const { isOpen, onClose, onOpen } = useDisclosure()
  const today = DateTime.fromJSDate(new Date()).toFormat("y-MM-dd")
  const [date, setDate] = useState<DriverDateTypes>({
    licenseExpirationDate: null,
    dateOfBirth: null,
  })

  useEffect(() => {
    if (data) {
      setDate({
        licenseExpirationDate: data.licenseExpirationDate
          ? new Date(data.licenseExpirationDate)
          : null,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
      })
    }
  }, [data])

  const setDateOfBirth = (value: any) => {
    setDate((prevState) => ({ ...prevState, dateOfBirth: value }))
  }
  const setLicenseExpirationDate = (value: any) => {
    setDate((prevState) => ({ ...prevState, licenseExpirationDate: value }))
  }

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    control,
    unregister,
    setValue,
    getValues,
    watch,
  } = useForm({
    defaultValues: data
      ? {
          ...data,
          status: data.status ? "active" : "inactive",
          licenseExpirationDate: data.licenseExpirationDate
            ? new Date(data.licenseExpirationDate)
            : null,
          dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
        }
      : {
          id: null,
          plantId: null,
          transportationProviderId: null,
          ageMonth: null,
          firstName: null,
          lastName: null,
          nickName: null,
          name: null,
          dateOfBirth: null,
          licencePlate: null,
          ageYear: null,
          mobileNo: null,
          profileImageUrl: null,
          driverLicenseImageUrl: null,
          licenseExpirationDate: null,
          status: undefined,
          createdAt: null,
          updatedAt: null,
          deletedAt: null,
          vehicle: [],
          driverDocuments: [],
          vehicleId: null,
          typeAndSeatCapacity: null,
        },
  })

  const watchVehicleId = watch("vehicleId")
  const watchDateOfBirth = watch("dateOfBirth")

  useEffect(() => {
    const dateOfBirth = watchDateOfBirth
      ? DateTime.fromJSDate(new Date(watchDateOfBirth)).toFormat("y-MM-dd")
      : null
    if (dateOfBirth) {
      const end = DateTime.fromISO(today)
      const start = DateTime.fromISO(dateOfBirth)
      const diffInMonths = end.diff(start, "months")
      const months = diffInMonths.toObject().months
      const ageYear = months ? Math.floor(months / 12) : 0
      const ageMonth = months ? Math.floor(months) % 12 : 0

      setValue("ageYear", `${ageYear}`)
      setValue("ageMonth", `${ageMonth}`)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchDateOfBirth])

  useEffect(() => {
    if (watchVehicleId) {
      const vehicleId = get(watchVehicleId, "value")
      const vehicle = vehicles.vehicles.filter((v) => v.id === vehicleId)
      setValue(
        "typeAndSeatCapacity",
        `${vehicle[0].vehicleTypeName}/${vehicle[0].seatCapacity}`
      )
    }
  }, [watchVehicleId, vehicles.vehicles, setValue])

  function onSubmit(values: any) {
    const formData = new FormData()
    const status: boolean | string = get(values, "status")
    const vehicleId = get(values, "vehicleId.value")
      ? get(values, "vehicleId.value")
      : null
    const driverDocuments = get(values, "driverDocuments")
    const driverLicenseImageUrl = get(values.driverLicenseImageUrl, "[0]")
    const profileImageUrl = get(values.profileImageUrl, "[0]")

    values.status = isBoolean(status)
      ? status
      : status === "active"
      ? true
      : false
    values.dateOfBirth = values.dateOfBirth
      ? DateTime.fromJSDate(new Date(values.dateOfBirth)).toFormat("y-MM-dd")
      : null
    values.licenseExpirationDate = values.licenseExpirationDate
      ? DateTime.fromJSDate(new Date(values.licenseExpirationDate)).toFormat(
          "y-MM-dd"
        )
      : null
    formData.append("status", `${values.status}`)
    formData.append("firstName", values.firstName)
    formData.append("lastName", values.lastName)
    formData.append("nickName", values.nickName)
    formData.append("mobileNo", values.mobileNo)
    // formData.append("ageYear", `${values.ageYear}`)
    // formData.append("ageMonth", `${values.ageMonth}`)
    if (vehicleId) formData.append("vehicleId", vehicleId)
    if (values.dateOfBirth) formData.append("dateOfBirth", values.dateOfBirth)
    if (values.licenseExpirationDate)
      formData.append("licenseExpirationDate", values.licenseExpirationDate)
    if (driverLicenseImageUrl && driverLicenseImageUrl instanceof File)
      formData.append("driverLicenseImage", driverLicenseImageUrl)
    if (profileImageUrl && profileImageUrl instanceof File)
      formData.append("profileImage", profileImageUrl)
    if (driverDocuments) {
      for (const [index, document] of driverDocuments.entries()) {
        if (document instanceof File)
          formData.append(`driverDocuments[${index}].document`, document)
        else if (document) {
          formData.append(
            `driverDocuments[${index}].documentId`,
            document.documentId
          )
        }
      }
    } else if (!driverDocuments) {
      formData.append(`driverDocuments[0].document`, "")
    }

    submit({
      id: data.id,
      transportationProviderId: transportationProviderId,
      data: formData,
    })
  }

  return (
    <>
      <Head>
        <title>คนขับรถ</title>
        <meta name="description" content="driver" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ConfirmDialog
        title="ลบข้อมูลคนขับรถ"
        content={`คุณต้องการลบข้อมูลคนขับรถ ${data?.firstName} ${data?.lastName} ใช่หรือไม่ ?`}
        type="error"
        acceptLabel="ลบ"
        isOpen={isOpen}
        onClose={onClose}
        isLoading={isLoadingDelete}
        onSubmit={() => {
          onDelete({
            driverId: data?.id,
            providerId: data?.transportationProviderId,
            from: "edit",
            onClose: onClose,
          })
        }}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Flex alignItems="center" justifyContent="flex-end" mb={6}>
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
                ข้อมูลคนขับ
              </Text>
            </Box>
            <Box
              bgColor="#F5F5F5"
              width={{ base: "100%", md: "80%" }}
              p={{ base: 8, md: 12 }}
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
                />
                <FormErrorMessage>
                  {errors.status && errors.status.message}
                </FormErrorMessage>
              </FormControl>
              <Box mb={10}>
                <ImageUpload
                  accept="image/*"
                  name="profileImageUrl"
                  label="รูปคนขับ"
                  register={register}
                  unregister={unregister}
                  value={watch("profileImageUrl")}
                  setValue={setValue}
                />
              </Box>
              <Flex mb={10} w={{ base: "100%", md: "80%" }}>
                <Box w="50%" mr={{ base: 2, md: 5 }}>
                  <TextInput
                    name="firstName"
                    label="ชื่อ"
                    errors={errors}
                    register={register}
                    validation={{
                      required: "กรุณากรอกชื่อ",
                    }}
                  />
                </Box>
                <Box w="50%">
                  <TextInput
                    name="lastName"
                    label="นามสกุล"
                    errors={errors}
                    register={register}
                    validation={{
                      required: "กรุณากรอกนามสกุล",
                    }}
                  />
                </Box>
              </Flex>
              <Flex
                mb={10}
                w={{ base: "100%", md: "80%" }}
                flexDirection={{ base: "column", md: "column", xl: "row" }}
              >
                <Box
                  w={{ base: "100%", md: "100%", xl: "50%" }}
                  mr={{ base: 2, md: 5 }}
                  mb={{ base: 10, md: 10, xl: 0 }}
                >
                  <TextInput
                    name="nickName"
                    label="ชื่อเล่น"
                    errors={errors}
                    register={register}
                    validation={{
                      required: "กรุณากรอกชื่อเล่น",
                    }}
                  />
                </Box>
                <FormControl
                  isInvalid={!!errors.firstName}
                  w={{ base: "100%", md: "100%", xl: "50%" }}
                >
                  <FormLabel htmlFor="dateOfBirth">วัน/เดือน/ปีเกิด</FormLabel>
                  <Controller
                    name="dateOfBirth"
                    control={control}
                    render={({ field }) => (
                      <Datepicker
                        date={date.dateOfBirth}
                        setDate={setDateOfBirth}
                        field={field}
                        maxDate={new Date()}
                      />
                    )}
                  />
                  <FormErrorMessage>
                    {errors.dateOfBirth && errors.dateOfBirth.message}
                  </FormErrorMessage>
                </FormControl>
              </Flex>
              <Flex mb={10} w={{ base: "100%", md: "80%" }}>
                <FormControl
                  isInvalid={!!errors.firstName}
                  w="50%"
                  mr={{ base: 2, md: 5 }}
                >
                  <FormLabel htmlFor="name">อายุ</FormLabel>
                  <Flex alignItems="center">
                    <Input
                      {...register("ageYear")}
                      disabled={true}
                      borderColor="#B2CCCC99"
                      _disabled={{ color: "#33333399" }}
                    />
                    <Text mx={{ base: 1, md: 2 }}>{"ปี"}</Text>
                    <Input
                      {...register("ageMonth")}
                      disabled={true}
                      borderColor="#B2CCCC99"
                      _disabled={{ color: "#33333399" }}
                    />
                    <Text mx={{ base: 1, md: 2 }}>{"เดือน"}</Text>
                  </Flex>
                  <FormErrorMessage>
                    {errors.firstName && errors.firstName.message}
                  </FormErrorMessage>
                </FormControl>

                <Box w="50%">
                  <TextInput
                    name="mobileNo"
                    label="เบอร์โทรศัพท์ "
                    errors={errors}
                    register={register}
                    validation={{
                      required: "กรุณากรอกเบอร์โทรศัพท์",
                    }}
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
                เอกสารอื่นๆ
              </Text>
            </Box>
            <Box
              bgColor="#F5F5F5"
              width={{ base: "100%", md: "80%" }}
              p={{ base: 8, md: 12 }}
              borderRadius="8px"
            >
              <Box mb={10}>
                <ImageUpload
                  accept="image/*"
                  name="driverLicenseImageUrl"
                  label="รูปใบขับขี่ประเภท 2"
                  register={register}
                  unregister={unregister}
                  value={watch("driverLicenseImageUrl")}
                  setValue={setValue}
                />
              </Box>
              <FormControl
                isInvalid={!!errors.firstName}
                mb={10}
                w={{ base: "100%", md: "80%", xl: "40%" }}
              >
                <FormLabel htmlFor="licenseExpirationDate">
                  วันหมดอายุใบขับขี่
                </FormLabel>
                <Controller
                  name="licenseExpirationDate"
                  control={control}
                  render={({ field }) => (
                    <Datepicker
                      date={date.licenseExpirationDate}
                      setDate={setLicenseExpirationDate}
                      field={field}
                    />
                  )}
                />
                <FormErrorMessage>
                  {errors.licenseExpirationDate &&
                    errors.licenseExpirationDate.message}
                </FormErrorMessage>
              </FormControl>
              <Box mb={10}>
                <FileUpload
                  accept="application/pdf"
                  name="driverDocuments"
                  label="เอกสารเพิ่มเติม"
                  register={register}
                  unregister={unregister}
                  value={watch("driverDocuments")}
                  setValue={setValue}
                  multiple
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
                รถ
              </Text>
            </Box>
            <Box
              bgColor="#F5F5F5"
              width={{ base: "100%", md: "80%" }}
              p={{ base: 8, md: 12 }}
              borderRadius="8px"
            >
              <Flex mb={10} w={{ base: "100%", md: "80%" }}>
                <FormControl
                  isInvalid={!!errors.licencePlate}
                  w="50%"
                  mr={{ base: 2, md: 5 }}
                >
                  <FormLabel htmlFor="vehicleId">ทะเบียนรถ</FormLabel>
                  <Controller
                    name="vehicleId"
                    control={control}
                    render={({ field }) => (
                      <SelectInput
                        options={vehicles.options}
                        placeholder=""
                        {...field}
                      />
                    )}
                  />
                  <FormErrorMessage>
                    {errors.vehicleId && errors.vehicleId.message}
                  </FormErrorMessage>
                </FormControl>
                <FormControl w="50%">
                  <FormLabel htmlFor="typeAndSeatCapacity" color="#33333399">
                    ประเภทรถ / ความจุ
                  </FormLabel>
                  <Input
                    {...register("typeAndSeatCapacity")}
                    disabled={true}
                    borderColor="#B2CCCC99"
                    _disabled={{ color: "#33333399" }}
                  />
                </FormControl>
              </Flex>
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
              ลบข้อมูลคนขับรถ
            </Button>
          </Flex>
        </Flex>
      </form>
    </>
  )
}

export default DriverEdit
