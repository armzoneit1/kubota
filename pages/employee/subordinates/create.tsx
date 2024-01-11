import Create from "../../../components/employee/subordinates/Create"
import { getEmpList } from "../../../data-hooks/subordinates/getMyEmployee"
import { useAddSubordinate } from "../../../data-hooks/subordinates/addSubordinate"
import { Flex, Center, Spinner, useToast } from "@chakra-ui/react"
import { useEffect } from "react"
import get from "lodash/get"

const SubordinateCreate = () => {
  const toast = useToast()
  const toastId1 = "error_myHrEmployee"
  const toastId2 = "success_addSubordinate"
  const toastId3 = "error_addSubordinate"
  const employeeList = getEmpList()
  const addSubordinate = useAddSubordinate()

  useEffect(() => {
    if (addSubordinate.isSuccess) {
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
  }, [addSubordinate.isSuccess, toast])

  useEffect(() => {
    if (addSubordinate.isError) {
      if (
        !toast.isActive(toastId3) &&
        get(addSubordinate, "error.status") !== 401
      ) {
        toast({
          id: toastId3,
          description: `${get(addSubordinate, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [addSubordinate.isError, addSubordinate.error, toast])

  useEffect(() => {
    if (employeeList.error || employeeList.data?.error) {
      if (
        !toast.isActive(toastId1) &&
        get(employeeList, "error.status") !== 401
      ) {
        toast({
          id: toastId1,
          description: employeeList.data?.error?.message
            ? employeeList.data?.error?.message
            : `${get(employeeList, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [employeeList.error, employeeList?.data?.error, toast])

  if (
    (employeeList.isLoading || employeeList.isFetching) &&
    !employeeList.error
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
    <Create
      employeeList={employeeList?.data?.data}
      onSubmit={addSubordinate.mutate}
      isLoading={addSubordinate.isLoading}
    />
  )
}

export default SubordinateCreate
