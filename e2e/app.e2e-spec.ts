import { BimObjectPage } from './app.po';

describe('bim-object App', () => {
  let page: BimObjectPage;

  beforeEach(() => {
    page = new BimObjectPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
