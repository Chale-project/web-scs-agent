<template>
  <div style="background:#fff ;padding:25px;position: relative">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="结算流水号">
              <a-input v-model="queryParam.settlementSerialNumber" placeholder="请输入结算流水号" />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="结算状态">
              <a-select placeholder="请选择" v-model="queryParam.state">
                <a-select-option value="">全部</a-select-option>
                <a-select-option value="wait">未结算</a-select-option>
                <a-select-option value="already">已结算</a-select-option>
                <a-select-option value="arrived">已到账</a-select-option>
                <a-select-option value="correct">冲正</a-select-option>
                <a-select-option value="cancel">已作废</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <template v-if="advanced">
            <a-col :md="8" :sm="24">
              <a-form-item label="银行流水号">
                <a-input v-model="queryParam.bankSerialNumber" placeholder="请输入银行流水号" />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="商户名称">
                <a-input v-model="queryParam.shopName" placeholder="请输入商户名称" />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="商户编号">
                <a-input v-model="queryParam.discernId" placeholder="请输入商户编号" />
              </a-form-item>
            </a-col>

            <a-col :md="8" :sm="24">
              <a-form-item label="收入类型">
                <a-select placeholder="请选择" v-model="queryParam.incomeType">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option value="commission">分佣收入</a-select-option>
                  <!-- <a-select-option value="commission">分销收入</a-select-option> -->
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="结算时间">
                <a-range-picker v-model="dateTime" :allowClear="false" @change="onChangeDateTime" />
              </a-form-item>
            </a-col>
          </template>
          <a-col :md="!advanced && 8 || 24" :sm="24">
            <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
              <a-button type="primary" @click="queryBrokerageSettlement">查询</a-button>
              <a-button style="margin-left: 8px" @click="resetQueryParam">重置</a-button>
              <a @click="toggleAdvanced" style="margin-left: 8px">
                {{ advanced ? '收起' : '展开' }}
                <a-icon :type="advanced ? 'up' : 'down'" />
              </a>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!--功能按钮-->
    <div class="table-operator">

    </div>

    <!--表格-->
    <a-table size="middle" :columns="columns" :dataSource="loadDatas" :loading="loading" :pagination="pagination" :rowSelection="{type:'checkbox', selectedRowKeys: selectedRowKeys, onChange: updateSelect }">

      <template slot="incomeContent" slot-scope="record">
        <a-tooltip placement="topLeft">
          <template slot='title'>
            {{record}}
          </template>
          {{record}}
        </a-tooltip>
      </template>

      <template slot="incomeType" slot-scope="record">
        {{record=='commission'?'分佣收入':'其他'}}
      </template>

      <template slot="payType" slot-scope="record">
        {{record=='alipay'?'支付宝':record=='weixin'?'微信':record=='bank'?'银行卡':'其他'}}
      </template>

      <template slot="commissionMoney" slot-scope="record">
        {{record/100}}
      </template>

      <template slot="state" slot-scope="record">
        <a-tag v-if="record=='wait'">未结算</a-tag>
        <a-tag v-else-if="record=='already'">已结算</a-tag>
        <a-tag v-else-if="record=='arrived'">已到账</a-tag>
        <a-tag v-else-if="record=='correct'">冲正</a-tag>
        <a-tag v-else-if="record=='cancel'">已作废</a-tag>
      </template>

      <template slot="Action" slot-scope="text, record, index">
        <a @click="handleSettlement('detail', record)">详情</a>
        <a-divider type="vertical" v-if="record.state=='already'" />
        <a @click="handleSettlement('arrived', record, index)" v-if="record.state=='already'">确认到账</a>
      </template>
    </a-table>
    <!--分页-->
    <Pagination :current="currentPage" :pageSizeOptions="pageSizeOptions" :pageSize="pageSize" :total="totalCount" :totalPage="totalPage" @change="changePage"></Pagination>

    <!-- 新增编辑模态框 -->
    <a-modal :width="editType=='arrived'?'400px':'800px'" :title="modalTitle" :visible="visible" @ok="handleOk" :confirmLoading="confirmLoading" @cancel="handleCancel">

      <div class="modal-container" v-if="editType=='arrived'">
        {{`我确认已收到${settlementInfo.incomeContent}，金额为${settlementInfo.commissionMoney}员！`}}
      </div>

      <div class="modal-container" v-else>
        <detail-list title="结算单详情">
          <detail-list-item term="结算流水号">{{settlementInfo.settlementSerialNumber}}</detail-list-item>
          <detail-list-item term="结算状态">{{settlementInfo.state=='wait'?'未结算':settlementInfo.state=='already'?'已结算':settlementInfo.state=='arrived'?'已到账':settlementInfo.state=='correct'?'确认到账':settlementInfo.state=='cancel'?'已作废':''}}</detail-list-item>

          <detail-list-item term="商户编号">{{settlementInfo.discernId}}</detail-list-item>
          <detail-list-item term="商户名称">{{settlementInfo.shopName}}</detail-list-item>
          <detail-list-item term="收入类型">{{settlementInfo.incomeType=='commission'?'分佣收入':'其他'}}</detail-list-item>
          <detail-list-item term="结算金额">￥{{settlementInfo.commissionMoney}}</detail-list-item>
          <detail-list-item term="收入内容">{{settlementInfo.incomeContent}}</detail-list-item>
        </detail-list>
        <a-divider style="margin-bottom: 32px" />

        <detail-list title="结算信息" v-if="settlementInfo.state!=null&&settlementInfo.state!='wait'">
          <detail-list-item term="支付类型">{{settlementInfo.payType=='alipay'?'支付宝':settlementInfo.payType=='weixin'?'微信':settlementInfo.payType=='bank'?'银行卡':'其他'}}</detail-list-item>
          <detail-list-item term="收款账号">{{settlementInfo.accountCredited}}</detail-list-item>
          <detail-list-item term="收款户名">{{settlementInfo.creditedName}}</detail-list-item>
          <detail-list-item term="付款单号">{{settlementInfo.bankSerialNumber }}</detail-list-item>
          <detail-list-item term="付款账号">{{settlementInfo.accountRemit}}</detail-list-item>
        </detail-list>
        <a-divider style="margin-bottom: 32px" v-if="settlementInfo.state!=null&&settlementInfo.state!='wait'" />

        <detail-list title="结算备注" :col='1' v-if="settlementInfo.settleDescribe  ">
          <detail-list-item term="结算描述">{{settlementInfo.settleDescribe  }}</detail-list-item>
        </detail-list>

      </div>
    </a-modal>
  </div>
</template>

<script>
import Pagination from '@/components/pagination/pagination'
import DetailList from '@/components/tools/DetailList'
const DetailListItem = DetailList.Item
import { getBrokerageSettlementList, setBrokerageSettlementArrived } from '@/api/common'

const columns = [
  {
    title: '结算流水号',
    width: '10%',
    dataIndex: 'settlementSerialNumber'
  },
  {
    title: '商户编号',
    width: '10%',
    dataIndex: 'discernId'
  },
  {
    title: '商户名称',
    width: '10%',
    align: 'center',
    dataIndex: 'shopName'
  },
  {
    title: '收入内容',
    width: '10%',
    align: 'center',
    dataIndex: 'incomeContent',
    scopedSlots: { customRender: 'incomeContent' }
  },
  {
    title: '收入类型',
    width: '10%',
    align: 'center',
    dataIndex: 'incomeType',
    scopedSlots: { customRender: 'incomeType' }
  },
  {
    title: '支付类型',
    width: '10%',
    align: 'center',
    dataIndex: 'payType',
    scopedSlots: { customRender: 'payType' }
  },
  {
    title: '金额',
    width: '5%',
    align: 'center',
    dataIndex: 'commissionMoney',
    scopedSlots: { customRender: 'commissionMoney' }
  },
  {
    title: '结算状态',
    width: '10%',
    align: 'center',
    dataIndex: 'state',
    scopedSlots: { customRender: 'state' }
  },
  {
    title: '结算日期',
    width: '10%',
    align: 'center',
    dataIndex: 'settlementTime'
  },
  {
    title: '操作',
    width: '10%',
    align: 'center',
    dataIndex: 'Action',
    scopedSlots: { customRender: 'Action' }
  }
]

export default {
  name: 'brokerageSettlement',
  components: {
    Pagination,
    DetailList,
    DetailListItem
  },
  data() {
    return {
      advanced: false, // 高级搜索 展开/关闭
      queryParam: {
        settlementSerialNumber: null,
        bankSerialNumber: null,
        shopName: null,
        discernId: null,
        incomeType: '',
        state: '',
        startTime: '',
        endTime: ''
      }, // 搜索查询参数

      dateTime: [],

      columns, // 表头
      loadDatas: [], // 表格请求的数据
      pagination: false, // 不显示分页

      // 分页
      pageSizeOptions: ['10', '30', '50', '100'],
      currentPage: 1, // 当前的页数
      pageSize: 10, // 每页显示的条数
      totalPage: 0, // 总页数
      totalCount: 0, // 总条数
      loading: true,

      selectedRowKeys: [], // 选中行键
      selectedRows: [], // 选中行键值,

      settlementInfo: {
        payType: '',
        accountRemit: null,
        accountCredited: null,
        creditedName: null,
        bankSerialNumber: null,
        settleDescribe: null
      },

      editType: 'detail',
      modalTitle: '详情',
      visible: !1,
      confirmLoading: !1
    }
  },

  methods: {
    initSelectedRows() {
      this.selectedRowKeys = []
      this.selectedRows = []
    },

    // 高级搜索 展开/收起
    toggleAdvanced() {
      this.advanced = !this.advanced
    },

    // 时间筛选
    onChangeDateTime(e, l) {
      this.dateTime = e
      this.queryParam.startTime = l[0]
      this.queryParam.endTime = l[1]
    },

    // 查询
    queryBrokerageSettlement() {
      this.currentPage = 1
      this.getBrokerageSettlementList()
    },

    // 重置
    resetQueryParam() {
      this.dateTime = []

      this.queryParam.settlementSerialNumber = null
      this.queryParam.bankSerialNumber = null
      this.queryParam.shopName = null
      this.queryParam.discernId = null
      this.queryParam.incomeType = ''
      this.queryParam.state = ''
      this.queryParam.startTime = ''
      this.queryParam.endTime = ''
    },

    // 选择跟新table中的某项
    updateSelect(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },

    // 取消
    handleCancel() {
      this.visible = !1
    },

    // 确认
    handleOk() {
      const _type = this.editType
      if (_type == 'detail') {
        this.handleCancel()
      } else if (_type == 'arrived') {
        this.setArrived()
      }
    },

    // 操作结算订单
    handleSettlement(e, o, i) {
      this.editType = e
      this.settlementInfo = o
      if (this.editType == 'detail') {
        this.modalTitle = '详情'
        this.visible = !0
      } else if (this.editType == 'arrived') {
        this.initSelectedRows()
        this.selectedRows.push(o)
        this.selectedRowKeys.push(i)
        this.modalTitle = '确认已收到结算款'
        this.visible = !0
      }
    },

    // 确认到账
    setArrived() {
      const _id = this.selectedRows[0].id
      setBrokerageSettlementArrived(_id)
        .then(res => {
          if (res.code == 0) {
            this.visible = !1
            this.$message.success('操作成功！')
            this.getBrokerageSettlementList()
          } else {
            this.$message.error(res.msg)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },

    // 获取结算订单数据列表
    getBrokerageSettlementList() {
      this.initSelectedRows()

      const _data = {
        pageSize: this.pageSize,
        currentPage: this.currentPage,
        where: this.queryParam
      }
      getBrokerageSettlementList(_data)
        .then(res => {
          this.loading = !1
          if (res.code == 0) {
            this.currentPage = res.page.currentPage
            this.pageSize = res.page.pageSize
            this.totalPage = res.page.totalPage
            this.totalCount = res.page.totalCount
            if (res.page.list.length > 0) {
              this.loadDatas = res.page.list
            } else {
              this.loadDatas = []
            }
          } else {
            this.$message.error(res.msg)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },

    // 分页
    changePage(obj) {
      this.currentPage = obj.currentPage
      this.pageSize = obj.pageSize
      this.getBrokerageSettlementList()
    }
  },
  created() {
    // 列表数据请求
    this.getBrokerageSettlementList()
  }
}
</script>

<style lang="less" scoped>
/deep/ .ant-table table {
  table-layout: fixed;
}
/deep/ .ant-table table td {
  white-space: nowrap; /*控制单行显示*/
  overflow: hidden; /*超出隐藏*/
  text-overflow: ellipsis; /*隐藏的字符用省略号表示*/
}
.table-operator {
  margin-bottom: 10px;
}
.ant-pagination {
  margin-top: 20px;
  text-align: center;
}
.modal-container {
  max-height: 650px;
  padding: 0 12px;
  overflow-y: auto;
}
</style>
