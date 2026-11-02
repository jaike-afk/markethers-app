import { NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { generateGoogleWalletPass } from '@/lib/wallet-generator';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const customer = store.getCustomerByToken(token);

  if (!customer) {
    return NextResponse.json({ error: 'Tarjeta no encontrada' }, { status: 404 });
  }

  const business = store.getBusinessById(customer.businessId);
  if (!business) {
    return NextResponse.json({ error: 'Comercio no encontrado' }, { status: 404 });
  }

  const googlePass = generateGoogleWalletPass(business, customer);

  return new NextResponse(JSON.stringify(googlePass, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="${business.slug}-google-pass.json"`,
    },
  });
}
