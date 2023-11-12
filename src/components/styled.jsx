import { Form } from 'antd'
import styled from 'styled-components'

const FormItem = Form.Item

export const StyledFormItem = styled(FormItem)`
  margin-bottom: 0;
`

export const StyledCondition = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 0 0 10px 0;
  width: 100%;
`

export const StyledRightCondition = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin: 0 0 10px 0;
  width: 100%;
`

export const ConditionItem = styled.span`
  margin-left: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

export const ConditionLeftItem = styled.span`
  margin-right: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

export const QueryContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  width: 100%;
  padding-bottom: 24px;
`

export const QueryWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  width: 100%;
`

export const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  width: 100%;
  padding-bottom: 10px;
`

export const QueryItem = styled.div`
  margin-right: 20px;
  display: flex;
  flex-direction: row;
  justify-content: center;
`

export const QueryBtnWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`

export const HeaderDivider = styled.div`
  height: 15px;
  background-color: #f0f2f5;
`

export const ContentContainer = styled.div`
  background-color: #fff;
`

export const Container = styled.div`
  width: 100%;
  background-color: #fff;
  padding: 24px;
  padding-bottom: 48px;
  border-radius: 3px;
  position: relative;
`

export const Segment = styled.div`
  width: 100%;
`

export const Title = styled.h3`
  margin: 0;
  margin-bottom: 10px;
  padding: 0;
  font-weight: bold;
`

export const Content = styled.div``
