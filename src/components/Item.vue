<template>
	<div class='item'>
		<router-link :to="{name: 'detail', params: {id: item.id}}">
			<h1>{{item.name}}</h1>
			<div><b>[{{item.platform}}]</b> {{item.description}}</div>
		</router-link>
	</div>
</template>
<script>
  export default {
		name: "item",
    props: ['item']
  }
</script>
<style scoped lang="scss">
  .item a{
    display:block;
    padding: 5px 20px !important;
    word-break: break-word;
    text-decoration: none;
		color: #202020 !important;
  }
  .item a:hover{
    text-decoration: none;
    background: #f5f5f5;
  }
	.item h1{
		font-size: 12px;
		margin: 0;
	}
</style>
