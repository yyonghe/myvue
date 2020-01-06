<template>
  <div ref="maincontainer" class="app-container">
    <div>
      <!-- <el-row style="margin: 5px 0 5px 0;">
        <el-col :span="22">
          <el-input v-model="searchKey" clearable placeholder="请输入业务ID、搜索关键字" />
        </el-col>
        <el-col :span="2">
          <el-button plain type="primary" style="width: 100%" @click="handleSerch">搜索</el-button>
        </el-col>
      </el-row> -->
      <search :onSearch="onSearchBusi"/>
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
        <el-table-column align="center" label="操作" width="280">
          <template slot-scope="scope">
            <el-button v-if="scope.row.isOwner || scope.row.isAdmin" type="text">修改</el-button>
            <el-button v-if="scope.row.isOwner || scope.row.isAdmin" type="text" @click="manageUsers(scope.row.id)">管理</el-button>
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
        :page-size="100"
        layout="total, prev, pager, next"
        :total="1000"
        @current-change="handleCurrentPageIndexChange"
      />
    </div>

    <el-dialog title="管理业务授权用户" v-loading="busiUserDialogLoading" :before-close="beforeCloseDialog" :close-on-click-modal="false" :visible.sync="busiUserDialogVisible">
      <search ref="search" :onSearch="onSearchUser"/>
      <el-table :data="busiUsers" border height="620">
        <el-table-column align="center" label="用户名">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="权限申请时间">
          <template slot-scope="scope">
            {{ handleDatetime(scope.row.authorityTime) }}
            <!-- <el-time-picker :value="new Date(scope.row.authorityTime * 1000)" type="fixed-time" placeholder="Pick a time" style="width: 100%;" /> -->
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
        :current-page.sync="currentPageIndex"
        :page-size="100"
        layout="prev, pager, next"
        :total="1000"
        @current-change="handleCurrentPageIndexChange"
      />
    </el-dialog>
  </div>
</template>

<script>
import { getApprovalBusiList, getApprovalBusiMyList, getApprovalBusiUsers } from '@/api/approval-business'
import { formatUsersToString, parseTime } from '@/utils/index'
import Search from '@/components/Search'
// const { body } = document

export default {
  components: {
    Search
  },
  props: {
    onlyOwn: Boolean
  },
  data() {
    return {
      list: null,
      listLoading: true,
      searchKey: '',
      paginationStyle: '',
      currentPageIndex: 1,
      busiUsers: [],
      busiUserDialogLoading: false,
      busiUserDialogVisible: false
    }
  },
  mounted() {
    this.fetchData()

    var handleWindowResize = this.handleWindowResize

    window.onresize = () => {
      handleWindowResize()
    }
    handleWindowResize()
  },
  methods: {
    onSearchBusi(keyword) {
      alert('Busi' + keyword)
    },
    onSearchUser(keyword) {
      alert('User' + keyword)
    },
    beforeCloseDialog(done) {
      this.$refs.search.dismiss()
      done()
    },
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
        this.handleWindowResize()
      })
    },
    manageUsers(bid) {
      this.busiUsers = []
      this.busiUserDialogLoading = true
      this.busiUserDialogVisible = true
      getApprovalBusiUsers().then(response => {
        this.busiUsers = response.data.items
        this.busiUserDialogVisible = true
        this.busiUserDialogLoading = false
      })
    },
    formatAdmins(admins) {
      return formatUsersToString(admins, '; ')
    },
    handleSerch() {
      // alert(this.$refs.maincontainer.offsetHeight)
      // alert(body.getBoundingClientRect().height)
    },
    handleWindowResize() {
      // const rect = body.getBoundingClientRect()
      // var winH = rect.height
      // var tableH = this.$refs.maincontainer.offsetHeight
      // var h
      // if (tableH > winH) {
      //   h = winH - 25
      // } else {
      //   h = tableH + 280
      // }
      // this.paginationStyle='background-color:white;position: fixed;z-index: 100;top: '+h+'px'
      // this.paginationStyle='background-color:white;position: fixed;z-index: 100;bottom: 0px'
    },
    handleCurrentPageIndexChange(index) {
      this.$message.success(index + ', ' + this.currentPageIndex + ', ' + this.paginationStyle)
    },
    handleDatetime(datetime) {
      return parseTime(datetime)
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
