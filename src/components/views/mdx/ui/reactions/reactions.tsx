'use client';

import { Ring } from '@uiball/loaders';
import confetti from 'canvas-confetti';
import { cx } from 'classix';
import { useEffect } from 'react';

import {
  award,
  awardOutline,
  mdiBookmark,
  mdiHeart,
  mdiBookmarkOutline,
  mdiHeartOutline,
  mdiThumbUp,
  mdiThumbUpOutline,
} from '@/components/icons';
import { useHasMounted } from '@/hooks/use-has-mounted';
import { useWindowDimensions } from '@/hooks/use-window-dimensions';
import { type ReactionType, useReactions } from '@/providers/reactions';
import { useTheme } from '@/providers/theme';

import {
  ReactionButton,
  ReactionsGroup,
  ReactionIcon as Icon,
} from './reactions.styles';

const confettiOptions = {
  particleCount: 50,
  spread: 60,
  colors: ['#6085de'],
  disableForReducedMotion: true,
  scalar: 0.5,
  gravity: 0.85,
  decay: 0.75,
  ticks: 100,
};

const getConfettiColor = (
  key: ReactionType,
  isDark: boolean,
): Array<`#${string}`> => {
  switch (key) {
    case 'likes': {
      return [isDark ? '#20BF6B' : '#1A9956'];
    }
    case 'loves': {
      return [isDark ? '#EB3B5A' : '#D43551'];
    }
    case 'awards': {
      return [isDark ? '#F7B731' : '#E1752C'];
    }
    case 'bookmarks': {
      return [isDark ? '#A076D9' : '#8854D0'];
    }
    default: {
      return [isDark ? '#afc2ef' : '#2d52ab'];
    }
  }
};

const iconSize = 0.73;
// eslint-disable-next-line max-lines-per-function
export const Reactions = (props: { inProgress?: boolean }) => {
  const { inProgress, ...otherProps } = props;
  const hasMounted = useHasMounted();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const { reactions, incrementReaction, submitting, loading } = useReactions();
  const { isDark } = useTheme();

  const clickReaction = (
    key: ReactionType,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    event?: MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    // Do nothing in SSR or if article is in progress
    if (!hasMounted || inProgress) return;

    // Do nothing if data has not loaded
    if (loading) return;

    // Do nothing if being submitted to db or already pressed
    if (submitting || reactions[key]) return;

    // Submit reactions in production website only
    const hostname = window?.location?.hostname || 'localhost';
    if (hostname !== 'jahir.dev') return;

    if (event) {
      const x = event.clientX / windowWidth;
      const y = event.clientY / windowHeight;
      confetti({
        ...confettiOptions,
        origin: { x, y },
        colors: getConfettiColor(key, isDark),
      });
    }

    incrementReaction?.(key);
  };

  useEffect(() => {
    return () => {
      try {
        confetti.reset();
      } catch (e) {}
    };
  }, []);

  const renderLoaderOrText = (text: string) => {
    return loading ? (
      <Ring
        size={16}
        lineWeight={6}
        speed={2}
        color={'var(--color-tertiary-txt)'}
      />
    ) : (
      text
    );
  };

  if (!reactions && !loading) return null;
  return (
    <ReactionsGroup {...otherProps}>
      <ReactionButton
        outlined
        $reacted={!!reactions?.likes}
        data-reacted={!!reactions?.likes}
        disabled={submitting || loading}
        title={'Like'}
        onClick={(e) => {
          clickReaction('likes', e);
        }}
        className={cx(
          '[--reaction-color:26_153_86]',
          'dark:[--reaction-color:32_191_107]',
        )}
      >
        <Icon
          path={reactions?.likes ? mdiThumbUp : mdiThumbUpOutline}
          size={iconSize}
        />
        {renderLoaderOrText(reactions.likes || '0')}
      </ReactionButton>
      <ReactionButton
        outlined
        $reacted={!!reactions?.loves}
        data-reacted={!!reactions?.loves}
        disabled={submitting || loading}
        title={'Love'}
        onClick={(e) => {
          clickReaction('loves', e);
        }}
        className={cx(
          '[--reaction-color:212_53_81]',
          'dark:[--reaction-color:235_59_90]',
        )}
      >
        <Icon
          path={reactions?.loves ? mdiHeart : mdiHeartOutline}
          size={iconSize}
        />
        {renderLoaderOrText(reactions.loves || '0')}
      </ReactionButton>
      <ReactionButton
        outlined
        $reacted={!!reactions?.awards}
        data-reacted={!!reactions?.awards}
        disabled={submitting || loading}
        title={'Award'}
        onClick={(e) => {
          clickReaction('awards', e);
        }}
        className={cx(
          '[--reaction-color:225_117_44]',
          'dark:[--reaction-color:247_183_49]',
        )}
      >
        <Icon path={reactions?.awards ? award : awardOutline} size={iconSize} />
        {renderLoaderOrText(reactions.awards || '0')}
      </ReactionButton>
      <ReactionButton
        outlined
        $reacted={!!reactions?.bookmarks}
        data-reacted={!!reactions?.bookmarks}
        disabled={submitting || loading}
        title={'Bookmark'}
        onClick={(e) => {
          clickReaction('bookmarks', e);
        }}
        className={cx(
          '[--reaction-color:136_84_208]',
          'dark:[--reaction-color:160_118_217]',
        )}
      >
        <Icon
          path={reactions?.bookmarks ? mdiBookmark : mdiBookmarkOutline}
          size={iconSize}
        />
        {renderLoaderOrText(reactions.bookmarks || '0')}
      </ReactionButton>
    </ReactionsGroup>
  );
};
