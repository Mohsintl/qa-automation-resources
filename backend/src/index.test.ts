/**
 * Simple test script for the QA Backend API
 * Run with: npm test
 */

import request from 'supertest';
import app from './index';

describe('QA Backend API', () => {
  describe('Health Check', () => {
    it('should return OK status', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('OK');
    });
  });

  describe('Submissions', () => {
    it('should accept valid submissions', async () => {
      const submission = {
        type: 'cheatsheet',
        data: { title: 'Test Cheat Sheet', content: 'Test content' },
        submittedBy: 'Test User'
      };

      const response = await request(app)
        .post('/api/submissions')
        .send(submission);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.submissionId).toBeDefined();
    });

    it('should reject invalid submissions', async () => {
      const response = await request(app)
        .post('/api/submissions')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Missing required fields');
    });
  });

  describe('Approved Content', () => {
    it('should return empty array for unknown type', async () => {
      const response = await request(app).get('/api/approved/unknown');
      expect(response.status).toBe(200);
      expect(response.body.items).toEqual([]);
    });
  });

  describe('404 Handler', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(app).get('/unknown-route');
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Route not found');
    });
  });
});