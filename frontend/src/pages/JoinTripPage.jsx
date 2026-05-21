import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import useAuthStore from '../store/authStore';

export default function JoinTripPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [status, setStatus] = useState('Joining trip...');

  useEffect(() => {
    const joinTrip = async () => {
      try {
        
        await api.post(`/trips/${id}/join`);
        setStatus('Successfully joined! Redirecting...');
        setTimeout(() => navigate(`/trip/${id}`), 1500);
      } catch (error) {
        setStatus(error.response?.data?.message || 'Failed to join trip.');
      }
    };
    
    if (user) joinTrip();
  }, [id, user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-md text-center">
        <h2 className="text-xl font-bold mb-2">Trip Invitation</h2>
        <p className="text-gray-600">{status}</p>
      </div>
    </div>
  );
}