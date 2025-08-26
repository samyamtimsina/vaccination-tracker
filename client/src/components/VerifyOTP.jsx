import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosClient from '../api/axiosClient';

import { useAuth } from '../context/AuthContext';


// To make this a self-contained example, we'll mock the axiosClient.
// In a real application, you would import this from '../api/axiosClient'.

export default function VerifyOTP() {
    const navigate = useNavigate();
    const { setUser } = useAuth();

    const [otpCode, setOtpCode] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const location = useLocation();

    // Get the userId from the state passed by the login page
    const userId = location.state?.userId;

    // If userId is not available in the state, redirect back to login
    // This prevents users from directly accessing this page without a pending account
    useEffect(() => {
        if (!userId) {
            navigate('/login', { replace: true });
        }
    }, [userId, navigate]);

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (!/^\d{6}$/.test(otpCode)) {
            toast.error('Please enter a valid 6-digit OTP.');
            return;
        }


        try {
            // Make the API call to your backend verification endpoint
            const response = await axiosClient.post('/api/auth/verify-otp', {
                userId,
                otpCode: otpCode,
            });

            // On successful verification, the backend returns tokens
            if (response.status === 200) {
                console.log('response.data', response.data)
                setUser(response.data.user);
                navigate('/dashboard', { replace: true });
            }
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || 'Verification failed...');

        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                className="!top-16 sm:!top-4"
                toastClassName="!text-sm"
            />
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full">
                    <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Verify Your Account</h2>
                    <p className="text-center text-gray-500 mb-6 text-sm">
                        A 6-digit code has been sent to your registered phone number.
                        <br />
                        (For this demo, use "123456")
                    </p>
                    <form onSubmit={handleOtpSubmit} className="space-y-4">
                        <div>
                            <input
                                type="text"
                                value={otpCode}
                                onChange={(e) => setOtpCode(e.target.value)}
                                placeholder="Enter OTP code"
                                maxLength="6"
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-center text-lg tracking-widest font-mono"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-sky-600 text-white py-3 rounded-xl font-semibold hover:bg-sky-700 transition duration-300 transform active:scale-95"
                        >
                            {isSubmitting ? 'Verifying...' : 'Verify & Activate'}
                        </button>
                    </form>
                    {/* You can add a resend OTP button here if needed */}
                </div>
            </div>
        </>
    );
}
