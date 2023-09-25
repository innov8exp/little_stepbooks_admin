import { Card, Col, Row } from 'antd'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  Tooltip,
} from 'recharts'
import { useTranslation } from 'react-i18next'

const data = [
  { name: 'Page A', uv: 400, pv: 2400, amt: 2400 },
  { name: 'Page B', uv: 500, pv: 2500, amt: 2300 },
  { name: 'Page C', uv: 300, pv: 2500, amt: 2300 },
  { name: 'Page D', uv: 800, pv: 4000, amt: 2300 },
  { name: 'Page E', uv: 500, pv: 2500, amt: 2300 },
]

const DashboardPage = () => {
  const { t } = useTranslation()
  return (
    <div>
      <Row>
        <Col span={12} style={{ padding: 5 }}>
          <Card title={t('title.userStatistics')}>
            <LineChart width={600} height={300} data={data}>
              <Line type="monotone" dataKey="uv" stroke="#8884d8" />
              <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
            </LineChart>
          </Card>
        </Col>
        <Col span={12} style={{ padding: 5 }}>
          <Card title={t('title.orderStatistics')}>
            <BarChart width={600} height={300} data={data}>
              <XAxis dataKey="name" stroke="#8884d8" />
              <YAxis />
              <Tooltip
                wrapperStyle={{
                  width: 100,
                  backgroundColor: '#ccc',
                }}
              />
              <Legend
                width={100}
                wrapperStyle={{
                  top: 40,
                  right: 20,
                  backgroundColor: '#f5f5f5',
                  border: '1px solid #d5d5d5',
                  borderRadius: 3,
                  lineHeight: '40px',
                }}
              />
              <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
              <Bar dataKey="uv" fill="#8884d8" barSize={30} />
            </BarChart>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default DashboardPage
