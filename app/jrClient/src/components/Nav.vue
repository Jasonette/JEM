<template>
  <nav class="navbar">
    <div class="container">

    <div class="back-container" v-if="['detail'].indexOf($route.name) > -1">
        <router-link :to="{name: 'home'}" class='navbar-brand'><span class="glyphicon glyphicon-circle-arrow-left"></span></router-link>
    </div>

      <div class="navbar-header">
				<form class="navbar-form">
					<router-link :to="{name: 'home'}" class='navbar-brand'>{ ˃̵̑ᴥ˂̵̑}</router-link>
					<div class="form-group">
						<input type="text" class="form-control" placeholder="Search" @keyup="search" @focus="activate" @blur="deactivate">
					</div>
				</form>
      </div>
    </div>
  </nav>
</template>
<script>
	import _ from 'lodash'
	export default {
		methods: {
			deactivate(e) {
				this.$emit("deactivate")
			},
			activate (e) {
				this.$emit("activate")
			},
			search (e) {
				const self = this
				const hit = _.debounce(function(query){
					self.$http.get(`https://jasonx.herokuapp.com/search.json?query=${query}`).then((response) => {
						self.$emit('result', response.body)
					}, (response) => {
					});
				}, 500)
				if(e.target.value.length > 0){
					hit(e.target.value)
				}
			}
		}
	}
</script>
<style scoped lang="scss">
  nav.navbar{
    border-radius: 0 !important;
		-webkit-box-shadow: 0px 1px 8px 0px rgba(240,237,240,1);
		-moz-box-shadow: 0px 1px 8px 0px rgba(240,237,240,1);
		box-shadow: 0px 1px 8px 0px rgba(240,237,240,1);
		background: white;
		position: fixed;
		top:0;
		left:0;
		right:0;
		z-index: 100;
  }
	nav.navbar .navbar-brand{
		display: inline-block;
		height: 35px;
		line-height: 35px;
		width: 100px;
		font-weight: bold;
		font-size: 20px;
		background: white;
		padding: 0;
		text-align: center;
		color: #202020;
	}
	nav.navbar .navbar-header{
		width: 100%;
	}
	nav.navbar .navbar-form{
		width: 100%;
	}
	nav.navbar .form-group{
    width: -moz-calc(100% - 100px);
    width: -webkit-calc(100% - 100px);
    width: calc(100% - 100px);
		display: inline-block;
	}
	input.form-control{
		border-radius: 0;
		border: none;
		width: 100% !important;
		background: whitesmoke;
	}
	input.btn{
		border-radius: 0;
		border:none;
	}
  .back-container{
    position: absolute;
    left: 20px;
    top: 20%;
  }
</style>
