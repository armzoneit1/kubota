import {
  Box,
  Text,
  Flex,
  Button,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Link,
} from "@chakra-ui/react"
import { MdEdit, MdDirectionsBus, MdMoreVert } from "react-icons/md"
import { TimeTableRoundTypes } from "../../../data-hooks/timeTables/types"
import NextLink from "next/link"

type ScheduleCardProps = {
  name: string
  canDelete: boolean
  onOpen: (id: number, name: string) => void
  id: number
  timeTableRounds: TimeTableRoundTypes[]
}

const ScheduleCard = ({
  name,
  canDelete,
  onOpen,
  id,
  timeTableRounds,
}: ScheduleCardProps) => {
  return (
    <Flex w="100%" mb={6} flexDirection={{ base: "column", md: "row" }}>
      <Box
        width={{ base: "100%", md: "25%" }}
        mr={{ base: 0, md: 6 }}
        mb={{ base: 4, md: 0 }}
      >
        <Text fontSize="20px" fontWeight={600}>
          {name}
        </Text>
      </Box>
      <Flex
        height={{ base: "275px", md: "360px" }}
        width={{ base: "100%", md: "80%" }}
        bgColor="#F5F5F5"
        borderRadius="8px"
        p={{ base: 8, md: 12 }}
        flexDirection="column"
      >
        <Flex justifyContent="space-between">
          <Text fontWeight={600} color="#00A5A8" mb={4}>
            เวลาขึ้น/ลงรถ
          </Text>
          <Flex>
            <NextLink href={`/admin/timeTables/${id}`} passHref>
              <Link _hover={{}} _focus={{}}>
                <IconButton
                  variant="unstyled"
                  color="#00A5A8"
                  aria-label="Call Sage"
                  fontSize="20px"
                  display="flex"
                  icon={<MdEdit />}
                  _focus={{ boxShadow: "none" }}
                />
              </Link>
            </NextLink>
            {canDelete && (
              <Menu>
                <MenuButton
                  as={IconButton}
                  icon={<MdMoreVert />}
                  variant="ghost"
                  fontSize="22px"
                  color="#333333"
                  _focus={{ boxShadow: "none" }}
                  ml={4}
                />
                <MenuList
                  borderColor="#B2CCCC"
                  borderRadius="6px"
                  p="8px"
                  minWidth="150px"
                >
                  <MenuItem
                    _hover={{
                      bgColor: "#D4E3E3",
                      borderRadius: "6px",
                    }}
                    _active={{ background: "none" }}
                    _focus={{ background: "none" }}
                    onClick={() => {
                      onOpen(id, name)
                    }}
                  >
                    ลบ
                  </MenuItem>
                </MenuList>
              </Menu>
            )}
          </Flex>
        </Flex>
        <Flex
          flexDirection="column"
          justifyContent="space-between"
          height="90%"
        >
          <Box>
            {timeTableRounds.map((timeTableRound, index) => (
              <Text
                key={timeTableRound.timeTableRoundId}
                fontWeight={400}
                my={2}
              >
                {timeTableRound.time}
              </Text>
            ))}
          </Box>
          {timeTableRounds.length > 0 && (
            <Box mt={4}>
              <NextLink href={`/admin/timeTables/${id}/customDetails`} passHref>
                <Link _hover={{}} _focus={{}}>
                  <Button
                    variant="outline"
                    leftIcon={<MdDirectionsBus />}
                    _focus={{ boxShadow: "none" }}
                  >
                    จัดการการเดินรถ
                  </Button>
                </Link>
              </NextLink>
            </Box>
          )}
        </Flex>
      </Flex>
    </Flex>
  )
}

export default ScheduleCard
