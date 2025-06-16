import React, { useEffect ,useRef, useState } from 'react'
import {FaFilter} from "react-icons/fa";
import FilterSidebar from '../components/Products/FilterSidebar';
import SortOptions from '../components/Products/SortOptions';
import ProductGrid from '../components/Products/ProductGrid';
import { useParams, useSearchParams } from 'react-router-dom';
import {useDispatch, useSelector} from "react-redux";
import {fetchProductsByFilters} from "../redux/slices/productsSlice";

const CollectionPage = () => {
  const {collection} = useParams();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const {products, loading, error} = useSelector((state) => state.products);
  const queryParams = Object.fromEntries([...searchParams]);

    const sidebarRef = useRef(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    // const [products, setProducts] = useState([]);

    useEffect(() => {
      dispatch(fetchProductsByFilters({ collection, ...queryParams}));
    }, [dispatch, collection, searchParams]);

    const toggleSidebar =() => {
    setIsSidebarOpen(!isSidebarOpen);
    };

         const handleClickOutside =(e) => {
      //close sidebar if clicked outside
      if(sidebarRef.current && !sidebarRef.current.contains(e.target)
        &&
         window.innerWidth < 1024 ){
        setIsSidebarOpen(false);
      }
  
     }
   useEffect(() => {
  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);


 return (
    <div className='min-h-screen flex flex-col lg:flex-row'>
      {/* Mobile filter toggle */}
      <div className='lg:hidden flex justify-end p-4'>
        <button
          onClick={toggleSidebar}
          className='flex items-center gap-2 bg-gray-100 border border-gray-300 px-4 py-2 rounded-md text-gray-700 shadow-sm hover:bg-gray-200 transition'
        >
          <FaFilter /> Filters
        </button>
      </div>

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`
          fixed inset-y-0 left-0 z-40 w-72 bg-white shadow-lg overflow-y-auto
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:shadow-none lg:w-64
        `}
      >
        <FilterSidebar />
      </div>

      {/* Main Content */}
      <div className='flex-1 p-4'>
        <h2 className='text-2xl font-bold uppercase mb-4'>All Collections</h2>

        {/* Sorting Options */}
        <div className='mb-4'>
          <SortOptions />
        </div>

        {/* Product Grid */}
        <ProductGrid products={products} loading={loading} error={error} />
      </div>
    </div>
  );

};

export default CollectionPage
