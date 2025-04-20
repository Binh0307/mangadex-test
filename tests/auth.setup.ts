import { test as setup } from '@playwright/test'
import { LoginPage } from '../pages/LoginPage';
// Function to retrieve cookies
const getCookie = async (page: any, cookieName: string) => {
  const cookies = await page.context().cookies();
  return cookies.find(cookie => cookie.name === cookieName);
};

setup('Page Auth Setup', async ({ browser }) => {
  //🔹 Admin Account Context
  const adminContext = await browser.newContext();
  const adminPage = await adminContext.newPage();
  const loginPage = new LoginPage(adminPage);
  await loginPage.goTo();

  const { value: adminToken } = await getCookie(adminPage, 'access_token') || {};
  if (!adminToken) {
    console.log("Username: ", process.env.USERNAME || "");
    console.log("Password: ", process.env.PASSWORD || "");
    await loginPage.login(process.env.USERNAME || "", process.env.PASSWORD !);
    const { value: newAdminToken } = await getCookie(adminPage, 'access_token') || {};
    process.env.API_ADMIN_TOKEN = newAdminToken;
  } else {
    process.env.API_ADMIN_TOKEN = adminToken;
  }
  
  await adminContext.storageState({ path: '.auth/user.json' });
  await adminContext.close();

});
