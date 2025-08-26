import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axiosClient from '../api/axiosClient';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import 'react-toastify/dist/ReactToastify.css';

export default function Login() {
  const { t } = useTranslation('login');
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();
  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  const onSubmit = async (data) => {
    try {
      const response = await login(data.email, data.password);
      console.log('Login response:', response);

      switch (response?.status) {
        case 'PENDING':

          console.log('verify opt should be called');
          navigate('/verify-otp', { state: { userId: response.userId } });
          break;

        case 'ACTIVE':
          toast.success(t('toast.success'));
          navigate('/dashboard');
          break;

        default:
          toast.error(t('toast.error'));
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || t('toast.error'));
    }
  };

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'ne' : 'en');
  };

  const features = t('hero.features', { returnObjects: true });

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        className="!top-16 sm:!top-4"
        toastClassName="!text-sm"
      />
      <div className="min-h-screen bg-base-100 flex items-center justify-center p-2 sm:p-4 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-base-100 to-secondary/20"></div>
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)`,
              backgroundSize: '30px 30px',
            }}
          ></div>
        </div>

        {/* Floating Orbs - Adjusted for mobile */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-32 sm:w-72 h-32 sm:h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 w-48 sm:w-96 h-48 sm:h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: '1s' }}
          ></div>
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 sm:w-64 h-32 sm:h-64 bg-accent/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: '0.5s' }}
          ></div>
        </div>

        {/* Theme and Language Toggle Buttons */}
        <div className="fixed top-4 right-4 z-50 flex flex-col sm:flex-row gap-2 sm:gap-3">
          {/* Homepage Button */}
          <button
            onClick={() => navigate('/')}
            className="group relative overflow-hidden bg-base-100/80 hover:bg-base-100 backdrop-blur-xl border border-base-300/50 hover:border-primary/30 rounded-2xl px-4 py-2.5 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center gap-2">
              <svg className="w-4 h-4 text-base-content/70 group-hover:text-primary transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-sm font-medium text-base-content group-hover:text-primary transition-colors duration-300">
                Home
              </span>
            </div>
          </button>

          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="group relative overflow-hidden bg-base-100/80 hover:bg-base-100 backdrop-blur-xl border border-base-300/50 hover:border-primary/30 rounded-2xl w-12 h-12 sm:w-auto sm:h-auto sm:px-4 sm:py-2.5 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 flex items-center justify-center"
            title={t(`language_toggle.${i18n.language === 'en' ? 'ne' : 'en'}`)}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center gap-2">
              <svg className="w-4 h-4 text-base-content/70 group-hover:text-primary transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
              <span className="text-sm font-bold text-base-content group-hover:text-primary transition-colors duration-300 hidden sm:inline">
                {i18n.language === 'en' ? 'नेपाली' : 'English'}
              </span>
              <span className="text-sm font-bold text-base-content group-hover:text-primary transition-colors duration-300 sm:hidden">
                {i18n.language === 'en' ? 'ने' : 'EN'}
              </span>
            </div>
          </button>

          {/* Theme Toggle */}
          <label className="group relative overflow-hidden bg-base-100/80 hover:bg-base-100 backdrop-blur-xl border border-base-300/50 hover:border-primary/30 rounded-2xl w-12 h-12 sm:w-auto sm:h-auto sm:px-4 sm:py-2.5 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 flex items-center justify-center cursor-pointer">
            <input
              type="checkbox"
              onChange={toggleTheme}
              checked={theme === 'light'}
              className="sr-only"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center gap-2">
              {/* Sun Icon (Light Mode) */}
              <svg
                className={`w-4 h-4 transition-all duration-300 ${theme === 'light' ? 'text-primary opacity-100 rotate-0' : 'text-base-content/70 opacity-0 rotate-180 absolute'} group-hover:text-primary`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="5"></circle>
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path>
              </svg>

              {/* Moon Icon (Dark Mode) */}
              <svg
                className={`w-4 h-4 transition-all duration-300 ${theme === 'dark' ? 'text-primary opacity-100 rotate-0' : 'text-base-content/70 opacity-0 -rotate-180 absolute'} group-hover:text-primary`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"></path>
              </svg>

              <span className="text-sm font-medium text-base-content group-hover:text-primary transition-colors duration-300 hidden sm:inline">
                {theme === 'light' ? 'Light' : 'Dark'}
              </span>
            </div>
          </label>
        </div>

        <div className="w-full max-w-7xl relative z-10 mx-auto">
          <div className="bg-base-200/50 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-base-300/50 overflow-hidden mx-2 sm:mx-0">
            <div className="flex flex-col lg:grid lg:grid-cols-2 min-h-[600px] lg:min-h-[700px]">
              {/* Right Section - Form (Displayed first on mobile) */}
              <div className="p-6 sm:p-8 lg:p-12 bg-base-100/50 backdrop-blur-sm order-1 lg:order-2 flex items-center justify-center">
                <div className="w-full max-w-sm mx-auto">
                  <div className="text-center mb-8 lg:mb-10">
                    <h2 className="text-2xl sm:text-3xl font-bold text-base-content mb-2">
                      {t('title')}
                    </h2>
                    <p className="text-base-content/70 text-sm sm:text-base">{t('subtitle')}</p>
                  </div>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 sm:space-y-6">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-sm sm:text-base">{t('email_label')}</span>
                      </label>
                      <div className="relative">
                        <input
                          {...register('email')}
                          id="email"
                          type="email"
                          required
                          className="input input-bordered w-full pl-10 h-12 sm:h-auto text-base"
                          placeholder={t('email_placeholder')}
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg
                            className="h-5 w-5 text-gray-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-sm sm:text-base">{t('password_label')}</span>
                      </label>
                      <div className="relative">
                        <input
                          {...register('password')}
                          id="password"
                          type="password"
                          required
                          className="input input-bordered w-full pl-10 h-12 sm:h-auto text-base"
                          placeholder={t('password_placeholder')}
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg
                            className="h-5 w-5 text-gray-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn btn-primary w-full h-12 sm:h-auto text-base font-medium"
                    >
                      {isSubmitting && (
                        <span className="loading loading-spinner"></span>
                      )}
                      {isSubmitting ? t('signing_in') : t('sign_in')}
                    </button>
                  </form>
                </div>
              </div>

              {/* Left Section - Hero (Displayed after form on mobile) */}
              <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 p-6 sm:p-8 lg:p-12 flex flex-col justify-center text-white overflow-hidden order-2 lg:order-1 min-h-[400px] sm:min-h-[500px] lg:min-h-auto">
                {/* Background pattern - Adjusted for mobile */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-20 sm:w-32 h-20 sm:h-32 bg-white rounded-full blur-3xl"></div>
                  <div className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 w-32 sm:w-48 h-32 sm:h-48 bg-cyan-300 rounded-full blur-3xl"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 sm:w-64 h-40 sm:h-64 bg-purple-300 rounded-full blur-3xl"></div>
                </div>

                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl mb-6 sm:mb-8">
                    <svg
                      className="w-6 h-6 sm:w-8 sm:h-8"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 2C5.58 2 2 5.58 2 10s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm3.707 6.293a1 1 0 00-1.414-1.414L9 10.172 7.707 8.879a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>

                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 leading-tight">
                    {t('hero.title')}
                  </h1>

                  <p className="text-blue-100 text-base sm:text-lg mb-8 sm:mb-10 leading-relaxed">
                    {t('hero.description')}
                  </p>

                  <div className="space-y-4 sm:space-y-6">
                    {Array.isArray(features) ? (
                      features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-3 sm:gap-4">
                          <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-sm rounded-lg sm:rounded-xl flex items-center justify-center">
                            <svg
                              className="w-4 h-4 sm:w-5 sm:h-5"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              {index === 0 && (
                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              )}
                              {index === 1 && (
                                <path
                                  fillRule="evenodd"
                                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 howern0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                                  clipRule="evenodd"
                                />
                              )}
                              {index === 2 && (
                                <path
                                  fillRule="evenodd"
                                  d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              )}
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-semibold mb-1 text-sm sm:text-base">{feature.title}</h3>
                            <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">{feature.description}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-red-300 text-sm">Features not available</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}