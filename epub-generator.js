const cheerio = require('cheerio');
const Epub = require('epub-gen');
const fetch = require('node-fetch');

const chapters = `about-translation
front-matter
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

function getUrl(chapter) {
  return chapter === 'about-translation'
    ? 'https://raw.githubusercontent.com/inuritdino/TheRoadToMecca/master/about-translation/index.html'
    : `https://raw.githubusercontent.com/inuritdino/TheRoadToMecca/master/src/${chapter}/index.html`;
}

async function downloadChapter(chapter) {
  const response = await fetch(getUrl(chapter));
  return response.text();
}

async function processChapter(chapter) {
  const html = await downloadChapter(chapter);
  const $ = cheerio.load(html);
  $('#print').remove();
  $('p').each((index, el) => {
    const $el = $(el);
    if ($el.html().indexOf('Далее: ') === 0) {
      $el.remove();
    }
  });

  if (chapter !== 'glossary') {
    $('h2').remove();
  }

  let data = $('#content-1')
    .html()
    .split('\n')
    .join('');

  if (chapter === 'about-translation') {
    data = data
      .replace(
        'Перевод выполнен участниками проекта',
        'Перевод выполнен участниками проекта '
      )
      .replace('Главный переводчик:', 'Главный переводчик: ')
      .replace('(Muhammad Asad)', ' (Muhammad Asad)')
      .replace('Dar al-Andalus 1980(', 'Dar al-Andalus 1980 (');
  }

  return {
    title: $('title')
      .html()
      .split('Дорога в Мекку. ')[1]
      .replace('переводе.', 'переводе'),
    data: data
  };
}

module.exports = {
  async run(reply) {
    const content = await Promise.all(chapters.map(processChapter));

    const option = {
      title: 'Дорога в Мекку',
      author: 'Мухаммад Асад',
      content: content
    };

    new Epub(option, './public/the-road-to-mecca.epub').promise.then(() => {
      if (reply) {
        reply.redirect('/the-road-to-mecca.epub');
      }
    });
  }
};
