import { formatTime } from '../utils/index'

export default {
  // 日期过滤器
  formatTime(time, fmt = 'yyyy-MM-dd') {
    if (time) {
      return formatTime(time, fmt)
    }
    return ''
  },
}
