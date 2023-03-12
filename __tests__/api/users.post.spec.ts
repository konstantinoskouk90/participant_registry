import request from 'supertest';
import { expect } from 'chai';
import createApp from '../../src/app';
import cache from '../../src/services/cache';

describe('POST /users', () => {
  it('Adds a user to the participant registry generating a unique id.', async function () {
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

    const response = await request(app)
      .post('/api/v1/users')
      .send(payload)
      .set('Accept', 'application/json');

    expect(response.status).equal(200);

    // Expect a correctly generated reference number along
    // with the rest of the payload as the response body
    expect(response.body).deep.equal({
      id: 'JD-1',
      ...payload,
    });
  });

  it('Tries to insert a user to the registry without a firstName and fails to pass the validation', async function () {
    const app = await createApp();
    cache.removeAllKeys();
    
    const payload = {
      lastName: 'Doe',
      dateOfBirth: '1991-01-01',
      countryCode: '+44',
      phoneNumber: 123456789,
      addressLine1: '123 Test Street',
      addressLine2: 'Flat A',
      postcode: 'T1 1AB',
      city: 'London',
    };

    const response = await request(app)
      .post('/api/v1/users')
      .send(payload)
      .set('Accept', 'application/json');

    expect(response.status).equal(400);
    expect(response.body).deep.equal({});
  });

  it('Tries to insert a user to the registry with the phoneNumber field as a string and fails to pass the validation', async function () {
    const app = await createApp();
    cache.removeAllKeys();
    
    const payload = {
      lastName: 'Doe',
      dateOfBirth: '1991-01-01',
      countryCode: '+44',
      phoneNumber: '123456789',
      addressLine1: '123 Test Street',
      addressLine2: 'Flat A',
      postcode: 'T1 1AB',
      city: 'London',
    };

    const response = await request(app)
      .post('/api/v1/users')
      .send(payload)
      .set('Accept', 'application/json');

    expect(response.status).equal(400);
    expect(response.body).deep.equal({});
  });

  it('Tries to insert a user with a phone number that already exists in the registry which causes an error to throw', async function () {
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

    const response1 = await request(app)
      .post('/api/v1/users')
      .send(payload)
      .set('Accept', 'application/json');

    expect(response1.status).equal(200);

    // Expect a correctly generated reference number along
    // with the rest of the payload as the response body
    expect(response1.body).deep.equal({
      id: 'JD-1',
      ...payload,
    });

    const response2 = await request(app)
    .post('/api/v1/users')
    .send(payload)
    .set('Accept', 'application/json');

    expect(response2.status).equal(403);
    expect(response2.body).deep.equal({ error: 'PHONE NUMBER TAKEN' });
  });
});
