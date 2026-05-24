// src/lib/uid.ts

/**
 * Génère un ID unique basé sur timestamp + random + counter
 * Garantit l'unicité même pour des appels simultanés
 */
let counter = 0;

export function generateUniqueId(prefix: string = 'trade'): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  counter = (counter + 1) % 10000; // Reset après 10000 pour éviter overflow
  
  return `${prefix}-${timestamp}-${random}-${counter}`;
}