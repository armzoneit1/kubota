import { useEffect } from "react"
import { useToast } from "@chakra-ui/react"
import Create from "../../../../components/admin/timeTables/Create"
import { useCreate } from "../../../../data-hooks/timeTables/create"

const TimeTableCreate = () => {
  const toast = useToast()
  const create = useCreate()
  const toastId1 = "error_create"
  const toastId2 = "success_create"

  useEffect(() => {
    if (create.isSuccess) {
      if (!toast.isActive(toastId2)) {
        toast({
          id: toastId2,
          description: `เพิ่มสำเร็จ`,
          status: "success",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [create.isSuccess, toast])

  useEffect(() => {
    if (create.isError) {
      if (!toast.isActive(toastId1)) {
        toast({
          id: toastId1,
          description: `${create.error}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [create.isError, create.error, toast])

  return (
    <Create
      onSubmit={create.mutate}
      isLoading={create.isLoading}
      periodOfDay="morning"
    />
  )
}

export default TimeTableCreate
