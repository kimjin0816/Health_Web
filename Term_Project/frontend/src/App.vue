<template>
  <v-app>
    <v-navigation-drawer absolute temporary v-model="drawer" width="300">
      <v-toolbar flat height="150px">
        <v-list>
          <v-list-item>
            <v-list-item-content v-if="loginStatus === 'after'">
              <v-list-item-avatar>
                <img src="https://png.pngtree.com/png-vector/20191009/ourmid/pngtree-user-icon-png-image_1796659.jpg">
              </v-list-item-avatar>
              <v-list-item-title>{{ this.username }}님 환영합니다!</v-list-item-title>
              <v-list-item>
                <v-list-item-content>
                  <v-btn @click="userDestroy">
                    <v-list-item-title>탈퇴하기<v-icon>mdi-logout</v-icon></v-list-item-title>
                  </v-btn>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-content>
          </v-list-item>
          <v-list-item-content v-if="loginStatus === 'before'">
            <!-- <v-list-item-title>로그인<v-icon>mdi-login</v-icon></v-list-item-title> -->
            <v-btn to="/Login">로그인<v-icon>mdi-login</v-icon></v-btn>
          </v-list-item-content>
        </v-list>

      </v-toolbar>
      <v-divider></v-divider>
      <v-list class="pt-3">
        <v-list-item v-for="item in items" :key="item.text">
          <router-link :to="item.to" tag="v-list-item" v-if="shouldRenderItem(item)">
            <v-list-item-action>
              <div class="icon-text-container">
                <v-btn>
                  <v-icon>{{ item.icon }}</v-icon>
                  <span>{{ item.text }}</span>
                </v-btn>
              </div>
            </v-list-item-action>
          </router-link>
        </v-list-item>
      </v-list>

    </v-navigation-drawer>
    <v-app-bar app color="black" dark height="100px">
      <div class="d-flex align-center">
        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      </div>
      <v-btn to="/">
        <v-img alt="Logo" contain
          src="https://img.freepik.com/premium-vector/bodybuilding-sports-fitness-logo-icon-vector-template_630259-12.jpg"
          transition="scale-transition" width="100px" height="100px" />
        <span id="logo_title">조아GYM</span>
      </v-btn>
      <v-spacer></v-spacer>
      <!-- <v-spacer>이런 공간입니다.</v-spacer> -->

      <div v-if="loginStatus === 'before'">
        <v-btn to="/Login">로그인 </v-btn>
        <v-btn to="/Logon">회원가입</v-btn>
      </div>
      <div>
        <v-btn v-if="loginStatus === 'after'" @click="logout()">로그아웃</v-btn>
      </div>
    </v-app-bar>
    <v-container>
      <router-view></router-view>
    </v-container>

  </v-app>
</template>

<script>
import { EventBus } from '@/EventBus';

export default {
  name: 'App',
  data() {
    return {
      drawer: null,
      urlinfo: 'http://localhost:8000',
      dialog: true,
      items: [
        { text: '신체/기구 별 운동', icon: 'mdi-star', to: '/HealthAPI' },
        { text: '나의 운동 계획', icon: 'mdi-account-multiple', to: '/Routine', if: "loginStatus === 'after'" },
        { text: '당일 운동 성과', icon: 'mdi-star', to: '/Posting', if: "loginStatus === 'after'" },
      ],
      userId: '',
      username: '',
      loginStatus: 'before',
      user: []
    }
  },
  mounted() {
    // this.checkLogin();
    // this.crawling();
  },
  created() {
    this.$bus.$on('user', (data) => {
      this.username = data.name;
      this.userId = data.userId;
      console.log('userId: ' + this.userId);
      EventBus.$emit('userId', this.userId);
    });
    this.$bus.$on('loginStatus', (data) => {
      this.loginStatus = data;
    });
  },
  methods: {
    shouldRenderItem(item) {
      if (item.if) {
        return this.loginStatus === 'after';
      }
      return true;
    },
    logout() {
      this.$axios.get(this.urlinfo + '/logout', {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        withCredentials: true
      }).then(res => {
        console.log(res);
        // console.log(response);
        this.loginStatus = 'before';
        if (this.$route.path == '/') {
          this.$router.go();
        } else {
          this.$router.push('/');
        }

      })
        .catch(error => {
          console.error(error);
        });
    },
    userDestroy() {
      this.$axios.delete(this.urlinfo + `/members/${this.userId}`, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        withCredentials: true
      }).then(res => {
        this.loginStatus = 'before';
        this.logout();
      }).catch(error => {
        console.error(error);
      });
    },
    // checkLogin() {
    //   this.$axios.get(this.urlinfo + '/login', {
    //     headers: {
    //       "Content-Type": "application/x-www-form-urlencoded",
    //     },
    //     withCredentials: true
    //   }).then(res => {
    //     console.log(res);
    //     // console.log(response);
    //     this.loginStatus = 'after';
    //     this.$router.push('/Routine');
    //   })
    //     .catch(error => {
    //       console.error(error);
    //     });
    // },
  }
}
</script>

<style>
.icon-text-container {
  display: flex;
  align-items: center;
}

.icon-text-container v-icon {
  margin-right: 5px;
  /* 아이콘과 텍스트 사이의 간격을 조절할 수 있는 마진 값입니다. */
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.v-toolbar__content {
  justify-content: center;
}
</style>
