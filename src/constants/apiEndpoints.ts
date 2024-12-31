export const API_BASE_URL = "http://localhost:8080/api";

export const API_ENDPOINTS = {
  EVENTS: {
    CREATE: `${API_BASE_URL}/events`,
    GET_ALL: `${API_BASE_URL}/events`,
    GET_ID: `${API_BASE_URL}/events`,
    UPDATE: `${API_BASE_URL}/events`,
    DELETE: `${API_BASE_URL}/events`,
    UPLOAD_IMAGE: `${API_BASE_URL}/events/upload-image`,
  },
  EVENT_TYPES: {
    GET_ALL: `${API_BASE_URL}/event-types`,
    GET_ID: `${API_BASE_URL}/event-types`,
    CREATE: `${API_BASE_URL}/event-types`,
    UPDATE: `${API_BASE_URL}/event-types`,
    DELETE: `${API_BASE_URL}/event-types`,
  },
  EVENT_REGISTRATION: {
    GET_ALL: `${API_BASE_URL}/event_registry`,
    GET_BY_EVENT: `${API_BASE_URL}/event_registry/event`,
  },
  COMPANY: {
    CREATE: `${API_BASE_URL}/company`,
    GET_ALL: `${API_BASE_URL}/company`,
    GET_ID: `${API_BASE_URL}/company`,
    UPDATE: `${API_BASE_URL}/company`,
    DELETE: `${API_BASE_URL}/company`,
  },
  USERS: {
    CREATE: `${API_BASE_URL}/users`,
    GET_ALL: `${API_BASE_URL}/users`,
    GET_ID: `${API_BASE_URL}/users`,
    UPDATE: `${API_BASE_URL}/users`,
    DELETE: `${API_BASE_URL}/users`,
  },
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    INTROSPECT: `${API_BASE_URL}/auth/introspect`,
  },
  DROPDOWN: {
    DROPDOWN: `${API_BASE_URL}/events/dropdown-data`,
  },
} as const;

export const generateDynamicEndpoint = (baseEndpoint: string, id?: string) => {
  return id ? `${baseEndpoint}/${id}` : baseEndpoint;
};
