import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [isError, setIsError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [category, setCategory] = useState("");
  const [keywords, setKeywords] = useState("");
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(0);
  const [totalPage, setTotalPage] = useState("");
  function display(time) {
    const date = new Date(time);
    const month = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${date.getDate()} ${
      month[date.getMonth()]
    } ${date.getFullYear()} ${date.toLocaleTimeString()}`;
  }
  const getProducts = async () => {
    try {
      setIsError(false);
      setIsLoading(true);
      const results = await axios(
        `http://localhost:4001/products?keywords=${keywords}&category=${category}&limit=${limit}&page=${page}`
      );
      setProducts(results.data.data);
      setTotalPage(results.data.totalPage);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setIsError(true);
    }
  };

  const deleteProduct = async (productId) => {
    await axios.delete(`http://localhost:4001/products/${productId}`);
    const newProducts = products.filter((product) => product._id !== productId);
    setProducts(newProducts);
  };

  useEffect(() => {
    getProducts();
  }, [category, keywords, page]);

  return (
    <div>
      <div className="app-wrapper">
        <h1 className="app-title">Products</h1>
        <button
          onClick={() => {
            navigate("/product/create");
          }}
        >
          Create Product
        </button>
      </div>
      <div className="search-box-container">
        <div className="search-box">
          <label>
            Search product
            <input
              type="text"
              placeholder="Search by name"
              value={keywords}
              onChange={(e) => {
                setKeywords(e.target.value);
                setPage(0);
              }}
            />
          </label>
        </div>
        <div className="category-filter">
          <label>
            View Category
            <select
              id="category"
              name="category"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(0);
              }}
            >
              <option value="">View All Categories</option>
              <option value="IT">IT</option>
              <option value="Fashion">Fashion</option>
              <option value="Food">Food</option>
            </select>
          </label>
        </div>
      </div>
      <div className="product-list">
        {!products.length && !isError && (
          <div className="no-blog-posts-container">
            <h1>No Products</h1>
          </div>
        )}
        {products.map((product) => {
          return (
            <div className="product" key={product._id}>
              <div className="product-preview">
                <img
                  src={product.image}
                  alt="some product"
                  width="250"
                  height="250"
                />
              </div>
              <div className="product-detail">
                <h1>Product name: {product.name} </h1>
                <h2>Product price: {product.price}</h2>
                <h3>Category: {product.category}</h3>
                <h3>Created Time: {display(product.created_time)}</h3>
                <p>Product description: {product.description} </p>
                <div className="product-actions">
                  <button
                    className="view-button"
                    onClick={() => {
                      navigate(`/product/view/${product._id}`);
                    }}
                  >
                    View
                  </button>
                  <button
                    className="edit-button"
                    onClick={() => {
                      navigate(`/product/edit/${product._id}`);
                    }}
                  >
                    Edit
                  </button>
                </div>
              </div>

              <button
                className="delete-button"
                onClick={() => {
                  deleteProduct(product._id);
                }}
              >
                x
              </button>
            </div>
          );
        })}
        {isError ? <h1>Request failed</h1> : null}
        {isLoading ? <h1>Loading ....</h1> : null}
      </div>

      <div className="pagination">
        <button
          className="previous-button"
          onClick={() => {
            if (page > 0) {
              setPage(page - 1);
            }
          }}
        >
          Previous
        </button>
        <button
          className="next-button"
          onClick={() => {
            if (products.length === 5) {
              setPage(page + 1);
              if (page > totalPage) {
                setPage(page);
              }
            }
          }}
        >
          Next
        </button>
      </div>
      <div className="pages">
        ${page + 1} / {totalPage}
      </div>
    </div>
  );
}

export default HomePage;
