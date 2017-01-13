<template>
  <div v-html="md"></div>
</template>
<script>
  import Showdown from 'showdown'
  const converter = new Showdown.Converter();
  export default {
    props: ['markdown'],
		computed: {
			md () {
				return converter.makeHtml(this.markdown)
			}
		}
  }
</script>
