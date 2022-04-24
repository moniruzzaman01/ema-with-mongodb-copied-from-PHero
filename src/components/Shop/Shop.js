import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useCart from "../../hooks/useCart";
import useProducts from "../../hooks/useProducts";
import { addToDb, getStoredCart } from "../../utilities/fakedb";
import Cart from "../Cart/Cart";
import Product from "../Product/Product";
import "./Shop.css";

const Shop = () => {
  const [cart, setCart] = useCart();
  const [totalPage, setTotalPage] = useState(0);
  const [pageNumber, setPageNumber] = useState(0);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/products?pageNumber=${pageNumber}`)
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, [pageNumber]);

  useEffect(() => {
    fetch("http://localhost:5000/numberOfProducts")
      .then((res) => res.json())
      .then((data) => {
        const totalData = data.numberOfProducts;
        setTotalPage(Math.ceil(totalData / 10));
      });
  }, []);
  //   useEffect(() => {
  //     const storedCart = getStoredCart();
  //     const savedCart = [];
  //     const keys = Object.keys(storedCart);
  //     console.log(keys);
  //     fetch("http://localhost:5000/productByIds", {
  //       method: "POST",
  //       headers: {
  //         "content-type": "application/json",
  //       },
  //       body: JSON.stringify(keys),
  //     })
  //       .then((res) => res.json())
  //       .then((products) => {
  //         for (const id in storedCart) {
  //           const addedProduct = products.find((product) => product._id === id);
  //           if (addedProduct) {
  //             const quantity = storedCart[id];
  //             addedProduct.quantity = quantity;
  //             savedCart.push(addedProduct);
  //           }
  //         }
  //       });
  //     setCart(savedCart);
  //   }, [products]);

  const handleAddToCart = (selectedProduct) => {
    let newCart = [];
    const exists = cart.find((product) => product._id === selectedProduct._id);
    if (!exists) {
      selectedProduct.quantity = 1;
      newCart = [...cart, selectedProduct];
    } else {
      const rest = cart.filter(
        (product) => product._id !== selectedProduct._id
      );
      exists.quantity = exists.quantity + 1;
      newCart = [...rest, exists];
    }

    setCart(newCart);
    addToDb(selectedProduct._id);
  };

  return (
    <div className="shop-container">
      <div className="products-container">
        {products.map((product, index) => (
          <Product
            key={index}
            product={product}
            handleAddToCart={handleAddToCart}
          ></Product>
        ))}
      </div>
      <div className="cart-container">
        <Cart cart={cart}>
          <Link to="/orders">
            <button>Review Order </button>
          </Link>
        </Cart>
      </div>
      <div>
        {[...Array(totalPage).keys()].map((pgNumber, index) => (
          <button onClick={() => setPageNumber(pgNumber)} key={index}>
            {pgNumber}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Shop;
