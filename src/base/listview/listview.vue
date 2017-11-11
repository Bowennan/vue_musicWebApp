<template>
	
		<scroll class="listview" :data="data" ref="listview" :listenScroll="listenScroll"
		:probeType="probeType" @scroll = "scroll">
			<ul>
				<li v-for="group in data" class="list-group" ref="listGroup">
					<h2 class="list-title">{{group.title}}</h2>
					<ul>
						<li @click="selectItem(item)" v-for="item in group.items" class="list-item">
							<img class="avatar" v-lazy="item.avatar">
							<span class="name">{{item.name}}</span>
						</li>
					</ul>
				</li>
			</ul>
			<div class="list-shortcut">
				<ul @touchstart = "onShortcutStart" @touchmove.stop.prevent="onShortcutMove">
					<li v-for="(item, index) in shortcutList" class="item" :class="{current: currentIndex===index}" :data-index="index">
						{{item}}
					</li>
				</ul>
			</div>
			<div class="fix-title" v-show="fixTitle">
				<h2 class="list-title">{{fixTitle}}</h2>
			</div>
		</scroll>
	
</template>

<script type="text/javascript">
 import Scroll from 'base/scroll/scroll'
 import {getData} from 'common/js/dom'
 let anchorHeight = 20;
	export default {
		created() {
           this.touch = {};
           this.listenScroll = true;
           this.listHeight = [];
           this.probeType = 3;
		},
		props: {
			data: {
				type: Array,
				default: []
			}
		},
		data(){
          return {
          	scrollY: -1,
          	currentIndex: 0
          }
		}, 
		computed: {
			shortcutList() {
				return this.data.map((group) => {
					return group.title.substr(0,1)
				})
			},
			fixTitle() {
				if(this.scrollY>0){
					return ''
				}
				return this.data[this.currentIndex]? this.data[this.currentIndex].title : ''
			}
		},
		methods: {
			selectItem(item) {
				this.$emit('select', item)
			},
			onShortcutStart (e) {
              let anchorIndex = getData(e.target, 'index')
              let firstTouch = e.touches[0]
              this.touch.y1 = firstTouch.pageY
              this.touch.anchorIndex = anchorIndex
              this.scrollY = -this.listHeight[anchorIndex]
              this.$refs.listview.scrollToElement(this.$refs.listGroup[anchorIndex], 0)
			},
			onShortcutMove(e) {
              let firstTouch = e.touches[0]
              this.touch.y2 = firstTouch.pageY
              let delta = Math.round((this.touch.y2 - this.touch.y1)/anchorHeight)
              let anchorIndex =parseInt(this.touch.anchorIndex) + delta
              if(anchorIndex<0){
              	anchorIndex = 0;
              }else if(anchorIndex>this.listHeight.length-2){
              	anchorIndex = this.listHeight.length-2;
              }
              this.scrollY = -this.listHeight[anchorIndex]
              this.$refs.listview.scrollToElement(this.$refs.listGroup[anchorIndex], 0)
			},
			scroll(pos) {
               this.scrollY = pos.y
               //console.log(this.currentIndex);
			},
			_calculateH(){
                this.listHeight = []
                const list = this.$refs.listGroup;
                let height = 0;
                this.listHeight.push(height)
                for(let i =0; i<list.length; i++) {
                	let item = list[i];
                	height += item.clientHeight
                	this.listHeight.push(height)
                }

			}
		},
		watch: {
			data(){
				setTimeout(()=>{
                   this._calculateH()
				},20)
			},
			scrollY(newY) {
				const listHeight = this.listHeight
				if(newY>0){
					this.currentIndex = 0;
					return
				}
				for(let i = 0; i<listHeight.length; i++){
					let height1 = listHeight[i]
					let height2 = listHeight[i+1]
					if(!height2 || (-newY >= height1 && -newY < height2)){
						this.currentIndex = i
						return
					}
				}
				this.currentIndex = 0;
			}
		},
		components: {
			Scroll
		}
	}
</script>

<style lang="stylus">
	@import '~common/stylus/variable'

	.listview
	 position: relative
	 width: 100%
	 height: 100%
	 overflow: hidden
	 background: $color-background
	 .fix-title
	   position:absolute
	   top:0
	   left:0
	   width:100%
	   background:rgb(44, 25, 13)
	   .list-title
	    height:30px
	    line-height:30px
	    padding-left: 20px
	    font-size: $font-size-small
	    color: $color-highlight-text
	 .list-group
	   padding-bottom: 30px
	   .list-title
	    height:30px
	    line-height:30px
	    padding-left: 20px
	    font-size: $font-size-small
	    color: $color-highlight-text
	   .list-item
	    display: flex
	    align-items: center
	    padding: 20px 0 0 30px
	    .avatar
	     width:50px
	     height:50px
	     border-radius: 50%
	    .name
	     margin-left: 20px
	     color: $color-text-1
	     font-size: $font-size-medium 
	 .list-shortcut
	  position: absolute
	  z-index: 50
	  right:2px
	  top:50%
	  transform: translateY(-50%)
	  width: 20px
	  padding:18px 0
	  border-radius: 4px
	  text-align: center
	  background: transparent
	  font-family: Helvetica
	  .item
	   padding:2px
	   line-height:1.2
	   color: $color-text-l
	   font-size: $font-size-small
	   &.current
	    color: $color-theme
	    font-weight:700


	    

</style>