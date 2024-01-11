import { useEffect } from "react"
import { useToast } from "@chakra-ui/react"
import Create from "../../../components/admin/areas/Create"
import { useCreate } from "../../../data-hooks/areas/create"
import get from "lodash/get"

const AreaCreate = () => {
  const toast = useToast()
  const create = useCreate()
  const toastId1 = "error_create"
  const toastId2 = "success"

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
      if (!toast.isActive(toastId1) && get(create, "error.status") !== 401) {
        toast({
          id: toastId1,
          description: `${get(create, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [create.isError, create.error, toast])

  return <Create onSubmit={create.mutate} isLoading={create.isLoading} />
}

export default AreaCreate
