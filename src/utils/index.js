/**
 * @description 日期格式化
 * @param {String | Number | Date} time
 * @param {String} fmt
 */
export function formatTime(time, fmt = 'yyyy-MM-dd hh:mm') {
  if (!time) return ''
  let ofmt = fmt
  const date = new Date(time)
  const o = {
    'M+': date.getMonth() + 1,                    // 月份
    'd+': date.getDate(),                         // 日
    'h+': date.getHours(),                        // 小时
    'm+': date.getMinutes(),                      // 分
    's+': date.getSeconds(),                      // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3),  // 季度
    S: date.getMilliseconds(),                   // 毫秒
  }
  if (/(y+)/.test(ofmt)) {
    ofmt = ofmt.replace(RegExp.$1, (`${date.getFullYear()}`).substr(4 - RegExp.$1.length))
  }

  Object.keys(o).forEach((k) => {
    if (new RegExp(`(${k})`).test(ofmt)) {
      ofmt = ofmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : ((`00${o[k]}`).substr((`${o[k]}`).length)))
    }
  })
  return ofmt
}

/**
 * @description 格式化操作时间距离当前时间
 * @param {String | Number | Date} time
 * @param {String} fmt
 */
export function formatPassTime(time, fmt) {
  const date = new Date(time)
  const now = Date.now()
  const diff = (now - date) / 1000
  if (diff < 30) {
    return '刚刚'
  }
  if (diff < 3600) { // less 1 hour
    return `${Math.ceil(diff / 60)}分钟前`
  } if (diff < 3600 * 24) {
    return `${Math.ceil(diff / 3600)}小时前`
  } if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (fmt) {
    return formatTime(time, fmt)
  }
  return `${date.getMonth() + 1}月${date.getDate()}日${date.getHours()}时${date.getMinutes()}分`
}

/**
 * @description 转换链接参数为json对象
 * @param {String} url
 * @returns {Object}
 */
export function getQueryObject(url) {
  const currentUrl = url || window.location.href
  const search = currentUrl.substring(currentUrl.lastIndexOf('?') + 1)
  const obj = {}
  const reg = /([^?&=]+)=([^?&=]*)/g
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1)
    let val = decodeURIComponent($2)
    val = String(val)
    obj[name] = val
    return rs
  })
  return obj
}

/**
 * @description 转换json为链接参数字符串
 * @param {Object} json
 * @returns {String}
 */
export function json2Param(json) {
  if (!json) return ''
  return Object.keys(json).map((key) => {
    if (json[key] === undefined) return ''
    return `${encodeURIComponent(key)}=${encodeURIComponent(json[key])}`
  }).join('&')
}

/**
 * @description 合并多个对象
 * @param {Object} target
 * @returns {Object}
 */
export function extend(out, ...params) {
  if (!out) {
    console.error('where is your container ?')
  }
  const objs = [...params]
  if (objs.length > 0) {
    objs.forEach((item, index) => {
      if (typeof item !== 'object') {
        console.error(`item${index} is no valid arguments, expected to be object`)
      } else {
        Object.keys(item).forEach((key) => {
          if (Object.prototype.hasOwnProperty.call(item, key)) {
            if (typeof item[key] === 'object') {
              out[key] = out[key] || {}
              extend(out[key], item[key])
            } else {
              out[key] = item[key]
            }
          }
        })
      }
    })
  } else {
    console.error('no objs to be copy')
  }

  return out
}

/**
 * @description 滚动到指定位置
 * @param {ElementNode} element
 * @param {Number} to
 * @param {Number} duration
 */
export function scrollTo(element, to, duration) {
  if (duration <= 0) return
  const difference = to - element.scrollTop
  const perTick = difference / duration * 10
  setTimeout(() => {
    element.scrollTop += perTick
    if (element.scrollTop === to) return
    scrollTo(element, to, duration - 10)
  }, 10)
}

/*
 * 判断指定路径是否匹配所给路径数组中的某一项
 * @param {pathStr} 指定路径
 * @param {pathList} 路径数组
 * @returns {Boolean} 真假值
 */
export function isMatchPath(pathStr, pathList) {
  for (let i = 0; i < pathList.length; i++) {
    if (pathStr.indexOf(pathList[i]) === 0) {
      return true
    }
  }
}

// 时间格式2014-02-02 14:10:00改成时间戳
export function strtotime(strTime) {
  let newStr = strTime.replace(/:/g, '-')
  newStr = newStr.replace(/ /g, '-')
  const arr = newStr.split('-')
  const datum = new Date(Date.UTC(arr[0], arr[1] - 1, arr[2], arr[3] - 8, arr[4], arr[5]))
  return datum.getTime() / 1000
}
