import { useEffect } from "react"
import { Flex, Center, Spinner, useToast } from "@chakra-ui/react"
import { getOne } from "../../../data-hooks/areas/getOne"
import { useRouter } from "next/router"
import Edit from "../../../components/admin/areas/Edit"
import { useUpdate } from "../../../data-hooks/areas/update"
import { useDelete } from "../../../data-hooks/areas/delete"
import get from "lodash/get"

const AreaEdit = () => {
  const router = useRouter()
  const id = router?.query?.id
  const area = getOne(id)
  const toast = useToast()
  const update = useUpdate()
  const onDelete = useDelete()
  const toastId1 = "error"
  const toastId2 = "error_update"
  const toastId3 = "success"
  const toastId4 = "delete_success"
  const toastId5 = "delete_error"

  useEffect(() => {
    if (onDelete.isSuccess) {
      if (!toast.isActive(toastId4)) {
        toast({
          id: toastId4,
          description: `ลบสำเร็จ`,
          status: "success",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [onDelete.isSuccess, toast])

  useEffect(() => {
    if (onDelete.isError) {
      if (!toast.isActive(toastId5) && get(onDelete, "error.status") !== 401) {
        toast({
          id: toastId5,
          title: "Delete",
          description: `${get(onDelete, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [onDelete.isError, onDelete.error, toast])

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
      if (!toast.isActive(toastId2) && get(update, "error.status") !== 401) {
        toast({
          id: toastId2,
          description: `${get(update, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [update.isError, update.error, toast])

  useEffect(() => {
    if (area.error || area.data?.error) {
      if (!toast.isActive(toastId1) && get(area, "error.status") !== 401) {
        toast({
          id: toastId1,
          description: area.data?.error?.message
            ? area.data?.error?.message
            : `${get(area, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [area.error, area.data?.error, toast])

  if ((area.isLoading || area.isFetching) && !area.error)
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
      data={area.data?.data}
      onSubmit={update.mutate}
      isLoading={update.isLoading}
      onDelete={onDelete.mutate}
      isLoadingDelete={onDelete.isLoading}
    />
  )
}

export default AreaEdit
