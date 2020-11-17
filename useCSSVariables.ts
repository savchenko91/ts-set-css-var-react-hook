import { useRef, MutableRefObject } from 'react'
import setCSSVariable, { SetCSSVariableSettings } from '@/helper/setCSSVariable'

export type SetCSSVariable = (name: string, value: number | string) => void

export type UseCSSVariables = (settings: UseCSSVariablesSettings) => [SetCSSVariable, MutableRefObject<null>]

export type UseCSSVariablesSettings = SetCSSVariableSettings

const useCSSVariables: UseCSSVariables = (settings) => {
  const ref = useRef(null)

  return [(n, v): void => setCSSVariable(ref, n, v, settings), ref]
}

export default useCSSVariables
