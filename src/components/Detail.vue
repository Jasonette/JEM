<template>
  <div>
    <Spinner v-show="loading"></Spinner>
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
  </div>
</template>
<script>
  import Md from './Md'
  import Spinner from './Spinner'

  export default {
    created () {
			this.fetch()
    },
    components: {
      Md, Spinner
    },
    watch: {
      '$route': 'fetch'
    },
    data (){
      return { item: {name: ""}, loading: true }
    },
    methods: {
      fetch () {
				const self = this
        this.$http.get('https://jasonx.herokuapp.com/jrs/' + this.$route.params.id + '.json').then((response) => {
          self.item = response.body
          this.loading = false
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
