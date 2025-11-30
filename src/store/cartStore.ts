import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product, ProductVariant } from '@/types';

interface AddItemOptions {
  variant?: ProductVariant;
  openDrawer?: boolean;
}

interface CartStore {
  items: CartItem[];
  userId: string | null;
  lastAddedItem?: CartItem;
  isDrawerOpen: boolean;
  addItem: (product: Product, quantity?: number, options?: AddItemOptions) => void;
  removeItem: (productId: number | string, variantId?: string) => void;
  updateQuantity: (productId: number | string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  syncWithUser: (userId: string | null) => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

// Get current user ID from localStorage
const getCurrentUserId = (): string | null => {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem('vita-auth-user');
    return stored ? JSON.parse(stored).id : null;
  } catch {
    return null;
  }
};

const areSameItems = (item: CartItem, productId: number | string, variantId?: string | null): boolean => {
  const sameProduct = item.product.id === productId;
  const itemVariantId = item.variant?.id || null;
  return sameProduct && itemVariantId === (variantId || null);
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      userId: null,
      lastAddedItem: undefined,
      isDrawerOpen: false,

      syncWithUser: (userId: string | null) => {
        const currentUserId = getCurrentUserId();
        if (get().userId && get().userId !== userId) {
          set({ items: [], userId, lastAddedItem: undefined, isDrawerOpen: false });
        } else if (!get().userId) {
          set({ userId });
        }
      },

      addItem: (product: Product, quantity: number = 1, options?: AddItemOptions) => {
        const userId = getCurrentUserId();
        get().syncWithUser(userId);

        set((state) => {
          const variantId = options?.variant?.id || null;
          const existingIndex = state.items.findIndex((item) => areSameItems(item, product.id, variantId));

          let updatedItems: CartItem[];

          if (existingIndex !== -1) {
            updatedItems = state.items.map((item, index) =>
              index === existingIndex
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
          } else {
            const newItem: CartItem = {
              product,
              quantity,
              variant: options?.variant,
            };
            updatedItems = [...state.items, newItem];
          }

          const targetItem = existingIndex !== -1
            ? updatedItems[existingIndex]
            : updatedItems[updatedItems.length - 1];

          const shouldOpenDrawer = options?.openDrawer !== false;

          return {
            items: updatedItems,
            lastAddedItem: targetItem,
            isDrawerOpen: shouldOpenDrawer ? true : state.isDrawerOpen,
          };
        });
      },

      removeItem: (productId: number | string, variantId?: string) => {
        set((state) => ({
          items: state.items.filter((item) => !areSameItems(item, productId, variantId || null)),
        }));
      },

      updateQuantity: (productId: number | string, quantity: number, variantId?: string) => {
        if (quantity <= 0) {
          get().removeItem(productId, variantId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            areSameItems(item, productId, variantId || null)
              ? { ...item, quantity }
              : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [], userId: null, lastAddedItem: undefined, isDrawerOpen: false });
      },

      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),

      getTotal: () => {
        const { items } = get();
        return items.reduce((total, item) => {
          const price = item.variant?.price ?? item.product.price;
          return total + price * item.quantity;
        }, 0);
      },

      getItemCount: () => {
        const { items } = get();
        return items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ items: state.items, userId: state.userId }),
    }
  )
);

