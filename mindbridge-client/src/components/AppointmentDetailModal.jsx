import React from 'react';
import { FiX, FiUser, FiCalendar, FiClock, FiMapPin, FiVideo } from 'react-icons/fi';

const AppointmentDetailModal = ({ isOpen, onClose, appointment }) => {
  if (!isOpen || !appointment) {
    return null;
  }

  const getStatusStyles = (status) => {
    switch (status) {
      case 'Scheduled': return 'bg-yellow-100 text-yellow-800';
      case 'Confirmed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
        <div className="p-8">
          <div className="flex justify-between items-center pb-4 border-b">
            <h2 className="text-2xl font-bold text-gray-800">Appointment Details</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <FiX size={24} />
            </button>
          </div>
          <div className="py-6 space-y-5">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full mr-4">
                <FiUser className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Counselor</p>
                <p className="text-lg font-bold text-gray-900">{appointment.counselor}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                    <FiCalendar className="w-5 h-5 mr-3 text-gray-400" />
                    <div>
                        <p className="text-sm text-gray-500">Date</p>
                        <p className="font-semibold text-gray-800">{new Date(appointment.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                </div>
                <div className="flex items-center">
                    <FiClock className="w-5 h-5 mr-3 text-gray-400" />
                    <div>
                        <p className="text-sm text-gray-500">Time</p>
                        <p className="font-semibold text-gray-800">{appointment.time} ({appointment.duration} min)</p>
                    </div>
                </div>
                <div className="flex items-center col-span-2">
                    {appointment.isOnline ? <FiVideo className="w-5 h-5 mr-3 text-gray-400" /> : <FiMapPin className="w-5 h-5 mr-3 text-gray-400" />}
                    <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="font-semibold text-gray-800">{appointment.location}</p>
                    </div>
                </div>
                 <div className="flex items-center">
                    <p className="text-sm text-gray-500 mr-3">Status:</p>
                    <div className={`px-3 py-1 rounded-full text-sm font-bold ${getStatusStyles(appointment.status)}`}>
                        {appointment.status}
                    </div>
                 </div>
            </div>
          </div>
          <div className="flex justify-end pt-4 border-t">
            <button 
              onClick={onClose} 
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetailModal;

