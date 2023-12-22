<template>
    <v-main>
        <div class="select-container">
            <div class="select-body">
                <v-select v-model="selectedBody" :items="this.body" label="부위 선택" item-text="text" item-value="value"
                    @change="redirectToExercise"></v-select>
            </div>
            <div class="select-equipment">
                <v-select v-model="selectedEquipment" :items="this.equipment" label="기구 선택" item-text="text"
                    item-value="value" @change="redirectToExercise"></v-select>
            </div>
        </div>
        <v-row>
            <v-col cols="12" sm="6" md="4" v-for="exercise in this.filteredData">
                <v-card @click="openDialog(exercise)">
                    <v-img :src="exercise.gifUrl"></v-img>
                    <v-card-title>{{ exercise.name }}</v-card-title>
                </v-card>
            </v-col>
        </v-row>

        <v-layout row justify-center>
            <v-dialog v-model="dialog" persistent class="dialog">
                <v-card>
                    <v-card-title>
                        {{ this.selectedExercise.name }}
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" @click="closeDialog()"><v-icon>mdi-close</v-icon></v-btn>
                    </v-card-title>
                    <v-card-text>
                        <div>
                            <v-img :src="this.selectedExercise.gifUrl" class="dialog-image"></v-img>
                        </div>
                        <div v-for="instruction in this.selectedExercise.instructions" class="dialog-instruction">
                            {{ instruction }}
                        </div>
                    </v-card-text>
                </v-card>
            </v-dialog>
        </v-layout>
    </v-main>
</template>
  
<script>
export default {
    name: 'HealthAPI',

    data() {
        return {
            dialog: false,
            selectedExercise: [],
            body: [
                { text: '등', value: 'back' },
                { text: '승모', value: 'neck' },
                { text: '가슴', value: 'chest' },
                { text: '어깨', value: 'shoulders' },
                { text: '윗 팔', value: 'upper arms' },
                { text: '아래 팔', value: 'lower arms' },
                { text: '윗 다리', value: 'upper legs' },
                { text: '아래 다리', value: 'lower legs' },
                { text: '허리', value: 'waist' },
            ],
            equipment: [],
            filteredData: [],
            filteredJson: {
                bodyPart: [],
                name: [],
                equipment: [],
                gifUrl: [],
                instructions: [],
            },
            exercies: [],
            selectedBody: '',
            selectedEquipment: '',
        };
    },

    methods: {
        openDialog(exercise) {
            this.selectedExercise = exercise;
            this.dialog = true;
        },
        closeDialog() {
            this.dialog = false;
        },
        redirectToExercise() {
            if (this.selectedBody) {
                // window.location.href = this.selectedBody + '/' + this.selectedEquipment;
                this.fetchExercises();
            }
        },

        async fetchExercises() {
            this.equipment = [];
            const options = {
                method: 'GET',
                url: `https://exercisedb.p.rapidapi.com/exercises/bodyPart/${this.selectedBody}`,
                params: { limit: '30' },
                headers: {
                    'X-RapidAPI-Key': '8b071784e0msh7f6d27fd28848edp1e2bfbjsn03d7cdb8243f',
                    'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
                }
            };

            try {
                const response = await this.$axios.request(options);
                this.exercies = response.data;

                for (let i = 0; i < this.exercies.length; i++) {
                    if (!this.equipment.includes(this.exercies[i].equipment)) {
                        this.equipment.push({ text: `${this.exercies[i].equipment}`, value: `${this.exercies[i].equipment}` });
                    }
                }

                this.filteredData = response.data.filter((item) => {
                    return item.equipment === this.selectedEquipment;
                });


                for (let i = 0; i < this.filteredData.length; i++) {
                    this.filteredJson.bodyPart.push(this.filteredData[i].bodyPart);
                    this.filteredJson.name.push(this.filteredData[i].name);
                    this.filteredJson.equipment.push(this.filteredData[i].equipment);
                    this.filteredJson.gifUrl.push(this.filteredData[i].gifUrl);
                    this.filteredJson.instructions.push(this.filteredData[i].instructions);
                }


            } catch (error) {
                this.error = error.message || 'An error occurred while fetching exercises.';
                console.error(this.error);
            }
        }
    },

};

</script>
  
<style>
.dialog {
    width: 80%;
    /* 다이얼로그의 너비 */
    max-width: 600px;
    /* 다이얼로그의 최대 너비 */
    margin: 0 auto;
    /* 페이지 중앙에 다이얼로그를 위치시킵니다 */
    background-color: rgba(255, 255, 255, 0.8);
    /* 다이얼로그의 배경색을 하얀색으로 설정 */
    border-radius: 10px;
    /* 다이얼로그의 모서리를 둥글게 만듭니다 */
    box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.1);
    /* 다이얼로그에 그림자 효과를 추가 */
    padding: 20px;
    /* 다이얼로그 내부의 패딩을 설정 */
    color: black;
    /* 다이얼로그의 텍스트 색상을 검은색으로 설정 */
    backdrop-filter: blur(100px);
    /* 흐림 정도를 조절합니다 */
}

.dialog-instruction {
    margin-bottom: 10px;
    font: 100;
}

.dialog-image {
    max-width: 30%;
    height: auto;
    max-height: 500px;
    object-fit: cover;
    transform: translateX(450px);
}

.v-card {
    cursor: pointer;
}

.select-container {
    display: flex;
    justify-content: space-between;
}

.select-body,
.select-equipment {
    width: 45%;
    /* Adjust as needed */
}
</style>
  