import React, { ReactNode, useState } from "react"
import {
  Flex,
  Drawer,
  DrawerContent,
  useDisclosure,
  useBreakpointValue,
  DrawerOverlay,
} from "@chakra-ui/react"
import Appbar from "./Appbar"
import Footer from "./Footer"
import Sidebar from "./Sidebar"
import {
  localStorageSave,
  localStorageLoad,
} from "../../../utils/localStrorage"

const Dashboard = ({ children }: { children: ReactNode }) => {
  const mobileSize = useBreakpointValue({ base: true, md: false })
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [sidebarOpen, setSidebarOpen] = useState(
    localStorageLoad("sidebarOpen")
      ? localStorageLoad("sidebarOpen")
        ? localStorageLoad("sidebarOpen") == "true"
          ? true
          : false
        : false
      : false
  )

  const handleSetSidebarOpen = () => {
    localStorageSave("sidebarOpen", !sidebarOpen)
    setSidebarOpen((prevState) => !prevState)
  }

  return (
    <Flex flexDirection="column" minHeight="100vh" w="100%">
      <Appbar
        onOpen={onOpen}
        isOpen={sidebarOpen}
        sidebarToggle={handleSetSidebarOpen}
      />
      <Flex minHeight="100%" flex="1">
        <Flex minHeight="100%">
          <Sidebar
            onClose={() => onClose}
            display={{ base: "none", md: "block" }}
            isOpen={sidebarOpen}
          />

          {mobileSize && (
            <Drawer
              autoFocus={false}
              isOpen={isOpen}
              placement="left"
              onClose={onClose}
              returnFocusOnClose={false}
              onOverlayClick={onClose}
              size="xs"
            >
              <DrawerOverlay />
              <DrawerContent>
                <Sidebar
                  onClose={onClose}
                  isOpen={isOpen}
                  mobileSize={mobileSize}
                />
              </DrawerContent>
            </Drawer>
          )}
        </Flex>
        <Flex
          pl={{ base: 0, md: "20px", lg: "40px" }}
          pr={{ base: 0, md: "60px", lg: "60px" }}
          pt={{ base: 4, md: "36px" }}
          pb={{ base: 0, md: "30px" }}
          w="100%"
          bgColor="#ffffff"
          minHeight="100%"
          flexDirection="column"
        >
          {children}
        </Flex>
      </Flex>
      {/* <Footer /> */}
    </Flex>
  )
}

export default Dashboard
