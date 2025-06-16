import React, { useEffect } from 'react'
import Hero from '../components/Layout/Hero'
import NewArrivals from '../components/Products/NewArrivals'
import ProductDetails from '../components/Products/ProductDetails'
import ProductGrid from '../components/Products/ProductGrid'
import { useDispatch, useSelector } from "react-redux"
import axios from 'axios';
import {fetchProductsByFilters} from "../redux/slices/productsSlice";
import FeaturedCollections from '../components/Products/FeaturedCollections'



const Home = () => {
  const dispatch = useDispatch();
  const { products, loading, error} = useSelector((state) => state.products);
  // const [bestSellerProduct, setBestSellerProduct] = useState(null);

  useEffect(() => {
    dispatch(fetchProductsByFilters({
      category: "Party Wear",
      limit: 8
    })
  );

  //fetch best seller
  const fetchBestSeller = async () =>{
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/products/best-seller`
      );
      setBestSellerProduct(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  fetchBestSeller(); 
  }, [dispatch]);
  return (
    <div>
      <Hero/>
      <NewArrivals/>
    {/* best seller
      <h2 className='text-3xl text-center font-bold mb-4'>Best Seller</h2>
     {bestSellerProduct ? (<ProductDetails productId={bestSellerProduct._id}/>):(
      <p className='text-center'>Loading...</p>
     )} */}

      <div className='container mx-auto'>
        <h2 className='text-3xl text-center font-bold mb-4'>
          Party Wear
        </h2>
        <ProductGrid products={products} loading={loading} error={error}/>
         <FeaturedCollections/>
      </div>
    </div>
  )
}

export default Home
