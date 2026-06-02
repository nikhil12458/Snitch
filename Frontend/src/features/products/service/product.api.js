import axios from "axios";

const API_BASE_URL = "https://snitch-production.up.railway.app";

const productApiInstance = axios.create({
  baseURL: `${API_BASE_URL}/api/products`,
  withCredentials: true,
});

export async function createProduct(formData) {
  const response = await productApiInstance.post("/", formData);
  return response.data;
}

export async function getSellerProducts() {
  const response = await productApiInstance.get("/seller");
  return response.data;
}

export async function getAllProducts() {
  const response = await productApiInstance.get("/");
  return response.data;
}

export async function getProductById(productId) {
  const response = await productApiInstance.get(`/detail/${productId}`);
  return response.data;
}

export async function addProductVariant(productId, variantData) {
  const formData = new FormData();
  formData.append("stock", variantData.stock || 0);

  if (variantData.priceAmount) {
    formData.append("priceAmount", variantData.priceAmount);
    formData.append("priceCurrency", variantData.priceCurrency);
  }

  formData.append("attributes", JSON.stringify(variantData.attributes));

  if (variantData.images && variantData.images.length > 0) {
    variantData.images.forEach((file) => {
      formData.append("images", file);
    });
  }

  const response = await productApiInstance.post(
    `/${productId}/variants`,
    formData,
  );
  return response.data;
}
