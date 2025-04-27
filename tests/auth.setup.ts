import { test as setup } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

// Function to retrieve cookies
const getCookie = async (page: any, cookieName: string) => {
  const cookies = await page.context().cookies();
  return cookies.find(cookie => cookie.name === cookieName);
};

setup('Page Auth Setup', async ({ browser }) => {
  const USERNAME = process.env.USERNAME || '';
  const PASSWORD = process.env.PASSWORD || '';

  if (!USERNAME || !PASSWORD) {
    throw new Error('Missing USERNAME or PASSWORD in environment variables');
  }

  // 🔹 Admin Account Context
  const adminContext = await browser.newContext();
  const adminPage = await adminContext.newPage();
  const loginPage = new LoginPage(adminPage);
  
  await loginPage.goTo();

  // Try getting an existing token
  const tokenCookie = await getCookie(adminPage, 'KEYCLOAK_IDENTITY');
  const adminToken = tokenCookie?.value;

  if (!adminToken) {
    console.log('Logging in with provided credentials...');
    await loginPage.login(USERNAME, PASSWORD);

    const newTokenCookie = await getCookie(adminPage, 'KEYCLOAK_IDENTITY');
    if (!newTokenCookie) {
      throw new Error('Failed to retrieve KEYCLOAK_IDENTITY cookie after login.');
    }

    process.env.API_ADMIN_TOKEN = newTokenCookie.value;
  } else {
    process.env.API_ADMIN_TOKEN = adminToken;
  }

  // Save authenticated state
  await adminContext.storageState({ path: '.auth/user.json' });
  await adminContext.close();
});
