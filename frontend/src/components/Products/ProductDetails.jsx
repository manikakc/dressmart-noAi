import React, { useEffect, useState } from 'react';
import { toast } from "sonner";
import ProductGrid from './ProductGrid';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductDetails, fetchSimilarProducts } from '../../redux/slices/productsSlice';
import { addToCart } from "../../redux/slices/cartSlice";
import axios from "axios";
import { FaStar } from "react-icons/fa";
import moment from "moment";

const ProductDetails = ({ productId }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedProduct, loading, error, similarProducts } = useSelector(state => state.products);
  const { user, guestId } = useSelector(state => state.auth);

  const [mainImage, setMainImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  const productFetchId = productId || id;

  useEffect(() => {
    if (productFetchId) {
      dispatch(fetchProductDetails(productFetchId));
      dispatch(fetchSimilarProducts({ id: productFetchId }));
    }
  }, [dispatch, productFetchId]);

  useEffect(() => {
    if (selectedProduct?.images?.length > 0) {
      setMainImage(selectedProduct.images[0].url);
    }
  }, [selectedProduct]);

  const handleQuantityChange = (action) => {
    if (action === "plus") setQuantity(prev => prev + 1);
    if (action === "minus" && quantity > 1) setQuantity(prev => prev - 1);
  };

  const handleAddtoCart = () => {
    if (!selectedSize || !selectedColor) {
      toast.error("Please select a size and color before adding to cart", {
        duration: 1000,
      });
      return;
    }
    setIsButtonDisabled(true);

    dispatch(addToCart({
      productId: productFetchId,
      quantity,
      size: selectedSize,
      color: selectedColor,
      guestId,
      userId: user?._id,
    }))
      .then(() => {
        toast.success("Product added to cart", { duration: 1000 });
      })
      .finally(() => {
        setIsButtonDisabled(false);
      });
  };

  const handleSubmitReview = async () => {
    if (!rating || !comment.trim()) {
      toast.error("Please provide both rating and comment", { duration: 1500 });
      return;
    }
    setReviewSubmitting(true);
    try {
      await axios.put(
         `${import.meta.env.VITE_BACKEND_URL}/api/products/${productFetchId}/review`,
        { rating, comment },
        {
          headers: {
           Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      toast.success("Review submitted successfully", { duration: 1500 });
      setRating(0);
      setComment("");
      dispatch(fetchProductDetails(productFetchId)); // Refresh product to show new review
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to submit review", {
        duration: 1500,
      });
    } finally {
      setReviewSubmitting(false);
    }
  };
  const handleDeleteReview = async (reviewId) => {
  if (!window.confirm("Are you sure you want to delete this review?")) return;

  try {
    await axios.delete(
      `${import.meta.env.VITE_BACKEND_URL}/api/products/${productFetchId}/review/${reviewId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      }
    );
    toast.success("Review deleted successfully", { duration: 1500 });
    dispatch(fetchProductDetails(productFetchId)); // Refresh product reviews
  } catch (err) {
    toast.error(err?.response?.data?.message || "Failed to delete review", {
      duration: 1500,
    });
  }
};


  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className='p-6'>
      {selectedProduct && (
        <div className='max-w-6xl mx-auto bg-white p-8 rounded-lg'>
          <div className='flex flex-col md:flex-row'>
            {/* Thumbnails */}
            <div className='hidden md:flex flex-col space-y-4 mr-6'>
              {selectedProduct.images.map((image, index) => (
                <img
                  key={index}
                  src={image.url}
                  alt={image.altText || `Thumbnail ${index}`}
                  className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${
                    mainImage === image.url ? "border-black" : "border-gray-300"
                  }`}
                  onClick={() => setMainImage(image.url)}
                />
              ))}
            </div>

            {/* Main image */}
            <div className='md:w-1/2 mb-4 md:mb-0'>
              <img src={mainImage} alt="main" className='w-full h-auto object-cover rounded-lg' />
            </div>

            {/* Mobile thumbnails */}
            <div className='md:hidden flex overflow-x-scroll space-x-4 mb-4'>
              {selectedProduct.images.map((image, index) => (
                <img
                  key={index}
                  src={image.url}
                  alt={image.altText || `Thumbnail ${index}`}
                  className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${
                    mainImage === image.url ? "border-black" : "border-gray-300"
                  }`}
                  onClick={() => setMainImage(image.url)}
                />
              ))}
            </div>

            {/* Product details */}
            <div className='md:w-1/2 md:ml-10'>
              <h1 className='text-2xl md:text-3xl font-semibold mb-2'>{selectedProduct.name}</h1>
              <p className='text-lg text-gray-500 mb-1 line-through'>
                {selectedProduct.originalPrice && `$${selectedProduct.originalPrice}`}
              </p>
              <p className='text-xl text-gray-500 mb-2'>${selectedProduct.price}</p>
              <p className='text-gray-600 mb-4'>{selectedProduct.description}</p>

              <div className='mb-4'>
                <p className='text-gray-700'>Color</p>
                <div className='flex gap-2 mt-2'>
                  {selectedProduct.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full border ${
                        selectedColor === color ? "border-4 border-black" : "border-gray-300"
                      }`}
                      style={{
                        backgroundColor: color.toLowerCase(),
                        filter: "brightness(0.5)",
                      }}
                    ></button>
                  ))}
                </div>
              </div>

              <div className='mb-4'>
                <p className='text-gray-700'>Size</p>
                <div className='flex gap-2 mt-2'>
                  {selectedProduct.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded ${
                        selectedSize === size ? "bg-black text-white" : ""
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className='mb-6'>
                <p className='text-gray-700'>Quantity</p>
                <div className='flex items-center space-x-4 mt-2'>
                  <button onClick={() => handleQuantityChange("minus")} className='px-2 py-1 bg-gray-200 rounded text-lg'>-</button>
                  <span className='text-lg'>{quantity}</span>
                  <button onClick={() => handleQuantityChange("plus")} className='px-2 py-1 bg-gray-200 rounded text-lg'>+</button>
                </div>
              </div>

              <button
                onClick={handleAddtoCart}
                disabled={isButtonDisabled}
                className={`bg-black text-white py-2 px-6 rounded w-full mb-4 ${
                  isButtonDisabled ? "cursor-not-allowed opacity-50" : "hover:bg-gray-900"
                }`}
              >
                {isButtonDisabled ? "Adding..." : "ADD TO CART"}
              </button>

              <div className='mt-10 text-gray-700'>
                <h3 className='text-xl font-bold mb-4'>Features</h3>
                <table className='w-full text-left text-sm text-gray-600'>
                  <tbody>
                    <tr>
                      <td className='py-1'>Brand</td>
                      <td className='py-1'>{selectedProduct.brand}</td>
                    </tr>
                    <tr>
                      <td className='py-1'>Material</td>
                      <td className='py-1'>{selectedProduct.material}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Review Form */}
              {user ? (
                <div className='mt-10'>
                  <h3 className='text-lg font-semibold mb-2'>Write a Review</h3>
                  <div className='flex items-center gap-2 mb-2'>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        className={`cursor-pointer text-2xl ${
                          star <= rating ? "text-yellow-400" : "text-gray-300"
                        }`}
                        onClick={() => setRating(star)}
                      />
                    ))}
                  </div>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder='Write your comment here...'
                    rows={4}
                    className='w-full border p-2 rounded mb-2'
                  />
                  <button
                    onClick={handleSubmitReview}
                    disabled={reviewSubmitting}
                    className={`bg-black text-white py-2 px-4 rounded ${
                      reviewSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-800"
                    }`}
                  >
                    {reviewSubmitting ? "Submitting..." : "Submit Review"}
                  </button>
                </div>
              ) : (
                <p className='text-gray-500 mt-10'><em>Login to write a review.</em></p>
              )}
            </div>
          </div>

{/* review */}
{selectedProduct.reviews.map((rev, index) => (
  <div key={index} className='mt-2 border p-4 rounded shadow-sm'>
    <div className='flex items-center justify-between mb-1'>
      <span className='font-semibold'>{rev.name}</span>
      <div className='flex items-center gap-2'>
        <span className='text-sm text-gray-500'>
          {moment(rev.createdAt).format("MMM D, YYYY")}
        </span>
        {user?.role === "admin" && (
          <button
        onClick={() => handleDeleteReview(rev._id)}
         className='text-red-500 text-lg hover:text-red-700'
       title="Delete Review"
     >
     &times;
    </button>

        )}
      </div>
    </div>
    <div className='flex gap-1 mb-2'>
      {[...Array(5)].map((_, i) => (
        <FaStar
          key={i}
          className={`text-sm ${i < rev.rating ? "text-yellow-400" : "text-gray-300"}`}
        />
      ))}
    </div>
    <p className='text-gray-700'>{rev.comment}</p>
  </div>
))}



          {/* Similar Products */}
          <div className='mt-20'>
            <h2 className='text-2xl text-center font-medium mb-4'>You May Also Like</h2>
            <ProductGrid products={similarProducts} loading={loading} error={error} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
