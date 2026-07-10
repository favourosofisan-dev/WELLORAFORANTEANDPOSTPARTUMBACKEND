import React, { useState } from 'react';
import { useUserProfile } from '../context/UserProfileContext';
import { Calendar, CheckCircle, Save } from 'lucide-react';

export const AntenatalGuideView: React.FC = () => {
  const { profile, updateProfile } = useUserProfile();
  const [appointmentDate, setAppointmentDate] = useState(profile.antenatalData?.appointmentDate || '');
  const [attendedDays, setAttendedDays] = useState(profile.antenatalData?.attendedDays || '');
  const [bloodPressure, setBloodPressure] = useState(profile.antenatalData?.bloodPressure || ''); // e.g., 120/80
  const [weight, setWeight] = useState(profile.antenatalData?.weight || ''); // kg
  const [vitaminIntake, setVitaminIntake] = useState(profile.antenatalData?.vitaminIntake || ''); // yes/no or qty
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const antenatalData = {
      appointmentDate,
      attendedDays,
      bloodPressure,
      weight,
      vitaminIntake,
    };
    updateProfile({ antenatalData });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-3xl shadow-md border border-wellora-rose/15">
      <h2 className="flex items-center gap-2 text-xl font-serif font-bold text-wellora-mocha mb-4">
        <Calendar className="w-5 h-5 text-wellora-terracotta" /> Antenatal Appointment & Health Tracker
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-wellora-mocha mb-1">Next Appointment Date</label>
          <input
            type="date"
            value={appointmentDate}
            onChange={e => setAppointmentDate(e.target.value)}
            className="w-full rounded-md border border-wellora-rose/20 p-2 focus:outline-none focus:ring-2 focus:ring-wellora-terracotta"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-wellora-mocha mb-1">Attended Days (since last visit)</label>
          <input
            type="number"
            min="0"
            value={attendedDays}
            onChange={e => setAttendedDays(e.target.value)}
            className="w-full rounded-md border border-wellora-rose/20 p-2 focus:outline-none focus:ring-2 focus:ring-wellora-terracotta"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-wellora-mocha mb-1">Blood Pressure (mmHg)</label>
            <input
              type="text"
              placeholder="120/80"
              value={bloodPressure}
              onChange={e => setBloodPressure(e.target.value)}
              className="w-full rounded-md border border-wellora-rose/20 p-2 focus:outline-none focus:ring-2 focus:ring-wellora-terracotta"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-wellora-mocha mb-1">Weight (kg)</label>
            <input
              type="number"
              step="0.1"
              value={weight}
              onChange={e => setWeight(e.target.value)}
              className="w-full rounded-md border border-wellora-rose/20 p-2 focus:outline-none focus:ring-2 focus:ring-wellora-terracotta"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-wellora-mocha mb-1">Prenatal Vitamin Intake</label>
          <select
            value={vitaminIntake}
            onChange={e => setVitaminIntake(e.target.value)}
            className="w-full rounded-md border border-wellora-rose/20 p-2 focus:outline-none focus:ring-2 focus:ring-wellora-terracotta"
            required
          >
            <option value="">Select</option>
            <option value="daily">Daily</option>
            <option value="occasionally">Occasionally</option>
            <option value="none">None</option>
          </select>
        </div>
        <div className="flex items-center space-x-3">
          <button
            type="submit"
            className="flex items-center gap-1 px-4 py-2 bg-wellora-terracotta text-white rounded-full hover:bg-wellora-terracotta/90 transition"
          >
            <Save className="w-4 h-4" /> Save
          </button>
          {saved && (
            <span className="text-sm text-wellora-terracotta flex items-center">
              <CheckCircle className="w-4 h-4 mr-1" /> Saved!
            </span>
          )}
        </div>
      </form>
    </div>
  );
};
