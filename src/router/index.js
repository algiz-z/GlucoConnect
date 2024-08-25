import { createRouter, createWebHashHistory } from 'vue-router';
import Login from '../views/Login.vue';
import DoctorList from '../views/Doctor-List.vue';
import PatientList from '../views/Patient-List.vue';
import PatientDetail from '../views/Patient-Detail.vue';
import HomePatient from '../views/Home-Patient.vue';
import HomeDoctor from '../views/Home-Doctor.vue';
import Profile from '../views/Profile.vue';

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: {
        title: 'Login',
      },
    },
    {
      path: '/patient-list',
      name: 'Patient-List',
      component: PatientList,
      meta: {
        title: '患者一覧',
      },
    },
    {
      path: '/patient-detail',
      name: 'Patient-Detail',
      component: PatientDetail,
      meta: {
        title: '患者の記録',
      },
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

// 追加: ログイン後のリダイレクト処理
router.beforeEach((to, from, next) => {
  const accountType = window.localStorage.getItem('account_type');

  if (to.path === '/login' && accountType) {
    // ログイン済みであれば適切なタイムラインへリダイレクト
    if (accountType === 'patient') {
      next({ name: 'Home-Patient' });
    } else if (accountType === 'doctor') {
      next({ name: 'Home-Doctor' });
    } else {
      next();
    }
  } else {
    next(); // 通常のルートナビゲーションを許可
  }
});

const DEFAULT_TITLE = 'TITLE';

router.afterEach((to) => {
  document.title = to.meta.title ?? DEFAULT_TITLE;
});

export default router;