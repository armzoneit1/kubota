import Edit from "../../../../../../components/admin/plannings/BookingVehicleEdit"
import { useRouter } from "next/router"
import { getOneBookingVehicle } from "../../../../../../data-hooks/busArrangements/getOneBookingVehicle"
import { getListBookingPassenger } from "../../../../../../data-hooks/busArrangements/getListBookingPassenger"
import { getListVehicleType } from "../../../../../../data-hooks/busArrangements/getListVehicleType"
import { useDeleteEmptyBookingVehicle } from "../../../../../../data-hooks/busArrangements/deleteEmptyBookingVehicle"
import { getListDifferenceBusLine } from "../../../../../../data-hooks/busArrangements/getListDifferenceBusLine"
import { getListSameBusLine } from "../../../../../../data-hooks/busArrangements/getListSameBusLine"
import { getListBusStopLineMapping } from "../../../../../../data-hooks/busArrangements/getListBusStopLineMapping"
import { useTransferPassenger } from "../../../../../../data-hooks/busArrangements/transferPassengers"
import { Flex, Center, Spinner, useToast } from "@chakra-ui/react"
import { useEffect } from "react"
import { useUpdateVehicle } from "../../../../../../data-hooks/busArrangements/updateVehicle"
import get from "lodash/get"

const BookingVehicleEdit = () => {
  const router = useRouter()
  const bookingVehicleId = router.query.bookingVehicleId
  const scheduleId = router?.query?.id
  const bookingVehicle = getOneBookingVehicle(
    scheduleId,
    "morning",
    bookingVehicleId
  )
  const bookingPassengers = getListBookingPassenger(
    scheduleId,
    "morning",
    bookingVehicle?.data?.data?.arrangements?.timeTableRounds[0]
      ?.timeTableRoundId
  )
  const listDifferenceBusLine = getListDifferenceBusLine(
    scheduleId,
    "morning",
    bookingVehicle?.data?.data?.arrangements?.timeTableRounds[0]
      ?.timeTableRoundId,
    bookingVehicleId
  )
  const listSameBusLine = getListSameBusLine(
    scheduleId,
    "morning",
    bookingVehicle?.data?.data?.arrangements?.timeTableRounds[0]
      ?.timeTableRoundId,
    bookingVehicleId
  )
  const listBusStopLineMapping = getListBusStopLineMapping(
    bookingVehicle?.data?.data?.arrangements?.timeTableRounds[0]?.busLines[0]
      ?.id,
    bookingVehicle?.data?.data?.arrangements?.timeTableRounds[0]
      ?.timeTableRoundId
  )
  const transferPassenger = useTransferPassenger()
  const vehicleTypes = getListVehicleType()
  const deleteEmptyBookingVehicle = useDeleteEmptyBookingVehicle()
  const update = useUpdateVehicle()
  const toast = useToast()
  const toastId1 = "error_bookingVehicle"
  const toastId2 = "error_listBookingPassenger"
  const toastId3 = "error_listVehicleType"
  const toastId4 = "error_deleteEmptyBookingVehicle"
  const toastId5 = "success_deleteEmptyBookingVehicle"
  const toastId6 = "error_listDifferenceBusLine"
  const toastId7 = "error_listSameBusLine"
  const toastId8 = "error_transferPassenger"
  const toastId9 = "success_transferPassenger"
  const toastId10 = "error_update"
  const toastId11 = "success_update"
  const toastId12 = "error_listBusStopLineMapping"

  useEffect(() => {
    if (update.isSuccess) {
      if (!toast.isActive(toastId11)) {
        toast({
          id: toastId11,
          description: `บันทึกสำเร็จ`,
          status: "success",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [update.isSuccess, toast])

  useEffect(() => {
    if (update.isError) {
      if (!toast.isActive(toastId10) && get(update, "error.status") !== 401) {
        toast({
          id: toastId10,
          description: `${get(update, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [update.isError, update.error, toast])

  useEffect(() => {
    if (transferPassenger.isSuccess) {
      if (!toast.isActive(toastId9)) {
        toast({
          id: toastId9,
          description: `ย้ายสำเร็จ`,
          status: "success",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [transferPassenger.isSuccess, toast])

  useEffect(() => {
    if (transferPassenger.isError) {
      if (
        !toast.isActive(toastId8) &&
        get(transferPassenger, "error.status") !== 401
      ) {
        toast({
          id: toastId8,
          description: `${get(transferPassenger, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [transferPassenger.isError, transferPassenger.error, toast])

  useEffect(() => {
    if (deleteEmptyBookingVehicle.isSuccess) {
      if (!toast.isActive(toastId5)) {
        toast({
          id: toastId5,
          description: `ลบสำเร็จ`,
          status: "success",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [deleteEmptyBookingVehicle.isSuccess, toast])

  useEffect(() => {
    if (deleteEmptyBookingVehicle.isError) {
      if (
        !toast.isActive(toastId4) &&
        get(deleteEmptyBookingVehicle, "error.status") !== 401
      ) {
        toast({
          id: toastId4,
          description: `${get(deleteEmptyBookingVehicle, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [
    deleteEmptyBookingVehicle.isError,
    deleteEmptyBookingVehicle.error,
    toast,
  ])

  useEffect(() => {
    if (bookingVehicle.error || bookingVehicle.data?.error) {
      if (
        !toast.isActive(toastId1) &&
        get(bookingVehicle, "error.status") !== 401
      ) {
        toast({
          id: toastId1,
          title: "bookingVehicle",
          description: bookingVehicle.data?.error?.message
            ? bookingVehicle.data?.error?.message
            : `${get(bookingVehicle, "error.messsage")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
    if (bookingPassengers.error || bookingPassengers.data?.error) {
      if (
        !toast.isActive(toastId2) &&
        get(bookingPassengers, "error.status") !== 401
      ) {
        toast({
          id: toastId2,
          title: "bookingPassengers",
          description: bookingPassengers.data?.error?.message
            ? bookingPassengers.data?.error?.message
            : `${get(bookingPassengers, "error.messsage")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
    if (vehicleTypes.error || vehicleTypes.data?.error) {
      if (
        !toast.isActive(toastId3) &&
        get(vehicleTypes, "error.status") !== 401
      ) {
        toast({
          id: toastId3,
          title: "vehicleTypes",
          description: vehicleTypes.data?.error?.message
            ? vehicleTypes.data?.error?.message
            : `${get(vehicleTypes, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
    if (listDifferenceBusLine.error || listDifferenceBusLine.data?.error) {
      if (
        !toast.isActive(toastId6) &&
        get(listDifferenceBusLine, "error.status") !== 401
      ) {
        toast({
          id: toastId6,
          title: "listDifferenceBusLine",
          description: listDifferenceBusLine.data?.error?.message
            ? listDifferenceBusLine.data?.error?.message
            : `${get(listDifferenceBusLine, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
    if (listSameBusLine.error || listSameBusLine.data?.error) {
      if (
        !toast.isActive(toastId7) &&
        get(listSameBusLine, "error.status") !== 401
      ) {
        toast({
          id: toastId7,
          title: "listSameBusLine",
          description: listSameBusLine.data?.error?.message
            ? listSameBusLine.data?.error?.message
            : `${get(listSameBusLine, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
    if (listBusStopLineMapping.error || listBusStopLineMapping.data?.error) {
      if (
        !toast.isActive(toastId12) &&
        get(listBusStopLineMapping, "error.status") !== 401
      ) {
        toast({
          id: toastId12,
          title: "listBusStopLineMapping",
          description: listBusStopLineMapping.data?.error?.message
            ? listBusStopLineMapping.data?.error?.message
            : `${get(listBusStopLineMapping, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [
    bookingVehicle.error,
    bookingVehicle.data?.error,
    bookingPassengers.error,
    bookingPassengers.data?.error,
    vehicleTypes.error,
    vehicleTypes.data?.error,
    listDifferenceBusLine.error,
    listDifferenceBusLine.data?.error,
    listSameBusLine.error,
    listSameBusLine.data?.error,
    listBusStopLineMapping.error,
    listBusStopLineMapping.data?.error,
    toast,
  ])

  if (
    (bookingVehicle.isLoading ||
      bookingVehicle.isFetching ||
      bookingPassengers.isLoading ||
      bookingPassengers.isFetching ||
      vehicleTypes.isLoading ||
      vehicleTypes.isFetching ||
      listBusStopLineMapping.isLoading ||
      listBusStopLineMapping.isFetching ||
      listDifferenceBusLine.isLoading ||
      listDifferenceBusLine.isFetching ||
      listSameBusLine.isLoading ||
      listSameBusLine.isFetching) &&
    !bookingVehicle.error &&
    !bookingPassengers.error &&
    !vehicleTypes.error &&
    !listBusStopLineMapping.error &&
    !listDifferenceBusLine.error &&
    !listSameBusLine.error
  )
    return (
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
    )

  return (
    <Edit
      data={bookingVehicle?.data?.data}
      vehicleTypes={vehicleTypes?.data?.data}
      deleteEmptyBookingVehicle={deleteEmptyBookingVehicle?.mutate}
      isLoadingDelete={deleteEmptyBookingVehicle?.isLoading}
      listDifferenceBusLine={listDifferenceBusLine?.data?.data}
      listSameBusLine={listSameBusLine?.data?.data}
      listBusStopLineMapping={listBusStopLineMapping?.data?.data}
      onTransfer={transferPassenger.mutate}
      isLoadingTransfer={transferPassenger.isLoading}
      onSubmit={update?.mutate}
      isLoading={update?.isLoading}
      totalBookingPassengerIsNormalBusStopBySetting={
        bookingVehicle?.data?.totalBookingPassengerIsNormalBusStopBySetting
      }
      totalBookingPassengerIsNotNormalBusStopBySetting={
        bookingVehicle?.data?.totalBookingPassengerIsNotNormalBusStopBySetting
      }
      bookingStatus={bookingVehicle?.data?.bookingStatus}
    />
  )
}

export default BookingVehicleEdit
