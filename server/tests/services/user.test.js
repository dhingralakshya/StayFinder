const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../../src/models').User;
const userService = require('../../src/services/user');

jest.mock('../../src/models', () => ({
  User: {
    findByPk: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
}));

jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

// Mock HttpErrors as a class
class MockHttpErrors extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}
jest.mock('../../errors/httpErrors', () =>
  jest.fn().mockImplementation((message, status) => new MockHttpErrors(message, status))
);

describe('User Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUser', () => {
    it('returns user if found', async () => {
      const mockUser = { id: 1, name: 'John', toJSON: () => ({ id: 1, name: 'John' }) };
      UserModel.findByPk.mockResolvedValue(mockUser);
      const result = await userService.getUser(1);
      expect(result).toEqual(mockUser);
    });
    it('throws error if user not found', async () => {
      UserModel.findByPk.mockResolvedValue(null);
      await expect(userService.getUser(1)).rejects.toThrow('User not found');
    });
  });

  describe('getAllUsers', () => {
    it('returns all users', async () => {
      const users = [
        { id: 1, name: 'John', toJSON: () => ({ id: 1, name: 'John' }) },
        { id: 2, name: 'Jane', toJSON: () => ({ id: 2, name: 'Jane' }) },
      ];
      UserModel.findAll.mockResolvedValue(users);
      const result = await userService.getAllUsers();
      expect(result).toEqual(users);
    });
  });

  describe('createUser', () => {
    it('throws error if email exists', async () => {
      UserModel.findOne.mockResolvedValue({ id: 1, email: 'test@example.com' });
      await expect(userService.createUser('John', 'test@example.com', 'pass123')).rejects.toThrow('User already registered with this email');
    });
    it('creates user and returns token', async () => {
      UserModel.findOne.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashedpass');
      const newUser = {
        id: 1, name: 'John', email: 'test@example.com', role: 'guest',
        toJSON: () => ({ id: 1, name: 'John', email: 'test@example.com', role: 'guest' }),
      };
      UserModel.create.mockResolvedValue(newUser);
      jwt.sign.mockReturnValue('token123');
      const result = await userService.createUser('John', 'test@example.com', 'pass123');
      expect(result).toEqual({ user: newUser.toJSON(), token: 'token123' });
    });
  });

  describe('loginUser', () => {
    it('throws error if user not found', async () => {
      UserModel.findOne.mockResolvedValue(null);
      await expect(userService.loginUser('test@example.com', 'pass123')).rejects.toThrow('Invalid email or password');
    });
    it('throws error if password invalid', async () => {
      UserModel.findOne.mockResolvedValue({ password: 'hashedpass' });
      bcrypt.compare.mockResolvedValue(false);
      await expect(userService.loginUser('test@example.com', 'pass123')).rejects.toThrow('Invalid email or password');
    });
    it('returns user and token if valid', async () => {
      const user = {
        id: 1, email: 'test@example.com', role: 'guest', password: 'hashedpass',
        toJSON: () => ({ id: 1, email: 'test@example.com', role: 'guest' }),
      };
      UserModel.findOne.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('token123');
      const result = await userService.loginUser('test@example.com', 'pass123');
      expect(result).toEqual({ user: user.toJSON(), token: 'token123' });
    });
  });

  describe('editUser', () => {
    it('throws error if nothing updated', async () => {
      UserModel.update.mockResolvedValue([0]);
      await expect(userService.editUser(1, { name: 'New Name' })).rejects.toThrow('User not found or nothing to update');
    });
    it('returns updated user if success', async () => {
      UserModel.update.mockResolvedValue([1]);
      const updatedUser = { id: 1, name: 'New Name', toJSON: () => ({ id: 1, name: 'New Name' }) };
      UserModel.findByPk.mockResolvedValue(updatedUser);
      const result = await userService.editUser(1, { name: 'New Name' });
      expect(result).toEqual(updatedUser);
    });
  });
});
