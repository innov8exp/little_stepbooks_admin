import { Empty, message, Select, Space, Spin } from 'antd'
import debounce from 'lodash/debounce'
import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

const DebounceSelect = ({
  initOptions,
  fetchOptions,
  debounceTimeout = 800,
  ...props
}) => {
  const { t } = useTranslation()
  const [fetching, setFetching] = React.useState(false)
  const [options, setOptions] = React.useState(initOptions)
  const fetchRef = React.useRef(0)

  const debounceFetcher = React.useMemo(() => {
    const loadOptions = (value) => {
      fetchRef.current += 1
      const fetchId = fetchRef.current
      setOptions([])
      setFetching(true)

      fetchOptions(value)
        .then((newOptions) => {
          if (fetchId !== fetchRef.current) {
            // for fetch callback order
            return
          }
          console.log('the value:', newOptions)
          setOptions(newOptions)
          setFetching(false)
        })
        .catch((err) =>
          message.error(
            `${t('message.error.failureReason')}${err.response?.data?.message}`,
          ),
        )
    }

    return debounce(loadOptions, debounceTimeout)
  }, [debounceTimeout, fetchOptions, t])

  useEffect(() => {
    setOptions(initOptions)
  }, [initOptions])

  return (
    <Select
      filterOption={false}
      onSearch={debounceFetcher}
      notFoundContent={
        fetching ? (
          <Space>
            <Spin size="small" />
            <span>搜索中...</span>
          </Space>
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )
      }
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      options={options}
    />
  )
}

DebounceSelect.propTypes = {
  initOptions: PropTypes.array,
  fetchOptions: PropTypes.func,
  debounceTimeout: PropTypes.number,
}

export default DebounceSelect
