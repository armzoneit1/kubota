import React from "react"
import { components } from "react-select"
import Async from "../../components/input/react-select/Async"
import styles from "./select.module.css"
import filter from "lodash/filter"
import toLower from "lodash/toLower"
import includes from "lodash/includes"

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

const AsyncSelectInput = ({
  options,
  menuBackgroundColor = "#F5F5F5",
  invalid,
  error,
  isClearable = true,
  limit = 10,
  ...rest
}: any) => {
  const filterOptions = (inputValue: string) => {
    return options
      ? filter(options, (o) => includes(toLower(o.label), toLower(inputValue)))
      : []
  }

  const loadOptions = (
    inputValue: string,
    callback: (options: any[]) => void
  ) => {
    setTimeout(() => {
      callback(filterOptions(inputValue)?.slice(0, limit))
    }, 1000)
  }
  return (
    <Async
      cacheOptions
      defaultOptions
      loadOptions={loadOptions}
      isClearable={isClearable}
      defaultValue={rest?.value}
      {...rest}
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
          zIndex: 10,
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
      alwaysFocusFirstMenuOption={false}
    />
  )
}

export default AsyncSelectInput
