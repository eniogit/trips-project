export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'trips',
    version: '1.0.0',
  },
  servers: [
    {
      url: 'http://localhost:8080',
    },
  ],
  paths: {
    '/locations': {
      get: {
        tags: ['General'],
        summary: 'Get locations',
        responses: {
          '200': {
            description: 'Successful response',
            content: {
              'application/json': {},
            },
          },
        },
      },
    },
    '/trips/saved': {
      get: {
        tags: ['General'],
        summary: 'Get saved trips',
        responses: {
          '200': {
            description: 'Successful response',
            content: {
              'application/json': {},
            },
          },
        },
      },
      post: {
        tags: ['General'],
        summary: 'Save trip',
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                example: {
                  id: '22b200f8-3b56-4e62-b6d7-cd68cb3adc78',
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Successful response',
            content: {
              'application/json': {},
            },
          },
        },
      },
    },
    '/trips/{tripId}': {
      get: {
        tags: ['General'],
        summary: 'Get trip',
        parameters: [
          {
            name: 'tripId',
            in: 'path',
            schema: {
              type: 'string',
            },
            required: true,
            example: '90c9b1dc-cf2a-4d2a-a5f6-2c62b9e5b27d',
          },
        ],
        responses: {
          '200': {
            description: 'Successful response',
            content: {
              'application/json': {},
            },
          },
        },
      },
    },
    '/health': {
      get: {
        tags: ['General'],
        summary: 'Health',
        responses: {
          '200': {
            description: 'Successful response',
            content: {
              'application/json': {},
            },
          },
        },
      },
    },
    '/users/login': {
      post: {
        tags: ['General'],
        summary: 'Login',
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                example: {
                  username: 'eniovrushi',
                  password: '123456789',
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Successful response',
            content: {
              'application/json': {},
            },
          },
        },
      },
    },
    '/users/me': {
      get: {
        tags: ['General'],
        summary: 'Me',
        responses: {
          '200': {
            description: 'Successful response',
            content: {
              'application/json': {},
            },
          },
        },
      },
    },
    '/users/register': {
      post: {
        tags: ['General'],
        summary: 'Register',
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                example: {
                  username: 'eniovrushi',
                  password: '123456789',
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Successful response',
            content: {
              'application/json': {},
            },
          },
        },
      },
    },
    '/trips': {
      get: {
        tags: ['General'],
        summary: 'Search trips',
        parameters: [
          {
            name: 'origin',
            in: 'query',
            schema: {
              type: 'string',
            },
            example: 'PEK',
          },
          {
            name: 'destination',
            in: 'query',
            schema: {
              type: 'string',
            },
            example: 'lax',
          },
          {
            name: 'sort_by',
            in: 'query',
            schema: {
              type: 'string',
            },
            example: 'duration',
          },
        ],
        responses: {
          '200': {
            description: 'Successful response',
            content: {
              'application/json': {},
            },
          },
        },
      },
    },
  },
};
