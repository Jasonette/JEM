<template>
  <div>
    <Spinner v-show="loading"></Spinner>
    <div class='detail'>
      <div class='col-md-4 col-md-push-8'>
        <h1 class="text-capitalize">{{item.name}}</h1>
        <h4>{{item.description}}</h4>
        <h4>{{item.v}}</h4>
        <h4>{{item.platform}}</h4>
        <p><a v-bind:href='item.original_url'>{{item.original_url}}</a></p>
        <button id="btnInstall" class="btn btn-primary btn-lg" type="button" :url="item.original_url" :platform="item.platform" >Install</button>
      </div>
      <hr class="hidden-md hidden-lg">
      <div class='col-md-8 col-md-pull-4 markdown'>
        <Md :markdown="item.readme"></Md>
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
<style lang="scss">
	.detail {
		padding-top: 80px;
	}
  .markdown {
    img {
      width: 100%;
    }
  }
</style>
