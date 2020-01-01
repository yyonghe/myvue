<template>
  <div class="app-container">
    <el-form ref="form" v-loading="formLoading" :model="iform" label-width="85px">
      <el-form-item label="ID">
        <el-input v-model="iform.id" :disabled="true" />
      </el-form-item>
      <el-form-item label="Key">
        <el-input v-model="iform.key" :disabled="true" />
      </el-form-item>
      <el-form-item label="负责人">
        <el-input v-model="iform.author" :disabled="true" />
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
                      <span>审批人员:</span>
                    </el-col>
                    <el-col :span="12">
                      <el-select
                        v-model="approval.operators"
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
                    </el-col>
                    <el-col :span="6" style="margin-left:15px;line-height: 40px;">
                      <el-radio-group v-model="approval.mode">
                        <div>
                          <el-radio :label="'&'">都审批通过生效</el-radio>
                        </div>
                        <div style="margin-top: 5px">
                          <el-radio :label="'|'">任意一人审批通过生效</el-radio>
                        </div>
                      </el-radio-group>
                    </el-col>
                  </el-row>
                  <el-row class="flowRow">
                    <el-col :span="rowLabelSpan" class="colLabel">
                      <span>结果回调:</span>
                    </el-col>
                    <el-col :span="12">
                      <el-select v-model="approval.notify.type">
                        <el-option label="不回调" value="0" />
                        <el-option label="HTTP回调" value="1" />
                        <el-option label="TRPC回调" value="2" />
                      </el-select>
                    </el-col>
                  </el-row>
                  <div v-if="approval.notify.type==1">
                    <el-row class="flowRow">
                      <el-col :span="rowLabelSpan" class="colLabel">
                        <span>回调URL:</span>
                      </el-col>
                      <el-col :span="12">
                        <el-input v-model="approval.notify.url" />
                      </el-col>
                    </el-row>
                  </div>
                </el-card>
              </el-timeline-item>
              <el-timeline-item v-if="(index+1) !== iform.approvals.length" timestamp="0" style="display: none" />
            </el-timeline>
          </div>
        </div>
        <el-row class="flowRow">
          <el-col :span="24">
            <el-button style="width:100%;border:none;background-color:#ecf5ff50" @click="addFlowNode(iform)">添加审批</el-button>
          </el-col>
        </el-row>
      </div>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">Create</el-button>
        <el-button v-show="cancelVisiable" @click="cancelModifyFlow()">Cancel</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

import { /* newApprovalFlow, */getApprovalFlow, updateApprovalFlow } from '@/api/approval-flow'
import { formatFlowLevelTitle } from '@/utils/index'

export default {
  props: {
    form: {
      type: Object,
      default: () => {
        return {
          name: ''
        }
      }
    },
    cancelVisiable: Boolean
  },
  data() {
    return {
      rowLabelSpan: 1,
      operatorOptions: [],
      operatorOptionLoading: false,
      formLoading: true,
      iform: JSON.parse(JSON.stringify(this.form)),
      activeName: [1, 2, 3, 4, 5, 6, 7, 8, 9]
    }
  },
  mounted() {
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
      updateApprovalFlow(this.iform).then(response => {
        this.formLoading = false
        this.form = Object.assign(this.form, this.iform)
      }).catch(() => {
        this.formLoading = false
      })
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
        mode: '|',
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
  width: 70px;
}
.colLabel span {
  line-height: 40px;
}
</style>

