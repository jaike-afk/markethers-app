import React from 'react';
import { notFound } from 'next/navigation';
import { store } from '@/lib/store';
import { ClientStoreView } from './ClientStoreView';

export const instant = false;

export function generateStaticParams() {
  return store.getBusinesses().map(b => ({ slug: b.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const business = store.getBusinessBySlug(slug);

  if (!business) {
    return { title: 'Negocio no encontrado - Markethers' };
  }

  return {
    title: `${business.name} | Tarjeta de Lealtad & Menú Digital`,
    description: business.tagline,
  };
}

export default async function StorePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const business = store.getBusinessBySlug(slug);

  if (!business) {
    notFound();
  }

  const menuItems = store.getMenuItems(business.id);
  const customers = store.getCustomersByBusiness(business.id);
  // Default to first customer for demo or null
  const initialCustomer = customers.length > 0 ? customers[0] : null;

  return (
    <ClientStoreView
      business={business}
      initialCustomer={initialCustomer}
      menuItems={menuItems}
    />
  );
}
