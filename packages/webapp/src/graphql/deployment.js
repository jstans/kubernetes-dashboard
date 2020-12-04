import { gql } from 'urql';

export const deploymentList = gql`
  query deploymentList($name: String!) {
    deployments(namespace: $name) {
      id
      name
      createdAt
      status
    }
  }
`;

export const deploymentAdded = gql`
  subscription deploymentAdded {
    deploymentAdded {
      id
      name
      createdAt
      status
      namespace {
        name
      }
    }
  }
`;

export const deploymentRemoved = gql`
  subscription deploymentRemoved {
    deploymentRemoved {
      id
      namespace {
        name
      }
    }
  }
`;

export const deploymentUpdated = gql`
  subscription deploymentUpdated {
    deploymentUpdated {
      id
      name
      createdAt
      status
      namespace {
        name
      }
    }
  }
`;
