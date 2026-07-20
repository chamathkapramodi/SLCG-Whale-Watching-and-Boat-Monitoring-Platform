import { create } from 'zustand';
import { operationsApi } from '../../../operations/operationsApi';

export interface Vessel {
  id: string;
  name: string;
  regNo: string;
  imageUrl?: string;
  lat: number;
  lon: number;
  heading: number; 
  color: string;
  status: 'active' | 'idle' | 'emergency';
  certificationApproval: string;
  wildlifeApproval: string;
  shoreApproval: string;
  fullyApproved: boolean;
  coordinatesRecordedAtUtc?: string;
  departureUtc?: string;
  arrivalUtc?: string;
  lengthMeters: number;
  beamMeters: number;
  cruisingSpeedKnots?: number;
  maximumSpeedKnots: number;
  maximumCapacity: number;
  lifeJacketCount: number;
  passengerCount: number;
  childrenCount: number;
  specialNeedsCount: number;
  lifeSaverCount: number;
  diverCount: number;
  coxswainCount: number;
}

interface DashboardState {
  activeVesselId: string | null;
  vessels: Vessel[];
  setActiveVessel: (id: string | null) => void;
  setVessels: (vessels: Vessel[]) => void;
  loadVessels: (token: string) => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  activeVesselId: null,
  
  vessels: [],
  
  setActiveVessel: (id) => set({ activeVesselId: id }),
  setVessels: (vessels) => set({ vessels }),
  loadVessels: async (token) => {
    const records = await operationsApi.vesselMap(token);
    set({ vessels: records.filter((record) => record.latitude != null && record.longitude != null).map((record, index) => ({
      ...record, regNo: record.registrationNumber, lat: record.latitude!, lon: record.longitude!,
      heading: 0, color: record.fullyApproved ? '#10B981' : '#F59E0B',
      status: record.departureUtc && !record.arrivalUtc ? 'active' : 'idle',
    })) });
  },
}));
