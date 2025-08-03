import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

export default function Register() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await axiosClient.post('/register', data);
      alert('Registration successful!');
      navigate('/');
    } catch {
      alert('Registration failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <h2 className="text-2xl font-bold mb-6">Register</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          {...register('name')}
          placeholder="Full Name"
          className="w-full border p-2 rounded"
        />
        <input
          {...register('email')}
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
        />
        <input
          {...register('password')}
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
        />
        <input
          {...register('wardId')}
          type="number"
          placeholder="Ward ID (optional)"
          className="w-full border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded w-full"
        >
          Register
        </button>
      </form>
      <p className="mt-4 text-center">
        Already signed up?{' '}
        <Link to="/" className="text-blue-600 underline">
          Login here
        </Link>
      </p>
    </div>
  );
}
