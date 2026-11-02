import { NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { generateApplePassJson } from '@/lib/wallet-generator';

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

  const passJson = generateApplePassJson(business, customer);

  // In production with Apple Developer certificates, this endpoint bundles
  // pass.json + icons + manifest.json + signature into a .pkpass zip file.
  // Here we serve the authentic pass.json structure with download header
  // so developers can inspect and verify the Apple PassKit payload.
  return new NextResponse(JSON.stringify(passJson, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="${business.slug}-apple-pass.json"`,
    },
  });
}
