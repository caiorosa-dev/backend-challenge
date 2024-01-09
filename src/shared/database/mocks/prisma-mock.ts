export const mockedValues = {
  users: [
    {
      id: 1,
      name: 'Loretta Hagenes',
      email: 'Kelvin78@hotmail.com',
      password: 'SPy4jXHHMdvE0BJ',
    },
    {
      id: 2,
      name: 'Florence Shields',
      email: 'Brandi_Hegmann@gmail.com',
      password: 'R_2lEAd7cP299dN',
    },
    {
      id: 3,
      name: 'Otis Cole',
      email: 'Therese92@hotmail.com',
      password: 'XsiDWpKQiQAqbxd',
    },
  ],
  places: [
    {
      id: 1,
      name: 'Dasia Track',
      city: 'San Marcos',
      state: 'Nevada',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      name: 'Haag Coves',
      city: 'Denton',
      state: 'Illinois',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 3,
      name: "D'Amore Plaza",
      city: 'Wellington',
      state: 'New York',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
};

export const prismaMock = {
  place: {
    create: jest.fn().mockReturnValue(mockedValues.places[0]),
    findMany: jest.fn().mockResolvedValue(mockedValues.places),
    findUnique: jest.fn().mockResolvedValue(mockedValues.places[0]),
    update: jest.fn().mockResolvedValue(mockedValues.places[0]),
    delete: jest.fn(),
  },
  user: {
    create: jest.fn().mockReturnValue(mockedValues.users[0]),
    findMany: jest.fn().mockResolvedValue(mockedValues.users),
    findUnique: jest.fn().mockResolvedValue(mockedValues.users[0]),
    update: jest.fn().mockResolvedValue(mockedValues.users[0]),
    delete: jest.fn(),
  },
};
