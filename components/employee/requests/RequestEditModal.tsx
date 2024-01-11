import {
  Modal,
  ModalOverlay,
  ModalContent,
  Flex,
  Center,
  Spinner,
  useToast,
} from "@chakra-ui/react"
import { useEffect } from "react"
import RequestEditForm from "./RequestEditForm"
import { getOneBooking } from "../../../data-hooks/requests/getOneBooking"
import { getAll } from "../../../data-hooks/busLines/getList"
import { useUpdateBooking } from "../../../data-hooks/requests/updateBooking"
import { useCancelBooking } from "../../../data-hooks/requests/cancelBooking"
import { getAreaList } from "../../../data-hooks/requests/getAreaList"
import get from "lodash/get"

type RequestEditModal = {
  isOpen: boolean
  onClose: () => void
  bookingId: string
  periodOfDay: "morning" | "evening"
}

const RequestEditModal = ({
  isOpen,
  onClose,
  bookingId,
  periodOfDay,
}: RequestEditModal) => {
  const toast = useToast()
  const toastId1 = "error_booking"
  const toastId2 = "error_busLine"
  const toastId3 = "success_update"
  const toastId4 = "error_update"
  const toastId5 = "success_delete"
  const toastId6 = "error_delete"
  const toastId7 = "error_areaList"
  const booking = getOneBooking(bookingId, isOpen)
  const busLine = getAll(periodOfDay)
  const update = useUpdateBooking()
  const cancel = useCancelBooking()
  const areas = getAreaList()

  useEffect(() => {
    if (update.isSuccess) {
      if (!toast.isActive(toastId3)) {
        toast({
          id: toastId3,
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
      if (!toast.isActive(toastId4) && get(update, "error.status") !== 401) {
        toast({
          id: toastId4,
          description: `${get(update, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [update.isError, update.error, toast])

  useEffect(() => {
    if (cancel.isSuccess) {
      if (!toast.isActive(toastId5)) {
        toast({
          id: toastId5,
          description: `ยกเลิกสำเร็จ`,
          status: "success",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [cancel.isSuccess, toast])

  useEffect(() => {
    if (cancel.isError) {
      if (!toast.isActive(toastId6) && get(cancel, "error.status") !== 401) {
        toast({
          id: toastId6,
          description: `${get(cancel, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [cancel.isError, cancel.error, toast])

  useEffect(() => {
    if (booking.error || booking.data?.error) {
      if (!toast.isActive(toastId1) && get(booking, "error.status") !== 401) {
        toast({
          id: toastId1,
          title: "Booking",
          description: booking.data?.error?.message
            ? booking.data?.error?.message
            : `${get(booking, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
    if (busLine.error || busLine.data?.error) {
      if (!toast.isActive(toastId2) && get(busLine, "error.status") !== 401) {
        toast({
          id: toastId2,
          title: "BusLine",
          description: busLine.data?.error?.message
            ? busLine.data?.error?.message
            : `${get(busLine, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
    if (areas.error || areas.data?.error) {
      if (!toast.isActive(toastId7) && get(areas, "error.status") !== 401) {
        toast({
          id: toastId7,
          title: "Areas",
          description: areas.data?.error?.message
            ? areas.data?.error?.message
            : `${get(areas, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [
    busLine.error,
    busLine.data?.error,
    booking.error,
    booking.data?.error,
    areas.error,
    areas.data?.error,
    toast,
  ])

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      {(busLine.isLoading ||
        busLine.isFetching ||
        booking.isLoading ||
        booking.isFetching ||
        areas.isLoading ||
        areas.isFetching) &&
      !busLine.error &&
      !booking.error &&
      !areas.error ? (
        <ModalContent>
          <Flex
            alignItems="center"
            width="100%"
            height="60vh"
            justifyContent="center"
          >
            <Center>
              <Spinner size="xl" color="primary.500" />
            </Center>
          </Flex>
        </ModalContent>
      ) : (
        <RequestEditForm
          data={booking?.data?.data}
          onClose={onClose}
          onSubmit={update.mutate}
          isLoading={update.isLoading}
          onCancel={cancel.mutate}
          isLoadingCancel={cancel.isLoading}
          busLine={busLine?.data?.data}
          periodOfDay={periodOfDay}
          areas={areas?.data?.data}
        />
      )}
    </Modal>
  )
}

export default RequestEditModal
