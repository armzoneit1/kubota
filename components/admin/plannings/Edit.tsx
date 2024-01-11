/* eslint-disable react/no-children-prop */
import { useRouter } from "next/router"
import { useForm } from "react-hook-form"
import React, { useState, useEffect, useMemo } from "react"
import { Flex, Button, useDisclosure, Link, Text, Box } from "@chakra-ui/react"
import { AddIcon, DeleteIcon } from "@chakra-ui/icons"
import { MdEdit } from "react-icons/md"
import { BiCalendarX } from "react-icons/bi"
import { DataSheetGrid } from "../../react-datagrid-sheet/DataSheetGrid"
import { textColumn } from "../../react-datagrid-sheet/textColumn"
import { keyColumn } from "../../react-datagrid-sheet/keyColumn"
import ConfirmDialog from "../../ConfirmDialog"
import { PlanningIcon } from "../../Icon"
import MergeVehicleModal from "./MergeVehicleModal"
import { checkboxColumn } from "../../react-datagrid-sheet/checkboxColumnPlanning"
import filter from "lodash/filter"
import get from "lodash/get"
import uniqBy from "lodash/uniqBy"
import ReportModal from "./ReportModal"
import union from "lodash/union"
import {
  BusArrangementDataTypes,
  ListVehicleTypes,
} from "../../../data-hooks/busArrangements/types"
import { DateTime } from "luxon"
import NextLink from "next/link"

type PlanningEditProps = {
  data: BusArrangementDataTypes | undefined
  isLoading: boolean
  rounds: string[] | undefined
  busLines: any[] | undefined
  periodOfDay: "morning" | "evening"
  onReset: (values: any) => void
  isLoadingReset: boolean
  onCloseBooking: (values: any) => void
  isLoadingCloseBooking: boolean
  onSubmitOpenReservation?: (values: any) => void
  deleteEmptyBookingVehicle: (values: any) => void
  isLoadingDelete: boolean
  onMergeVehiclesSameBusLine: (values: any) => void
  isLoadingMergeVehiclesSameBusLine: boolean
  onMergeVehiclesDifferenceBusLine: (values: any) => void
  isLoadingMergeVehiclesDifferenceBusLine: boolean
  vehicleTypes: ListVehicleTypes[]
  confirmArrangement: (values: any) => void
  isLoadingConfirmArrangement: boolean
  cancelArrangement: (values: any) => void
  isLoadingCancelArrangement: boolean
  reOpenBookingRound: (values: any) => void
  isLoadingReOpenBookingRound: boolean
  bookingStatus: string
  sendEmailBookingResult: (values: any) => void
  isLoadingSendEmailBookingResult: boolean
  displayEmail: string
  exportEmployeeAnnouncement: (values: any) => void
  exportEmployeeAttendance: (values: any) => void
  exportSummaryBookingResult: (values: any) => void
  exportSummaryBookingResultDetail: (values: any) => void
  exportDaily: (values: any) => void
  isLoadingExportEmployeeAnnouncement: boolean
  isLoadingExportEmployeeAttendance: boolean
  isLoadingSummaryBookingResult: boolean
  isLoadingSummaryBookingResultDetail: boolean
  isLoadingExportDaily: boolean
}

const PlanningEdit = ({
  data: busArrangement,
  isLoading,
  rounds,
  busLines,
  periodOfDay,
  onSubmitOpenReservation,
  onReset,
  onCloseBooking,
  isLoadingCloseBooking,
  isLoadingReset,
  deleteEmptyBookingVehicle,
  isLoadingDelete,
  onMergeVehiclesSameBusLine,
  isLoadingMergeVehiclesSameBusLine,
  onMergeVehiclesDifferenceBusLine,
  isLoadingMergeVehiclesDifferenceBusLine,
  vehicleTypes,
  cancelArrangement,
  confirmArrangement,
  isLoadingCancelArrangement,
  isLoadingConfirmArrangement,
  isLoadingReOpenBookingRound,
  reOpenBookingRound,
  bookingStatus,
  sendEmailBookingResult,
  isLoadingSendEmailBookingResult,
  displayEmail,
  exportEmployeeAnnouncement,
  exportEmployeeAttendance,
  exportSummaryBookingResult,
  exportSummaryBookingResultDetail,
  exportDaily,
  isLoadingExportEmployeeAnnouncement,
  isLoadingExportEmployeeAttendance,
  isLoadingSummaryBookingResult,
  isLoadingSummaryBookingResultDetail,
  isLoadingExportDaily,
}: PlanningEditProps) => {
  const router = useRouter()
  const id = router?.query?.id
  const status = get(busArrangement, "status")
  const [data, setData] = useState<any[]>([])
  const [viewHeight, setViewHeight] = useState(0)
  const [isOpenMergeModal, setOpenMergeModal] = useState(false)
  const [isOpenDeleteModal, setOpenDeleteModal] = useState(false)
  const [isOpenConfirmModal, setOpenConfirmModal] = useState(false)
  const [isOpenCancelModal, setOpenCancelModal] = useState(false)
  const [isOpenReportModal, setOpenReportModal] = useState(false)
  const [isOpenEmailModal, setOpenEmailModal] = useState(false)
  const [isOpenReservationModal, setOpenReservationModal] = useState(false)
  const [selected, setSelected] = useState<any[]>([])
  const [isDiffBusLine, setIsDiffBusLine] = useState(false)
  const { isOpen, onClose, onOpen, onToggle } = useDisclosure()

  const vehicleTypeOptions = useMemo(
    () =>
      vehicleTypes
        ? vehicleTypes.map((vehicle) => ({
            value: vehicle.id,
            label: `${vehicle.vehicleTypeName} / ${vehicle.seatCapacity} ที่นั่ง (${vehicle.transportationProviderName})`,
            seatCapacity: vehicle.seatCapacity,
          }))
        : [],
    [vehicleTypes]
  )

  useEffect(() => {
    if (status === "close" && busLines) setData(busLines)
    else if (status === "open" && busLines) {
      const mappingBusLines = busLines.map((busLine) => ({
        id: busLine.id,
        name: busLine.name,
      }))
      setData(mappingBusLines)
    }
    setSelected([])
  }, [busLines, status])

  const onCloseMergeModal = () => {
    setOpenMergeModal(false)
  }

  const onCloseDeleteModal = () => {
    setOpenDeleteModal(false)
  }
  const onOpenDeleteModal = () => {
    setOpenDeleteModal(true)
  }

  const onCloseReservationModal = () => {
    setOpenReservationModal(false)
  }
  const onOpenReservationModal = () => {
    setOpenReservationModal(true)
  }

  const onCloseConfirmModal = () => {
    setOpenConfirmModal(false)
  }
  const onCloseCancelModal = () => {
    setOpenCancelModal(false)
  }
  const onCloseReportModal = () => {
    setOpenReportModal(false)
  }
  const onCloseEmailModal = () => {
    setOpenEmailModal(false)
  }

  useEffect(() => {
    setViewHeight(window.innerHeight)
  }, [])

  useEffect(() => {
    const areas = selected.map((s) => s.busLineName)
    setIsDiffBusLine(union(areas).length > 1)
  }, [selected])

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    control,
  } = useForm()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSelectedCar = (newSelected: any) => {
    const hasData = filter(selected, {
      bookingVehicleId: newSelected?.bookingVehicleId,
    })

    if (!(hasData.length > 0)) {
      setSelected((prevState) => [...prevState, newSelected])
    } else {
      const filteredData: any[] = filter(selected, (value: any) => {
        return value?.bookingVehicleId !== newSelected.bookingVehicleId
      })

      setSelected([...filteredData])
    }
  }

  const roundColumns = useMemo(
    () =>
      rounds
        ? rounds.map((round) => {
            return {
              ...keyColumn(
                round,
                checkboxColumn({
                  selected: selected,
                  setSelected: handleSelectedCar,
                  isConfirm: bookingStatus === "completed",
                  periodOfDay,
                })
              ),
              title: `${round}น.`,
              minWidth: 375,
            }
          })
        : [],
    [rounds, handleSelectedCar, selected, bookingStatus, periodOfDay]
  )

  const columns = useMemo(
    () => [
      {
        ...keyColumn("name", textColumn({ placeholder: "", disabled: true })),
        title: "สายรถ",
        minWidth: 175,
      },
      ...roundColumns,
    ],
    [roundColumns]
  )

  function onSubmit(values: any) {
    return new Promise((resolve) => {
      setTimeout(() => {
        alert(JSON.stringify(values, null, 2))
        resolve(values)
      }, 3000)
    })
  }

  const handleSetData = (data: any) => {
    setData(data)
  }

  return (
    <>
      <ConfirmDialog
        title="ปิดการจองรถ"
        content={`คุณยืนยันการปิดการจอง วันที่ ${DateTime.fromJSDate(
          new Date(`${busArrangement?.date}`)
        ).toFormat("dd/MM/y")} ${
          periodOfDay === "morning" ? "รอบไป" : "รอบกลับ"
        } ใช่หรือไม่ ?`}
        type="primary"
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={() => {
          onCloseBooking({
            scheduleId: busArrangement?.scheduleId,
            periodOfDay: busArrangement?.periodOfDay,
            onClose: onClose,
          })
        }}
        isLoading={isLoadingCloseBooking}
      />
      <ConfirmDialog
        title="ลบรถ"
        content={
          selected.length > 1
            ? `คุณยืนยันการลบรถที่เลือก ใช่หรือไม่ ?`
            : `คุณยืนยันการลบรถ สาย${selected[0]?.busLineName} เวลา ${selected[0]?.time}น. ${selected[0]?.vehicleTypeName} (${selected[0]?.passengers.length}/${selected[0]?.seatCapacity}) ใช่หรือไม่ ?`
        }
        type="error"
        isOpen={isOpenDeleteModal}
        onClose={onCloseDeleteModal}
        onSubmit={() => {
          deleteEmptyBookingVehicle({
            scheduleId: id,
            periodOfDay: periodOfDay,
            bookingVehicleIds: selected.map((s) => s.bookingVehicleId),
            from: "list",
            onClose: onCloseDeleteModal,
          })
        }}
        isLoading={isLoadingDelete}
      />
      <ConfirmDialog
        title="ยืนยันการจัดรถ"
        content={`คุณยืนยันการการจัดรถของวันที่ ${DateTime.fromJSDate(
          new Date(`${busArrangement?.date}`)
        ).toFormat("dd/MM/y")} ${
          periodOfDay === "morning" ? "รอบไป" : "รอบกลับ"
        } ใช่หรือไม่ ?`}
        isOpen={isOpenConfirmModal}
        onClose={onCloseConfirmModal}
        onSubmit={() => {
          confirmArrangement({
            onClose: onCloseConfirmModal,
            scheduleId: id,
            periodOfDay,
          })
        }}
        isLoading={isLoadingConfirmArrangement}
      />
      <ConfirmDialog
        title="ยกเลิกการจัดรถ"
        content={`คุณต้องการยกเลิกการจัดรถของวันที่ ${DateTime.fromJSDate(
          new Date(`${busArrangement?.date}`)
        ).toFormat("dd/MM/y")} ${
          periodOfDay === "morning" ? "รอบไป" : "รอบกลับ"
        } ใช่หรือไม่ ?`}
        isOpen={isOpenCancelModal}
        onClose={onCloseCancelModal}
        onSubmit={() => {
          cancelArrangement({
            onClose: onCloseCancelModal,
            scheduleId: id,
            periodOfDay,
          })
        }}
        isLoading={isLoadingCancelArrangement}
      />
      <ConfirmDialog
        title="ยืนยันการส่งอีเมล"
        content={`คุณยืนยันการส่งอีเมลให้ผู้ใช้บริการของวันที่ ${DateTime.fromJSDate(
          new Date(`${busArrangement?.date}`)
        ).toFormat("dd/MM/y")} ${
          periodOfDay === "morning" ? "รอบไป" : "รอบกลับ"
        } ใช่หรือไม่ ?`}
        isOpen={isOpenEmailModal}
        onClose={onCloseEmailModal}
        isLoading={isLoadingSendEmailBookingResult}
        onSubmit={() => {
          sendEmailBookingResult({
            scheduleId: id,
            periodOfDay,
            onClose: onCloseEmailModal,
          })
        }}
      />
      <ConfirmDialog
        title="ยืนยันการเปิดการจองรถ"
        content={`คุณยืนยันการเปิดการจองรถของวันที่ ${DateTime.fromJSDate(
          new Date(`${busArrangement?.date}`)
        ).toFormat("dd/MM/y")} ${
          periodOfDay === "morning" ? "รอบไป" : "รอบกลับ"
        } ใช่หรือไม่ ?`}
        isOpen={isOpenReservationModal}
        onClose={onCloseReservationModal}
        onSubmit={() => {
          reOpenBookingRound({
            onClose: onCloseReservationModal,
            scheduleId: id,
            periodOfDay,
          })
        }}
        isLoading={isLoadingReOpenBookingRound}
      />
      <MergeVehicleModal
        isOpen={isOpenMergeModal}
        onClose={onCloseMergeModal}
        vehicleSelected={selected}
        isDiffBusLine={isDiffBusLine}
        onMergeVehiclesSameBusLine={onMergeVehiclesSameBusLine}
        onMergeVehiclesDifferenceBusLine={onMergeVehiclesDifferenceBusLine}
        isLoadingMergeVehiclesSameBusLine={isLoadingMergeVehiclesSameBusLine}
        isLoadingMergeVehiclesDifferenceBusLine={
          isLoadingMergeVehiclesDifferenceBusLine
        }
        vehicleTypeOptions={vehicleTypeOptions}
        periodOfDay={periodOfDay}
        scheduleId={id}
        timeTableRoundId={
          busArrangement?.arrangements?.timeTableRounds[0]?.timeTableRoundId
            ? busArrangement?.arrangements?.timeTableRounds[0]?.timeTableRoundId
            : null
        }
      />
      <ReportModal
        isOpen={isOpenReportModal}
        onClose={onCloseReportModal}
        exportEmployeeAnnouncement={exportEmployeeAnnouncement}
        exportEmployeeAttendance={exportEmployeeAttendance}
        exportSummaryBookingResult={exportSummaryBookingResult}
        exportSummaryBookingResultDetail={exportSummaryBookingResultDetail}
        exportDaily={exportDaily}
        isLoadingExportEmployeeAnnouncement={
          isLoadingExportEmployeeAnnouncement
        }
        isLoadingExportEmployeeAttendance={isLoadingExportEmployeeAttendance}
        isLoadingSummaryBookingResult={isLoadingSummaryBookingResult}
        isLoadingSummaryBookingResultDetail={
          isLoadingSummaryBookingResultDetail
        }
        isLoadingExportDaily={isLoadingExportDaily}
        scheduleId={id}
        periodOfDay={periodOfDay}
        date={busArrangement?.date}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Flex flexDirection="column">
          {busArrangement && status && status === "open" && (
            <Flex mb={{ base: 4, md: 12 }}>
              <Button
                colorScheme="error"
                variant="outline"
                mr={4}
                leftIcon={<BiCalendarX />}
                onClick={onOpen}
                _focus={{ boxShadow: "none" }}
              >
                ปิดการจองรถ
              </Button>
              <NextLink
                href={`/admin/plannings/${id}/${periodOfDay}/editSchedule`}
                passHref
              >
                <Link _hover={{}} _focus={{}}>
                  <Button
                    variant="outline"
                    leftIcon={<MdEdit />}
                    _focus={{ boxShadow: "none" }}
                  >
                    เปลี่ยนรอบจัดรถ
                  </Button>
                </Link>
              </NextLink>
            </Flex>
          )}
          {busArrangement &&
            status &&
            status === "close" &&
            !(bookingStatus === "completed") && (
              <Flex
                mb={{ base: 4, md: 12 }}
                flexDirection={{ base: "column", md: "row" }}
              >
                <Flex mb={{ base: 4, md: 0 }}>
                  <Button
                    mr={4}
                    variant="outline"
                    leftIcon={<PlanningIcon />}
                    onClick={() => {
                      setOpenMergeModal(true)
                    }}
                    _focus={{ boxShadow: "none" }}
                    isDisabled={
                      !(selected?.length > 1) ||
                      uniqBy([...selected], "time").length > 1
                    }
                    _disabled={{
                      color: "#33333399",
                      fill: "#33333399",
                      cursor: "not-allowed",
                    }}
                  >
                    รวมรถ
                  </Button>
                  <NextLink
                    href={`/admin/plannings/${id}/${periodOfDay}/${busArrangement?.arrangements?.timeTableRounds[0]?.timeTableRoundId}/addVehicle`}
                    passHref
                  >
                    <Link _hover={{}} _focus={{}}>
                      <Button
                        variant="outline"
                        mr={4}
                        leftIcon={<AddIcon />}
                        _focus={{ boxShadow: "none" }}
                      >
                        เพิ่มรถ
                      </Button>
                    </Link>
                  </NextLink>
                  <Button
                    variant="outline"
                    colorScheme="error"
                    mr={4}
                    leftIcon={<DeleteIcon />}
                    _focus={{ boxShadow: "none" }}
                    onClick={onOpenDeleteModal}
                    isDisabled={
                      selected.length === 0 ||
                      filter(selected, (v) => v.passengers.length > 0).length >
                        0
                    }
                    _disabled={{
                      color: "#33333399",
                      fill: "#33333399",
                      cursor: "not-allowed",
                    }}
                  >
                    ลบรถ
                  </Button>
                </Flex>
                <Flex>
                  <Button
                    variant="outline"
                    mr={4}
                    leftIcon={
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M19.0714 3.625H17.1429V1.49219C17.1429 1.22038 16.927 1 16.6607 1H15.0536C14.7873 1 14.5714 1.22038 14.5714 1.49219V3.625H9.42857V1.49219C9.42857 1.22038 9.21269 1 8.94643 1H7.33929C7.07302 1 6.85714 1.22038 6.85714 1.49219V3.625H4.92857C3.86344 3.625 3 4.50643 3 5.59375V20.0312C3 21.1186 3.86344 22 4.92857 22H19.0714C20.1366 22 21 21.1186 21 20.0312V5.59375C21 4.50643 20.1366 3.625 19.0714 3.625ZM18.8304 20.0312H5.16964C5.10571 20.0312 5.04439 20.0053 4.99918 19.9592C4.95397 19.913 4.92857 19.8504 4.92857 19.7852V7.5625H19.0714V19.7852C19.0714 19.8504 19.046 19.913 19.0008 19.9592C18.9556 20.0053 18.8943 20.0312 18.8304 20.0312ZM16.707 11.8015L10.9892 17.5916C10.8001 17.783 10.4949 17.7818 10.3073 17.5888L7.29027 14.484C7.10275 14.291 7.10396 13.9794 7.293 13.7879L8.20582 12.8636C8.39486 12.6721 8.70013 12.6734 8.88765 12.8664L10.6597 14.69L15.1224 10.1708C15.3114 9.97943 15.6167 9.98066 15.8043 10.1736L16.7097 11.1054C16.8972 11.2984 16.896 11.61 16.707 11.8015Z"
                          fill="currentColor"
                        />
                      </svg>
                    }
                    _focus={{ boxShadow: "none" }}
                    color="#333333"
                    onClick={onOpenReservationModal}
                  >
                    เปิดการจองรถ
                  </Button>
                  <Button
                    variant="outline"
                    mr={4}
                    leftIcon={
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M13.9416 4.05908C13.2075 3.31924 12.3163 2.75355 11.3339 2.40379C10.3516 2.05403 9.30305 1.92913 8.26585 2.03831C5.05132 2.36199 2.40612 4.96887 2.047 8.17936C1.56526 12.4221 4.84987 16 8.99285 16C10.3155 16 11.6111 15.6252 12.729 14.919C13.8468 14.2129 14.7412 13.2045 15.308 12.0109C15.5883 11.4248 15.1679 10.7512 14.5197 10.7512C14.1957 10.7512 13.8891 10.9262 13.749 11.2149C13.2404 12.3075 12.3706 13.1919 11.2859 13.7193C10.2011 14.2466 8.96762 14.3847 7.79287 14.1104C5.84839 13.6818 4.28053 12.0984 3.86886 10.1564C3.69581 9.38855 3.69782 8.59167 3.87473 7.82471C4.05164 7.05775 4.39892 6.34032 4.8909 5.72549C5.38288 5.11067 6.00696 4.61417 6.71698 4.27272C7.42701 3.93128 8.2048 3.75363 8.99285 3.75291C10.4468 3.75291 11.7432 4.35651 12.6891 5.31004L11.3665 6.63097C10.8147 7.18209 11.2001 8.12687 11.9796 8.12687H15.1241C15.6058 8.12687 16 7.73321 16 7.25208V4.11157C16 3.33301 15.054 2.93935 14.5022 3.49047L13.9416 4.05908Z"
                          fill="currentColor"
                        />
                      </svg>
                    }
                    _focus={{ boxShadow: "none" }}
                    color="#333333"
                    isLoading={isLoadingReset}
                    onClick={() => {
                      onReset({
                        scheduleId: busArrangement?.scheduleId,
                        periodOfDay: busArrangement?.periodOfDay,
                      })
                    }}
                  >
                    ค่าเริ่มต้น
                  </Button>
                  <Button
                    leftIcon={
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M8 12L11 15L16 10"
                          stroke="#F9F9F9"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M3 12C3 10.8181 3.23279 9.64778 3.68508 8.55585C4.13738 7.46392 4.80031 6.47177 5.63604 5.63604C6.47177 4.80031 7.46392 4.13738 8.55585 3.68508C9.64778 3.23279 10.8181 3 12 3C13.1819 3 14.3522 3.23279 15.4442 3.68508C16.5361 4.13738 17.5282 4.80031 18.364 5.63604C19.1997 6.47177 19.8626 7.46392 20.3149 8.55585C20.7672 9.64778 21 10.8181 21 12C21 14.3869 20.0518 16.6761 18.364 18.364C16.6761 20.0518 14.3869 21 12 21C9.61305 21 7.32387 20.0518 5.63604 18.364C3.94821 16.6761 3 14.3869 3 12V12Z"
                          stroke="#F9F9F9"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    }
                    _focus={{ boxShadow: "none" }}
                    onClick={() => {
                      setOpenConfirmModal(true)
                    }}
                    isDisabled={!busArrangement?.arrangements}
                  >
                    ยืนยันการจัดรถ
                  </Button>
                </Flex>
              </Flex>
            )}
          {bookingStatus === "completed" && (
            <Flex
              justifyContent="space-between"
              flexDirection={{ base: "column", md: "row" }}
            >
              <Flex mb={{ base: 4, md: 12 }} flexWrap="wrap">
                <Button
                  mr={4}
                  leftIcon={
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2.5 3.5C2.5 3.10218 2.65804 2.72064 2.93934 2.43934C3.22064 2.15804 3.60218 2 4 2H16C16.3978 2 16.7794 2.15804 17.0607 2.43934C17.342 2.72064 17.5 3.10218 17.5 3.5V22H4C3.60218 22 3.22064 21.842 2.93934 21.5607C2.65804 21.2794 2.5 20.8978 2.5 20.5V3.5Z"
                        stroke="#F9F9F9"
                        strokeWidth="2"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M17.5 12C17.5 11.7348 17.6054 11.4804 17.7929 11.2929C17.9804 11.1054 18.2348 11 18.5 11H20.5C20.7652 11 21.0196 11.1054 21.2071 11.2929C21.3946 11.4804 21.5 11.7348 21.5 12V20.5C21.5 20.8978 21.342 21.2794 21.0607 21.5607C20.7794 21.842 20.3978 22 20 22H17.5V12Z"
                        stroke="#F9F9F9"
                        strokeWidth="2"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M5.5 6H9.5"
                        stroke="#F9F9F9"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M5.5 9.5H11.5"
                        stroke="#F9F9F9"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  }
                  _focus={{ boxShadow: "none" }}
                  onClick={() => {
                    setOpenReportModal(true)
                  }}
                >
                  รายงาน
                </Button>
                <Button
                  mr={4}
                  leftIcon={
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M15 3H3C2.175 3 1.5075 3.675 1.5075 4.5L1.5 13.5C1.5 14.325 2.175 15 3 15H15C15.825 15 16.5 14.325 16.5 13.5V4.5C16.5 3.675 15.825 3 15 3ZM14.7 6.1875L9.3975 9.5025C9.1575 9.6525 8.8425 9.6525 8.6025 9.5025L3.3 6.1875C3.2248 6.14528 3.15894 6.08825 3.10642 6.01984C3.05389 5.95143 3.0158 5.87308 2.99443 5.78953C2.97307 5.70597 2.96888 5.61895 2.98212 5.53373C2.99536 5.44851 3.02575 5.36686 3.07146 5.29373C3.11717 5.22059 3.17724 5.15749 3.24804 5.10825C3.31885 5.059 3.3989 5.02463 3.48337 5.00722C3.56784 4.98981 3.65496 4.98973 3.73947 5.00696C3.82397 5.0242 3.9041 5.0584 3.975 5.1075L9 8.25L14.025 5.1075C14.0959 5.0584 14.176 5.0242 14.2605 5.00696C14.345 4.98973 14.4322 4.98981 14.5166 5.00722C14.6011 5.02463 14.6812 5.059 14.752 5.10825C14.8228 5.15749 14.8828 5.22059 14.9285 5.29373C14.9742 5.36686 15.0046 5.44851 15.0179 5.53373C15.0311 5.61895 15.0269 5.70597 15.0056 5.78953C14.9842 5.87308 14.9461 5.95143 14.8936 6.01984C14.8411 6.08825 14.7752 6.14528 14.7 6.1875Z"
                        fill="#F9F9F9"
                      />
                    </svg>
                  }
                  _focus={{ boxShadow: "none" }}
                  onClick={() => {
                    setOpenEmailModal(true)
                  }}
                >
                  ส่งอีเมล
                </Button>
                <NextLink
                  href={`/admin/plannings/${id}/${periodOfDay}/information`}
                  passHref
                >
                  <Link _focus={{}} _hover={{}}>
                    <Button
                      variant="outline"
                      mr={4}
                      leftIcon={
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M5.4 21V17.6143H3.2V21H1V11.9715C1 11.6722 1.11589 11.3851 1.32218 11.1735C1.52847 10.9618 1.80826 10.8429 2.1 10.8429C2.39174 10.8429 2.67153 10.9618 2.87782 11.1735C3.08411 11.3851 3.2 11.6722 3.2 11.9715V15.3572H6.5C6.79174 15.3572 7.07153 15.4761 7.27782 15.6877C7.48411 15.8994 7.6 16.1864 7.6 16.4857V21H5.4ZM20.8 8.58581V21H19.7V8.58581C19.0323 8.44597 18.4389 8.05675 18.035 7.49359C17.6311 6.93044 17.4454 6.23348 17.5139 5.53783C17.5824 4.84218 17.9002 4.19741 18.4058 3.72851C18.9113 3.25961 19.5685 3 20.25 3C20.9315 3 21.5887 3.25961 22.0942 3.72851C22.5998 4.19741 22.9176 4.84218 22.9861 5.53783C23.0546 6.23348 22.8689 6.93044 22.465 7.49359C22.061 8.05675 21.4677 8.44597 20.8 8.58581ZM15.3 9.20652V14.2286H14.2V21H12.55V15.3572H11.45V21H9.8V14.2286H8.7V9.15009C8.7 8.70112 8.87384 8.27054 9.18327 7.95307C9.49271 7.6356 9.91239 7.45725 10.35 7.45725H13.65C14.0876 7.45725 14.5073 7.6356 14.8167 7.95307C15.1262 8.27054 15.3 8.70112 15.3 9.15009V9.20652ZM12 3.56371C11.6714 3.56389 11.3503 3.66476 11.0778 3.85339C10.8054 4.04202 10.5941 4.30981 10.471 4.62244C10.3479 4.93507 10.3186 5.27829 10.3869 5.60811C10.4551 5.93794 10.6178 6.23934 10.8541 6.47368C11.0904 6.70803 11.3895 6.86464 11.7131 6.92345C12.0367 6.98225 12.3701 6.94058 12.6705 6.80375C12.9708 6.66693 13.2245 6.4412 13.3991 6.15549C13.5736 5.86978 13.661 5.53711 13.65 5.20012C13.65 4.75115 13.4762 4.32057 13.1667 4.0031C12.8573 3.68563 12.4376 3.50728 12 3.50728V3.56371Z"
                            fill="#00A5A8"
                          />
                        </svg>
                      }
                      _focus={{ boxShadow: "none" }}
                    >
                      ข้อมูลเพิ่มเติม
                    </Button>
                  </Link>
                </NextLink>

                <Button
                  variant="outline"
                  borderColor="#333333"
                  color="#333333"
                  leftIcon={
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 2C10.0222 2 8.08879 2.58649 6.4443 3.6853C4.79981 4.78412 3.51809 6.3459 2.76121 8.17317C2.00433 10.0004 1.8063 12.0111 2.19215 13.9509C2.578 15.8907 3.53041 17.6725 4.92894 19.0711C6.32746 20.4696 8.10929 21.422 10.0491 21.8079C11.9889 22.1937 13.9996 21.9957 15.8268 21.2388C17.6541 20.4819 19.2159 19.2002 20.3147 17.5557C21.4135 15.9112 22 13.9778 22 12C22 10.6868 21.7413 9.38642 21.2388 8.17317C20.7363 6.95991 19.9997 5.85752 19.0711 4.92893C18.1425 4.00035 17.0401 3.26375 15.8268 2.7612C14.6136 2.25866 13.3132 2 12 2ZM12 20C10.4178 20 8.87104 19.5308 7.55544 18.6518C6.23985 17.7727 5.21447 16.5233 4.60897 15.0615C4.00347 13.5997 3.84504 11.9911 4.15372 10.4393C4.4624 8.88743 5.22433 7.46197 6.34315 6.34315C7.46197 5.22433 8.88743 4.4624 10.4393 4.15372C11.9911 3.84504 13.5997 4.00346 15.0615 4.60896C16.5233 5.21447 17.7727 6.23984 18.6518 7.55544C19.5308 8.87103 20 10.4177 20 12C20 14.1217 19.1572 16.1566 17.6569 17.6569C16.1566 19.1571 14.1217 20 12 20Z"
                        fill="#333333"
                      />
                      <path
                        d="M15.6064 8.39364C15.4827 8.26891 15.3355 8.16991 15.1733 8.10235C15.0111 8.03478 14.8372 8 14.6615 8C14.4858 8 14.3119 8.03478 14.1497 8.10235C13.9876 8.16991 13.8404 8.26891 13.7167 8.39364L12 10.1236L10.2833 8.39364C10.0327 8.14305 9.69286 8.00227 9.33848 8.00227C8.98409 8.00227 8.64422 8.14305 8.39364 8.39364C8.14305 8.64422 8.00227 8.98409 8.00227 9.33848C8.00227 9.69286 8.14305 10.0327 8.39364 10.2833L10.1236 12L8.39364 13.7167C8.26891 13.8404 8.16991 13.9876 8.10235 14.1497C8.03478 14.3119 8 14.4858 8 14.6615C8 14.8372 8.03478 15.0111 8.10235 15.1733C8.16991 15.3355 8.26891 15.4827 8.39364 15.6064C8.51735 15.7311 8.66453 15.8301 8.8267 15.8977C8.98886 15.9652 9.1628 16 9.33848 16C9.51415 16 9.68809 15.9652 9.85026 15.8977C10.0124 15.8301 10.1596 15.7311 10.2833 15.6064L12 13.8764L13.7167 15.6064C13.8404 15.7311 13.9876 15.8301 14.1497 15.8977C14.3119 15.9652 14.4858 16 14.6615 16C14.8372 16 15.0111 15.9652 15.1733 15.8977C15.3355 15.8301 15.4827 15.7311 15.6064 15.6064C15.7311 15.4827 15.8301 15.3355 15.8977 15.1733C15.9652 15.0111 16 14.8372 16 14.6615C16 14.4858 15.9652 14.3119 15.8977 14.1497C15.8301 13.9876 15.7311 13.8404 15.6064 13.7167L13.8764 12L15.6064 10.2833C15.7311 10.1596 15.8301 10.0124 15.8977 9.85026C15.9652 9.68809 16 9.51415 16 9.33848C16 9.1628 15.9652 8.98886 15.8977 8.8267C15.8301 8.66453 15.7311 8.51735 15.6064 8.39364Z"
                        fill="#333333"
                      />
                    </svg>
                  }
                  _focus={{ boxShadow: "none" }}
                  onClick={() => {
                    setOpenCancelModal(true)
                  }}
                >
                  ยกเลิกการจัดรถ
                </Button>
              </Flex>
              {displayEmail && (
                <Flex alignItems="center" height="40px">
                  <Text fontWeight={300} color="#33333399" fontStyle="italic">
                    {`${displayEmail}`}
                  </Text>
                </Flex>
              )}
            </Flex>
          )}
          <DataSheetGrid
            data={data ? data : []}
            onChange={handleSetData}
            columns={columns}
            lockRows
            rowHeight={72}
            headerRowHeight={40}
            height={viewHeight * 0.7}
          />
        </Flex>
      </form>
    </>
  )
}

export default PlanningEdit
