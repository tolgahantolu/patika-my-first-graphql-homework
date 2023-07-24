const { ApolloServer, gql } = require("apollo-server");
const {
  ApolloServerPluginLandingPageGraphQLPlayground,
} = require("apollo-server-core");
const { nanoid } = require("nanoid");
const { users, events, participants, locations } = require("./data");

const typeDefs = gql`
  type Event {
    id: ID!
    title: String!
    desc: String!
    date: String
    from: String
    to: String
    location_id: ID!
    location: Location!
    user_id: ID!
    user: User!
    participants: [Participant!]!
  }

  input AddEventInput {
    title: String!
    desc: String!
    date: String
    from: String
    to: String
    location_id: ID!
    user_id: ID!
  }

  input UpdateEventInput {
    title: String
    desc: String
    date: String
    from: String
    to: String
    location_id: ID
    user_id: ID
  }

  type Location {
    id: ID!
    name: String!
    desc: String!
    lat: Float
    lng: Float
  }

  type User {
    id: ID!
    username: String!
    email: String!
  }

  input AddUserInput {
    username: String!
    email: String!
  }

  input UpdateUserInput {
    username: String
    email: String
  }

  type Participant {
    id: ID!
    user_id: ID!
    event_id: ID!
  }

  type DeleteAllOutput {
    count: Int!
  }

  type Query {
    #user
    getUsers: [User!]!
    getUser(id: ID!): User!

    #event
    getEvents: [Event!]!
    getEvent(id: ID!): Event!

    #location
    getLocations: [Location!]!
    getLocation(id: ID!): Location!

    #participant
    getParticipants: [Participant!]!
    getParticipant(id: ID!): Participant!
  }

  type Mutation {
    #user
    addUser(data: AddUserInput!): User!
    updateUser(id: ID!, data: UpdateUserInput!): User!
    deleteUser(id: ID!): User!
    deleteAllUser: DeleteAllOutput!

    #event
    addEvent(data: AddEventInput!): Event!
    updateEvent(id: ID!, data: UpdateEventInput!): Event!
    deleteEvent(id: ID!): Event!
    deleteAllEvent: DeleteAllOutput!
  }
`;

const resolvers = {
  Mutation: {
    // user
    addUser: (_, { data }) => {
      const newUser = { id: nanoid(), ...data };
      users.push(newUser);
      return newUser;
    },
    updateUser: (_, { id, data }) => {
      const userIndex = users.findIndex((user) => user.id == id);
      if (userIndex === -1) throw new Error("User not found!");
      const updatedUser = (users[userIndex] = {
        ...users[userIndex],
        ...data,
      });
      return updatedUser;
    },
    deleteUser: (_, { id }) => {
      const userIndex = users.findIndex((user) => user.id == id);
      if (userIndex === -1) throw new Error("User not found!");
      const deletedUser = users[userIndex];
      users.splice(userIndex, 1);
      return deletedUser;
    },
    deleteAllUser: () => {
      const length = users.length;
      users.splice(0, length);
      return {
        count: length,
      };
    },

    // event
    addEvent: (_, { data }) => {
      const newEvent = { id: nanoid(), ...data };
      events.push(newEvent);
      return newEvent;
    },
    updateEvent: (_, { id, data }) => {
      const eventIndex = events.findIndex((event) => event.id == id);
      if (eventIndex === -1) throw new Error("Event not found!");
      const updatedEvent = (events[eventIndex] = {
        ...events[eventIndex],
        ...data,
      });
      return updatedEvent;
    },
    deleteEvent: (_, { id }) => {
      const eventIndex = events.findIndex((event) => event.id == id);
      if (eventIndex === -1) throw new Error("Event not found!");
      const deletedEvent = events[eventIndex];
      events.splice(eventIndex, 1);
      return deletedEvent;
    },
    deleteAllEvent: () => {
      const length = events.length;
      events.splice(0, length);
      return {
        count: length,
      };
    },
  },
  Query: {
    // user
    getUsers: () => users,
    getUser: (_, { id }) => users.find((user) => user.id == id),

    //event
    getEvents: () => events,
    getEvent: (_, { id }) => events.find((event) => event.id == id),

    //locations
    getLocations: () => locations,
    getLocation: (_, { id }) => locations.find((location) => location.id == id),

    //participants
    getParticipants: () => participants,
    getParticipant: (_, { id }) =>
      participants.find((participant) => participant.id == id),
  },
  Event: {
    user: ({ user_id }) => users.find((user) => user.id == user_id),
    location: ({ location_id }) =>
      locations.find((location) => location.id == location_id),
    participants: ({ id }) =>
      participants.filter((participant) => participant.event_id == id),
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [
    ApolloServerPluginLandingPageGraphQLPlayground({
      // options
    }),
  ],
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
