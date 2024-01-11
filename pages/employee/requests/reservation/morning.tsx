import Request from "../../../../components/employee/requests/Request"
import { getAll } from "../../../../data-hooks/busLines/getList"
import { Flex, Center, Spinner, useToast, Box } from "@chakra-ui/react"
import { useEffect } from "react"
import { useRequest } from "../../../../data-hooks/requests/request"
import { getList } from "../../../../data-hooks/subordinates/getList"
import { getAreaList } from "../../../../data-hooks/requests/getAreaList"
import get from "lodash/get"

const RequestMorning = () => {
  const toast = useToast()
  const toastId1 = "error_busLine"
  const toastId2 = "success_request"
  const toastId3 = "error_request"
  const toastId4 = "error_subordinates"
  const toastId5 = "error_areaList"
  const busLine = getAll("morning")
  const request = useRequest()
  const subordinates = getList(undefined)
  const areas = getAreaList()

  useEffect(() => {
    if (request.isSuccess) {
      if (!toast.isActive(toastId2)) {
        toast({
          id: toastId2,
          description: `จองสำเร็จ`,
          status: "success",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [request.isSuccess, toast])

  useEffect(() => {
    if (request.isError) {
      if (!toast.isActive(toastId3) && get(request, "error.status") !== 401) {
        toast({
          id: toastId3,
          description: `${get(request, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [request.isError, request.error, toast])

  useEffect(() => {
    if (busLine.error || busLine.data?.error) {
      if (!toast.isActive(toastId1) && get(busLine, "error.status") !== 401) {
        toast({
          id: toastId1,
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
        !toast.isActive(toastId4) &&
        get(subordinates, "error.status") !== 401
      ) {
        toast({
          id: toastId4,
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
      if (!toast.isActive(toastId5) && get(areas, "error.status") !== 401) {
        toast({
          id: toastId5,
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
    subordinates.error,
    subordinates.data?.error,
    areas.error,
    areas.data?.error,
    toast,
  ])

  if (
    (busLine.isLoading ||
      busLine.isFetching ||
      subordinates.isLoading ||
      subordinates.isFetching ||
      areas.isLoading ||
      areas.isFetching) &&
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
    <Request
      periodOfDay="morning"
      busLine={busLine?.data?.data}
      onSubmit={request.mutate}
      isLoading={request.isLoading}
      subordinates={subordinates?.data?.data}
      areas={areas?.data?.data}
    />
  )
}

export default RequestMorning
