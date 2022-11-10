import request from 'supertest';

import app from '../../app';
import { Todos } from './todo.models';

beforeAll(async () => {
  try {
    await Todos.drop();
  } catch (error) {
    //
  }
});

describe('GET /api/v1/todos', () => {
  it('responds with an array of todos', async () => {
    return request(app)
      .get('/api/v1/todos')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        expect(res.body).toHaveProperty('length');
        expect(res.body.length).toBe(0);
      });
  });
});

let id = '';
const content = 'Learn TypeScript';
describe('POST /api/v1/todos', () => {
  it('responds with an error if todo is invalid', async () => {
    return request(app)
      .post('/api/v1/todos')
      .set('Accept', 'application/json')
      .send({ content: '' })
      .expect('Content-Type', /json/)
      .expect(422)
      .then((res) => {
        expect(res.body).toHaveProperty('message');
      });
  });
  it('responds with an inserted object', async () => {
    return request(app)
      .post('/api/v1/todos')
      .set('Accept', 'application/json')
      .send({ content, done: false })
      .expect('Content-Type', /json/)
      .expect(201)
      .then((res) => {
        expect(res.body).toHaveProperty('_id');
        id = res.body._id;
        expect(res.body).toHaveProperty('content');
        expect(res.body).toHaveProperty('done');
        expect(res.body.content).toBe(content);
      });
  });
});

describe('GET /api/v1/todos/:id', () => {
  it('responds with a single todo', async () => {
    return request(app)
      .get(`/api/v1/todos/${id}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        expect(res.body).toHaveProperty('_id');
        expect(res.body._id).toBe(id);
        expect(res.body).toHaveProperty('content');
        expect(res.body).toHaveProperty('done');
        expect(res.body.content).toBe(content);
      });
  });
  it('responds with an invalid ObjectId error', (done) => {
    request(app)
      .get(`/api/v1/todos/adfasdfasdfasdfsd`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(422, done);
  });
  it('responds with a not found error', (done) => {
    request(app)
      .get(`/api/v1/todos/636b3de5bc88802dc5a8e269`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404, done);
  });
});

describe('PUT /api/v1/todos/:id', () => {
  it('responds with an updated object', async () => {
    return request(app)
      .put(`/api/v1/todos/${id}`)
      .set('Accept', 'application/json')
      .send({ content, done: true })
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        expect(res.body).toHaveProperty('_id');
        expect(res.body._id).toBe(id);
        expect(res.body).toHaveProperty('content');
        expect(res.body).toHaveProperty('done');
        expect(res.body.done).toBe(true);
      });
  });
  it('responds with an invalid ObjectId error', (done) => {
    request(app)
      .put(`/api/v1/todos/adfasdfasdfasdfsd`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(422, done);
  });
  it('responds with a not found error', (done) => {
    request(app)
      .put(`/api/v1/todos/636b3de5bc88802dc5a8e269`)
      .set('Accept', 'application/json')
      .send({ content: 'Learn TypeScript', done: true })
      .expect('Content-Type', /json/)
      .expect(404, done);
  });
});

describe('DELETE /api/v1/todos/:id', () => {
  it('responds with a 204 status code', (done) => {
    request(app).delete(`/api/v1/todos/${id}`).set('Accept', 'application/json').expect(204, done);
  });
  it('after deleting, get responds with a 404', (done) => {
    request(app).get(`/api/v1/todos/${id}`).set('Accept', 'application/json').expect(404, done);
  });
});
