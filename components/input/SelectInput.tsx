import React, { useState } from "react"
import { components } from "react-select"
import Select from "../../components/input/react-select/Select"

import styles from "./select.module.css"

const groupStyles = {
  borderBottom: "2px solid #33333360",
  background: "inherit",
}

const Group = (props: any) => {
  return (
    <div style={groupStyles}>
      <components.Group {...props} />
    </div>
  )
}

const MenuList = (props: any) => {
  return (
    <components.MenuList {...props} className={styles.scroll}>
      {props.children}
    </components.MenuList>
  )
}

const headerStyles = {
  color: "#00A5A8",
  fontWeight: 600,
}

const formatGroupLabel = (data: any) => (
  <div>
    <span style={headerStyles}>{data.label}</span>
  </div>
)

const SelectInput = ({
  options,
  menuBackgroundColor = "#F5F5F5",
  invalid,
  error,
  isClearable = false,
  menuListMaxHeight = "260px",
  isLoading = false,
  ...rest
}: any) => {
  const [menuIsOpen, setMenuIsOpen] = useState(false)
  return (
    <Select
      {...rest}
      options={options}
      isClearable={isClearable}
      components={{ IndicatorSeparator: null, MenuList, Group }}
      styles={{
        menuPortal: (provided, state) => ({
          ...provided,
          borderColor: "#B2CCCC",
        }),
        menu: (provided, state) => ({
          ...provided,
          padding: "10px",
          backgroundColor: menuBackgroundColor,
          border: "1px solid #B2CCCC",
          boxShadow: "none",
          zIndex: 1000,
        }),
        menuList: (provided, state) => ({
          ...provided,
          maxHeight: menuListMaxHeight,
        }),
        container: (provided, state) => ({
          ...provided,
          borderRadius: "4px",
        }),
        control: (provided, state) => ({
          ...provided,
          borderColor: state.isFocused
            ? "#B2CCCC"
            : !error
            ? "#B2CCCC"
            : invalid
            ? "#E53E3E"
            : "#B2CCCC",
          backgroundColor: "inherit",
          boxShadow: state.isFocused
            ? "#00a5a8 0 0 0 1px"
            : !error
            ? "none"
            : invalid
            ? "#E53E3E 0 0 0 1px"
            : "none",
          "&:hover": {
            borderColor: state.isFocused
              ? "#B2CCCC"
              : !error
              ? "#B2CCCC"
              : invalid
              ? "#E53E3E"
              : "#B2CCCC",
            boxShadow: state.isFocused
              ? "#00a5a8 0 0 0 1px"
              : !error
              ? "none"
              : invalid
              ? "#E53E3E 0 0 0 1px"
              : "none",
          },
        }),
        option: (provider, { data, isDisabled, isFocused, isSelected }) => ({
          ...provider,
          backgroundColor: isDisabled
            ? null
            : isSelected
            ? "#D4E3E3"
            : isFocused
            ? "#D4E3E3"
            : null,
          color: "#333333",
          fontWeight: isSelected ? 600 : "normal",
          cursor: isDisabled ? "not-allowed" : "default",
          borderRadius: "6px",
          margin: "5px 0px",
        }),
      }}
      formatGroupLabel={formatGroupLabel}
      isLoading={isLoading}
      onInputChange={(value) => null}
      alwaysFocusFirstMenuOption={false}
      menuIsOpen={menuIsOpen}
      onMenuOpen={() => {
        setMenuIsOpen(true)
      }}
      onMenuClose={() => {
        setMenuIsOpen(false)
      }}
    />
  )
}

export default SelectInput
