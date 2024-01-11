import { Table, Thead, Tbody, Tr, Th, Td, Box } from "@chakra-ui/react"
import styles from "./table.module.css"
import layoutStyles from "./layout/layout.module.css"

type TableLoadingProps = {
  columnsLength: number
}

const TableLoading = ({ columnsLength }: TableLoadingProps) => {
  const colums: any[] = [...Array(columnsLength)].map((x) => 0)
  const data: any[] = [...Array(5)].map((x) => 0)

  return (
    <Box
      border="1px solid #00A5A8"
      borderTopLeftRadius="10px"
      borderTopRightRadius="10px"
      borderBottomLeftRadius="10px"
      borderBottomRightRadius="10px"
      overflowX="auto"
      position="relative"
      className={layoutStyles.scroll}
    >
      <Table variant="simple">
        <Thead>
          <Tr>
            {colums.map((c: any, i) => (
              <Th key={i} borderBottomColor="#B2CCCC" bgColor="#00A5A8">
                <div className={styles.line}></div>
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {data.map((c: any, index) => (
            <Tr
              key={index}
              borderBottomWidth={index === columnsLength - 1 ? "0px" : "1px"}
            >
              {colums.map((c: any, i) => (
                <Td
                  key={i}
                  borderBottomColor="#B2CCCC"
                  borderBottomWidth={
                    index === columnsLength - 1 ? "0px" : "1px"
                  }
                >
                  <div className={styles.line}></div>
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  )
}

export default TableLoading
