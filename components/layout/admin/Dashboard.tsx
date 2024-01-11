import React, { ReactNode, useEffect, useState } from "react"
import {
  Flex,
  Drawer,
  DrawerContent,
  useDisclosure,
  useBoolean,
  useBreakpointValue,
  DrawerOverlay,
  useToast,
} from "@chakra-ui/react"
import Sidebar from "./Sidebar"
import Appbar from "./Appbar"
import { getList } from "../../../data-hooks/notifications/getList"
import { useUpdate } from "../../../data-hooks/notifications/complete"
import get from "lodash/get"
import {
  localStorageSave,
  localStorageLoad,
} from "../../../utils/localStrorage"

const Dashboard = ({ children }: { children: ReactNode }) => {
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

  const mobileSize = useBreakpointValue({ base: true, md: false })
  const notifications = getList()
  const update = useUpdate()
  const toast = useToast()

  const toastId1 = "error_notifications"
  const toastId2 = "error_update"

  const handleSetSidebarOpen = () => {
    localStorageSave("sidebarOpen", !sidebarOpen)
    setSidebarOpen((prevState) => !prevState)
  }

  useEffect(() => {
    if (notifications.error || notifications.data?.error) {
      if (
        !toast.isActive(toastId1) &&
        get(notifications, "error.status") !== 401
      ) {
        toast({
          id: toastId1,
          title: "Notification",
          description: notifications.data?.error?.message
            ? notifications.data?.error?.message
            : `${get(notifications, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [notifications.error, notifications.data?.error, toast])

  useEffect(() => {
    if (update.isError) {
      if (!toast.isActive(toastId2) && get(update, "error.status") !== 401) {
        toast({
          id: toastId2,
          description: `${get(update, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [update.isError, update.error, toast])

  return (
    <Flex flexDirection="column" minHeight="100vh" w="100%">
      <Appbar
        onOpen={onOpen}
        isOpen={sidebarOpen}
        sidebarToggle={handleSetSidebarOpen}
        isLoadingNotification={notifications.isLoading}
        notifications={notifications?.data?.data}
        update={update.mutate}
        isLoadingUpdate={update.isLoading}
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
          pr={{ base: 0, md: "5px", lg: "20px" }}
          pt={{ base: 0, md: "36px" }}
          pb={{ base: 0, md: "30px" }}
          w="100%"
          bgColor="#ffffff"
          minHeight="100%"
          flexDirection="column"
        >
          {children}
        </Flex>
      </Flex>
    </Flex>
  )
}

export default Dashboard
