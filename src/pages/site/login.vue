<style lang="scss" scoped>
.login {
  height: 100%;
  background: url(/static/images/bg-login.png) no-repeat center center;
  background-size: cover;
  padding: 0 .35rem;
  ::-webkit-input-placeholder {
    color: #bbf0dd;
    font-size: .28rem;
  }
  ::-moz-placeholder {
    color: #bbf0dd;
    font-size: .28rem;
  }
  :-moz-placeholder {
    color: #bbf0dd;
    font-size: .28rem;
  }
  :-ms-input-placeholder {
    color: #bbf0dd;
    font-size: .28rem;
  }
  &__header {
    padding-top: 1.76rem;
    text-align: center;
    img {
      width: 3.5rem;
    }
  }
  &__body {
    margin-top: 1.5rem;
    color: #fff;
    .input-item {
      margin-bottom: .36rem;
      border-bottom: 1px solid rgba(255, 255, 255, .5);
      label {
        display: block;
        padding: .19rem .34rem;
        .iconfont {
          color: #fff;
          font-size: .36rem;
        }
        input {
          background: transparent;
          border: none;
          outline: none;
          height: .34rem;
          color: #fff;
          font-size: .28rem;
          width: 90%;
        }
      }
    }
    // .tips {
    //   font-size: .24rem;
    //   position: relative;
    //   display: flex;
    //   justify-content: space-between;
    //   .remember {
    //     display: flex;
    //     align-items: center;
    //     padding-left: .24rem;
    //     &.is-remember {
    //       .icon-checkbox .iconfont {
    //         display: block;
    //       }
    //     }
    //     .icon-checkbox {
    //       display: flex;
    //       align-items: center;
    //       justify-content: center;
    //       width: .28rem;
    //       height: .28rem;
    //       line-height: .28rem;
    //       border-radius: 2px;
    //       background-color: #adffd7;
    //       border: 1px solid #1ea589;
    //       margin-right: 4px;
    //       .iconfont {
    //         display: none;
    //         font-size: .18rem;
    //         margin-top: 2px;
    //         font-weight: bolder;
    //         color: #1ea589;
    //         margin-right: 0;
    //       }
    //     }
    //   }
    //   a {
    //     color: #fff;
    //   }
    // }
    .btn-login {
      display: block;
      height: .9rem;
      line-height: .9rem;
      margin-top: .67rem;
      background-color: rgba(255, 255, 255, .8);
      color: #10b87f;
      font-size: .32rem;
      border-radius: 999px;
      text-align: center;
      &:active {
        background-color: #b6ebdc;
        color: #0e885f;
      }
      &.is-disabled {
        background-color: #d4e9e2;
        color: #79bea7;
      }
    }
  }
}
</style>

<template>
  <section class="login">
    <div class="login__header">
      <img src="/static/images/logo.png" alt="">
    </div>
    <div class="login__body">
      <div class="input-item">
        <label for="username">
          <span class="iconfont icon-user">&#xe636;</span>
          <input
            v-model="loginInfo.username"
            id="username"
            type="text"
            placeholder="请输入账号">
        </label>
      </div>
      <div class="input-item">
        <label for="password">
          <span class="iconfont icon-pssword">&#xe635;</span>
          <input
            v-model="loginInfo.password"
            id="password"
            type="password"
            placeholder="请输入密码">
        </label>
      </div>
      <!-- <div class="tips">
        <span
          class="remember"
          @click="rememberPassword"
          :class="{'is-remember': isRemember}">
          <span class="icon-checkbox">
            <i class="iconfont">&#xe620;</i>
          </span>
          记住密码
        </span>
      </div> -->
      <a
        class="btn-login"
        @click="login"
        :class="{ 'is-disabled': isDisabled }"
        href="javascript: void(0)">
        登录
      </a>
    </div>
  </section>
</template>

<script>

export default {
  data() {
    return {
      loginInfo: {
        username: '',
        password: '',
      },
      isRemember: false,
      isDisabled: true,
    }
  },
  watch: {
    loginInfo: {
      handler(info) {
        this.isDisabled = !(info.username.length > 0 && info.password.length > 0)
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    rememberPassword() {
      this.isRemember = !this.isRemember
    },
    login() {
      if (this.isDisabled) return
      console.log('登录')
    },
  },
}
</script>
