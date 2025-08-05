import { useForm } from 'react-hook-form';
import axiosClient from '../api/axiosClient';
import { useNavigate, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();
  const navigate = useNavigate();
  const { login } = useAuth();

  const onSubmit = async (data) => {
    try {
      const res = await axiosClient.post('/login', data);
      login(res.data.user, res.data.token);
      toast.success('Login successful');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Invalid credentials');
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
        <div className="card w-full max-w-md bg-base-100 shadow-xl p-8">
          <h2 className="card-title text-3xl font-bold text-center text-base-content mb-6">
            Login
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="form-control">
              <label htmlFor="email" className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                {...register('email')}
                id="email"
                type="email"
                required
                className="input input-bordered w-full"
                placeholder="you@example.com"
              />
            </div>

            <div className="form-control">
              <label htmlFor="password" className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                {...register('password')}
                id="password"
                type="password"
                required
                className="input input-bordered w-full"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary w-full transform transition disabled:opacity-60 hover:scale-105"
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="text-center mt-5 text-sm text-base-content text-opacity-80">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="link link-hover link-primary font-medium"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
