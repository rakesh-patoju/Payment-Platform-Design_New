import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/app/context/AppContext';
import { Logo } from '@/app/components/Logo';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Lock, CreditCard, Smartphone, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

type PaymentMethod = 'razorpay' | 'paypal' | 'upi' | 'phonepe' | 'googlepay' | null;

export const PaymentDetails = () => {
  const navigate = useNavigate();
  const { user, serviceData, setPaymentData } = useAppContext();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [editableEmail, setEditableEmail] = useState(user?.email || '');
  const [editablePhone, setEditablePhone] = useState(user?.phone || '');

  if (!serviceData.type) {
    navigate('/services');
    return null;
  }

  const getServiceTitle = () => {
    switch (serviceData.type) {
      case 'fastag':
        return 'FasTag Recharge';
      case 'education':
        return 'Education Fee';
      case 'ferry':
        return 'Ferry Booking';
      default:
        return 'Service';
    }
  };

  const getServiceDetails = () => {
    if (serviceData.type === 'fastag') {
      return `${serviceData.vehicleNumber} (${serviceData.vehicleType})`;
    } else if (serviceData.type === 'education') {
      return `Enrollment: ${serviceData.enrollmentNumber}`;
    } else if (serviceData.type === 'ferry') {
      return `Booking: ${serviceData.bookingNumber}`;
    }
    return '';
  };

  const paymentMethods = [
    {
      id: 'razorpay' as const,
      name: 'Razorpay',
      description: 'Cards, UPI, Wallets',
      gradient: 'from-blue-500 to-blue-700',
      icon: CreditCard,
    },
    {
      id: 'paypal' as const,
      name: 'PayPal',
      description: 'Secure PayPal payment',
      gradient: 'from-blue-400 to-blue-600',
      icon: CreditCard,
    },
    {
      id: 'upi' as const,
      name: 'UPI',
      description: 'Unified Payments Interface',
      gradient: 'from-orange-400 via-green-500 to-green-600',
      icon: Smartphone,
    },
    {
      id: 'phonepe' as const,
      name: 'PhonePe',
      description: 'Pay with PhonePe',
      gradient: 'from-purple-500 to-purple-700',
      icon: Smartphone,
    },
    {
      id: 'googlepay' as const,
      name: 'Google Pay',
      description: 'Quick & secure payment',
      gradient: 'from-blue-500 via-red-500 to-yellow-500',
      icon: Smartphone,
    },
  ];

  const handlePayment = async () => {
    if (!selectedMethod) return;

    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const transactionId = `TXN${Date.now()}${Math.floor(Math.random() * 1000000)}`;
    const paymentInfo = {
      method: selectedMethod,
      transactionId,
      date: new Date().toLocaleString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      }),
    };

    setPaymentData(paymentInfo);
    setIsProcessing(false);
    navigate('/confirmation');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-6"
        >
          <div className="flex items-center gap-4">
            <Logo />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Payment Details</h1>
              <p className="text-sm text-gray-600">Complete your payment securely</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editableEmail}
                    onChange={(e) => setEditableEmail(e.target.value)}
                    placeholder="your.email@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={editablePhone}
                    onChange={(e) => setEditablePhone(e.target.value)}
                    placeholder="1234567890"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Select Payment Method</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {paymentMethods.map((method, index) => (
                  <motion.div
                    key={method.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`p-4 rounded-xl cursor-pointer transition-all duration-300 border-2 ${
                      selectedMethod === method.id
                        ? 'border-blue-500 shadow-lg scale-105'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${method.gradient} flex items-center justify-center mb-3`}>
                      <method.icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1">{method.name}</h3>
                    <p className="text-xs text-gray-600">{method.description}</p>
                    {selectedMethod === method.id && (
                      <div className="mt-2 flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-xs font-medium text-blue-600">Selected</span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="bg-green-50 rounded-xl border border-green-200 p-4 flex items-center gap-3">
              <Lock className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-800">100% Secure Demo Payment</p>
                <p className="text-xs text-green-600">Your information is safe with us</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Service</span>
                  <span className="font-medium text-gray-900">{getServiceTitle()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Details</span>
                  <span className="font-medium text-gray-900 text-right">{getServiceDetails()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Email</span>
                  <span className="font-medium text-gray-900 text-right truncate max-w-[150px]">{editableEmail}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Phone</span>
                  <span className="font-medium text-gray-900">{editablePhone}</span>
                </div>
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-900">Total Amount</span>
                    <span className="text-2xl font-bold text-gray-900">₹{serviceData.amount}</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={handlePayment}
                disabled={!selectedMethod || isProcessing}
                className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-6"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </div>
                ) : (
                  `Pay Now ₹${serviceData.amount}`
                )}
              </Button>

              <Button
                variant="outline"
                onClick={() => navigate('/services')}
                className="w-full mt-3 flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Services
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
