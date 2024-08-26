import { createRouter, createWebHashHistory } from 'vue-router';
import Login from '../views/Login.vue';
import DoctorList from '../views/Doctor-List.vue';
import HomePatient from '../views/Home-Patient.vue';
import HomeDoctor from '../views/Home-Doctor.vue';
import Profile from '../views/Profile.vue';
import PatientDetail from '@/views/PatientDetail.vue';

const router = createRouter({
  history: createWebHashHistory(), // BASE_URLを削除
  routes: [
    {
      path: '/',
      redirect: '/login' // デフォルトルートを追加
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: {
        title: 'Login',
      },
    },
    {
      path: '/patient/:id',  // パスに :id を含める
      name: 'PatientDetail',
      component: PatientDetail,
      meta:{title: "Patient Detail"},
    },
    {
      path: '/home-patient',
      name: 'Home-Patient',
      component: HomePatient,
      meta: {
        title: 'Home',
      },
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile,
      meta: {
        title: 'Profile',
      },
    },
    {
      path: '/doctor-list',
      name: 'Doctor-List',
      component: DoctorList,
      meta: {
        title: '医師一覧',
      },
    },
    {
      path: '/home-doctor',
      name: 'Home-Doctor',
      component: HomeDoctor,
      meta: {
        title: 'Home',
      },
    },
  ],
});

// ログイン状態のチェック
router.beforeEach((to, from, next) => {
  const accountType = window.localStorage.getItem('account_type');
  if (!accountType && to.path !== '/login') {
    next({ name: 'Login' });
  } else if (to.path === '/login' && accountType) {
    if (accountType === 'patient') {
      next({ name: 'Home-Patient' });
    } else if (accountType === 'doctor') {
      next({ name: 'Home-Doctor' });
    }
  } else {
    next();
  }
});

const DEFAULT_TITLE = 'TITLE';

router.afterEach((to) => {
  document.title = to.meta.title ?? DEFAULT_TITLE;
});

export default router;