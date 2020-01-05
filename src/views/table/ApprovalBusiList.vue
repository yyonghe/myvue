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
      <el-table-column label="Key" align="center" width="260">
        <template slot-scope="scope">
          {{ scope.row.key }}
        </template>
      </el-table-column>
      <el-table-column label="业务名称" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
          <el-popover
            placement="top-start"
            effect="dark"
            title="业务说明："
            width="280"
            trigger="hover"
            :content="scope.row.desc"
          >
            <i slot="reference" class="el-icon-info" />
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="管理员">
        <template slot-scope="scope">
          <span class="notifier">
            {{ formatAdmins(scope.row.admins) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="320">
        <template slot-scope="scope">
          <el-button v-if="scope.row.isOwner || scope.row.isAdmin" plain type="primary">修改</el-button>
          <el-button plain type="primary">查看</el-button>
          <el-tooltip effect="dark" content="修改审批流程" placement="top-start">
            <el-button v-if="!(scope.row.isOwner || scope.row.isAdmin || scope.row.hasAuthority)" plain type="warning">申请权限</el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getApprovalBusiList, getApprovalBusiMyList } from '@/api/approval-business'
import { formatUsersToString } from '@/utils/index'

export default {
  props: {
    onlyOwn: Boolean
  },
  data() {
    return {
      list: null,
      listLoading: true
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      var f
      if (this.onlyOwn) {
        f = getApprovalBusiMyList
      } else {
        f = getApprovalBusiList
      }
      f().then(response => {
        this.list = response.data.items
        this.listLoading = false
      })
    },
    formatAdmins(admins) {
      return formatUsersToString(admins, '; ')
    }
  }
}
</script>
<style scoped>
.notifier {
  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
</style>
