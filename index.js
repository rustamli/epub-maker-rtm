const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const Epub = require("epub-gen");

const chapters = `front-matter
glossary
story-of-a-story
i-thirst
ii-beginning-of-the-road
iii-winds
iv-voices
v-spirit-and-flesh
vi-dreams
vii-midway
viii-jinns
ix-persian-letter
x-dajjal
xi-jihad
xii-end-of-the-road`.split('\n');

const content = chapters.map(chapter => {
    const html = fs.readFileSync(path.join('./src', chapter, 'index.html'), 'utf8');
    const $ = cheerio.load(html);
    $('#print').remove();
    $('p').each((index, el) => {
        const $el = $(el);
        if ($el.html().indexOf('Далее: ') === 0) {
            $el.remove()
        }
    });

    if (chapter !== 'glossary') {
        $('h2').remove();
    }

    return {
        title: $('title').html().split('Дорога в Мекку. ')[1],
        data: $('#content-1').html().split('\n').join(''),
    }
});


const option = {
    title: "Дорога в Мекку",
    author: "Мухаммад Асад",
    content: content
};

new Epub(option, 'book.epub');

