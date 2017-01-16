<template>
	<div class='list container'>
		<Item v-for="item in items" :item="item"></Item>
	</div>
</template>
<script>
  import Item from './Item'
  export default {
    name: "list",
		props: ['items'],
    components: {
      Item
    }
  }
</script>
<style lang="scss">
.list{
	position: fixed;
	top: 52px;
	max-height: 300px;
	overflow: auto;
	background: white;
	z-index: 100;
	border: 1px solid silver;
	border-top: none;
	padding: 0;
}	
</style>
