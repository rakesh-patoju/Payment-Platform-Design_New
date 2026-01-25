import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface User {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface ServiceData {
  type: 'fastag' | 'education' | 'ferry' | null;
  vehicleNumber?: string;
  vehicleType?: string;
  registeredMobile?: string;
  enrollmentNumber?: string;
  bookingNumber?: string;
  amount: number;
}

export interface PaymentData {
  method: string;
  transactionId: string;
  date: string;
}

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  registeredUsers: User[];
  registerUser: (user: User) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  serviceData: ServiceData;
  setServiceData: (data: ServiceData) => void;
  paymentData: PaymentData | null;
  setPaymentData: (data: PaymentData | null) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [registeredUsers, setRegisteredUsers] = useState<User[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [serviceData, setServiceData] = useState<ServiceData>({
    type: null,
    amount: 0,
  });
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);

  const registerUser = (newUser: User) => {
    setRegisteredUsers([...registeredUsers, newUser]);
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    setServiceData({ type: null, amount: 0 });
    setPaymentData(null);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        registeredUsers,
        registerUser,
        isLoggedIn,
        setIsLoggedIn,
        serviceData,
        setServiceData,
        paymentData,
        setPaymentData,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
