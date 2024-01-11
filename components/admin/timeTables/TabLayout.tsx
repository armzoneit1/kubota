import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Flex,
  Box,
  Center,
  Spinner,
  Link,
} from "@chakra-ui/react"
import { useRouter } from "next/router"
import { ReactElement, ReactNode, isValidElement, cloneElement } from "react"
import Head from "next/head"
import Toolbar from "../../Toolbar"
import NextLink from "next/link"

interface TabLayout {
  index: number
  children: ReactNode | ReactElement<any, any>
  setSearch: React.Dispatch<React.SetStateAction<string>>
  search: string
}

type TabTypes = {
  label: string
  content: ReactNode | ReactElement<any, any> | null
  link: string
}

const TabLayout = ({ index, children, setSearch, search }: TabLayout) => {
  const router = useRouter()

  const tabs: TabTypes[] = [
    {
      label: "รอบไป",
      content: null,
      link: `/admin/timeTables/morning`,
    },
    {
      label: "รอบกลับ",
      content: null,
      link: `/admin/timeTables/evening`,
    },
  ]

  tabs[index].content = children

  return (
    <Box>
      <Head>
        <title>รอบการจัดรถ</title>
        <meta name="description" content="timeTable" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Flex flexDirection="column" p="2">
        <Toolbar title="รอบการจัดรถ" setSearch={setSearch} search={search} />
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
    </Box>
  )
}

export default TabLayout
