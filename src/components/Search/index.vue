<template>
  <div>
    <el-row style="margin: 5px 0 5px 0;">
      <el-col :span="21">
        <el-input v-model="keyword" clearable :placeholder="placeholder" />
      </el-col>
      <el-col :span="3">
        <el-button plain type="primary" style="width: 100%" @click="search">{{ label }}</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: () => {
        return '搜索'
      }
    },
    placeholder: {
      type: String,
      default: () => {
        return '请输入搜索关键字'
      }
    },
    onSearch: {
      type: Function,
      default: () => {
        return function() {

        }
      }
    }
  },
  data() {
    return {
      keyword: ''
    }
  },
  methods: {
    search() {
      this.onSearch(this.keyword)
    },
    dismiss() {
      this.keyword = ''
    }
  }
}

</script>

<style scoped>

</style>
