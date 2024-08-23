import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import HomeDoctor from '../views/Home-Doctor.vue';
import HomePatient from '../views/Home-Patient.vue';
import PatientDetail from '../views/Patient-Detail.vue';
  
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: {
        title: 'Home'
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: {
        title: 'Login'
      }
    },
    {
      path: '/home-doctor',
      name: 'Home-Doctor',
      component: HomeDoctor,
      meta: {
        title: 'Home'
      }
    },
    {
      path: '/patient-detail',
      name: 'Patient-Detail',
      component: PatientDetail,
      meta: {
        title: '患者の記録'
      }
    },
    {
      path: '/home-patient',
      name: 'Home-Patient',
      component: HomePatient,
      meta: {
        title: '患者側'
      }
    }
  ],
})

const DEFAULT_TITLE = 'TITLE';

router.afterEach((to) => {
  document.title = to.meta.title ?? DEFAULT_TITLE
})

export default router
