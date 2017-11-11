<template>
	<div class="recommend">
		<scroll ref="scrollcom" class="rec-con" :data = "mvList" :click = false>
		   <div>
			<div v-if="recommends.length" class="slider-wrap">
				<slider>
					<div v-for="item in recommends">
						<a :href="item.linkUrl">
							<img @load="imgLoaded" :src="item.picUrl">
						</a>
					</div>
				</slider>
			</div>
			<div class="rec-list">
				<h1 class="list-title">热门MV推荐</h1>
				<ul style="padding-left: 0">
				  <li v-for="item in mvList" class="item">
				  	
				  		<div class="icon">
				  			<a :href="item.herf_string">
					  		<img v-lazy="item.picurl" width="80" height="60">
					  		</a>
					  	</div>
					  	<div class="text">
					  		<h2 class="name" v-html="item.mvtitle"></h2>
					  		<p class="desc" v-html="item.singer_name"></p>
					  	</div>
				  	
				  </li>	
				</ul>
			</div>
		  </div>	
		  <div class="loading-con" v-show="!mvList.length">
		  	<loading></loading>
		  </div>
		</scroll>
	</div>
</template>

<script type="text/javascript">
    import loading from 'base/loading/loading'
    import Scroll from 'base/scroll/scroll'
    import Slider from 'base/slider/slider'
    import {getRec,getMv} from 'api/recommend'
    import {ERR_OK} from 'api/config'

	export default {
	  data() {
       return {
       	recommends:[],
       	mvList:[]
       }
	  },
      created() {
         
         this._getRecdata();
         this._getMv();
      },
      methods: {
      	_getRecdata() {
      		getRec().then((res) =>{
              if(res.code === ERR_OK) {
              	this.recommends = res.data.slider
              }
      		})
      	},
      	_getMv() {
      		getMv().then((res) =>{
              if(res.code === ERR_OK) {
              	// console.log("succeed")
              	// console.log(res.data.mvlist);
              	this.mvList = this._formatData(res.data.mvlist);
              }
      		})
      	},
      	_formatData(list) {
           let listData = []
           
           for(let i = 0; i<list.length; i++){
           	  let cols = {}
              cols.mvtitle = list[i].mvtitle
              cols.singer_name = list[i].singer_name
              cols.picurl = list[i].picurl
              cols.vid = list[i].vid
              cols.herf_string = `https://y.qq.com/n/yqq/mv/v/${cols.vid}.html`
              listData.push(cols)
           }
           return listData
      	},
      	imgLoaded() {
      		if(!this.imgDone){
               this.$refs.scrollcom.refresh();
               this.imgDone = true;
      		}
      	}
      },
      components: {
      	Slider,
      	Scroll,
      	loading
      }
	}
</script>

<style lang="stylus">
	@import '~common/stylus/variable'

	.recommend
	  position:fixed
	  width: 100%
	  top: 88px
	  bottom:0
	  .rec-con
	    height:100%
	    overflow: hidden
	    .slider-wrap
	      position:relative
	      width:100%
	      overflow:hidden
	    .rec-list
	      .list-title
	        height: 65px
	        line-height: 65px
	        text-align: center
	        font-size: $font-size-medium
	        color: $color-theme
	      .item
	        display: flex
	        box-sizing: border-box
	        align-items: center
	        padding: 0 20px 20px 20px
	        .icon
	          flex: 0 0 60px
	          width:80px
	          padding-right: 10px
	        .text
	          display:flex
	          flex-direction: column
	          justify-content: center
	          flex: 1
	          line-height: 20px
	          overflow: hidden
	          font-size: $font-size-small
	          .name
	            font-weight:blod
	            font-size: 14px
	            margin-bottom: 10px
	            color: $color-text
	          .desc
	            color: $color-text-d      
	  .loading-con
	    position:absolute
	    width:100%
	    top:50%
	    transform: translateY(-50%)     

</style>