import { createContext, useRef, useContext } from 'react'
import { createStore } from 'zustand'
import PropTypes from 'prop-types'
import { Config } from 'src/common/config'

const createGlobalStore = (initProps) => {
  return createStore(() => ({
    ...initProps,
  }))
}
const GlobalContext = createContext({
  projectName: Config.PROJECT_NAME,
  projectNameSort: Config.PROJECT_NAME_SORT,
})

export const useGlobalStore = () => {
  return useContext(GlobalContext)
}

const GlobalProvider = ({ children, ...props }) => {
  const storeRef = useRef()
  if (!storeRef.current) {
    storeRef.current = createGlobalStore(props)
  }
  return (
    <GlobalContext.Provider value={storeRef.current}>
      {children}
    </GlobalContext.Provider>
  )
}

GlobalProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export default GlobalProvider
