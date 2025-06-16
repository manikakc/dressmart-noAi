import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createProduct } from "../../redux/slices/adminProductSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const initialState = {
  name: "",
  description: "",
  price: "",
  discountPrice: "",
  countInStock: "",
  sku: "",
  category: "",
  brand: "",
  sizes: [],
  colors: [],
  collections: "",
  material: "",
  images: [],
};

const CreateProductPage = () => {
  const [formData, setFormData] = useState(initialState);
  const [uploading, setUploading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value.split(",").map((item) => item.trim()),
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const form = new FormData();
    form.append("image", file);
    try {
      setUploading(true);
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/upload`,
        form,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, { url: data.imageUrl, altText: "" }],
      }));
      setUploading(false);
    } catch (err) {
      console.error("Image upload failed", err);
      setUploading(false);
    }
  };

  const handleImageDelete = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleImageAltTextChange = (index, value) => {
    const updated = [...formData.images];
    updated[index].altText = value;
    setFormData((prev) => ({ ...prev, images: updated }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const productData = {
      name: formData.name,
      description: formData.description,
      price: Number(formData.price),
      discountPrice: formData.discountPrice ? Number(formData.discountPrice) : undefined,
      countInStock: Number(formData.countInStock),
      sku: formData.sku,
      category: formData.category,
      brand: formData.brand,
      sizes: formData.sizes,
      colors: formData.colors,
      collections: formData.collections,
      material: formData.material,
      images: formData.images,
    };

    try {
      await dispatch(createProduct(productData)).unwrap();
      navigate("/admin/products");
    } catch (err) {
      console.error("Failed to create product:", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Create New Product</h2>
      <form onSubmit={handleSubmit} className="grid  grid-cols-2 gap-4">
        {[
          "name",
          "description",
          "price",
          "discountPrice",
          "countInStock",
          "sku",
          "category",
          "brand",
          "collections",
          "material",
        ].map((field) => (
          <input
            key={field}
            type={["price", "discountPrice", "countInStock"].includes(field) ? "number" : "text"}
            name={field}
            value={formData[field]}
            onChange={handleChange}
            placeholder={field}
            className="p-2 border rounded"
            required={["name", "description", "price", "countInStock", "sku", "category", "sizes", "colors", "collections"].includes(field)}
          />
        ))}

        <input
          type="text"
          name="sizes"
          placeholder="Sizes (comma separated)"
          value={formData.sizes.join(", ")}
          onChange={(e) => handleArrayChange("sizes", e.target.value)}
          className="p-2 border rounded"
          required
        />

        <input
          type="text"
          name="colors"
          placeholder="Colors (comma separated)"
          value={formData.colors.join(", ")}
          onChange={(e) => handleArrayChange("colors", e.target.value)}
          className="p-2 border rounded"
          required
        />

        <div className="col-span-2">
          <h4 className="font-semibold mb-2">Product Images</h4>
          <input type="file" onChange={handleImageUpload} className="mb-2" />
          {uploading && <p className="text-blue-600">Uploading...</p>}
          <div className="flex flex-wrap gap-4">
            {formData.images.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image.url}
                  alt={image.altText || "Product"}
                  className="w-20 h-20 object-cover rounded shadow"
                />
                <input
                  type="text"
                  placeholder="Alt text"
                  value={image.altText}
                  onChange={(e) => handleImageAltTextChange(index, e.target.value)}
                  className="mt-1 p-1 border text-sm rounded w-full"
                />
                <button
                  type="button"
                  onClick={() => handleImageDelete(index)}
                  className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full px-1.5 hover:bg-red-700"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="col-span-2 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
        >
          Create Product
        </button>
      </form>
    </div>
  );
};

export default CreateProductPage;