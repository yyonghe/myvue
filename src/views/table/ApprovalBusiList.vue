<template>
  <div ref="maincontainer" class="app-container">
    <div>
      <el-row>
        <el-col :span="4">
          <router-link to="/approvalbusi/new">
            <el-button type="primary" style="width: 100%">新建业务</el-button>
          </router-link>
        </el-col>
        <el-col :span="6" :offset="14">
          <search :on-search="handleSearchBusi" />
        </el-col>
      </el-row>
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
            {{ scope.row.bid }}
          </template>
        </el-table-column>
        <!-- <el-table-column label="Key" align="center" width="260">
          <template slot-scope="scope">
            {{ scope.row.key }}
          </template>
        </el-table-column> -->
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
              {{ handleFormatAdmins(scope.row.admins) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="280">
          <template slot-scope="scope">
            <el-button v-if="scope.row.isOwner || scope.row.isAdmin" type="text" @click="handleModify(scope.row)">修改</el-button>
            <el-button v-if="scope.row.isOwner || scope.row.isAdmin" type="text" @click="handleManageUsers(scope.row.bid, 0)">管理授权用户</el-button>
            <router-link :to="{path:'/approvalflow/new',query:{bid:scope.row.id}}">
              <el-button v-if="scope.row.hasAuthority" type="text">创建审批流程</el-button>
            </router-link>
            <el-tooltip effect="dark" content="申请权限后可以在这个业务下新建审批流程" placement="top-start">
              <el-button v-if="!(scope.row.isOwner || scope.row.isAdmin || scope.row.hasAuthority)" type="text">申请权限</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="background-color:white;position: fixed;z-index: 100;bottom: 0px">
      <el-pagination
        :current-page.sync="currentPageIndex"
        :page-size="pageSize"
        layout="total, prev, pager, next"
        :total="listSize"
        @current-change="handleCurrentPageIndexChange"
      />
    </div>

    <el-dialog
      title="修改业务信息"
      :visible.sync="modifyDialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="handleBeforeCloseModifyDialog"
    >
      <ApprovalBusiForm ref="approvalBusiForm" :cancel-visiable="true" :form="modifyingBusi" @handleCloseModifyDialog="handleCloseModifyDialog" />
    </el-dialog>

    <el-dialog title="管理业务授权用户" :before-close="handleBeforeCloseManageUserDialog" :close-on-click-modal="false" :visible.sync="busiUserDialogVisible">
      <search ref="search" :on-search="handleSearchUser" />
      <el-table v-loading="busiUserDialogLoading" :data="busiUsers" border height="620">
        <el-table-column align="center" label="用户名">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="权限申请时间">
          <template slot-scope="scope">
            {{ handleDatetime(scope.row.authorityTime) }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="权限过期时间">
          <template slot-scope="scope">
            {{ handleDatetime(scope.row.overtime) }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <!-- <template slot-scope="scope">
            {{ scope.row.overtime }}
          </template> -->
          <el-button type="text">取消授权</el-button>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page.sync="currentUserPageIndex"
        :page-size="pageSize"
        layout="prev, pager, next"
        :total="busiUsersSize"
        @current-change="handleCurrentUserPageIndexChange"
      />
    </el-dialog>
  </div>
</template>

<script>
import { getApprovalBusiList, getApprovalBusiMyList, getApprovalBusiUsers } from '@/api/approval-business'
import { formatUsersToString, parseTime } from '@/utils/index'
import ApprovalBusiForm from '@/views/form/ApprovalBusiForm'
import Search from '@/components/Search'
// const { body } = document

export default {
  components: {
    Search,
    ApprovalBusiForm
  },
  props: {
    onlyOwn: Boolean
  },
  data() {
    return {
      pageSize: 15,
      //
      // searchBusiStyle: 'width: 360px;',
      // main list
      list: null,
      listSize: 0,
      listLoading: true,
      currentPageIndex: 1,
      // manage users
      busiUsers: [],
      manageUserBid: 0,
      busiUserDialogLoading: false,
      busiUserDialogVisible: false,
      busiUsersSize: 0,
      currentUserPageIndex: 1,
      // modify busi info
      modifyDialogVisible: false,
      modifyingBusi: {}
    }
  },
  mounted() {
    this.handleLoadBusiList()
    var handleWindowResize = this.handleWindowResize
    window.onresize = () => {
      handleWindowResize()
    }
    handleWindowResize()
  },
  methods: {
    handleSearchBusi(keyword) {
      alert('Busi' + keyword)
    },
    handleLoadBusiList() {
      this.listLoading = true
      var f
      if (this.onlyOwn) {
        f = getApprovalBusiMyList
      } else {
        f = getApprovalBusiList
      }
      var params = {
        pageSize: this.pageSize,
        pageIndex: this.currentPageIndex
      }
      f(params).then(response => {
        this.list = response.data.items
        this.listSize = response.data.total
        this.listLoading = false
      })
    },
    handleFormatAdmins(admins) {
      return formatUsersToString(admins, '; ')
    },
    handleWindowResize() {
    },
    // main list funcs
    handleCurrentPageIndexChange(index) {
      this.handleLoadBusiList()
    },
    handleModify(busi) {
      this.modifyingBusi = busi
      this.modifyDialogVisible = true
    },
    handleBeforeCloseModifyDialog(done) {
      this.$refs.approvalBusiForm.handleCancelModify()
    },
    handleCloseModifyDialog() {
      this.modifyDialogVisible = false
    },
    // manage user funcs
    handleManageUsers(bid, type) {
      if (type === 0) {
        // first time open
        this.manageUserBid = bid
        this.currentUserPageIndex = 1
        this.busiUsers = []
        this.busiUserDialogVisible = true
      }
      this.busiUserDialogLoading = true
      var params = {
        bid: bid,
        pageSize: this.pageSize,
        pageIndex: this.currentUserPageIndex
      }
      getApprovalBusiUsers(params).then(response => {
        this.busiUsers = response.data.items
        this.busiUsersSize = response.data.total
        this.busiUserDialogLoading = false
      })
    },
    handleDatetime(datetime) {
      return parseTime(datetime)
    },
    handleCurrentUserPageIndexChange() {
      this.handleManageUsers(this.manageUserBid)
    },
    handleSearchUser(keyword) {
      alert('User' + keyword)
    },
    handleBeforeCloseManageUserDialog(done) {
      this.$refs.search.dismiss()
      done()
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
