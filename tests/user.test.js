const request = require('supertest')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const app = require('../src/app.js')
const User = require('../src/models/user.js')
const anotherUserId = new mongoose.Types.ObjectId()
const anotherUser = {
    _id: anotherUserId,
    name: 'Test',
    email: 'test@example.com',
    password: 'test@123',
    tokens: [{
        token: jwt.sign({ _id: anotherUserId }, process.env.JWT_SECRET)
    }]
}
beforeEach(async () => {
    await User.deleteMany()
    await new User(anotherUser).save()
})
test('should sigup a new user', async () => {
    await request(app).post('/users').send({
        name: 'Abc',
        email: 'sbc@abc.com',
        password: 'test@123s'
    })
        .expect(201)
})
test('should login existing user', async () => {
    await request(app).post('/users/login').send({
        email: anotherUser.email,
        password: anotherUser.password
    })
        .expect(200)
})
test('should not login user if cred are wrong', async () => {
    await request(app).post('/users/login').send({
        email: anotherUser.email,
        password: 'testklfg'
    })
        .expect(401)
})
test('should get the logged in user profile', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorizaation',`Bearer ${anotherUser.tokens[0].token}`)
        .send()
        .expect(200)
})
test('should not get the user profile without authentication', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})
test('should delete account for user', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorizaation', `Bearer ${anotherUser.tokens[0].token}`)
        .send()
        .expect(200)
})
test('should not delete account for unauthenticated user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})