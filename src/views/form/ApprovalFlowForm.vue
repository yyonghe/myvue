<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="ID">
        <el-input v-model="form.id" :disabled="true" />
      </el-form-item>
      <el-form-item label="Key">
        <el-input v-model="form.key" :disabled="true" />
      </el-form-item>
      <el-form-item label="流程名称">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="流程说明">
        <el-input v-model="form.desc" type="textarea" />
      </el-form-item>
      <el-form-item label="结果知会人">
        <el-select
          v-model="form.mailto"
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
      <el-form-item label="审批关系">
        <div v-for="(approval,index) in form.approvals" :key="index">
          <div style="float: left;margin-top: 5px;">
            <el-popconfirm title="确定删除当前审批步骤？" @onConfirm="removeFlowNode(form.approvals,index)">
              <i slot="reference" class="el-icon-remove" />
            </el-popconfirm>
          </div>
          <el-collapse v-model="activeName" style="margin-left: 22px;">
            <el-collapse-item :title="handleFlowTitle(index)" :name="index+1">
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
                    <el-radio :label="'&'">都审批通过生效</el-radio>
                    <br />
                    <el-radio :label="'|'">任意一人审批通过生效</el-radio>
                  </el-radio-group>
                </el-col>
              </el-row>
              <el-row class="flowRow">
                <el-col :span="rowLabelSpan" class="colLabel">
                  <span>审批结果回调:</span>
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
            </el-collapse-item>
          </el-collapse>
        </div>
        <el-row class="flowRow">
          <el-col :span="24">
            <el-button style="width:100%;border:none;background-color:#ecf5ff50" @click="addFlowNode(form)">添加审批</el-button>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">Create</el-button>
        <el-button @click="onCancel">Cancel</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

import { getApprovalFlow } from '@/api/approval-flow'
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
    }
  },
  data() {
    return {
      rowLabelSpan: 3,
      operatorOptions: [],
      operatorOptionLoading: false,
      activeName: [1, 2, 3, 4, 5, 6, 7, 8, 9]
    }
  },
  mounted() {
    if (this.form.name === '') {
      getApprovalFlow().then(response => {
        console.log(response)
        this.form = response.data.item
      }).catch(error => {
        console.log(error)
      })
    }
  },
  methods: {
    onSubmit() {
      this.$message('submit!')
    },
    onCancel() {
      this.$emit('closeModifyFlow')
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
      if (query !== '') {
        this.form.approvals[0].operators.push(query)
      }
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
}
.colLabel span {
  line-height: 40px;
}
</style>

