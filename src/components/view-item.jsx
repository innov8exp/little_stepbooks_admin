import { Col, Row } from "antd";
import styled from "styled-components";

const Wrapper = styled.div`
  margin-bottom: 24px;
`;
const ViewItem = (label, value) => {
  return (
    <Wrapper>
      <Row>
        <Col span={4} style={{ textAlign: "right" }}>
          <span style={{ fontWeight: 500, color: "rgba(0, 0, 0, 0.5)" }}>
            {label}：
          </span>
        </Col>
        <Col span={8}>{value}</Col>
      </Row>
    </Wrapper>
  );
};

export default ViewItem;
