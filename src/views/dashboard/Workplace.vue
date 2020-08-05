<template>
  <div class="workplace-index">
    <div class="workplace-header">
      <h1 class="title">{{ timeFix }}，{{ userInfo.userRealname }}<span class="welcome-text">，{{ welcome() }}</span></h1>
      <div>让我的信息给你带来今天的好运！</div>
    </div>
    <div class="data-face-plate">
      <a-row :gutter="24">
        <a-col :sm="12" :md="8" :lg="6" :style="{ marginBottom: '24px' }">
          <chart-card :loading="loading" title="30日预估收益" total="￥ 126,560">
            <a-tooltip title="预估收益" slot="action">
              <a-icon type="info-circle-o" />
            </a-tooltip>
            <trend style="margin-right: 16px;">
              <span slot="term">昨日</span>
              ￥ 12
            </trend>
            <trend flag="down">
              <span slot="term">7日</span>
              ￥ 11
            </trend>
            <template slot="footer">今日预估收益<span>￥ 234.56</span></template>
          </chart-card>
        </a-col>

        <a-col :sm="12" :md="8" :lg="6" :style="{ marginBottom: '24px' }">
          <chart-card :loading="loading" title="30日支付笔数" total="6560">
            <a-tooltip title="支付笔数" slot="action">
              <a-icon type="info-circle-o" />
            </a-tooltip>
            <trend style="margin-right: 16px;">
              <span slot="term">昨日</span>
              12
            </trend>
            <trend flag="down">
              <span slot="term">7日</span>
              11
            </trend>
            <template slot="footer">今日支付笔数<span>2346</span></template>
          </chart-card>
        </a-col>

        <a-col :sm="12" :md="8" :lg="6" :style="{ marginBottom: '24px' }">
          <chart-card :loading="loading" title="30日门店数" total="6560">
            <a-tooltip title="门店数" slot="action">
              <a-icon type="info-circle-o" />
            </a-tooltip>
            <trend style="margin-right: 16px;">
              <span slot="term">昨日</span>
              12
            </trend>
            <trend flag="down">
              <span slot="term">7日</span>
              11
            </trend>
            <template slot="footer">今日新增<span>56</span></template>
          </chart-card>
        </a-col>

        <a-col :sm="12" :md="8" :lg="6" :style="{ marginBottom: '24px' }">
          <chart-card :loading="loading" title="30日访问量" total="6560">
            <a-tooltip title="访问量" slot="action">
              <a-icon type="info-circle-o" />
            </a-tooltip>
            <trend style="margin-right: 16px;">
              <span slot="term">昨日</span>
              12
            </trend>
            <trend flag="down">
              <span slot="term">7日</span>
              11
            </trend>
            <template slot="footer">今日访问量<span>2346</span></template>
          </chart-card>
        </a-col>
      </a-row>
    </div>

    <div class="workplace-content">
      <div class="data-overview">
        <a-row :gutter='{ xs: 8, sm: 16, md: 24}'>
          <a-col :span="24">
            <a-card hoverable>
              <div class="data-overview-item invitation-code-surplus">
                <div class="data-overview-item-header">
                  <div class="data-overview-item-icon">
                    <img src="~@/assets/wxapp_icon.png" width="40">
                  </div>
                  <div class="data-overview-item-title">
                    小程序剩余
                  </div>
                </div>
                <div class="data-overview-item-content">
                  <span>{{agentInfo.quota||0}}</span> 套
                </div>
                <div class="data-overview-item-footer">
                  <a-button type="primary" size="large" icon="pay-circle" @click="handleCode('apply')" :disabled="agentInfo.quota?false:true">申请续加小程序</a-button>
                </div>
              </div>
            </a-card>
          </a-col>
        </a-row>
      </div>

      <div class="table-operator">
        <a-button type="primary" size="large" icon="code" @click="handleCode('add')" :disabled="agentInfo.quota?false:true">生成邀请码</a-button>
        <span class="description">商户创建店铺时使用一次邀请码则扣减一套小程序</span>
      </div>
      <div class="delete-invitation-code">
        <a-button type="primary" size="large" icon="delete" @click="handleCode('batchDelete')">批量删除</a-button>
      </div>

      <!--表格-->
      <a-table size="middle" :columns="columns" :dataSource="loadDatas" :loading="loading" :pagination="pagination" :rowSelection="{type:'checkbox', selectedRowKeys: selectedRowKeys, onChange: updateSelect }">

        <template slot="state" slot-scope="record">
          <a-tag v-if="record=='enabled'">未使用</a-tag>
          <a-tag v-else-if="record=='disabled'" color="#87d068">已使用</a-tag>
        </template>
        <template slot="Action" slot-scope="text, record, index">
          <a @click="handleCode('detail', record)" v-if="record.state=='disabled'">详情</a>
          <a @click="handleCode('delete', record, index)" v-else-if="record.state=='enabled'">删除</a>
        </template>
      </a-table>
      <!--分页-->
      <Pagination :current="currentPage" :pageSizeOptions="pageSizeOptions" :pageSize="pageSize" :total="totalCount" :totalPage="totalPage" @change="changePage"></Pagination>

    </div>

    <!-- 新增编辑模态框 -->
    <a-modal :width="editType=='detail'?'800px':'400px'" :title="modalTitle" :visible="visible" @ok="handleOk" :confirmLoading="confirmLoading" @cancel="handleCancel">
      <p v-if="editType=='delete'">确认删除所选邀请码？</p>
      <p v-else-if="editType=='batchDelete'">确认批量删除所选邀请码？</p>
      <p v-else-if="editType=='add'">确认生成邀请码？</p>

      <div class="modal-container" v-else-if="editType=='apply'">
        <a-form>
          <a-row :gutter="24">
            <a-col :md="24" :sm="24">
              <a-form-item label="续费金额" :required="true">
                <a-input type="number" v-model="renew.money" addonAfter="元" placeholder="请输入续费金额" />
              </a-form-item>
            </a-col>
            <a-col :md="24" :sm="24">
              <a-form-item label="续费套数" :required="true">
                <a-input type="number" v-model="renew.quota" addonAfter="套" placeholder="请输入续费套数" />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <div class="modal-container" v-else-if="editType=='detail'">
        <a-card :bordered="false">
          <detail-list title="邀请码详情" :col="2">
            <detail-list-item term="邀请码">{{codeInfo.invitationCode}}</detail-list-item>
            <detail-list-item term="受邀门店">{{codeInfo.shopName}}</detail-list-item>
            <detail-list-item term="使用状态">
              <a-tag v-if="codeInfo.state=='enabled'">未使用</a-tag>
              <a-tag v-else-if="codeInfo.state=='disabled'" color="#87d068">已使用</a-tag>
            </detail-list-item>
            <detail-list-item term="使用时间">{{codeInfo.verificationTime}}</detail-list-item>
          </detail-list>
          <a-divider style="margin-bottom: 32px" />
        </a-card>
      </div>
    </a-modal>
  </div>
</template>

<script>
import ChartCard from '@/components/chart/ChartCard'
import Pagination from '@/components/pagination/pagination'

import {
  applyRechargeAgent,
  getInvitationCode,
  getInvitationCodeList,
  getInvitationCodeInfo,
  removeInvitationCode
} from '@/api/common'
import { timeFix } from '@/utils/util'
import { mapState, mapGetters } from 'vuex'
import DetailList from '@/components/tools/DetailList'
const DetailListItem = DetailList.Item
const columns = [
  {
    title: '邀请码',
    width: '20%',
    dataIndex: 'invitationCode'
  },
  {
    title: '归属代理商',
    width: '20%',
    dataIndex: 'agentName'
  },
  {
    title: '受邀门店',
    width: '20%',
    dataIndex: 'shopName'
  },
  {
    title: '使用状态',
    width: '20%',
    align: 'center',
    dataIndex: 'state',
    scopedSlots: { customRender: 'state' }
  },
  {
    title: '操作',
    width: '20%',
    align: 'center',
    dataIndex: 'Action',
    scopedSlots: { customRender: 'Action' }
  }
]

export default {
  name: 'workplace',
  components: {
    ChartCard,
    Pagination,
    DetailList,
    DetailListItem
  },
  data() {
    return {
      timeFix: timeFix(),

      columns, // 表头
      loadDatas: [], // 表格请求的数据
      pagination: false, // 不显示分页

      // 分页
      pageSizeOptions: ['10', '30', '50', '100'],
      currentPage: 1, // 当前的页数
      pageSize: 10, // 每页显示的条数
      totalPage: 0, // 总页数
      totalCount: 0, // 总条数
      loading: false,

      selectedRowKeys: [], // 选中行键
      selectedRows: [], // 选中行键值,

      renew: {
        money: null,
        quota: null
      },

      number: 1, // 每次次获取邀请码数量
      codeInfo: {},

      editType: 'add',
      modalTitle: '生成邀请码',
      visible: !1,
      confirmLoading: !1
    }
  },
  computed: {
    userInfo() {
      return this.$store.getters.userInfo
    },

    ...mapState({
      agentInfo: state => state.user.agentInfo
    })
  },

  methods: {
    ...mapGetters(['welcome']),

    initSelectedRows() {
      this.selectedRowKeys = []
      this.selectedRows = []
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
      if (_type == 'add') {
        this.getInvitationCode()
      } else if (_type == 'delete') {
        this.deleteInvitationCode()
      } else if (_type == 'batchDelete') {
        this.deleteInvitationCode()
      } else if (_type == 'detail') {
        this.handleCancel()
      } else if (_type == 'apply') {
        const flag = this.checkRenewData()
        flag && this.applyRenew()
      }
    },

    // 操作邀请码
    handleCode(e, o, i) {
      this.editType = e
      if (this.editType == 'add') {
        this.modalTitle = '生成邀请码'
        this.visible = !0
      } else if (this.editType == 'delete') {
        this.selectedRowKeys = []
        this.selectedRows = []
        this.selectedRows.push(o)
        this.selectedRowKeys.push(i)
        this.modalTitle = '删除'
        this.visible = !0
      } else if (this.editType == 'batchDelete') {
        if (this.selectedRows.length < 1) {
          this.$message.warning('请选择删除项！')
          return false
        } else {
          this.modalTitle = '删除'
          this.visible = !0
        }
      } else if (this.editType == 'detail') {
        this.modalTitle = '详情'
        this.getInvitationCodeInfo(o.id)
      } else if (this.editType == 'apply') {
        this.modalTitle = '申请续加小程序'
        this.visible = !0
      }
    },

    //获取邀请码
    getInvitationCode() {
      getInvitationCode(this.number)
        .then(res => {
          if (res.code == 0) {
            this.visible = !1
            this.$message.success('获取成功！')
            --this.agentInfo.quota
            this.getInvitationCodeList()
          } else {
            this.$message.error(res.msg)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },

    // 获取邀请码列表
    getInvitationCodeList() {
      this.initSelectedRows()
      const _data = {
        pageSize: this.pageSize,
        currentPage: this.currentPage,
        where: {}
      }
      getInvitationCodeList(_data)
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

    //申请续费数据校验
    checkRenewData() {
      const _data = this.renew
      const number = /^\d+$/

      const reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
      if (!reg.test(_data.money)) {
        this.$message.warning('请填写续费金额！')
        return false
      } else if (!number.test(_data.quota)) {
        this.$message.warning('请填写整数套数字！')
        return false
      } else if (_data.quota < 1) {
        this.$message.warning('套数必须大于0！')
        return false
      } else {
        return true
      }
    },

    //申请续费
    applyRenew() {
      const _data = this.renew
      _data.money = _data.money * 100
      applyRechargeAgent(_data)
        .then(res => {
          if (res.code == 0) {
            this.visible = !1
            this.$message.success('您的申请已提交，请等待上级审核！')
          } else {
            this.$message.error(res.msg)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },

    //删除邀请码
    deleteInvitationCode() {
      const _idsArr = this.selectedRows.map(item => {
        return item.id
      })
      const _num = _idsArr.length
      removeInvitationCode(_idsArr)
        .then(res => {
          if (res.code == 0) {
            this.visible = !1
            this.$message.success('邀请码已删除！')
            this.agentInfo.quota = this.agentInfo.quota + _num
            this.getInvitationCodeList()
          } else {
            this.$message.error(res.msg)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },

    // 获取邀请码信息
    getInvitationCodeInfo(id) {
      let _id = null
      if (id) _id = id
      else _id = this.selectedRows[0].id
      getInvitationCodeInfo(_id)
        .then(res => {
          if (res.code == 0) {
            this.codeInfo = res.info
            this.visible = !0
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
      this.getInvitationCodeList()
    }
  },

  created() {
    this.getInvitationCodeList()
  },
  mounted() {}
}
</script>

<style lang="less" scoped>
.workplace-header {
  background: #fff;
  padding: 16px 32px;
  margin: -24px -24px 24px;
  border-bottom: 1px solid #e8e8e8;
  .title {
    font-size: 20px;
    line-height: 28px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
    margin-bottom: 16px;
  }
}

.workplace-content {
  position: relative;
  padding: 24px;
  background: #fff;
  .data-overview {
    margin-bottom: 24px;
    .data-overview-item {
      .data-overview-item-header {
        display: flex;
        align-content: center;
        .data-overview-item-icon {
        }
        .data-overview-item-title {
          font-size: 24px;
          padding-left: 10px;
        }
      }
      .data-overview-item-content {
        text-align: center;
        padding: 10px 0;
        span {
          font-size: 32px;
          color: #1890ff;
        }
      }
      .data-overview-item-footer {
        text-align: right;
      }
    }
  }

  .table-operator {
    padding: 24px;
    border: 1px solid #e8e8e8;
    .description {
      padding-left: 10px;
      color: #ccc;
    }
  }
  .delete-invitation-code {
    padding: 10px 25px;
  }
}

.mobile {
  .headerContent .title .welcome-text {
    display: none;
  }
}
</style>
