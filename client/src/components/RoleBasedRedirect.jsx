// A new component to handle the redirection
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner'; // Your loading component

const RoleBasedRedirect = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && user) {
            if (user.role === 'SUPER_ADMIN') {
                navigate('/super-admin/dashboard', { replace: true });
            } else if (user.role === 'ADMIN') {
                navigate('/admin/dashboard', { replace: true });
            } else if (user.role === 'WARD_OFFICER') {
                navigate('/ward-officer/dashboard', { replace: true });
            }
        }
    }, [user, loading, navigate]);

    if (loading) {
        return <LoadingSpinner />;
    }

    return null;
};
export default RoleBasedRedirect