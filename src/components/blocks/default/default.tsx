import { ReactElement } from 'react';
import tw from 'twin.macro';

import {
  Link,
  LinkButton,
  CenteredSection,
  Heading,
  Image,
} from '~/components/atoms/simple';
import {
  Component,
  ComponentProps,
  TextShadowOptions,
  GradientOptions,
} from '~/types';

const DefaultContainer = tw(CenteredSection)`
  items-center
  justify-center
  text-center
`;
const FourOhFourContainer = tw(DefaultContainer)`justify-between`;
const FourOhFourWrapper = tw(DefaultContainer)`flex-1`;

const GifImage = tw(Image)`max-width[425px]`;

type ContentType = 'under-construction' | 'four-hundred-four' | 'error';

export interface Content {
  type?: ContentType;
  title: string;
  message: string;
  gif: string;
  alt: string;
  shadowColor?: TextShadowOptions;
  gradientColors?: GradientOptions;
}

interface ContentProps extends ComponentProps, Content {}

export const DefaultContent: Component<ContentProps> = (props) => {
  const {
    type = 'error',
    title,
    message,
    gif,
    alt,
    shadowColor,
    gradientColors,
  } = props;

  const isFourOhFour = type === 'four-hundred-four';

  const renderContactMessage = () => {
    if (type !== 'error') return <></>;
    return (
      <p tw={'mb-20'}>
        Feel free to{' '}
        <Link href={'/contact'} title={'Link to contact page'}>
          contact me
        </Link>{' '}
        and share some details so I can try to fix it.
      </p>
    );
  };

  const renderContent = (): ReactElement => {
    return (
      <>
        <Heading
          size={'2'}
          shadowColor={shadowColor || 'red'}
          gradientColor={gradientColors || 'orange-to-red'}
          tw={'mb-12'}
        >
          {title}
        </Heading>
        <p tw={'last-of-type:(mb-20)'}>{message}</p>
        {renderContactMessage()}
        <LinkButton title={'Link to go to home page'} href={'/'} tw={'mb-20'}>
          Go back home
        </LinkButton>
      </>
    );
  };

  const renderContainer = (children?: ReactElement): ReactElement => {
    return isFourOhFour ? (
      <FourOhFourContainer>{children}</FourOhFourContainer>
    ) : (
      <DefaultContainer>{children}</DefaultContainer>
    );
  };

  return renderContainer(
    <>
      {type === 'four-hundred-four' ? (
        <FourOhFourWrapper>{renderContent()}</FourOhFourWrapper>
      ) : (
        renderContent()
      )}
      <GifImage
        src={gif}
        alt={alt}
        objectFit={isFourOhFour ? 'cover' : 'contain'}
      />
    </>,
  );
};