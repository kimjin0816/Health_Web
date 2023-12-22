<template>
  <v-main>
    <v-form @submit.prevent="submitForm">
      <v-row>
        <v-col cols="12">
          <h1>회원가입</h1>
          <hr><br>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-text-field label="아이디" v-model="contactInfo.userId" placeholder="id"></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field label="성함" v-model="contactInfo.name" placeholder="name" required></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field label="비밀번호" type="password" v-model="contactInfo.password" placeholder="password"
            required></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field label="비밀번호 확인" type="password" v-model="passwordConfirm" placeholder="password Confirm"
            required></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field label="이메일" v-model="contactInfo.e_mail" placeholder="email" required></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field label="전화번호" v-model="contactInfo.tel" placeholder="phone" required></v-text-field>
        </v-col>
      </v-row>
      <v-btn color="blue darkend-1" text type="submit">확인</v-btn>
    </v-form>
  </v-main>
</template>

<script>
export default {
  name: 'Logon',
  data() {
    return {
      urlinfo: 'http://localhost:8000/members',
      passwordConfirm: null,
      contactInfo: {
        userId: null,
        name: null,
        password: null,
        e_mail: null,
        tel: null,
      },

      // 관리자 페이지에서 user 정보를 보여주기 위한 변수
      headers: [
        { text: '아이디', align: 'left', value: 'id' },
        { text: '이름', align: 'left', value: 'name' },
        { text: '비밀번호', align: 'left', value: 'password' },
        { text: '이메일', align: 'left', value: 'e_mail' },
        { text: '전화번호', align: 'left', value: 'tel' }
      ],

      // DB에서 받아온 데이터를 저장할 배열
      items: []
    }
  },

  computed: {
    passwordMatch() {
      return this.contactInfo.password === this.passwordConfirm;
    }
  },

  created() {
    this.$axios.get(this.urlinfo) //서버에 요청하기
      .then((res) => {
        //console.log(res.data); //성공시
        this.items = res.data;
        console.log(this.items);
      })
      .catch((err) => {
        alert('에러 발생: ' + err); //에러 발생
      });
  },

  methods: {
    // 비밀번호 유무 확인 후 DB에 전송
    submitForm() {
      for (let i = 0; i < this.items.length; i++) {
        if (this.items[i].userId === this.contactInfo.userId) {
          alert('이미 존재하는 아이디입니다.');
          return;
        }
      }
      if (!this.passwordMatch) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
      }
      else {
        if (this.contactInfo.userId === null || this.contactInfo.name === null || this.contactInfo.password === null || this.contactInfo.e_mail === null || this.contactInfo.tel === null) {
          alert('빈칸을 모두 채워주세요.');
          return;
        } else {
          this.$axios.post(this.urlinfo, {
            userId: this.contactInfo.userId,
            name: this.contactInfo.name,
            pw: this.contactInfo.password,
            e_mail: this.contactInfo.e_mail,
            tel: this.contactInfo.tel,
          })
            .then(() => {
              this.$axios.get(this.urlinfo) //서버에 요청하기
                .then((res) => {
                  //console.log(res.data); //성공시
                  this.items = res.data;
                  alert(this.contactInfo.name + "님 환영합니다!!");

                  this.contactInfo.userId = null;
                  this.contactInfo.name = null;
                  this.contactInfo.password = null;
                  this.contactInfo.e_mail = null;
                  this.contactInfo.tel = null;
                  this.passwordConfirm = null;
                })
                .catch((err) => {
                  alert('에러 발생: ' + err); //에러 발생
                });
            })
        }
      }
    },

  }
}
</script>

<style scoped>
#logo_title {
  font-size: 30px;
  font-weight: bold;
  margin-left: 10px;
}

/* 더 이쁘게 만들어줘 */
.v-btn {
  background-color: transparent !important;
  border: none !important;
  box-shadow: none !important;
  color: rgb(7, 0, 0) !important;
  font-size: 20px !important;
  font-weight: bold !important;
  margin-right: 10px !important;
}

.v-form {
  padding: 0 400px !important;
}
</style>