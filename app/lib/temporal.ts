import SunCalc from 'suncalc';

export interface TemporalHours {
  dayHourMinutes: number;
  nightHourMinutes: number;
  sunrise: Date;
  sunset: Date;
  isPolardayOrNight: boolean;
  isPolarDay: boolean;
  isPolarNight: boolean;
  daylightMinutes: number;
  nightMinutes: number;
}

export function calculateTemporalHours(
  latitude: number,
  longitude: number,
  date: Date = new Date()
): TemporalHours {
  const times = SunCalc.getTimes(date, latitude, longitude);

  const sunrise = times.sunrise;
  const sunset = times.sunset;

  // Check for polar day/night (when sunrise or sunset is invalid)
  const isPolarDay = isNaN(sunrise.getTime()) && isNaN(sunset.getTime()) && latitude > 0;
  const isPolarNight = isNaN(sunrise.getTime()) && isNaN(sunset.getTime()) && latitude < 0;
  const isPolardayOrNight = isNaN(sunrise.getTime()) || isNaN(sunset.getTime());

  if (isPolardayOrNight) {
    // During polar day/night, we can't calculate temporal hours meaningfully
    return {
      dayHourMinutes: isPolarDay ? Infinity : 0,
      nightHourMinutes: isPolarDay ? 0 : Infinity,
      sunrise,
      sunset,
      isPolardayOrNight: true,
      isPolarDay,
      isPolarNight,
      daylightMinutes: isPolarDay ? 1440 : 0,
      nightMinutes: isPolarDay ? 0 : 1440,
    };
  }

  // Calculate daylight duration in minutes
  const daylightMs = sunset.getTime() - sunrise.getTime();
  const daylightMinutes = daylightMs / (1000 * 60);

  // Night is the rest of the 24 hours
  const nightMinutes = 1440 - daylightMinutes;

  // Divide into 12 temporal hours each
  const dayHourMinutes = daylightMinutes / 12;
  const nightHourMinutes = nightMinutes / 12;

  return {
    dayHourMinutes,
    nightHourMinutes,
    sunrise,
    sunset,
    isPolardayOrNight: false,
    isPolarDay: false,
    isPolarNight: false,
    daylightMinutes,
    nightMinutes,
  };
}

export function getCurrentTemporalHour(
  latitude: number,
  longitude: number,
  date: Date = new Date()
): { hour: number; isDay: boolean; minutesIntoHour: number } {
  const temporal = calculateTemporalHours(latitude, longitude, date);

  if (temporal.isPolardayOrNight) {
    return { hour: 0, isDay: temporal.isPolarDay, minutesIntoHour: 0 };
  }

  const now = date.getTime();
  const sunriseTime = temporal.sunrise.getTime();
  const sunsetTime = temporal.sunset.getTime();

  if (now >= sunriseTime && now < sunsetTime) {
    // Daytime
    const minutesSinceSunrise = (now - sunriseTime) / (1000 * 60);
    const hour = Math.floor(minutesSinceSunrise / temporal.dayHourMinutes);
    const minutesIntoHour = minutesSinceSunrise % temporal.dayHourMinutes;
    return { hour: hour + 1, isDay: true, minutesIntoHour }; // 1-indexed hours
  } else {
    // Nighttime
    let minutesSinceSunset: number;
    if (now >= sunsetTime) {
      minutesSinceSunset = (now - sunsetTime) / (1000 * 60);
    } else {
      // Before sunrise (after midnight)
      const yesterdayTemporal = calculateTemporalHours(latitude, longitude, new Date(date.getTime() - 86400000));
      const yesterdaySunset = yesterdayTemporal.sunset.getTime();
      minutesSinceSunset = (now + 86400000 - yesterdaySunset) / (1000 * 60);
    }
    const hour = Math.floor(minutesSinceSunset / temporal.nightHourMinutes);
    const minutesIntoHour = minutesSinceSunset % temporal.nightHourMinutes;
    return { hour: hour + 1, isDay: false, minutesIntoHour };
  }
}

export function formatMinutes(minutes: number): string {
  if (!isFinite(minutes)) return '∞';
  if (minutes === 0) return '0';

  const rounded = Math.round(minutes * 10) / 10;
  return rounded.toFixed(1).replace(/\.0$/, '');
}

export function getLocationName(latitude: number, longitude: number): string {
  // Simple cardinal direction description
  const latDir = latitude >= 0 ? 'N' : 'S';
  const lonDir = longitude >= 0 ? 'E' : 'W';
  return `${Math.abs(latitude).toFixed(1)}°${latDir}, ${Math.abs(longitude).toFixed(1)}°${lonDir}`;
}

export interface YearDataPoint {
  date: Date;
  dayOfYear: number;
  dayHourMinutes: number;
  nightHourMinutes: number;
  isPolar: boolean;
}

export function calculateYearData(
  latitude: number,
  longitude: number,
  year: number = new Date().getFullYear()
): YearDataPoint[] {
  const data: YearDataPoint[] = [];
  const startDate = new Date(year, 0, 1); // Jan 1

  for (let dayOfYear = 0; dayOfYear < 365; dayOfYear++) {
    const date = new Date(startDate.getTime() + dayOfYear * 86400000);
    const temporal = calculateTemporalHours(latitude, longitude, date);

    data.push({
      date,
      dayOfYear,
      dayHourMinutes: temporal.isPolardayOrNight ? (temporal.isPolarDay ? 120 : 0) : temporal.dayHourMinutes,
      nightHourMinutes: temporal.isPolardayOrNight ? (temporal.isPolarNight ? 120 : 0) : temporal.nightHourMinutes,
      isPolar: temporal.isPolardayOrNight,
    });
  }

  return data;
}

export function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / 86400000);
}
