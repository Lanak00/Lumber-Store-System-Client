import { useState, useEffect } from "react";
import ProductList from "../components/products/ProductList";
import SortComponent from "../components/products/SortComponent";
import FilterComponent from "../components/products/FilterComponent";
import styles from "../components/products/AllProductsPage.module.css";
import NewProductForm from "../components/products/NewProductForm";

function AllProductsPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [sortOrder, setSortOrder] = useState('');
    const [typeFilter, setTypeFilter] = useState([]);
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(30000);
    const [isEmployee, setIsEmployee] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);

    const token = localStorage.getItem('token');


    useEffect(() => {
      // Determine if user is an employee
      const userRole = getUserRoleFromToken(token);
      setIsEmployee(userRole === 'Employee');
    }, [token]);

    // Fetch products from backend
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('https://localhost:7046/api/Product');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    useEffect(() => {
      fetchProducts();
    }, []);

    useEffect(() => {
      let updatedProducts = [...products];

      // Filter by type
      if (typeFilter.length > 0) {
        updatedProducts = updatedProducts.filter((product) => typeFilter.includes(product.category));
      }

      // Filter by price range
      updatedProducts = updatedProducts.filter(
        (product) => product.price >= minPrice && product.price <= maxPrice
      );

      // Sort by price
      updatedProducts.sort((a, b) => (sortOrder === 'asc' ? a.price - b.price : b.price - a.price));

      setFilteredProducts(updatedProducts);
    }, [products, sortOrder, typeFilter, minPrice, maxPrice]);

    const handleSortChange = (order) => setSortOrder(order);
    const handleTypeFilterChange = (e) => {
      const value = Number(e.target.value);
      const checked = e.target.checked;
      if (checked) {
        setTypeFilter((prev) => [...prev, value]);
      } else {
        setTypeFilter((prev) => prev.filter((type) => type !== value));
      }
    };
    const handleMinPriceChange = (e) => setMinPrice(Number(e.target.value));
    const handleMaxPriceChange = (e) => setMaxPrice(Number(e.target.value));

    const handleAddProductClick = () => setIsFormOpen(true);

    const handleCloseForm = () => {
      setIsFormOpen(false);
    };

    const handleProductAdded = () => {
      setIsFormOpen(false);
      fetchProducts(); // Refetch products after a new product is added
    };

    if (isLoading) {
      return (
        <section>
          <p>Loading...</p>
        </section>
      );
    }

    return (
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <SortComponent sortOrder={sortOrder} onSortChange={handleSortChange} />
          <FilterComponent
            typeFilter={typeFilter}
            onTypeChange={handleTypeFilterChange}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onMinPriceChange={handleMinPriceChange}
            onMaxPriceChange={handleMaxPriceChange}
          />
        </div>

        <ProductList products={filteredProducts} />

        {isEmployee && (
          <button 
            className={styles.addProductButton} 
            onClick={handleAddProductClick}
          >
            +
          </button>
        )}

        {isFormOpen && (
          <NewProductForm
            onClose={handleCloseForm}
            onProductAdded={handleProductAdded} // Pass onProductAdded prop
          />
        )}
      </section>
    );
}

// Helper function to extract the user role from the JWT token
const getUserRoleFromToken = (token) => {
  if (!token) return null; // Check if the token is null or undefined
  try {
    const tokenPayload = JSON.parse(atob(token.split('.')[1]));
    return tokenPayload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
  } catch (error) {
    console.error("Error parsing token:", error);
    return null; // Return null if token parsing fails
  }
};

export default AllProductsPage;
