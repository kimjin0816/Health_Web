<template>
    <v-main>
        <div>
            <v-btn @click="todayPlan()">
                <v-icon>mdi-plus</v-icon>
                <span>금일 운동 계획 가져오기</span>
            </v-btn>
            <h2>금일 계획한 운동</h2>
        </div>
        <v-data-table :headers="headers" :items="beforeItems" class="elevation-1">
            <template v-slot:item="row">
                <tr>
                    <td>{{ row.item.name }}</td>
                    <td>{{ row.item.equipment }}</td>
                    <td>{{ row.item.body }}</td>
                    <td>{{ row.item.count }}</td>
                    <td>{{ row.item.set }}</td>
                </tr>
            </template>
        </v-data-table>

        <h2>금일 운동 수행</h2>
        <v-data-table :headers="headers" :items="afterItems" class="elevation-1">
            <template v-slot:item="row">
                <tr>
                    <td>{{ row.item.name }}</td>
                    <td>{{ row.item.equipment }}</td>
                    <td>{{ row.item.body }}</td>
                    <td>{{ row.item.count }}</td>
                    <td>{{ row.item.set }}</td>
                </tr>
            </template>
        </v-data-table>
    </v-main>
</template>

<script>
export default {
    name: 'Posting',
    data() {
        return {
            urlinfo: 'http://localhost:8000/',
            dialog: false,
            dialogTitle: '',
            deviceId: '',
            register_date: '',
            beforeItems: [],
            afterItems: [],
            headers: [
                { text: '이름', align: 'left', value: 'name' },
                { text: '기구', align: 'left', value: 'equipment' },
                { text: '부위', align: 'left', value: 'body' },
                { text: '횟수', align: 'left', value: 'count' },
                { text: '세트', align: 'left', value: 'set' },
                // { text: '관리', align: 'left', value: '' },
            ],
        };
    },
    created() {
        this.deviceId = localStorage.getItem('deviceId');
        this.$bus.$on('user', (data) => {
            console.log('userPosting: ', data);
            const deviceId = data.userId;
            console.log('deviceId: ', deviceId);

            localStorage.setItem('deviceId', deviceId);
        });

        this.$socket.on('after', (data) => {
            console.log('exercise after: ', data);
            this.afterItems.push(data);
        })
    },
    mounted() {
        this.$axios.get(this.urlinfo + 'routine/' + this.deviceId, {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        }).then((response) => {
            console.log('response: ', response);
            this.register_date = response.data.register_date;
        }).catch((error) => {
            console.log('error: ', error);
        });
    },
    methods: {
        todayPlan() {
            let today = new Date();
            let dd = String(today.getDate()).padStart(2, '0');
            let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            let yyyy = today.getFullYear();

            this.register_date = yyyy + '-' + mm + '-' + dd;

            this.$axios.get(this.urlinfo + 'emit/' + this.deviceId + '/' + this.register_date, {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            }).then((response) => {
                console.log('response: ', response);
                this.beforeItems = response.data;
            }).catch((error) => {
                console.log('error: ', error);
            });
        }
    },
};
</script>

<style>
/* 테이블 스타일 */
table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
}

th,
td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
}

th {
    background-color: #f2f2f2;
}

/* 버튼 스타일 */
.v-btn {
    margin-right: 10px;
}

/* 테이블 간격 */
h2 {
    margin-bottom: 10px;
}
</style>