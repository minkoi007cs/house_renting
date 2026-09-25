import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const WorkspaceOwnerId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    // Return the verified workspaceOwnerId, or fallback to the logged-in user's sub ID
    return request.workspaceOwnerId || request.user?.sub;
  },
);
