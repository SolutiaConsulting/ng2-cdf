import { AdminCdfCloudPage } from './app.po';

describe('admin-cdf-cloud App', function() {
  let page: AdminCdfCloudPage;

  beforeEach(() => {
    page = new AdminCdfCloudPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
