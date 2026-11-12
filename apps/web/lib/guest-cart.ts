export type GuestCartItem = {
  gameId: string;
  sellerId: string;
  quantity: number;
};

const STORAGE_KEY = "eneba_guest_cart";

export function getGuestCart(): GuestCartItem[] {
  if (typeof window === "undefined") return [];
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  try {
    const parsed: unknown = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is GuestCartItem =>
        typeof item === "object" &&
        item !== null &&
        typeof (item as GuestCartItem).gameId === "string" &&
        typeof (item as GuestCartItem).sellerId === "string" &&
        typeof (item as GuestCartItem).quantity === "number",
    );
  } catch {
    return [];
  }
}

function saveGuestCart(items: GuestCartItem[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function addToGuestCart(gameId: string, sellerId: string) {
  const items = getGuestCart();
  const existing = items.find((item) => item.gameId === gameId && item.sellerId === sellerId);
  if (existing) existing.quantity += 1;
  else items.push({ gameId, sellerId, quantity: 1 });
  saveGuestCart(items);
}

export function removeFromGuestCart(gameId: string, sellerId: string) {
  saveGuestCart(getGuestCart().filter((item) => item.gameId !== gameId || item.sellerId !== sellerId));
}

export function clearGuestCart() {
  if (typeof window !== "undefined") window.localStorage.removeItem(STORAGE_KEY);
}
