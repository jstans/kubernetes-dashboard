import React from 'react';
import {
  Flex,
  Avatar,
  AvatarBadge,
  Box,
  Text,
  Badge,
  Tooltip,
} from '@chakra-ui/react';

import Deploy from '../icons/resources/unlabeled/deploy.svg';

const Deployment = ({ name, createdAt, status }) => {
  let statusColor = status === 'Available' ? 'green.500' : 'tomato';
  return (
    <Flex>
      <Tooltip label="Deployment" aria-label="Deployment">
        <Avatar bg={null} icon={<img src={Deploy} alt="Deploy" />}>
          <Tooltip label={status} aria-label={status}>
            <AvatarBadge boxSize="1.25em" bg={statusColor} alt={status} />
          </Tooltip>
        </Avatar>
      </Tooltip>
      <Box ml="3">
        <Text fontWeight="bold">
          {name}
          <Badge ml="1" colorScheme="green">
            New
          </Badge>
        </Text>
        <Text fontSize="sm">
          {new Date(parseInt(createdAt, 10)).toLocaleString()}
        </Text>
      </Box>
    </Flex>
  );
};

export default Deployment;
