import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DashboardRedirector = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const redirected = useRef(false);

    useEffect(() => {
        // Only run after loading finishes
        if (loading) return;

        // Only redirect once
        if (redirected.current) return;

        redirected.current = true;

        if (user?.role) {
            switch (user.role) {
                case 'SUPER_ADMIN':
                    navigate('/super-admin/dashboard', { replace: true });
                    break;
                case 'ADMIN':
                    navigate('/admin/dashboard', { replace: true });
                    break;
                case 'WARD_OFFICER':
                    navigate('/ward/dashboard', { replace: true });
                    break;
                default:
                    navigate('/', { replace: true });
            }
        } else {
            navigate('/login', { replace: true });
        }
    }, [user, loading, navigate]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
            <p className="text-xl font-medium tracking-wide">Redirecting...</p>
        </div>
    );
};

export default DashboardRedirector;
