export interface Event {
  id?: string;
  title: string;
  description: string;
  content: string;
  start_time: string;
  end_time: string;
  site: string;
  max_participants: number;
  event_type_id: string;
  semester_id: string;
  academic_year_id: string;
  image: string;
  is_online: boolean;
  registration_deadline: string;
  status: number;
}
export interface EventType {
  id: string;
  name: string;
}

export interface Semester {
  id: string;
  name: string;
}

export interface AcademicYear {
  id: string;
  name: string;
}
