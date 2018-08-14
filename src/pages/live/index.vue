<style lang="scss" scoped>
.live {
  height: 100%;
  display: flex;
  flex-direction: column;
  // padding-bottom: 1rem;
  position: relative;
  &-header {
    height: 4.22rem;
    flex: 0 0 4.22rem;
    background-color: #333;
    position: relative;
    .live-area {
      height: 100%;
    }
    .live-title {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: .8rem;
      line-height: .8rem;
      padding: 0 .24rem;
      font-size: .28rem;
      color: #fff;
      background-image: linear-gradient(to bottom, rgba(0,0,0,.3) 20%, rgba(0,0,0,0) 100%);
    }
    .live-toolbar {
      position: absolute;
      bottom: 0;
      left: 0;
      height: .8rem;
      width: 100%;
      padding: 0 .24rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #fff;
      font-size: .24rem;
      background-image: linear-gradient(to bottom, rgba(0,0,0,0) 20%,  rgba(0,0,0,.3) 100%);
      .icon-full-screen {
        font-size: .36rem;
        font-weight: bold;
      }
    }
  }
  .chat-body {
    flex: 1;
    background-color: #f3faf7;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    padding: .2rem;
    .message-item {
      margin-bottom: .24rem;
      &.common-message {
        &.is-self {
          text-align: right;
          .message-content__info {
            background-color: #00cf80;
            border-color: #00b46f;
            color: #fff;
            text-align: left;
          }
        }
        .message-tips {
          font-size: .24rem;
          color: #afbdcc;
          &__time {
            margin-left: .15rem;
          }
          &__nickname {

          }
        }
        .message-content {
          margin-top: .1rem;
          &__info {
            display: inline-block;
            max-width: 80%;
            border: 1px solid #f2f2f2;
            background-color: #fff;
            border-radius: 3px;
            padding: .1rem .25rem;
            line-height: .36rem;
            font-size: .28rem;
            color: #2c2f33;
          }
        }
      }
      .system-message {

      }
    }
  }
  .send-container {
    // position: absolute;
    // bottom: 0;
    // left: 0;
    width: 100%;
    padding: .14rem .2rem;
    background-color: #f7f7f9;
    display: flex;
    align-items: flex-end;
    border-top: 1px solid #e4e4e5;
    .input-area {
      flex: 1;
      margin-right: .2rem;
    }

    .btn-send {
      width: 1.2rem;
      padding: .15rem .13rem;
      text-align: center;
      background-color: #00cf80;
      border: 1px solid #00c278;
      color: #fff;
      font-size: .3rem;
      border-radius: .06rem;
      &:active {
        opacity: .9;
      }

    }
  }
}
.fade-enter-active, .fade-leave-active {
  transition: all .2s linear;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>

<template>
  <div class="live">
    <div class="live-header" @touchstart="toolbarHandle">
      <div class="live-area" id="liveVideo"></div>
      <transition name="fade">
        <p
          class="live-title"
          v-show="showToolbar">
          {{ liveInfo.title }}
        </p>
      </transition>
      <transition name="fade">
        <p
          class="live-title"
          v-show="showToolbar">
          {{ liveInfo.title }}
        </p>
      </transition>
      <div
        class="live-toolbar"
        v-show="showToolbar">
        <span class="user-count">{{ allCount }} 人在线</span>
        <span class="full-screen" @click="fullScreen">
          <i class="iconfont icon-full-screen">&#xe66a;</i>
        </span>
      </div>
    </div>

    <div class="chat-body">
      <ul>
        <li
          v-for="(msg, index) in messageList"
          :key="index">
          <!-- subtype: 2-系统 -->
          <!-- 普通消息 start -->
          <div
            class="message-item common-message"
            :class="{'is-self': msg.isSend}"
            v-if="msg.subType === 0">
            <p
              class="message-tips"
              v-if="!msg.isSend">
              <span class="message-tips__nickname">{{ msg.fromAccountNick }}</span>
              <span class="message-tips__time">{{ msg.time * 1000 | formatTime('hh:mm') }}</span>
            </p>
            <div class="message-content">
              <div class="message-content__info" v-html="formatText2Html(msg.message)"></div>
            </div>
          </div>
          <!-- 普通消息 end -->

          <!-- 系统消息 start -->
          <!-- <div
            class="message-item system-message"
            v-if="msg.subType === 2">
            <div class="message-content">
              <div class="message-content__info" v-html="formatText2Html(msg.message)"></div>
            </div>
          </div> -->
          <!-- 系统消息 end -->
        </li>
      </ul>
    </div>

    <div class="send-container">
      <div class="input-area">
        <textarea-autosize
          class="send-content"
          v-model="sendContent"
          ref="inputArea">
        </textarea-autosize>
      </div>
      <a
        class="btn-send"
        @click="onSendMsg"
        href="javascript: void(0)">
        发送
      </a>
    </div>

  </div>
</template>

<script>
import TextareaAutosize from '@/components/common/textarea-autosize'

const { webim, TcPlayer } = window
export default {
  components: {
    TextareaAutosize,
  },
  data() {
    return {
      player: null,
      showToolbar: false,
      toolbarTimer: null,

      sendContent: '',
      // 帐号模式，0-表示独立模式，1-表示托管模式
      accountMode: 0,

      // 官方 demo appid,需要开发者自己修改（托管模式）
      sdkAppID: 1400073803,
      accountType: 792,

      selToID: '',
      selType: webim.SESSION_TYPE.GROUP,
      selSess: null, // 当前聊天会话

      // 默认房间群ID，群类型必须是直播聊天室（AVChatRoom），这个为官方测试ID(托管模式)
      avChatRoomId: '@TGS#aKQQESFFC',

      // 当前用户身份
      loginInfo: {
        sdkAppID: '',
        appIDAt3rd: '',
        accountType: '',
        identifier: '',
        identifierNick: '',
        userSig: '',
      },

      // 监听事件
      listeners: {},

      // 是否访问正式环境
      isAccessFormalEnv: true,
      isLogOn: true,

      options: {},

      messageList: [],
      allCount: 0,

      liveInfo: {
        title: '我是测试视频',
        url: 'http://1257120875.vod2.myqcloud.com/0ef121cdvodtransgzp1257120875/e5c418a95285890781026033863/v.f230.m3u8',
        coverpic: 'https://ss0.baidu.com/73t1bjeh1BF3odCf/it/u=3261990965,2215517573&fm=85&s=99C5874A68A077240B0E466C0300E07C',
      },
    }
  },
  created() {
    if (webim.Tool.getQueryString('groupid')) {
      this.avChatRoomId = webim.Tool.getQueryString('groupid')// 用户自定义房间群id
    }

    this.selToID = this.avChatRoomId// 当前选中聊天id（当聊天类型为私聊时，该值为好友帐号，否则为群号）


    // 当前用户身份
    this.loginInfo = {
      sdkAppID: this.sdkAppID, // 用户所属应用id,必填
      appIDAt3rd: this.sdkAppID, // 用户所属应用id，必填
      accountType: this.accountType, // 用户所属应用帐号类型，必填
      identifier: 'testusername', // 当前用户ID,必须是否字符串类型，选填
      identifierNick: 'null', // 当前用户昵称，选填
      userSig: 'eJxNzF9vgjAUh*Hv0utl6R8qZsmu0GmDM1PpEq5IpQfWINi0xanLvvsIYdlu3*f8zhfKNodHVZbnvgtFuFlATwijhzEbDV0wlQE3xAA*9B5cp1qYXFlrdKFCwZz*N-O6KUYaGokwxjGbYzYhXK1xUKgqjF8J55wOJ5NewHlz7gagmHBCGcZ-GEwL44RGEeez6PelN-WQX5cyEbuF2n2SG3H3aJHFaZMc2355stLr5EVe3fbSNmkeb2EPhtaizgS9px*2Wm3W8xWX5r3iuah7Ig6BhfK43kudWf-WzE75M-r*AbH8W74_', // 当前用户身份凭证，必须是字符串类型，选填
      headurl: 'img/2016.gif', // 当前用户默认头像，选填
    }

    // 监听事件
    this.listeners = {
      onConnNotify: this.onConnNotify, // 选填
      onBigGroupMsgNotify: this.onBigGroupMsgNotify, // 必填
      onMsgNotify: this.onMsgNotify, // 必填
      onGroupSystemNotifys: this.onGroupSystemNotifys, // 必填
      onGroupInfoChangeNotify: this.onGroupInfoChangeNotify, // 选填
    }

    this.options = {
      isAccessFormalEnv: this.isAccessFormalEnv, // 是否访问正式环境，默认访问正式，选填
      isLogOn: this.isLogOn, // 是否开启控制台打印日志,默认开启，选填
    }
    this.login()
  },

  mounted() {
    this.initLive()
  },

  beforeDestroy() {
    if (this.player) this.player.destroy()
    this.quitBigGroup()
  },

  methods: {
    // 初始化视频
    initLive() {
      const liveVideo = document.getElementById('liveVideo')
      this.player = new TcPlayer('liveVideo', {
        m3u8: this.liveInfo.url, // 请替换成实际可用的播放地址
        autoplay: true,      // iOS下safari浏览器，以及大部分移动端浏览器是不开放视频自动播放这个能力的
        coverpic: {
          style: 'cover',
          src: this.liveInfo.coverpic,
        },
        width: liveVideo.offsetWidth, // 视频的显示宽度，请尽量使用视频分辨率宽度
        height: liveVideo.offsetHeight, // 视频的显示高度，请尽量使用视频分辨率高度
        controls: 'none',
        systemFullscreen: true,
        live: true,
      })
      this.resizeHandle()
      this.toolbarHandle()
      this.bindEvent()
    },

    toolbarHandle() {
      this.toolbarTimer && clearTimeout(this.toolbarTimer)
      this.showToolbar = true
      this.toolbarTimer = setTimeout(() => {
        this.showToolbar = false
        clearTimeout(this.toolbarTimer)
      }, 8000)
    },

    // 监听窗口大小改变事件
    resizeHandle() {
      const liveVideo = document.getElementById('liveVideo')
      if (!liveVideo) return
      const w = liveVideo.offsetWidth
      const h = liveVideo.offsetHeight
      if (this.player) {
        this.player.el.style.width = `${w}px`
        this.player.el.style.height = `${h}px`
        const video = this.player.el.getElementsByTagName('video')[0]
        if (video) {
          video.style.width = `${w}px`
          video.style.height = `${h}px`
        }
      }
    },

    // 监听窗口大小改变事件
    bindEvent() {
      const vm = this
      window.addEventListener('resize', () => {
        setTimeout(() => {
          vm.resizeHandle()
        }, 300)
      }, false)
    },

    // 全屏事件
    fullScreen() {
      if (this.player) {
        this.player.fullscreen(true)
      }
    },

    // 转化文本为html
    formatText2Html(msg) {
      return webim.Tool.formatText2Html(msg)
    },

    // 监听连接状态
    onConnNotify(res) {
      switch (res.ErrorCode) {
        case webim.CONNECTION_STATUS.ON:
          // webim.Log.warn('连接状态正常...');
          break
        case webim.CONNECTION_STATUS.OFF:
          webim.Log.warn('连接已断开，无法收到新消息，请检查下你的网络是否正常')
          break
        default:
          webim.Log.error(`未知连接状态,status=${res.ErrorCode}`)
          break
      }
    },

    // 监听新消息(大群)事件
    onBigGroupMsgNotify(msgList) {
      for (let i = msgList.length - 1; i >= 0; i--) { // 遍历消息，按照时间从后往前
        const msg = msgList[i]
        webim.Log.error(`receive a new group msg: ${msg.getFromAccountNick()}`)
        // 显示收到的消息
        this.addMsg(msg)
      }
    },

    // 监听新消息(私聊(包括普通消息和全员推送消息)，普通群(非直播聊天室)消息)事件
    onMsgNotify(res) {
      console.log('onMsgNotify', res)
    },

    // 监听群系统消息事件
    onGroupSystemNotifys(res) {
      console.log('onGroupSystemNotifys', res)
    },

    // 监听群资料变化事件
    onGroupInfoChangeNotify(res) {
      console.log('onGroupInfoChangeNotify', res)
    },

    // 登录
    login() {
      webim.login(this.loginInfo, this.listeners, this.options,
        (info) => {
          // identifierNick为登录用户昵称(没有设置时，为帐号)，无登录态时为空
          console.log(info)
          webim.Log.info(`${info.identifierNick} webim登录成功`)
          this.applyJoinBigGroup(this.avChatRoomId) // 加入大群
        },
        (err) => {
          console.log(err.ErrorInfo)
        })
    },

    // 进群
    applyJoinBigGroup(groupId) {
      const options = {
        GroupId: groupId, // 群id
      }
      webim.applyJoinBigGroup(
        options,
        (res) => {
          // JoinedSuccess:加入成功; WaitAdminApproval:等待管理员审批
          if (res.JoinedStatus && res.JoinedStatus == 'JoinedSuccess') {
            webim.Log.info('进群成功')
            // selToID = groupId
          } else {
            console.log('进群失败')
          }
        },
        (err) => {
          console.log(err.ErrorInfo)
        },
      )
    },

    // 退群
    quitBigGroup() {
      const options = {
        GroupId: this.avChatRoomId, // 群id
      }
      webim.quitBigGroup(
        options,
        (res) => {
          console.log(res)
        },
        (err) => {
          console.log(err)
        },
      )
    },

    // 登出
    logout() {
      const options = {

      }
      webim.logout(
        options,
        (res) => {
          console.log(res)
        },
        (err) => {
          console.log(err)
        },
      )
    },

    addMsg(msg) {
      let html = ''
      // 获取会话类型，目前只支持群聊
      // webim.SESSION_TYPE.GROUP-群聊，
      // webim.SESSION_TYPE.C2C-私聊，
      const sessType = msg.getSession().type()
      // 获取消息子类型
      // 会话类型为群聊时，子类型为：webim.GROUP_MSG_SUB_TYPE
      // 会话类型为私聊时，子类型为：webim.C2C_MSG_SUB_TYPE
      const subType = msg.getSubType()
      switch (subType) {
        case webim.GROUP_MSG_SUB_TYPE.COMMON: // 群普通消息
          html = this.convertMsgtoHtml(msg)
          break
        case webim.GROUP_MSG_SUB_TYPE.REDPACKET:// 群红包消息
          // html = `[群红包消息]${this.convertMsgtoHtml(msg)}`
          break
        case webim.GROUP_MSG_SUB_TYPE.LOVEMSG:// 群点赞消息
          // 业务自己可以增加逻辑，比如展示点赞动画效果
          // html = `[群点赞消息]${this.convertMsgtoHtml(msg)}`
          // 展示点赞动画
          // showLoveMsgAnimation()
          break
        case webim.GROUP_MSG_SUB_TYPE.TIP:// 群提示消息
          html = `${this.convertMsgtoHtml(msg)}`
          break
        default:
          break
      }
      if (html) {
        const msgItem = {
          fromAccountNick: msg.fromAccountNick,
          fromAccount: msg.fromAccount,
          isSend: msg.isSend,
          time: msg.time,
          message: html,
          subType: msg.subType,
        }
        this.messageList.push(msgItem)
      }
    },

    convertMsgtoHtml(msg) {
      let html = ''
      const elems = msg.getElems() // 获取消息包含的元素数组
      for (let i = 0, len = elems.length; i < len; i++) {
        const elem = elems[i]
        const type = elem.getType() // 获取元素类型
        const content = elem.getContent() // 获取元素对象
        switch (type) {
          case webim.MSG_ELEMENT_TYPE.TEXT:
            html += this.convertTextMsgToHtml(content)
            break
          case webim.MSG_ELEMENT_TYPE.FACE:
            // html += convertFaceMsgToHtml(content)
            break
          case webim.MSG_ELEMENT_TYPE.IMAGE:
            html += this.convertImageMsgToHtml(content)
            break
          case webim.MSG_ELEMENT_TYPE.SOUND:
            // html += convertSoundMsgToHtml(content)
            break
          case webim.MSG_ELEMENT_TYPE.FILE:
            html += this.convertFileMsgToHtml(content)
            break
          case webim.MSG_ELEMENT_TYPE.LOCATION:// 暂不支持地理位置
            // html += convertLocationMsgToHtml(content);
            break
          case webim.MSG_ELEMENT_TYPE.CUSTOM:
            // html += convertCustomMsgToHtml(content)
            break
          case webim.MSG_ELEMENT_TYPE.GROUP_TIP:
            html += this.convertGroupTipMsgToHtml(content)
            break
          default:
            webim.Log.error(`未知消息元素类型: elemType=${type}`)
            break
        }
      }
      return html
    },

    // 解析文本消息元素
    convertTextMsgToHtml(content) {
      return content.getText()
    },

    // 解析图片消息元素
    convertImageMsgToHtml(content) {
      const smallImage = content.getImage(webim.IMAGE_TYPE.SMALL)// 小图
      let bigImage = content.getImage(webim.IMAGE_TYPE.LARGE)// 大图
      let oriImage = content.getImage(webim.IMAGE_TYPE.ORIGIN)// 原图
      if (!bigImage) {
        bigImage = smallImage
      }
      if (!oriImage) {
        oriImage = smallImage
      }
      return `<img src='${smallImage.getUrl()}#${bigImage.getUrl()}#${oriImage.getUrl()}' style='cursor: hand' id='${content.getImageId()}' bigImgUrl='${bigImage.getUrl()}' />`
    },

    // 解析语音消息元素
    convertSoundMsgToHtml(content) {
      // const second = content.getSecond()// 获取语音时长
      const downUrl = content.getDownUrl()
      if (webim.BROWSER_INFO.type == 'ie' && parseInt(webim.BROWSER_INFO.ver) <= 8) {
        return `[这是一条语音消息]demo暂不支持ie8(含)以下浏览器播放语音,语音URL:${downUrl}`
      }
      return `<audio src="${downUrl}" controls="controls" preload="none"></audio>`
    },

    // 解析文件消息元素
    convertFileMsgToHtml(content) {
      const fileSize = Math.round(content.getSize() / 1024)
      return `<a href="${content.getDownUrl()}" title="单击下载文件" ><i class="glyphicon glyphicon-file">&nbsp;${content.getName()}(${fileSize}KB)</i></a>`
    },

    // 解析群提示消息元素
    convertGroupTipMsgToHtml(content) {
      const WEB_IM_GROUP_TIP_MAX_USER_COUNT = 10
      let text = ''
      const maxIndex = WEB_IM_GROUP_TIP_MAX_USER_COUNT - 1
      let userIdList
      const opType = content.getOpType() // 群提示消息类型（操作类型）
      const opUserId = content.getOpUserId() // 操作人 ID
      switch (opType) {
        case webim.GROUP_TIP_TYPE.JOIN: // 加入群
          userIdList = content.getUserIdList()
          this.allCount = userIdList.length
          // text += opUserId + "邀请了";
          for (let i = 0, len = userIdList.length; i < len; i++) {
            text += `${userIdList[i]},`
            if (userIdList.length > WEB_IM_GROUP_TIP_MAX_USER_COUNT && i == maxIndex) {
              text += `等${userIdList.length}人`
              break
            }
          }
          text += '进入直播间'
          break
        case webim.GROUP_TIP_TYPE.QUIT: // 退出群
          text += `${opUserId}主动退出该群`
          break
        case webim.GROUP_TIP_TYPE.KICK: // 踢出群
          text += `${opUserId}将`
          userIdList = content.getUserIdList()
          for (let i = 0, len = userIdList.length; i < len; i++) {
            text += `${userIdList[i]},`
            if (userIdList.length > WEB_IM_GROUP_TIP_MAX_USER_COUNT && i == maxIndex) {
              text += `等${userIdList.length}人`
              break
            }
          }
          text += '踢出该群'
          break
        case webim.GROUP_TIP_TYPE.SET_ADMIN: // 设置管理员
          text += `${opUserId}将`
          userIdList = content.getUserIdList()
          for (let i = 0, len = userIdList.length; i < len; i++) {
            text += `${userIdList[i]},`
            if (userIdList.length > WEB_IM_GROUP_TIP_MAX_USER_COUNT && i == maxIndex) {
              text += `等${userIdList.length}人`
              break
            }
          }
          text += '设为管理员'
          break
        case webim.GROUP_TIP_TYPE.CANCEL_ADMIN: // 取消管理员
          text += `${opUserId}取消`
          userIdList = content.getUserIdList()
          for (let i = 0, len = userIdList.length; i < len; i++) {
            text += `${userIdList[i]},`
            if (userIdList.length > WEB_IM_GROUP_TIP_MAX_USER_COUNT && i == maxIndex) {
              text += `等${userIdList.length}人`
              break
            }
          }

          text += '的管理员资格'
          break
        // case webim.GROUP_TIP_TYPE.MODIFY_GROUP_INFO: // 群资料变更
        //   text += `${opUserId}修改了群资料：`
        //   const groupInfoList = content.getGroupInfoList()
        //   let type
        //   let value
        //   for (let m = 0, len = groupInfoList.length; m < len; m++) {
        //     type = groupInfoList[m].getType()
        //     value = groupInfoList[m].getValue()

        //     if (type == webim.GROUP_TIP_MODIFY_GROUP_INFO_TYPE.FACE_URL) {
        //       text += `群头像为${value}; `
        //     } else if (type == webim.GROUP_TIP_MODIFY_GROUP_INFO_TYPE.NAME) {
        //       text += `群名称为${value}; `
        //     } else if (type == webim.GROUP_TIP_MODIFY_GROUP_INFO_TYPE.OWNER) {
        //       text += `群主为${value}; `
        //     } else if (type == webim.GROUP_TIP_MODIFY_GROUP_INFO_TYPE.NOTIFICATION) {
        //       text += `群公告为${value}; `
        //     } else if (type == webim.GROUP_TIP_MODIFY_GROUP_INFO_TYPE.INTRODUCTION) {
        //       text += `群简介为${value}; `
        //     } else {
        //       text += `未知信息为:type=${type},value=${value}; `
        //     }
        //   }
        //   break
        // case webim.GROUP_TIP_TYPE.MODIFY_MEMBER_INFO:// 群成员资料变更(禁言时间)
        //   text += `${opUserId}修改了群成员资料:`
        //   var memberInfoList = content.getMemberInfoList()
        //   var userId,
        //     shutupTime
        //   for (const m in memberInfoList) {
        //     userId = memberInfoList[m].getUserId()
        //     shutupTime = memberInfoList[m].getShutupTime()
        //     text += `${userId}: `
        //     if (shutupTime != null && shutupTime !== undefined) {
        //       if (shutupTime == 0) {
        //         text += '取消禁言; '
        //       } else {
        //         text += `禁言${shutupTime}秒; `
        //       }
        //     } else {
        //       text += ' shutupTime为空'
        //     }
        //     if (memberInfoList.length > WEB_IM_GROUP_TIP_MAX_USER_COUNT && m == maxIndex) {
        //       text += `等${memberInfoList.length}人`
        //       break
        //     }
        //   }
        //   break
        default:
          text += `未知群提示消息类型：type=${opType}`
          break
      }
      return text
    },

    // 发送消息(普通消息)
    onSendMsg() {
      if (!this.loginInfo.identifier) { // 未登录
        if (this.accountMode == 1) { // 托管模式
          // 将account_type保存到cookie中,有效期是 1 天
          webim.Tool.setCookie('accountType', this.loginInfo.accountType, 3600 * 24)
          // 调用tls登录服务
          // tlsLogin()
        } else { // 独立模式
          // to do
        }
        return
      }
      if (!this.selToID) {
        console.log('您还没有进入房间，暂不能聊天')
        this.sendContent = ''
        return
      }
      // 获取消息内容
      let msgtosend = this.sendContent
      const msgLen = webim.Tool.getStrBytes(msgtosend)
      if (msgtosend.length < 1) {
        console.log('发送的消息不能为空!')
        return
      }
      let maxLen
      let errInfo
      if (this.selType == webim.SESSION_TYPE.GROUP) {
        maxLen = webim.MSG_MAX_LENGTH.GROUP
        errInfo = `消息长度超出限制(最多${Math.round(maxLen / 3)}汉字)`
      } else {
        maxLen = webim.MSG_MAX_LENGTH.C2C
        errInfo = `消息长度超出限制(最多${Math.round(maxLen / 3)}汉字)`
      }
      if (msgLen > maxLen) {
        console.log(errInfo)
        return
      }
      if (!this.selSess) {
        this.selSess = new webim.Session(this.selType, this.selToID, this.selToID, this.selSessHeadUrl, Math.round(new Date().getTime() / 1000))
      }
      const isSend = true// 是否为自己发送
      const seq = -1// 消息序列，-1 表示 SDK 自动生成，用于去重
      const random = Math.round(Math.random() * 4294967296)// 消息随机数，用于去重
      const msgTime = Math.round(new Date().getTime() / 1000)// 消息时间戳
      let subType// 消息子类型
      if (this.selType == webim.SESSION_TYPE.GROUP) {
        // 群消息子类型如下：
        // webim.GROUP_MSG_SUB_TYPE.COMMON-普通消息,
        // webim.GROUP_MSG_SUB_TYPE.LOVEMSG-点赞消息，优先级最低
        // webim.GROUP_MSG_SUB_TYPE.TIP-提示消息(不支持发送，用于区分群消息子类型)，
        // webim.GROUP_MSG_SUB_TYPE.REDPACKET-红包消息，优先级最高
        subType = webim.GROUP_MSG_SUB_TYPE.COMMON
      } else {
        // C2C消息子类型如下：
        // webim.C2C_MSG_SUB_TYPE.COMMON-普通消息,
        subType = webim.C2C_MSG_SUB_TYPE.COMMON
      }
      const msg = new webim.Msg(this.selSess, isSend, seq, random, msgTime, this.loginInfo.identifier, subType, this.loginInfo.identifierNick)
      // 解析文本和表情
      const expr = /\[[^[\]]{1,3}\]/mg
      const emotions = msgtosend.match(expr)
      let textObj
      let faceObj
      let tmsg
      let emotionIndex
      let emotion
      let restMsgIndex
      if (!emotions || emotions.length < 1) {
        textObj = new webim.Msg.Elem.Text(msgtosend)
        msg.addText(textObj)
      } else { // 有表情
        for (let i = 0; i < emotions.length; i++) {
          tmsg = msgtosend.substring(0, msgtosend.indexOf(emotions[i]))
          if (tmsg) {
            textObj = new webim.Msg.Elem.Text(tmsg)
            msg.addText(textObj)
          }
          emotionIndex = webim.EmotionDataIndexs[emotions[i]]
          emotion = webim.Emotions[emotionIndex]
          if (emotion) {
            faceObj = new webim.Msg.Elem.Face(emotionIndex, emotions[i])
            msg.addFace(faceObj)
          } else {
            textObj = new webim.Msg.Elem.Text(emotions[i])
            msg.addText(textObj)
          }
          restMsgIndex = msgtosend.indexOf(emotions[i]) + emotions[i].length
          msgtosend = msgtosend.substring(restMsgIndex)
        }
        if (msgtosend) {
          textObj = new webim.Msg.Elem.Text(msgtosend)
          msg.addText(textObj)
        }
      }
      webim.sendMsg(msg, (res) => {
        if (this.selType == webim.SESSION_TYPE.C2C) { // 私聊时，在聊天窗口手动添加一条发的消息，群聊时，长轮询接口会返回自己发的消息
          // showMsg(msg)
        }
        webim.Log.info('发消息成功')
        this.sendContent = ''
        this.$refs.inputArea.setValue('')
        console.log(res)
        // hideDiscussForm()// 隐藏评论表单
        // showDiscussTool()// 显示评论工具栏
        // hideDiscussEmotion()// 隐藏表情
      }, (err) => {
        webim.Log.error(`发消息失败:${err.ErrorInfo}`)
        console.log(`发消息失败:${err.ErrorInfo}`)
      })
    },
  },
}
</script>
