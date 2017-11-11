import Vue from 'vue'
import Router from 'vue-router'
import Recommend from 'components/recommend/recommend'
import Search from 'components/search/search'
import Rank from 'components/rank/rank'
import Singer from 'components/singer/singer'
import SingerDetail from 'components/singer-detail/singer-detail'

Vue.use(Router)

export default new Router({
  linkActiveClass:'active',
  routes: [
    {
    	path:'/',
    	redirect:'/recommend'
    },
    {
     path:'/recommend',
     component:Recommend
    },
    {
     path:'/search',
     component:Search
    },
    {
     path:'/rank',
     component:Rank
    },
    {
     path:'/singer',
     component:Singer,
     children: [
        {
         path: ':id',
         component: SingerDetail
         }
     ]
    }
  ]
})