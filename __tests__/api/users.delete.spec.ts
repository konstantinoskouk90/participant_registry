import request from 'supertest';
import createApp from '../../src/app';
import cache from '../../src/services/cache';

describe('DELETE /users/:id', () => {
  it('Returns all details of an already registered user.', async () => {
    const app = await createApp();
    cache.removeAllKeys();

    const payload = {
      firstName: 'Jane',
      lastName: 'Doe',
      dateOfBirth: '1991-01-01',
      countryCode: '+44',
      phoneNumber: 123456789,
      addressLine1: '123 Test Street',
      addressLine2: 'Flat A',
      postcode: 'T1 1AB',
      city: 'London',
    };

    // Add the user
    request(app)
      .post('/api/v1/users')
      .send(payload)
      .set('Accept', 'application/json')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (err: any) {
        if (err) throw err;
      });

    // Fetch the user
    request(app)
      .delete('/api/v1/users/JD-1')
      .set('Accept', 'application/json')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (err: any) {
        if (err) throw err;
      });
  });

  it('Returns a 404 when a non-existent ID is provided', async () => {
    const app = await createApp();
    cache.removeAllKeys();

    const payload = {
      firstName: 'Jane',
      lastName: 'Doe',
      dateOfBirth: '1991-01-01',
      countryCode: '+44',
      phoneNumber: 123456789,
      addressLine1: '123 Test Street',
      addressLine2: 'Flat A',
      postcode: 'T1 1AB',
      city: 'London',
    };

    // Add the user
    request(app)
      .post('/api/v1/users')
      .send(payload)
      .set('Accept', 'application/json')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (err: any) {
        if (err) throw err;
      });

    // Fetch the user using wrong ID
    // We expect JD-1 (Jane Doe was the first user registered ever)
    // But we search using JD-2 which does not exist in the registry
    request(app)
      .delete('/api/v1/users/JD-2')
      .set('Accept', 'application/json')
      .expect(404)
      .expect('Content-Type', /json/)
      .end(function (err: any) {
        if (err) throw err;
      });
  });
});
