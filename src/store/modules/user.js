
import API from '@/api'
import {
  USER_INFO, USER_TOKEN, USER_PERM, USER_LOGIN, USER_LOGOUT, USER_CLEAR,
} from '@/store/mutations'

// const handlePerm = (list) => {
//   const ret = {}
//   list.forEach((item) => {
//     if (item.perms) {
//       ret[item.perms] = 1
//     }
//   })
//   return ret
// }

const handleClear = (commit) => {
  commit(USER_INFO, '')
  commit(USER_PERM, '')
  commit(USER_TOKEN, '')

  localStorage.removeItem('token')
  localStorage.removeItem('userId')
}

const user = {
  state: {
    token: '',
    userInfo: '',
    perm: '',
  },
  mutations: {
    [USER_TOKEN]: (state, token) => {
      state.token = token
    },
    [USER_INFO]: (state, userInfo) => {
      state.userInfo = userInfo
    },
    [USER_PERM]: (state, perm) => {
      state.perm = perm
    },
  },
  actions: {
    // 登录
    [USER_LOGIN]({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        API.login({
          username,
          password: userInfo.password,
        }).then((res) => {
          localStorage.setItem('token', res.token)
          localStorage.setItem('userId', res.userId)
          commit(USER_TOKEN, res.token)
          resolve(res)
        }).catch((error) => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    [USER_INFO]({ commit }, userId) {
      return new Promise((resolve, reject) => {
        API.getUserInfo(userId).then((res) => {
          commit(USER_INFO, res)
          resolve(res)
        }).catch((error) => {
          reject(error)
        })
      })
    },

    // 前端 登出
    [USER_LOGOUT]({ commit }) {
      return new Promise((resolve, reject) => {
        API.logout().then(() => {
          handleClear(commit)
          resolve()
        }).catch(() => {
          handleClear(commit)
          reject()
        })
      })
    },

    // 前端 清理数据
    [USER_CLEAR]({ commit }) {
      return new Promise((resolve) => {
        handleClear(commit)
        resolve()
      })
    },
  },
}

export default user
