import { test, expect } from '@playwright/test';

// e2e 测试：应用加载时跳转到外部 SSO 登录页面

test.describe('SSO login', () => {
test('test', async ({ page }) => {
  await page.goto('https://dev.ufe.molex.com/Account/Login?ReturnUrl=%2Fconnect%2Fauthorize%3Fresponse_type%3Dcode%26client_id%3DUFE_App%26state%3DRXpZSmRXTDdTSkpPdXdQblp-WnJQZXBxT3dSWVc5RVprN3lDcnJPRW1KV3Zi%26redirect_uri%3Dhttp%253A%252F%252Flocalhost%253A4200%26scope%3Dopenid%2Boffline_access%2BUFE%26code_challenge%3Ddu2F3Yky8PY1PsUHVKmLZBlQBzYJz4PY2MWltfmEvMU%26code_challenge_method%3DS256%26nonce%3DRXpZSmRXTDdTSkpPdXdQblp-WnJQZXBxT3dSWVc5RVprN3lDcnJPRW1KV3Zi%26culture%3Dzh-Hans%26ui-culture%3Dzh-Hans&tenant=ZHU-MOSAIC');
  await page.getByRole('link', { name: 'Login with User Name or Email' }).click();
  await page.getByRole('textbox', { name: 'User Name Or Email Address' }).click();
  await page.getByRole('textbox', { name: 'User Name Or Email Address' }).fill('admin');
  await page.getByRole('textbox', { name: 'User Name Or Email Address' }).press('Tab');
  await page.getByRole('textbox', { name: 'Password' }).fill('1q2w3E*');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.goto('http://localhost:4200/#/');
});
});



