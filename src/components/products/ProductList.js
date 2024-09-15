import ProductItem from './ProductItem'; // Import the ProductItem component
import classes from './ProductList.module.css'; // Import the CSS module for styling

function ProductList(props) {
  return (
    <ul className={classes.list}>
      {props.products.map(product => (
        <ProductItem
          key={product.id}
          id={product.id}
          name={product.name}
          image={product.image}
          price={product.price}
          dimensions={product.dimensions}
          category={product.category}
        />
      ))}
    </ul>
  );
}

export default ProductList;
