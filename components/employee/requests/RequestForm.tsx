import {
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Flex,
  Box,
  Input,
  FormErrorMessage,
  FormLabel,
  FormControl,
  Link,
} from "@chakra-ui/react"
import { useForm } from "react-hook-form"
import TextInput from "../../input/TextInput"
import { DateTime } from "luxon"
import { BookingDataTypes } from "../../../data-hooks/requests/types"
import NextLink from "next/link"

type RequestFormProps = {
  data: BookingDataTypes
}

const RequestForm = ({ data }: RequestFormProps) => {
  const {
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ...data,
      busLineName: data?.busLineName ? data?.busLineName : "-",
      employee: `${data?.employeeNo} / ${data?.prefixName}${data?.firstName} ${data?.lastName}`,
      date: data?.date
        ? DateTime.fromJSDate(new Date(data.date)).toFormat("dd/MM/yyyy")
        : null,
      vehicleInfo: data?.vehicleType
        ? `${data?.vehicleType}/${data.licensePlate ? data.licensePlate : "-"}`
        : "-",
      driverName:
        data?.driverFirstName && data?.driverLastName
          ? `${data?.driverFirstName} ${data?.driverLastName}`
          : "-",
    },
  })

  return (
    <ModalContent>
      <ModalHeader px={12} py={8}>
        ดูข้อมูลการจอง
      </ModalHeader>
      <ModalCloseButton
        display={{ base: "block", md: "none" }}
        _focus={{ boxShadow: "none" }}
      />
      <ModalBody px={12}>
        <Flex flexDirection="column">
          <Flex
            mb={10}
            width={{ base: "100%", md: "80%", lg: "60%" }}
            justifyContent="space-between"
          >
            <Box mr={3}>
              <TextInput
                name="employee"
                label="รหัส / ชื่อพนักงาน"
                errors={errors}
                register={register}
                variant="unstyled"
                disabled={true}
                autocomplete="off"
                minWidth={250}
                fontWeightLabel={600}
              />
            </Box>
            <Box mr={3}>
              <FormControl isInvalid={!!errors.requestId}>
                <FormLabel htmlFor="requestId" fontWeight={600}>
                  ID การจอง
                </FormLabel>
                <NextLink
                  href={`/employee/requests/requestId/${data.requestId}`}
                  passHref
                >
                  <Link _focus={{}} _hover={{}}>
                    <Input
                      id="requestId"
                      borderColor="#B2CCCC"
                      _focus={{
                        borderColor: "#B2CCCC",
                        boxShadow: "0 0 0 1px #00A5A8",
                      }}
                      {...register("requestId")}
                      minWidth="250px"
                      fontWeight={500}
                      color="#00A5A8"
                      variant="unstyled"
                      disabled={true}
                      cursor="pointer"
                    />
                  </Link>
                </NextLink>
                <FormErrorMessage>
                  {errors.requestId && errors.requestId.message}
                </FormErrorMessage>
              </FormControl>
            </Box>
          </Flex>
          <Flex
            mb={10}
            width={{ base: "100%", md: "80%", lg: "60%" }}
            justifyContent="space-between"
          >
            <Box mr={3}>
              <TextInput
                name="date"
                label="วัน/เดือน/ปี"
                errors={errors}
                register={register}
                variant="unstyled"
                disabled={true}
                autocomplete="off"
                minWidth={250}
                fontWeightLabel={600}
              />
            </Box>
            <Box mr={3}>
              <TextInput
                name="time"
                label="รอบเวลา"
                errors={errors}
                register={register}
                variant="unstyled"
                disabled={true}
                autocomplete="off"
                minWidth={250}
                fontWeightLabel={600}
              />
            </Box>
          </Flex>
          <Flex
            mb={10}
            width={{ base: "100%", md: "80%", lg: "60%" }}
            justifyContent="space-between"
          >
            <Box mr={3}>
              <TextInput
                name="busStopName"
                label="จุดลงรถ"
                errors={errors}
                register={register}
                variant="unstyled"
                disabled={true}
                autocomplete="off"
                minWidth={250}
                fontWeightLabel={600}
              />
            </Box>
            <Box mr={3}>
              <TextInput
                name="busLineName"
                label="สายรถ"
                errors={errors}
                register={register}
                variant="unstyled"
                disabled={true}
                autocomplete="off"
                minWidth={250}
                fontWeightLabel={600}
              />
            </Box>
          </Flex>
          <Flex
            mb={10}
            width={{ base: "100%", md: "80%", lg: "60%" }}
            justifyContent="space-between"
          >
            <Box mr={3}>
              <TextInput
                name="vehicleInfo"
                label="ข้อมูลรถ"
                errors={errors}
                register={register}
                variant="unstyled"
                disabled={true}
                autocomplete="off"
                minWidth={250}
                fontWeightLabel={600}
              />
            </Box>
            <Box mr={3}>
              <TextInput
                name="driverName"
                label="ชื่อคนขับรถ"
                errors={errors}
                register={register}
                variant="unstyled"
                disabled={true}
                autocomplete="off"
                minWidth={250}
                fontWeightLabel={600}
              />
            </Box>
          </Flex>
        </Flex>
      </ModalBody>
      <ModalFooter></ModalFooter>
    </ModalContent>
  )
}

export default RequestForm
