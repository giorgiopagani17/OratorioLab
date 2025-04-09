import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    children: [{ path: '', component: () => import('pages/LoginPage.vue') }],
  },
  {
    path: '/home',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/HomePage.vue') }],
  },
  {
    path: '/users',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/UsersPage.vue') }],
  },
  {
    path: '/events',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/EventsActivities/HomeEventsActivitiesPage.vue'), props: { type: 'events' } }],
  },
  {
    path: '/activities',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/EventsActivities/HomeEventsActivitiesPage.vue'), props: { type: 'activities' } }],
  },
  {
    path: '/balance',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/Balance/BalancePage.vue'),  props: { section: 'all' } }],
  },
  {
    path: '/:section(activities|events)',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: 'create', component: () => import('@/pages/EventsActivities/Create/CreateEventsActivities.vue'), props: (route) => ({ type: route.query.type, section: route.params.section }) }]
  },
  {
    path: '/:section(activities|events)',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: 'view', component: () => import('@/pages/EventsActivities/View/AllEventsActivities.vue'), props: (route) => ({ type: route.query.type, section: route.params.section, isDraft: false }) }]
  },
  {
    path: '/:section(activities|events)',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: 'view/:id',
        component: () => import('@/pages/EventsActivities/View/SingleEventActivity.vue'),
        props: (route) => ({
          id: Number(route.params.id),
          section: route.params.section
        })
      }
    ]
  },
  {
    path: '/:section(activities|events)',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: 'drafts',
        component: () => import('@/pages/EventsActivities/View/AllEventsActivities.vue'),
        props: (route) => ({
          section: route.params.section,
          isDraft: true
        })
      }
    ]
  },
  {
    path: '/:section(activities|events)',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: 'view/:id/subscriptions',
        component: () => import('@/pages/EventsActivities/Subscriptions/AllSubscriptionsPage.vue'),
        props: (route) => ({
          id: Number(route.params.id),
          section: route.params.section
        })
      }
    ]
  },
  {
    path: '/:section(activities|events)',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: 'view/:id/balance',
        component: () => import('@/pages/Balance/BalancePage.vue'),
        props: (route) => ({
          id: Number(route.params.id),
          section: route.params.section
        })
      }
    ]
  },
  {
    path: '/:section(activities|events)',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: 'balance',
        component: () => import('@/pages/Balance/BalancePage.vue'),
        props: (route) => ({
          section: route.params.section,
        })
      }
    ]
  },
  {
    path: '/settings',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/Settings/SettingsPage.vue') }],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
