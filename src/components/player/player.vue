<template>
	<div class="music-player" v-show="playList.length>0">
		<transition name="normal">
			<div class="nor-player" v-show="fullScreen">
				<div class="background">
					<img :src="currentSong.image" width="100%" height="100%">
				</div>
				<div class="top">
					<div class="back" @click="back">
						<i class="icon-return"></i>
					</div>
					<h1 v-html="currentSong.name" class="title"></h1>
					<h2 v-html="currentSong.singer" class="subtitle"></h2>
				</div>
				<div class="middle">
					<div class="middle-l">
						<div class="cd-wrapper">
							<div class="cd" :class="cdCls">
								<img :src="currentSong.image" class="image">
							</div>
						</div>
					</div>
				</div>
				<div class="bottom">
					<div class="progress-wrapper">
						<span class="time time-l">{{format(currentTime)}}</span>
						<div class="progress-bar-wrapper">
							<progress-bar :percent="percent" @percentChange = "onProgressBar"></progress-bar>
						</div>
						<span class="time time-r">{{format(currentSong.duration)}}</span>
					</div>
					<div class="operators">
						<div class="icon i-left tipwrapper">
							<transition name = "slide-left">
								<div class="tip" v-show="stateShow">
									<span class="tip-size">{{modeState}}</span>
								</div>
							</transition>
							<i :class="iconMode"  @click="changeMode"></i>
						</div>
						<div class="icon i-left">
							<i @click="preSong" class="icon-pre"></i>
						</div>
						<div class="icon i-center">
							<i @click="togglePlaying" :class="playBtn"></i>
						</div>
						<div class="icon i-right">
							<i @click="nextSong" class="icon-next"></i>
						</div>
						<div class="icon i-right">
							<i class="icon-favor"></i>
						</div>
					</div>
				</div>
			</div>
		</transition>
		<transition name="mini">
			<div class="mini-player" v-show="!fullScreen" @click="open">
				<div class="icon">
					<img :src="currentSong.image" width="40px" height="40px" :class="cdCls">
				</div>
				<div class="text">
					<h2 v-html="currentSong.name" class="name"></h2>
					<p v-html="currentSong.singer" class="desc"></p>
				</div>
				<div class="control">
				  <circle-progress :percent="percent" :size="circleSize">
					<i class="icon-mini" :class="playBtn" @click.stop="togglePlaying"></i>
				  </circle-progress>
				</div>
				<div class="control">
					<i class="icon-lists"></i>
				</div>
			</div>
		</transition>
		<audio ref="audio" :src="currentSong.url" @canplay="ready" @error="error" @timeupdate="updateTime" @ended="end"></audio>
	</div>
</template>

<script type="text/javascript">
import {mapGetters, mapMutations} from 'vuex'
import progressBar from 'base/progress-bar/progress-bar'
import circleProgress from 'base/circleProgress/circleProgress'
import {playMode} from 'common/js/config'
import {shuff} from 'common/js/util'

    let timer;

	export default{
        data(){
        	return {
        		songReady: false,
        		currentTime: 0,
        		circleSize: 34,
        		stateShow: false
        	}
        },
		computed: {
			cdCls() {
               return this.playing? 'play' : 'pause'
			},
			playBtn() {
               return this.playing? 'icon-pause' : 'icon-play'
			},
			percent() {
				return this.currentTime/this.currentSong.duration
			},
			iconMode() {
				return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
			},
			modeState() {
				return this.mode === playMode.sequence ? '顺序播放' : this.mode === playMode.loop ? '单曲循环' : '随机播放'
			},
			...mapGetters([
                  'fullScreen',//控制播放器展示的模式全屏/迷你
                  'playList',//添加歌曲到播放列表
                  'currentIndex',//当前歌曲索引值
                  'currentSong',//当前播放歌曲
                  'playing',//播放或者暂停的状态
                  'mode',//播放模式
                  'sequenceList'//获取当前的顺序列表
				])
		},
		methods: {
			changeMode() {
			   clearTimeout(timer)
               const mode = (this.mode+1) % 3;
               this.setPlayMode(mode)
               let list = null
               if(mode === playMode.random) {
                 list = shuff(this.sequenceList)
               }else {
               	list = this.sequenceList
               }
               this.resetCurrentIndex(list)
               this.setPlayList(list)

			},
			//改变播放模式时保证当前播放歌曲始终为currentSong
			resetCurrentIndex(list) {
				let index = list.findIndex((item)=>{
					return item.id === this.currentSong.id

				})
				this.setCurrentIndex(index)
			},
			//播放或者暂停
			togglePlaying() { //改变playing的值，并在watch中监听
              this.setPlayingState(!this.playing)
			},
			preSong() {
				if(!this.songReady) {
					return
				}
              let preIndex = this.currentIndex - 1;
              if(preIndex === -1){
              	preIndex = this.playList.length-1;
              }
              this.setCurrentIndex(preIndex);
              if(!this.playing) {
              	this.togglePlaying()
              }
              this.songReady = false
			},
			end() {
				if(this.mode === playMode.loop) {
					this.$refs.audio.currentTime = 0
					this.$refs.audio.play()
				}else {
					this.nextSong()
				}
			},
			nextSong() {
				if(!this.songReady) {
					return
				}
              let nextIndex = this.currentIndex + 1;
              if(nextIndex === this.playList.length){
              	nextIndex = 0;
              }
              this.setCurrentIndex(nextIndex);
              if(!this.playing) {
              	this.togglePlaying()
              }
              this.songReady = false
			},
			ready() {
				this.songReady = true;
			},
			error(){
               this.songReady = true;
			},
			updateTime(e) {
               this.currentTime = e.target.currentTime
			},
			format(interval) {
               interval = interval | 0;//向下取整
               const min = interval/60 | 0;
               const sec = this._pad(interval%60)
               return `${min}:${sec}`
			},
			_pad(num, n=2) {
               let len = num.toString().length
               while(len<n) {
               	num = '0' + num
               	len++
               }
               return num
			},
			onProgressBar(percent) {
				this.$refs.audio.currentTime = this.currentSong.duration * percent
				if(!this.playing) {
					this.togglePlaying()
				}
			},
			back() {
				// this.fullScreen = false 不能直接操作state中的数据 需要提交一个mutation
				this.setFullScreen(false)
			},
			open() {
				this.setFullScreen(true)
			},
			...mapMutations({
				setFullScreen: 'SET_FULL_SCREEN',
				setPlayingState: 'SET_PLAYING_STATE',
				setCurrentIndex: 'SET_CURRENT_INDEX',
				setPlayMode: 'SET_PLAY_MODE',
				setPlayList: 'SET_PLAYLIST'
			})
		},
		watch: {
			currentSong(newSong,oldSong) {
				if(newSong.id === oldSong.id) {
					return
				}
				this.$nextTick(() => {
					this.$refs.audio.play()
				})
			},
			playing(newPlaying) {
			   const audio = this.$refs.audio
			   this.$nextTick(() => {
                  newPlaying? audio.play() : audio.pause()
              })
			},
			modeState() {
				this.stateShow = true
				timer = setTimeout(()=>{
                   this.stateShow = false
				},800)
			}
		},
		components: {
			progressBar,
			circleProgress
		}
	}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
	@import "~common/stylus/variable"
	@import "~common/stylus/mixin"

	.music-player
	 .nor-player
	  position:fixed
	  left:0
	  right:0
	  top:0
	  bottom:0
	  z-index:200
	  background: $color-background
	  .background
	   position:absolute
	   left: 0
	   top: 0
	   width:100%
	   height:100%
	   z-index:-1
	   opacity: 0.6
	   filter: blur(34px)
	  .top
	   position:relative
	   margin-bottom: 25px
	   .back
	    position:absolute
	    top:0
	    left:8px
	    z-index: 50
	    .icon-return
	     display:block
	     padding:10px
	     font-size: 18px
	     color: $color-theme
	   .title
	    width: 70%
	    margin: 0 auto
	    line-height: 40px
	    text-align: center
	    no-wrap()
	    font-size: $font-size-large
	    color: $color-text
	   .subtitle
	    line-height:20px
	    text-align: center
	    font-size: $font-size-medium
	    color: $color-text
	  .middle
	   position:fixed
	   width: 100%
	   top:80px
	   bottom:170px
	   white-space: nowrap
	   font-size: 0
	   .middle-l
	    display:inline-block
	    vertical-align: top
	    position: relative
	    width: 100%
	    height:0
	    padding-top:80%
	    .cd-wrapper
	     position:absolute
	     left: 10%
	     top:0
	     width:80%
	     height:100%
	     .cd
	       width:100%
	       height:100%
	       box-sizing: border-box
	       border-radius: 50%
	       border: 6px solid rgba(255, 152, 0, 0.33)
	       &.play
	        animation: rotate 20s linear infinite
	       &.pause
	        animation-play-state: paused
	       .image
	        position:absolute
	        left:0
	        top:0
	        width:100%
	        height:100%
	        border-radius:50%
	        box-shadow: 0 0 2px 4px #c5dcc7
	  .bottom
	   position:absolute
	   bottom:50px
	   width: 100%
	   .progress-wrapper
	    display:flex
	    align-items: center
	    width: 80%
	    margin: 0 auto
	    padding: 10px 0
	    .time
	     color: $color-text
	     font-size: $font-size-small
	     flex: 0 0 30px
	     line-height: 30px
	     width:30px
	     &.time-l
	       text-align: left
	     &.time-r
	       text-align: right
	    .progress-bar-wrapper
	     flex: 1
	   .operators
	    display:flex
	    align-items: center
	    .icon
	     flex:1
	     color:$color-theme
	     &.disable
	      color: $color-theme-d
	     .slide-left-enter-active
	      transition: all .2s ease;
	     .slide-left-leave-active
	      transition: all .4s cubic-bezier(1.0, 0.5, 0.8, 1.0)
	     .slide-left-enter
	      transform: translateY(12px)
	      opacity:0
	     .slide-left-leave-to
	      transform: translateX(30px)
	      opacity:0.4
	     &.tipwrapper
	      position: relative
	      .tip
	       position:absolute
	       top:-14px
	       right:0
	       .tip-size
	        font-size:12px
	     i
	      font-size: 30px
	    .i-left
	     text-align: right
	    .i-center
	     padding: 0 20px
	     text-align: center
	     i
	      font-size: 40px
	    .i-right
	     text-align: left
	  &.normal-enter-active, &.normal-leave-active
	   transition: all 0.4s
	   .top, .bottom, .cd
	    transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.23) 
	  &.normal-enter, &.normal-leave-to
	   opacity:0
	   .top
	    transform: translate3d(0, -100px, 0)
	   .bottom
	    transform: translate3d(0, 100px, 0)
	   .cd
	    transform: rotate(360deg) scale(0.6)
	 .mini-player
	  position:fixed
	  left:0
	  bottom:0
	  z-index:201
	  width:100%
	  height:60px
	  display:flex
	  align-items: center
	  background: $color-highlight-background
	  &.mini-enter-active, &.mini-leave-active
	   transition: all 0.3s
	  &.mini-enter, &.mini-leave-to
	   opacity:0
	  .icon
	   flex: 0 0 40px
	   width:40px
	   padding:0 14px
	   img
	    border-radius: 50%
	    &.play
	     animation: rotate 10s linear infinite
	    &.pause
	     animation-play-state: paused
	  .text
	   display:flex
	   flex-direction: column
	   justify-content: center
	   flex:1
	   line-height: 20px
	   overflow:hidden
	   .name
	    margin-bottom:2px
	    no-wrap()
	    font-size: $font-size-medium
	    color: $color-text
	   .desc
	    no-wrap()
	    font-size: $font-size-small
	    color: $color-text-d
	  .control
	   flex: 0 0 30px
	   width: 30px
	   padding:0 10px
	   .icon-lists, .icon-play, .icon-pause
	    font-size: 30px
	    color: $color-theme-d
	   .icon-mini
	    font-size: 28px
	    position: absolute
	    left: 3px
	    top: 3px

	 @keyframes rotate
	    0%
	      transform: rotate(0) scale(1.0)
	      opacity: 1.0
	      border-color: rgba(255, 87, 34, 0.44)
	    50%
	      transform: rotate(180deg) scale(0.88)
	      opacity: 0.8
	      border-color: rgba(0, 150, 136, 0.44)
	    100%
	      transform: rotate(360deg) scale(1.0)
	      opacity: 1.0
	      border-color: rgba(255, 87, 34, 0.44)
</style>