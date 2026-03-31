import React, { useState } from 'react'
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')

  const navigate = useNavigate();

  async function handleLoginSubmit(e) {
    e.preventDefault()
    const Logindata = { username, password };

    try {
    const response = await axios.post(
      "http://localhost:8000/login",
      Logindata
    );
    navigate("/todolist/" + response.data.user_id);
  } catch (error) {
    console.error('Error during login:', error);
  }
  }

  async function handleSignupSubmit(e) {
    e.preventDefault()
    const Signupdata = { username, password };

    try{
      const response = await axios.post('http://localhost:8000/signup', Signupdata);
      console.log('Signup successful:', response.data);
      // switch to login view so user can log in
      setIsLogin(true);
      // clear password for security
      setPassword('');
      alert('Signup successful — please log in');
    }
    catch (error) {
      console.error('Error during signup:', error);
      const msg = error?.response?.data?.detail || 'Signup failed';
      alert(msg);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-500 to-red-800 flex items-center justify-center font-sans">
      {/* Hero Section */}
      <div className="absolute top-0 left-0 right-0 text-center pt-10 ">
        <h1 className="text-5xl font-bold text-white mb-2">TaskFlow</h1>
        <p className="text-xl text-red-100">Organize your day. Achieve your goals.</p>
      </div>

      {/* Auth Card */}
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-10">
        {/* Toggle Buttons */}
        <div className="flex gap-2 mb-8 border-b-2 border-gray-200">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-3 font-semibold text-lg transition-all border-b-4 ${
              isLogin ? 'text-red-600 border-red-600' : 'text-gray-400 border-transparent hover:text-red-600'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-3 font-semibold text-lg transition-all border-b-4 ${
              !isLogin ? 'text-red-600 border-red-600' : 'text-gray-400 border-transparent hover:text-red-600'
            }`}
          >
            Sign Up
          </button>
        </div>

        {isLogin ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4 flex flex-col">
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              placeholder="User Name"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition"
            />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition"
            />
            <button
              type="submit"
              className="w-full py-3 mt-6 bg-gradient-to-r from-red-600 to-red-800 text-white font-bold rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
            >
              Login
            </button>

            <p className="text-center text-gray-600 mt-4">
              Don't have an account?{' '}
              <button type="button" onClick={() => setIsLogin(false)} className="text-red-600 font-semibold hover:underline">
                Sign Up
              </button>
            </p>
          </form>
        ) : (
          <form onSubmit={handleSignupSubmit} className="space-y-4">
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              placeholder="User Name"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition"
            />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition"
            />
            <button
              type="submit"
              className="w-full py-3 mt-6 bg-gradient-to-r from-red-600 to-red-800 text-white font-bold rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
            >
              Sign Up
            </button>

            <p className="text-center text-gray-600 mt-4">
              Already have an account?{' '}
              <button type="button" onClick={() => setIsLogin(true)} className="text-red-600 font-semibold hover:underline">
                Login
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}

export default Home