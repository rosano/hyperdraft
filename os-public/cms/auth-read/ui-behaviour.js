/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.WKCReadBehaviour = global.WKCReadBehaviour || {})));
}(this, (function (exports) { 'use strict';

	var moi = {};

	var WCKReadBehaviourPropertyAPIToken;
	var WCKReadBehaviourPropertySubscriptionObjects;
	var WCKReadBehaviourPropertySubscriptionObjectsByID;
	var WCKReadBehaviourPropertySelectedArticle;
	var WCKReadBehaviourPropertySelectedSource;
	var kWKCSubscriptionsOutlookInbox = {
		WKCOutlookID: 'WKCReadSourcesContentListOutlooksListItemInbox',
		WKCOutlookText: OLSKLocalized('WKCReadSourcesContentListItemInboxText'),
		WKCOutlookSearchParameters: {
			WKCArticleIsArchived: {
				'$ne': true,
			},
			WKCArticleIsDiscarded: {
				'$ne': true,
			},
		},
	};
	var kWKCSubscriptionsOutlookArchived = {
		WKCOutlookID: 'WKCReadSourcesContentListOutlooksListItemArchived',
		WKCOutlookText: OLSKLocalized('WKCReadSourcesContentListItemArchivedText'),
		WKCOutlookSearchParameters: {
			WKCArticleIsArchived: true,
			WKCArticleIsDiscarded: {
				'$ne': true,
			},
		},
	};
	var kWKCSubscriptionsOutlookDiscarded = {
		WKCOutlookID: 'WKCReadSourcesContentListOutlooksListItemDiscarded',
		WKCOutlookText: OLSKLocalized('WKCReadSourcesContentListItemDiscardedText'),
		WKCOutlookSearchParameters: {
			WKCArticleIsDiscarded: true,
		},
	};

	//# PROPERTIES

	//_ propertiesAPIToken

	moi.propertiesAPIToken = function (inputData) {
		if (typeof inputData === 'undefined') {
			return WCKReadBehaviourPropertyAPIToken;
		}

		WCKReadBehaviourPropertyAPIToken = inputData;
	};

	//_ propertiesOutlookObjects

	moi.propertiesOutlookObjects = function (inputData) {
		if (typeof inputData === 'undefined') {
			return d3.selectAll('#WKCReadSourcesContentListOutlooksList .WKCReadSourcesContentListChildListItem').data();
		}

		moi.reactOutlookObjects(inputData);
	};

	//_ propertiesSubscriptionObjects

	moi.propertiesSubscriptionObjects = function (inputData) {
		if (typeof inputData === 'undefined') {
			return WCKReadBehaviourPropertySubscriptionObjects;
		}

		moi.reactSubscriptionObjects(inputData);

		moi._propertiesSubscriptionObjectsByID((WCKReadBehaviourPropertySubscriptionObjects = inputData).reduce(function(map, e) {
			map[e.WKCSubscriptionID] = e;
			return map;
		}, {}));
	};

	//_ _propertiesSubscriptionObjectsByID

	moi._propertiesSubscriptionObjectsByID = function (inputData) {
		if (typeof inputData === 'undefined') {
			return WCKReadBehaviourPropertySubscriptionObjectsByID;
		}

		WCKReadBehaviourPropertySubscriptionObjectsByID = inputData;
	};

	//_ propertiesArticleObjects

	moi.propertiesArticleObjects = function (inputData) {
		if (typeof inputData === 'undefined') {
			return d3.selectAll('.WKCReadMasterContentListItem').data();
		}

		moi.reactArticleObjects(inputData);
	};

	//_ propertiesSelectedArticle

	moi.propertiesSelectedArticle = function (inputData) {
		if (typeof inputData === 'undefined') {
			return WCKReadBehaviourPropertySelectedArticle;
		}

		WCKReadBehaviourPropertySelectedArticle = inputData === null ? undefined : inputData;

		moi.reactSelectedArticle();
	};

	//_ propertiesSelectedSource

	moi.propertiesSelectedSource = function (inputData) {
		if (typeof inputData === 'undefined') {
			return WCKReadBehaviourPropertySelectedSource;
		}

		WCKReadBehaviourPropertySelectedSource = inputData === null ? undefined : inputData;

		moi.reactSourcesSelectedSource();
	};

	//# INTERFACE

	//_ interfaceSubscriptionsCreateButtonDidClick

	moi.interfaceSubscriptionsCreateButtonDidClick = function () {
		moi.commandsSubscriptionsCreate();
	};

	//_ interfaceSubscriptionsCreateCloseButtonDidClick

	moi.interfaceSubscriptionsCreateCloseButtonDidClick = function () {
		moi.commandsSubscriptionsCreateClose();
	};

	//_ interfaceArticlesArchiveButtonDidClick

	moi.interfaceArticlesArchiveButtonDidClick = function () {
		if (!moi.propertiesSelectedArticle()) {
			return;
		}

		moi.commandsArticlesArchive(moi.propertiesSelectedArticle());
	};

	//_ interfaceArticlesUnreadButtonDidClick

	moi.interfaceArticlesUnreadButtonDidClick = function () {
		if (!moi.propertiesSelectedArticle()) {
			return;
		}

		moi.commandsArticlesMarkAsUnread(moi.propertiesSelectedArticle());
	};

	//_ interfaceArticlesInboxButtonDidClick

	moi.interfaceArticlesInboxButtonDidClick = function () {
		if (!moi.propertiesSelectedArticle()) {
			return;
		}

		moi.commandsArticlesInbox(moi.propertiesSelectedArticle());
	};

	//_ interfaceArticlesDiscardButtonDidClick

	moi.interfaceArticlesDiscardButtonDidClick = function () {
		if (!moi.propertiesSelectedArticle()) {
			return;
		}

		moi.commandsArticlesDiscard(moi.propertiesSelectedArticle());
	};

	//# COMMANDS

	//_ commandsAlertConnectionError

	moi.commandsAlertConnectionError = function (error) {
		window.alert(OLSKLocalized('WKSharedErrorServiceUnavailable'));

		throw error;
	};

	//_ commandsAlertTokenUnavailable

	moi.commandsAlertTokenUnavailable = function () {
		window.alert(OLSKLocalized('WKSharedErrorTokenUnavailable'));

		throw new Error('WKCAppErrorTokenUnavailable');
	};

	//_ commandsAlertSubscriptionsUnavailable

	moi.commandsAlertSubscriptionsUnavailable = function () {
		window.alert(OLSKLocalized('WKCReadErrorSubscriptionsUnavailableText'));

		throw new Error('WKCReadErrorSubscriptionsUnavailable');
	};

	//_ commandsAlertArticlesUnavailable

	moi.commandsAlertArticlesUnavailable = function () {
		window.alert(OLSKLocalized('WKCReadErrorArticlesUnavailableText'));

		throw new Error('WKCReadErrorArticlesUnavailable');
	};

	//_ commandsSubscriptionsCreate

	moi.commandsSubscriptionsCreate = function () {
		moi.reactSubscriptionsCreateVisibility(true);
	};

	//_ commandsSubscriptionsCreateClose

	moi.commandsSubscriptionsCreateClose = function () {
		moi.reactSubscriptionsCreateVisibility(false);
	};

	//_ commandsSelectArticle

	moi.commandsSelectArticle = function (item) {
		moi.propertiesSelectedArticle(item);

		if (!item) {
			return;
		}

		if (item.WKCArticleIsRead) {
			return;
		}

		moi.commandsArticlesMarkAsRead(item);
	};

	//_ commandsArticlesMarkAsRead

	moi.commandsArticlesMarkAsRead = function (item) {
		d3.json(OLSKCanonicalFor('WKCRouteAPIArticlesUpdate', {
			wkc_article_id: item.WKCArticleID
		}), {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'x-client-key': moi.propertiesAPIToken(),
			},
			body: JSON.stringify({
				WKCArticleIsRead: true,
			}),
		})
		.then(function(responseJSON) {
			Object.assign(item, responseJSON);
		}, moi.commandsArticlesAlertErrorMarkAsRead)
		.finally(function () {
			d3.selectAll('.WKCReadMasterContentListItem').filter(function(obj) {
				return obj === item;
			}).classed('WKCReadMasterContentListItemUnread', !item.WKCArticleIsRead)

			d3.select('#WKCReadDetailToolbarUnreadButton').classed('WKCSubscriptionsHidden', !item.WKCArticleIsRead);
		});;
	};

	//_ commandsArticlesMarkAsUnread

	moi.commandsArticlesMarkAsUnread = function (item) {
		d3.json(OLSKCanonicalFor('WKCRouteAPIArticlesUpdate', {
			wkc_article_id: item.WKCArticleID
		}), {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'x-client-key': moi.propertiesAPIToken(),
			},
			body: JSON.stringify({
				WKCArticleIsRead: null,
			}),
		})
		.then(function(responseJSON) {
			Object.assign(item, responseJSON);
		}, moi.commandsArticlesAlertErrorUpdate)
		.finally(function () {
			d3.selectAll('.WKCReadMasterContentListItem').filter(function(obj) {
				return obj === item;
			}).classed('WKCReadMasterContentListItemUnread', !item.WKCArticleIsRead)

			d3.select('#WKCReadDetailToolbarUnreadButton').classed('WKCSubscriptionsHidden', !item.WKCArticleIsRead);
		});
	};

	//_ commandsArticlesAlertErrorMarkAsRead

	moi.commandsArticlesAlertErrorMarkAsRead = function () {
		window.alert(OLSKLocalized('WKCReadErrorArticlesMarkAsReadText'));

		throw new Error('WKCReadErrorArticlesMarkAsRead');
	};

	//_ commandsArticlesDiscard

	moi.commandsArticlesDiscard = function (item) {
		d3.json(OLSKCanonicalFor('WKCRouteAPIArticlesUpdate', {
			wkc_article_id: item.WKCArticleID
		}), {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'x-client-key': moi.propertiesAPIToken(),
			},
			body: JSON.stringify({
				WKCArticleIsDiscarded: true,
			}),
		}).then(function(responseJSON) {
			Object.assign(item, responseJSON);

			var nextArticle = moi.utilitiesNextArticle();

			moi.propertiesArticleObjects(moi.propertiesArticleObjects().filter(function (e) {
				return e !== item;
			}));

			moi.commandsSelectArticle(nextArticle);
		}, moi.commandsArticlesAlertErrorMarkAsDiscarded);
	};

	//_ commandsArticlesAlertErrorMarkAsDiscarded

	moi.commandsArticlesAlertErrorMarkAsDiscarded = function (error) {
		window.alert(OLSKLocalized('WKCReadErrorArticlesMarkAsDiscardedText'));

		throw error;
	};

	//_ commandsArticlesArchive

	moi.commandsArticlesArchive = function (item) {
		d3.json(OLSKCanonicalFor('WKCRouteAPIArticlesUpdate', {
			wkc_article_id: item.WKCArticleID
		}), {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'x-client-key': moi.propertiesAPIToken(),
			},
			body: JSON.stringify({
				WKCArticleIsArchived: true,
			}),
		}).then(function(responseJSON) {
			Object.assign(item, responseJSON);

			var nextArticle = moi.utilitiesNextArticle()

			moi.propertiesArticleObjects(moi.propertiesArticleObjects().filter(function (e) {
				return e !== item;
			}));

			moi.commandsSelectArticle(nextArticle);
		}, moi.commandsArticlesAlertErrorMarkAsArchived);
	};

	//_ commandsArticlesAlertErrorMarkAsArchived

	moi.commandsArticlesAlertErrorMarkAsArchived = function (error) {
		window.alert(OLSKLocalized('WKCReadErrorArticlesMarkAsArchivedText'));

		throw error;
	};

	//_ commandsArticlesInbox

	moi.commandsArticlesInbox = function (item) {
		d3.json(OLSKCanonicalFor('WKCRouteAPIArticlesUpdate', {
			wkc_article_id: item.WKCArticleID
		}), {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'x-client-key': moi.propertiesAPIToken(),
			},
			body: JSON.stringify({
				WKCArticleIsArchived: null,
				WKCArticleIsDiscarded: null,
			}),
		}).then(function(responseJSON) {
			Object.assign(item, responseJSON);

			var nextArticle = moi.utilitiesNextArticle()

			moi.propertiesArticleObjects(moi.propertiesArticleObjects().filter(function (e) {
				return e !== item;
			}));

			moi.commandsSelectArticle(nextArticle);
		}, moi.commandsArticlesAlertErrorUpdate);
	};

	//_ commandsArticlesAlertErrorUpdate

	moi.commandsArticlesAlertErrorUpdate = function (error) {
		window.alert(OLSKLocalized('WKCReadErrorArticlesUpdateText'));

		throw error;
	};

	//_ commandsSourcesSelect

	moi.commandsSourcesSelect = function (inputData) {
		moi.propertiesSelectedSource(inputData);

		moi.commandsSelectArticle(null);

		moi.reactMasterLoaderVisibility(true);
		moi.propertiesArticleObjects([]);

		moi._commandsSourcesFetchArticles(inputData);
	};

	//_ _commandsSourcesFetchArticles

	moi._commandsSourcesFetchArticles = function (inputData) {
		d3.json(OLSKCanonicalFor('WKCRouteAPIArticlesSearch'), {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-client-key': moi.propertiesAPIToken(),
			},
			body: JSON.stringify(inputData.WKCOutlookSearchParameters),
		}).then(function(responseJSON) {
			if (!Array.isArray(responseJSON)) {
				return moi.commandsAlertArticlesUnavailable();
			}

			moi.propertiesArticleObjects(responseJSON.map(function(e) {
				return Object.assign(e, {
					WKCArticlePublishDate: new Date(e.WKCArticlePublishDate),
				});
			}).sort(WKCReadLogic.WKCReadLogicArticlesSort));
		}, moi.commandsAlertConnectionError)
		.finally(function () {
			moi.reactMasterLoaderVisibility(false);
		});
	};

	//# REACT

	//_ reactOutlookObjects

	moi.reactOutlookObjects = function (outlookObjects) {
		var selection = d3.select('#WKCReadSourcesContentListOutlooksList').selectAll('.WKCReadSourcesContentListChildListItem').data(outlookObjects);
		
		var parentElement = selection.enter()
			.append('li')
				.attr('id', function (obj) {
					return obj.WKCOutlookID
				})
				.classed('WKCReadSourcesContentListChildListItem', true)
				.classed('WKCSharedElementTappable', true)
				.on('click', moi.commandsSourcesSelect);

		parentElement.append('img');

		parentElement.append('span')
			.classed('WKCReadSourcesContentListChildListItemName', true)
			.classed('WKCSubscriptionsText', true);

		parentElement.append('span')
			.attr('class', 'WKCReadSourcesContentListChildListItemUnreadCount')
			.append('span')
				.classed('WKCSubscriptionsText', true);

		parentElement = parentElement.merge(selection);

		parentElement.select('.WKCReadSourcesContentListChildListItemName').text(function(obj) {
			return obj.WKCOutlookText;
		});

		parentElement.select('img').attr('src', function (e) {
			return 'data:image/svg+xml;base64,' + new Identicon(md5(e.WKCOutlookID), {
				margin: 0.2,
				size: 20,
				format: 'svg',
				foreground: [0, 0, 0, 255],
				background: [0, 0, 0, 0],
		  }).toString();
		});

		selection.exit().remove();
	};

	//_ reactSourcesSelectedSource

	moi.reactSourcesSelectedSource = function () {
		d3.selectAll('.WKCReadSourcesContentListChildListItem')
			.classed('WKCReadSourcesContentListChildListItemSelected', function (obj) {
				return obj === moi.propertiesSelectedSource();
			});

		d3.select('#WKCReadDetailToolbarInboxButton').classed('WKCSubscriptionsHidden', moi.propertiesSelectedSource() === kWKCSubscriptionsOutlookInbox);

		d3.select('#WKCReadDetailToolbarArchiveButton').classed('WKCSubscriptionsHidden', moi.propertiesSelectedSource() === kWKCSubscriptionsOutlookArchived);

		d3.select('#WKCReadDetailToolbarDiscardButton').classed('WKCSubscriptionsHidden', moi.propertiesSelectedSource() === kWKCSubscriptionsOutlookDiscarded);
	};

	//_ reactSubscriptionObjects

	moi.reactSubscriptionObjects = function (subscriptionObjects) {
		var selection = d3.select('#WKCReadSourcesContentListSubscriptionsList')
			.selectAll('.WKCReadSourcesContentListChildListItem').data(subscriptionObjects);
		
		var parentElement = selection.enter()
			.append('li')
				.attr('class', 'WKCReadSourcesContentListChildListItem')
				.classed('WKCSharedElementTappable', true)
				.on('click', moi.commandsSourcesSelect);

		parentElement.append('img')
			.classed('WKCSubscriptionsText', true);

		parentElement.append('span')
			.attr('class', 'WKCReadSourcesContentListChildListItemName');

		parentElement.append('span')
			.attr('class', 'WKCReadSourcesContentListChildListItemUnreadCount')
			.append('span')
				.classed('WKCSubscriptionsText', true);

		parentElement = parentElement.merge(selection);

		parentElement.select('.WKCReadSourcesContentListChildListItemName').text(function(obj) {
			return obj.WKCSubscriptionName;
		});

		parentElement.select('img').attr('src', function (e) {
			return 'data:image/svg+xml;base64,' + new Identicon(md5(e.WKCSubscriptionURL), {
				margin: 0.2,
				size: 20,
				format: 'svg',
				foreground: [0, 0, 0, 255],
				background: [0, 0, 0, 0],
		  }).toString();
		});

		moi.reactSourcesUnreadCount();

		selection.exit().remove();
	};

	//_ reactArticleObjects

	moi.reactArticleObjects = function (articleObjects) {
		var selection = d3.select('#WKCReadMasterContentList')
			.selectAll('.WKCReadMasterContentListItem').data(articleObjects);
		
		var parentElement = selection.enter()
			.append('div')
				.attr('class', 'WKCReadMasterContentListItem')
				.classed('WKCSharedElementTappable', true);
		var contextElement = parentElement.append('div').attr('class', 'WKCReadMasterContentListItemContext');

		contextElement.append('span').attr('class', 'WKCReadMasterContentListItemReadStatus').text('⚫︎');
		contextElement.append('span').attr('class', 'WKCReadMasterContentListItemContextSource');
		contextElement.append('span').attr('class', 'WKCReadMasterContentListItemContextTiming');

		parentElement.append('span').attr('class', 'WKCReadMasterContentListItemHeadline');
		parentElement.append('span').attr('class', 'WKCReadMasterContentListItemSnippet');

		parentElement = parentElement.merge(selection);

		parentElement
			.classed('WKCReadMasterContentListItemUnread', function(obj) {
				return !obj.WKCArticleIsRead;
			})
			.on('click', moi.commandsSelectArticle);
		parentElement.select('.WKCReadMasterContentListItemHeadline').text(function(obj) {
			return obj.WKCArticleTitle || 'untitled_article';
		});
		parentElement.select('.WKCReadMasterContentListItemSnippet').text(function(obj) {
			var textarea = document.createElement('textarea');
			
			textarea.innerHTML = obj.WKCArticleSnippet || 'no_snippet';

			var div = document.createElement('div');
			div.innerHTML = textarea.value;

			return div.innerText;
		});
		parentElement.select('.WKCReadMasterContentListItemContextSource').text(function(obj) {
			return moi._propertiesSubscriptionObjectsByID()[obj.WKCArticleSubscriptionID].WKCSubscriptionName;
		});
		parentElement.select('.WKCReadMasterContentListItemContextTiming').text(function(obj) {
			return moment(obj.WKCArticlePublishDate).calendar(null, {
				sameDay: 'hh:mm',
				lastDay: '[Yesterday]',
				lastWeek: 'dddd',
				sameElse: 'YYYY-MM-DD'
			});
		});

		selection.exit().remove();
	};

	//_ reactSubscriptionsCreateVisibility

	moi.reactSubscriptionsCreateVisibility = function (isVisible) {
		d3.select('#WKCReadSubscribe').classed('WKCReadSubscribeActive', isVisible);
		d3.select('#WKCReadSubscribe').classed('WKCReadSubscribeInactive', !isVisible);
	};

	//_ reactSourcesUnreadCount

	moi.reactSourcesUnreadCount = function () {
		return;

		d3.select('#WKCReadSourcesContentListOutlooksListItemInbox .WKCReadSourcesContentListChildListItemUnreadCount')
			.classed('WKCSubscriptionsHidden', !moi.propertiesArticleObjects().filter(function (e) {
				return !e.WKCArticleIsRead;
			}).length)
			.select('.WKCSubscriptionsText')
				.text(moi.propertiesArticleObjects().filter(function (e) {
					return !e.WKCArticleIsRead;
				}).length);

		d3.selectAll('#WKCReadSourcesContentListSubscriptionsList .WKCReadSourcesContentListChildListItemUnreadCount')
			.classed('WKCSubscriptionsHidden', function(obj) {
				return !moi.propertiesArticleObjects().filter(function (e) {
					if (e.WKCArticleSubscriptionID !== obj.WKCSubscriptionID) {
						return false;
					}

					if (e.WKCArticleIsRead) {
						return false;
					}

					return true;
				}).length;
			})
			.select('.WKCSubscriptionsText')
				.text(function(obj) {
					return moi.propertiesArticleObjects().filter(function (e) {
						if (e.WKCArticleSubscriptionID !== obj.WKCSubscriptionID) {
							return false;
						}

						if (e.WKCArticleIsRead) {
							return false;
						}

						return true;
					}).length;
				});
	};

	//_ reactSelectedArticle

	moi.reactSelectedArticle = function () {
		d3.selectAll('.WKCReadMasterContentListItem').classed('WKCReadMasterContentListItemSelected', function(obj) {
			return obj === moi.propertiesSelectedArticle();
		});

		if (!moi.propertiesSelectedArticle()) {
			return d3.select('#WKCReadDetail').classed('WKCReadDetailInactive', true);
		}

		d3.select('#WKCReadDetailContentHeading').text(moi.propertiesSelectedArticle().WKCArticleTitle || 'untitled_article');
		d3.select('#WKCReadDetailContentAuthor').text(moi.propertiesSelectedArticle().WKCArticleAuthor || 'no_author');
		d3.select('#WKCReadDetailContentDate').text(moment(moi.propertiesSelectedArticle().WKCArticlePublishDate).format('MMMM Do YYYY, h:mm:ss a'));
		d3.select('#WKCReadDetailContentSource').text(moi._propertiesSubscriptionObjectsByID()[moi.propertiesSelectedArticle().WKCArticleSubscriptionID].WKCSubscriptionName);
		d3.select('#WKCReadDetailContentLink').attr('href', moi.propertiesSelectedArticle().WKCArticleOriginalURL || moi._propertiesSubscriptionObjectsByID()[moi.propertiesSelectedArticle().WKCArticleSubscriptionID].WKCSubscriptionURL);
		d3.select('#WKCReadDetailContentBody')
			.html((function(inputData) {
				var textarea = document.createElement('textarea');
				
				textarea.innerHTML = moi.propertiesSelectedArticle().WKCArticleBody;

				return textarea.value;
			})(moi.propertiesSelectedArticle().WKCArticleBody))
			.classed('WKCReadDetailContentBodyFile', moi._propertiesSubscriptionObjectsByID()[moi.propertiesSelectedArticle().WKCArticleSubscriptionID].WKCSubscriptionHandler === 'File');

		d3.selectAll('#WKCReadDetailContentBody a').attr('target', '_blank');

		d3.selectAll('#WKCReadDetailContentBody *').each(function (a, b, c) {
			if (!d3.select(this).attr('width')) {
				return null;
			}

			d3.select(this)
				.attr('width', null)
				.style('max-width', '100%')
				.style('height', 'auto');
		});

		d3.select('#WKCReadDetailToolbarUnreadButton').classed('WKCSubscriptionsHidden', !moi.propertiesSelectedArticle().WKCArticleIsRead)

		d3.select('#WKCReadDetail').classed('WKCReadDetailInactive', false);
	};

	//_ reactMasterLoaderVisibility

	moi.reactMasterLoaderVisibility = function (isVisible) {
		d3.select('#WKCReadMasterLoader').classed('WKCSubscriptionsHidden', !isVisible);
	};

	//# SETUP

	//_ setupEverything

	moi.setupEverything = function () {
		moi.setupAPIToken(function () {
			moi.setupSubscriptionObjects(function() {
				moi.setupOutlookObjects();
				
				d3.select('#WKCSubscriptions').classed('WKCSubscriptionsLoading', false);
			});
		});
	};

	//_ setupAPIToken

	moi.setupAPIToken = function (completionHandler) {
		d3.json(OLSKCanonicalFor('WKCRouteAPIToken'), {
			method: 'GET',
		}).then(function(responseJSON) {
			if (!responseJSON.WKCAPIToken) {
				return moi.commandsAlertTokenUnavailable();
			}

			moi.propertiesAPIToken(responseJSON.WKCAPIToken);

			completionHandler();
		}, moi.commandsAlertConnectionError);
	};

	//_ setupSubscriptionObjects

	moi.setupSubscriptionObjects = function (completionHandler) {
		d3.json(OLSKCanonicalFor('WKCRouteAPISubscriptionsSearch'), {
			method: 'GET',
			headers: {
				'x-client-key': moi.propertiesAPIToken(),
			},
		}).then(function(responseJSON) {
			if (!Array.isArray(responseJSON)) {
				return moi.commandsAlertSubscriptionsUnavailable();
			}

			moi.propertiesSubscriptionObjects(responseJSON.map(function(e) {
				return Object.assign(e, {
					WKCSubscriptionDateCreated: new Date(e.WKCSubscriptionDateCreated),
					WKCSubscriptionDateUpdated: new Date(e.WKCSubscriptionDateUpdated),
					WKCSubscriptionFetchDate: new Date(e.WKCSubscriptionFetchDate),
				});
			}));

			completionHandler();
		}, moi.commandsAlertConnectionError);
	};

	//_ setupOutlookObjects

	moi.setupOutlookObjects = function () {
		moi.propertiesOutlookObjects([
			kWKCSubscriptionsOutlookInbox,
			kWKCSubscriptionsOutlookArchived,
			kWKCSubscriptionsOutlookDiscarded,
		]);

		moi.commandsSourcesSelect(kWKCSubscriptionsOutlookInbox);
	};

	//# LIFECYCLE

	//_ lifecyclePageWillLoad

	moi.lifecyclePageWillLoad = function () {
		moi.setupEverything();
	};

	//# UTILITIES

	//_ utilitiesNextArticle

	moi.utilitiesNextArticle = function () {
		var currentIndex = moi.propertiesArticleObjects().indexOf(moi.propertiesSelectedArticle());

		if (currentIndex < (moi.propertiesArticleObjects().length - 1)) {
			return moi.propertiesArticleObjects()[currentIndex + 1];
		}

		if (moi.propertiesArticleObjects().length > 1) {
			return moi.propertiesArticleObjects()[currentIndex - 1]
		}
		
		return null;
	};

	Object.assign(exports, moi);

	Object.defineProperty(exports, '__esModule', { value: true });

})));
