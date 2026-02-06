import { NextRequest, NextResponse } from 'next/server';
import { generateMockCustomerHealth } from '@/lib/mock-data';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ customerId: string }> }
) {
  const { customerId } = await params;

  // Simulate network latency (remove in production)
  await new Promise((resolve) => setTimeout(resolve, 400));

  const customerHealth = generateMockCustomerHealth(customerId);

  if (!customerHealth) {
    return NextResponse.json(
      { error: 'Customer not found' },
      { status: 404 }
    );
  }

  return NextResponse.json(customerHealth);
}
