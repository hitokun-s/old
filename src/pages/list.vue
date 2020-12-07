<template>
  <Layout>
    <section class="hero is-medium">
      <!--<section class="hero">-->
      <div class="hero-body">
        <div class="container has-text-centered">
          <div class="columns is-centered">
            <div class="column is-one-fifth">
              <figure class="image">
                <img id="self-img" alt="self photo" class="is-rounded" src="/images/self.jpg">
              </figure>
            </div>
          </div>
        </div>
      </div>
      <!--</section>-->
      <!--<section class="hero is-white has-text-centered animate-fadeUp">-->
      <div class="hero-body">
        <div class="container has-text-centered my-main">
            <h1 class="my-left">Developer</h1>
            <div class="my-center">&amp;</div>
            <h1 class="my-right">Traveler&nbsp;<font-awesome-icon :icon="['fas', 'globe-americas']"/></h1>
          </div>
          <!--<div class="columns is-centered">-->
            <!--<div class="column">-->
              <!--<h1 class="title is-spaced is-size-1-desktop is-size-2-tablet is-size-3-mobile">-->
                <!--Developer &amp; Traveler</h1>-->
              <!--<h2 class="subtitle is-size-4-desktop"></h2>-->
            <!--</div>-->
          <!--</div>-->
      </div>
      <!--</section>-->
      <!--<section class="section is-primary has-text-centered">-->
      <div class="hero-body">
        <div class="container has-text-centered">
          <div class="columns is-centered">
            <h1 class="subtitle is-size-4-desktop">I’m <b>Toshi</b>. Nice to meet you.</h1>
            <!--<h1 class="title is-spaced is-size-3-desktop is-size-4-mobile">I’m <b>Toshi</b><br>-->
            <!--Nice to meet you.</h1>-->
            <!--<h2 class="subtitle is-size-5-desktop">-->
            <!--<div v-html="top"></div>-->
            <!--</h2>-->
          </div>
        </div>
      </div>
      <!--</section>-->
      <Social />
    </section>
  </Layout>
</template>

<script>

  import Header from "../components/Header"
  import Footer from "../components/Footer"
  import Social from "../components/Social"
  import top from "../md/top.md"

  import {library} from '@fortawesome/fontawesome-svg-core'
  import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
  import {
    faGlobeAmericas
  } from '@fortawesome/free-solid-svg-icons'

  library.add(faGlobeAmericas);

  export default {
    name: 'Top',
    metaInfo() {
      return {
        title: "Hitokun's",
        titleTemplate: null,
        meta: [
          { property: `og:locale`, content: `ja_JP` },
          { key: `og:type`, property: `og:type`, content: `website` },
        ]
      }
    },
    components: {Header, Footer, Social, FontAwesomeIcon},
    props: {
      msg: String
    },
    computed: {
      top() {
        return top
      }
    }
  }
</script>

<style lang="scss">

  .my-main{
    display: table !important;
    width: 100% !important;
    margin-bottom: 15px;
  }

  .my-left,
  .my-center,
  .my-right {
    display: table-cell;
    vertical-align: middle;
  }

  .my-left, .my-right{
    width: 45%;
    font-size: 3em;
  }
  .my-center{
    width: 10%;
    font-size: 3em;
  }
  .my-left{
    text-align: right;
  }
  .my-right{
    text-align: left;
  }

  .hero-body{
    padding-top: 10px !important;
    padding-bottom: 10px !important;
  }

  .container{
    min-height: 0 !important;
  }
</style>
