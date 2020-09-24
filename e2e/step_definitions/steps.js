const { Given } = require('cucumber');
const EC = protractor.ExpectedConditions;

Given('I can browse {string} website', (searchEngine) => {
  let searchBox;
  if (searchEngine === 'GOOGLE') {
    browser.get('https://www.google.com');
    searchBox = element(by.css('input[title=Search]'));
  }
  if (searchEngine === 'BING') {
    browser.get('https://www.bing.com/?toWww=1&redig=ECBC44AF5D3743C3B5DF934E605FB23E');
    searchBox = element(by.css('input[type=search]'));
  }
  if (searchEngine === 'DUCKDUCKGO') {
    browser.get('https://duckduckgo.com');
    searchBox = element(by.id('search_form_input_homepage'));
  }
  if (searchEngine === 'YAHOO') {
    browser.get('https://search.yahoo.com');
    searchBox = element(by.id('yschsp'));
  }
  browser.wait(EC.visibilityOf(searchBox), browser.params.wait.long, 'search box not visible');
});
