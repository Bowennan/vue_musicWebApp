<template>
    <transition name="slideIn">
    	<music-list :songs="songs" :bgimg="bgimg" :title="title"></music-list>
    </transition>
	
</template>

<script type="text/javascript">
import {mapGetters} from 'vuex'
import {getSingerDetail} from 'api/singer'
import {ERR_OK} from 'api/config'
import {createSong} from 'common/js/song'
import musicList from 'components/music-list/music-list'
 
	export default{
		data() {
			return {
				songs: []
			}
		},
		computed: {
			title() {
				return this.singer.name
			},
			bgimg() {
				return this.singer.avatar
			},
          ...mapGetters([
          	'singer'
          ])
		},
		created() {
			this._getDetail()
			// console.log(this.singer)
		},
		methods: {
           _getDetail() {
           	 if(!this.singer.id) {
           	 	this.$router.push('/singer')
           	 	return
           	 }
              getSingerDetail(this.singer.id).then((res) => {
              	if(res.code === ERR_OK) {
              		// console.log(res.data.list)
              		this.songs = this._norSongs(res.data.list)
              		//console.log(this.songs)
              	}
              })
           },
           _norSongs(list) {
           	let ret = []
           	list.forEach((item)=>{
           		let {musicData} = item
           		// console.log({musicData})
           		if(musicData.songid && musicData.albummid) {
           			ret.push(createSong(musicData))
           		}
           	})
           	return ret
           }
		},
		components: {
			musicList
		}
	}
</script>

<style lang="stylus">
	@import "~common/stylus/variable"

	.slideIn-enter-active,.slideIn-leave-active
	 transition: all 0.3s
	.slideIn-enter,.slideIn-leave-to
	 transform:  translate3d(100%, 0, 0)
</style>