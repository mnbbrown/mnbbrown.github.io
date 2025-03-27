import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';
import {buildBlogPath} from '../helpers';
import { marked } from 'marked';

export async function GET(context) {
	const posts = await getCollection('blog');
	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		items: posts.filter(a => !a.data.draft)
      .sort((a, b) => b.data.publishedDate.valueOf() - a.data.publishedDate.valueOf())
      .map((post) => {
        // Process the content for the RSS feed if there's a body
        let content = '';
        if (post.body) {
          // Convert markdown to HTML for the feed
          content = marked.parse(post.body);
        }
        
        return {
          title: post.data.title,
          link: buildBlogPath(post.slug),
          pubDate: post.data.publishedDate,
          description: post.data.description || '',
          content,
          author: 'Matthew Brown <me@matthewbrown.io>',
          categories: post.data.category ? [post.data.category] : [],
        };
      }),
    customData: `<language>en-us</language>
<lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
<managingEditor>me@matthewbrown.io (Matthew Brown)</managingEditor>
<webMaster>me@matthewbrown.io (Matthew Brown)</webMaster>`,
    stylesheet: '/rss/styles.xsl',
	});
}
