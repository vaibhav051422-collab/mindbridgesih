import React, { useState, useEffect } from 'react';
import { FiPlus, FiUser, FiCalendar, FiClock, FiVideo, FiMapPin, FiX } from 'react-icons/fi';
import AppointmentDetailModal from '../components/AppointmentDetailModal.jsx';
import { supabase } from '../supabaseClient'; // Make sure this path is correct

// Sample data for available counselors
const mockCounselors = [
    { id: 1, name: "Dr. Sarah Johnson", specialization: "Anxiety & Stress", available: true },
    { id: 2, name: "Dr. Michael Chen", specialization: "Depression & Mood", available: true },
    { id: 3, name: "Dr. Emily Rodriguez", specialization: "Academic Stress", available: false }
];

const AppointmentsPage = () => {
    const [user, setUser] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [showBookingForm, setShowBookingForm] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [newAppointment, setNewAppointment] = useState({
        counselor: '',
        date: '',
        time: '',
        type: 'online',
        duration: 60,
        notes: ''
    });

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user }, error } = await supabase.auth.getUser();
            if (error) {
                console.error('Error fetching user:', error.message);
            } else {
                setUser(user);
                fetchAppointments(user.id);
            }
        };
        fetchUser();
    }, []);

    const fetchAppointments = async (userId) => {
        const { data, error } = await supabase
            .from('appointments')
            .select('*')
            .eq('user_id', userId)
            .order('date', { ascending: true });

        if (error) {
            console.error('Error fetching appointments:', error.message);
        } else {
            setAppointments(data);
        }
    };

    const handleBookAppointment = async (e) => {
        e.preventDefault();
        if (!user) return;

        const appointmentData = {
            user_id: user.id,
            counselor: newAppointment.counselor,
            date: newAppointment.date,
            time: newAppointment.time,
            status: 'Scheduled',
            duration: newAppointment.duration,
            location: newAppointment.type === 'online' ? 'Online Session' : 'Counseling Center',
            is_online: newAppointment.type === 'online',
            type: 'Counseling Session'
        };

        const { data, error } = await supabase
            .from('appointments')
            .insert([appointmentData])
            .select();

        if (error) {
            console.error('Error booking appointment:', error.message);
        } else {
            setAppointments(prev => [...prev, data[0]]);
            setShowBookingForm(false);
            setNewAppointment({ counselor: '', date: '', time: '', type: 'online', duration: 60, notes: '' });
        }
    };

    const handleCancelAppointment = async (appointmentId) => {
        if (!user) return;
        if (window.confirm("Are you sure you want to cancel this appointment?")) {
            const { error } = await supabase
                .from('appointments')
                .delete()
                .eq('id', appointmentId)
                .eq('user_id', user.id);

            if (error) {
                console.error('Error cancelling appointment:', error.message);
            } else {
                setAppointments(prev => prev.filter(appt => appt.id !== appointmentId));
            }
        }
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case 'Scheduled': return 'bg-yellow-100 text-yellow-800';
            case 'Confirmed': return 'bg-green-100 text-green-800';
            case 'Cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const openDetailModal = (appointment) => {
        setSelectedAppointment(appointment);
        setIsDetailModalOpen(true);
    };

    if (!user) {
        return (
            <div className="p-6 text-center">
                <h2 className="text-xl font-bold">Please log in to view appointments.</h2>
            </div>
        );
    }

    return (
        <>
            <div className="p-6 md:p-8 min-h-full">
                <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Appointments</h1>
                        <p className="text-gray-500 mt-1">Book and manage your counseling sessions</p>
                    </div>
                    <button
                        onClick={() => setShowBookingForm(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-5 rounded-lg transition-transform hover:scale-105 shadow-md flex items-center space-x-2"
                    >
                        <FiPlus className="w-5 h-5" />
                        <span>Book Session</span>
                    </button>
                </div>

                {/* Booking Form Modal */}
                {showBookingForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full">
                            <div className="p-8">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-2xl font-bold text-gray-900">Book a New Session</h3>
                                    <button onClick={() => setShowBookingForm(false)} className="text-gray-400 hover:text-gray-600"><FiX size={24} /></button>
                                </div>
                                <form onSubmit={handleBookAppointment} className="space-y-4">
                                    <select name="counselor" value={newAppointment.counselor} onChange={(e) => setNewAppointment({ ...newAppointment, counselor: e.target.value })} className="w-full p-3 border border-gray-300 rounded-lg bg-white" required>
                                        <option value="">Select a counselor</option>
                                        {mockCounselors.filter(c => c.available).map(c => (<option key={c.id} value={c.name}>{c.name} - {c.specialization}</option>))}
                                    </select>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input type="date" name="date" value={newAppointment.date} onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })} className="w-full p-3 border border-gray-300 rounded-lg" required />
                                        <input type="time" name="time" value={newAppointment.time} onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })} className="w-full p-3 border border-gray-300 rounded-lg" required />
                                    </div>
                                    <div className="flex justify-end space-x-3 pt-2">
                                        <button type="button" onClick={() => setShowBookingForm(false)} className="px-5 py-2 text-gray-600 font-semibold rounded-lg hover:bg-gray-100">Cancel</button>
                                        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold">Confirm Booking</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                <div className="space-y-6">
                    {appointments.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-md border p-12 text-center">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FiCalendar className="w-10 h-10 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">No Appointments Yet</h3>
                            <p className="text-gray-500 mb-6">Book your first counseling session to get started.</p>
                            <button
                                onClick={() => setShowBookingForm(true)}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-5 rounded-lg transition-transform hover:scale-105 shadow-md inline-flex items-center space-x-2"
                            >
                                <FiPlus className="w-5 h-5" />
                                <span>Book Your First Session</span>
                            </button>
                        </div>
                    ) : (
                        appointments.map((appt) => (
                        <div key={appt.id} className="bg-white rounded-2xl shadow-md border p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center space-x-4">
                                    <div className="p-3 bg-blue-100 rounded-full"><FiUser className="w-6 h-6 text-blue-600" /></div>
                                    <div>
                                        <h3 className="font-bold text-gray-800 text-lg">{appt.counselor}</h3>
                                        <p className="text-sm text-gray-500">{appt.type}</p>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusStyles(appt.status)}`}>{appt.status}</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4 pt-4 border-t">
                                <div className="flex items-center text-sm text-gray-600"><FiCalendar className="w-4 h-4 mr-2 text-gray-400" /> {new Date(appt.date).toLocaleDateString('en-GB')}</div>
                                <div className="flex items-center text-sm text-gray-600"><FiClock className="w-4 h-4 mr-2 text-gray-400" /> {appt.time} ({appt.duration} min)</div>
                                <div className="flex items-center text-sm text-gray-600">{appt.is_online ? <FiVideo className="w-4 h-4 mr-2 text-gray-400" /> : <FiMapPin className="w-4 h-4 mr-2 text-gray-400" />} {appt.location}</div>
                            </div>
                            <div className="flex justify-end space-x-3 pt-4 border-t">
                                {appt.status === 'Scheduled' && (
                                    <>
                                        <button onClick={() => handleCancelAppointment(appt.id)} className="text-sm font-semibold text-red-600 hover:text-red-800">Cancel</button>
                                        <button onClick={() => alert("Joining session...")} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold text-sm">Join Session</button>
                                    </>
                                )}
                                {appt.status === 'Confirmed' && (
                                    <button onClick={() => openDetailModal(appt)} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold text-sm">View Details</button>
                                )}
                            </div>
                        </div>
                        ))
                    )}
                </div>
            </div>

            <AppointmentDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                appointment={selectedAppointment}
            />
        </>
    );
};

export default AppointmentsPage;
