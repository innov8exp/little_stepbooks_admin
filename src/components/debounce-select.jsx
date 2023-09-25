import { Empty, message, Select, Space, Spin } from 'antd'
import debounce from 'lodash/debounce'
import PropTypes from 'prop-types'
import React from 'react'
import i18n from '@/locales/i18n'

const DebounceSelect = ({ fetchOptions, debounceTimeout = 800, ...props }) => {
  const [fetching, setFetching] = React.useState(false)
  const [options, setOptions] = React.useState([])
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
            `${i18n.t('message.error.failureReason')}${
              err.response?.data?.message
            }`,
          ),
        )
    }

    return debounce(loadOptions, debounceTimeout)
  }, [fetchOptions, debounceTimeout])

  return (
    <Select
      labelInValue
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
  fetchOptions: PropTypes.func,
  debounceTimeout: PropTypes.number,
}

export default DebounceSelect
