import { create } from 'zustand';
import { Ingredient } from '@/types';

interface CartItem extends Ingredient {
  quantity: number;
}

interface CartStore {
  cartItems: CartItem[];
  addToCart: (ingredient: Ingredient) => void;
  updateQuantity: (ingredientId: number, quantity: number) => void;
  removeFromCart: (ingredientId: number) => void;
  getTotalCount: () => number;
  getTotalPrice: () => number;
  clearCart: () => void;
  getCartItem: (ingredientId: number) => CartItem | undefined;
}

export const useCartStore = create<CartStore>((set, get) => ({
  cartItems: [],

  addToCart: (ingredient: Ingredient) => {
    const { cartItems } = get();
    const existingItem = cartItems.find(item => item.id === ingredient.id);
    
    if (existingItem) {
      // 如果已存在，增加数量
      const updatedItems = cartItems.map(item =>
        item.id === ingredient.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      set({ cartItems: updatedItems });
    } else {
      // 如果不存在，添加新项
      const newItem = {
        ...ingredient,
        quantity: 1
      };
      set({ cartItems: [...cartItems, newItem] });
    }
  },

  updateQuantity: (ingredientId: number, quantity: number) => {
    if (quantity <= 0) {
      get().removeFromCart(ingredientId);
      return;
    }

    const { cartItems } = get();
    const updatedItems = cartItems.map(item =>
      item.id === ingredientId
        ? { ...item, quantity }
        : item
    );
    set({ cartItems: updatedItems });
  },

  removeFromCart: (ingredientId: number) => {
    const { cartItems } = get();
    const updatedItems = cartItems.filter(item => item.id !== ingredientId);
    set({ cartItems: updatedItems });
  },

  getTotalCount: () => {
    const { cartItems } = get();
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  },

  getTotalPrice: () => {
    const { cartItems } = get();
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  },

  clearCart: () => {
    set({ cartItems: [] });
  },

  getCartItem: (ingredientId: number) => {
    const { cartItems } = get();
    return cartItems.find(item => item.id === ingredientId);
  }
}));