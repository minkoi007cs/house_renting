import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    verifySupabaseToken: jest.fn(),
    createOrUpdateUser: jest.fn(),
    generateJWT: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('verifyToken', () => {
    it('should verify token and return user with JWT', async () => {
      const mockSupabaseUser = {
        id: '123',
        email: 'test@example.com',
        user_metadata: { full_name: 'Test User' },
      };

      const mockUser = {
        id: '123',
        email: 'test@example.com',
        name: 'Test User',
      };

      const mockJWT = 'jwt-token-here';

      mockAuthService.verifySupabaseToken.mockResolvedValue(mockSupabaseUser);
      mockAuthService.createOrUpdateUser.mockResolvedValue(mockUser);
      mockAuthService.generateJWT.mockReturnValue(mockJWT);

      const result = await controller.verifyToken('Bearer valid-token');

      expect(result.status).toBe('success');
      expect(result.data.userId).toBe('123');
      expect(result.data.email).toBe('test@example.com');
      expect(result.data.token).toBe(mockJWT);
      expect(mockAuthService.verifySupabaseToken).toHaveBeenCalledWith(
        'valid-token',
      );
    });

    it('should throw error if authorization header is missing', async () => {
      expect(() => {
        controller.verifyToken(undefined);
      }).toThrow();
    });

    it('should throw error if token is invalid', async () => {
      mockAuthService.verifySupabaseToken.mockRejectedValue(
        new Error('Invalid token'),
      );

      await expect(
        controller.verifyToken('Bearer invalid-token'),
      ).rejects.toThrow();
    });
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      const result = await controller.getProfile('user-123');

      expect(result.status).toBe('success');
      expect(result.data.userId).toBe('user-123');
    });
  });
});
