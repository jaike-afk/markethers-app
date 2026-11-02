import { NextResponse } from 'next/server';
import { store } from '@/lib/store';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId');

    if (!businessId) {
      return NextResponse.json({ error: 'businessId es requerido' }, { status: 400 });
    }

    const items = store.getMenuItems(businessId);
    return NextResponse.json({ items });
  } catch (error) {
    console.error('Error in /api/menu GET:', error);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      businessId,
      name,
      description,
      price,
      category,
      imageUrl,
      videoUrl,
      available = true,
      featured = false,
    } = body;

    if (!businessId || !name || price === undefined || !category) {
      return NextResponse.json(
        { error: 'businessId, name, price y category son requeridos' },
        { status: 400 }
      );
    }

    const newItem = store.addMenuItem({
      businessId,
      name,
      description: description || '',
      price: Number(price),
      category,
      imageUrl: imageUrl || '',
      videoUrl: videoUrl || '',
      available: Boolean(available),
      featured: Boolean(featured),
    });

    return NextResponse.json({ success: true, item: newItem });
  } catch (error) {
    console.error('Error in /api/menu POST:', error);
    return NextResponse.json({ error: 'Error al crear producto' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'id es requerido' }, { status: 400 });
    }

    if (updates.price !== undefined) {
      updates.price = Number(updates.price);
    }

    const updated = store.updateMenuItem(id, updates);
    if (!updated) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ success: true, item: updated });
  } catch (error) {
    console.error('Error in /api/menu PUT:', error);
    return NextResponse.json({ error: 'Error al actualizar producto' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'id es requerido' }, { status: 400 });
    }

    const success = store.deleteMenuItem(id);
    if (!success) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Producto eliminado' });
  } catch (error) {
    console.error('Error in /api/menu DELETE:', error);
    return NextResponse.json({ error: 'Error al eliminar producto' }, { status: 500 });
  }
}
