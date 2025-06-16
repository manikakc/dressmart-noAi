import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {fetchProductDetails, updateProduct} from "../../redux/slices/productsSlice"
import axios from "axios";

 
   const EditProductPage = () => {
     const dispatch = useDispatch();
     const navigate = useNavigate();
     const { id} = useParams();
     const {selectedProduct, loading, error } = useSelector((state) => state.products);

   const [productData, setProductData] = useState({
        name:"",
        description: "",
        originalprice: 0,
        price: 0,
        countInStock: 0,
        sku: "",
        category: "",
        brand: "",
        sizes: [],
        colors: [],
        collections: "",
        materials: "",
        images: [],
    });

    const [uploading, setUploading ]= useState(false);

    useEffect(() => {
        if(id) {
            dispatch(fetchProductDetails(id));
        }
    }, [dispatch, id]);

    useEffect(() => {
        if(selectedProduct){
            setProductData(selectedProduct);
        }
    }, [selectedProduct]);

     const handleChange = (e) => {
        const { name ,value} = e.target;
        setProductData((prevData) => ({
            ...prevData, [name]: value
        }))
    };
    
       const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append("image", file);
        try {
            setUploading(true);
            const {data} = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/upload`,
                formData,
                {
                    headers: {"Content-Type" : "multipart/form-data"}
                }
            );
            setProductData((prevData) => ({
                ...prevData,
                images: [...prevData.images, {url: data.imageUrl, altText: ""}],
            }));
            setUploading(false);
        } catch (error) {
            console.error(error);
            setUploading(false);
        }
       };
       const handleImageDelete = (indexToRemove) => {
  setProductData((prevData) => ({
    ...prevData,
    images: prevData.images.filter((_, index) => index !== indexToRemove),
  }));
};


       const handleSubmit = (e) => {
                e.preventDefault();
                dispatch(updateProduct({id, productData}));
                navigate("/admin/products");
           };
       
           if(loading) return <p>Loading...</p>
           if(error) return <p>Error: {error}</p>
    return (
    <div className='max-w-5xl mx-auto p-6 shadow-md rounded-md'>
        <h2 className='text-3xl font-bold mb-6'>Edit Product</h2>
        <form onSubmit={handleSubmit}>
            <div className='mb-6'>
                <label className="block font-semibold mb-2">Product Name</label>
                <input 
                type="text"
                name='name'
                value={productData.name}
                onChange={handleChange}
                className='w-full border border-gray-300 rounded-md p-2'
                required />
            </div>

            <div className='mb-6'>
                <label className="block font-semibold mb-2">Description</label>
                <textarea
                name='description'
                value={productData.description}
                onChange={handleChange}
                className='w-full border border-gray-300 rounded-md p-2'
                rows={5}
                required />
            </div>

            <div className='mb-6'>
                <label className="block font-semibold mb-2">Price</label>
                <input 
                type="number"
                name='price'
                value={productData.price}
                onChange={handleChange}
                className='w-full border border-gray-300 rounded-md p-2'
                />
            </div>

            <div className='mb-6'>
                <label className="block font-semibold mb-2">Count in Stock</label>
                <input 
                type="number"
                name='countInStock'
                value={productData.countInStock}
                onChange={handleChange}
                className='w-full border border-gray-300 rounded-md p-2'
                 />
            </div>
             <div className='mb-6'>
                <label className="block font-semibold mb-2">SKU</label>
                <input 
                type="text"
                name='sku'
                value={productData.sku}
                onChange={handleChange}
                className='w-full border border-gray-300 rounded-md p-2'
                 />
            </div>


            <div className='mb-6'>
                <label className="block font-semibold mb-2">Sizes (comma-seperated)</label>
                <input 
                type="text"
                name='sizes'
                value={productData.sizes.join(",")}
                onChange={(e) =>
                    setProductData({
                        ...productData,
                        sizes: e.target.value.split(",").map((size) => size.trim()),
                    })
                }
                className='w-full border border-gray-300 rounded-md p-2'
                 />
            </div>

            <div className='mb-6'>
                <label className="block font-semibold mb-2">Colors (comma-seperated)</label>
                <input 
                type="text"
                name='colors'
                value={productData.colors.join(",")}
                onChange={(e) =>
                    setProductData({
                        ...productData,
                        colors: e.target.value.split(",").map((color) => color.trim()),
                    })
                }
                className='w-full border border-gray-300 rounded-md p-2'
                 />
            </div>
                         <div className='mb-6'>
                <label className="block font-semibold mb-2">Category</label>
                <input 
                type="text"
                name='category'
                value={productData.category}
                onChange={handleChange}
                className='w-full border border-gray-300 rounded-md p-2'
                 />
            </div>


              <div className='mb-6'>
                 <label className="block font-semibold mb-2">Upload Image</label>
                 <input 
                 type="file"
                 onChange={handleImageUpload} />
                 {uploading && <p>Uploading...</p>}
                <div className='flex gap-4 mt-4 flex-wrap'>
  {productData.images.map((image, index) => (
    <div key={index} className='relative group'>
      <img
        src={image.url}
        alt={image.altText || "Product Image"}
        className='w-20 h-20 object-cover rounded-md shadow-md'
      />
      <button
        type='button'
        onClick={() => handleImageDelete(index)}
        className='absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold opacity-80 hover:opacity-100'
        title='Remove Image'
      >
        ×
      </button>
    </div>
  ))}
</div>

              </div>
              <button 
              type='submit'
              className='w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition-colors'>
                Update Product
              </button>
      </form>
    </div>
  )
}
export default EditProductPage