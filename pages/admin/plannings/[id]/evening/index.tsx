import { useEffect } from "react"
import { Flex, Center, Spinner, useToast } from "@chakra-ui/react"
import {
  getOne,
  getOneSchedule,
} from "../../../../../data-hooks/busArrangements/getOne"
import { useCloseBooking } from "../../../../../data-hooks/busArrangements/closeBooking"
import { useResetAutoResult } from "../../../../../data-hooks/busArrangements/resetAutoResult"
import { useDeleteMultiEmptyBookingVehicle } from "../../../../../data-hooks/busArrangements/deleteMultipleEmptyBookingVehicle"
import { useMergeVehiclesSameBusLine } from "../../../../../data-hooks/busArrangements/mergeVehiclesSameBusLine"
import { useMergeVehiclesDifferenceBusLine } from "../../../../../data-hooks/busArrangements/mergeVehiclesDifferenceBusLine"
import { getAll } from "../../../../../data-hooks/busLines/getList"
import { useRouter } from "next/router"
import Edit from "../../../../../components/admin/plannings/Edit"
import TabLayout from "../../../../../components/admin/plannings/TabLayout"
import { getListVehicleType } from "../../../../../data-hooks/busArrangements/getListVehicleType"
import { useReOpenBooking } from "../../../../../data-hooks/busArrangements/reOpenBookingRound"
import { useCancelArrangement } from "../../../../../data-hooks/busArrangements/cancelArrangement"
import { useConfirmArrangement } from "../../../../../data-hooks/busArrangements/confirmArrangement"
import { useSendEmailBookingResult } from "../../../../../data-hooks/busArrangements/sendEmailBookingResult"
import { useExportEmployeeAnnouncement } from "../../../../../data-hooks/busArrangements/exports/exportEmployeeAnnouncement"
import { useExportEmployeeAttendance } from "../../../../../data-hooks/busArrangements/exports/exportEmployeeAttendance"
import { useExportSummaryBookingResult } from "../../../../../data-hooks/busArrangements/exports/exportSummaryBookingResult"
import { useExportSummaryBookingResultDetail } from "../../../../../data-hooks/busArrangements/exports/exportSummaryBookingResultDetail"
import { useExportDaily } from "../../../../../data-hooks/busArrangements/exports/exportDaily"
import get from "lodash/get"

const PlanningEdit = () => {
  const router = useRouter()
  const scheduleId = router?.query?.id
  const busArrangement = getOne(scheduleId, "evening")
  const schedule = getOneSchedule(scheduleId, "evening")
  const busLines = getAll("evening")
  const closeBooking = useCloseBooking()
  const resetAutoResult = useResetAutoResult()
  const deleteEmptyBookingVehicle = useDeleteMultiEmptyBookingVehicle()
  const mergeVehiclesSameBusLine = useMergeVehiclesSameBusLine()
  const mergeVehiclesDifferenceBusLine = useMergeVehiclesDifferenceBusLine()
  const vehicleTypes = getListVehicleType()
  const reOpenBooking = useReOpenBooking()
  const cancelArrangement = useCancelArrangement()
  const confirmArrangement = useConfirmArrangement()
  const sendEmailBookingResult = useSendEmailBookingResult()
  const exportEmployeeAnnouncement = useExportEmployeeAnnouncement()
  const exportEmployeeAttendance = useExportEmployeeAttendance()
  const exportSummaryBookingResult = useExportSummaryBookingResult()
  const exportSummaryBookingResultDetail = useExportSummaryBookingResultDetail()
  const exportDaily = useExportDaily()
  const toast = useToast()
  const toastId1 = "error_busArrangement"
  const toastId2 = "error_busLines"
  const toastId3 = "error_schedule"
  const toastId4 = "error_closeBooking"
  const toastId5 = "success_closeBooking"
  const toastId6 = "error_resetAutoResult"
  const toastId7 = "success_resetAutoResult"
  const toastId8 = "error_deleteEmptyBookingVehicle"
  const toastId9 = "success_deleteEmptyBookingVehicle"
  const toastId10 = "error_mergeVehiclesSameBusLine"
  const toastId11 = "success_mergeVehiclesSameBusLine"
  const toastId12 = "error_listVehicleType"
  const toastId13 = "error_mergeVehiclesDifferenceBusLine"
  const toastId14 = "success_mergeVehiclesDifferenceBusLine"
  const toastId15 = "error_reOpenBooking"
  const toastId16 = "success_reOpenBooking"
  const toastId17 = "error_cancelArrangement"
  const toastId18 = "success_cancelArrangement"
  const toastId19 = "error_confirmArrangement"
  const toastId20 = "success_confirmArrangement"
  const toastId21 = "error_sendEmailBookingResult"
  const toastId22 = "success_sendEmailBookingResult"
  const toastId23 = "error_exportEmployeeAnnouncement"
  const toastId24 = "success_exportEmployeeAnnouncement"
  const toastId25 = "error_exportEmployeeAttendance"
  const toastId26 = "success_exportEmployeeAttendance"
  const toastId27 = "error_exportSummaryBookingResult"
  const toastId28 = "success_exportSummaryBookingResult"
  const toastId29 = "error_exportSummaryBookingResultDetail"
  const toastId30 = "success_exportSummaryBookingResultDetail"
  const toastId31 = "error_exportDaily"
  const toastId32 = "success_exportDaily"

  useEffect(() => {
    if (exportDaily.isSuccess) {
      if (!toast.isActive(toastId32)) {
        toast({
          id: toastId32,
          description: `ดาวน์โหลดสำเร็จ`,
          status: "success",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [exportDaily.isSuccess, toast])

  useEffect(() => {
    if (exportDaily.isError) {
      if (
        !toast.isActive(toastId31) &&
        get(exportDaily, "error.status") !== 401
      ) {
        toast({
          id: toastId31,
          description: `${get(exportDaily, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [exportDaily.isError, exportDaily.error, toast])

  useEffect(() => {
    if (exportSummaryBookingResultDetail.isSuccess) {
      if (!toast.isActive(toastId30)) {
        toast({
          id: toastId30,
          description: `ดาวน์โหลดสำเร็จ`,
          status: "success",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [exportSummaryBookingResultDetail.isSuccess, toast])

  useEffect(() => {
    if (exportSummaryBookingResultDetail.isError) {
      if (
        !toast.isActive(toastId29) &&
        get(exportSummaryBookingResultDetail, "error.status") !== 401
      ) {
        toast({
          id: toastId29,
          description: `${exportSummaryBookingResultDetail.error}`.includes(
            "400"
          )
            ? "ไม่พบจุดจอดนอกเส้นทาง"
            : `${get(exportSummaryBookingResultDetail, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [
    exportSummaryBookingResultDetail.isError,
    exportSummaryBookingResultDetail.error,
    toast,
  ])

  useEffect(() => {
    if (exportSummaryBookingResult.isSuccess) {
      if (!toast.isActive(toastId28)) {
        toast({
          id: toastId28,
          description: `ดาวน์โหลดสำเร็จ`,
          status: "success",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [exportSummaryBookingResult.isSuccess, toast])

  useEffect(() => {
    if (exportSummaryBookingResult.isError) {
      if (
        !toast.isActive(toastId27) &&
        get(exportSummaryBookingResult, "error.status") !== 401
      ) {
        toast({
          id: toastId27,
          description: `${get(exportSummaryBookingResult, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [
    exportSummaryBookingResult.isError,
    exportSummaryBookingResult.error,
    toast,
  ])

  useEffect(() => {
    if (exportEmployeeAttendance.isSuccess) {
      if (!toast.isActive(toastId26)) {
        toast({
          id: toastId26,
          description: `ดาวน์โหลดสำเร็จ`,
          status: "success",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [exportEmployeeAttendance.isSuccess, toast])

  useEffect(() => {
    if (exportEmployeeAttendance.isError) {
      if (
        !toast.isActive(toastId25) &&
        get(exportEmployeeAttendance, "error.status") !== 401
      ) {
        toast({
          id: toastId25,
          description: `${get(exportEmployeeAttendance, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [exportEmployeeAttendance.isError, exportEmployeeAttendance.error, toast])

  useEffect(() => {
    if (exportEmployeeAnnouncement.isSuccess) {
      if (!toast.isActive(toastId24)) {
        toast({
          id: toastId24,
          description: `ดาวน์โหลดสำเร็จ`,
          status: "success",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [exportEmployeeAnnouncement.isSuccess, toast])

  useEffect(() => {
    if (exportEmployeeAnnouncement.isError) {
      if (
        !toast.isActive(toastId23) &&
        get(exportEmployeeAnnouncement, "error.status") !== 401
      ) {
        toast({
          id: toastId23,
          description: `${get(exportEmployeeAnnouncement, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [
    exportEmployeeAnnouncement.isError,
    exportEmployeeAnnouncement.error,
    toast,
  ])

  useEffect(() => {
    if (sendEmailBookingResult.isSuccess) {
      if (!toast.isActive(toastId22)) {
        toast({
          id: toastId22,
          description: `กำลังส่งอีเมล`,
          status: "success",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [sendEmailBookingResult.isSuccess, toast])

  useEffect(() => {
    if (sendEmailBookingResult.isError) {
      if (
        !toast.isActive(toastId21) &&
        get(sendEmailBookingResult, "error.status") !== 401
      ) {
        toast({
          id: toastId21,
          description: `${get(sendEmailBookingResult, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [sendEmailBookingResult.isError, sendEmailBookingResult.error, toast])

  useEffect(() => {
    if (confirmArrangement.isSuccess) {
      if (!toast.isActive(toastId20)) {
        toast({
          id: toastId20,
          description: `ยืนยันการจัดรถสำเร็จ`,
          status: "success",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [confirmArrangement.isSuccess, toast])

  useEffect(() => {
    if (confirmArrangement.isError) {
      if (
        !toast.isActive(toastId19) &&
        get(confirmArrangement, "error.status") !== 401
      ) {
        toast({
          id: toastId19,
          description: `${get(confirmArrangement, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [confirmArrangement.isError, confirmArrangement.error, toast])

  useEffect(() => {
    if (cancelArrangement.isSuccess) {
      if (!toast.isActive(toastId18)) {
        toast({
          id: toastId18,
          description: `ยกเลิกการจัดรถสำเร็จ`,
          status: "success",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [cancelArrangement.isSuccess, toast])

  useEffect(() => {
    if (cancelArrangement.isError) {
      if (
        !toast.isActive(toastId17) &&
        get(cancelArrangement, "error.status") !== 401
      ) {
        toast({
          id: toastId17,
          description: `${get(cancelArrangement, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [cancelArrangement.isError, cancelArrangement.error, toast])

  useEffect(() => {
    if (reOpenBooking.isSuccess) {
      if (!toast.isActive(toastId16)) {
        toast({
          id: toastId16,
          description: `เปิดการจองสำเร็จ`,
          status: "success",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [reOpenBooking.isSuccess, toast])

  useEffect(() => {
    if (reOpenBooking.isError) {
      if (
        !toast.isActive(toastId15) &&
        get(reOpenBooking, "error.status") !== 401
      ) {
        toast({
          id: toastId15,
          description: `${get(reOpenBooking, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [reOpenBooking.isError, reOpenBooking.error, toast])

  useEffect(() => {
    if (mergeVehiclesDifferenceBusLine.isSuccess) {
      if (!toast.isActive(toastId14)) {
        toast({
          id: toastId14,
          description: `รวมรถสำเร็จ`,
          status: "success",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [mergeVehiclesDifferenceBusLine.isSuccess, toast])

  useEffect(() => {
    if (mergeVehiclesDifferenceBusLine.isError) {
      if (
        !toast.isActive(toastId13) &&
        get(mergeVehiclesDifferenceBusLine, "error.status") !== 401
      ) {
        toast({
          id: toastId13,
          description: `${get(
            mergeVehiclesDifferenceBusLine,
            "error.message"
          )}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [
    mergeVehiclesDifferenceBusLine.isError,
    mergeVehiclesDifferenceBusLine.error,
    toast,
  ])

  useEffect(() => {
    if (mergeVehiclesSameBusLine.isSuccess) {
      if (!toast.isActive(toastId11)) {
        toast({
          id: toastId11,
          description: `รวมรถสำเร็จ`,
          status: "success",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [mergeVehiclesSameBusLine.isSuccess, toast])

  useEffect(() => {
    if (mergeVehiclesSameBusLine.isError) {
      if (
        !toast.isActive(toastId10) &&
        get(mergeVehiclesSameBusLine, "error.status") !== 401
      ) {
        toast({
          id: toastId10,
          description: `${get(mergeVehiclesSameBusLine, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [mergeVehiclesSameBusLine.isError, mergeVehiclesSameBusLine.error, toast])

  useEffect(() => {
    if (deleteEmptyBookingVehicle.isSuccess) {
      if (!toast.isActive(toastId9)) {
        toast({
          id: toastId9,
          description: `ลบสำเร็จ`,
          status: "success",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [deleteEmptyBookingVehicle.isSuccess, toast])

  useEffect(() => {
    if (deleteEmptyBookingVehicle.isError) {
      if (
        !toast.isActive(toastId8) &&
        get(deleteEmptyBookingVehicle, "error.status") !== 401
      ) {
        toast({
          id: toastId8,
          description: `${get(deleteEmptyBookingVehicle, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [
    deleteEmptyBookingVehicle.isError,
    deleteEmptyBookingVehicle.error,
    toast,
  ])

  useEffect(() => {
    if (resetAutoResult.isSuccess) {
      if (!toast.isActive(toastId7)) {
        toast({
          id: toastId7,
          description: `คืนค่าเริ่มต้นสำเร็จ`,
          status: "success",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [resetAutoResult.isSuccess, toast])

  useEffect(() => {
    if (resetAutoResult.isError) {
      if (
        !toast.isActive(toastId6) &&
        get(resetAutoResult, "error.status") !== 401
      ) {
        toast({
          id: toastId6,
          description: `${get(resetAutoResult, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [resetAutoResult.isError, resetAutoResult.error, toast])

  useEffect(() => {
    if (closeBooking.isSuccess) {
      if (!toast.isActive(toastId5)) {
        toast({
          id: toastId5,
          description: `ปิดการจองสำเร็จ`,
          status: "success",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [closeBooking.isSuccess, toast])

  useEffect(() => {
    if (closeBooking.isError) {
      if (
        !toast.isActive(toastId4) &&
        get(closeBooking, "error.status") !== 401
      ) {
        toast({
          id: toastId4,
          description: `${get(closeBooking, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [closeBooking.isError, closeBooking.error, toast])

  useEffect(() => {
    if (busArrangement.error || busArrangement.data?.error) {
      if (
        !toast.isActive(toastId1) &&
        get(busArrangement, "error.status") !== 401
      ) {
        toast({
          id: toastId1,
          title: "busArrangement",
          description: busArrangement.data?.error?.message
            ? busArrangement.data?.error?.message
            : `${get(busArrangement, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
    if (busLines.error || busLines.data?.error) {
      if (!toast.isActive(toastId2) && get(busLines, "error.status") !== 401) {
        toast({
          id: toastId2,
          title: "busLine",
          description: busLines.data?.error?.message
            ? busLines.data?.error?.message
            : `${get(busLines, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
    if (schedule.error || schedule.data?.error) {
      if (!toast.isActive(toastId3) && get(schedule, "error.status") !== 401) {
        toast({
          id: toastId3,
          title: "schedule",
          description: schedule.data?.error?.message
            ? schedule.data?.error?.message
            : `${get(schedule, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
    if (vehicleTypes.error || vehicleTypes.data?.error) {
      if (
        !toast.isActive(toastId12) &&
        get(vehicleTypes, "error.status") !== 401
      ) {
        toast({
          id: toastId12,
          title: "vehicleTypes",
          description: vehicleTypes.data?.error?.message
            ? vehicleTypes.data?.error?.message
            : `${get(vehicleTypes, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [
    busArrangement.error,
    busArrangement.data?.error,
    busLines.error,
    busLines.data?.error,
    schedule.error,
    schedule.data?.error,
    vehicleTypes.error,
    vehicleTypes.data?.error,
    toast,
  ])

  if (
    (busArrangement.isLoading ||
      busLines.isLoading ||
      busLines.isFetching ||
      schedule.isLoading ||
      schedule.isFetching ||
      vehicleTypes.isLoading ||
      vehicleTypes.isFetching) &&
    !busArrangement.error &&
    !busLines.error &&
    !schedule.error &&
    !vehicleTypes.error
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
    <TabLayout index={1} periodOfDay="evening">
      <Edit
        data={busArrangement.data?.data}
        displayEmail={busArrangement.data?.displayEmail}
        isLoading={busArrangement.isLoading}
        rounds={
          busArrangement.data?.rounds
            ? busArrangement.data?.rounds
            : schedule.data?.rounds
        }
        busLines={
          busArrangement.data?.busLines
            ? busArrangement.data?.busLines
            : busLines.data?.data
        }
        periodOfDay="evening"
        onCloseBooking={closeBooking?.mutate}
        onReset={resetAutoResult?.mutate}
        isLoadingCloseBooking={
          closeBooking?.isLoading || busArrangement?.isFetching
        }
        isLoadingReset={
          resetAutoResult?.isLoading || busArrangement?.isFetching
        }
        deleteEmptyBookingVehicle={deleteEmptyBookingVehicle?.mutate}
        isLoadingDelete={
          deleteEmptyBookingVehicle?.isLoading || busArrangement?.isFetching
        }
        onMergeVehiclesSameBusLine={mergeVehiclesSameBusLine?.mutate}
        isLoadingMergeVehiclesSameBusLine={
          mergeVehiclesSameBusLine?.isLoading || busArrangement?.isFetching
        }
        onMergeVehiclesDifferenceBusLine={
          mergeVehiclesDifferenceBusLine?.mutate
        }
        isLoadingMergeVehiclesDifferenceBusLine={
          mergeVehiclesDifferenceBusLine?.isLoading ||
          busArrangement?.isFetching
        }
        vehicleTypes={vehicleTypes?.data?.data}
        cancelArrangement={cancelArrangement?.mutate}
        isLoadingCancelArrangement={
          cancelArrangement?.isLoading || busArrangement?.isFetching
        }
        confirmArrangement={confirmArrangement?.mutate}
        isLoadingConfirmArrangement={
          confirmArrangement?.isLoading || busArrangement?.isFetching
        }
        reOpenBookingRound={reOpenBooking?.mutate}
        isLoadingReOpenBookingRound={
          reOpenBooking?.isLoading || busArrangement?.isFetching
        }
        bookingStatus={busArrangement?.data?.bookingStatus}
        sendEmailBookingResult={sendEmailBookingResult?.mutate}
        isLoadingSendEmailBookingResult={
          sendEmailBookingResult?.isLoading || busArrangement?.isFetching
        }
        exportEmployeeAnnouncement={exportEmployeeAnnouncement?.mutate}
        exportEmployeeAttendance={exportEmployeeAttendance?.mutate}
        exportSummaryBookingResult={exportSummaryBookingResult?.mutate}
        exportSummaryBookingResultDetail={
          exportSummaryBookingResultDetail?.mutate
        }
        exportDaily={exportDaily?.mutate}
        isLoadingExportEmployeeAnnouncement={
          exportEmployeeAnnouncement?.isLoading
        }
        isLoadingExportEmployeeAttendance={exportEmployeeAttendance?.isLoading}
        isLoadingSummaryBookingResult={exportSummaryBookingResult?.isLoading}
        isLoadingSummaryBookingResultDetail={
          exportSummaryBookingResultDetail?.isLoading
        }
        isLoadingExportDaily={exportDaily?.isLoading}
      />
    </TabLayout>
  )
}

export default PlanningEdit
