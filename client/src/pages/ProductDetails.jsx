import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

const ProductDetails = () => {
  const [product, setProduct] = React.useState(null);
  const { id } = useParams();
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${id}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error("Failed to fetch product:", error);
      }
    };
    fetchProduct();
  },[id]);
  return (
    <div>
      <h1>Product Details</h1>
      {product ? (
        <table style={{
          borderCollapse: 'collapse',
          width: '100%',
          maxWidth: '600px',
          marginTop: '20px',
          fontFamily: 'Arial, sans-serif',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <tbody>
            {Object.entries(product)
              .filter(([key]) => !['_id', 'distribution_center_id', '__v'].includes(key))
              .map(([key, value]) => (
                <tr key={key} style={{ borderBottom: '1px solid #ddd' }}>
                  <th style={{
                    textAlign: 'left',
                    padding: '8px',
                    backgroundColor: '#f4f4f40a',
                    width: '40%',
                    textTransform: 'capitalize'
                  }}>{key.replace(/_/g, ' ')}</th>
                  <td style={{ padding: '8px' }}>{String(value)}</td>
                </tr>
              ))}
          </tbody>
        </table>
      ) : (
        <p>Loading product details...</p>
      )}
    </div>
  );
};

export default ProductDetails;
