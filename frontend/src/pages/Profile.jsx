import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import api from '../api/axios';

const Profile = () => {
    const { user, updateProfile } = useAuth();
    const [formData, setFormData] = useState({
        age: '',
        gender: '',
        height: '',
        weight: '',
        medical_conditions: '',
        goal: 'maintain',
    });
    const [advice, setAdvice] = useState(null);
    const [msg, setMsg] = useState('');
    const [adviceError, setAdviceError] = useState('');

    useEffect(() => {
        if (user) {
            setFormData({
                age: user.age || '',
                gender: user.gender || '',
                height: user.height || '',
                weight: user.weight || '',
                medical_conditions: user.medical_conditions || '',
                goal: user.goal || 'maintain',
            });
            fetchAdvice();
        }
    }, [user]);

    const fetchAdvice = async () => {
        try {
            setAdviceError('');
            const { data } = await api.get('/users/me/advice');
            setAdvice(data);
        } catch (error) {
            console.error(error);
            setAdviceError('Failed to load advice: ' + (error.response?.data?.detail || error.message));
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateProfile({
                ...formData,
                age: parseInt(formData.age) || null,
                height: parseFloat(formData.height) || null,
                weight: parseFloat(formData.weight) || null,
            });
            setMsg('Profile updated successfully!');
            fetchAdvice();
        } catch (error) {
            setMsg('Error updating profile');
            console.error(error);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <div style={{ flex: 1, padding: '2rem', display: 'flex', justifyContent: 'center' }}>
                <div style={{ width: '100%', maxWidth: '800px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>

                    {/* Profile Form */}
                    <div className="glass-panel" style={{ padding: '2rem' }}>
                        <h2 style={{ marginBottom: '1.5rem' }}>Your Profile</h2>
                        {msg && <p style={{ color: msg.includes('Error') ? 'red' : 'green', marginBottom: "10px" }}>{msg}</p>}
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Age</label>
                                <input type="number" name="age" value={formData.age} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Gender</label>
                                <select name="gender" value={formData.gender} onChange={handleChange}>
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Height (cm)</label>
                                <input type="number" name="height" value={formData.height} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Weight (kg)</label>
                                <input type="number" name="weight" value={formData.weight} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Medical Conditions</label>
                                <input type="text" name="medical_conditions" value={formData.medical_conditions} onChange={handleChange} placeholder="e.g. asthma, diabetes (comma separated)" />
                            </div>
                            <div className="form-group">
                                <label>Goal</label>
                                <select name="goal" value={formData.goal} onChange={handleChange}>
                                    <option value="maintain">Maintain Weight</option>
                                    <option value="lose_weight">Lose Weight</option>
                                    <option value="gain_muscle">Gain Muscle</option>
                                </select>
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                                Save Profile
                            </button>
                        </form>
                    </div>

                    {/* Advice Section */}
                    <div className="glass-panel" style={{ padding: '2rem' }}>
                        <h2 style={{ marginBottom: '1.5rem' }}>Personalized Advice</h2>
                        {adviceError && <p style={{ color: 'red', marginBottom: '1rem' }}>{adviceError}</p>}
                        {advice ? (
                            <div className="animate-fade-in">
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <h3 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>Exercise Plan</h3>
                                    <p style={{ lineHeight: '1.6', color: 'var(--text-muted)' }}>{advice.exercise}</p>
                                </div>
                                <div>
                                    <h3 style={{ color: 'var(--secondary)', marginBottom: '0.5rem' }}>Nutrition Plan</h3>
                                    <p style={{ lineHeight: '1.6', color: 'var(--text-muted)' }}>{advice.nutrition}</p>
                                </div>
                            </div>
                        ) : (
                            <p style={{ color: 'var(--text-muted)' }}>Update your profile to get personalized advice based on your goals and conditions.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
