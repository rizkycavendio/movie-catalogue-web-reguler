const assert = require('assert');

// eslint-disable-next-line no-undef
Feature('Linking Movies');

// eslint-disable-next-line no-undef
Before(({ I }) => {
  I.amOnPage('/#/like');
});

// eslint-disable-next-line no-undef
Scenario('showing empty liked movies', ({ I }) => {
  I.seeElement('#query');
  I.see('Tidak ada film untuk ditampilkan', '.movie-item__not__found');
});

// eslint-disable-next-line no-undef
Scenario('liking one movie', async ({ I }) => {
  I.see('Tidak ada film untuk ditampilkan', '.movie-item__not__found');

  I.amOnPage('/');

  I.seeElement('.movie__title a');
  // eslint-disable-next-line no-undef
  const firstMovie = locate('.movie__title a').first();
  const firstMovieTitle = await I.grabTextFrom(firstMovie);
  I.click(firstMovie);

  I.seeElement('#likeButton');
  I.click('#likeButton');

  I.amOnPage('/#/like');
  I.seeElement('.movie-item');
  const likedMovieTitle = await I.grabTextFrom('.movie__title');

  assert.strictEqual(firstMovieTitle, likedMovieTitle);
});

// eslint-disable-next-line no-undef
Scenario('searching movies', async ({ I }) => {
  I.see('Tidak ada film untuk ditampilkan', '.movie-item__not__found');

  I.amOnPage('/');

  I.seeElement('.movie__title a');

  const titles = [];
  // eslint-disable-next-line no-plusplus
  for (let i = 1; i <= 3; i++) {
    // eslint-disable-next-line no-undef
    I.click(locate('.movie__title a').at(i));
    I.seeElement('#likeButton');
    I.click('#likeButton');
    // eslint-disable-next-line no-await-in-loop
    titles.push(await I.grabTextFrom('.movie__title'));
    I.amOnPage('/');
  }

  I.amOnPage('/#/like');
  I.seeElement('#query');

  const visibleLikedMovies = await I.grabNumberOfVisibleElements('.movie-item');
  assert.strictEqual(titles.length, visibleLikedMovies);

  const searchQuery = titles[1].substring(1, 3);
  I.fillField('#query', searchQuery);
  I.pressKey('Enter');
  // mendapatkan daftar film yang sesuai dengan searchQuery
  const matchingMovies = titles.filter((title) => title.indexOf(searchQuery) !== -1);
  const visibleSearchedLikedMovies = await I.grabNumberOfVisibleElements('.movie-item');
  assert.strictEqual(matchingMovies.length, visibleSearchedLikedMovies);
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < matchingMovies.length; i++) {
    // eslint-disable-next-line no-await-in-loop, no-undef
    const visibleTitle = await I.grabTextFrom(locate('.movie__title').at(i + 1));
    assert.strictEqual(matchingMovies[i], visibleTitle);
  }
});
