/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

const assert = require('assert');

var mainModule = require('./main');

const k = {
	kStubResponseTwitterTimelineValid: function() {
		return "[{\"created_at\":\"Wed Oct 31 15:59:13 +0000 2018\",\"id_str\":\"alfa\",\"text\":\"bravo\",\"entities\":{\"hashtags\":[],\"symbols\":[],\"user_mentions\":[],\"urls\":[]},\"user\":{\"screen_name\":\"charlie\"}},{\"created_at\":\"Mon Oct 08 13:40:12 +0000 2018\",\"id_str\":\"delta\",\"text\":\"echo\",\"entities\":{\"hashtags\":[],\"symbols\":[],\"user_mentions\":[],\"urls\":[]},\"user\":{\"screen_name\":\"foxtrot\"}}]";
	},
	kStubResponseTwitterTimelineComplete: function() {
		return JSON.stringify([{"created_at":"Wed Oct 31 15:59:13 +0000 2018","id":1057663290741002241,"id_str":"1057663290741002241","text":"RT @AnandWrites: \u201cI\u2019m sorry, I don\u2019t fully understand the issue you are experiencing\u201d may be the best epitaph for the dying fantasy of Sili\u2026","truncated":false,"entities":{"hashtags":[],"symbols":[],"user_mentions":[{"screen_name":"AnandWrites","name":"Anand Giridharadas","id":24889586,"id_str":"24889586","indices":[3,15]}],"urls":[]},"source":"\u003ca href=\"http:\/\/twitter.com\" rel=\"nofollow\"\u003eTwitter Web Client\u003c\/a\u003e","in_reply_to_status_id":null,"in_reply_to_status_id_str":null,"in_reply_to_user_id":null,"in_reply_to_user_id_str":null,"in_reply_to_screen_name":null,"user":{"id":779566,"id_str":"779566","name":"Rosano","screen_name":"rosano","location":"","description":"music | design | technology","url":"https:\/\/t.co\/KVhcO8LNbN","entities":{"url":{"urls":[{"url":"https:\/\/t.co\/KVhcO8LNbN","expanded_url":"http:\/\/rosano.ca","display_url":"rosano.ca","indices":[0,23]}]},"description":{"urls":[]}},"protected":false,"followers_count":97,"friends_count":181,"listed_count":7,"created_at":"Mon Feb 19 01:59:04 +0000 2007","favourites_count":1189,"utc_offset":null,"time_zone":null,"geo_enabled":true,"verified":false,"statuses_count":2107,"lang":"en","contributors_enabled":false,"is_translator":false,"is_translation_enabled":false,"profile_background_color":"131516","profile_background_image_url":"http:\/\/abs.twimg.com\/images\/themes\/theme14\/bg.gif","profile_background_image_url_https":"https:\/\/abs.twimg.com\/images\/themes\/theme14\/bg.gif","profile_background_tile":true,"profile_image_url":"http:\/\/pbs.twimg.com\/profile_images\/809937094797762560\/MtkxXq3s_normal.jpg","profile_image_url_https":"https:\/\/pbs.twimg.com\/profile_images\/809937094797762560\/MtkxXq3s_normal.jpg","profile_link_color":"1B95E0","profile_sidebar_border_color":"FFFFFF","profile_sidebar_fill_color":"EFEFEF","profile_text_color":"333333","profile_use_background_image":true,"has_extended_profile":false,"default_profile":false,"default_profile_image":false,"following":null,"follow_request_sent":null,"notifications":null,"translator_type":"none"},"geo":null,"coordinates":null,"place":null,"contributors":null,"retweeted_status":{"created_at":"Tue Oct 30 16:55:30 +0000 2018","id":1057315068428324864,"id_str":"1057315068428324864","text":"\u201cI\u2019m sorry, I don\u2019t fully understand the issue you are experiencing\u201d may be the best epitaph for the dying fantasy\u2026 https:\/\/t.co\/pyy7fFnu0T","truncated":true,"entities":{"hashtags":[],"symbols":[],"user_mentions":[],"urls":[{"url":"https:\/\/t.co\/pyy7fFnu0T","expanded_url":"https:\/\/twitter.com\/i\/web\/status\/1057315068428324864","display_url":"twitter.com\/i\/web\/status\/1\u2026","indices":[116,139]}]},"source":"\u003ca href=\"http:\/\/twitter.com\/download\/iphone\" rel=\"nofollow\"\u003eTwitter for iPhone\u003c\/a\u003e","in_reply_to_status_id":1057314488087732224,"in_reply_to_status_id_str":"1057314488087732224","in_reply_to_user_id":24889586,"in_reply_to_user_id_str":"24889586","in_reply_to_screen_name":"AnandWrites","user":{"id":24889586,"id_str":"24889586","name":"Anand Giridharadas","screen_name":"AnandWrites","location":"Brooklyn, New York","description":"Author of @WinnersTakeAll (out from @AAKnopf), THE TRUE AMERICAN, & INDIA CALLING. Ex-@NYTimes. NBC political analyst. NYU teacher. @PriyaParker's man. Father.","url":"https:\/\/t.co\/pra2IyI6A9","entities":{"url":{"urls":[{"url":"https:\/\/t.co\/pra2IyI6A9","expanded_url":"https:\/\/www.penguinrandomhouse.com\/books\/539747\/winners-take-all-by-anand-giridharadas\/9780451493248","display_url":"penguinrandomhouse.com\/books\/539747\/w\u2026","indices":[0,23]}]},"description":{"urls":[]}},"protected":false,"followers_count":396769,"friends_count":5778,"listed_count":1781,"created_at":"Tue Mar 17 14:33:12 +0000 2009","favourites_count":11099,"utc_offset":null,"time_zone":null,"geo_enabled":true,"verified":true,"statuses_count":2310,"lang":"en","contributors_enabled":false,"is_translator":false,"is_translation_enabled":false,"profile_background_color":"102BB3","profile_background_image_url":"http:\/\/abs.twimg.com\/images\/themes\/theme1\/bg.png","profile_background_image_url_https":"https:\/\/abs.twimg.com\/images\/themes\/theme1\/bg.png","profile_background_tile":true,"profile_image_url":"http:\/\/pbs.twimg.com\/profile_images\/1042373161138958336\/p5PUzkjE_normal.jpg","profile_image_url_https":"https:\/\/pbs.twimg.com\/profile_images\/1042373161138958336\/p5PUzkjE_normal.jpg","profile_banner_url":"https:\/\/pbs.twimg.com\/profile_banners\/24889586\/1533577962","profile_link_color":"F01351","profile_sidebar_border_color":"FFFFFF","profile_sidebar_fill_color":"FF4B0F","profile_text_color":"F78105","profile_use_background_image":true,"has_extended_profile":false,"default_profile":false,"default_profile_image":false,"following":null,"follow_request_sent":null,"notifications":null,"translator_type":"none"},"geo":null,"coordinates":null,"place":null,"contributors":null,"is_quote_status":false,"retweet_count":45,"favorite_count":200,"favorited":false,"retweeted":false,"lang":"en"},"is_quote_status":false,"retweet_count":45,"favorite_count":0,"favorited":false,"retweeted":false,"lang":"en"},{"created_at":"Mon Oct 08 13:40:12 +0000 2018","id":1049293386249895936,"id_str":"1049293386249895936","text":"#MakeBoxingGreatAgain https:\/\/t.co\/4h6utVw0rM","truncated":false,"entities":{"hashtags":[{"text":"MakeBoxingGreatAgain","indices":[0,21]}],"symbols":[],"user_mentions":[],"urls":[{"url":"https:\/\/t.co\/4h6utVw0rM","expanded_url":"https:\/\/twitter.com\/WordOnRd\/status\/1048383728257576961","display_url":"twitter.com\/WordOnRd\/statu\u2026","indices":[22,45]}]},"source":"\u003ca href=\"http:\/\/twitter.com\" rel=\"nofollow\"\u003eTwitter Web Client\u003c\/a\u003e","in_reply_to_status_id":null,"in_reply_to_status_id_str":null,"in_reply_to_user_id":null,"in_reply_to_user_id_str":null,"in_reply_to_screen_name":null,"user":{"id":779566,"id_str":"779566","name":"Rosano","screen_name":"rosano","location":"","description":"music | design | technology","url":"https:\/\/t.co\/KVhcO8LNbN","entities":{"url":{"urls":[{"url":"https:\/\/t.co\/KVhcO8LNbN","expanded_url":"http:\/\/rosano.ca","display_url":"rosano.ca","indices":[0,23]}]},"description":{"urls":[]}},"protected":false,"followers_count":97,"friends_count":181,"listed_count":7,"created_at":"Mon Feb 19 01:59:04 +0000 2007","favourites_count":1189,"utc_offset":null,"time_zone":null,"geo_enabled":true,"verified":false,"statuses_count":2107,"lang":"en","contributors_enabled":false,"is_translator":false,"is_translation_enabled":false,"profile_background_color":"131516","profile_background_image_url":"http:\/\/abs.twimg.com\/images\/themes\/theme14\/bg.gif","profile_background_image_url_https":"https:\/\/abs.twimg.com\/images\/themes\/theme14\/bg.gif","profile_background_tile":true,"profile_image_url":"http:\/\/pbs.twimg.com\/profile_images\/809937094797762560\/MtkxXq3s_normal.jpg","profile_image_url_https":"https:\/\/pbs.twimg.com\/profile_images\/809937094797762560\/MtkxXq3s_normal.jpg","profile_link_color":"1B95E0","profile_sidebar_border_color":"FFFFFF","profile_sidebar_fill_color":"EFEFEF","profile_text_color":"333333","profile_use_background_image":true,"has_extended_profile":false,"default_profile":false,"default_profile_image":false,"following":null,"follow_request_sent":null,"notifications":null,"translator_type":"none"},"geo":null,"coordinates":null,"place":null,"contributors":null,"is_quote_status":true,"quoted_status_id":1048383728257576961,"quoted_status_id_str":"1048383728257576961","quoted_status":{"created_at":"Sat Oct 06 01:25:33 +0000 2018","id":1048383728257576961,"id_str":"1048383728257576961","text":"Drake tonight in Vegas with @TheNotoriousMMA at the #ufc229 weigh ins. https:\/\/t.co\/17pETksUwJ","truncated":false,"entities":{"hashtags":[{"text":"ufc229","indices":[52,59]}],"symbols":[],"user_mentions":[{"screen_name":"TheNotoriousMMA","name":"Conor McGregor","id":369583954,"id_str":"369583954","indices":[28,44]}],"urls":[],"media":[{"id":1048383703414521857,"id_str":"1048383703414521857","indices":[71,94],"media_url":"http:\/\/pbs.twimg.com\/media\/DoybbHZUwAE3QdN.jpg","media_url_https":"https:\/\/pbs.twimg.com\/media\/DoybbHZUwAE3QdN.jpg","url":"https:\/\/t.co\/17pETksUwJ","display_url":"pic.twitter.com\/17pETksUwJ","expanded_url":"https:\/\/twitter.com\/WordOnRd\/status\/1048383728257576961\/photo\/1","type":"photo","sizes":{"thumb":{"w":150,"h":150,"resize":"crop"},"large":{"w":1238,"h":1216,"resize":"fit"},"small":{"w":680,"h":668,"resize":"fit"},"medium":{"w":1200,"h":1179,"resize":"fit"}}}]},"extended_entities":{"media":[{"id":1048383703414521857,"id_str":"1048383703414521857","indices":[71,94],"media_url":"http:\/\/pbs.twimg.com\/media\/DoybbHZUwAE3QdN.jpg","media_url_https":"https:\/\/pbs.twimg.com\/media\/DoybbHZUwAE3QdN.jpg","url":"https:\/\/t.co\/17pETksUwJ","display_url":"pic.twitter.com\/17pETksUwJ","expanded_url":"https:\/\/twitter.com\/WordOnRd\/status\/1048383728257576961\/photo\/1","type":"photo","sizes":{"thumb":{"w":150,"h":150,"resize":"crop"},"large":{"w":1238,"h":1216,"resize":"fit"},"small":{"w":680,"h":668,"resize":"fit"},"medium":{"w":1200,"h":1179,"resize":"fit"}}}]},"source":"\u003ca href=\"http:\/\/twitter.com\/download\/iphone\" rel=\"nofollow\"\u003eTwitter for iPhone\u003c\/a\u003e","in_reply_to_status_id":null,"in_reply_to_status_id_str":null,"in_reply_to_user_id":null,"in_reply_to_user_id_str":null,"in_reply_to_screen_name":null,"user":{"id":524924132,"id_str":"524924132","name":"Word On Road","screen_name":"WordOnRd","location":"Scorpion ","description":"Official @Drake Fansite | Instagram: WordOnRd | SC: ViewsOnRd | Email: WordOnRd@Gmail.Com","url":"https:\/\/t.co\/lopqyl5qPX","entities":{"url":{"urls":[{"url":"https:\/\/t.co\/lopqyl5qPX","expanded_url":"http:\/\/www.WordOnRoad.net","display_url":"WordOnRoad.net","indices":[0,23]}]},"description":{"urls":[]}},"protected":false,"followers_count":119128,"friends_count":81,"listed_count":716,"created_at":"Thu Mar 15 01:46:36 +0000 2012","favourites_count":2023,"utc_offset":null,"time_zone":null,"geo_enabled":true,"verified":false,"statuses_count":39947,"lang":"en","contributors_enabled":false,"is_translator":false,"is_translation_enabled":false,"profile_background_color":"FFF04D","profile_background_image_url":"http:\/\/abs.twimg.com\/images\/themes\/theme1\/bg.png","profile_background_image_url_https":"https:\/\/abs.twimg.com\/images\/themes\/theme1\/bg.png","profile_background_tile":true,"profile_image_url":"http:\/\/pbs.twimg.com\/profile_images\/1071061704052760579\/3tsUYbS7_normal.jpg","profile_image_url_https":"https:\/\/pbs.twimg.com\/profile_images\/1071061704052760579\/3tsUYbS7_normal.jpg","profile_banner_url":"https:\/\/pbs.twimg.com\/profile_banners\/524924132\/1485915142","profile_link_color":"0099CC","profile_sidebar_border_color":"FFFFFF","profile_sidebar_fill_color":"DDEEF6","profile_text_color":"333333","profile_use_background_image":true,"has_extended_profile":true,"default_profile":false,"default_profile_image":false,"following":null,"follow_request_sent":null,"notifications":null,"translator_type":"none"},"geo":null,"coordinates":null,"place":{"id":"1c69a67ad480e1b1","url":"https:\/\/api.twitter.com\/1.1\/geo\/id\/1c69a67ad480e1b1.json","place_type":"city","name":"Houston","full_name":"Houston, TX","country_code":"US","country":"United States","contained_within":[],"bounding_box":{"type":"Polygon","coordinates":[[[-95.823268,29.522325],[-95.069705,29.522325],[-95.069705,30.1546646],[-95.823268,30.1546646]]]},"attributes":{}},"contributors":null,"is_quote_status":false,"retweet_count":1550,"favorite_count":9808,"favorited":false,"retweeted":false,"possibly_sensitive":false,"lang":"en"},"retweet_count":0,"favorite_count":1,"favorited":false,"retweeted":false,"possibly_sensitive":false,"lang":"und"},{"created_at":"Fri Sep 07 21:53:27 +0000 2018","id":1038183492859899908,"id_str":"1038183492859899908","text":"I would like to make an offering at the altar of @rhythmnecklace. May @starakaj and @mearabai be pleased. \u3030\ufe0f\u2728\ud83c\udfb9\ud83c\udfa7\ud83c\udf9b\ud83d\udd70\ud83d\udd2e\ud83d\udece\u2026 https:\/\/t.co\/34X20JnS5m","truncated":true,"entities":{"hashtags":[],"symbols":[],"user_mentions":[{"screen_name":"rhythmnecklace","name":"Rhythm Necklace","id":2936419850,"id_str":"2936419850","indices":[49,64]},{"screen_name":"starakaj","name":"Sam Tarakajian","id":201850306,"id_str":"201850306","indices":[70,79]},{"screen_name":"mearabai","name":"Meara O'Reilly","id":17206190,"id_str":"17206190","indices":[84,93]}],"urls":[{"url":"https:\/\/t.co\/34X20JnS5m","expanded_url":"https:\/\/twitter.com\/i\/web\/status\/1038183492859899908","display_url":"twitter.com\/i\/web\/status\/1\u2026","indices":[117,140]}]},"source":"\u003ca href=\"http:\/\/twitter.com\" rel=\"nofollow\"\u003eTwitter Web Client\u003c\/a\u003e","in_reply_to_status_id":null,"in_reply_to_status_id_str":null,"in_reply_to_user_id":null,"in_reply_to_user_id_str":null,"in_reply_to_screen_name":null,"user":{"id":779566,"id_str":"779566","name":"Rosano","screen_name":"rosano","location":"","description":"music | design | technology","url":"https:\/\/t.co\/KVhcO8LNbN","entities":{"url":{"urls":[{"url":"https:\/\/t.co\/KVhcO8LNbN","expanded_url":"http:\/\/rosano.ca","display_url":"rosano.ca","indices":[0,23]}]},"description":{"urls":[]}},"protected":false,"followers_count":97,"friends_count":181,"listed_count":7,"created_at":"Mon Feb 19 01:59:04 +0000 2007","favourites_count":1189,"utc_offset":null,"time_zone":null,"geo_enabled":true,"verified":false,"statuses_count":2107,"lang":"en","contributors_enabled":false,"is_translator":false,"is_translation_enabled":false,"profile_background_color":"131516","profile_background_image_url":"http:\/\/abs.twimg.com\/images\/themes\/theme14\/bg.gif","profile_background_image_url_https":"https:\/\/abs.twimg.com\/images\/themes\/theme14\/bg.gif","profile_background_tile":true,"profile_image_url":"http:\/\/pbs.twimg.com\/profile_images\/809937094797762560\/MtkxXq3s_normal.jpg","profile_image_url_https":"https:\/\/pbs.twimg.com\/profile_images\/809937094797762560\/MtkxXq3s_normal.jpg","profile_link_color":"1B95E0","profile_sidebar_border_color":"FFFFFF","profile_sidebar_fill_color":"EFEFEF","profile_text_color":"333333","profile_use_background_image":true,"has_extended_profile":false,"default_profile":false,"default_profile_image":false,"following":null,"follow_request_sent":null,"notifications":null,"translator_type":"none"},"geo":null,"coordinates":null,"place":null,"contributors":null,"is_quote_status":false,"retweet_count":0,"favorite_count":3,"favorited":false,"retweeted":false,"possibly_sensitive":false,"lang":"en"}]);
	},
};

describe('WKCResponseParserInputDataIsTwitterTimeline', function testWKCResponseParserInputDataIsTwitterTimeline() {

	it('returns false if not array', function() {
		assert.strictEqual(mainModule.WKCResponseParserInputDataIsTwitterTimeline(null), false);
	});

	it('returns true', function() {
		assert.strictEqual(mainModule.WKCResponseParserInputDataIsTwitterTimeline([]), true);
	});

});

describe('WKCResponseParserArticlesForTwitterTimeline', function testWKCResponseParserArticlesForTwitterTimeline() {

	it('throws error if param2 not string', function() {
		assert.throws(function() {
			mainModule.WKCResponseParserArticlesForTwitterTimeline('[]', null);
		}, /WKCErrorInvalidInput/);
	});

	it('throws error if param1 not format', function() {
		assert.throws(function() {
			mainModule.WKCResponseParserArticlesForTwitterTimeline('{}', '[]');
		}, /WKCErrorInvalidInput/);
	});

	it('throws error if param2 not format', function() {
		assert.throws(function() {
			mainModule.WKCResponseParserArticlesForTwitterTimeline('[]', '{}');
		}, /WKCErrorInvalidInput/);
	});

	it('returns none if identical', function() {
		assert.deepEqual(mainModule.WKCResponseParserArticlesForTwitterTimeline(k.kStubResponseTwitterTimelineValid(), k.kStubResponseTwitterTimelineValid()), []);
	});

	it('returns none if new empty', function() {
		assert.deepEqual(mainModule.WKCResponseParserArticlesForTwitterTimeline(k.kStubResponseTwitterTimelineValid(), '[]'), []);
	});

	it('returns all if old empty', function() {
		assert.deepEqual(mainModule.WKCResponseParserArticlesForTwitterTimeline(null, k.kStubResponseTwitterTimelineValid()).map(function(e) {
			return e.WKCArticleOriginalGUID;
		}), [
			'alfa',
			'delta',
		]);
	});

	it('returns articles with new guid', function() {
		assert.deepEqual(mainModule.WKCResponseParserArticlesForTwitterTimeline(k.kStubResponseTwitterTimelineValid(), k.kStubResponseTwitterTimelineValid().replace(/alfa/g, 'charlie')).map(function(e) {
			return e.WKCArticleOriginalGUID;
		}), [
			'charlie',
		]);
	});

	it('populates WKCArticleTitle undefined', function() {
		assert.strictEqual(mainModule.WKCResponseParserArticlesForTwitterTimeline(null, k.kStubResponseTwitterTimelineValid()).pop().WKCArticleTitle, undefined);
	});

	it('populates WKCArticleOriginalURL', function() {
		assert.strictEqual(mainModule.WKCResponseParserArticlesForTwitterTimeline(null, k.kStubResponseTwitterTimelineValid()).pop().WKCArticleOriginalURL, 'https://twitter.com/foxtrot/status/delta');
	});

	it('populates WKCArticleOriginalGUID', function() {
		assert.strictEqual(mainModule.WKCResponseParserArticlesForTwitterTimeline(null, k.kStubResponseTwitterTimelineValid()).pop().WKCArticleOriginalGUID, 'delta');
	});

	it('populates WKCArticlePublishDate', function() {
		assert.deepEqual(mainModule.WKCResponseParserArticlesForTwitterTimeline(null, k.kStubResponseTwitterTimelineValid()).pop().WKCArticlePublishDate, new Date('2018-10-08T13:40:12.000Z'));
	});

	it('populates WKCArticleAuthor undefined', function() {
		assert.strictEqual(mainModule.WKCResponseParserArticlesForTwitterTimeline(null, k.kStubResponseTwitterTimelineValid()).pop().WKCArticleAuthor, undefined);
	});

	it('populates WKCArticleBody', function() {
		assert.strictEqual(mainModule.WKCResponseParserArticlesForTwitterTimeline(null, k.kStubResponseTwitterTimelineValid()).pop().WKCArticleBody, 'echo');
	});

	it('populates WKCArticleSnippet undefined', function() {
		assert.strictEqual(mainModule.WKCResponseParserArticlesForTwitterTimeline(null, k.kStubResponseTwitterTimelineValid()).pop().WKCArticleSnippet, undefined);
	});

});
