import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/app/context/AppContext';
import { Logo } from '@/app/components/Logo';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Car, GraduationCap, Ship, LogOut, XCircle } from 'lucide-react';
import { motion } from 'motion/react';

type ServiceType = 'fastag' | 'education' | 'ferry' | null;

export const ServiceSelection = () => {
  const navigate = useNavigate();
  const { user, setServiceData, logout } = useAppContext();
  const [selectedService, setSelectedService] = useState<ServiceType>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [fastagData, setFastagData] = useState({
    vehicleNumber: '',
    vehicleType: '',
    registeredMobile: '',
  });

  const [educationData, setEducationData] = useState({
    enrollmentNumber: '',
  });

  const [ferryData, setFerryData] = useState({
    bookingNumber: '',
  });

  const getServiceAmount = (service: ServiceType) => {
    switch (service) {
      case 'fastag':
        return 500;
      case 'education':
        return 1200;
      case 'ferry':
        return 350;
      default:
        return 0;
    }
  };

  const validateVehicleNumber = (num: string) => {
    const re = /^[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}$/;
    return re.test(num.toUpperCase());
  };

  const validateMobile = (num: string) => {
    const re = /^\d{10}$/;
    return re.test(num);
  };

  const handleProceed = () => {
    const newErrors: Record<string, string> = {};

    if (!selectedService) {
      newErrors.service = 'Please select a service';
      setErrors(newErrors);
      return;
    }

    if (selectedService === 'fastag') {
      if (!fastagData.vehicleNumber.trim()) {
        newErrors.vehicleNumber = 'Vehicle number is required';
      } else if (!validateVehicleNumber(fastagData.vehicleNumber)) {
        newErrors.vehicleNumber = 'Invalid vehicle number format (e.g., MH12AB1234)';
      }

      if (!fastagData.vehicleType) {
        newErrors.vehicleType = 'Vehicle type is required';
      }

      if (!fastagData.registeredMobile.trim()) {
        newErrors.registeredMobile = 'Mobile number is required';
      } else if (!validateMobile(fastagData.registeredMobile)) {
        newErrors.registeredMobile = 'Invalid mobile number';
      }
    } else if (selectedService === 'education') {
      if (!educationData.enrollmentNumber.trim()) {
        newErrors.enrollmentNumber = 'Enrollment number is required';
      }
    } else if (selectedService === 'ferry') {
      if (!ferryData.bookingNumber.trim()) {
        newErrors.bookingNumber = 'Booking number is required';
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const serviceDataToSave = {
        type: selectedService,
        amount: getServiceAmount(selectedService),
        ...(selectedService === 'fastag' && fastagData),
        ...(selectedService === 'education' && educationData),
        ...(selectedService === 'ferry' && ferryData),
      };

      setServiceData(serviceDataToSave);
      navigate('/payment');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const services = [
    {
      id: 'fastag' as const,
      title: 'FasTag',
      description: 'Recharge your vehicle FasTag',
      icon: Car,
      amount: 500,
      gradient: 'from-blue-500 to-blue-600',
    },
    {
      id: 'education' as const,
      title: 'Education',
      description: 'Pay your education fees',
      icon: GraduationCap,
      amount: 1200,
      gradient: 'from-purple-500 to-purple-600',
    },
    {
      id: 'ferry' as const,
      title: 'Ferry Booking',
      description: 'Book your ferry ticket',
      icon: Ship,
      amount: 350,
      gradient: 'from-teal-500 to-teal-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Logo />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Payment Platform</h1>
                <p className="text-sm text-gray-600">Welcome, {user?.name}</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Select a Service</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                onClick={() => setSelectedService(service.id)}
                className={`bg-white rounded-xl p-6 cursor-pointer transition-all duration-300 ${
                  selectedService === service.id
                    ? 'ring-2 ring-blue-500 shadow-xl scale-105'
                    : 'hover:shadow-lg'
                }`}
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-4`}>
                  <service.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{service.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900">₹{service.amount}</span>
                  {selectedService === service.id && (
                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {errors.service && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3"
            >
              <XCircle className="w-5 h-5 text-red-600" />
              <p className="text-sm text-red-800">{errors.service}</p>
            </motion.div>
          )}

          {selectedService === 'fastag' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg p-6 mb-6"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">FasTag Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="vehicleNumber">Vehicle Number</Label>
                  <Input
                    id="vehicleNumber"
                    placeholder="MH12AB1234"
                    value={fastagData.vehicleNumber}
                    onChange={(e) => setFastagData({ ...fastagData, vehicleNumber: e.target.value.toUpperCase() })}
                    className={errors.vehicleNumber ? 'border-red-500' : ''}
                  />
                  {errors.vehicleNumber && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <XCircle className="w-3 h-3" /> {errors.vehicleNumber}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="vehicleType">Vehicle Type</Label>
                  <Select
                    value={fastagData.vehicleType}
                    onValueChange={(value) => setFastagData({ ...fastagData, vehicleType: value })}
                  >
                    <SelectTrigger className={errors.vehicleType ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Car">Car</SelectItem>
                      <SelectItem value="Bus">Bus</SelectItem>
                      <SelectItem value="Truck">Truck</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.vehicleType && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <XCircle className="w-3 h-3" /> {errors.vehicleType}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="registeredMobile">Registered Mobile Number</Label>
                  <Input
                    id="registeredMobile"
                    placeholder="1234567890"
                    value={fastagData.registeredMobile}
                    onChange={(e) => setFastagData({ ...fastagData, registeredMobile: e.target.value })}
                    className={errors.registeredMobile ? 'border-red-500' : ''}
                  />
                  {errors.registeredMobile && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <XCircle className="w-3 h-3" /> {errors.registeredMobile}
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Total Amount:</span>
                <span className="text-2xl font-bold text-gray-900">₹500</span>
              </div>
            </motion.div>
          )}

          {selectedService === 'education' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg p-6 mb-6"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">Education Details</h3>
              <div className="max-w-md">
                <Label htmlFor="enrollmentNumber">Enrollment Number</Label>
                <Input
                  id="enrollmentNumber"
                  placeholder="Enter your enrollment number"
                  value={educationData.enrollmentNumber}
                  onChange={(e) => setEducationData({ enrollmentNumber: e.target.value })}
                  className={errors.enrollmentNumber ? 'border-red-500' : ''}
                />
                {errors.enrollmentNumber && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <XCircle className="w-3 h-3" /> {errors.enrollmentNumber}
                  </p>
                )}
              </div>
              <div className="mt-4 p-4 bg-purple-50 rounded-lg flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Total Amount:</span>
                <span className="text-2xl font-bold text-gray-900">₹1200</span>
              </div>
            </motion.div>
          )}

          {selectedService === 'ferry' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg p-6 mb-6"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">Ferry Booking Details</h3>
              <div className="max-w-md">
                <Label htmlFor="bookingNumber">Booking Number</Label>
                <Input
                  id="bookingNumber"
                  placeholder="Enter your booking number"
                  value={ferryData.bookingNumber}
                  onChange={(e) => setFerryData({ bookingNumber: e.target.value })}
                  className={errors.bookingNumber ? 'border-red-500' : ''}
                />
                {errors.bookingNumber && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <XCircle className="w-3 h-3" /> {errors.bookingNumber}
                  </p>
                )}
              </div>
              <div className="mt-4 p-4 bg-teal-50 rounded-lg flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Total Amount:</span>
                <span className="text-2xl font-bold text-gray-900">₹350</span>
              </div>
            </motion.div>
          )}

          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => {
                setSelectedService(null);
                setFastagData({ vehicleNumber: '', vehicleType: '', registeredMobile: '' });
                setEducationData({ enrollmentNumber: '' });
                setFerryData({ bookingNumber: '' });
                setErrors({});
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleProceed}
              disabled={!selectedService}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              Proceed to Payment →
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
