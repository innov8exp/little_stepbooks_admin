import styled from 'styled-components'
import { Card, Form } from 'antd'

const AuthCard = styled(Card)`
  border-radius: 12px;
  width: 456px;
  @media (max-width: 480px) {
    width: 330px;
  }
`

const CustomFormItem = styled(Form.Item)`
  & .ant-form-item-label > label {
    display: flex;
  }
`

const CardHeader = styled.div`
  padding-bottom: 48px;
`

const LogoImg = styled.img`
  width: 73px;
  padding-bottom: 16px;
`

const MainTitle = styled.div`
  font-style: normal;
  font-size: 24px;
  font-weight: 600;
  line-height: 32px;
  color: #242424;
  padding-bottom: 8px;
`

const SubTitle = styled.div`
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  color: #7c7c7c;
`

const RequiredPrefix = styled.span`
  color: rgba(0, 0, 0, 0.25);
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
`

const LabelText = styled.div`
  font-family: 'PingFang SC';
  font-style: normal;
  font-weight: 500;
  /* line-height: 24px; */
  color: #242424;
`

const LabelWrapper = styled.div`
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

export {
  AuthCard,
  CustomFormItem,
  CardHeader,
  LogoImg,
  MainTitle,
  SubTitle,
  RequiredPrefix,
  LabelText,
  LabelWrapper,
}
