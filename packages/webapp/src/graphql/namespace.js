import { gql } from 'urql';

export const namespaceList = gql`
  query namespaceList {
    namespaces {
      name
    }
  }
`;
