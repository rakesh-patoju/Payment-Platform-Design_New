import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/app/context/AppContext';
import { Logo } from '@/app/components/Logo';
import { Button } from '@/app/components/ui/button';
import { CheckCircle2, Download, Home, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';

export const PaymentConfirmation = () => {
  const navigate = useNavigate();
  const { serviceData, paymentData, user } = useAppContext();

  if (!paymentData || !serviceData.type) {
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
      return `Vehicle: ${serviceData.vehicleNumber} (${serviceData.vehicleType})`;
    } else if (serviceData.type === 'education') {
      return `Enrollment: ${serviceData.enrollmentNumber}`;
    } else if (serviceData.type === 'ferry') {
      return `Booking: ${serviceData.bookingNumber}`;
    }
    return '';
  };

  const getPaymentMethodDisplay = () => {
    const methodMap: Record<string, string> = {
      razorpay: 'Razorpay',
      paypal: 'PayPal',
      upi: 'UPI',
      phonepe: 'PhonePe',
      googlepay: 'Google Pay',
    };
    return methodMap[paymentData.method] || paymentData.method;
  };

  const handleDownloadReceipt = () => {
    // Create a simple text receipt
    const receipt = `
TECHNOGENT Infotech Private Limited
Payment Receipt

=====================================
Transaction ID: ${paymentData.transactionId}
Date & Time: ${paymentData.date}
=====================================

Customer Details:
Name: ${user?.name}
Email: ${user?.email}
Phone: ${user?.phone}

Service Details:
Service: ${getServiceTitle()}
Details: ${getServiceDetails()}

Payment Details:
Payment Method: ${getPaymentMethodDisplay()}
Amount Paid: ₹${serviceData.amount}

=====================================
Status: SUCCESS
=====================================

This is a demo transaction. No actual payment was processed.

Thank you for using our payment platform!
    `;

    const blob = new Blob([receipt], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${paymentData.transactionId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-4 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex justify-center mb-6">
            <Logo />
          </div>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            className="flex justify-center mb-6"
          >
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-16 h-16 text-green-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
            <p className="text-gray-600">Your transaction has been completed successfully</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-gray-50 rounded-xl p-6 mb-6"
          >
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-white p-4 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Transaction ID</p>
                <p className="font-mono text-sm font-bold text-gray-900 break-all">{paymentData.transactionId}</p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Date & Time</p>
                <p className="text-sm font-medium text-gray-900">{paymentData.date}</p>
              </div>
            </div>

            <div className="space-y-3 border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Service</span>
                <span className="text-sm font-medium text-gray-900">{getServiceTitle()}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-sm text-gray-600">Details</span>
                <span className="text-sm font-medium text-gray-900 text-right">{getServiceDetails()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Payment Method</span>
                <span className="text-sm font-medium text-gray-900">{getPaymentMethodDisplay()}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t">
                <span className="font-bold text-gray-900">Amount Paid</span>
                <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                  ₹{serviceData.amount}
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6"
          >
            <Button
              onClick={handleDownloadReceipt}
              variant="outline"
              className="flex items-center gap-2 justify-center"
            >
              <Download className="w-4 h-4" />
              Download Receipt
            </Button>
            <Button
              onClick={() => navigate('/services')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white flex items-center gap-2 justify-center"
            >
              <Home className="w-4 h-4" />
              Back to Dashboard
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3"
          >
            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-800">This is a demo transaction</p>
              <p className="text-xs text-yellow-700 mt-1">
                No actual payment was processed. This is for demonstration purposes only.
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};
