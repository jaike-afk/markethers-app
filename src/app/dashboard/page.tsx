import React from 'react';
import { store } from '@/lib/store';
import { ClientDashboardView } from './ClientDashboardView';

export const metadata = {
  title: 'Dashboard de Negocio | Markethers Loyalty Platform',
  description: 'Gestiona tus clientes, diseña tu tarjeta Wallet y revisa analíticas en tiempo real.',
};

export default function DashboardPage() {
  const businesses = store.getBusinesses();
  const allCustomers = businesses.flatMap(b => store.getCustomersByBusiness(b.id));
  const allMenuItems = businesses.flatMap(b => store.getMenuItems(b.id));
  const allTransactions = businesses.flatMap(b => store.getTransactionsByBusiness(b.id));

  return (
    <ClientDashboardView
      initialBusinesses={businesses}
      initialCustomers={allCustomers}
      initialMenuItems={allMenuItems}
      initialTransactions={allTransactions}
    />
  );
}
