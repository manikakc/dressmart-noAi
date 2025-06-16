import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {deleteProduct, fetchAdminProducts} from "../../redux/slices/adminProductSlice";


const ProductManagement = () => {
  const dispatch = useDispatch();
   const { 
    products, loading, error} = useSelector((state) => state.adminProducts);

     useEffect(() => {
         dispatch(fetchAdminProducts());
     }, [dispatch]);


  const handleDelete = (id) => {
    if(window.confirm("Are you sure to delete this user")){
      dispatch(deleteProduct(id));
        }
  };
  if(loading) return <p>Loading</p>
  if(error) return <p>Error: {error}</p>


  return (
    <div className='max-w-7xl mx-auto p-6'>
      <h2 className='text-3xl font-bold mb-6'>Product Management</h2>
              <Link
          to="/admin/products/create"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create Product
        </Link>
      <div className='overflow-x-auto shadow-md sm:rounded-lg'>
        <table className='min-w-full text-left text-gray-500'>
          <thead className='bg-gray-100 text-x uppercase text-gray-700'>
            <tr>
              <th className='py-3 px-4'>Name</th>
              <th className='py-3 px-4'>Price</th>
              {/* <th className='py-3 px-4'>SKU</th> */}
              <th className='py-3 px-4'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product) => (
                <tr
                  key={product._id}
                  className='border-b hover:bg-gray-50 cursor-pointer'
                >
                  <td className='p-4 font-medium text-gray-900 whitespace-nowrap'>
                    {product.name}
                  </td>
                  <td className='p-4'>${product.price}</td>
                  {/* <td className='p-4'>${product.sku}</td> */}
                  <td className='p-4'>
                    <Link
                      to={`/admin/products/${product._id}/edit`}
                      className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-600"
                    >
                      Edit
                    </Link>
                    <button 
                    onClick={() => handleDelete(product._id)}
                    className='bg-red-500 text-white px-4 py-2 rounded mr-2 hover:bg-red-600'
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-500">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductManagement;
