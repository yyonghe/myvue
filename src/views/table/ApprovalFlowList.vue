<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="名称" width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
          <el-popover
            placement="top-start"
            effect="dark"
            title="审批说明："
            width="280"
            trigger="hover"
            :content="scope.row.desc"
          >
            <i slot="reference" class="el-icon-question" />
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="审批流程">
        <template slot-scope="scope">
          <el-steps :active="-1" space="20%">
            <el-step
              v-for="(item,index) in scope.row.approvals"
              :key="index"
              :description="handleOperators(item)"
              icon="el-icon-right"
              status="process"
            />
          </el-steps>
        </template>
      </el-table-column>
      <el-table-column label="审批结果知会人员" width="180">
        <template slot-scope="scope">
          <span class="notifier">
            <el-tooltip effect="dark" :content="formatMailto(scope.row.mailto)" placement="top-start">
              <i class="el-icon-info" />
            </el-tooltip>
            {{ formatMailto(scope.row.mailto) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="Author" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="80">
        <template slot-scope="scope">
          <el-tooltip effect="dark" content="修改审批流程" placement="top-start">
            <el-button circle type="primary" icon="el-icon-edit" @click="modifyFlow(scope.row)" />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="修改审批流程"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
    >
      <ApprovalFlowForm :form="form" @closeModifyFlow="closeModifyFlow" />
    </el-dialog>
  </div>
</template>

<script>
import { getApprovalFlowList } from '@/api/approval-flow'
import { formatFlowLevelTitle } from '@/utils/index'
import ApprovalFlowForm from '@/views/form/ApprovalFlowForm'

export default {
  components: {
    ApprovalFlowForm
  },
  data() {
    return {
      list: null,
      listLoading: true,
      dialogFormVisible: false,
      form: {}
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getApprovalFlowList().then(response => {
        console.log(response)
        this.list = response.data.items
        this.listLoading = false
      })
    },
    modifyFlow(item) {
      this.form = item
      this.dialogFormVisible = true
    },
    closeModifyFlow() {
      this.dialogFormVisible = false
    },
    handleFlowTitle(index) {
      return formatFlowLevelTitle(index)
    },
    handleOperators(approval) {
      var s = ''
      for (let i = 0; i < approval.operators.length; i++) {
        if (s.length === 0) {
          s = approval.operators[i]
        } else {
          s = s + approval.mode + approval.operators[i]
        }
      }
      return s
    },
    formatMailto(mailto) {
      return this.handleOperators({
        operators: mailto,
        mode: '; '
      })
    }
  }
}
</script>

<style>
.notifier {
  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
</style>
