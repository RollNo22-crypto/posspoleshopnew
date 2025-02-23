import React from 'react';
import { Check, X, Clock, RefreshCw, AlertCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusConfig = () => {
    const config = {
      icon: <AlertCircle className="w-5 h-5 text-gray-600" />,
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-800'
    };

    switch (status.toLowerCase()) {
      case 'approved':
      case 'confirmed':
        return {
          icon: <Check className="w-5 h-5 text-green-600" />,
          bgColor: 'bg-green-100',
          textColor: 'text-green-800'
        };
      case 'rejected':
      case 'cancelled':
        return {
          icon: <X className="w-5 h-5 text-red-600" />,
          bgColor: 'bg-red-100',
          textColor: 'text-red-800'
        };
      case 'completed':
        return {
          icon: <RefreshCw className="w-5 h-5 text-blue-600" />,
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-800'
        };
      case 'pending':
        return {
          icon: <Clock className="w-5 h-5 text-yellow-600" />,
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800'
        };
      default:
        return config;
    }
  };

  const { icon, bgColor, textColor } = getStatusConfig();
  const displayStatus = status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <div className="flex items-center">
      {icon}
      <span className={`ml-2 px-2 py-1 text-sm rounded-full ${bgColor} ${textColor}`}>
        {displayStatus}
      </span>
    </div>
  );
}