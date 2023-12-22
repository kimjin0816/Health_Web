<template>
    <v-main>
        <v-row class="fill-height">
            <v-col>
                <v-sheet height="64">
                    <v-toolbar flat :color="selectedEvent.color" dark>
                        <v-btn outlined class="mr-4" color="grey darken-2" @click="setToday">Today</v-btn>
                        <v-btn fab text small color="grey darken-2" @click="prev"><v-icon
                                small>mdi-chevron-left</v-icon></v-btn>
                        <v-btn fab text small color="grey darken-2" @click="next"><v-icon
                                small>mdi-chevron-right</v-icon></v-btn>
                        <v-toolbar-title v-if="$refs.calendar">{{ $refs.calendar.title }}</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-btn icon @click="planRecall()"><v-icon>mdi-refresh</v-icon></v-btn>
                        <v-btn icon @click="planClear()"><v-icon>mdi-delete</v-icon></v-btn>
                        <v-btn icon @click="deviceGet()"><v-icon>mdi-plus</v-icon></v-btn>
                        <v-menu bottom right>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn outlined color="grey darken-2" v-bind="attrs" v-on="on">
                                    <span>{{ typeToLabel[type] }}</span>
                                    <v-icon right>mdi-menu-down</v-icon>
                                </v-btn>
                            </template>

                            <v-list>
                                <v-list-item @click="type = 'day'"><v-list-item-title>Day</v-list-item-title></v-list-item>
                                <v-list-item
                                    @click="type = 'week'"><v-list-item-title>Week</v-list-item-title></v-list-item>
                                <v-list-item
                                    @click="type = 'month'"><v-list-item-title>Month</v-list-item-title></v-list-item>
                                <v-list-item @click="type = '4day'"><v-list-item-title>4
                                        days</v-list-item-title></v-list-item>
                            </v-list>
                        </v-menu>
                    </v-toolbar>
                </v-sheet>
                <v-sheet height="600">
                    <v-calendar ref="calendar" v-model="focus" color="primary" :events="events" :event-color="getEventColor"
                        :type="type" @click:event="showEvent" @click:more="viewDay" @click:date="viewDay">
                    </v-calendar>

                    <v-menu v-model="selectedOpen" :close-on-content-click="false" :activator="selectedElement" offset-x>
                        <v-card color="grey lighten-4" min-width="350px" flat>
                            <v-toolbar :color="selectedEvent.color" dark>
                                <v-btn icon @click="dialogPut()"><v-icon>mdi-pencil</v-icon></v-btn>
                                <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
                                <v-spacer></v-spacer>
                                <v-btn icon @click="dialogDel()"><v-icon>mdi-delete</v-icon></v-btn>
                            </v-toolbar>
                            <v-card-text class="eventStyle">
                                기구 : <span v-html="selectedEvent.equipment"></span><br>
                                신체 : <span v-html="selectedEvent.body"></span><br>
                                갯수 : <span v-html="selectedEvent.count"></span>개<br>
                                횟수 : <span v-html="selectedEvent.set"></span>set
                            </v-card-text>
                            <v-card-actions><v-btn text color="secondary"
                                    @click="selectedOpen = false">Cancel</v-btn></v-card-actions>
                        </v-card>
                    </v-menu>

                </v-sheet>
            </v-col>
        </v-row>
        <v-dialog v-model="dialog" persistent max-width="500px">
            <v-card>
                <v-card-title>
                    <span class="headline">나의 운동 루틴 작성</span>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" @click="closeDialog()"><v-icon>mdi-close</v-icon></v-btn>
                </v-card-title>
                <v-card-text>
                    <v-container grid-list-md>
                        <v-layout wrap>
                            <v-flex xs12>
                                <v-text-field label="명칭" v-model="contactInfo.name" required></v-text-field>
                            </v-flex>
                            <v-flex xs12>
                                <v-text-field label="기구" v-model="contactInfo.equipment" required></v-text-field>
                            </v-flex>
                            <v-flex xs12>
                                <v-text-field label="신체" v-model="contactInfo.body" required></v-text-field>
                            </v-flex>
                            <v-flex xs12>
                                <v-text-field label="횟수" v-model="contactInfo.count" required></v-text-field>
                            </v-flex>
                            <v-flex xs12>
                                <v-text-field label="세트수" v-model="contactInfo.set" required></v-text-field>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <!-- '확인' 버튼: dialogMode가 'update'일 때만 표시 -->
                    <v-btn v-if="dialogMode === 'insert'" color="blue darken-1" text type="submit"
                        v-on:click="dialogBtn()">확인</v-btn>
                    <!-- '취소' 버튼: dialogMode가 'insert'일 때만 표시 -->
                    <v-btn v-if="dialogMode === 'update'" color="red darken-1" text type="submit"
                        v-on:click="dialogBtn()">수정</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-main>
</template>
<script>
import { EventBus } from '@/EventBus';
import qs from 'qs';
export default {
    data() {
        return {
            urlinfo: 'http://localhost:8000/routine',
            contactInfo: {
                deviceId: null,
                name: null,
                equipment: null,
                body: null,
                count: null,
                set: null,
                register_date: null
            },
            uesrId: null,
            items: [],
            dialog: false,
            dialogMode: null,
            focus: '',
            type: 'month',
            typeToLabel: {
                month: 'Month',
                week: 'Week',
                day: 'Day',
                '4day': '4 Days',
            },
            selectedEvent: {},
            selectedElement: null,
            selectedOpen: false,
            events: [],
            colors: ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1'],
        }
    },
    mounted() {
        this.$refs.calendar.checkChange();
        this.$axios.get(this.urlinfo + '/' + this.contactInfo.deviceId)
            .then((res) => {
                this.items = res.data;
                this.items.forEach(item => {
                    const event = {
                        deviceId: item.deviceId,
                        name: item.name,
                        equipment: item.equipment,
                        body: item.body,
                        count: item.count,
                        set: item.set,
                        start: new Date(item.register_date),
                        end: new Date(item.register_date),
                        color: this.colors[this.rnd(0, this.colors.length - 1)],
                    };
                    this.events.push(event);
                });
                console.log(this.events);
            })
            .catch((err) => {
                console.log(err);
            });
    },
    created() {
        // 로컬 스토리지에서 deviceId를 불러옵니다.
        this.contactInfo.deviceId = localStorage.getItem('deviceId');
        this.$bus.$on('user', (data) => {
            const userID = data.userId;
            this.contactInfo.deviceId = userID;

            // deviceId를 로컬 스토리지에 저장합니다.
            localStorage.setItem('deviceId', userID);
        });
        // 현재 세션의 userId값을 가져오기
        
    },
    methods: {
        deviceGet() {
            const userData = {
                deviceId: this.contactInfo.deviceId
            }
            try {
                this.$axios.get('http://localhost:8000/api/routine?' + qs.stringify(userData), {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    withCredentials: true
                })
                console.log('deviceGet')
            } catch (err) {
                console.log(err);
            }
        },
        planClear() {
            this.$axios.delete(this.urlinfo + '/' + this.contactInfo.deviceId)
                .then((res) => {
                    alert('삭제 성공');
                    this.contactInfoNull();
                    this.closeDialog();
                    // this.$router.push('/Routine');
                })
                .catch((err) => {
                    alert('다시 시도하시오.');
                    console.log(err);
                });
        },
        planRecall() {
            this.$axios.get(this.urlinfo + '/' + this.contactInfo.deviceId)
                .then((res) => {
                    this.events = [];
                    this.items = res.data;
                    this.items.forEach(item => {
                        const event = {
                            deviceId: item.deviceId,
                            name: item.name,
                            equipment: item.equipment,
                            body: item.body,
                            count: item.count,
                            set: item.set,
                            start: new Date(item.register_date),
                            end: new Date(item.register_date),
                            color: this.colors[this.rnd(0, this.colors.length - 1)],
                        };
                        this.events.push(event);
                    });
                    console.log(this.events);
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        checkLogin() {
            this.$axios.get(this.urlinfo + '/members', {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                withCredentials: true
            }).then(res => {
                console.log(res);
                if (res.data.code === 1) {
                    console.log('로그인된 상태');
                    this.user = res.data.user;
                }
                else if (res.data.code === 0) {
                    console.log('로그인 안된 상태');
                    this.user = null;
                }
            })
                .catch(error => {
                    console.error(error);
                });
        },
        contactInfoNull() {
            // this.contactInfo.deviceId = null;
            this.contactInfo.name = null;
            this.contactInfo.equipment = null;
            this.contactInfo.body = null;
            this.contactInfo.count = null;
            this.contactInfo.set = null;
            this.contactInfo.register_date = null;
        },
        dialogBtn() {
            if (this.dialogMode === 'insert') {
                if (!this.contactInfo.deviceId || !this.contactInfo.name || !this.contactInfo.equipment || !this.contactInfo.body
                    || !this.contactInfo.count || !this.contactInfo.set || !this.contactInfo.register_date) {
                    alert('모든 필드를 입력해주세요');
                } else {
                    this.$axios.post(this.urlinfo, {
                        deviceId: this.contactInfo.deviceId,
                        name: this.contactInfo.name,
                        equipment: this.contactInfo.equipment,
                        body: this.contactInfo.body,
                        count: this.contactInfo.count,
                        set: this.contactInfo.set,
                        register_date: this.contactInfo.register_date
                    }).then(() => {
                        alert('등록 성공');
                        this.contactInfoNull();
                        this.closeDialog();
                        // this.$router.push('/Routine');
                    }).catch((err) => {
                        alert('다시 시도하시오.');
                        console.log(err);
                    });
                }
            } else if (this.dialogMode === 'update') {
                const name = this.contactInfo.name
                this.$axios.put(this.urlinfo + '/' + this.contactInfo.deviceId + '/' + name + '/' + this.contactInfo.register_date, {
                    deviceId: this.contactInfo.deviceId,
                    name: this.contactInfo.name,
                    equipment: this.contactInfo.equipment,
                    body: this.contactInfo.body,
                    count: this.contactInfo.count,
                    set: this.contactInfo.set,
                    register_date: this.contactInfo.register_date
                }).then(() => {
                    alert('수정 성공');
                    this.contactInfoNull();
                    this.closeDialog();
                    // this.$router.push('/Routine');
                }).catch((err) => {
                    alert('다시 수정해주세요');
                    console.log(err);
                });
            }
        },
        dialogPut() {
            this.contactInfo.name = this.selectedEvent.name;
            this.contactInfo.equipment = this.selectedEvent.equipment;
            this.contactInfo.body = this.selectedEvent.body;
            this.contactInfo.count = this.selectedEvent.count;
            this.contactInfo.set = this.selectedEvent.set;
            this.contactInfo.register_date = this.viewDay({ date: this.selectedEvent.start });
            this.dialogMode = 'update';
            this.openDialog();
        },
        dialogDel() {
            this.contactInfo.name = this.selectedEvent.name;
            this.contactInfo.register_date = this.viewDay({ date: this.selectedEvent.start });
            this.closeDialog();
            console.log(this.selectedEvent.start);
            console.log(this.contactInfo.name);
            console.log(this.contactInfo.register_date);
            this.$axios.delete(this.urlinfo + '/' + this.contactInfo.deviceId + '/' + this.contactInfo.name + '/' + this.contactInfo.register_date,)
                .then((res) => {
                    alert('삭제 성공');
                    this.contactInfoNull();
                    this.closeDialog();
                    // this.$router.push('/Routine');
                })
                .catch((err) => {
                    alert('다시 시도하시오.');
                    console.log(err);
                });
        },
        viewDay({ date }) {
            this.dialogMode = 'insert';
            this.openDialog();
            // this.type = 'day'
            this.contactInfo.register_date = date

            console.log('register_date : ', this.contactInfo.register_date);
            console.log('register_date_type : ', typeof this.contactInfo.register_date);
            const d = new Date(date);
            const year = d.getFullYear();
            const month = ("0" + (d.getMonth() + 1)).slice(-2); // 월은 0부터 시작하므로 1을 더해줍니다.
            const day = ("0" + d.getDate()).slice(-2);

            return `${year}-${month}-${day}`; // "yyyy-mm-dd" 형식의 문자열을 반환합니다.
        },
        openDialog() {
            this.dialog = true;
        },
        closeDialog() {
            this.dialog = false;
        },
        getEventColor(event) {
            return event.color
        },
        setToday() {
            this.focus = ''
        },
        prev() {
            this.$refs.calendar.prev()
        },
        next() {
            this.$refs.calendar.next()
        },
        showEvent({ nativeEvent, event }) {
            const open = () => {
                this.selectedEvent = event
                this.selectedElement = nativeEvent.target
                requestAnimationFrame(() => requestAnimationFrame(() => this.selectedOpen = true))
            }

            if (this.selectedOpen) {
                this.selectedOpen = false
                requestAnimationFrame(() => requestAnimationFrame(() => open()))
            } else {
                open()
            }

            nativeEvent.stopPropagation()
        },
        rnd(a, b) {
            return Math.floor((b - a + 1) * Math.random()) + a
        },
    }
}
</script>

<style scoped>
.eventStyle {
    font-size: 20px;
    text-align: left;
    color: black;
}
</style>