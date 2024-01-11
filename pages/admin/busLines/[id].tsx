import { useEffect } from "react"
import { Flex, Center, Spinner, useToast } from "@chakra-ui/react"
import { getOne } from "../../../data-hooks/busLines/getOne"
import { useRouter } from "next/router"
import Edit from "../../../components/admin/busLines/Edit"
import { getListBusLineOptions } from "../../../data-hooks/busLines/getList"
import { useUpdate } from "../../../data-hooks/busLines/update"
import { useDelete } from "../../../data-hooks/busLines/delete"
import get from "lodash/get"

const BusLineEdit = () => {
  const router = useRouter()
  const id = router?.query?.id
  const area = getOne(id)
  const areaOptions = getListBusLineOptions()
  const toast = useToast()
  const update = useUpdate()
  const onDelete = useDelete()
  const toastId1 = "error_area"
  const toastId2 = "error_areaList"
  const toastId3 = "success"
  const toastId4 = "error_update"
  const toastId5 = "delete_success"
  const toastId6 = "delete_error"

  useEffect(() => {
    if (onDelete.isSuccess) {
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
  }, [onDelete.isSuccess, toast])

  useEffect(() => {
    if (onDelete.isError) {
      if (!toast.isActive(toastId6) && get(onDelete, "error.status") !== 401) {
        toast({
          id: toastId6,
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
    if (area.error || area.data?.error) {
      if (!toast.isActive(toastId1) && get(area, "error.status") !== 401) {
        toast({
          id: toastId1,
          title: "Area",
          description: area.data?.error?.message
            ? area.data?.error?.message
            : `${get(area, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
    if (areaOptions.error || areaOptions.data?.error) {
      if (
        !toast.isActive(toastId2) &&
        get(areaOptions, "error.status") !== 401
      ) {
        toast({
          id: toastId2,
          title: "Area List",
          description: areaOptions.data?.error?.message
            ? areaOptions.data?.error?.message
            : `${get(areaOptions, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [
    area.error,
    area.data?.error,
    areaOptions.error,
    areaOptions.data?.error,
    toast,
  ])

  if (
    (area.isLoading ||
      areaOptions.isLoading ||
      area.isFetching ||
      areaOptions.isFetching) &&
    !area.error &&
    !areaOptions.error
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
      data={area.data?.data}
      options={areaOptions.data?.data}
      isLoading={update.isLoading}
      onSubmit={update.mutate}
      onDelete={onDelete.mutate}
      isLoadingDelete={onDelete.isLoading}
    />
  )
}

export default BusLineEdit
