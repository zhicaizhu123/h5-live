import http from '../fetch'

export default {
  // 班主任列表条件查询
  getConditionQuery: data => http.get('/admin/teaching/counsellor', data),

  // 添加班主任
  addCounsellor: data => http.post('/admin/teaching/counsellor', data),

  // 编辑班主任
  editCounsellor: (id, data) => http.post(`/admin/teaching/counsellor/${id}`, data),

  // 绑定班级
  bindClass: data => http.post('/admin/teaching/counsellor/class', data),

  // 禁用-启用
  enableOrDisable: data => http.post('/admin/teaching/counsellor/enableOrDisable', data),

  // 获取CRM所有的班型下拉
  getClassType: data => http.get('/admin/teaching/student/classType', data),

  // 加学员-报读信息获取
  getreadInfo: data => http.get('/admin/teaching/student/read', data),

  // 添加学员
  addStudent: data => http.post('/admin/teaching/student', data),

  // 学籍列表
  getStudent: data => http.get('/admin/teaching/student', data),

  // 查看学员详情
  getStudentInfo: (id, data) => http.get(`/admin/teaching/student/${id}`, data),

  // 查看缴费详情
  getPayment: data => http.get('/admin/teaching/student/payment', data),

  // 升班
  riseClass: data => http.post('/admin/teaching/student/riseclass', data),

  // 转班转专业
  transferSpecialty: data => http.post('/admin/teaching/student/transfer', data),

  // 查看缴费详情
  getTeacher: data => http.get('/admin/teaching/teacher', data),

  // 添加老师
  addTeacher: data => http.post('/admin/teaching/teacher', data),

  // 编辑老师
  editTeacher: (id, data) => http.post(`/admin/teaching/teacher/${id}`, data),

  // 获取crm代理信息
  getAgent: data => http.get('/admin/teaching/teacher/agent', data),

  // 获取老师管理课程
  getTeacherCourse: data => http.get('/admin/teaching/course/teacher', data),

  // 保存老师关联的课程
  addTeacherCourse: data => http.post('/admin/teaching/teacher/course', data),

  // 禁用-启用
  teacherDisable: data => http.post('/admin/teaching/teacher/enableOrDisable', data),

  // 查看老师详情
  getTeacherInfo: (id, data) => http.get(`/admin/teaching/teacher/${id}`, data),

  // 课程关联老师列表
  getAllTeacher: (id, data) => http.get('/admin/teaching/teacher/all', data),
}
