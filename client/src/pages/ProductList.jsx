import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch("/api/departments");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setDepartments(data);
      } catch (error) {
        console.error("Failed to fetch departments:", error);
      }
    };
    fetchDepartments();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      const limit = 10;
      let url = "";
      if (!selectedDepartment) {
        url = `/api/products?page=${currentPage}&limit=${limit}`;
      } else {
        url = `/api/departments/${selectedDepartment}/products?page=${currentPage}&limit=${limit}`;
      }
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setProducts(data.products);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };
    fetchProducts();
  }, [selectedDepartment, currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };

  return (
    <div
      style={{
        display: "flex",
        maxWidth: "900px",
        margin: "20px auto",
        fontFamily: "Arial, sans-serif",
        padding: "0 10px",
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: "200px",
          backgroundColor: "#f5f5f5",
          padding: "10px",
          borderRadius: "4px",
          marginRight: "20px",
          height: "fit-content",
        }}
      >
        <h2 style={{ color: "#333", fontSize: "18px", marginBottom: "10px" }}>
          Departments
        </h2>
        <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
          <li
            key="all"
            style={{
              marginBottom: "8px",
              color: selectedDepartment === "" ? "#0056b3" : "#007bff",
              cursor: "pointer",
              fontWeight: selectedDepartment === "" ? "bold" : "normal",
            }}
            onClick={() => {
              setSelectedDepartment("");
              setCurrentPage(1);
            }}
          >
            All Departments
          </li>
          {departments.map((dept) => (
            <li
              key={dept._id}
              style={{
                marginBottom: "8px",
                color: selectedDepartment === dept._id ? "#0056b3" : "#007bff",
                cursor: "pointer",
                fontWeight: selectedDepartment === dept._id ? "bold" : "normal",
              }}
              onClick={() => {
                setSelectedDepartment(dept._id);
                setCurrentPage(1);
              }}
            >
              {dept.name}
            </li>
          ))}
        </ul>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1 }}>
        <h1 style={{ color: "#333" }}>Product List</h1>
        <p style={{ color: "#666" }}>Here you can find a list of products.</p>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {products.map((product) => (
            <li key={product.id} style={{ marginBottom: "10px" }}>
              <Link
                to={`/products/${product.id}`}
                style={{ color: "#007bff", textDecoration: "none" }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.textDecoration = "underline")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.textDecoration = "none")
                }
              >
                {product.name}
              </Link>
            </li>
          ))}
        </ul>
        {/* Pagination buttons */}
        <div style={{ marginTop: "20px" }}>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            style={{ marginRight: "10px" }}
          >
            Previous
          </button>
          {totalPages <= 7 ? (
            [...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                style={{
                  marginRight: "5px",
                  fontWeight: currentPage === index + 1 ? "bold" : "normal",
                }}
              >
                {index + 1}
              </button>
            ))
          ) : (
            <>
              <button
                onClick={() => handlePageChange(1)}
                style={{
                  marginRight: "5px",
                  fontWeight: currentPage === 1 ? "bold" : "normal",
                }}
              >
                1
              </button>
              {currentPage > 4 && <span style={{ marginRight: "5px" }}>...</span>}
              {currentPage > 3 && (
                <button
                  onClick={() => handlePageChange(currentPage - 2)}
                  style={{ marginRight: "5px" }}
                >
                  {currentPage - 2}
                </button>
              )}
              {currentPage > 2 && (
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  style={{ marginRight: "5px" }}
                >
                  {currentPage - 1}
                </button>
              )}
              <button
                onClick={() => handlePageChange(currentPage)}
                style={{
                  marginRight: "5px",
                  fontWeight: "bold",
                  textDecoration: "underline",
                }}
              >
                {currentPage}
              </button>
              {currentPage < totalPages - 1 && (
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  style={{ marginRight: "5px" }}
                >
                  {currentPage + 1}
                </button>
              )}
              {currentPage < totalPages - 2 && (
                <button
                  onClick={() => handlePageChange(currentPage + 2)}
                  style={{ marginRight: "5px" }}
                >
                  {currentPage + 2}
                </button>
              )}
              {currentPage < totalPages - 3 && <span style={{ marginRight: "5px" }}>...</span>}
              <button
                onClick={() => handlePageChange(totalPages)}
                style={{
                  marginRight: "5px",
                  fontWeight: currentPage === totalPages ? "bold" : "normal",
                }}
              >
                {totalPages}
              </button>
            </>
          )}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={{ marginLeft: "10px" }}
          >
            Next
          </button>
        </div>
      </main>
    </div>
  );
};

export default ProductList;
