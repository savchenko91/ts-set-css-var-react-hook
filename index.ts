import { useRef, MutableRefObject } from 'react'
import setCSSVariable, { SetCSSVariableSettings } from './util'

export type SetCSSVariable = (key: string, value: number | string) => void

const useCSSVariables = (settings?: SetCSSVariableSettings): [MutableRefObject<null>, SetCSSVariable] => {
  const ref = useRef(null)

  return [ref, (key, value): void => setCSSVariable(ref, key, value, settings)]
}

export default useCSSVariables
