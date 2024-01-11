/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/display-name */
/* eslint-disable react/no-children-prop */
import { useMemo, useEffect, useState } from "react"
import { Box, Flex, Button, Text, Link } from "@chakra-ui/react"
import Table from "../../Table"
import { useForm, Controller } from "react-hook-form"
import { BusLineDataTypes } from "../../../data-hooks/busLines/types"
import TableLoading from "../../TableLoading"
import { DateTime } from "luxon"
import SelectInput from "../../input/SelectInput"
import filter from "lodash/filter"
import { Option } from "../../../data-hooks/schedules/getListYear"
import NextLink from "next/link"
import { AddIcon } from "@chakra-ui/icons"
import ConfirmDialog from "../../ConfirmDialog"

enum DayTypes {
  workday = "วันทำงาน",
  saturdayWorkday = "วันเสาร์ทำงาน",
  publicHoliday = "วันหยุด",
  other = "อื่นๆ",
  weekend = "วันเสาร์-อาทิตย์",
}

type ScheduleListProps = {
  setPage?: React.Dispatch<React.SetStateAction<number>>
  setSearch?: React.Dispatch<React.SetStateAction<string>>
  setYear?: React.Dispatch<React.SetStateAction<string>>
  setMonth?: React.Dispatch<React.SetStateAction<string>>
  setSort?: React.Dispatch<
    React.SetStateAction<{ id: string; desc: boolean | undefined } | undefined>
  >
  sortBy: { id: string; desc: boolean | undefined } | undefined
  search?: string
  pageCount?: number
  data: BusLineDataTypes[] | undefined
  isLoading: boolean
  currentPage?: number
  day: "all" | "saturdayWorkday" | "publicHoliday" | "other" | "weekend"
  listYears: Option
  hasCheckbox?: boolean
  onDelete?: (values: any) => void
  copy?: (values: any) => void
}

const monthOptions = [
  { value: "1", label: "มกราคม" },
  { value: "2", label: "กุมภาพันธ์" },
  { value: "3", label: "มีนาคม" },
  { value: "4", label: "เมษายน" },
  { value: "5", label: "พฤษภาคม" },
  { value: "6", label: "มิถุนายน" },
  { value: "7", label: "กรกฎาคม" },
  { value: "8", label: "สิงหาคม" },
  { value: "9", label: "กันยายน" },
  { value: "10", label: "ตุลาคม" },
  { value: "11", label: "พฤศจิกายน" },
  { value: "12", label: "ธันวาคม" },
]

const ScheduleList = ({
  setPage,
  data,
  pageCount,
  setYear,
  setMonth,
  isLoading,
  currentPage,
  setSort,
  sortBy,
  day,
  listYears,
  hasCheckbox,
  onDelete,
  copy,
}: ScheduleListProps) => {
  const [selected, setSelected] = useState<any[]>([])
  const [isOpen, setOpen] = useState(false)
  const [isOpenCopy, setOpenCopy] = useState(false)
  const currentMonth = new Date().getMonth() + 1
  const currentYear = new Date().getFullYear()

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    control,
    watch,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      year: { value: `${currentYear}`, label: `${currentYear}` },
      month: filter(monthOptions, (v) => v.value === `${currentMonth}`)[0],
    },
  })

  const watchYear = watch("year")
  const watchMonth = watch("month")

  useEffect(() => {
    if (setYear && watchYear?.value) setYear(`${watchYear?.value}`)
  }, [watchYear, setYear])
  useEffect(() => {
    if (setMonth && watchMonth?.value) setMonth(`${watchMonth?.value}`)
  }, [watchMonth, setMonth])

  const handleSetSelected = (selected: any[]) => {
    setSelected(selected)
  }

  const onOpen = () => {
    setOpen(true)
  }
  const onClose = () => {
    setOpen(false)
  }
  const onOpenCopy = () => {
    setOpenCopy(true)
  }
  const onCloseCopy = () => {
    setOpenCopy(false)
  }

  const columns = useMemo(
    () => [
      {
        Header: "วัน/เดือน/ปี",
        accessor: "date",
        Cell: ({ value }: any) =>
          DateTime.fromJSDate(new Date(value)).toFormat("dd/MM/y (ccc)", {
            locale: "th",
          }),
      },
      {
        Header: "รอบไป",
        accessor: "timeTableMorning.name",
        Cell: ({ value, row }: any) => (
          <Flex alignItems="center">
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="6"
                cy="6"
                r="6"
                fill={
                  row.original.isMorningOpenForBooking ? "#2CBF4C" : "#C4C4C4"
                }
              />
            </svg>

            <Text ml={4}>{value}</Text>
          </Flex>
        ),
      },

      {
        Header: "รอบกลับ",
        accessor: "timeTableEvening.name",
        Cell: ({ value, row }: any) => (
          <Flex alignItems="center">
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="6"
                cy="6"
                r="6"
                fill={
                  row.original.isEveningOpenForBooking ? "#2CBF4C" : "#C4C4C4"
                }
              />
            </svg>

            <Text ml={{ base: 2, md: 4 }}>{value}</Text>
          </Flex>
        ),
      },
      {
        Header: "ประเภท",
        accessor: "dayType",
        Cell: ({
          value,
        }: {
          value: "workday" | "saturdayWorkday" | "other" | "publicHoliday"
        }) => `${DayTypes[value]}`,
      },
      {
        Header: "รายละเอียด",
        accessor: "detail",
        Cell: ({ value }: any) => (value ? value : "-"),
      },
    ],
    []
  )

  return (
    <>
      {day !== "all" && (
        <ConfirmDialog
          isOpen={isOpen}
          onClose={onClose}
          type="error"
          title={"ลบข้อมูล"}
          content={
            selected.length > 1
              ? `คุณยืนยันการลบข้อมูลของวันที่เลือกใช่หรือไม่ ?`
              : `คุณยืนยันการลบข้อมูลของวันที่  ${DateTime.fromJSDate(
                  new Date(selected[0]?.date)
                ).toFormat("dd/MM/y")} ใช่หรือไม่ ?`
          }
          acceptLabel="ลบ"
          onSubmit={() => {
            const ids = selected.map((s: any) => s?.id)
            if (onDelete) onDelete({ scheduleIds: ids, day: day })
            onClose()
          }}
        />
      )}
      {day !== "all" && (
        <ConfirmDialog
          isOpen={isOpenCopy}
          onClose={onCloseCopy}
          title={"ยืนยันการคัดลอก"}
          content={`คุณคัดลอกข้อมูล ${DayTypes[day]} จากปี ${
            +watchYear?.value - 1
          } ใช่หรือไม่ ?`}
          onSubmit={() => {
            if (copy) copy({ day: day, currentYear: watchYear?.value })
            onCloseCopy()
          }}
        />
      )}
      <Flex
        justifyContent="space-between"
        mb={{ base: "16px", md: "32px" }}
        flexDirection={{ base: "column", md: "row" }}
      >
        <Box>
          {day === "all" && (
            <NextLink href={"/admin/schedules/manageSchedule"} passHref>
              <Link _hover={{}} _focus={{}}>
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
                        d="M17.75 3C18.612 3 19.4386 3.34241 20.0481 3.9519C20.6576 4.5614 21 5.38805 21 6.25V7H3V6.25C3 5.38805 3.34241 4.5614 3.9519 3.9519C4.5614 3.34241 5.38805 3 6.25 3H17.75Z"
                        fill="#F9F9F9"
                      />
                      <path
                        d="M21 8.5V12.022C19.752 11.2238 18.2687 10.8759 16.7959 11.0359C15.3232 11.1958 13.9492 11.8541 12.9017 12.9017C11.8541 13.9492 11.1958 15.3232 11.0359 16.7959C10.8759 18.2687 11.2238 19.752 12.022 21H6.25C5.38805 21 4.5614 20.6576 3.9519 20.0481C3.34241 19.4386 3 18.612 3 17.75V8.5H21Z"
                        fill="#F9F9F9"
                      />
                      <path
                        d="M23 17.5C23 16.0413 22.4205 14.6424 21.3891 13.6109C20.3576 12.5795 18.9587 12 17.5 12C16.0413 12 14.6424 12.5795 13.6109 13.6109C12.5795 14.6424 12 16.0413 12 17.5C12 18.9587 12.5795 20.3576 13.6109 21.3891C14.6424 22.4205 16.0413 23 17.5 23C18.9587 23 20.3576 22.4205 21.3891 21.3891C22.4205 20.3576 23 18.9587 23 17.5ZM17.5 17.5H19.5C19.6326 17.5 19.7598 17.5527 19.8536 17.6464C19.9473 17.7402 20 17.8674 20 18C20 18.1326 19.9473 18.2598 19.8536 18.3536C19.7598 18.4473 19.6326 18.5 19.5 18.5H17C16.8674 18.5 16.7402 18.4473 16.6464 18.3536C16.5527 18.2598 16.5 18.1326 16.5 18V15C16.5 14.8674 16.5527 14.7402 16.6464 14.6464C16.7402 14.5527 16.8674 14.5 17 14.5C17.1326 14.5 17.2598 14.5527 17.3536 14.6464C17.4473 14.7402 17.5 14.8674 17.5 15V17.5Z"
                        fill="#F9F9F9"
                      />
                    </svg>
                  }
                  mr={{ base: 4, md: 0 }}
                >
                  จัดการวันจองรถ
                </Button>
              </Link>
            </NextLink>
          )}
          {day !== "all" && (
            <Flex mt={{ base: 6, md: 0 }} flexWrap="wrap">
              <NextLink href={`/admin/schedules/${day}/create`} passHref>
                <Link _hover={{}} _focus={{}}>
                  <Button leftIcon={<AddIcon />} mr={4}>
                    เพิ่มวัน
                  </Button>
                </Link>
              </NextLink>
              <Button
                leftIcon={
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11.25 0.75H3C2.175 0.75 1.5 1.425 1.5 2.25V12C1.5 12.4125 1.8375 12.75 2.25 12.75C2.6625 12.75 3 12.4125 3 12V3C3 2.5875 3.3375 2.25 3.75 2.25H11.25C11.6625 2.25 12 1.9125 12 1.5C12 1.0875 11.6625 0.75 11.25 0.75ZM11.6925 4.1925L15.315 7.815C15.5925 8.0925 15.75 8.475 15.75 8.8725V15.75C15.75 16.575 15.075 17.25 14.25 17.25H5.9925C5.1675 17.25 4.5 16.575 4.5 15.75L4.5075 5.25C4.5075 4.425 5.175 3.75 6 3.75H10.6275C11.025 3.75 11.4075 3.9075 11.6925 4.1925ZM11.25 9H14.625L10.5 4.875V8.25C10.5 8.6625 10.8375 9 11.25 9Z"
                      fill="#00A5A8"
                    />
                  </svg>
                }
                variant="outline"
                mr={4}
                onClick={onOpenCopy}
                _focus={{ boxShadow: "none" }}
              >
                คัดลอกข้อมูลจากปีก่อน
              </Button>
              <Button
                leftIcon={
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5.25 3C5.25 2.60218 5.40804 2.22064 5.68934 1.93934C5.97065 1.65804 6.35218 1.5 6.75 1.5H11.25C11.6478 1.5 12.0294 1.65804 12.3107 1.93934C12.592 2.22064 12.75 2.60218 12.75 3V4.5H15.75C15.9489 4.5 16.1397 4.57902 16.2803 4.71967C16.421 4.86032 16.5 5.05109 16.5 5.25C16.5 5.44891 16.421 5.63968 16.2803 5.78033C16.1397 5.92098 15.9489 6 15.75 6H14.9483L14.298 15.1065C14.2711 15.4849 14.1017 15.8391 13.8241 16.0977C13.5465 16.3563 13.1811 16.5 12.8018 16.5H5.1975C4.81811 16.5 4.4528 16.3563 4.17516 16.0977C3.89753 15.8391 3.72819 15.4849 3.70125 15.1065L3.0525 6H2.25C2.05109 6 1.86032 5.92098 1.71967 5.78033C1.57902 5.63968 1.5 5.44891 1.5 5.25C1.5 5.05109 1.57902 4.86032 1.71967 4.71967C1.86032 4.57902 2.05109 4.5 2.25 4.5H5.25V3ZM6.75 4.5H11.25V3H6.75V4.5ZM4.5555 6L5.19825 15H12.8025L13.4453 6H4.5555ZM7.5 7.5C7.69892 7.5 7.88968 7.57902 8.03033 7.71967C8.17098 7.86032 8.25 8.05109 8.25 8.25V12.75C8.25 12.9489 8.17098 13.1397 8.03033 13.2803C7.88968 13.421 7.69892 13.5 7.5 13.5C7.30109 13.5 7.11032 13.421 6.96967 13.2803C6.82902 13.1397 6.75 12.9489 6.75 12.75V8.25C6.75 8.05109 6.82902 7.86032 6.96967 7.71967C7.11032 7.57902 7.30109 7.5 7.5 7.5ZM10.5 7.5C10.6989 7.5 10.8897 7.57902 11.0303 7.71967C11.171 7.86032 11.25 8.05109 11.25 8.25V12.75C11.25 12.9489 11.171 13.1397 11.0303 13.2803C10.8897 13.421 10.6989 13.5 10.5 13.5C10.3011 13.5 10.1103 13.421 9.96967 13.2803C9.82902 13.1397 9.75 12.9489 9.75 12.75V8.25C9.75 8.05109 9.82902 7.86032 9.96967 7.71967C10.1103 7.57902 10.3011 7.5 10.5 7.5Z"
                      fill={selected.length > 0 ? "#D61212" : "#33333360"}
                    />
                  </svg>
                }
                variant="outline"
                color={selected.length > 0 ? "error.500" : "#33333360"}
                mr={4}
                _focus={{ boxShadow: "none" }}
                onClick={onOpen}
              >
                ลบ
              </Button>
            </Flex>
          )}
        </Box>

        <form>
          <Flex mt={{ base: 6, md: 0 }}>
            {day === "all" && (
              <Box width={40} mr={4}>
                <Controller
                  name="month"
                  control={control}
                  render={({ field }) => (
                    <SelectInput
                      options={monthOptions}
                      placeholder=""
                      menuBackgroundColor="#ffffff"
                      {...field}
                    />
                  )}
                />
              </Box>
            )}
            <Box width={40}>
              <Controller
                name="year"
                control={control}
                render={({ field }) => (
                  <SelectInput
                    options={listYears}
                    placeholder=""
                    menuBackgroundColor="#ffffff"
                    {...field}
                  />
                )}
              />
            </Box>
          </Flex>
        </form>
      </Flex>
      <Box>
        {isLoading || !data ? (
          <TableLoading columnsLength={columns.length + 1} />
        ) : (
          <Table
            resources={day === "all" ? `schedules` : `schedules/${day}`}
            data={data ? data : []}
            columns={columns}
            hasDelete={false}
            setPage={setPage}
            pageCount={pageCount}
            currentPage={currentPage}
            setSort={setSort}
            sortBy={sortBy}
            hasCheckbox={hasCheckbox}
            setSelected={handleSetSelected}
          />
        )}
      </Box>
    </>
  )
}

export default ScheduleList
