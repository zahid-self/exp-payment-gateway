'use client';
import React, { useState } from 'react';
import { insertUser } from "../../actions"
import { OAuthButton, useStackApp } from "@stackframe/stack"

const SignUpForm = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [repeatPasswordVisible, setRepeatPasswordVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const app = useStackApp();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleRepeatPasswordVisibility = () => {
    setRepeatPasswordVisible(!repeatPasswordVisible);
  };
  const onSubmit = async () => {
    if (!password) {
      setError('Please enter your password');
      return;
    }
    const errorCode = await app.signUpWithCredential({ email, password });
    await insertUser({ email, password });

    if (errorCode) {
      setError(errorCode.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-2 text-center">Create a new account</h2>
        <p className="text-center mb-6">
          Already have an account? <a href="/signin" className="text-blue-500">Sign in</a>
        </p>

        <div className="flex items-center mb-4">
          <div className="flex-grow h-px bg-gray-300"></div>
          <span className="px-3 text-gray-500">Or continue with</span>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
          {error}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4 relative">
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type={passwordVisible ? 'text' : 'password'}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-10 text-gray-500"
            >
              {passwordVisible ? '🙈' : '👁️'}
            </button>
          </div>
          <div className="mb-6 relative">
            <label className="block text-gray-700 mb-2">Repeat Password</label>
            <input
              type={repeatPasswordVisible ? 'text' : 'password'}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Repeat Password"
            />
            <button
              type="button"
              onClick={toggleRepeatPasswordVisibility}
              className="absolute right-3 top-10 text-gray-500"
            >
              {repeatPasswordVisible ? '🙈' : '👁️'}
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-[#111] text-white py-2 px-4 rounded-lg hover:bg-[#2B2B2B] focus:outline-none focus:ring-2 focus:ring-[#2B2B2B"
          >
            Sign Up
          </button>
          <p className='flex felx-col justify-center py-2'>OR</p>
          <div className='w-full my-2 flex justify-center'>
            <OAuthButton provider='github' type='sign-up' />
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpForm;
