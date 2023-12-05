import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';
import {buildBlogPath} from '../helpers';

export async function GET(context) {
	const posts = await getCollection('blog');
	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		items: posts.filter(a => !a.data.draft).map((post) => ({
      title: post.data.title,
			link: buildBlogPath(post.slug),
      pubDate: post.data.publishedDate,
      author: 'me@matthewbrown.io',
      categories: post.data.category ? [post.data.category] : [],
		})),
	});
}
