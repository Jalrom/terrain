import { WebGamePage } from './app.po';

describe('web-game App', () => {
  let page: WebGamePage;

  beforeEach(() => {
    page = new WebGamePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
