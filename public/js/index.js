async function addProductToCart(productID) {
    const CART_ID = 1
    const FETCH_URL = `http://localhost:8080/api/cart/${CART_ID}/product/${productID}`
    await fetch(FETCH_URL, { method: 'PUT' })
}