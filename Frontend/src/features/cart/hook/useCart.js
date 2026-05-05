import {
  addItem,
  createCartOrder,
  decrementCartItemApi,
  getCart,
  incrementCartItemApi,
  removeFromCartApi,
  verifyCartOrder,
} from "../service/cart.api";
import { useDispatch } from "react-redux";
import {
  setCart as addItemToCart,
  incrementCartItem,
  decrementCartItem,
  removeFromCart,
  setCart,
} from "../state/cart.slice";

export const useCart = () => {
  const dispatch = useDispatch();

  async function handleAddItem({ productId, variantId }) {
    try {
      const data = await addItem({ productId, variantId });
      // Fetch the updated cart so the navbar badge and state reflect the change
      await handleGetCart();
      return data;
    } catch (error) {
      console.error("Failed to add to cart", error);
    }
  }

  async function handleGetCart() {
    const data = await getCart();
    dispatch(setCart(data?.items ? data : data?.cart));
  }

  async function handleIncrementCartItem({ productId, variantId }) {
    // 1. Optimistic UI update
    dispatch(incrementCartItem({ productId, variantId }));

    try {
      // 2. Network request
      const data = await incrementCartItemApi({ productId, variantId });

      // 3. Background sync with backend truth
      if (data?.items || data?.cart?.items) {
        dispatch(setCart(data?.items ? data : data?.cart));
      } else {
        await handleGetCart();
      }
    } catch (error) {
      // 4. Revert on failure
      dispatch(decrementCartItem({ productId, variantId }));
      console.error("Failed to increment cart item", error);
      throw error;
    }
  }

  async function handleDecrementCartItem({ productId, variantId }) {
    // 1. Optimistic UI update
    dispatch(decrementCartItem({ productId, variantId }));

    try {
      // 2. Network request
      const data = await decrementCartItemApi({ productId, variantId });

      // 3. Background sync with backend truth
      if (data?.items || data?.cart?.items) {
        dispatch(setCart(data?.items ? data : data?.cart));
      } else {
        await handleGetCart();
      }
    } catch (error) {
      // 4. Revert on failure
      dispatch(incrementCartItem({ productId, variantId }));
      console.error("Failed to decrement cart item", error);
      throw error;
    }
  }

  async function handleRemoveFromCart({ productId, variantId }) {
    // Note: It's harder to optimistically remove and revert an item without storing its full data locally,
    // so we'll wait for the network request before syncing.
    try {
      const data = await removeFromCartApi({ productId, variantId });

      if (data?.items || data?.cart?.items) {
        dispatch(setCart(data?.items ? data : data?.cart));
      } else {
        await handleGetCart();
      }
    } catch (error) {
      console.error("Failed to remove from cart", error);
      throw error;
    }
  }

  async function handleCreateCartOrder() {
    const data = await createCartOrder();
    return data.order;
  }

  async function handleVerifyCartOrder({razorpay_order_id, razorpay_payment_id, razorpay_signature}) {
    const data = await verifyCartOrder({razorpay_order_id, razorpay_payment_id, razorpay_signature});
    return data.success;
  }

  return {
    handleAddItem,
    handleGetCart,
    handleIncrementCartItem,
    handleDecrementCartItem,
    handleRemoveFromCart,
    handleCreateCartOrder,
    handleVerifyCartOrder
  };
};
