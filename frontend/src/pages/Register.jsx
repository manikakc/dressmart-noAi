import React, { useEffect, useState } from 'react'
import { registerUser } from "../redux/slices/authSlice";
import { Link, useLocation, useNavigate} from 'react-router-dom';
import {mergeCart}  from "../redux/slices/cartSlice";
import { useDispatch, useSelector } from 'react-redux';



const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState(""); 
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { user, guestId} = useSelector((state) => state.auth);
    const {cart} = useSelector((state) => state.cart);

    const redirect = new URLSearchParams(location.search).get("redirect") || "/";
    const isCheckoutRedirect = redirect.includes("checkout");

    useEffect(() =>{
        if(user) {
            if( cart?.products.length > 0 && guestId){
                dispatch(mergeCart({guestId, user})).then(() => {
                    navigate(isCheckoutRedirect ? "/checkout" : "/");
                });
            } else {
                navigate(isCheckoutRedirect ? "/checkout" : "/")
            }
        }
    }, [ user, guestId, cart, navigate, isCheckoutRedirect, dispatch]);

        const handleSubmit = (e) => {
          e.preventDefault();
           dispatch(registerUser({ name, email, password }));
        }


  return (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
       <div className="w-full sm:w-96 bg-white p-10 rounded-lg shadow-lg">
                <form 
                 onSubmit={handleSubmit}
                 className="space-y-6">
                    <h2 className="text-center text-2xl font-semibold text-gray-700">
                        Create Your Account
                    </h2>
          <div className='mb-4 '>
            <label className="block text-sm font-semibold mb-2">Name</label>
            <input 
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className='w-full p-2 border rounded'
            placeholder='Enter your name' />
        </div>
        {/* <div className='mb-4'>
            <label className="block text-sm font-semibold mb-2">Address</label>
            <input 
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className='w-full p-2 border rounded'
            placeholder='Enter your address' />
        </div>
        <div className='mb-4'>
            <label className="block text-sm font-semibold mb-2">Phone no</label>
            <input 
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className='w-full p-2 border rounded'
            placeholder='Enter your phone number' />
        </div> */}
        <div className='mb-4'>
            <label className="block text-sm font-semibold mb-2">Email</label>
            <input 
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='w-full p-2 border rounded'
            placeholder='Enter your email address' />
        </div>
        <div className='mb-4'>
            <label className="block text-sm font-semibold mb-2">Password</label>
            <input 
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='w-full p-2 border rounded'
            placeholder='Enter your password' />
        </div>
        <button type='submit' className='w-full bg-black text-white p-2 mt-3 rounded-lg font-semibold hover:bg-gray-800 transition'>
            Sign Up
        </button>
        <p className='mt-6 text-center text-sm'>
            Already have an account?{" "}
            <Link to={`/login?redirect=${encodeURIComponent(redirect)}`}
            className="text-blue-600
            ">Login</Link>
        </p>
      </form>

      </div>
    </div>
  )
}

export default Register
