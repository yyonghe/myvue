<template>
  <div class="app-container">
    <el-form ref="form" v-loading="loading" :model="iform" label-width="95px">
      <el-form-item label="ID">
        <el-input v-model="iform.bid" :disabled="true" placeholder="创建后ID自动生成" />
      </el-form-item>
      <!-- <el-form-item label="Key">
        <el-input v-model="iform.key" :disabled="true" />
      </el-form-item> -->
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
          :remote-method="handleRemoteGetOperators"
          :loading="operatorOptionLoading"
          value-key="name"
          style="width:100%"
        >
          <el-option v-for="item in operatorOptions" :key="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleModifySubmit">
          <span v-if="cancelVisiable">提交</span>
          <span v-else>创建</span>
        </el-button>
        <el-button v-show="cancelVisiable" @click="handleCancelModify()">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

import { /* newApprovalFlow, */getApprovalBusi, updateApprovalBusi } from '@/api/approval-business'
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
      loading: true,
      iform: JSON.parse(JSON.stringify(this.form))
    }
  },
  mounted() {
    if (this.$route.query != null && this.$route.query.bid != null) {
      getApprovalBusi({ bid: this.$route.query.bid }).then(response => {
        this.loading = false
        this.iform = response.data.item
      }).catch(() => {
        this.loading = false
      })
    } else {
      this.loading = false
    }
  },
  methods: {
    handleModifySubmit() {
      this.loading = true
      updateApprovalBusi(this.iform).then(rsp => {
        this.loading = false
      })
    },
    handleCancelModify() {
      if (this.loading) {
        this.$message({
          message: '数据处理中，请稍等...',
          duration: 1000
        })
      } else {
        this.iform = JSON.parse(JSON.stringify(this.form))
        this.$emit('handleCloseModifyDialog')
      }
    },
    handleRemoteGetOperators(query) {
      this.operatorOptionLoading = true
      this.options = []
      this.operatorOptionLoading = false
    }
  }
}
</script>

<style scoped>

</style>

