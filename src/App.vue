<template>
  <div id="app">
    <comheader></comheader>
    <tab></tab>
    <keep-alive>
    	<router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>

<script>
import comheader from 'components/header/comheader'
import tab from 'components/tab/tab'
import Player from 'components/player/player'
export default {
  components:{
    comheader,
    tab,
    Player
  }
}
</script>

<style scoped lang="stylus">
 @import 'common/stylus/variable'

</style>
