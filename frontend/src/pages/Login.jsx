import React, {  useEffect, useState } from 'react'
import { Link, useLocation, useNavigate} from 'react-router-dom';
import { toast } from 'sonner';
import { loginUser } from "../redux/slices/authSlice";
import {mergeCart}  from "../redux/slices/cartSlice";
import { useDispatch, useSelector } from 'react-redux';


const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { user, guestId, error } = useSelector((state) => state.auth);
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

        // Show error toast if login fails
    useEffect(() => {
        if (error) {
            toast.error("Invalid Email or Password"); // Display error from Redux
        }
    }, [error]);

 const handleSubmit = (e) => {
          e.preventDefault();
            dispatch(loginUser({ email, password }));
        };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full sm:w-96 bg-white p-10 rounded-lg shadow-lg">
                <form onSubmit={handleSubmit}
                 className="space-y-6">
                    <h2 className="text-center text-2xl font-semibold text-gray-700">
                        Sign In to Your Account
                    </h2>
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
            Sign In
        </button>
        <p className='mt-6 text-center text-sm'>
            Don't have an account?{" "}
            <Link to={`/register?redirect=${encodeURIComponent(redirect)}`}
            className="text-blue-600
            ">Register</Link>
        </p>
      </form>

      </div>
    </div>
  )
}

export default Login
