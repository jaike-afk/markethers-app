export interface UserAccount {
  id: string;
  email: string;
  password: string;
  name: string;
  businessId: string;
  businessName: string;
  planId: string;
  role?: 'owner' | 'client';
  createdAt: string;
}

export const DEFAULT_USERS: UserAccount[] = [
  {
    id: 'user_master_1',
    email: 'jaikeromero@gmail.com',
    password: 'password123',
    name: 'Jaike Romero',
    role: 'owner',
    businessId: 'biz_habibi_0',
    businessName: 'Habibi Bar Cantina',
    planId: 'pro',
    createdAt: '2026-01-01T00:00:00Z',
  },
];

export function isOwnerUser(user: UserAccount | null | undefined): boolean {
  if (!user) return false;
  return user.role === 'owner' || user.email.toLowerCase() === 'jaikeromero@gmail.com';
}

const STORAGE_USERS_KEY = 'markethers_registered_users';
const STORAGE_CURRENT_USER_KEY = 'markethers_current_user';

export function getRegisteredUsers(): UserAccount[] {
  if (typeof window === 'undefined') return DEFAULT_USERS;
  try {
    const raw = localStorage.getItem(STORAGE_USERS_KEY);
    const stored: UserAccount[] = raw ? JSON.parse(raw) : [];
    // Combine defaults with stored users, avoiding duplicates by email
    const all = [...DEFAULT_USERS];
    for (const u of stored) {
      if (!all.some(existing => existing.email.toLowerCase() === u.email.toLowerCase())) {
        all.push(u);
      }
    }
    return all;
  } catch {
    return DEFAULT_USERS;
  }
}

export function saveUser(user: UserAccount): { success: boolean; error?: string } {
  if (typeof window === 'undefined') return { success: false, error: 'Entorno no disponible' };
  try {
    const users = getRegisteredUsers();
    if (users.some(u => u.email.toLowerCase() === user.email.toLowerCase())) {
      return { success: false, error: 'Ya existe una cuenta con este correo electrónico. Por favor inicia sesión.' };
    }
    const raw = localStorage.getItem(STORAGE_USERS_KEY);
    const stored: UserAccount[] = raw ? JSON.parse(raw) : [];
    const formattedUser: UserAccount = {
      ...user,
      role: user.role || (user.email.toLowerCase() === 'jaikeromero@gmail.com' ? 'owner' : 'client'),
    };
    stored.push(formattedUser);
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(stored));
    // Set active session
    setCurrentUser(formattedUser);
    return { success: true };
  } catch {
    return { success: false, error: 'Error al registrar el usuario en el almacenamiento local.' };
  }
}

export function authenticateUser(email: string, password: string): { success: boolean; user?: UserAccount; error?: string } {
  if (!email || !email.trim()) {
    return { success: false, error: 'Por favor ingresa tu correo electrónico.' };
  }
  if (!password) {
    return { success: false, error: 'Por favor ingresa tu contraseña.' };
  }

  const users = getRegisteredUsers();
  const cleanEmail = email.trim().toLowerCase();
  const user = users.find(u => u.email.toLowerCase() === cleanEmail);

  if (!user) {
    return {
      success: false,
      error: 'No existe ninguna cuenta registrada con este correo electrónico. Verifica tus datos o regístrate.',
    };
  }

  if (user.password !== password) {
    return {
      success: false,
      error: 'La contraseña ingresada es incorrecta. Por favor inténtalo de nuevo.',
    };
  }

  const sessionUser: UserAccount = {
    ...user,
    role: user.role || (user.email.toLowerCase() === 'jaikeromero@gmail.com' ? 'owner' : 'client'),
  };

  setCurrentUser(sessionUser);
  return { success: true, user: sessionUser };
}

export function getCurrentUser(): UserAccount | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_CURRENT_USER_KEY);
    if (!raw) return null;
    const user: UserAccount = JSON.parse(raw);
    if (!user.role) {
      user.role = user.email.toLowerCase() === 'jaikeromero@gmail.com' ? 'owner' : 'client';
    }
    return user;
  } catch {
    return null;
  }
}

export function setCurrentUser(user: UserAccount): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(user));
}

export function logoutUser(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_CURRENT_USER_KEY);
}

// Luhn algorithm for valid credit card checksum
export function checkLuhn(cardNo: string): boolean {
  const digits = cardNo.replace(/\D/g, '');
  if (digits.length < 13 || digits.length > 19) return false;
  let nSum = 0;
  let isSecond = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = digits.charCodeAt(i) - 48;
    if (isSecond) d = d * 2;
    nSum += Math.floor(d / 10);
    nSum += d % 10;
    isSecond = !isSecond;
  }
  return nSum % 10 === 0;
}

export function validateCreditCard(
  number: string,
  exp: string,
  cvc: string
): { valid: boolean; error?: string; brand: string; last4: string } {
  const cleanNumber = number.replace(/\D/g, '');

  if (!cleanNumber) {
    return { valid: false, error: 'El número de tarjeta es obligatorio para activar tu suscripción.', brand: 'Tarjeta', last4: '' };
  }

  if (cleanNumber.length < 15 || cleanNumber.length > 16) {
    return {
      valid: false,
      error: 'El número de tarjeta debe tener 15 o 16 dígitos válidos.',
      brand: 'Tarjeta',
      last4: cleanNumber.slice(-4),
    };
  }

  if (!checkLuhn(cleanNumber)) {
    return {
      valid: false,
      error: 'El número de tarjeta de crédito es inválido. Verifica los dígitos de tu tarjeta (puedes usar 4242 4242 4242 4242 de prueba).',
      brand: 'Tarjeta',
      last4: cleanNumber.slice(-4),
    };
  }

  // Validate expiration date MM/YY
  if (!exp || !exp.includes('/')) {
    return {
      valid: false,
      error: 'La fecha de vencimiento es obligatoria y debe tener formato MM/AA (ej. 12/28).',
      brand: 'Tarjeta',
      last4: cleanNumber.slice(-4),
    };
  }

  const [monthStr, yearStr] = exp.split('/');
  const month = parseInt(monthStr, 10);
  const year = parseInt(yearStr, 10);
  const now = new Date();
  const currentYear = now.getFullYear() % 100;
  const currentMonth = now.getMonth() + 1;

  if (isNaN(month) || month < 1 || month > 12) {
    return {
      valid: false,
      error: 'El mes de vencimiento debe estar entre 01 y 12.',
      brand: 'Tarjeta',
      last4: cleanNumber.slice(-4),
    };
  }

  if (isNaN(year) || year < currentYear || (year === currentYear && month < currentMonth)) {
    return {
      valid: false,
      error: 'La tarjeta está vencida. Ingresa una tarjeta con fecha de vencimiento futura.',
      brand: 'Tarjeta',
      last4: cleanNumber.slice(-4),
    };
  }

  // Validate CVC
  const cleanCvc = cvc.replace(/\D/g, '');
  if (!cleanCvc || cleanCvc.length < 3 || cleanCvc.length > 4) {
    return {
      valid: false,
      error: 'El código de seguridad CVC / CVV debe tener 3 o 4 dígitos.',
      brand: 'Tarjeta',
      last4: cleanNumber.slice(-4),
    };
  }

  let brand = 'Visa';
  if (cleanNumber.startsWith('5') || cleanNumber.startsWith('2')) brand = 'Mastercard';
  else if (cleanNumber.startsWith('34') || cleanNumber.startsWith('37')) brand = 'Amex';

  return {
    valid: true,
    brand,
    last4: cleanNumber.slice(-4),
  };
}
