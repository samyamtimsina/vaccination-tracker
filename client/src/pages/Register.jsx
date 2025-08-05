import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { toast } from 'react-toastify';
import { FaUser, FaEnvelope, FaLock, FaBuilding } from 'react-icons/fa';

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await axiosClient.post('/register', data);
      toast.success('Registration successful!');
      navigate('/login');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="w-full max-w-md bg-base-100 shadow-xl card rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-base-content mb-6">
          Register
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Full Name Input */}
          <div className="form-control w-full">
            <label htmlFor="name" className="label">
              <span className="label-text">Full Name</span>
            </label>
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary" />
              <input
                {...register('name', { required: true })}
                id="name"
                type="text"
                placeholder="Your full name"
                className="input input-bordered w-full pl-10"
              />
            </div>
          </div>
          {/* Email Input */}
          <div className="form-control w-full">
            <label htmlFor="email" className="label">
              <span className="label-text">Email</span>
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary" />
              <input
                {...register('email', { required: true })}
                id="email"
                type="email"
                placeholder="you@example.com"
                className="input input-bordered w-full pl-10"
              />
            </div>
          </div>
          {/* Password Input */}
          <div className="form-control w-full">
            <label htmlFor="password" className="label">
              <span className="label-text">Password</span>
            </label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary" />
              <input
                {...register('password', { required: true })}
                id="password"
                type="password"
                placeholder="••••••••"
                className="input input-bordered w-full pl-10"
              />
            </div>
          </div>
          {/* Ward ID Input */}
          <div className="form-control w-full">
            <label htmlFor="wardId" className="label">
              <span className="label-text">Ward ID (optional)</span>
            </label>
            <div className="relative">
              <FaBuilding className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary" />
              <input
                {...register('wardId')}
                id="wardId"
                type="number"
                placeholder="Enter ward ID"
                className="input input-bordered w-full pl-10"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary w-full"
          >
            {isSubmitting ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p className="text-center mt-5 text-sm text-base-content text-opacity-70">
          Already signed up?{' '}
          <Link
            to="/login"
            className="text-primary hover:underline font-medium"
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
