import { axios } from '@/utils/request'

// 获取短信验证码
export const getSmsCode = (mobile) => axios.get('agent/forgetPasswordSmsSend/' + mobile)

/**
 * 统计分析
 */

/**
 * 工作台
 */
// 获取邀请码
export const getInvitationCode = (num) => axios.get('agentQuota/getQuota/' + num)

// 查询邀请码
export const getInvitationCodeInfo = (id) => axios.get('agentQuota/info/' + id)

// 获取邀请码列表
export const getInvitationCodeList = (paramObj) => axios.post('agentQuota/list', paramObj)

// 删除邀请码
export const removeInvitationCode = (ids) => axios.delete('agentQuota/deleted/' + ids)

// 查询代理商基本信息
export const getSelfAgent = () => axios.get('agent/selfInfo')

/**
 * 代理商
 */

// 添加代理商
export const addAgent = (paramObj) => axios.post('agent/add', paramObj)

// 查询代理商
export const getAgentInfo = (id) => axios.get('agent/info/' + id)

// 修改代理商
export const modifyAgent = (paramObj) => axios.put('agent/modify', paramObj)

// 删除代理商
export const removeAgent = (ids) => axios.delete('agent/deleted/' + ids)

// 审核通过
export const auditAgentOk = (ids) => axios.put('agent/auditAgentOk/' + ids)

// 审核不通过
export const auditAgentNo = (paramObj) => axios.put('agent/auditAgentNo', paramObj)

// 分页获取代理商
export const getAgentList = (paramObj) => axios.post('agent/list', paramObj)

// 启用or禁用
export const setAgentState = (paramObj) => axios.put('agent/modifyAgentState/' + paramObj.state + '/' + paramObj.idArr)

/**
 * 充值续费
 */
// 二级代理商充值
export const rechargeAgent = (paramObj) => axios.post('agentQuotaRecharge/add', paramObj)

// 申请续费
export const applyRechargeAgent = (paramObj) => axios.post('agentQuotaRecharge/applicationQuota', paramObj)

// 续费申请列表
export const getRechargeAgentList = (paramObj) => axios.post('agentQuotaRecharge/list', paramObj)

// 审核通过
export const auditRechargeAgentOk = (ids) => axios.put('agentQuotaRecharge/auditPass/' + ids)

// 审核不通过
export const auditRechargeAgentNo = (ids) => axios.put('agentQuotaRecharge/auditNotpass/' + ids)

// 冲正续费
export const correctRechargeAgent = (paramObj) => axios.post('agentQuotaRecharge/correct', paramObj)

/**
 * 业务经理
 */
// 添加业务经理
export const addBd = (paramObj) => axios.post('salesman/add', paramObj)

// 查询业务经理
export const getBdInfo = (id) => axios.get('salesman/info/' + id)

// 修改业务经理
export const modifyBd = (paramObj) => axios.put('salesman/modify', paramObj)

// 删除业务经理
export const removeBd = (ids) => axios.delete('salesman/deleted/' + ids)

// 审核通过
export const auditBdOk = (ids) => axios.put('salesman/auditAgentOk/' + ids)

// 审核不通过
export const auditBdNo = (paramObj) => axios.put('salesman/auditAgentNo', paramObj)

// 启用
export const enabledBd = (ids) => axios.put('salesman/start/' + ids)

// 禁用
export const disabledBd = (ids) => axios.put('salesman/stop/' + ids)

// 分页获取业务经理
export const getBdList = (paramObj) => axios.post('salesman/list', paramObj)

// 获取所有业务经理
export const getBdListAll = (paramObj) => axios.get('salesman/getSalesman', paramObj)

/**
 * 店铺管理
 */
// 查询店铺
export const getShopInfo = (id) => axios.get('shop/getShopInfo/' + id)

// 修改店铺
export const modifyShop = (paramObj) => axios.put('shop/bandSaleman', paramObj)

// 启用
export const enabledShop = (ids) => axios.put('shop/startShop/' + ids)

// 禁用
export const disabledShop = (ids) => axios.put('shop/startShop/' + ids)

// 分页获取店铺
export const getShopList = (paramObj) => axios.post('shop/list', paramObj)

/**
 * 佣金结算清单
 */
// 获取佣金结算清单列表
export const getBrokerageSettlementList = (paramObj) => axios.post('commissionGeneral/list', paramObj)

// 确认到账
export const setBrokerageSettlementArrived = (id) => axios.get('commissionGeneral/arrived/' + id)

/**
 * 分佣订单
 */

// 冲正分佣订单
export const correctBrokerageOrder = (paramObj) => axios.post('commissionRecordDesc/correct', paramObj)

// 获取分佣订单列表
export const getBrokerageOrderList = (paramObj) => axios.post('commissionRecordDesc/list', paramObj)

/**
 * 下级佣金结算清单
 */
// 获取佣金结算清单列表
export const getBrokerageSettlementListSubAgent = (paramObj) => axios.post('commissionGeneral/affiliate/list', paramObj)
