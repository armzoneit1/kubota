/* eslint-disable react/no-children-prop */
import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Flex,
  Box,
  Text,
  HStack,
  Link,
  Container,
  InputGroup,
  InputLeftElement,
  Input,
  Center,
  Spinner,
  useToast,
} from "@chakra-ui/react"
import { useRouter } from "next/router"
import {
  ReactElement,
  ReactNode,
  isValidElement,
  cloneElement,
  useEffect,
} from "react"
import Head from "next/head"
import NextLink from "next/link"
import { DateTime } from "luxon"
import { SearchIcon } from "@chakra-ui/icons"
import { useForm } from "react-hook-form"
import { getOneForTab } from "../../../data-hooks/plannings/getOne"
import { useQueryClient } from "react-query"

interface TabLayout {
  index: number
  children: ReactNode | ReactElement<any, any>
  id?: string | string[] | undefined
  periodOfDay: "morning" | "evening"
}

type TabTypes = {
  label: string
  content: ReactNode | ReactElement<any, any> | null
  link: string
}

const TabLayout = ({ index, children, periodOfDay }: TabLayout) => {
  const router = useRouter()
  const id = router?.query?.id
  const queryClient = useQueryClient()
  const data: any = queryClient.getQueryData(
    ["busArrangements", id, periodOfDay],
    {
      exact: false,
    }
  )

  const tabs: TabTypes[] = [
    {
      label: "รอบไป",
      content: null,
      link: `/admin/plannings/${id}/morning`,
    },
    {
      label: "รอบกลับ",
      content: null,
      link: `/admin/plannings/${id}/evening`,
    },
  ]

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    control,
  } = useForm()

  tabs[index].content = children

  return (
    <Container
      minHeight="80vh"
      minW="100%"
      paddingInlineStart={{ base: 2, md: 0 }}
      paddingInlineEnd={{ base: 2, md: 0 }}
    >
      <Head>
        <title>การจัดรถ</title>
        <meta name="description" content="planning" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Flex flexDirection="column" p="2">
        <Flex width="100%" justifyContent="space-between" my={5}>
          <Flex justifyContent="center" flexDirection="column">
            <Text mb={3} fontSize="32px">
              จัดรถ
            </Text>
            <HStack>
              <NextLink href="/admin/plannings" passHref>
                <Link _hover={{}} _focus={{}}>
                  <Text fontStyle="italic" color="#00A5A8" cursor="pointer">
                    การจัดรถ
                  </Text>
                </Link>
              </NextLink>
              <Text>{">"}</Text>
              <Text fontStyle="italic">จัดรถ</Text>
            </HStack>
          </Flex>
        </Flex>
        <Text fontWeight={600} mb={5}>
          วันที่ :{" "}
          {data?.data?.date
            ? DateTime.fromJSDate(new Date(data?.data?.date)).toFormat(
                "dd/MM/y"
              )
            : "-"}
        </Text>
        <Tabs colorScheme="primary" defaultIndex={index}>
          <TabList>
            {tabs.map((tab, index) => (
              <NextLink href={tab?.link} passHref key={index}>
                <Tab _focus={{ boxShadow: "none" }}>{tab.label}</Tab>
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
      </Flex>
    </Container>
  )
}

export default TabLayout
