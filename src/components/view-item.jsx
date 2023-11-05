import { Col, Row } from 'antd'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Wrapper = styled.div`
  margin-bottom: 24px;
`
const ViewItem = ({ label, value }) => {
  return (
    <Wrapper>
      <Row>
        <Col span={4} style={{ textAlign: 'right' }}>
          <span style={{ color: 'rgba(0, 0, 0, 0.5)' }}>
            {label}:&nbsp;&nbsp;
          </span>
        </Col>
        <Col span={8}>{value}</Col>
      </Row>
    </Wrapper>
  )
}

ViewItem.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.any,
}

export default ViewItem
