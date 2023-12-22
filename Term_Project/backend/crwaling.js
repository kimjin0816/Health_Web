const axios = require('axios');
const cheerio = require('cheerio');

exports.crawling = async (req, res) => {
    const crawler = new Crawling();
    await crawler.init();

    res.send(crawler.list); // 크롤링 결과를 JSON 형식으로 응답합니다.
};

class Crawling {
    list = [];

    async getHtml() {
        try {
            const response = await axios.get('https://datasciencediary.tistory.com/entry/quotes-about-good-health-healthy-lift');
            return response.data;
        } catch (error) {
            console.log(error);
            return '';
        }
    }

    getProverb(html) {
        const $ = cheerio.load(html);
        const bodyList = $('article .tt_article_useless_p_margin.contents_style  ul > li');

        bodyList.each((index, elem) => {
            let text = $(elem).text();
            text = text.replace(/[a-z]/gi, ''); // 영어 제거
            text = text.replace(/[^\p{L}\p{N}\s]+/gu, ''); // 특수 기호 제거
            text = text.replace(/\s{2,}/g, ' '); // 공백 제거
            this.list.push({
                bookList: text,
            });
        });
    }

    async init() {
        const html = await this.getHtml();
        if (html) { // HTML 문자열이 비어 있지 않으면
            this.getProverb(html);
        }
    }
}