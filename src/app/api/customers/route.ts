import { NextResponse } from 'next/server';
import { store } from '@/lib/store';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const businessId = searchParams.get('businessId');

    if (token) {
      const customer = store.getCustomerByToken(token);
      if (!customer) {
        return NextResponse.json({ error: 'Tarjeta no encontrada' }, { status: 404 });
      }
      const business = store.getBusinessById(customer.businessId);
      return NextResponse.json({ customer, business });
    }

    if (businessId) {
      const customers = store.getCustomersByBusiness(businessId);
      return NextResponse.json({ customers });
    }

    return NextResponse.json({ error: 'Parámetros insuficientes' }, { status: 400 });
  } catch (error) {
    console.error('Error in /api/customers GET:', error);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { businessId, name, phone, email } = body;

    if (!businessId || !name || !phone) {
      return NextResponse.json(
        { error: 'businessId, name y phone son campos requeridos' },
        { status: 400 }
      );
    }

    const customer = store.registerCustomer({
      businessId,
      name,
      phone,
      email,
    });

    const business = store.getBusinessById(businessId);

    return NextResponse.json({
      success: true,
      customer,
      business,
      message: '¡Tarjeta activada exitosamente con 1 sello de bienvenida!',
    });
  } catch (error) {
    console.error('Error in /api/customers POST:', error);
    return NextResponse.json({ error: 'Error al registrar cliente' }, { status: 500 });
  }
}
