import { useForm } from 'react-hook-form';
import axiosClient from '../api/axiosClient';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext'; // import useAuth

export default function Login() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const { login } = useAuth(); // get login function from context

  const onSubmit = async (data) => {
    try {
      const res = await axiosClient.post('/login', data);
      // Use context login to set user and token state AND update localStorage
      login(res.data.user, res.data.token);
      toast.success('Login successful');
      navigate('/dashboard');
    } catch (err) {
      toast.error('Invalid credentials');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          {...register('email')}
          type="email"
          placeholder="Email"
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          {...register('password')}
          type="password"
          placeholder="Password"
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}
