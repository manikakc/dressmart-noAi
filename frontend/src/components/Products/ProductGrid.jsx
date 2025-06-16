import React from 'react';
import { Link } from 'react-router-dom';

const ProductGrid = ({ products, loading, error }) => {
  if(loading){
    return <p>loading..</p>
  }
  if(error){
    return <p>Error: {error}</p>
  }
  return (
    
     
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4 py-6">
      {products.map((product, index) => (
        <Link key={index} to={`/product/${product._id}`} className="block transition-transform transform hover:scale-105">
          <div className="shadow-md rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="w-full h-full overflow-hidden">
              <img
                src={product.images[0]?.url}
                alt={product.images[0]?.altText || product.name}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-medium text-black mb-1 truncate">{product.name}</h3>
              <p className="text-black-100 font-semibold">${product.price}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ProductGrid;
