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
      <el-form-item label="业务名称">
        <el-input v-model="iform.name" />
      </el-form-item>
      <el-form-item label="业务说明">
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

import { /* newApprovalFlow, */getApprovalBusi/*, updateApprovalFlow*/ } from '@/api/approval-business'
// import { getApprovalBusiList } from '@/api/approval-business'

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
      operatorOptions: [],
      operatorOptionLoading: false,
      formLoading: true,
      iform: JSON.parse(JSON.stringify(this.form))
    }
  },
  mounted() {
    if (this.iform.name === '') {
      getApprovalBusi().then(response => {
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
    remoteMethod(query) {
      this.operatorOptionLoading = true
      this.options = []
      this.operatorOptionLoading = false
    }
  }
}
</script>

<style scoped>

</style>

