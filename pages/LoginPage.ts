import { Page } from 'playwright';
import { LoginForm } from '../components/LoginForm';

export class LoginPage {
  page: Page;
  loginForm: LoginForm;

  constructor(page: Page) {
    this.page = page;
    this.loginForm = new LoginForm(page);
  }

  async goTo() {
    await this.page.goto('https://mangadex.org/');
    await this.page.locator('.ml-2').click();
    await this.page.getByRole('button', { name: 'Sign In' }).click();
  }

  async login(username: string, password: string) {
    await this.loginForm.fillUsername(username);
    await this.loginForm.fillPassword(password);
    await this.loginForm.submit();
  }

  async getErrorMessage() {
    return await this.page.textContent('.error-message'); 
  }
}
