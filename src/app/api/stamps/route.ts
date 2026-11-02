import { NextResponse } from 'next/server';
import { store } from '@/lib/store';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, token, customerId, count = 1, staffName = 'Cajero' } = body;

    let targetCustomerId = customerId;

    // If token provided, find customer
    if (!targetCustomerId && token) {
      const customer = store.getCustomerByToken(token);
      if (!customer) {
        return NextResponse.json(
          { error: 'Tarjeta no encontrada o código inválido' },
          { status: 404 }
        );
      }
      targetCustomerId = customer.id;
    }

    if (!targetCustomerId) {
      return NextResponse.json(
        { error: 'Se requiere customerId o token' },
        { status: 400 }
      );
    }

    if (action === 'add_stamp') {
      const result = store.addStamp(targetCustomerId, Number(count), staffName);
      if (!result) {
        return NextResponse.json({ error: 'Cliente no encontrado' }, { status: 404 });
      }
      return NextResponse.json({
        success: true,
        customer: result.customer,
        rewardUnlocked: result.rewardUnlocked,
        message: result.rewardUnlocked
          ? '¡Felicitaciones! El cliente ha completado su tarjeta y tiene un premio disponible.'
          : `Se ha(n) añadido ${count} sello(s) con éxito.`,
      });
    }

    if (action === 'redeem_reward') {
      const result = store.redeemReward(targetCustomerId, staffName);
      if (!result) {
        return NextResponse.json({ error: 'Cliente no encontrado' }, { status: 404 });
      }
      if (!result.success) {
        return NextResponse.json(
          { error: 'El cliente no tiene los sellos suficientes para canjear este premio' },
          { status: 400 }
        );
      }
      return NextResponse.json({
        success: true,
        customer: result.customer,
        message: '¡Recompensa canjeada con éxito! La tarjeta se ha actualizado.',
      });
    }

    return NextResponse.json({ error: 'Acción inválida' }, { status: 400 });
  } catch (error) {
    console.error('Error in /api/stamps:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
