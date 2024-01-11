import Edit from "../../../../components/employee/requests/RequestEdit"
import { useRouter } from "next/router"
import { getOneRequest } from "../../../../data-hooks/requests/getOneRequest"
import { Flex, Center, Spinner, useToast } from "@chakra-ui/react"
import { useEffect } from "react"
import { getAll } from "../../../../data-hooks/busLines/getList"
import { getList } from "../../../../data-hooks/subordinates/getList"
import { useCancelBooking } from "../../../../data-hooks/requests/cancelBooking"
import { useUpdateBooking } from "../../../../data-hooks/requests/updateRequest"
import { getAreaList } from "../../../../data-hooks/requests/getAreaList"
import get from "lodash/get"

const RequestEdit = () => {
  const router = useRouter()
  const toast = useToast()
  const toastId1 = "error_requests"
  const toastId2 = "error_busLine"
  const toastId3 = "error_subordinates"
  const toastId4 = "success_delete"
  const toastId5 = "error_delete"
  const toastId6 = "success_update"
  const toastId7 = "error_update"
  const toastId8 = "error_areaList"
  const requestId = router.query?.requestId
  const requests = getOneRequest(requestId)
  const busLine = getAll(requests?.data?.periodOfDay)
  const subordinates = getList(undefined)
  const cancel = useCancelBooking()
  const update = useUpdateBooking()
  const areas = getAreaList()

  useEffect(() => {
    if (update.isSuccess) {
      if (!toast.isActive(toastId6)) {
        toast({
          id: toastId6,
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
      if (!toast.isActive(toastId7) && get(update, "error.status") !== 401) {
        toast({
          id: toastId7,
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
      if (!toast.isActive(toastId4)) {
        toast({
          id: toastId4,
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
      if (!toast.isActive(toastId5) && get(cancel, "error.status") !== 401) {
        toast({
          id: toastId5,
          description: `${get(cancel, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [cancel.isError, cancel.error, toast])

  useEffect(() => {
    if (requests.error || requests.data?.error) {
      if (!toast.isActive(toastId1) && get(requests, "error.status") !== 401) {
        toast({
          id: toastId1,
          title: "Request",
          description: requests.data?.error?.message
            ? requests.data?.error?.message
            : `${get(requests, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
        if (
          get(requests?.error, "status") === 400 ||
          get(requests?.error, "code") === "unauthorized-for-view-request"
        ) {
          router.push("/employee/requests")
        }
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
    if (subordinates.error || subordinates.data?.error) {
      if (
        !toast.isActive(toastId3) &&
        get(subordinates, "error.status") !== 401
      ) {
        toast({
          id: toastId3,
          title: "Subordinates",
          description: subordinates.data?.error?.message
            ? subordinates.data?.error?.message
            : `${get(subordinates, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
    if (areas.error || areas.data?.error) {
      if (!toast.isActive(toastId8) && get(areas, "error.status") !== 401) {
        toast({
          id: toastId8,
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
    requests.error,
    requests.data?.error,
    busLine.error,
    busLine.data?.error,
    subordinates.error,
    subordinates.data?.error,
    areas.error,
    areas.data?.error,
    toast,
  ])

  if (
    (requests.isLoading ||
      requests.isFetching ||
      busLine.isLoading ||
      busLine.isFetching ||
      subordinates.isLoading ||
      subordinates.isFetching ||
      areas.isLoading ||
      areas.isFetching) &&
    !requests.error &&
    !busLine.error &&
    !subordinates.error &&
    !areas.error
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
      data={requests?.data?.data}
      busLine={busLine?.data?.data}
      subordinates={subordinates?.data?.data}
      periodOfDay={requests?.data?.periodOfDay}
      onCancel={cancel.mutate}
      isLoadingCancel={cancel.isLoading}
      onSubmit={update.mutate}
      isLoading={update.isLoading}
      areas={areas?.data?.data}
    />
  )
}

export default RequestEdit
