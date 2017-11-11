<template>
	<div class="music-list">
		<div class="back" @click="back">
			<i class="icon-return"></i>
		</div>
		<h1 class="title" v-html="title"></h1>
		<div class="bg-img" :style="bgStyle" ref="bgimg">
		    <div class="play-wrapper" v-show="songs.length" ref="btn">
		    	<div class="play" @click = "random">
		    		<i class="icon-play"></i>
		    		<span class="text">随机播放</span>
		    	</div>
		    </div>
			<div class="filter"></div>
		</div>
		<div class="bg-layer" ref="layer"></div>
		<scroll
		 @scroll = "scroll"
         :probe-type = "probeType"
         :listen-scroll = "listenScroll"
		 :data="songs" class="list" ref="list">
			<div class="song-list-wrapper">
				<song-list @select="selectItem" :songs="songs"></song-list>
			</div>
			<div class="loading-container" v-show="!songs.length">
				<loading></loading>
			</div>
		</scroll>
	</div>
</template>

<script type="text/javascript">
import Scroll from 'base/scroll/scroll'
import SongList from 'base/song-list/song-list'
import Loading from 'base/loading/loading'
import {mapActions} from 'vuex'

const retHeight = 40;


	export default {
		created() {
			this.probeType = 3,
			this.listenScroll = true
		},
		data() {
			return {
				scrollY: 0
			}
		},
       props: {
      	bgimg: {
      		type: String,
      		default: ''
      	},
      	songs: {
      		type: Array,
      		default: []
      	},
      	title: {
      		type: String,
      		default: ''
      	}
      },
      computed: {
      	bgStyle() {
      		return `background-image: url(${this.bgimg})`
      	}
      },
      mounted() {
      	this.bgHeight = this.$refs.bgimg.clientHeight
      	this.minHeight = -(this.bgHeight) + retHeight
      	this.$refs.list.$el.style.top = `${this.$refs.bgimg.clientHeight}px`
      },
      components: {
      	Scroll,
      	SongList,
      	Loading
      },
      methods: {
      	scroll(pos){
          this.scrollY = pos.y
      	},
      	selectItem(item, index) {
            this.selectPlay({
            	list:this.songs,
            	index
            })
      	},
      	random() {
           this.randomPlay({
           	list: this.songs
           })
      	},
      	back() {
      		this.$router.back()
      	},
      	...mapActions([
               'selectPlay',
               'randomPlay'
      		])
      },
      watch: {
      	scrollY(newY) {
      		let translateY = Math.max(newY, this.minHeight)
          this.$refs.layer.style['transform'] = `translate3d(0,${translateY}px,0)`
          this.$refs.layer.style['webkitTransform'] = `translate3d(0,${translateY}px,0)`
          let zIndex = 0;
          if(newY<= this.minHeight) {
          	zIndex = 10
          	this.$refs.bgimg.style.paddingTop = 0
          	this.$refs.bgimg.style.height = `${retHeight}px`
          	this.$refs.btn.style.display = 'none'

          }else {
          	this.$refs.bgimg.style.paddingTop = '70%'
          	this.$refs.bgimg.style.height = 0
          	this.$refs.btn.style.display = ''
          }
          this.$refs.bgimg.style.zIndex = zIndex;
         }

      }
	}
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
	@import "~common/stylus/variable"
	@import "~common/stylus/mixin"

	  .music-list
	    position: fixed
	    z-index: 100
	    top: 0
	    left: 0
	    bottom: 0
	    right: 0
	    background: $color-background
	    .back
	      position absolute
	      top: 0
	      left: 6px
	      z-index: 50
	      .icon-return
	        display: block
	        padding: 10px
	        font-size: 18px
	        color: $color-theme
	    .title
	      position: absolute
	      top: 0
	      left: 10%
	      z-index: 40
	      width: 80%
	      no-wrap()
	      text-align: center
	      line-height: 40px
	      font-size: $font-size-large
	      color: $color-text
	    .bg-img
	      position: relative
	      width: 100%
	      height: 0
	      padding-top: 70%
	      transform-origin: top
	      background-size: cover
	      .play-wrapper
	        position: absolute
	        bottom: 20px
	        z-index: 50
	        width: 100%
	        .play
	          box-sizing: border-box
	          width: 135px
	          padding: 7px 0
	          margin: 0 auto
	          text-align: center
	          border: 1px solid $color-theme
	          color: $color-theme
	          border-radius: 100px
	          font-size: 0
	          .icon-play
	            display: inline-block
	            vertical-align: middle
	            margin-right: 6px
	            font-size: $font-size-medium-x
	          .text
	            display: inline-block
	            vertical-align: middle
	            font-size: $font-size-small
	      .filter
	        position: absolute
	        top: 0
	        left: 0
	        width: 100%
	        height: 100%
	        background: rgba(7, 17, 27, 0.4)
	    .bg-layer
	      position: relative
	      height: 100%
	      background: $color-background
	    .list
	      position: fixed
	      top: 0
	      bottom: 0
	      width: 100%
	      background: $color-background
	      .song-list-wrapper
	        padding: 20px 30px
	      .loading-container
	        position: absolute
	        width: 100%
	        top: 50%
	        transform: translateY(-50%)
</style>