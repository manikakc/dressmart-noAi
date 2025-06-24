import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HiOutlineUser,
  HiOutlineShoppingBag,
  HiBars3BottomRight,
} from "react-icons/hi2";
import { IoMdClose } from 'react-icons/io';
import { useSelector } from 'react-redux';

import SearchBar from './SearchBar';
import CartDrawer from '../Layout/CartDrawer';

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);
  const { cart } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const cartItemCount =
    cart?.products?.reduce((total, product) => total + product.quantity, 0) || 0;

  const toggleNavDrawer = () => {
    setNavDrawerOpen(!navDrawerOpen);
  };

  const toggleCartDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <>
      <nav className='container mx-auto flex flex-wrap items-center justify-between px-4 py-6'>
        {/* Left logo */}
        <div>
          <Link to="/" className='text-2xl text-amber-800 font-medium'>
            Dressmart
          </Link>
        </div>

        {/* Right side content */}
        <div className='flex items-center space-x-4 md:space-x-6'>

          {/* Center menu links (visible only on md+) */}
          <div className='hidden md:flex space-x-6'>
            <Link to="/" className="text-gray-700 hover:text-black text-m font-semibold uppercase">
              Home
            </Link>
            <Link to="/collections/all" className="text-gray-700 hover:text-black text-m font-semibold uppercase">
              Collections
            </Link>
          </div>

          {/* Admin Button */}
          {user && user.role === "admin" && (
            <Link to="/admin" className='block bg-pink-500 px-2 rounded text-sm text-white'>
              Admin
            </Link>
          )}

          {/* Profile Icon */}
          <Link to="/profile" className='hover:text-black'>
            <HiOutlineUser className='h-6 w-6 text-gray-700' />
          </Link>

          {/* Cart Icon */}
          <button onClick={toggleCartDrawer} className='relative hover:text-black'>
            <HiOutlineShoppingBag className='h-6 w-6 text-gray-700' />
            {cartItemCount > 0 && (
              <span className='absolute -top-1 -right-2 bg-amber-700 text-white text-xs rounded-full px-2 py-0.5'>
                {cartItemCount}
              </span>
            )}
          </button>

          {/* SearchBar on medium and up */}
          <div className='hidden md:block overflow-hidden'>
            <SearchBar />
          </div>

          {/* Hamburger Icon (only on small screens) */}
          <button onClick={toggleNavDrawer} className='md:hidden'>
            <HiBars3BottomRight className='h-6 w-6 text-gray-700' />
          </button>
        </div>
      </nav>

      {/* Cart Drawer */}
      <CartDrawer drawerOpen={drawerOpen} toggleCartDrawer={toggleCartDrawer} />

      {/* Mobile Sidebar Navigation */}
      <div className={`fixed top-0 left-0 w-3/4 sm:w-1/2 md:w-1/3 h-full bg-white shadow-lg transform transition-transform duration-300 z-50 ${
        navDrawerOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className='flex justify-end p-4'>
          <button onClick={toggleNavDrawer}>
            <IoMdClose className="h-6 w-6 text-gray-600" />
          </button>
        </div>
        <div className='p-4'>
          <h2 className='text-xl font-semibold mb-4'>Menu</h2>

          {/* SearchBar inside mobile nav */}
          <div className="mb-4">
            <SearchBar />
          </div>

          <nav className='space-y-4'>
            <Link to="/" onClick={toggleNavDrawer} className='block text-gray-600 hover:text-black'>
              Home
            </Link>
            <Link to="/collections/all" onClick={toggleNavDrawer} className='block text-gray-600 hover:text-black'>
              Collections
            </Link>
            {/* Add more links if needed */}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Navbar;
