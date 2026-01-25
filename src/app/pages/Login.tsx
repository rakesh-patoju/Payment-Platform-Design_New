import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/app/context/AppContext';
import { Logo } from '@/app/components/Logo';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Eye, EyeOff, XCircle } from 'lucide-react';
import { motion } from 'motion/react';

export const Login = () => {
  const navigate = useNavigate();
  const { registeredUsers, setUser, setIsLoggedIn } = useAppContext();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.emailOrPhone || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    const user = registeredUsers.find(
      (u) =>
        (u.email === formData.emailOrPhone ||
          u.phone === formData.emailOrPhone) &&
        u.password === formData.password
    );

    if (user) {
      setUser(user);
      setIsLoggedIn(true);
      navigate('/services');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6
      bg-gradient-to-br from-[#f3f6ff] via-[#eef3ff] to-[#f5f0ff]">

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl"
      >
        <div className="bg-white rounded-3xl shadow-2xl p-12">

          {/* LOGO */}
          <div className="flex justify-center mb-8">
            <div className="scale-[1.4]">
              <Logo />
            </div>
          </div>

          {/* HEADER */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16
              bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                />
              </svg>
            </div>

            <h2 className="text-3xl font-bold text-[#0f172a]">
              Welcome Back
            </h2>
            <p className="mt-2 text-[#64748b]">
              Login to access your payment platform
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
              <XCircle className="text-red-600" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto">

            <div>
              <Label>Email or Phone Number</Label>
              <Input
                placeholder="Enter your email or phone"
                value={formData.emailOrPhone}
                onChange={(e) =>
                  setFormData({ ...formData, emailOrPhone: e.target.value })
                }
                className="bg-[#f2f4f8] py-4"
              />
            </div>

            <div>
              <Label>Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="bg-[#f2f4f8] py-4"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full py-6 text-lg text-white
                bg-gradient-to-r from-[#3b82f6] to-[#a855f7]
                hover:from-[#2563eb] hover:to-[#9333ea]"
            >
              Login
            </Button>
          </form>

          <p className="text-center mt-8 text-sm text-[#64748b]">
            Don't have an account?{' '}
            <span
              onClick={() => navigate('/register')}
              className="text-[#3b82f6] font-medium cursor-pointer"
            >
              Register here
            </span>
          </p>

        </div>
      </motion.div>
    </div>
  );
};
