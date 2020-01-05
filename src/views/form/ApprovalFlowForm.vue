<template>
  <div class="app-container">
    <el-form ref="form" v-loading="formLoading" :model="iform" label-width="95px">
      <el-form-item label="ID">
        <el-input v-model="iform.id" :disabled="true" />
      </el-form-item>
      <el-form-item label="Key">
        <el-input v-model="iform.key" :disabled="true" />
      </el-form-item>
      <el-form-item label="创建人">
        <el-input v-model="iform.author" :disabled="true" />
      </el-form-item>
      <el-form-item>
        <div slot="label" style="position: relative;">
          <div style="position: absolute;right: 0;">
            <span>所属业务</span>
          </div>
          <div style="position: absolute;right: 0;padding-top: 12px;">
            <el-tooltip effect="dark" content="在相关业务下创建审批流程，需要申请对应业务创建审批流程的权限" placement="top-start">
              <router-link to="/approvalflow/list">
                <span style="line-height: 10px;font-size: 10px;font-weight: 100;font-style:italic;text-decoration:underline;">(申请权限)</span>
              </router-link>
            </el-tooltip>
          </div>
        </div>
        <el-select
          v-model="iform.bid"
          placeholder="请选择所属业务"
          style="width:100%"
        >
          <el-option v-for="item in approvalBuisOptions" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="流程名称">
        <el-input v-model="iform.name" />
      </el-form-item>
      <el-form-item label="流程说明">
        <el-input v-model="iform.desc" type="textarea" />
      </el-form-item>
      <el-form-item label="管理员">
        <el-select
          v-model="iform.admins"
          multiple
          remote
          filterable
          allow-create
          placeholder="请选择"
          :remote-method="remoteMethod"
          :loading="operatorOptionLoading"
          value-key="name"
          style="width:100%"
        >
          <el-option v-for="item in operatorOptions" :key="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item label="结果知会人">
        <el-select
          v-model="iform.mailto"
          multiple
          remote
          filterable
          allow-create
          placeholder="请选择"
          :remote-method="remoteMethod"
          :loading="operatorOptionLoading"
          value-key="name"
          style="width:100%"
        >
          <el-option v-for="item in operatorOptions" :key="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <span slot="label">
          驳回回调
          <el-tooltip effect="dark" :content="callbackComment('驳回')" placement="top-start">
            <i class="el-icon-info" />
          </el-tooltip>
        </span>
        <!-- <el-select v-model="iform.fnotify.type" style="width:100%">
          <el-option label="不回调" :value="0" />
          <el-option label="HTTP回调" :value="1" />
          <el-option label="TRPC回调" :value="2" />
        </el-select>
        <div v-if="iform.fnotify.type==1" style="margin-top: 5px;">
          <span>回调URL</span>
          <el-input v-model="iform.fnotify.url" style="width:60%" />
        </div> -->
        <approval-notify :notify="iform.fnotify" />
      </el-form-item>
      <el-form-item label="审批流程" />
      <div>
        <div v-for="(approval,index) in iform.approvals" :key="index">
          <div style="float: left;margin-top: 0px;margin-left: 39px;position: absolute;z-index: 100;font-size: 24px">
            <el-popconfirm title="确定删除当前审批步骤？" @onConfirm="removeFlowNode(iform.approvals,index)">
              <i slot="reference" class="el-icon-remove" />
            </el-popconfirm>
          </div>
          <div style="padding-top: 5px;padding-left: 5px;">
            <el-timeline>
              <el-timeline-item :timestamp="handleFlowTitle(index)" placement="top">
                <el-card>
                  <el-row>
                    <el-col :span="rowLabelSpan" class="colLabel">
                      <span>审批人员</span>
                    </el-col>
                    <el-col :span="12" style="white-space:nowrap;">
                      <el-select v-model="approval.mode" style="width:140px;" @change="handleApprovalModeChange(approval)">
                        <el-option label="Leader审批" :value="0" />
                        <el-option label="指定人员审批" :value="handleApprovalMode(approval.mode)" />
                      </el-select>
                      <span v-if="index==0" v-show="approval.mode==0" style="margin-left: 5px;font-style:italic;font-size: 11px;">*申请人的Leader</span>
                      <span v-else v-show="approval.mode==0" style="margin-left: 5px;font-style:italic;font-size: 11px;">*{{ handleFlowTitle(index-1) }}人的Leader</span>
                    </el-col>
                    <div v-show="approval.mode!=0" style="margin: 45px 0 0 80px;">
                      <el-col :span="12">
                        <el-select
                          v-model="approval.operators"
                          multiple
                          remote
                          filterable
                          allow-create
                          placeholder=""
                          :remote-method="remoteMethod"
                          :loading="operatorOptionLoading"
                          value-key="name"
                          style="width:100%"
                        >
                          <el-option v-for="item in operatorOptions" :key="item" :value="item" />
                        </el-select>
                      </el-col>
                      <el-col :span="6" style="margin-left:15px;line-height: 40px;">
                        <el-radio-group v-model="approval.mode">
                          <div>
                            <el-radio :label="1">都审批通过才生效</el-radio>
                          </div>
                          <div style="margin-top: 5px">
                            <el-radio :label="2">任意一人审批通过生效</el-radio>
                          </div>
                        </el-radio-group>
                      </el-col>
                    </div>
                  </el-row>
                  <el-row class="flowRow">
                    <el-col :span="rowLabelSpan" class="colLabel">
                      <span>通过回调
                        <el-tooltip effect="dark" :content="callbackComment('通过')" placement="top-start">
                          <i class="el-icon-info" />
                        </el-tooltip>
                      </span>
                    </el-col>
                    <el-col :span="12">
                      <approval-notify :notify="approval.notify" />
                    </el-col>
                    <!-- <el-col :span="6">
                      <el-select v-model="approval.notify.type" style="width:140px;">
                        <el-option label="不回调" :value="0" />
                        <el-option label="HTTP回调" :value="1" />
                        <el-option label="TRPC回调" :value="2" />
                      </el-select>
                    </el-col> -->
                  </el-row>
                  <!-- <div v-if="approval.notify.type==1">
                    <el-row class="flowRow">
                      <el-col :span="rowLabelSpan" class="colLabel">
                        <span>回调URL</span>
                      </el-col>
                      <el-col :span="12">
                        <el-input v-model="approval.notify.url" />
                      </el-col>
                    </el-row>
                  </div> -->
                </el-card>
              </el-timeline-item>
              <el-timeline-item v-if="(index+1) !== iform.approvals.length" timestamp="0" style="display: none" />
            </el-timeline>
          </div>
        </div>
        <el-row class="flowRow">
          <el-col :span="24">
            <el-button style="width:100%;border:none;background-color:#ecf5ff50" @click="addFlowNode(iform)">添加审批环节</el-button>
          </el-col>
        </el-row>
      </div>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">
          <span v-if="cancelVisiable">提交</span>
          <span v-else>创建</span>
        </el-button>
        <el-button v-show="cancelVisiable" @click="cancelModifyFlow()">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

import { /* newApprovalFlow, */getApprovalFlow, updateApprovalFlow } from '@/api/approval-flow'
import { getApprovalBusiList } from '@/api/approval-business'
import { formatFlowLevelTitle } from '@/utils/index'
import ApprovalNotify from '@/components/ApprovalNotify'

export default {
  components: {
    ApprovalNotify
  },
  props: {
    form: {
      type: Object,
      default: () => {
        return {
          name: '',
          fnotify: {
            type: 0
          }
        }
      }
    },
    cancelVisiable: Boolean
  },
  data() {
    return {
      rowLabelSpan: 1,
      approvalMode: '0',
      operatorOptions: [],
      approvalBuisOptions: [],
      operatorOptionLoading: false,
      formLoading: true,
      iform: JSON.parse(JSON.stringify(this.form)),
      activeName: [1, 2, 3, 4, 5, 6, 7, 8, 9]
    }
  },
  mounted() {
    getApprovalBusiList().then(rsp => {
      this.approvalBuisOptions = rsp.data.items
    })
    if (this.iform.name === '') {
      getApprovalFlow().then(response => {
        this.iform = response.data.item
        this.formLoading = false
      }).catch(() => {
        this.formLoading = false
      })
    } else {
      this.formLoading = false
    }
    //
    // this.formLoading = false
  },
  methods: {
    onSubmit() {
      this.formLoading = true
      // this.$emit('closeModifyFlow')
      var i = 0
      for (i in this.iform.approvals) {
        if (this.iform.approvals[i].mode === 0) {
          this.iform.approvals[i].operators = ['$Leader$']
        }
      }
      updateApprovalFlow(this.iform).then(response => {
        this.formLoading = false
        this.form = Object.assign(this.form, this.iform)
      }).catch(() => {
        this.formLoading = false
      })
    },
    callbackComment(how) {
      return '审批' + how + '时，回调通知业务后台的方式，业务后台可以根据结果做后续操作(如奖励发放、资料数据修改、终止流程等)，如果不需要，选择不回调即可'
    },
    cancelModifyFlow() {
      if (this.formLoading) {
        this.$message({
          message: '数据处理中，请稍等...',
          duration: 1000
        })
      } else {
        this.iform = JSON.parse(JSON.stringify(this.form))
        this.$emit('closeModifyFlow')
      }
    },
    handleFlowTitle(index) {
      return formatFlowLevelTitle(index)
    },
    addFlowNode(item) {
      item.approvals.push({
        operators: [],
        mode: 0,
        notify: {
          type: '0'
        }
      })
    },
    removeFlowNode(approvals, index) {
      approvals.splice(index, 1)
    },
    remoteMethod(query) {
      this.operatorOptionLoading = true
      this.options = []
      this.operatorOptionLoading = false
    },
    handleApprovalMode(mode) {
      return mode === 0 ? 1 : mode
    },
    handleApprovalModeChange(approval) {
      var n = []
      var i = 0
      for (i in approval.operators) {
        if (approval.operators[i].toLowerCase() !== '$leader$') {
          n.push(approval.operators[i])
        }
      }
      approval.operators = n
    }
  }
}
</script>

<style scoped>
.line {
  text-align: center;
}
.flowRow {
  margin-top: 8px;
  vertical-align: middle;
}
.colLabel {
  text-align: right;
  padding-right: 5px;
  width: 80px;
}
.colLabel span {
  line-height: 40px;
}
</style>

