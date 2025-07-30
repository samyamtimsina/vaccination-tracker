import axios from '../utils/axios';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { registerSchema } from '../validators/authSchema.js';
import { zodResolver } from '@hookform/resolvers/zod';

export default function Register() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    try {
      const res = await axios.post('/register', data);
      alert('Registered! Please login.');
      navigate('/login');
    } catch (error) {
      alert(error.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md mx-auto p-6 space-y-4 bg-white rounded shadow"
    >
      <h2 className="text-xl font-bold text-center">Register (Ward Officer)</h2>

      <div>
        <input
          type="text"
          placeholder="Full Name"
          className="w-full border p-2"
          {...register('name')}
        />
        {errors.name && (
          <p className="text-red-600 text-sm">{errors.name.message}</p>
        )}
      </div>

      <div>
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2"
          {...register('email')}
        />
        {errors.email && (
          <p className="text-red-600 text-sm">{errors.email.message}</p>
        )}
      </div>

      <div>
        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2"
          {...register('password')}
        />
        {errors.password && (
          <p className="text-red-600 text-sm">{errors.password.message}</p>
        )}
      </div>

      <div>
        <input
          type="number"
          placeholder="Ward ID"
          className="w-full border p-2"
          {...register('wardId')}
        />
        {errors.wardId && (
          <p className="text-red-600 text-sm">{errors.wardId.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 rounded"
      >
        Register
      </button>

      <p className="text-center text-sm">
        Already have an account?{' '}
        <a href="/login" className="text-blue-600 underline">
          Login here
        </a>
      </p>
    </form>
  );
}
