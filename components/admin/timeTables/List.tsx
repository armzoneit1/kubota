import { Box, Button, Link } from "@chakra-ui/react"
import { AddIcon } from "@chakra-ui/icons"
import ScheduleCard from "./ScheduleCard"
import { TimeTableDataTypes } from "../../../data-hooks/timeTables/types"
import NextLink from "next/link"

type TimeTableListProps = {
  data: TimeTableDataTypes[]
  onOpen: (id: number, name: string) => void
  periodOfDay: "morning" | "evening"
}

const TimeTableList = ({ data, onOpen, periodOfDay }: TimeTableListProps) => {
  return (
    <Box>
      <NextLink href={`/admin/timeTables/create/${periodOfDay}`} passHref>
        <Link _hover={{}} _focus={{}}>
          <Button leftIcon={<AddIcon />} colorScheme="primary" mr={4} mb={10}>
            เพิ่มรอบ
          </Button>
        </Link>
      </NextLink>
      {data &&
        data.map((timeTable, index) => (
          <ScheduleCard
            key={index}
            name={timeTable.name}
            timeTableRounds={timeTable.timeTableRounds}
            canDelete={timeTable.isDeletable}
            onOpen={onOpen}
            id={timeTable.id}
          />
        ))}
    </Box>
  )
}

export default TimeTableList
