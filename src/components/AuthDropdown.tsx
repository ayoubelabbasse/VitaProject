'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  User, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Shield, 
  Sparkles,
  X,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface AuthDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthMode = 'login' | 'signup' | 'forgot';

const AuthDropdown = ({ isOpen, onClose }: AuthDropdownProps) => {
  const { t } = useTranslation();
  const [mode, setMode] = useState<AuthMode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    agreeToTerms: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = t('auth.emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('auth.emailInvalid');
    }

    if (mode !== 'forgot') {
      if (!formData.password) {
        newErrors.password = t('auth.passwordRequired');
      } else if (formData.password.length < 6) {
        newErrors.password = t('auth.passwordMinLength');
      }
    }

    if (mode === 'signup') {
      if (!formData.firstName) {
        newErrors.firstName = t('auth.firstNameRequired');
      }
      if (!formData.lastName) {
        newErrors.lastName = t('auth.lastNameRequired');
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = t('auth.passwordsDoNotMatch');
      }
      if (!formData.agreeToTerms) {
        newErrors.agreeToTerms = t('auth.agreeToTermsRequired');
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    
    // For demo purposes, show success and close
    onClose();
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      agreeToTerms: false
    });
  };

  const renderLoginForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-charcoal mb-2">
          {t('auth.email')}
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-charcoal/50" />
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-herbal-green focus:border-transparent transition-all duration-200 ${
              errors.email ? 'border-red-500' : 'border-clay-beige'
            }`}
            placeholder={t('auth.emailPlaceholder')}
          />
          {errors.email && (
            <div className="flex items-center mt-1 text-red-500 text-xs">
              <AlertCircle className="w-3 h-3 mr-1" />
              {errors.email}
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-charcoal mb-2">
          {t('auth.password')}
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-charcoal/50" />
          <input
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-herbal-green focus:border-transparent transition-all duration-200 ${
              errors.password ? 'border-red-500' : 'border-clay-beige'
            }`}
            placeholder={t('auth.passwordPlaceholder')}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-charcoal/50 hover:text-charcoal"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          {errors.password && (
            <div className="flex items-center mt-1 text-red-500 text-xs">
              <AlertCircle className="w-3 h-3 mr-1" />
              {errors.password}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center">
          <input
            type="checkbox"
            className="mr-2 text-herbal-green focus:ring-herbal-green"
          />
          <span className="text-sm text-charcoal/70">{t('auth.rememberMe')}</span>
        </label>
        <button
          type="button"
          onClick={() => setMode('forgot')}
          className="text-sm text-herbal-green hover:text-deep-olive transition-colors duration-200"
        >
          {t('auth.forgotPassword')}
        </button>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-herbal-green to-deep-olive text-white py-3 rounded-xl font-medium hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            <span>{t('auth.signIn')}</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>

      <div className="text-center">
        <span className="text-sm text-charcoal/70">{t('auth.noAccount')}</span>
        <button
          type="button"
          onClick={() => setMode('signup')}
          className="ml-1 text-sm text-herbal-green hover:text-deep-olive font-medium transition-colors duration-200"
        >
          {t('auth.signUp')}
        </button>
      </div>
    </form>
  );

  const renderSignupForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-charcoal mb-2">
            {t('auth.firstName')}
          </label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-herbal-green focus:border-transparent transition-all duration-200 ${
              errors.firstName ? 'border-red-500' : 'border-clay-beige'
            }`}
            placeholder={t('auth.firstNamePlaceholder')}
          />
          {errors.firstName && (
            <div className="flex items-center mt-1 text-red-500 text-xs">
              <AlertCircle className="w-3 h-3 mr-1" />
              {errors.firstName}
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-charcoal mb-2">
            {t('auth.lastName')}
          </label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-herbal-green focus:border-transparent transition-all duration-200 ${
              errors.lastName ? 'border-red-500' : 'border-clay-beige'
            }`}
            placeholder={t('auth.lastNamePlaceholder')}
          />
          {errors.lastName && (
            <div className="flex items-center mt-1 text-red-500 text-xs">
              <AlertCircle className="w-3 h-3 mr-1" />
              {errors.lastName}
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-charcoal mb-2">
          {t('auth.email')}
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-charcoal/50" />
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-herbal-green focus:border-transparent transition-all duration-200 ${
              errors.email ? 'border-red-500' : 'border-clay-beige'
            }`}
            placeholder={t('auth.emailPlaceholder')}
          />
          {errors.email && (
            <div className="flex items-center mt-1 text-red-500 text-xs">
              <AlertCircle className="w-3 h-3 mr-1" />
              {errors.email}
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-charcoal mb-2">
          {t('auth.password')}
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-charcoal/50" />
          <input
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-herbal-green focus:border-transparent transition-all duration-200 ${
              errors.password ? 'border-red-500' : 'border-clay-beige'
            }`}
            placeholder={t('auth.passwordPlaceholder')}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-charcoal/50 hover:text-charcoal"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          {errors.password && (
            <div className="flex items-center mt-1 text-red-500 text-xs">
              <AlertCircle className="w-3 h-3 mr-1" />
              {errors.password}
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-charcoal mb-2">
          {t('auth.confirmPassword')}
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-charcoal/50" />
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-herbal-green focus:border-transparent transition-all duration-200 ${
              errors.confirmPassword ? 'border-red-500' : 'border-clay-beige'
            }`}
            placeholder={t('auth.confirmPasswordPlaceholder')}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-charcoal/50 hover:text-charcoal"
          >
            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          {errors.confirmPassword && (
            <div className="flex items-center mt-1 text-red-500 text-xs">
              <AlertCircle className="w-3 h-3 mr-1" />
              {errors.confirmPassword}
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="flex items-start">
          <input
            type="checkbox"
            checked={formData.agreeToTerms}
            onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
            className="mr-2 mt-1 text-herbal-green focus:ring-herbal-green"
          />
          <span className="text-sm text-charcoal/70">
            {t('auth.agreeToTerms')} <a href="/terms" className="text-herbal-green hover:text-deep-olive">{t('auth.termsOfService')}</a> {t('auth.and')} <a href="/privacy" className="text-herbal-green hover:text-deep-olive">{t('auth.privacyPolicy')}</a>
          </span>
        </label>
        {errors.agreeToTerms && (
          <div className="flex items-center mt-1 text-red-500 text-xs">
            <AlertCircle className="w-3 h-3 mr-1" />
            {errors.agreeToTerms}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-herbal-green to-deep-olive text-white py-3 rounded-xl font-medium hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            <span>{t('auth.createAccount')}</span>
          </>
        )}
      </button>

      <div className="text-center">
        <span className="text-sm text-charcoal/70">{t('auth.haveAccount')}</span>
        <button
          type="button"
          onClick={() => setMode('login')}
          className="ml-1 text-sm text-herbal-green hover:text-deep-olive font-medium transition-colors duration-200"
        >
          {t('auth.signIn')}
        </button>
      </div>
    </form>
  );

  const renderForgotForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-center mb-6">
        <Shield className="w-12 h-12 text-herbal-green mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-charcoal">{t('auth.forgotPasswordTitle')}</h3>
        <p className="text-sm text-charcoal/70 mt-2">{t('auth.forgotPasswordDescription')}</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-charcoal mb-2">
          {t('auth.email')}
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-charcoal/50" />
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-herbal-green focus:border-transparent transition-all duration-200 ${
              errors.email ? 'border-red-500' : 'border-clay-beige'
            }`}
            placeholder={t('auth.emailPlaceholder')}
          />
          {errors.email && (
            <div className="flex items-center mt-1 text-red-500 text-xs">
              <AlertCircle className="w-3 h-3 mr-1" />
              {errors.email}
            </div>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-herbal-green to-deep-olive text-white py-3 rounded-xl font-medium hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            <span>{t('auth.sendResetLink')}</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>

      <div className="text-center">
        <button
          type="button"
          onClick={() => setMode('login')}
          className="text-sm text-herbal-green hover:text-deep-olive font-medium transition-colors duration-200"
        >
          {t('auth.backToSignIn')}
        </button>
      </div>
    </form>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={dropdownRef}
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="absolute right-0 top-full mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-clay-beige overflow-hidden z-50"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-herbal-green to-deep-olive text-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span className="font-semibold">
                  {mode === 'login' && t('auth.signIn')}
                  {mode === 'signup' && t('auth.createAccount')}
                  {mode === 'forgot' && t('auth.forgotPassword')}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-white/20 transition-colors duration-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="p-6">
            {mode === 'login' && renderLoginForm()}
            {mode === 'signup' && renderSignupForm()}
            {mode === 'forgot' && renderForgotForm()}
          </div>

          {/* Footer */}
          <div className="bg-clay-beige/30 p-4 text-center">
            <div className="flex items-center justify-center space-x-2 text-sm text-charcoal/70">
              <Shield className="w-4 h-4 text-herbal-green" />
              <span>{t('auth.secureConnection')}</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthDropdown; 