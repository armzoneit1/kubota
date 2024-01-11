import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Flex,
  Container,
  Text,
  HStack,
  Center,
  Spinner,
  useToast,
} from "@chakra-ui/react"
import { useRouter } from "next/router"
import {
  ReactNode,
  useEffect,
  ReactElement,
  cloneElement,
  isValidElement,
} from "react"
import { getOneForTab } from "../../../data-hooks/transportationProviders/getOne"
import NextLink from "next/link"
import get from "lodash/get"

interface TabLayout {
  type: "list" | "create" | "edit"
  index: number
  children: ReactNode | ReactElement<any, any>
}

type TabTypes = {
  label: string
  content: ReactNode | ReactElement<any, any> | null
  link: string
}

const TabLayout = ({ index, children, type = "list" }: TabLayout) => {
  const router = useRouter()
  const id = router?.query?.providerId
  const { isLoading, error, data, isFetching } = getOneForTab(id)
  const toast = useToast()
  const toastId = "error"
  const tabs: TabTypes[] = [
    {
      label: "ข้อมูลผู้ให้บริการ",
      content: null,
      link: `/admin/transportationProviders/${id}/info`,
    },
    {
      label: "รถ",
      content: null,
      link: `/admin/transportationProviders/${id}/vehicles`,
    },
    {
      label: "คนขับรถ",
      content: null,
      link: `/admin/transportationProviders/${id}/drivers`,
    },
  ]

  const typeTabs = [
    {
      create: "เพิ่มผู้ให้บริการ",
      edit: "เเก้ไข",
      list: "",
    },
    {
      create: "เพิ่มรถ",
      edit: "เเก้ไข",
      list: "",
    },
    {
      create: "เพิ่มคนขับรถ",
      edit: "เเก้ไข",
      list: "",
    },
  ]

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

  if (isLoading || isFetching)
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

  tabs[index].content = children

  return (
    <Container
      minHeight="80vh"
      minW="100%"
      paddingInlineStart={{ base: 2, md: 0 }}
      paddingInlineEnd={{ base: 2, md: 0 }}
    >
      <Flex width="100%" justifyContent="space-between" my={5}>
        <Flex justifyContent="center" flexDirection="column">
          <Text mb={3} fontSize="32px">
            {data?.data.companyName}
          </Text>
          <HStack>
            <Text
              fontStyle="italic"
              color="#00A5A8"
              cursor="pointer"
              onClick={() => {
                router.push("/admin/transportationProviders")
              }}
            >
              ผู้ให้บริการรถ
            </Text>
            <Text>{">"}</Text>
            {type === "list" ? (
              <Text
                fontStyle="italic"
                onClick={() => {
                  router.push(`${tabs[index].link}`)
                }}
              >
                {data?.data.companyName}
              </Text>
            ) : index === 0 ? (
              <Text fontStyle="italic" color="#00A5A8" cursor={"inherit"}>
                {data?.data.companyName}
              </Text>
            ) : (
              <NextLink href={`${tabs[index].link}`} passHref key={index}>
                <Text fontStyle="italic" color="#00A5A8" cursor={"pointer"}>
                  {data?.data.companyName}
                </Text>
              </NextLink>
            )}
            {type !== "list" && (
              <>
                <Text>{">"}</Text>
                <Text fontStyle="italic">
                  {typeTabs && type && typeTabs[index][type]}
                </Text>
              </>
            )}
          </HStack>
        </Flex>
      </Flex>
      <Tabs colorScheme="primary" defaultIndex={index}>
        <TabList>
          {tabs.map((tab, index) => (
            <NextLink href={tab?.link} passHref key={index}>
              <Tab key={index} _focus={{ boxShadow: "none" }}>
                {tab.label}
              </Tab>
            </NextLink>
          ))}
        </TabList>
        <TabPanels>
          {tabs.map((tab, index) => (
            <TabPanel pt={{ base: 8, md: 16 }} px={0} key={index}>
              {isValidElement(tab.content)
                ? cloneElement(tab.content)
                : tab.content}
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </Container>
  )
}

export default TabLayout
