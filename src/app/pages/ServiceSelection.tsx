import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/app/context/AppContext';
import { Logo } from '@/app/components/Logo';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Car, LogOut, XCircle } from 'lucide-react';
import { motion } from 'motion/react';

type ServiceType = 'fastag' | null;

export const ServiceSelection = () => {
  const navigate = useNavigate();
  const { user, setServiceData, logout } = useAppContext();

  const [selectedService, setSelectedService] = useState<ServiceType>(null);
  const [amount, setAmount] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [fastagData, setFastagData] = useState({
    vehicleNumber: '',
    vehicleType: '',
    registeredMobile: '',
  });

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
      newErrors.service = 'Please select FasTag service';
      setErrors(newErrors);
      return;
    }

    if (!fastagData.vehicleNumber.trim())
      newErrors.vehicleNumber = 'Vehicle number required';
    else if (!validateVehicleNumber(fastagData.vehicleNumber))
      newErrors.vehicleNumber = 'Invalid format (MH12AB1234)';

    if (!fastagData.vehicleType)
      newErrors.vehicleType = 'Select vehicle type';

    if (!fastagData.registeredMobile.trim())
      newErrors.registeredMobile = 'Mobile number required';
    else if (!validateMobile(fastagData.registeredMobile))
      newErrors.registeredMobile = 'Invalid mobile number';

    if (!amount)
      newErrors.amount = 'Enter recharge amount';
    else if (Number(amount) < 50)
      newErrors.amount = 'Minimum recharge ₹50';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setServiceData({
        type: 'fastag',
        amount: Number(amount),
        ...fastagData,
      });
      navigate('/payment');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
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
            <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </motion.div>

        {/* Service Card */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Select a Service</h2>

        <div className="max-w-md mb-8">
          <motion.div
            onClick={() => setSelectedService('fastag')}
            className={`bg-white rounded-xl p-6 cursor-pointer transition-all ${
              selectedService === 'fastag'
                ? 'ring-2 ring-blue-500 shadow-xl scale-105'
                : 'hover:shadow-lg'
            }`}
          >
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4">
              <Car className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold">FasTag</h3>
            <p className="text-sm text-gray-600 mb-3">Recharge your vehicle FasTag</p>
            <span className="text-sm text-gray-500">Click to enter amount</span>
          </motion.div>
        </div>

        {/* Service Error */}
        {errors.service && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-600" />
            <p className="text-sm text-red-800">{errors.service}</p>
          </div>
        )}

        {/* FasTag Form */}
        {selectedService === 'fastag' && (
          <motion.div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h3 className="text-lg font-bold mb-4">FasTag Details</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              {/* Vehicle Number */}
              <div>
                <Label>Vehicle Number</Label>
                <Input
                  placeholder="MH12AB1234"
                  value={fastagData.vehicleNumber}
                  onChange={(e) =>
                    setFastagData({
                      ...fastagData,
                      vehicleNumber: e.target.value.toUpperCase()
                    })
                  }
                />
                {errors.vehicleNumber && <p className="text-xs text-red-500">{errors.vehicleNumber}</p>}
              </div>

              {/* Vehicle Type */}
              <div>
                <Label>Vehicle Type</Label>
                <Select
                  value={fastagData.vehicleType}
                  onValueChange={(v) => setFastagData({ ...fastagData, vehicleType: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Car">Car</SelectItem>
                    <SelectItem value="Bus">Bus</SelectItem>
                    <SelectItem value="Truck">Truck</SelectItem>
                  </SelectContent>
                </Select>
                {errors.vehicleType && <p className="text-xs text-red-500">{errors.vehicleType}</p>}
              </div>

              {/* Mobile */}
              <div>
                <Label>Registered Mobile</Label>
                <Input
                  placeholder="1234567890"
                  value={fastagData.registeredMobile}
                  onChange={(e) =>
                    setFastagData({
                      ...fastagData,
                      registeredMobile: e.target.value
                    })
                  }
                />
                {errors.registeredMobile && <p className="text-xs text-red-500">{errors.registeredMobile}</p>}
              </div>

            </div>

            {/* Amount Input */}
            <div className="mt-4 p-4 bg-blue-50 rounded-lg flex justify-between items-center">
              <span>Total Amount</span>

              <div className="flex items-center gap-2">
                <span className="text-lg font-bold">₹</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-32 px-3 py-2 border rounded-lg text-right font-bold text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>

            {errors.amount && (
              <p className="text-xs text-red-500 mt-1">{errors.amount}</p>
            )}
          </motion.div>
        )}

        {/* Actions */}
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={() => {
              setSelectedService(null);
              setFastagData({ vehicleNumber: '', vehicleType: '', registeredMobile: '' });
              setAmount('');
              setErrors({});
            }}
            className="flex-1"
          >
            Cancel
          </Button>

          <Button
            onClick={handleProceed}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white"
          >
            Proceed to Payment →
          </Button>
        </div>

      </div>
    </div>
  );
};