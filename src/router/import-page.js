function importPage(pageName) {
  return () => import(`@/${pageName}.vue`)
}

export default importPage
