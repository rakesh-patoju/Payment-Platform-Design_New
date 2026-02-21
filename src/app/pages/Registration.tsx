import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/app/context/AppContext';
import { Logo } from '@/app/components/Logo';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Eye, EyeOff, CheckCircle2, XCircle } from 'lucide-react';
import { motion } from 'motion/react';

export const Registration = () => {
  const navigate = useNavigate();
  const { registerUser } = useAppContext();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePhone = (phone: string) =>
    /^\d{10}$/.test(phone);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    };

    if (!formData.name.trim())
      newErrors.name = 'Name is required';

    if (!formData.email.trim())
      newErrors.email = 'Email is required';
    else if (!validateEmail(formData.email))
      newErrors.email = 'Please enter a valid email';

    if (!formData.phone.trim())
      newErrors.phone = 'Phone number is required';
    else if (!validatePhone(formData.phone))
      newErrors.phone = 'Enter a valid 10-digit number';

    if (!formData.password)
      newErrors.password = 'Password is required';

    if (!formData.confirmPassword)
      newErrors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';

    // 🔥 Check duplicate user
    const existingUsers =
      JSON.parse(localStorage.getItem('registeredUsers') || '[]');

    const duplicateUser = existingUsers.find(
      (u: any) =>
        u.email === formData.email || u.phone === formData.phone
    );

    if (duplicateUser) {
      newErrors.email = 'Email or phone already registered';
    }

    setErrors(newErrors);

    if (!Object.values(newErrors).some(Boolean)) {

      // Remove confirmPassword before storing
      const { confirmPassword, ...userToStore } = formData;

      const updatedUsers = [...existingUsers, userToStore];

      localStorage.setItem(
        'registeredUsers',
        JSON.stringify(updatedUsers)
      );

      registerUser(userToStore);

      setSuccessMessage(true);

      setTimeout(() => navigate('/login'), 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6
      bg-gradient-to-br from-[#f3f6ff] via-[#eef3ff] to-[#f5f0ff]">

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-6xl"
      >
        <div className="grid md:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl bg-white">

          {/* LEFT PANEL */}
          <div className="flex items-center justify-center bg-[#eef4ff]">
            <Logo className="w-56 h-56" />
          </div>

          {/* RIGHT PANEL */}
          <div className="p-12">
            <h2 className="text-4xl font-extrabold text-[#0f172a]">
              Create Account
            </h2>
            <p className="mt-2 text-[#64748b] text-lg">
              Register to access services
            </p>

            {successMessage && (
              <div className="mt-6 flex gap-3 p-4 border border-green-200 rounded-lg bg-green-50">
                <CheckCircle2 className="text-green-600" />
                <div>
                  <p className="text-green-800 font-medium">
                    Registration successful
                  </p>
                  <p className="text-sm text-green-600">
                    Redirecting to login...
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">

              {[
                { id: 'name', label: 'Full Name', placeholder: 'Enter your full name' },
                { id: 'email', label: 'Email Address', placeholder: 'yourmail@example.com' },
                { id: 'phone', label: 'Phone Number', placeholder: '9876543210' },
              ].map(({ id, label, placeholder }) => (
                <div key={id}>
                  <Label>{label}</Label>
                  <Input
                    value={(formData as any)[id]}
                    onChange={(e) =>
                      setFormData({ ...formData, [id]: e.target.value })
                    }
                    placeholder={placeholder}
                    className="mt-1 bg-[#f2f4f8] border border-[#e5e7eb] py-4"
                  />
                  {(errors as any)[id] && (
                    <p className="text-red-500 text-sm mt-1 flex gap-1">
                      <XCircle className="w-4 h-4" />
                      {(errors as any)[id]}
                    </p>
                  )}
                </div>
              ))}

              {/* PASSWORD */}
              <div>
                <Label>Password</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="mt-1 bg-[#f2f4f8] border border-[#e5e7eb] py-4"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1 flex gap-1">
                    <XCircle className="w-4 h-4" />
                    {errors.password}
                  </p>
                )}
              </div>

              {/* CONFIRM PASSWORD */}
              <div>
                <Label>Confirm Password</Label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Re-enter your password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({ ...formData, confirmPassword: e.target.value })
                    }
                    className="mt-1 bg-[#f2f4f8] border border-[#e5e7eb] py-4"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showConfirmPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1 flex gap-1">
                    <XCircle className="w-4 h-4" />
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full py-5 text-lg text-white
                  bg-gradient-to-r from-[#3b82f6] to-[#a855f7]
                  hover:from-[#2563eb] hover:to-[#9333ea]"
              >
                Register
              </Button>
            </form>

            <p className="text-center mt-6 text-sm text-[#64748b]">
              Already have an account?{' '}
              <span
                onClick={() => navigate('/login')}
                className="text-[#3b82f6] cursor-pointer font-medium"
              >
                Login here
              </span>
            </p>
          </div>

        </div>
      </motion.div>
    </div>
  );
};