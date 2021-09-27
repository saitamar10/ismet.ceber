import styled from '@emotion/styled';
import { mdiMagnify } from '@mdi/js';
import { useState, useMemo } from 'react';

import { BlogIdeas } from '~/blocks/blog-ideas';
import { BlogPostCard } from '~/components/cards';
import { SectionHeading } from '~/components/section-heading';
import { Component, ComponentProps } from '~/elements/base/fc';
import { MasonryGrid } from '~/elements/complex/masonry-grid';
import { Field } from '~/elements/simple/field';
import { SimpleBlogPost } from '~/types';
import { debounce } from '~/utils/debounce';

interface BlogGridProps extends ComponentProps {
  posts?: SimpleBlogPost[];
}

const BlogSection = styled.section`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const BlogsMasonry = styled(MasonryGrid)`
  margin: 1.6rem 0;
  flex: 1;
`;

export const BlogGrid: Component<BlogGridProps> = (props) => {
  const { posts } = props;
  const [search, setSearch] = useState('');
  const [filteredPosts, setFilteredPosts] = useState(posts);

  const filterPosts = debounce(() => {
    setFilteredPosts(
      posts?.filter(
        (post) =>
          post?.title.toLowerCase().includes(search.toLowerCase()) ||
          post?.excerpt?.toLowerCase().includes(search.toLowerCase()),
      ),
    );
  }, 150);

  useMemo(() => {
    filterPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return (
    <BlogSection id={'blog'}>
      <SectionHeading
        size={'3'}
        shadowColor={'green'}
        gradientColor={'green-to-yellow'}
        emoji={'📝'}
      >
        Blog
      </SectionHeading>
      <Field
        tag={'input'}
        iconPath={mdiMagnify}
        type={'text'}
        name={'search-input'}
        label={'Search blog posts'}
        placeholder={'Search blog posts...'}
        value={search}
        onChange={setSearch}
        hideLabel
      />
      <BlogsMasonry gap={'1rem'}>
        {(filteredPosts || []).map((post, i) => {
          return <BlogPostCard key={i} {...post} />;
        })}
      </BlogsMasonry>
      <BlogIdeas />
    </BlogSection>
  );
};