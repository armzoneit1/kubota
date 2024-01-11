import React, { useRef } from "react"
import { CellProps, CellComponent, Column } from "./types"
import {
  Checkbox,
  CheckboxGroup,
  HStack,
  Flex,
  Box,
  Link,
} from "@chakra-ui/react"
import filter from "lodash/filter"
import { OverlayScrollbarsComponent } from "overlayscrollbars-react"
import { useRouter } from "next/router"
import { ArrangedVehicleDataTypes } from "../../data-hooks/busArrangements/types"
import NextLink from "next/link"

export type CheckboxType = {
  setSelected: (selected: any) => void
  selected: any[] | null
  isConfirm: boolean
  disabled?: boolean | (({ rowData }: { rowData: string | null }) => boolean)
  periodOfDay: "morning" | "evening"
}

const CheckboxComponent = React.memo<CellProps<string | any, CheckboxType>>(
  ({
    focus,
    rowData,
    setRowData,
    disabled,
    columnData,
    active,
    columnIndex,
    rowIndex,
  }) => {
    const router = useRouter()
    const id = router.query.id
    return (
      <OverlayScrollbarsComponent
        options={{
          scrollbars: {
            autoHide: "leave",
          },
        }}
        style={{ width: "100%", height: 70, overflowY: "scroll" }}
      >
        <Flex w="100%" px="10px" flexWrap="wrap" py={2}>
          {rowData &&
            rowData.map((c: ArrangedVehicleDataTypes) => (
              <Box
                key={c.bookingVehicleId}
                bgColor={
                  c.passengers.length === c.seatCapacity ? "#B2CCCC" : "none"
                }
                borderRadius="14.5px"
                border={
                  c.passengers.length === c.seatCapacity
                    ? "none"
                    : "solid 1px #B2CCCC"
                }
                px="10px"
                mr={2}
                mb={2}
                cursor={columnData.isConfirm ? "pointer" : "inherit"}
              >
                {columnData.isConfirm ? (
                  <NextLink
                    href={`/admin/plannings/${id}/${columnData.periodOfDay}/edit/${c.bookingVehicleId}`}
                    passHref
                  >
                    <Link _hover={{}} _focus={{}}>
                      {!c?.isNormalBusStopBySetting && (
                        <span style={{ color: "#D61212" }}>* </span>
                      )}
                      {`${c.vehicleTypeName} ${c.passengers.length}/${c.seatCapacity}`}
                    </Link>
                  </NextLink>
                ) : (
                  <Checkbox
                    value={JSON.stringify({ ...c, columnIndex, rowIndex })}
                    color="black"
                    borderColor="#333333"
                    colorScheme="primary"
                    onChange={(e) => {
                      columnData.setSelected(JSON.parse(e.target.value))
                    }}
                    isChecked={Boolean(
                      filter(columnData.selected, [
                        "bookingVehicleId",
                        c.bookingVehicleId,
                      ]).length > 0
                    )}
                  >
                    <NextLink
                      href={`/admin/plannings/${id}/${columnData.periodOfDay}/edit/${c.bookingVehicleId}`}
                      passHref
                    >
                      <Link _hover={{}} _focus={{}}>
                        {!c?.isNormalBusStopBySetting && (
                          <span style={{ color: "#D61212" }}>* </span>
                        )}
                        {`${c.vehicleTypeName} ${c.passengers.length}/${c.seatCapacity}`}
                      </Link>
                    </NextLink>
                  </Checkbox>
                )}
              </Box>
            ))}
        </Flex>
      </OverlayScrollbarsComponent>
    )
  }
)

CheckboxComponent.displayName = "CheckboxColumn"

export const checkboxColumn = (
  selected: CheckboxType
): Partial<Column<string | null, CheckboxType>> => ({
  component: CheckboxComponent as CellComponent<string | null, CheckboxType>,
  deleteValue: () => null,
  copyValue: ({ rowData }) => rowData,
  pasteValue: ({ value }) =>
    value ? value.replace(/[\n\r]+/g, " ").trim() : null,
  columnData: selected,
  disableKeys: true,
  keepFocus: true,
  disabled: selected.disabled,
})
