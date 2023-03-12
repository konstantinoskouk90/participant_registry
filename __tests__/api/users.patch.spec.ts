import request from 'supertest';
import { expect } from 'chai';
import createApp from '../../src/app';
import cache from '../../src/services/cache';

describe('PATCH /users/:id', () => {
  it('Updates some of the user details successfully', async function () {
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

    // Use the newly generated reference number to update the user's address
    const response2 = await request(app)
      .patch(`/api/v1/users/${response1.body.id}`)
      .send({ addressLine1: 'Elm Street' })
      .set('Accept', 'application/json');

    expect(response2.status).equal(200);
    expect(response2.body.addressLine1).equal('Elm Street');
  });

  it('Tries to incorrectly update the date of birth', async function () {
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
      .patch(`/api/v1/users/${response1.body.id}`)
      .send({
        dateOfBirth: '01-01-1991',
      })
      .set('Accept', 'application/json');

    expect(response2.status).equal(400);
    expect(response2.body).deep.equal({});
  });

  it('Tries to update a user with a phone number that already exists in the registry which causes an error to throw', async function () {
    const app = await createApp();
    cache.removeAllKeys();
    
    // 1st User
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

    // 2nd User
    const payload2 = {
      firstName: 'Test',
      lastName: 'Tester',
      dateOfBirth: '1991-01-01',
      countryCode: '+44',
      phoneNumber: 123456780,
      addressLine1: '123 Test Street',
      addressLine2: 'Flat A',
      postcode: 'T1 1AB',
      city: 'London',
    };

    const response2 = await request(app)
      .post('/api/v1/users')
      .send(payload2)
      .set('Accept', 'application/json');

    expect(response2.status).equal(200);

    // Expect a correctly generated reference number along
    // with the rest of the payload as the response body
    expect(response2.body).deep.equal({
      id: 'TT-2',
      ...payload2,
    });

    // Update 1st User with same phone number as 2nd User
    // We expect it to fail as 2 users cannot have the same phone number
    const response3 = await request(app)
    .patch(`/api/v1/users/${response1.body.id}`)
    .send({
      phoneNumber: 123456780,
    })
    .set('Accept', 'application/json');

    expect(response3.status).equal(403);
    expect(response3.body).deep.equal({ error: 'PHONE NUMBER TAKEN' });
  });
});
