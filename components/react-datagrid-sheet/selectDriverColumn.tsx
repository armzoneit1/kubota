/* eslint-disable react/display-name */
import React, { useLayoutEffect, useRef, useState, useEffect } from "react"
import { components } from "react-select"
import Select from "../input/react-select/Select"
import { CellProps, Column, CellComponent } from "./types"
import filter from "lodash/filter"
import isEqual from "lodash/isEqual"
import { Button, useDisclosure, Text } from "@chakra-ui/react"
import AddDriverModal from "../admin/plannings/AddDriverModal"
import { useAxios } from "../../providers/http-client"
import styles from "../input/select.module.css"
import isNumber from "lodash/isNumber"

type Choice = {
  label: string
  value: string | number
  transportationProviderId?: number
}

type ChoiceAndGroup = {
  label: string
  options?: Choice[]
  value?: string | number
  transportationProviderId?: number
}

type SelectOptions = {
  choices: ChoiceAndGroup[]
  addDriver: (id: string | number) => void
  isLoading: boolean
  disabled?: boolean | (({ rowData }: { rowData: string | null }) => boolean)
  transportationProviderId?: number
  transportationProviderName?: string
  vehicleId?: {
    value: number
    label: string
    transportationProviderVehicleTypeMappingId: number
    driverId: number
  }
  bookingVehicleId?: number
  timeTableRoundId?: number
  handleSetDriver: (
    driver: any,
    timeTableRoundId: number,
    bookingVehicleId: number
  ) => void
  validationDriver: any[] | null
}

const groupStyles = {
  borderBottom: "2px solid #33333360",
  background: "#ffffff",
}

const Group = (props: any) => {
  return (
    <div style={props.data.label === "คนขับปัจจุบัน" ? groupStyles : {}}>
      <components.Group {...props} />
    </div>
  )
}
const Menu = (props: any) => {
  return (
    <components.Menu {...props}>
      {props.children}
      <Button
        variant="ghost"
        _focus={{ boxShadow: "none" }}
        textDecoration="underline"
        onClick={props?.onOpen}
      >
        เพิ่มคนขับใหม่
      </Button>
    </components.Menu>
  )
}

const ControlComponent = (props: any) => (
  <div
    style={{
      height: props?.isValid ? "inherit" : "49px",
    }}
  >
    <components.Control {...props} />
    {!props?.isValid && (
      <Text fontSize="14px" color="#e53e3e" px="8px" pt="1px">
        คนขับซ้ำ
      </Text>
    )}
  </div>
)

const headerStyles = {
  color: "#00A5A8",
  fontWeight: 600,
}

const formatGroupLabel = (data: any) => (
  <div>
    <span style={headerStyles}>{data.label}</span>
  </div>
)

const MenuList = (props: any) => {
  return (
    <components.MenuList {...props} className={styles.scroll}>
      {props.children}
    </components.MenuList>
  )
}

const SelectDriverComponent = React.memo(
  ({
    active,
    rowData,
    setRowData,
    focus,
    stopEditing,
    columnData,
  }: CellProps<string | any, SelectOptions>) => {
    const ref = useRef<Select>(null)
    const { isOpen, onClose, onOpen } = useDisclosure()
    const isValid = columnData?.validationDriver
      ? filter(columnData?.validationDriver, (v) => v?.value === rowData?.value)
          .length > 0
        ? false
        : true
      : true

    const filteredOptions = columnData.transportationProviderId
      ? filter(columnData.choices, {
          transportationProviderId: columnData?.transportationProviderId,
        })
      : columnData.choices

    useLayoutEffect(() => {
      if (focus) {
        ref.current?.focus()
      } else {
        ref.current?.blur()
      }
    }, [focus])

    const filteredCurrentDriver = filter(filteredOptions, (c) => {
      return isEqual(c?.value, columnData?.vehicleId?.driverId)
    })

    const filteredOtherDriver = filter(filteredOptions, (c) => {
      return !isEqual(c.value, columnData?.vehicleId?.driverId)
    })

    const options = [
      {
        label: "คนขับปัจจุบัน",
        options:
          filteredCurrentDriver.length > 0
            ? [...filteredCurrentDriver]
            : [{ value: null, label: "-" }],
      },
    ]

    if (filteredOtherDriver.length > 0) {
      options.push({
        label: "คนขับทั้งหมด",
        options: [...filteredOtherDriver],
      })
    }

    return (
      <>
        <AddDriverModal
          isOpen={isOpen}
          onClose={onClose}
          transportationProviderId={columnData?.transportationProviderId}
          transportationProviderName={columnData?.transportationProviderName}
          onSubmit={columnData?.addDriver}
          isLoading={columnData?.isLoading}
          bookingVehicleId={columnData?.bookingVehicleId}
          timeTableRoundId={columnData?.timeTableRoundId}
          handleSetDriver={columnData?.handleSetDriver}
        />
        <Select
          ref={ref}
          components={{
            Group: (props) => <Group {...props} test={"test"} />,
            Menu: (props) => <Menu {...props} onOpen={onOpen} />,
            MenuList,
            Control: (props) => (
              <ControlComponent {...props} isValid={isValid} />
            ),
          }}
          styles={{
            container: (provided) => ({
              ...provided,
              flex: 1,
              alignSelf: "stretch",
              pointerEvents: focus ? undefined : "none",
              height: "100%",
            }),
            control: (provided) => ({
              ...provided,
              height: "100%",
              border: "none",
              boxShadow: "none",
              background: "none",
            }),
            option: (provider, state) => ({
              ...provider,
              backgroundColor: state?.isDisabled
                ? "#FFFFFF"
                : state.isSelected
                ? "#D4E3E3"
                : state.isFocused
                ? "#D4E3E3"
                : "#FFFFFF",
              color: "#333333",
              fontWeight: state?.isSelected ? 600 : "normal",
              cursor: state?.isDisabled ? "not-allowed" : "default",
              borderRadius: "6px",
            }),
            indicatorSeparator: (provided) => ({
              ...provided,
              opacity: 0,
            }),
            indicatorsContainer: (provided) => ({
              ...provided,
              opacity: active ? 1 : 0,
            }),
            placeholder: (provided) => ({
              ...provided,
              opacity: active ? 1 : 0,
            }),
            menu: (provided, state) => ({
              ...provided,
              padding: "10px",
              backgroundColor: "#FFFFFF",
              border: "1px solid #B2CCCC",
              boxShadow: "none",
              zIndex: 100,
            }),
            menuPortal: (provided, state) => ({
              ...provided,
              borderColor: "#B2CCCC",
            }),
          }}
          menuPortalTarget={document.body}
          isDisabled={Boolean(columnData?.disabled) || !columnData.vehicleId}
          value={rowData}
          menuIsOpen={focus && Boolean(columnData.vehicleId?.value)}
          onChange={(value) => {
            setRowData(value)
            setTimeout(stopEditing, 0)
          }}
          onMenuClose={() => stopEditing({ nextRow: false })}
          options={options}
          backspaceRemovesValue={false}
          formatGroupLabel={formatGroupLabel}
          placeholder=""
          isOptionDisabled={(value: any) => value.value == null || !value}
          isSearchable={false}
          isClearable
          alwaysFocusFirstMenuOption={false}
          onInputChange={(value) => null}
          inputValue={""}
          onMenuOpen={() => null}
        />
      </>
    )
  }
)

SelectDriverComponent.displayName = "SelectDriverComponent"

export const selectDriverColumn = (
  options: SelectOptions
): Partial<Column<string | null, SelectOptions>> => ({
  component: SelectDriverComponent as CellComponent<
    string | null,
    SelectOptions
  >,
  columnData: options,
  disableKeys: true,
  keepFocus: true,
  disabled: options.disabled,
  deleteValue: () => null,
  copyValue: ({ rowData }) => JSON.stringify(rowData),
  pasteValue: ({ rowData, value }) => JSON.parse(value),
})
