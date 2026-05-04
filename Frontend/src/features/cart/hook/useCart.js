import { addItem, decrementCartItemApi, getCart, incrementCartItemApi, removeFromCartApi } from "../service/cart.api";
import { useDispatch } from "react-redux";
import { addItem as addItemToCart, setItems, incrementCartItem, decrementCartItem, removeFromCart } from "../state/cart.slice";

export const useCart = () => {
  const dispatch = useDispatch();

  async function handleAddItem({ productId, variantId }) {
    try {
      const data = await addItem({productId, variantId});
      // Fetch the updated cart so the navbar badge and state reflect the change
      await handleGetCart();
      return data;
    } catch (error) {
      console.error("Failed to add to cart", error);
    }
  }  

  async function handleGetCart(){
    try {
      const data = await getCart();
      // Handle different possible backend response structures safely
    let items = [];
    if (Array.isArray(data)) {
      items = data;
    } else if (data?.cart?.items) {
      items = data.cart.items;
    } else if (data?.cartItems) {
      items = data.cartItems;
    } else if (data?.items) {
      items = data.items;
    }
    dispatch(setItems(items));
    } catch (error) {
      console.error("Failed to fetch cart", error);
    }
  }

  async function handleIncrementCartItem({productId, variantId}){
    try {
      await incrementCartItemApi({productId, variantId});
      dispatch(incrementCartItem({productId, variantId}));
    } catch (error) {
      console.error("Failed to increment cart item", error);
      throw error;
    }
  }

  async function handleDecrementCartItem({productId, variantId}){
    try {
      await decrementCartItemApi({productId, variantId});
      dispatch(decrementCartItem({productId, variantId}));
    } catch (error) {
      console.error("Failed to decrement cart item", error);
      throw error;
    }
  }

  async function handleRemoveFromCart({productId, variantId}){
    try {
      await removeFromCartApi({productId, variantId});
      dispatch(removeFromCart({productId, variantId}));
    } catch (error) {
      console.error("Failed to remove from cart", error);
      throw error;
    }
  }

  return { handleAddItem, handleGetCart, handleIncrementCartItem, handleDecrementCartItem, handleRemoveFromCart };
};
