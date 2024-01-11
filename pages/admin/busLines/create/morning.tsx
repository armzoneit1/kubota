import { useEffect } from "react"
import { useToast, Flex, Center, Spinner } from "@chakra-ui/react"
import Create from "../../../../components/admin/busLines/Create"
import { useCreate } from "../../../../data-hooks/busLines/create"
import { getListBusLineOptions } from "../../../../data-hooks/busLines/getList"
import get from "lodash/get"

const AreaCreate = () => {
  const toast = useToast()
  const create = useCreate()
  const areaOptions = getListBusLineOptions()
  const toastId1 = "error_create"
  const toastId2 = "success"
  const toastId3 = "error_areaList"

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

  useEffect(() => {
    if (areaOptions.error || areaOptions.data?.error) {
      if (
        !toast.isActive(toastId3) &&
        get(areaOptions, "error.status") !== 401
      ) {
        toast({
          id: toastId3,
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
  }, [areaOptions.error, areaOptions.data?.error, toast])

  if ((areaOptions.isLoading || areaOptions.isFetching) && !areaOptions.error)
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
    <Create
      onSubmit={create.mutate}
      isLoading={create.isLoading}
      options={areaOptions.data?.data}
      periodOfDay="morning"
    />
  )
}

export default AreaCreate
