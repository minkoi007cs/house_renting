-- ====================================================================
-- Renthub Workspace Sharing & Collaboration Schema
-- ====================================================================

CREATE TABLE IF NOT EXISTS public.hr_workspace_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inviter_id UUID NOT NULL REFERENCES public.hr_users(id) ON DELETE CASCADE,
  invitee_email VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('viewer', 'editor')),
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  CONSTRAINT hr_invitations_unique_pair UNIQUE (inviter_id, invitee_email)
);

CREATE INDEX IF NOT EXISTS idx_hr_invitations_invitee ON public.hr_workspace_invitations(invitee_email);
CREATE INDEX IF NOT EXISTS idx_hr_invitations_inviter ON public.hr_workspace_invitations(inviter_id);
