import { useState, useEffect } from 'react';
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
  const { setUser, setIsLoggedIn } = useAppContext();

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: '',
  });

  const [error, setError] = useState('');

  // 🔥 Auto-fill credentials on page load
  useEffect(() => {
    const remembered = localStorage.getItem('rememberedCredentials');
    if (remembered) {
      setFormData(JSON.parse(remembered));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.emailOrPhone || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    // 🔥 Always fetch latest users from localStorage
    const storedUsers =
      JSON.parse(localStorage.getItem('registeredUsers') || '[]');

    const user = storedUsers.find(
      (u: any) =>
        (u.email === formData.emailOrPhone ||
          u.phone === formData.emailOrPhone) &&
        u.password === formData.password
    );

    if (user) {

      // Save logged in user
      localStorage.setItem('loggedInUser', JSON.stringify(user));

      // Save credentials only if rememberMe is checked
      if (rememberMe) {
        localStorage.setItem(
          'rememberedCredentials',
          JSON.stringify(formData)
        );
      } else {
        localStorage.removeItem('rememberedCredentials');
      }

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

          <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto">

            {/* Email / Phone */}
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

            {/* Password */}
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

            {/* Remember Me */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              <span className="text-sm text-[#64748b]">
                Remember Me
              </span>
            </div>

            {/* Submit */}
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