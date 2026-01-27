import { test, expect } from '@playwright/test';

test.describe('Solicitar viaje', () => {
  test('flujo básico rider', async ({ page }) => {
    await page.goto('/');

    // Espera que cargue la UI principal
    await expect(page.getByText('Planifica tu viaje')).toBeVisible();

    // Ingresa destino
    const destinoInput = page.getByPlaceholder('¿A dónde vamos?', { exact: false });
    await destinoInput.fill('Malecon 2000');
    await destinoInput.press('Enter');

    // Buscar viaje
    await page.getByRole('button', { name: /Buscar Viaje/i }).click();

    // Esperar opciones
    const option = page.getByText(/Econ/i).first();
    await expect(option).toBeVisible({ timeout: 10000 });

    // ETA visible
    await expect(page.getByText(/min/)).toBeVisible();
  });
});
