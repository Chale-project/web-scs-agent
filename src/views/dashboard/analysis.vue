<template>
  <div class="page-header-index-wide">
    <a-row :gutter="24">
      <a-col :sm="24" :md="12" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="总销售额" total="￥126,560">
          <a-tooltip title="总销售额" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>

          <template slot="footer">日均销售额<span>￥ 234.56</span></template>
        </chart-card>
      </a-col>

      <a-col :sm="24" :md="12" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="支付笔数" :total="6560 | NumberFormat">
          <a-tooltip title="支付笔数" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <div>
            <pay-bar-chart :dataList="payDataList" />
          </div>
          <template slot="footer">转化率 <span>60%</span></template>
        </chart-card>
      </a-col>

    </a-row>

    <a-card :loading="loading" :bordered="false" :body-style="{padding: '0'}">
      <div class="salesCard">
        <a-tabs default-active-key="1" size="large" :tab-bar-style="{marginBottom: '24px', paddingLeft: '16px'}">
          <div class="extra-wrapper" slot="tabBarExtraContent">
            <div class="extra-item">
              <a-tabs :activeKey="time" @change="checkDateTimeQuick">
                <a-tab-pane :tab="v.value" :key="v.key" v-for="v in extraData"></a-tab-pane>
              </a-tabs>
            </div>
            <a-range-picker v-model="dateTime" :allowClear="false" @change="onChangeDateTime" :style="{display:'inline-block',width: '256px',float:'right',padding:'11px 10px'}" />
          </div>

          <a-tab-pane loading="true" tab="销售额" key="1">
            <a-row>
              <a-col :xl="16" :lg="12" :md="12" :sm="24" :xs="24">
                <bar title="销售额排行" />
              </a-col>
              <a-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                <rank-list title="店铺销售排行榜" :list="rankList" />
              </a-col>
            </a-row>
          </a-tab-pane>

        </a-tabs>
      </div>
    </a-card>

  </div>
</template>

<script>
import ChartCard from '@/components/chart/ChartCard'
import MiniArea from '@/components/chart/MiniArea'
import payBarChart from '@/components/chart/payBarChart'
import RankList from '@/components/chart/RankList'
import Bar from '@/components/chart/Bar'

import moment from 'moment'
const payDataList = []
const beginDay = new Date().getTime()

for (let i = 0; i < 10; i++) {
  payDataList.push({
    x: moment(new Date(beginDay + 1000 * 60 * 60 * 24 * i)).format(
      'YYYY-MM-DD'
    ),
    y: Math.round(Math.random() * 10)
  })
}

const rankList = []
for (let i = 0; i < 7; i++) {
  rankList.push({
    name: '白鹭岛 ' + (i + 1) + ' 号店',
    total: 1234.56 - i * 100
  })
}

export default {
  name: 'Analysis',
  components: {
    ChartCard,
    MiniArea,
    payBarChart,
    RankList,
    Bar
  },
  data () {
    return {
      loading: true,
      extraData: [
        { key: 'today', value: '今日' },
        { key: 'yesterday', value: '昨日' },
        { key: 'week', value: '本周' },
        { key: 'month', value: '本月' },
        { key: 'year', value: '本年度' }
      ],
      time: 'today',
      dateTime: [],
      payDataList,
      rankList
    }
  },
  created () {
    setTimeout(() => {
      this.loading = !this.loading
    }, 1000)
  },
  methods: {
    // 时间标签快捷选择
    checkDateTimeQuick (e) {
      this.dateTime = []
      this.time = e
    },

    // 时间筛选
    onChangeDateTime (e, l) {
      this.dateTime = e
      this.startTime = l[0]
      this.endTime = l[1]
      this.time = 'today'
    }
  }
}
</script>

<style lang="less" scoped>
.extra-wrapper {
  .extra-item {
    display: inline-block;
    /deep/ .ant-tabs.ant-tabs-top.ant-tabs-line .ant-tabs-nav .ant-tabs-tab {
      margin: 0;
    }
    /deep/
      .ant-tabs.ant-tabs-top.ant-tabs-line
      .ant-tabs-bar
      .ant-tabs-nav-container {
      font-size: 14px;
    }
  }
}
</style>
