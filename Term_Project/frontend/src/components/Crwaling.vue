<template>
    <div style="width: 100%; max-width: 800px; margin: 0 auto;">
        <h1 style="text-align: center; color: #333; margin-bottom: 20px;">운동 명언!!</h1>
        <ul style="list-style: none; padding: 0;">
            <li v-for="(item, index) in list" :key="index"
                style="text-align: left; border-bottom: 1px solid #ccc; padding: 10px;">
                <div>{{ item.bookList }}</div>
                <!-- You can add other extracted data here -->
            </li>
        </ul>
    </div>
</template>
  
<script>
export default {
    name: 'Crawling',

    data() {
        return {
            list: [],
            urlinfo: 'http://localhost:8000',
        };
    },

    mounted() {
        this.crawling();
    },  

    methods: {
        crawling() {
            this.$axios.get(this.urlinfo + '/' + 'crawling', {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                withCredentials: true
            }).then(res => {
                console.log(res);
                this.list = res.data;
            }).catch(error => {
                console.error(error);
            });
        }
    },
};
</script>

