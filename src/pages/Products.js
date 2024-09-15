import { useState, useEffect } from "react";
import ProductList from "../components/products/ProductList";
import SortComponent from "../components/products/SortComponent";
import FilterComponent from "../components/products/FilterComponent";

function AllProductsPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [sortOrder, setSortOrder] = useState('');
    const [typeFilter, setTypeFilter] = useState([]);
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(30000);
  
    useEffect(() => {
      setIsLoading(true);
  
      fetch('https://localhost:44364/api/Product')
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch products');
          }
          return response.json();
        })
        .then((data) => {
          setIsLoading(false);
          setProducts(data);
          setFilteredProducts(data);
          console.log(data);
        })
        .catch((error) => {
          console.error('Error fetching products:', error);
          setIsLoading(false);
        });
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
        const value = Number(e.target.value); // Convert value to a number
        const checked = e.target.checked;
      if (checked) {
        setTypeFilter((prev) => [...prev, value]);
      } else {
        setTypeFilter((prev) => prev.filter((type) => type !== value));
      }
    };
    const handleMinPriceChange = (e) => setMinPrice(Number(e.target.value));
    const handleMaxPriceChange = (e) => setMaxPrice(Number(e.target.value));
  
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
      </section>
    );
  }
  
  export default AllProductsPage;
