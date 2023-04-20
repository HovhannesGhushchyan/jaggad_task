const request = require('supertest');
const app = require('../app');
const { sequelize, User, Notification } = require('../app');

beforeAll(async () => {
    await sequelize.sync({ force: true });
});

// Clean up the database after each test
afterEach(async () => {
    await User.destroy({ where: {} });
    await Notification.destroy({ where: {} });
});

// Test the POST /add-notifications endpoint
describe('POST /add-notifications', () => {
    test('returns 401 Unauthorized when no token is provided', async () => {
        const response = await request(app)
            .post('/add-notifications')
            .send({
                email: 'test@example.com',
                notifications: ['Text #1', 'Text #2'],
            });
        expect(response.status).toBe(401);
    });

    test('returns 400 Bad Request when no email is provided', async () => {
         const response = await request(app)
            .post('/add-notifications')
             .send({
                notifications: ['Text #1', 'Text #2'],
            });
        expect(response.status).toBe(400);
    });

    test('returns 400 Bad Request when no notifications are provided', async () => {
         const response = await request(app)
            .post('/add-notifications')
             .send({
                email: 'test@example.com',
            });
        expect(response.status).toBe(400);
    });

    test('creates a new user and notifications in the database', async () => {
         const response = await request(app)
            .post('/add-notifications')
             .send({
                email: 'test@example.com',
                notifications: ['Text #1', 'Text #2'],
            });
        expect(response.status).toBe(200);
        expect(await User.count()).toBe(1);
        expect(await Notification.count()).toBe(2);
    });
});

// Test the GET /messages endpoint
describe('GET /messages', () => {
    test('returns all users and their notifications', async () => {
        // Create two users with notifications in the database
        const user1 = await User.create({email: 'user1@example.com'});
        await Notification.create({userId: user1.id, text: 'Text #1'});
        await Notification.create({userId: user1.id, text: 'Text #2'});
        const user2 = await User.create({email: 'user2@example.com'});
        await Notification.create({userId: user2.id, text: 'Text #3'});

        // Make a request to the API with the token
        const response = await request(app)
            .get('/messages')

        // Check that the response includes the correct data
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(2);
    })
})