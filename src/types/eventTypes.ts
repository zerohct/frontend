// types/eventTypes.ts

export enum EventStatus {
  SắpDiễnRa = "SắpDiễnRa",
  ĐangDiễnRa = "ĐangDiễnRa",
  ĐãKếtThúc = "ĐãKếtThúc",
  ĐãHủy = "ĐãHủy",
}

export interface Event {
  eventId: number;
  title: string;
  description: string;
  eventType: string;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  location: string;
  maxParticipants: number;
  currentParticipants: number;
  status: EventStatus;
  createdBy: string;
  image: string | null;
}

export interface EventRequest {
  title: string;
  description: string;
  typeId: number;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  location: string;
  maxParticipants: number;
  image?: File;
}
