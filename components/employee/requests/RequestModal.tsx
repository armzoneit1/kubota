import {
  Modal,
  ModalOverlay,
  ModalContent,
  Flex,
  Center,
  Spinner,
  useToast,
} from "@chakra-ui/react"
import { getOneBooking } from "../../../data-hooks/requests/getOneBooking"
import { useEffect } from "react"
import RequestForm from "./RequestForm"
import get from "lodash/get"

type RequestModalProps = {
  isOpen: boolean
  onClose: () => void
  bookingId: string
  periodOfDay: "morning" | "evening"
}

const RequestModal = ({
  isOpen,
  onClose,
  bookingId,
  periodOfDay,
}: RequestModalProps) => {
  const toast = useToast()
  const toastId1 = "error_booking"
  const booking = getOneBooking(bookingId, isOpen)

  useEffect(() => {
    if (booking.error || booking.data?.error) {
      if (!toast.isActive(toastId1) && get(booking, "me.status") !== 401) {
        toast({
          id: toastId1,
          title: "Booking",
          description: booking.data?.error?.message
            ? booking.data?.error?.message
            : `${get(booking, "me.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [booking.error, booking.data?.error, toast])

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      {(booking.isLoading || booking.isFetching) && !booking.error ? (
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
        <RequestForm data={booking?.data?.data} />
      )}
    </Modal>
  )
}

export default RequestModal
