import React from "react"
import {
  Box,
  CloseButton,
  Flex,
  useColorModeValue,
  Text,
  BoxProps,
} from "@chakra-ui/react"
import { IconType } from "react-icons"
import {
  UserIcon,
  EmployeeIcon,
  TransportationProviderIcon,
  AreaIcon,
  BusLineIcon,
  TimeTableIcon,
  CarBookingIcon,
  PlanningIcon,
  ScheduleIcon,
  ReportIcon,
} from "../../Icon"
import MenuItem from "./MenuItem"
import SubMenu from "./Submenu"
import { SidebarData } from "./SidebarData"

interface LinkItemProps {
  name: string
  icon: IconType | any
  link?: string
}
const LinkItems: Array<LinkItemProps> = [
  { name: "บัญชีผู้ใช้", icon: UserIcon, link: "/admin/users" },
  { name: "พนักงาน", icon: EmployeeIcon, link: "/admin/employees" },
  {
    name: "ผู้ให้บริการรถ",
    icon: TransportationProviderIcon,
    link: "/admin/transportationProviders",
  },
  { name: "จุดจอดรถ", icon: AreaIcon, link: "/admin/areas" },
  { name: "สายรถ", icon: BusLineIcon, link: "/admin/busLines" },
  {
    name: "รอบการจัดรถ",
    icon: TimeTableIcon,
    link: "/admin/timeTables",
  },
  {
    name: "การจัดรถ",
    icon: PlanningIcon,
    link: "/admin/plannings",
  },
  {
    name: "การจองรถ",
    icon: CarBookingIcon,
    link: "/admin/bookings",
  },
  {
    name: "จัดการปฏิทิน",
    icon: ScheduleIcon,
    link: "/admin/schedules",
  },
  {
    name: "รายงาน",
    icon: ReportIcon,
    link: "/admin/reports",
  },
]

interface SidebarProps extends BoxProps {
  onClose: () => void
  onOpen?: () => void
  isOpen?: boolean
  mobileSize?: boolean
}

const Sidebar = ({
  onClose,
  onOpen,
  isOpen,
  mobileSize,
  ...rest
}: SidebarProps) => {
  return (
    <Box
      transition="width .3s ease"
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: isOpen ? "64" : 16 }}
      minHeight="100%"
      overflowY={mobileSize ? "auto" : "inherit"}
      {...rest}
    >
      <Flex
        h={"20"}
        alignItems="center"
        mx="8"
        justifyContent={isOpen ? "space-between" : "space-around"}
      >
        <Text fontSize="16px" fontFamily="monospace" fontWeight={700}>
          Menu
        </Text>

        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>

      {/* {LinkItems.map((link) => (
        <MenuItem
          key={link.name}
          icon={link.icon}
          link={`${link.link}`}
          isOpen={isOpen}
          w={{ base: "90%", md: isOpen ? 56 : "36px" }}
          my={isOpen ? 0 : 4}
          mobileSize={mobileSize}
          onClose={onClose}
        >
          {link.name}
        </MenuItem>
      ))} */}

      {SidebarData.map((item: any, index: any) => {
        return <SubMenu item={item} key={index} isOpen={isOpen}  />
      })}
    </Box>
  )
}

export default Sidebar
