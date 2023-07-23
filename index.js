const { ApolloServer, gql } = require("apollo-server");
const {
  ApolloServerPluginLandingPageGraphQLPlayground,
} = require("apollo-server-core");
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

  type Participant {
    id: ID!
    user_id: ID!
    event_id: ID!
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
`;

const resolvers = {
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
