import { describe, it, expect } from 'vitest';
import { generateMockCustomers, generateMockCustomerHealth } from '@/lib/mock-data';

describe('generateMockCustomers', () => {
  it('returns an array of customers', () => {
    const customers = generateMockCustomers();
    expect(Array.isArray(customers)).toBe(true);
    expect(customers.length).toBeGreaterThan(0);
  });

  it('each customer has required fields', () => {
    const customers = generateMockCustomers();
    const customer = customers[0];

    expect(customer).toHaveProperty('id');
    expect(customer).toHaveProperty('name');
    expect(customer).toHaveProperty('domain');
    expect(customer).toHaveProperty('mrr');
    expect(customer).toHaveProperty('lastActive');
    expect(customer).toHaveProperty('healthSegment');
    expect(customer).toHaveProperty('healthScore');
    expect(customer).toHaveProperty('owner');
  });

  it('health segment matches health score', () => {
    const customers = generateMockCustomers();
    
    customers.forEach((customer) => {
      if (customer.healthScore >= 70) {
        expect(customer.healthSegment).toBe('healthy');
      } else if (customer.healthScore >= 40) {
        expect(customer.healthSegment).toBe('watch');
      } else {
        expect(customer.healthSegment).toBe('at-risk');
      }
    });
  });

  it('returns consistent data across calls', () => {
    const customers1 = generateMockCustomers();
    const customers2 = generateMockCustomers();
    
    expect(customers1).toEqual(customers2);
  });
});

describe('generateMockCustomerHealth', () => {
  it('returns null for non-existent customer', () => {
    const health = generateMockCustomerHealth('non-existent-id');
    expect(health).toBeNull();
  });

  it('returns health details for valid customer', () => {
    const customers = generateMockCustomers();
    const health = generateMockCustomerHealth(customers[0].id);
    
    expect(health).not.toBeNull();
    expect(health?.id).toBe(customers[0].id);
  });

  it('health details have all required fields', () => {
    const customers = generateMockCustomers();
    const health = generateMockCustomerHealth(customers[0].id);

    expect(health).toHaveProperty('id');
    expect(health).toHaveProperty('name');
    expect(health).toHaveProperty('mrr');
    expect(health).toHaveProperty('arr');
    expect(health).toHaveProperty('healthFactors');
    expect(health).toHaveProperty('recentEvents');
    expect(health).toHaveProperty('usageTrends');
    expect(health).toHaveProperty('notes');
  });

  it('ARR equals MRR times 12', () => {
    const customers = generateMockCustomers();
    const health = generateMockCustomerHealth(customers[0].id);
    
    expect(health?.arr).toBe(health?.mrr! * 12);
  });

  it('health factors are within valid range', () => {
    const customers = generateMockCustomers();
    const health = generateMockCustomerHealth(customers[0].id);
    
    const factors = health?.healthFactors;
    expect(factors?.engagement).toBeGreaterThanOrEqual(0);
    expect(factors?.engagement).toBeLessThanOrEqual(100);
    expect(factors?.adoption).toBeGreaterThanOrEqual(0);
    expect(factors?.adoption).toBeLessThanOrEqual(100);
    expect(factors?.support).toBeGreaterThanOrEqual(0);
    expect(factors?.support).toBeLessThanOrEqual(100);
    expect(factors?.growth).toBeGreaterThanOrEqual(0);
    expect(factors?.growth).toBeLessThanOrEqual(100);
  });
});
