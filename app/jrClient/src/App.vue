<template>
  <div id="app">
    <Navigation v-on:result='update' v-on:activate='activate' v-on:deactivate='deactivate'></Navigation>
		<div class='container'>
			<List :items="items" v-show="activated"></List>
			<router-view class='row'></router-view>
		</div>
  </div>
</template>

<script>
import List from './components/List'
import Navigation from './components/Nav'
import Item from './components/Item'

export default {
  name: 'app',
  components: {
    Navigation, List
  },
	methods: {
		update: function(response){
			this.items = response
		},
		activate: function(){
			this.activated = true
		},
		deactivate: function(){
			const self = this
			setTimeout(function(){
				self.activated = false
			}, 300)
		}
	},
	data () {
		return { items: [], activated: false}
	},
	created () {
		const self = this
		this.$http.get('https://jasonx.herokuapp.com/jrs.json').then((response) => {
			self.items = response.body
		}, (response) => { });
	}
}
</script>
