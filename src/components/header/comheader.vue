<template>
	<div class="m-header">
		<div class="icon"></div>
		<h1 class="text">NHB Music</h1>
	</div>
</template>

<script type="text/javascript">
	export default {

	}
</script>

<style lang="stylus">
	@import '~common/stylus/variable'
	@import '~common/stylus/mixin'

	.m-header
	 position:relative
	 height:44px
	 text-align:center
	 color: $color-theme
	 font-size: 0
	 .icon 
	   display: inline-block
	   vertical-align: top
	   margin-top: 4px
	   width: 30px
	   height: 30px
	   margin-right: 5px
	   bg-image('logo')
	   background-size: 30px 30px
	 .text
	   display: inline-block
	   vertical-align: top
	   line-height:44px
	   font-size: $font-size-large


</style>