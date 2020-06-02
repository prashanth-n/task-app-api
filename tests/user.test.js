const request = require('supertest');
const app = require('../src/app');
test('should sigup a new user', async () => {
    await request(app).post('/users').send({
        name:'Test',
        email:'test1@t.com',
        password:'test@123'
    })
    .expect(201)
})