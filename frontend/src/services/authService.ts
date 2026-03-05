import { api } from './api';

export interface AcceptInvitePayload {
  token: string;
  name: string;
  password: string;
}

export const authService = {
  acceptInvite: async (payload: AcceptInvitePayload) => {
    const response = await api.post('/auth/accept-invite', payload);
    return response.data;
  },
  
  // Future auth methods can go here
};
