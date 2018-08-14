import _import from '@/router/import-page'

export default [{
  path: '/live',
  component: _import('pages/live/index'),
  meta: {
    requiresAuth: true,
    perm: '',
    title: '直播间',
  },
}]
