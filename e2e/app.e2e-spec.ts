import { ChatPage } from './app.po';

describe('Chat App', function() {
  let page: ChatPage;

  beforeEach(() => {
    page = new ChatPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
