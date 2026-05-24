import { Injectable, Inject, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class UserService {
  constructor(@Inject('SUPABASE_CLIENT') private supabase: SupabaseClient) {}

  async getUserProfile(userId: string) {
    const { data, error } = await this.supabase.from('hr_users').select('*').eq('id', userId).single();

    if (error) throw error;
    return data;
  }

  async updateUserProfile(userId: string, data: any) {
    const { data: updated, error } = await this.supabase
      .from('hr_users')
      .update(data)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return updated;
  }

  async inviteUser(inviterId: string, email: string, role: 'viewer' | 'editor') {
    // 1. Verify if the target email is registered
    const { data: targetUser, error: userError } = await this.supabase
      .from('hr_users')
      .select('id')
      .eq('email', email)
      .single();

    if (userError || !targetUser) {
      throw new NotFoundException('The invited email is not registered in Renthub yet. Please ask them to register first!');
    }

    // 2. Prevent self-invitation
    const { data: inviter } = await this.supabase
      .from('hr_users')
      .select('email')
      .eq('id', inviterId)
      .single();

    if (inviter && inviter.email === email) {
      throw new ConflictException('You cannot invite yourself to your own workspace!');
    }

    // 3. Insert or update the invitation
    const { data, error } = await this.supabase
      .from('hr_workspace_invitations')
      .insert([{ inviter_id: inviterId, invitee_email: email, role, status: 'pending' }])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        throw new ConflictException('You have already invited this user!');
      }
      throw error;
    }
    return data;
  }

  async getSentInvitations(inviterId: string) {
    const { data: invites, error } = await this.supabase
      .from('hr_workspace_invitations')
      .select('*')
      .eq('inviter_id', inviterId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const emails = invites.map(i => i.invitee_email);
    if (emails.length > 0) {
      const { data: users } = await this.supabase
        .from('hr_users')
        .select('email, name, avatar_url')
        .in('email', emails);

      if (users) {
        const userMap = new Map(users.map(u => [u.email, u]));
        return invites.map(i => ({
          ...i,
          invitee: userMap.get(i.invitee_email) || { email: i.invitee_email, name: 'Registered User', avatar_url: null }
        }));
      }
    }
    return invites.map(i => ({ ...i, invitee: { email: i.invitee_email, name: null, avatar_url: null } }));
  }

  async getReceivedInvitations(userId: string) {
    const { data: user } = await this.supabase
      .from('hr_users')
      .select('email')
      .eq('id', userId)
      .single();

    if (!user) return [];

    const { data: invites, error } = await this.supabase
      .from('hr_workspace_invitations')
      .select('*, inviter:hr_users(*)')
      .eq('invitee_email', user.email)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return invites;
  }

  async acceptInvitation(userId: string, inviteId: string) {
    const { data: user } = await this.supabase
      .from('hr_users')
      .select('email')
      .eq('id', userId)
      .single();

    if (!user) throw new NotFoundException('User not found');

    const { data: invite, error: fetchError } = await this.supabase
      .from('hr_workspace_invitations')
      .select('*')
      .eq('id', inviteId)
      .single();

    if (fetchError || !invite) throw new NotFoundException('Invitation not found');
    if (invite.invitee_email !== user.email) {
      throw new ForbiddenException('You cannot accept an invitation sent to another email');
    }

    const { data: updated, error } = await this.supabase
      .from('hr_workspace_invitations')
      .update({ status: 'accepted', updated_at: new Date() })
      .eq('id', inviteId)
      .select()
      .single();

    if (error) throw error;
    return updated;
  }

  async rejectInvitation(userId: string, inviteId: string) {
    const { data: user } = await this.supabase
      .from('hr_users')
      .select('email')
      .eq('id', userId)
      .single();

    if (!user) throw new NotFoundException('User not found');

    const { data: invite, error: fetchError } = await this.supabase
      .from('hr_workspace_invitations')
      .select('*')
      .eq('id', inviteId)
      .single();

    if (fetchError || !invite) throw new NotFoundException('Invitation not found');
    if (invite.invitee_email !== user.email) {
      throw new ForbiddenException('You cannot reject an invitation sent to another email');
    }

    const { data: updated, error } = await this.supabase
      .from('hr_workspace_invitations')
      .update({ status: 'rejected', updated_at: new Date() })
      .eq('id', inviteId)
      .select()
      .single();

    if (error) throw error;
    return updated;
  }

  async deleteInvitation(userId: string, inviteId: string) {
    const { data: user } = await this.supabase
      .from('hr_users')
      .select('email')
      .eq('id', userId)
      .single();

    if (!user) throw new NotFoundException('User not found');

    const { data: invite, error: fetchError } = await this.supabase
      .from('hr_workspace_invitations')
      .select('*')
      .eq('id', inviteId)
      .single();

    if (fetchError || !invite) throw new NotFoundException('Invitation not found');

    if (invite.inviter_id !== userId && invite.invitee_email !== user.email) {
      throw new ForbiddenException('You do not have permission to delete this invitation');
    }

    const { error } = await this.supabase
      .from('hr_workspace_invitations')
      .delete()
      .eq('id', inviteId);

    if (error) throw error;
    return { id: inviteId, deleted: true };
  }
}
