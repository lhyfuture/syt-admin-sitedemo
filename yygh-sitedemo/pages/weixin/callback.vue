<template>
  <!-- header -->
  <div></div>
  <!-- footer -->
</template>
<script>
export default {
  layout: "empty",
  data() {
    return {};
  },
  mounted () {
      //1获取参数 用/加：表占位符用params 用？传递的用query
      let token = this.$route.query.token
      let openid = this.$route.query.openid
      let name = this.$route.query.name
      //调用父级别vue方法
      window.parent["loginCallback"](name, token, openid)
  }
};
</script>
