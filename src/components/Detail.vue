<template>
  <div class='detail'>
		<div class='col-md-8'>
			<Md :markdown="item.readme"></Md>
		</div>
		<div class='col-md-4'>
			<h1>{{item.name}}</h1>
			<div>{{item.source}}</div>
			<div>{{item.version}}</div>
			<div>{{item.platform}}</div>
			<div>{{item.description}}</div>
		</div>
  </div>
</template>
<script>
  import Md from './Md'
  export default {
    created () {
			this.fetch()
    },
    components: {
      Md 
    },
    watch: {
      '$route': 'fetch'
    },
    data (){
      return {
        item: {name: "hi"}
      }
    },
    methods: {
      fetch () {
				const self = this;
        this.$http.get('https://jasonx.herokuapp.com/jrs/' + this.$route.params.id + '.json').then((response) => {
          self.item = response.body;
        }, (response) => { });
      }
    }
  }
</script>
<style>
  a{
    display:block;
    padding: 20px;
  }
  a:hover{
    text-decoration: none;
    background: #f5f5f5;
  }
	.detail{
		padding-top: 80px;
	}
</style>
