import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
  },
  reducers: {
    setItems: (state, action) => {
      state.items = action.payload;
    },
    addItem: (state, action) => {
      state.items.push(action.payload);
    },
    incrementCartItem: (state, action) => {
      const { productId, variantId } = action.payload;

      state.items = state.items.map((item) => {
        if (
          item.product._id === productId &&
          (item.variant === variantId || item.variant?._id === variantId)
        ) {
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      });
    },

    decrementCartItem: (state, action) => {
      const { productId, variantId } = action.payload;

      state.items = state.items.map((item) => {
        if (
          item.product._id === productId &&
          (item.variant === variantId || item.variant?._id === variantId)
        ) {
          return { ...item, quantity: item.quantity - 1 };
        }
        return item;
      });
    },

    removeFromCart: (state, action) => {
      const { productId, variantId } = action.payload;
      state.items = state.items.filter(
        (item) =>
          !(
            item.product._id === productId &&
            (item.variant === variantId || item.variant?._id === variantId)
          )
      );
    },
  },
});

export const { setItems, addItem, incrementCartItem, decrementCartItem, removeFromCart } = cartSlice.actions;

export default cartSlice.reducer;
