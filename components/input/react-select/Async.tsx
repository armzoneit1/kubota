/* eslint-disable react/display-name */
import * as React from "react"
import {
  forwardRef,
  MutableRefObject,
  ReactElement,
  RefAttributes,
} from "react"
import Select from "./Select"
import { GroupBase } from "react-select"
import useStateManager from "./useStateManager"
import useAsync from "./useAsync"
import type { AsyncProps } from "./useAsync"
export type { AsyncProps }

type AsyncSelect = <
  Option = unknown,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>(
  props: AsyncProps<Option, IsMulti, Group> &
    RefAttributes<Select<Option, IsMulti, Group>>
) => ReactElement

const AsyncSelect = forwardRef(
  <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
    props: AsyncProps<Option, IsMulti, Group>,
    ref:
      | ((instance: Select<Option, IsMulti, Group> | null) => void)
      | MutableRefObject<Select<Option, IsMulti, Group> | null>
      | null
  ) => {
    const stateManagedProps = useAsync(props)
    const selectProps = useStateManager(stateManagedProps)

    return <Select ref={ref} {...selectProps} />
  }
) as AsyncSelect

export { useAsync }
export default AsyncSelect
