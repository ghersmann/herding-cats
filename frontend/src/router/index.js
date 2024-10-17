import { createRouter, createWebHistory } from 'vue-router'

import NotesView from '@/views/NotesView.vue'
import GroupMembers from '@/views/GroupMembers.vue'
import ProfilView from '@/views/ProfilView.vue'
import TripOverview from '@/views/TripOverview.vue'
import TimeLine from '@/views/TimeLine.vue'
import StartPage from '@/views/StartPage.vue'
import TransportView from '@/views/TransportView.vue'
import ActivityView from '@/views/ActivityView.vue'
import PackList from '@/views/PackList.vue'
import LodgingView from '@/views/LodgingView.vue'
import LogIn from '@/views/LogIn.vue'
import SignUp from '@/views/SignUp.vue'
import LogOut from '@/views/LogOut.vue'
import AllTravels from '@/views/AllTravels.vue'
import NewTrip from '@/views/NewTrip.vue'
import PersonalNotes from '@/views/PersonalNotes.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: StartPage
    },
    {
      path: '/NewTrip',
      name: 'newtrip',
      component: NewTrip
    },
    {
      path: '/PersonalNotes',
      name: 'personalnotes',
      component: PersonalNotes
    },
    {
      path: '/LogIn',
      name: 'login',
      component: LogIn
    },
    {
      path: '/SignUp',
      name: 'signup',
      component: SignUp
    },
    {
      path: '/LogOut',
      name: 'logout',
      component: LogOut
    },
    {
      path: '/AllTravels',
      name: 'alltravels',
      component: AllTravels
    },
    {
      path: '/notes/:id',
      name: 'notes',
      component: NotesView
    },
    {
      path: '/groupmembers/:id',
      name: 'groupmembers',
      component: GroupMembers
    },
    {
      path: '/groupmembers/:id/:index',
      name: 'profile',
      component: ProfilView
    },
    {
      path: '/timeLine/:id',
      name: 'timeline',
      component: TimeLine
    },
    {
      path: '/trip/:id',
      name: 'trip',
      component: TripOverview
    },
    {
      path: '/transport/:id',
      name: 'transport',
      component: TransportView
    },
    {
      path: '/activity/:id',
      name: 'activity',
      component: ActivityView
    },
    {
      path: '/packlist/:id',
      name: 'packlist',
      component: PackList
    },
    {
      path: '/lodging/:id',
      name: 'lodging',
      component: LodgingView
    }
  ]
})

export default router
