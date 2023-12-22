<template>
    <v-layout row justify-center>
        <v-dialog v-model="dialog" persistent max-width="500px">
            <v-card>
                <v-card-title>
                    <span class="headline">{{ dialogTitle }}</span>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" @click="closeDialog()" to="/"><v-icon>mdi-close</v-icon></v-btn>
                </v-card-title>
                <v-card-text>
                    <v-container grid-list-md>
                        <v-layout wrap>
                            <v-flex xs12>
                                <v-text-field label="아이디" v-model="username" required></v-text-field>
                            </v-flex>
                            <v-flex xs12>
                                <v-text-field label="비밀번호" type="password" v-model="password" required></v-text-field>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text type="submit" @click="submitForm">로그인</v-btn>
                    <!-- <v-btn color="blue darken-1" text @click="findUser">ID/PW 찾기</v-btn> -->
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-layout>
</template>

<script>
import qs from 'qs';
export default {
    name: 'Login',
    data() {
        return {
            dialog: true,
            dialogTitle: '로그인',
            urlinfo: 'http://localhost:8000',
            username: null,
            password: null,
            items: [],
            loginStatus: '',
            item: []
        }
    },
    created() {

    },
    methods: {
        openDialog() {
            this.dialog = true;
        },
        closeDialog() {
            this.dialog = false;
            this.$router.push('/');
        },
        findUser() {

        },
        submitForm() {
            const userData = {
                username: this.username,
                password: this.password,
            };
            console.log('Login data:', userData);

            try {
                this.$axios.post(this.urlinfo + '/login?' + qs.stringify(userData), {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    withCredentials: true
                }).then((res) => {

                    if (res.status === 200) {
                        // 로그인 성공시 처리해줘야할 부분
                        if (res.data.code === 0) {        //로그인 실패
                            alert('로그인 실패');
                            this.username = null;
                            this.password = null;
                        }
                        else if (res.data.code === 1) {
                            console.log(res.data);
                            alert('로그인 성공');
                            this.$router.push('/');
                            this.items = res.data;
                            console.log('res.data: ', this.items);
                            this.$bus.$emit('loginStatus', this.loginStatus = 'after');
                            this.$axios.get(this.urlinfo + '/members/' + userData.username) //서버에 요청하기
                                .then((res) => {
                                    this.item = res.data;
                                    console.log('item: ', this.item);
                                    this.$bus.$emit('user', this.item);
                                })
                        };
                    } else if (res.status === 401) {
                        alert(res.data.message);
                    }
                });
            } catch (error) {
                console.error(error);
            }
        }
    }
}


</script>
<style scoped>
.headline {
    font-size: 20px;
    font-weight: bold;
}
</style>