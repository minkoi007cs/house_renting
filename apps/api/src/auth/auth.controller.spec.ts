import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtGuard } from '../common/guards/jwt.guard';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    verifySupabaseToken: jest.fn(),
    createOrUpdateUser: jest.fn(),
    verifyGoogleIdToken: jest.fn(),
    createOrUpdateGoogleUser: jest.fn(),
    generateJWT: jest.fn(),
    getUserById: jest.fn(),
  };

  const mockJwtGuard = { canActivate: jest.fn(() => true) };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    })
      .overrideGuard(JwtGuard)
      .useValue(mockJwtGuard)
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('googleAuth', () => {
    it('should verify Google token and return JWT', async () => {
      const mockGoogleUser = { id: 'g-123', email: 'test@gmail.com', name: 'Test User' };
      const mockUser = { id: 'g-123', email: 'test@gmail.com', name: 'Test User' };

      mockAuthService.verifyGoogleIdToken.mockResolvedValue(mockGoogleUser);
      mockAuthService.createOrUpdateGoogleUser.mockResolvedValue(mockUser);
      mockAuthService.generateJWT.mockReturnValue('jwt-token');

      const result = await controller.googleAuth({ idToken: 'google-id-token' });

      expect(result.status).toBe('success');
      expect(result.data.userId).toBe('g-123');
      expect(result.data.token).toBe('jwt-token');
      expect(mockAuthService.verifyGoogleIdToken).toHaveBeenCalledWith('google-id-token');
    });

    it('should throw BadRequestException if idToken is missing', async () => {
      await expect(controller.googleAuth({ idToken: '' })).rejects.toThrow(BadRequestException);
    });
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      const mockUser = { id: 'user-123', email: 'test@gmail.com', name: 'Test User' };
      mockAuthService.getUserById.mockResolvedValue(mockUser);

      const result = await controller.getProfile('user-123');

      expect(result.status).toBe('success');
      expect(result.data.id).toBe('user-123');
      expect(mockAuthService.getUserById).toHaveBeenCalledWith('user-123');
    });
  });
});
