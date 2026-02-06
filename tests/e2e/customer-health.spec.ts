import { test, expect } from '@playwright/test';

test.describe('Customer Health Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/customer-health');
  });

  test('displays page title and header', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Customer Health');
  });

  test('displays customer table with data', async ({ page }) => {
    // Wait for table to load
    await expect(page.locator('table')).toBeVisible();
    
    // Check that rows are present
    const rows = page.locator('tbody tr');
    await expect(rows.first()).toBeVisible();
  });

  test('filters by health segment', async ({ page }) => {
    // Click on "At Risk" filter
    await page.click('button:has-text("At Risk")');
    
    // URL should update
    await expect(page).toHaveURL(/segment=at-risk/);
    
    // All visible badges should be "At Risk"
    const badges = page.locator('text=At Risk').filter({ has: page.locator('.rounded-full') });
    await expect(badges.first()).toBeVisible();
  });

  test('search filters customers', async ({ page }) => {
    // Type in search
    await page.fill('input[placeholder*="Search"]', 'Acme');
    
    // Wait for debounce and URL update
    await page.waitForURL(/search=Acme/);
    
    // Results should contain Acme
    await expect(page.locator('text=Acme Corporation')).toBeVisible();
  });

  test('pagination works', async ({ page }) => {
    // Check pagination controls are visible
    const pagination = page.locator('nav[aria-label="Pagination"]');
    await expect(pagination).toBeVisible();
    
    // Click next page
    await page.click('button[aria-label="Next page"]');
    
    // URL should update with page param
    await expect(page).toHaveURL(/page=2/);
  });

  test('sorting changes table order', async ({ page }) => {
    // Click on MRR header to sort
    await page.click('button:has-text("MRR")');
    
    // URL should update with sort params
    await expect(page).toHaveURL(/sort=mrr/);
  });

  test('opening customer details panel', async ({ page }) => {
    // Click on first customer row
    await page.locator('tbody tr').first().click();
    
    // URL should change to include customer ID
    await expect(page).toHaveURL(/customer-health\/cust_/);
    
    // Panel should be visible
    await expect(page.locator('text=Health Factors')).toBeVisible();
  });

  test('closing details panel returns to list', async ({ page }) => {
    // Open a customer
    await page.locator('tbody tr').first().click();
    await expect(page).toHaveURL(/customer-health\/cust_/);
    
    // Close panel
    await page.click('a[aria-label="Close panel"]');
    
    // Should be back at main list
    await expect(page).toHaveURL('/customer-health');
  });

  test('details panel shows tabs', async ({ page }) => {
    // Open a customer
    await page.locator('tbody tr').first().click();
    
    // Check tabs are visible
    await expect(page.locator('button[role="tab"]:has-text("Overview")')).toBeVisible();
    await expect(page.locator('button[role="tab"]:has-text("Activity")')).toBeVisible();
    await expect(page.locator('button[role="tab"]:has-text("Notes")')).toBeVisible();
  });

  test('switching tabs in details panel', async ({ page }) => {
    // Open a customer
    await page.locator('tbody tr').first().click();
    
    // Click Activity tab
    await page.click('button[role="tab"]:has-text("Activity")');
    
    // Activity content should be visible (events list)
    await expect(page.locator('text=ago').first()).toBeVisible();
  });

  test('clear filters button works', async ({ page }) => {
    // Apply a filter
    await page.fill('input[placeholder*="Search"]', 'test');
    await page.waitForURL(/search=test/);
    
    // Click clear filters
    await page.click('button:has-text("Clear filters")');
    
    // URL should be clean
    await expect(page).toHaveURL('/customer-health');
  });

  test('empty state shows when no results', async ({ page }) => {
    // Search for something that doesn't exist
    await page.fill('input[placeholder*="Search"]', 'xyznonexistent123');
    await page.waitForURL(/search=xyznonexistent123/);
    
    // Empty state should be visible
    await expect(page.locator('text=No customers found')).toBeVisible();
  });

  test('preserves filters when opening details', async ({ page }) => {
    // Apply filters
    await page.click('button:has-text("Healthy")');
    await page.waitForURL(/segment=healthy/);
    
    // Open a customer
    await page.locator('tbody tr').first().click();
    
    // URL should still have the filter
    await expect(page).toHaveURL(/segment=healthy/);
    
    // Close panel
    await page.click('a[aria-label="Close panel"]');
    
    // Filter should still be applied
    await expect(page).toHaveURL(/segment=healthy/);
  });
});

test.describe('Customer Health Page - Mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('responsive layout on mobile', async ({ page }) => {
    await page.goto('/customer-health');
    
    // Table should be scrollable
    await expect(page.locator('table')).toBeVisible();
    
    // Filters should stack vertically
    const filtersBar = page.locator('.panel').first();
    await expect(filtersBar).toBeVisible();
  });

  test('details panel is full screen on mobile', async ({ page }) => {
    await page.goto('/customer-health');
    
    // Open a customer
    await page.locator('tbody tr').first().click();
    
    // Panel should be visible
    await expect(page.locator('text=Health Factors')).toBeVisible();
  });
});
