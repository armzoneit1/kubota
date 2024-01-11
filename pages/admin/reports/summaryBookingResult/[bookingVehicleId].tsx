import { useEffect } from "react"
import { Flex, Center, Spinner, useToast } from "@chakra-ui/react"
import { getOne } from "../../../../data-hooks/reports/summaryBookingResult/getDetail"
import { useRouter } from "next/router"
import List from "../../../../components/admin/reports/summaryBookingResult/DetailList"
import { useExport } from "../../../../data-hooks/reports/summaryBookingResult/exportDetail"
import get from "lodash/get"

const DetailList = () => {
  const router = useRouter()
  const id = router?.query?.bookingVehicleId
  const detail = getOne(id)
  const toast = useToast()
  const toastId1 = "error"
  const toastId2 = "error_download"
  const toastId3 = "success_download"
  const download = useExport()

  useEffect(() => {
    if (download.isSuccess) {
      if (!toast.isActive(toastId3)) {
        toast({
          id: toastId3,
          description: `ดาวน์โหลดสำเร็จ`,
          status: "success",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [download.isSuccess, toast])

  useEffect(() => {
    if (download.isError) {
      if (!toast.isActive(toastId2) && get(download, "error.status") !== 401) {
        toast({
          id: toastId2,
          description: `${get(download, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [download.isError, download.error, toast])

  useEffect(() => {
    if (detail.error || detail.data?.error) {
      if (!toast.isActive(toastId1) && get(detail, "error.status") !== 401) {
        toast({
          id: toastId1,
          description: detail.data?.error?.message
            ? detail.data?.error?.message
            : `${get(detail, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [detail.error, detail.data?.error, toast])

  if ((detail.isLoading || detail.isFetching) && !detail.error)
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
    <List
      data={detail.data?.data}
      download={download.mutate}
      dataForDownload={detail.data?.dataForDownload}
      busStops={detail.data?.busStops}
      isLoadingDownload={download.isLoading}
    />
  )
}

export default DetailList
