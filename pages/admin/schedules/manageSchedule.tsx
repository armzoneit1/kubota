import React, { useEffect } from "react"
import Manage from "../../../components/admin/schedules/ManageSchedule"
import { useUpdate } from "../../../data-hooks/schedules/manageSchedule"
import { useToast } from "@chakra-ui/react"

const ManageSchdule = () => {
  const update = useUpdate()
  const toast = useToast()
  const toastId1 = "success_update"
  const toastId2 = "error_update"

  useEffect(() => {
    if (update.isSuccess) {
      if (!toast.isActive(toastId1)) {
        toast({
          id: toastId1,
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
      if (!toast.isActive(toastId2)) {
        toast({
          id: toastId2,
          description: `${update.error}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [update.isError, update.error, toast])

  return <Manage isLoading={update.isLoading} onSubmit={update.mutate} />
}

export default ManageSchdule
