<template>
  <div class="header-container">
    <div class="wrapper">
      <!-- logo -->
      <div class="left-wrapper v-link selected">
        <img
          style="width: 50px"
          width="50"
          height="50"
          src="~assets/images/logo.png"
        />
        <span class="text">尚医通 预约挂号统一平台</span>
      </div>
      <!-- 搜索框 -->
      <div class="search-wrapper">
        <div class="hospital-search animation-show">
          <el-autocomplete
            class="search-input small"
            prefix-icon="el-icon-search"
            v-model="state"
            :fetch-suggestions="querySearchAsync"
            placeholder="点击输入医院名称"
            @select="handleSelect"
          >
            <span
              slot="suffix"
              class="search-btn v-link highlight clickable selected"
              >搜索</span
            >
          </el-autocomplete>
        </div>
      </div>
      <!-- 右侧 -->
      <!-- 右侧 -->
      <div class="right-wrapper">
        <span class="v-link clickable">帮助</span>
        <span
          v-if="name == ''"
          class="v-link clickable"
          @click="showLogin()"
          id="loginDialog"
          >登录/注册</span
        >
        <el-dropdown v-if="name != ''" @command="loginMenu">
          <span class="el-dropdown-link">
            {{ name }}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu class="user-name-wrapper" slot="dropdown">
            <el-dropdown-item command="/user">实名认证</el-dropdown-item>
            <el-dropdown-item command="/order">挂号订单</el-dropdown-item>
            <el-dropdown-item command="/patient">就诊人管理</el-dropdown-item>
            <el-dropdown-item command="/logout" divided
              >退出登录</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>

    <!-- 登录弹出层 -->
    <el-dialog
      :visible.sync="dialogUserFormVisible"
      style="text-align: left;"
      top="50px"
      :append-to-body="true"
      width="960px"
      @close="closeDialog()"
    >
      <div class="container">
        <!-- 手机登录 #start -->
        <div class="operate-view" v-if="dialogAtrr.showLoginType === 'phone'">
          <div class="wrapper" style="width: 100%">
            <div class="mobile-wrapper" style="position: static;width: 70%">
              <span class="title">{{ dialogAtrr.labelTips }}</span>
              <el-form>
                <el-form-item>
                  <el-input
                    v-model="dialogAtrr.inputValue"
                    :placeholder="dialogAtrr.placeholder"
                    :maxlength="dialogAtrr.maxlength"
                    class="input v-input"
                  >
                    <span
                      slot="suffix"
                      class="sendText v-link"
                      v-if="dialogAtrr.second > 0"
                      >{{ dialogAtrr.second }}s</span
                    >
                    <span
                      slot="suffix"
                      class="sendText v-link highlight clickable selected"
                      v-if="dialogAtrr.second == 0"
                      @click="getCodeFun()"
                      >重新发送</span
                    >
                  </el-input>
                </el-form-item>
              </el-form>
              <div class="send-button v-button" @click="btnClick()">
                {{ dialogAtrr.loginBtn }}
              </div>
            </div>
            <div class="bottom">
              <div class="wechat-wrapper" @click="weixinLogin()">
                <span class="iconfont icon"></span>
              </div>
              <span class="third-text">第三方账号登录</span>
            </div>
          </div>
        </div>
        <!-- 手机登录 #end -->

        <!-- 微信登录 #start -->
        <div class="operate-view" v-if="dialogAtrr.showLoginType === 'weixin'">
          <div class="wrapper wechat" style="height: 400px">
            <div>
              <div id="weixinLogin"></div>
            </div>
            <div class="bottom wechat" style="margin-top: -80px;">
              <div class="phone-container">
                <div class="phone-wrapper" @click="phoneLogin()">
                  <span class="iconfont icon"></span>
                </div>
                <span class="third-text">手机短信验证码登录</span>
              </div>
            </div>
          </div>
        </div>
        <!-- 微信登录 #end -->

        <div class="info-wrapper">
          <div class="code-wrapper">
            <div>
              <img
                src="//img.114yygh.com/static/web/code_login_wechat.png"
                class="code-img"
              />
              <div class="code-text">
                <span class="iconfont icon"></span>微信扫一扫关注
              </div>
              <div class="code-text">“快速预约挂号”</div>
            </div>
            <div class="wechat-code-wrapper">
              <img
                src="//img.114yygh.com/static/web/code_app.png"
                class="code-img"
              />
              <div class="code-text">扫一扫下载</div>
              <div class="code-text">“预约挂号”APP</div>
            </div>
          </div>
          <div class="slogan">
            <div>xxxxxx官方指定平台</div>
            <div>快速挂号 安全放心</div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import cookie from "js-cookie";
import Vue from "vue";
import userInfoApi from "@/api/userinfo";
import msmApi from "@/api/msm";
import hospitalApi from "@/api/hospital";
import wxApi from "@/api/wx";

const defaultDialogAtrr = {
  showLoginType: "phone", // 控制手机登录与微信登录切换

  labelTips: "手机号码", // 输入框提示

  inputValue: "", // 输入框绑定对象
  placeholder: "请输入您的手机号", // 输入框placeholder
  maxlength: 11, // 输入框长度控制

  loginBtn: "获取验证码", // 登录按钮或获取验证码按钮文本

  sending: true, // 是否可以发送验证码
  second: -1, // 倒计时间  second>0 : 显示倒计时 second=0 ：重新发送 second=-1 ：什么都不显示
  clearSmsTime: null // 倒计时定时任务引用 关闭登录层清除定时任务
};

export default {
  data() {
    return {
      userInfo: {
        //登录对象
        openid: "",
        phone: "",
        code: ""
      },
      dialogAtrr: defaultDialogAtrr, //弹出层对象
      dialogUserFormVisible: false, //弹出层是否展示
      name: "" //登录后的用户名
    };
  },
  created() {
    //判断用户是否已登录
    this.showInfo();
  },
  //vue对象数据加载完成执行
  mounted() {
    // 注册全局登录事件对象
    window.loginEvent = new Vue();
    // 监听登录事件
    loginEvent.$on("loginDialogEvent", function() {
      document.getElementById("loginDialog").click();
    });
    // 触发事件，显示登录层：loginEvent.$emit('loginDialogEvent')

    //初始化微信js
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src =
      "https://res.wx.qq.com/connect/zh_CN/htmledition/js/wxLogin.js";
    document.body.appendChild(script);

    // 微信登录回调处理
    let self = this;
    window["loginCallback"] = (name, token, openid) => {
      self.loginCallback(name, token, openid);
    };
  },

  methods: {
    //微信登录回调方法
    loginCallback(name, token, openid) {
      //第一次微信登录，绑定手机号
      //第一次登录微信认证查询到后会跳转到默认手机号登录页面让用户绑定
      //但是应该在页面上给提示而不是全部使用默认页面值
      //可以将dialogAtrr的labelTips或inputValue属性绑定一个提示值
      if (openid != "") {
        this.userInfo.openid = openid;
        this.showLogin();
        this.dialogAtrr.labelTips = "第一次微信登录需要绑定手机号";
        //this.dialogAtrr.inputValue = "第一次微信登录需要绑定手机号";
        //window.location.reload();
      } else {
        //不是第一次设置登录状态
        this.setCookies(name, token);
      }
    },

    //微信登录使用，将showLoginType装换为微信界面,加载验证码
    weixinLogin() {
      this.dialogAtrr.showLoginType = "weixin";
      wxApi.getLoginParam().then(response => {
        let obj = new WxLogin({
          self_redirect: true,
          id: "weixinLogin", // 需要显示的容器id
          appid: response.data.appid, // 公众号appid wx*******
          scope: response.data.scope, // 网页默认即可
          redirect_uri: response.data.redirectUri, // 授权成功后回调的url
          state: response.data.state, // 可设置为简单的随机数加session用来校验
          style: "black", // 提供"black"、"white"可选。二维码的样式
          href: "" // 外部css文件url，需要https
        });
      });
    },

    //1.点击 登录/注册 按钮  打开登录注册弹出层
    showLogin() {
      this.dialogUserFormVisible = true;
      //初始化页面默认参数对象
      this.dialogAtrr = { ...defaultDialogAtrr }; //对象拓展运算符,复制内存对象
    },
    //点击 蓝框按钮 根据内容判断是否是 发送验证码或者登录
    btnClick() {
      if (this.dialogAtrr.loginBtn == "获取验证码") {
        //发送验证码方法
        //给手机号赋值,将上面用户输入框中的数据填入
        this.userInfo.phone = this.dialogAtrr.inputValue;
        //调用发送验证码方法
        this.getCodeFun();
      } else {
        //调用登录方法
        this.login();
      }
    },

    //发送验证码方法
    getCodeFun() {
      //1.前端校验手机号
      if (!/^1[345789]\d{9}$/.test(this.userInfo.phone)) {
        this.$message.error("手机号码不正确");
        return;
      }

      //2更改弹出层对象值
      this.dialogAtrr.inputValue = "";
      this.dialogAtrr.placeholder = "请快快输入验证码";
      this.dialogAtrr.maxlength = 6;
      this.dialogAtrr.loginBtn = "马上登录";

      //3判断是否重复发送 根据属性sending判断
      if (!this.dialogAtrr.sending) {
        this.$message.error("请勿重复发送");
        return;
      }

      //4.发送验证码，先将sending 置为空
      this.dialogAtrr.sending = false;

      msmApi
        .sendCode(this.userInfo.phone)
        .then(response => {
          //发送完成调用倒计时方法
          this.timeDown();
        })
        .catch(error => {
          //5发送失败弹出层回退界面
          this.$message.error("发送验证码失败");
          //重新回初始页面进行再次操作
          this.showLogin();
        });
    },

    //到计时方法
    // timeDown() {
    //   if (this.clearSmsTime) {
    //     clearInterval(this.clearSmsTime);
    //   }
    //   this.dialogAtrr.second = 60;

    //   this.dialogAtrr.labelTips = "验证码已发送至" + this.userInfo.phone;
    //   this.clearSmsTime = setInterval(() => {
    //     --this.dialogAtrr.second;
    //     if (this.dialogAtrr.second < 1) {
    //       clearInterval(this.clearSmsTime);
    //       this.dialogAtrr.sending = true;
    //       this.dialogAtrr.second = 0;
    //     }
    //   }, 1000);
    // },

    timeDown() {
      if (this.clearSmsTime) {
        clearInterval(this.clearSmsTime);
      }
      this.dialogAtrr.second = 60;

      this.dialogAtrr.labelTips = "验证码已发送至" + this.userInfo.phone;
      this.clearSmsTime = setInterval(() => {
        --this.dialogAtrr.second;
        //学了这么久编程，为什么=是赋值还没有记住？赋值后为0 js当成false值不会执行清空方法
        if (this.dialogAtrr.second == 0) {
          //达到任务一定要清空，定时任务是在内存里面跑的
          clearInterval(this.clearSmsTime);
          this.dialogAtrr.sending = true;
        }
      }, 1000);
    },

    //调用登录方法
    login() {
      //1给验证码赋值
      this.userInfo.code = this.dialogAtrr.inputValue;

      //2合法性校验
      if (this.dialogAtrr.loginBtn == "正在提交...") {
        this.$message.error("重复提交");
        return;
      }
      if (this.userInfo.code == "") {
        this.$message.error("验证码必须输入");
        return;
      }
      if (this.userInfo.code.length != 6) {
        this.$message.error("验证码格式不正确");
        return;
      }
      this.dialogAtrr.loginBtn = "正在提交...";

      //3提交登录，成功后设置登录状态
      userInfoApi
        .login(this.userInfo)
        .then(response => {
          //设置登录状态
          this.setCookies(response.data.name, response.data.token);
        })
        .catch(error => {
          //4失败回退
          this.dialogAtrr.loginBtn = "马上登录";
        });
    },

    //设置登录状态
    setCookies(name, token) {
      cookie.set("name", name, { domain: "localhost" });
      cookie.set("token", token, { domain: "localhost" });
      //刷新页面，加载登录状态
      window.location.reload(); //不加括号只是属性不是方法!!!!!
    },

    //判断用户是否已登录
    showInfo() {
      let token = cookie.get("token");
      if (token) {
        //页面根据name是否为空判断页面转换条件
        this.name = cookie.get("name");
      }
    },

    //菜单方法
    loginMenu(command) {
      if ("/logout" == command) {
        //登出清除cookie数据
        cookie.set("name", "", { domain: "localhost" });
        cookie.set("token", "", { domain: "localhost" });

        //跳转页面
        window.location.href = "/";
      } else {
        //跳转值菜单那里
        window.location.href = command;
      }
    },

    //关闭登录层
    closeDialog() {
      if (this.clearSmsTime) {
        clearInterval(this.clearSmsTime);
      }
    },

    //页面搜索医院条件
    handleSelect(item) {
      window.location.href = "/hospital/" + item.hoscode;
    },

    //点击手机登录使用，只需重置回默认页面即可
    phoneLogin() {
      this.dialogAtrr.showLoginType = "phone";
      this.showLogin();
    }
  }
};
</script>
