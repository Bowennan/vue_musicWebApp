<template>
	<div class="progress-bar" ref="progressBar" @click = "progressClick">
		<div class="bar-inner">
			<div class="progress" ref="progress"></div>
			<div class="progress-btn-wrapper" ref="progressBtn"
              @touchstart.prevent = "progressTouchStart"
              @touchmove.prevent = "progressTouchMove"
              @touchend = "progressTouchEnd"
			>
				<div class="progress-btn"></div>
			</div>
		</div>
	</div>
</template>

<script>
const btnWidth = 16
	export default {
        props: {
        	percent: {
        		type: Number,
        		default: 0
        	}
        },
        created() {
        	this.touch = {}
        },
        methods: {
        	progressClick(e) {
               this.offSet(e.offsetX)
               this.triggerPercent()
        	},
        	progressTouchStart(e) {
               this.touch.init = true
               this.touch.startX = e.touches[0].pageX 
               this.touch.left = this.$refs.progress.clientWidth  //记录已经播放了的进度长短
        	},
        	progressTouchMove(e) {
               if(!this.touch.init) {
               	return
               }
               const deltaX = e.touches[0].pageX - this.touch.startX // 手指滑动的偏移量（相对touchstart的位置）
               const offsetWidth =Math.min(this.$refs.progressBar.clientWidth - btnWidth,  Math.max(0, this.touch.left + deltaX))
               this.offSet(offsetWidth)
        	},
        	progressTouchEnd() {
              this.touch.init = false
              this.triggerPercent()
        	},
        	triggerPercent() {
               const barWidth = this.$refs.progressBar.clientWidth - btnWidth
               const percent = this.$refs.progress.clientWidth / barWidth
               this.$emit('percentChange', percent)
        	},
        	offSet(offsetWidth) {
              this.$refs.progress.style.width = `${offsetWidth}px`
              	this.$refs.progressBtn.style.transform = `translate3d(${offsetWidth}px,0,0)`
              	this.$refs.progressBtn.style.webkitTransform = `translate3d(${offsetWidth}px,0,0)`
        	}
        },
        watch:{
          percent(newVal){
              if(newVal>=0  && !this.touch.init) {
              	const barWidth = this.$refs.progressBar.clientWidth - btnWidth
              	const offsetWidth = newVal * barWidth //偏移的宽度
              	this.offSet(offsetWidth)
              }
          }
        }
	}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
	@import "~common/stylus/variable"

	.progress-bar
	  height: 30px
	  .bar-inner
	    position: relative
	    top: 13px
	    height: 4px
	    background: rgba(0,0,0,0.4)
	    .progress
	      position: absolute
	      height:100%
	      background: $color-theme
	    .progress-btn-wrapper
	      position: absolute
	      left: -8px
	      top: -13px
	      width: 30px
	      height: 30px
	      .progress-btn
	        position: relative
	        top: 7px
	        left: 7px
	        box-sizing: border-box
	        width: 16px
	        height: 16px
	        border: 3px solid $color-text
	        border-radius: 50%
	        background: $color-theme
</style>