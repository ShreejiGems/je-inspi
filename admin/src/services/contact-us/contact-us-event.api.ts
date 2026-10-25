import api from "../api";

export interface Event {
  id: string;
  title: string;
  image: string;
  description: string;
  status: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateEventRequest {
  title: string;
  image: string;
  description: string;
}

export interface UpdateEventRequest {
  title?: string;
  image?: string;
  description?: string;
}

export const eventAPI = {
  createEvent: async (data: CreateEventRequest): Promise<Event> => {
    try {
      const response = await api.post<Event>("/event/create", data);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create event: ${error}`);
    }
  },

  getAllEvents: async (): Promise<Event[]> => {
    try {
      const response = await api.get<Event[]>("/event/get-all");
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch events: ${error}`);
    }
  },

  getAllEnabledEvents: async (): Promise<Event[]> => {
    try {
      const response = await api.get<Event[]>("/event/get-enabled");
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch enabled events: ${error}`);
    }
  },

  getEventById: async (id: string): Promise<Event> => {
    try {
      const response = await api.get<Event>(`/event/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch event: ${error}`);
    }
  },

  updateEvent: async (
    id: string,
    data: UpdateEventRequest
  ): Promise<Event> => {
    try {
      const response = await api.patch<Event>(`/event/${id}`, data);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to update event: ${error}`);
    }
  },

  deleteEvent: async (id: string): Promise<void> => {
    try {
      await api.delete(`/event/${id}`);
    } catch (error) {
      throw new Error(`Failed to delete event: ${error}`);
    }
  },

  enableEvent: async (id: string): Promise<Event> => {
    try {
      const response = await api.put<Event>(`/event/${id}/enable`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to enable event: ${error}`);
    }
  },

  disableEvent: async (id: string): Promise<Event> => {
    try {
      const response = await api.put<Event>(`/event/${id}/disable`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to disable event: ${error}`);
    }
  },
};
