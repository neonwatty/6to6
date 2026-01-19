'use client';

import { useState, useEffect } from 'react';
import { calculateTemporalHours, formatMinutes, getLocationName, type TemporalHours } from './lib/temporal';
import YearChart from './components/YearChart';
import TimeComparison from './components/TimeComparison';
import Logo from './components/Logo';

type LocationState =
  | { status: 'loading' }
  | { status: 'prompt' }
  | { status: 'denied' }
  | { status: 'error'; message: string }
  | { status: 'success'; latitude: number; longitude: number };

export default function Home() {
  const [location, setLocation] = useState<LocationState>({ status: 'loading' });
  const [temporal, setTemporal] = useState<TemporalHours | null>(null);
  const [date, setDate] = useState(new Date());
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Check if geolocation is available
    if (!navigator.geolocation) {
      setLocation({ status: 'error', message: 'Geolocation not supported' });
      return;
    }

    setLocation({ status: 'prompt' });
  }, []);

  const requestLocation = () => {
    setLocation({ status: 'loading' });
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          status: 'success',
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setLocation({ status: 'denied' });
        } else {
          setLocation({ status: 'error', message: error.message });
        }
      },
      { enableHighAccuracy: false, timeout: 10000 }
    );
  };

  // Calculate temporal hours when location changes
  useEffect(() => {
    if (location.status === 'success') {
      const result = calculateTemporalHours(location.latitude, location.longitude, date);
      setTemporal(result);
    }
  }, [location, date]);

  // Update time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setDate(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleShare = async () => {
    if (!temporal || location.status !== 'success') return;

    const text = temporal.isPolardayOrNight
      ? temporal.isPolarDay
        ? `It's polar day here — my daytime hours are infinite! ☀️`
        : `It's polar night here — my nighttime hours are infinite! 🌙`
      : `Each of my daytime hours is ${formatMinutes(temporal.dayHourMinutes)} real minutes right now. What about yours?`;

    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ text, url });
      } catch {
        // User cancelled or error
      }
    } else {
      // Fallback to clipboard
      await navigator.clipboard.writeText(`${text}\n${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 bg-gradient-to-b from-amber-50 to-orange-100 dark:from-slate-900 dark:to-slate-800">
      <main className="flex flex-col items-center gap-6 sm:gap-8 max-w-lg text-center w-full">
        <h1 className="flex flex-col items-center gap-2">
          <Logo size={100} />
          <span className="sr-only">6 to 6</span>
        </h1>

        {location.status === 'loading' && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-amber-800 dark:text-amber-200">Getting your location...</p>
          </div>
        )}

        {location.status === 'prompt' && (
          <div className="flex flex-col items-center gap-6">
            <p className="text-xl text-amber-800 dark:text-amber-200 leading-relaxed">
              What if sunrise was always at 6:00 AM<br />and sunset always at 6:00 PM?
            </p>
            <p className="text-amber-600 dark:text-amber-400 max-w-sm">
              In Roman times, it was. They divided daylight into 12 equal hours — so summer hours were long and winter hours were short.
            </p>
            <p className="text-amber-700/80 dark:text-amber-300/80 text-sm">
              See how long your hours would be today.
            </p>
            <button
              onClick={requestLocation}
              className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-full transition-colors shadow-lg"
            >
              See Your Hours
            </button>
            <p className="text-xs text-amber-700/70 dark:text-amber-300/70">
              Uses your location to calculate sunrise and sunset.
            </p>
          </div>
        )}

        {location.status === 'denied' && (
          <div className="flex flex-col items-center gap-4">
            <p className="text-amber-800 dark:text-amber-200">
              Location access was denied. Please enable location permissions and try again.
            </p>
            <button
              onClick={requestLocation}
              className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-full transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {location.status === 'error' && (
          <div className="flex flex-col items-center gap-4">
            <p className="text-red-600 dark:text-red-400">
              Error: {location.message}
            </p>
            <button
              onClick={requestLocation}
              className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-full transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {location.status === 'success' && temporal && (
          <div className="flex flex-col items-center gap-6 sm:gap-8 w-full">
            {temporal.isPolardayOrNight ? (
              <div className="flex flex-col items-center gap-4">
                <div className="text-6xl">
                  {temporal.isPolarDay ? '☀️' : '🌙'}
                </div>
                <p className="text-2xl font-medium text-amber-800 dark:text-amber-200">
                  {temporal.isPolarDay ? "It's polar day!" : "It's polar night!"}
                </p>
                <p className="text-amber-700 dark:text-amber-300">
                  {temporal.isPolarDay
                    ? 'The sun never sets here today. Your daytime hours are infinite.'
                    : 'The sun never rises here today. Your nighttime hours are infinite.'}
                </p>
              </div>
            ) : (
              <>
                <div className="flex flex-col items-center gap-1 sm:gap-2">
                  <p className="text-amber-700 dark:text-amber-300 text-base sm:text-lg">
                    Where you live, a Roman hour would be
                  </p>
                  <div className="text-6xl sm:text-7xl font-bold text-amber-900 dark:text-amber-100 tabular-nums">
                    {formatMinutes(temporal.dayHourMinutes)}
                  </div>
                  <p className="text-amber-700 dark:text-amber-300 text-base sm:text-lg">
                    real minutes
                  </p>
                </div>

                <div className="w-full max-w-xs">
                  <div className="flex justify-between text-sm text-amber-600 dark:text-amber-400 mb-1">
                    <span>☀️ Day</span>
                    <span>🌙 Night</span>
                  </div>
                  <div className="h-4 rounded-full overflow-hidden flex bg-slate-300 dark:bg-slate-600">
                    <div
                      className="bg-amber-400 dark:bg-amber-500 transition-all duration-500"
                      style={{ width: `${(temporal.daylightMinutes / 1440) * 100}%` }}
                    />
                    <div
                      className="bg-indigo-400 dark:bg-indigo-600"
                      style={{ width: `${(temporal.nightMinutes / 1440) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-amber-600 dark:text-amber-400 mt-1">
                    <span>{formatMinutes(temporal.dayHourMinutes)} min/hr</span>
                    <span>{formatMinutes(temporal.nightHourMinutes)} min/hr</span>
                  </div>
                </div>

                <div className="text-sm text-amber-600 dark:text-amber-400 space-y-1">
                  <p>
                    Sunrise: {temporal.sunrise.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {' • '}
                    Sunset: {temporal.sunset.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <p>{getLocationName(location.latitude, location.longitude)}</p>
                </div>
              </>
            )}

            {!temporal.isPolardayOrNight && (
              <TimeComparison
                sunriseHour={temporal.sunrise.getHours() + temporal.sunrise.getMinutes() / 60}
                sunsetHour={temporal.sunset.getHours() + temporal.sunset.getMinutes() / 60}
                dayHourMinutes={temporal.dayHourMinutes}
              />
            )}

            <YearChart
              latitude={location.latitude}
              longitude={location.longitude}
              currentDate={date}
            />

            <button
              onClick={handleShare}
              className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-full transition-colors shadow-lg flex items-center gap-2"
            >
              {copied ? 'Copied!' : 'Share'}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
