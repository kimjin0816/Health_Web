<template>
  <v-app>
    <v-container v-if="currentComponent === 'carousel'">
      <v-carousel :value="currentSlide" class="carousel">
        <v-carousel-item v-for="(slide, index) in slides" :key="index">
          <v-img :src="slide.image" :alt="slide.alt"></v-img>
        </v-carousel-item>
      </v-carousel>
      <Crwaling />
    </v-container>
  </v-app>
</template>

<script>
import Crwaling from '@/components/Crwaling.vue';


export default {
  name: 'HomeView',
  data() {
    return {
      components: {
        Crwaling
      },
      drawer: null,
      currentSlide: 0,
      currentComponent: 'carousel',
      interval: null,
      slides: [
        { image: require('@/assets/image/home_background1.jpg'), alt: 'slide4' },
        { image: require('@/assets/image/home_background2.jpg'), alt: 'slide3' },
        { image: require('@/assets/image/home_background3.jpg'), alt: 'slide2' },
        { image: require('@/assets/image/home_background4.jpg'), alt: 'slide1' },
        { image: require('@/assets/image/program.jpg'), alt: 'slide5' }
      ]
    };
  },
  created() {
    this.startInterval();
  },
  methods: {
    startInterval() {
      this.intervalId = setInterval(this.nextSlide, 3000); // 3초마다 nextSlide 메서드를 실행합니다.
    },
    nextSlide() {
      // 현재 슬라이드를 변경합니다.
      this.currentSlide = (this.currentSlide + 1) % this.slides.length;
    },
  },
  components: { Crwaling }
};

</script>

<style>
#logo_title {
  font-size: 30px;
  font-weight: bold;
  margin-left: 10px;
}

.v-btn {
  background-color: transparent !important;
  border: none !important;
  box-shadow: none !important;
  font-size: 20px !important;
  font-weight: bold !important;
  margin-right: 10px !important;
}

.carousel {
  height: 500px;
  margin-top: 85px;
  width: 100%;
}
</style>
