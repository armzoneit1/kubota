/* eslint-disable react/display-name */
/* eslint-disable react/no-children-prop */
import { useToast } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import TabLayout from "../../../../../components/admin/transportationProviders/TabLayout"
import { useRouter } from "next/router"
import { getList } from "../../../../../data-hooks/transportationProviders/vehicles/getList"
import { useDelete } from "../../../../../data-hooks/transportationProviders/vehicles/delete"
import List from "../../../../../components/admin/transportationProviders/vehicles/List"
import get from "lodash/get"

type SortByType = {
  id: string
  desc: boolean | undefined
}

const VehicleList = () => {
  const router = useRouter()
  const providerId = router?.query?.providerId
  const toast = useToast()
  const toastId = "error"
  const toastId2 = "delete_success"
  const toastId3 = "delete_error"
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState<string>("")
  const [sortBy, setSortBy] = useState<SortByType | undefined>(undefined)
  const onDelete = useDelete()

  useEffect(() => {
    if (onDelete.isSuccess) {
      if (!toast.isActive(toastId2)) {
        toast({
          id: toastId2,
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
      if (!toast.isActive(toastId3) && get(onDelete, "error.status") !== 401) {
        toast({
          id: toastId3,
          title: "Delete",
          description: `${get(onDelete, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [onDelete.isError, onDelete.error, toast])

  const { isLoading, error, data, isFetching } = getList(
    providerId,
    page,
    search,
    sortBy
  )

  useEffect(() => {
    if (error || data?.error) {
      if (!toast.isActive(toastId) && get(data, "error.status") !== 401) {
        toast({
          id: toastId,
          description: data?.error?.message
            ? data?.error?.message
            : `${get(data, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [error, data?.error, toast])

  return (
    <TabLayout index={1} type="list">
      <List
        id={providerId}
        data={data?.data}
        setPage={setPage}
        pageCount={data?.pageCount}
        setSearch={setSearch}
        search={search}
        isLoading={isLoading}
        setSort={setSortBy}
        sortBy={sortBy}
        currentPage={data?.page}
        onDelete={onDelete.mutate}
        isLoadingDelete={onDelete.isLoading}
      />
    </TabLayout>
  )
}

export default VehicleList
