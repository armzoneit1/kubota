import { useEffect } from "react"
import { Flex, Center, Spinner, useToast } from "@chakra-ui/react"
import { getOne } from "../../../../data-hooks/timeTables/getOne"
import { useRouter } from "next/router"
import Edit from "../../../../components/admin/timeTables/Edit"
import { useUpdate } from "../../../../data-hooks/timeTables/update"
import get from "lodash/get"

const TimeTableEdit = () => {
  const router = useRouter()
  const id = router?.query?.id
  const timeTable = getOne(id)
  const toast = useToast()
  const update = useUpdate()
  const toastId1 = "error"
  const toastId2 = "success_update"
  const toastId3 = "error_update"

  useEffect(() => {
    if (update.isSuccess) {
      if (!toast.isActive(toastId2)) {
        toast({
          id: toastId2,
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
      if (!toast.isActive(toastId3) && get(update, "error.status") !== 401) {
        toast({
          id: toastId3,
          description: `${get(update, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [update.isError, update.error, toast])

  useEffect(() => {
    if (timeTable.error || timeTable.data?.error) {
      if (!toast.isActive(toastId1) && get(timeTable, "error.status") !== 401) {
        toast({
          id: toastId1,
          description: timeTable.data?.error?.message
            ? timeTable.data?.error?.message
            : `${get(timeTable, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [timeTable.error, timeTable.data?.error, toast])

  if ((timeTable.isLoading || timeTable.isFetching) && !timeTable.error)
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
      data={timeTable.data?.data}
      isLoading={update.isLoading}
      onSubmit={update.mutate}
    />
  )
}

export default TimeTableEdit
