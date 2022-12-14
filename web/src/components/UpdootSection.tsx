import {
  ChevronUpIcon,
  ChevronDownIcon,
} from '@chakra-ui/icons';
import { Flex, IconButton } from '@chakra-ui/react';
import React, { useState } from 'react';
import {
  PostSnippetFragment,
  useVoteMutation,
} from '../generated/graphql';

interface UpdootSectionProps {
  post: PostSnippetFragment;
}

export const UpdootSection: React.FC<
  UpdootSectionProps
> = ({ post }) => {
  const [loadingState, setLoadingState] = useState<
    'upvote-loading' | 'downvote-loading' | 'not-loading'
  >('not-loading');
  const [, vote] = useVoteMutation();
  return (
    <Flex
      direction="column"
      justifyContent="center"
      alignItems="center"
      mr={4}>
      <IconButton
        onClick={async () => {
          if (post.voteStatus === 1) {
            return;
          }
          setLoadingState('upvote-loading');
          await vote({
            postId: post.id,
            value: 1,
          });
          setLoadingState('not-loading');
        }}
        colorScheme={
          post.voteStatus === 1 ? 'green' : undefined
        }
        isLoading={loadingState === 'upvote-loading'}
        aria-label="upvote"
        icon={<ChevronUpIcon boxSize="24px" />}
      />
      {post.points}
      <IconButton
        onClick={async () => {
          if (post.voteStatus === -1) {
            return;
          }
          setLoadingState('downvote-loading');
          await vote({
            postId: post.id,
            value: -1,
          });
          setLoadingState('not-loading');
        }}
        colorScheme={
          post.voteStatus === -1 ? 'red' : undefined
        }
        isLoading={loadingState === 'downvote-loading'}
        aria-label="downvote"
        icon={<ChevronDownIcon boxSize="24px" />}
      />
    </Flex>
  );
};
