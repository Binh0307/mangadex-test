import { Page } from 'playwright';

export class LoginForm {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async fillUsername(username: string) {
    await this.page.fill('input[name="username"]', username);
  }

  async fillPassword(password: string) {
    await this.page.fill('input[name="password"]', password);
  }

  async submit() {
    await this.page.getByRole('button', { name: 'Sign In' }).click();
  }
}
