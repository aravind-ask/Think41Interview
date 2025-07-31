import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };
    fetchProducts();
  }, []);
return (
    <div style={{ maxWidth: '600px', margin: '20px auto', fontFamily: 'Arial, sans-serif', padding: '0 10px' }}>
        <h1 style={{ color: '#333' }}>Product List</h1>
        <p style={{ color: '#666' }}>Here you can find a list of products.</p>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
            {products.map((product) => (
                <li key={product.id} style={{ marginBottom: '10px' }}>
                    <Link 
                      to={`/products/${product.id}`} 
                      style={{ color: '#007bff', textDecoration: 'none' }}
                      onMouseOver={e => e.currentTarget.style.textDecoration = 'underline'}
                      onMouseOut={e => e.currentTarget.style.textDecoration = 'none'}
                    >
                      {product.name}
                    </Link>
                </li>
            ))}
        </ul>
    </div>
);
};

export default ProductList;
