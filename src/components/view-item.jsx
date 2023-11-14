import { Col, Row, Typography } from 'antd'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Wrapper = styled.div`
  margin-bottom: 24px;
`
const { Text } = Typography

const ViewItem = ({ label, value, labelSpan, valueSpan }) => {
  return (
    <Wrapper>
      <Row key={label}>
        <Col span={labelSpan ? labelSpan : 8} style={{ textAlign: 'right' }}>
          <Text type="secondary">{label}</Text>:&nbsp;&nbsp;
        </Col>
        <Col span={valueSpan ? valueSpan : 16}>{value}</Col>
      </Row>
    </Wrapper>
  )
}

ViewItem.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.any,
  labelSpan: PropTypes.number,
  valueSpan: PropTypes.number,
}

export default ViewItem
