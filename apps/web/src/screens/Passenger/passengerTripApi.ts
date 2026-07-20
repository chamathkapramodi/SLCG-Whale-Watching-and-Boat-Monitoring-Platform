const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');

export interface PassengerTripPreview {
  tripId: string;
  boatName: string;
  registrationNumber: string;
  scheduledDepartureUtc: string;
  status: string;
  shoreApproval: string;
  maximumCapacity: number;
  acceptingPassengers: boolean;
}

export async function getPassengerTrip(invitationCode: string): Promise<PassengerTripPreview> {
  const response = await fetch(`${API_BASE_URL}/api/passenger/trips/${encodeURIComponent(invitationCode)}`);
  if (response.status === 404) throw new Error('This trip invitation is invalid or no longer available.');
  if (!response.ok) throw new Error('Unable to load this trip invitation.');
  return response.json() as Promise<PassengerTripPreview>;
}

export interface RegisterPassengerDetails { name:string; identificationNumber:string; phoneNumber:string; passengerType:'local'|'foreign'; gender:'male'|'female'|'other'; ageCategory:'adult'|'child' }
export interface RegisteredPassenger extends RegisterPassengerDetails { id:string; tripId:string; sessionToken:string; sessionExpiresAtUtc:string }

export async function registerTripPassenger(invitationCode:string, details:RegisterPassengerDetails):Promise<RegisteredPassenger> {
  const response=await fetch(`${API_BASE_URL}/api/passenger/trips/${encodeURIComponent(invitationCode)}/passengers`,{
    method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(details),
  });
  if(!response.ok){const problem=await response.json().catch(()=>null) as {message?:string;detail?:string;title?:string;errors?:Record<string,string[]>}|null;const validation=problem?.errors?Object.values(problem.errors).flat()[0]:undefined;throw new Error(problem?.message??validation??problem?.detail??problem?.title??'Passenger registration failed.');}
  return response.json() as Promise<RegisteredPassenger>;
}

export async function verifyReturningPassenger(invitationCode:string,identifier:string):Promise<RegisteredPassenger>{
  const response=await fetch(`${API_BASE_URL}/api/passenger/trips/${encodeURIComponent(invitationCode)}/returning-passenger`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({identifier})});
  if(!response.ok){const problem=await response.json().catch(()=>null) as {message?:string;detail?:string;title?:string}|null;throw new Error(problem?.message??problem?.detail??problem?.title??'Passenger verification failed.');}
  return response.json() as Promise<RegisteredPassenger>;
}
