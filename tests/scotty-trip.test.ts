import { describe, expect, it } from 'vitest';
import { RIDES } from '../shared/scotty';
import { shipTime, shipTimestamp, paymentError } from '../lib/scotty-trip';

describe('Scotty travel presentation', () => {
  it('shows the revised delayed departure and arrival in UTC', () => {
    const ride = RIDES.find(r => r.status === 'delayed')!;
    expect(shipTime(ride, 'departure')).toBe('10:10');
    expect(shipTime(ride, 'arrival')).toBe('10:50');
    expect(shipTimestamp(ride, '2030-01-01', 'departure')).toBe(Date.parse('2030-01-01T10:10:00Z'));
  });
  it('keeps on-time journeys at the scheduled ship times', () => {
    expect(shipTime(RIDES[0], 'departure')).toBe('08:30');
    expect(shipTime(RIDES[0], 'arrival')).toBe('09:05');
  });
  it('localizes seat, balance, and cancellation errors', () => {
    expect(paymentError(new Error('Not enough seats remain'), 'es')).toContain('plazas');
    expect(paymentError(new Error('Insufficient demo credits'), 'fr')).toContain('Crédits');
    expect(paymentError(new Error('This ride has departed'), 'en')).toContain('no longer be cancelled');
  });
});
