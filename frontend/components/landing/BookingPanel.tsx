'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Timer, ArrowRight } from 'lucide-react';
import { DURATION_OPTIONS, TIME_OPTIONS } from '@/lib/mock-data';

interface BookingPanelProps {
  onCheck?: (date: string, time: string, duration: number) => void;
}

export default function BookingPanel({ onCheck }: BookingPanelProps) {
  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(today);
  const [time, setTime] = useState('09:00');
  const [duration, setDuration] = useState(2);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onCheck?.(date, time, duration);
    // Scroll to spaces section
    document.getElementById('spaces')?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.6, ease: [0.4, 0, 0.2, 1] }}
      className="w-full max-w-4xl mx-auto"
    >
      <form
        onSubmit={handleSubmit}
        className="glass rounded-2xl px-6 py-5 shadow-glass-lg"
        aria-label="Workspace availability checker"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 items-end">

          {/* Date */}
          <div className="space-y-1.5">
            <label className="label flex items-center gap-1.5" htmlFor="bp-date">
              <Calendar size={10} />
              Date
            </label>
            <input
              id="bp-date"
              type="date"
              className="input"
              min={today}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          {/* Start Time */}
          <div className="space-y-1.5">
            <label className="label flex items-center gap-1.5" htmlFor="bp-time">
              <Clock size={10} />
              Start Time
            </label>
            <select
              id="bp-time"
              className="input appearance-none cursor-pointer"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            >
              {TIME_OPTIONS.map((t) => (
                <option key={t} value={t} style={{ background: '#1c1410' }}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Duration */}
          <div className="space-y-1.5">
            <label className="label flex items-center gap-1.5" htmlFor="bp-duration">
              <Timer size={10} />
              Duration
            </label>
            <select
              id="bp-duration"
              className="input appearance-none cursor-pointer"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
            >
              {DURATION_OPTIONS.map((d) => (
                <option key={d.value} value={d.value} style={{ background: '#1c1410' }}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>

          {/* CTA */}
          <button
            type="submit"
            className="btn-primary w-full group"
          >
            Check Availability
            <ArrowRight
              size={15}
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </button>
        </div>
      </form>
    </motion.div>
  );
}
