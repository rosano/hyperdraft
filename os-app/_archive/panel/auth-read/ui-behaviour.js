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
	var kWKCReadOutlookInbox = {
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
	var kWKCReadOutlookArchived = {
		WKCOutlookID: 'WKCReadSourcesContentListOutlooksListItemArchived',
		WKCOutlookText: OLSKLocalized('WKCReadSourcesContentListItemArchivedText'),
		WKCOutlookSearchParameters: {
			WKCArticleIsArchived: true,
			WKCArticleIsDiscarded: {
				'$ne': true,
			},
		},
	};
	var kWKCReadOutlookDiscarded = {
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

		moi.reactSelectedArticle(WCKReadBehaviourPropertySelectedArticle);
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
		moi.ControlSubscriptionsCreate();
	};

	//_ interfaceSubscriptionsCreateCloseButtonDidClick

	moi.interfaceSubscriptionsCreateCloseButtonDidClick = function () {
		moi.ControlSubscriptionsCreateClose();
	};

	//_ interfaceArticlesArchiveButtonDidClick

	moi.interfaceArticlesArchiveButtonDidClick = function () {
		if (!moi.propertiesSelectedArticle()) {
			return;
		}

		moi.ControlArticlesArchive(moi.propertiesSelectedArticle());
	};

	//_ interfaceArticlesUnreadButtonDidClick

	moi.interfaceArticlesUnreadButtonDidClick = function () {
		if (!moi.propertiesSelectedArticle()) {
			return;
		}

		moi.ControlArticlesMarkAsUnread(moi.propertiesSelectedArticle());
	};

	//_ interfaceArticlesInboxButtonDidClick

	moi.interfaceArticlesInboxButtonDidClick = function () {
		if (!moi.propertiesSelectedArticle()) {
			return;
		}

		moi.ControlArticlesInbox(moi.propertiesSelectedArticle());
	};

	//_ interfaceArticlesDiscardButtonDidClick

	moi.interfaceArticlesDiscardButtonDidClick = function () {
		if (!moi.propertiesSelectedArticle()) {
			return;
		}

		moi.ControlArticlesDiscard(moi.propertiesSelectedArticle());
	};

	//_ interfaceArticlesLoadRemoteContentButtonDidClick

	moi.interfaceArticlesLoadRemoteContentButtonDidClick = function () {
		if (!moi.propertiesSelectedArticle()) {
			return;
		}

		moi.ControlArticlesLoadRemoteContent();
	};

	//_ interfaceArticlesDeleteShortcutDidClick

	moi.interfaceArticlesDeleteShortcutDidClick = function () {
		if (!moi.propertiesSelectedArticle()) {
			return;
		}

		if (moi.propertiesSelectedSource() === kWKCReadOutlookInbox) {
			return moi.interfaceArticlesDiscardButtonDidClick();
		}

		if (moi.propertiesSelectedSource() === kWKCReadOutlookArchived) {
			return moi.interfaceArticlesInboxButtonDidClick();
		}

		if (moi.propertiesSelectedSource() === kWKCReadOutlookDiscarded) {
			return moi.interfaceArticlesInboxButtonDidClick();
		}
	};

	//# CONTROL

	//_ ControlAlertConnectionError

	moi.ControlAlertConnectionError = function (error) {
		window.alert(OLSKLocalized('WKSharedErrorServiceUnavailable'));

		throw error;
	};

	//_ ControlAlertTokenUnavailable

	moi.ControlAlertTokenUnavailable = function () {
		window.alert(OLSKLocalized('WKSharedErrorTokenUnavailable'));

		throw new Error('WKCAppErrorTokenUnavailable');
	};

	//_ ControlAlertSubscriptionsUnavailable

	moi.ControlAlertSubscriptionsUnavailable = function () {
		window.alert(OLSKLocalized('WKCReadErrorSubscriptionsUnavailableText'));

		throw new Error('WKCReadErrorSubscriptionsUnavailable');
	};

	//_ ControlAlertArticlesUnavailable

	moi.ControlAlertArticlesUnavailable = function () {
		window.alert(OLSKLocalized('WKCReadErrorArticlesUnavailableText'));

		throw new Error('WKCReadErrorArticlesUnavailable');
	};

	//_ ControlSubscriptionsCreate

	moi.ControlSubscriptionsCreate = function () {
		moi.reactSubscriptionsCreateVisibility(true);
	};

	//_ ControlSubscriptionsCreateClose

	moi.ControlSubscriptionsCreateClose = function () {
		moi.reactSubscriptionsCreateVisibility(false);
	};

	//_ ControlSelectArticle

	moi.ControlSelectArticle = function (item) {
		moi.propertiesSelectedArticle(item);

		if (!item) {
			return;
		}

		if (item.WKCArticleIsRead) {
			return;
		}

		moi.ControlArticlesMarkAsRead(item);
	};

	//_ ControlArticlesMarkAsRead

	moi.ControlArticlesMarkAsRead = function (item) {
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
		}, moi.ControlArticlesAlertErrorMarkAsRead)
		.finally(function () {
			d3.selectAll('.WKCReadMasterContentListItem').filter(function(obj) {
				return obj === item;
			}).classed('WKCReadMasterContentListItemUnread', !item.WKCArticleIsRead)

			d3.select('#WKCReadDetailToolbarUnreadButton').classed('KVCSharedHidden', !item.WKCArticleIsRead);
		});;
	};

	//_ ControlArticlesMarkAsUnread

	moi.ControlArticlesMarkAsUnread = function (item) {
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
		}, moi.ControlArticlesAlertErrorUpdate)
		.finally(function () {
			d3.selectAll('.WKCReadMasterContentListItem').filter(function(obj) {
				return obj === item;
			}).classed('WKCReadMasterContentListItemUnread', !item.WKCArticleIsRead)

			d3.select('#WKCReadDetailToolbarUnreadButton').classed('KVCSharedHidden', !item.WKCArticleIsRead);
		});
	};

	//_ ControlArticlesAlertErrorMarkAsRead

	moi.ControlArticlesAlertErrorMarkAsRead = function () {
		window.alert(OLSKLocalized('WKCReadErrorArticlesMarkAsReadText'));

		throw new Error('WKCReadErrorArticlesMarkAsRead');
	};

	//_ ControlArticlesDiscard

	moi.ControlArticlesDiscard = function (item) {
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
				WKCArticleDateDiscarded: new Date(),
			}),
		}).then(function(responseJSON) {
			Object.assign(item, responseJSON);

			var nextArticle = moi.utilitiesNextArticle(item);

			moi.propertiesArticleObjects(moi.propertiesArticleObjects().filter(function (e) {
				return e !== item;
			}));

			moi.ControlSelectArticle(nextArticle);
		}, moi.ControlArticlesAlertErrorMarkAsDiscarded);
	};

	//_ ControlArticlesAlertErrorMarkAsDiscarded

	moi.ControlArticlesAlertErrorMarkAsDiscarded = function (error) {
		window.alert(OLSKLocalized('WKCReadErrorArticlesMarkAsDiscardedText'));

		throw error;
	};

	//_ ControlArticlesArchive

	moi.ControlArticlesArchive = function (item) {
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

			var nextArticle = moi.utilitiesNextArticle(item)

			moi.propertiesArticleObjects(moi.propertiesArticleObjects().filter(function (e) {
				return e !== item;
			}));

			moi.ControlSelectArticle(nextArticle);
		}, moi.ControlArticlesAlertErrorMarkAsArchived);
	};

	//_ ControlArticlesAlertErrorMarkAsArchived

	moi.ControlArticlesAlertErrorMarkAsArchived = function (error) {
		window.alert(OLSKLocalized('WKCReadErrorArticlesMarkAsArchivedText'));

		throw error;
	};

	//_ ControlArticlesInbox

	moi.ControlArticlesInbox = function (item) {
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
				WKCArticleDateDiscarded: null,
			}),
		}).then(function(responseJSON) {
			Object.assign(item, responseJSON);

			var nextArticle = moi.utilitiesNextArticle(item)

			moi.propertiesArticleObjects(moi.propertiesArticleObjects().filter(function (e) {
				return e !== item;
			}));

			moi.ControlSelectArticle(nextArticle);
		}, moi.ControlArticlesAlertErrorUpdate);
	};

	//_ ControlArticlesAlertErrorUpdate

	moi.ControlArticlesAlertErrorUpdate = function (error) {
		window.alert(OLSKLocalized('WKCReadErrorArticlesUpdateText'));

		throw error;
	};

	//_ ControlArticlesLoadRemoteContent

	moi.ControlArticlesLoadRemoteContent = function () {
		d3.selectAll('#WKCReadDetailContentBody img')
			.each(function () {
				d3.select(this)
					.attr('src', d3.select(this).attr('WKCDisabled-src'))
					.attr('srcset', d3.select(this).attr('WKCDisabled-srcset'))
					.attr('WKCDisabled-src', null)
					.attr('WKCDisabled-srcset', null);
			});

		moi.reactArticlesRemoteContentWarningVisibility(false);
	};

	//_ ControlSourcesSelect

	moi.ControlSourcesSelect = function (inputData) {
		moi.propertiesSelectedSource(inputData);

		moi.ControlSelectArticle(null);

		moi.reactMasterLoaderVisibility(true);
		moi.propertiesArticleObjects([]);

		moi._ControlSourcesFetchArticles(inputData);
	};

	//_ _ControlSourcesFetchArticles

	moi._ControlSourcesFetchArticles = function (inputData) {
		d3.json(OLSKCanonicalFor('WKCRouteAPIArticlesSearch'), {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-client-key': moi.propertiesAPIToken(),
			},
			body: JSON.stringify(inputData.WKCOutlookSearchParameters),
		}).then(function(responseJSON) {
			if (!Array.isArray(responseJSON)) {
				return moi.ControlAlertArticlesUnavailable();
			}

			moi.propertiesArticleObjects(responseJSON.map(function(e) {
				return Object.assign(e, {
					WKCArticlePublishDate: new Date(e.WKCArticlePublishDate),
				});
			}).sort(inputData === kWKCReadOutlookDiscarded ? WKCReadLogic.WKCReadLogicArticlesDiscardedSort : WKCReadLogic.WKCReadLogicArticlesSort));
		}, moi.ControlAlertConnectionError)
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
				.classed('OLSKLayoutElementTappable', true)
				.on('click', moi.ControlSourcesSelect);

		parentElement.append('img');

		parentElement.append('span')
			.classed('WKCReadSourcesContentListChildListItemName', true)
			.classed('WKCReadText', true);

		parentElement.append('span')
			.attr('class', 'WKCReadSourcesContentListChildListItemUnreadCount')
			.append('span')
				.classed('WKCReadText', true);

		parentElement = parentElement.merge(selection);

		parentElement.select('.WKCReadSourcesContentListChildListItemName').text(function(obj) {
			return obj.WKCOutlookText;
		});

		parentElement.select('img').attr('src', function (e) {
			if (e.WKCOutlookID === 'WKCReadSourcesContentListOutlooksListItemInbox') {
				return '/panel/_shared/ui-assets/wIKReadInbox.svg';
			}

			if (e.WKCOutlookID === 'WKCReadSourcesContentListOutlooksListItemArchived') {
				return '/panel/_shared/ui-assets/wIKReadArchive.svg';
			}

			if (e.WKCOutlookID === 'WKCReadSourcesContentListOutlooksListItemDiscarded') {
				return '/panel/_shared/ui-assets/wIKReadDiscard.svg';
			}
		});

		selection.exit().remove();
	};

	//_ reactSourcesSelectedSource

	moi.reactSourcesSelectedSource = function () {
		d3.selectAll('.WKCReadSourcesContentListChildListItem')
			.classed('WKCReadSourcesContentListChildListItemSelected', function (obj) {
				return obj === moi.propertiesSelectedSource();
			});

		d3.select('#WKCReadDetailToolbarInboxButton').classed('KVCSharedHidden', moi.propertiesSelectedSource() === kWKCReadOutlookInbox);

		d3.select('#WKCReadDetailToolbarArchiveButton').classed('KVCSharedHidden', moi.propertiesSelectedSource() === kWKCReadOutlookArchived);

		d3.select('#WKCReadDetailToolbarDiscardButton').classed('KVCSharedHidden', moi.propertiesSelectedSource() === kWKCReadOutlookDiscarded);
	};

	//_ reactSubscriptionObjects

	moi.reactSubscriptionObjects = function (subscriptionObjects) {
		return;
		var selection = d3.select('#WKCReadSourcesContentListSubscriptionsList')
			.selectAll('.WKCReadSourcesContentListChildListItem').data(subscriptionObjects);
		
		var parentElement = selection.enter()
			.append('li')
				.attr('class', 'WKCReadSourcesContentListChildListItem')
				.classed('OLSKLayoutElementTappable', true)
				.on('click', moi.ControlSourcesSelect);

		parentElement.append('img')
			.classed('WKCReadText', true);

		parentElement.append('span')
			.attr('class', 'WKCReadSourcesContentListChildListItemName');

		parentElement.append('span')
			.attr('class', 'WKCReadSourcesContentListChildListItemUnreadCount')
			.append('span')
				.classed('WKCReadText', true);

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
				.classed('OLSKLayoutElementTappable', true);
		var contextElement = parentElement.append('div')
			.attr('class', 'WKCReadMasterContentListItemContext');

		contextElement.append('span')
			.attr('class', 'WKCReadMasterContentListItemReadStatus').text('⚫︎');
		contextElement.append('span')
			.attr('class', 'WKCReadMasterContentListItemContextSource');
		contextElement.append('span')
			.attr('class', 'WKCReadMasterContentListItemContextTiming');

		parentElement.append('span').attr('class', 'WKCReadMasterContentListItemHeadline');
		parentElement.append('span').attr('class', 'WKCReadMasterContentListItemSnippet');

		parentElement = parentElement.merge(selection);

		parentElement
			.classed('WKCReadMasterContentListItemUnread', function(obj) {
				return !obj.WKCArticleIsRead;
			})
			.on('click', moi.ControlSelectArticle);
		parentElement.select('.WKCReadMasterContentListItemHeadline')
			.classed('KVCSharedHidden', function(obj) {
				return !obj.WKCArticleTitle;
			})
			.text(function(obj) {
				return obj.WKCArticleTitle;
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
			.classed('KVCSharedHidden', !moi.propertiesArticleObjects().filter(function (e) {
				return !e.WKCArticleIsRead;
			}).length)
			.select('.WKCReadText')
				.text(moi.propertiesArticleObjects().filter(function (e) {
					return !e.WKCArticleIsRead;
				}).length);

		d3.selectAll('#WKCReadSourcesContentListSubscriptionsList .WKCReadSourcesContentListChildListItemUnreadCount')
			.classed('KVCSharedHidden', function(obj) {
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
			.select('.WKCReadText')
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

	moi.reactSelectedArticle = function (item) {
		d3.selectAll('.WKCReadMasterContentListItem').classed('WKCReadMasterContentListItemSelected', function(obj) {
			return obj === item;
		});

		if (!item) {
			return d3.select('#WKCReadDetail').classed('WKCReadDetailInactive', true);
		}

		d3.select('#WKCReadDetailContentHeading')
			.text(item.WKCArticleTitle)
			.classed('KVCSharedHidden', !item.WKCArticleTitle);
		d3.select('#WKCReadDetailContentAuthor')
			.text(item.WKCArticleAuthor)
			.classed('KVCSharedHidden', !item.WKCArticleAuthor)
			.classed('KVCSharedHidden', true);
		d3.select('#WKCReadDetailContentContextTiming').text(moment(item.WKCArticlePublishDate).format('MMMM Do YYYY, h:mm:ss a'));
		d3.select('#WKCReadDetailContentContextSource').text(moi._propertiesSubscriptionObjectsByID()[item.WKCArticleSubscriptionID].WKCSubscriptionName);
		d3.select('#WKCReadDetailContentContextLink').attr('href', item.WKCArticleOriginalURL || moi._propertiesSubscriptionObjectsByID()[item.WKCArticleSubscriptionID].WKCSubscriptionURL);
		d3.select('#WKCReadDetailContentBody')
			.html((function(inputData) {
				var textarea = document.createElement('textarea');

				let contentBody = item.WKCArticleBody
					.replace(/<img(.*)src=(.*)>/g, '<img$1WKCDisabled-src=$2')
					.replace(/<img(.*)srcset=(.*)>/g, '<img$1WKCDisabled-srcset=$2');
				
				textarea.innerHTML = contentBody;;

				moi.reactArticlesRemoteContentWarningVisibility(contentBody !== item.WKCArticleBody);

				return textarea.value;
			})(item.WKCArticleBody))
			.classed('WKCReadDetailContentBodyFile', moi._propertiesSubscriptionObjectsByID()[item.WKCArticleSubscriptionID].WKCSubscriptionHandler === 'File');

		d3.selectAll('#WKCReadDetailContentBody a').attr('target', '_blank');

		d3.selectAll('#WKCReadDetailContentBody *').each(function (a, b, c) {
			d3.select(this)
				.attr('width', null)
				.style('width', null);
		});

		d3.selectAll('#WKCReadDetailContentBody *[aria-hidden="true"]')
			.style('display', 'none');

		d3.select('#WKCReadDetailToolbarUnreadButton').classed('KVCSharedHidden', !item.WKCArticleIsRead)

		d3.select('#WKCReadDetail').classed('WKCReadDetailInactive', false);
	};

	//_ reactArticlesRemoteContentWarningVisibility

	moi.reactArticlesRemoteContentWarningVisibility = function (isVisible) {
		d3.select('#WKCReadDetailContentRemote')
			.classed('KVCSharedHidden', !isVisible);
	};

	//_ reactMasterLoaderVisibility

	moi.reactMasterLoaderVisibility = function (isVisible) {
		d3.select('#WKCReadMasterLoader').classed('KVCSharedHidden', !isVisible);
	};

	//# SETUP

	//_ setupEverything

	moi.setupEverything = function () {
		moi.setupAPIToken(function () {
			moi.setupSubscriptionObjects(function() {
				moi.setupOutlookObjects();
				moi.setupShortcuts();
				
				d3.select('#WKCRead').classed('WKCReadLoading', false);
			});
		});
	};

	//_ setupAPIToken

	moi.setupAPIToken = function (completionHandler) {
		d3.json(OLSKCanonicalFor('WKCRouteAPIToken'), {
			method: 'GET',
		}).then(function(responseJSON) {
			if (!responseJSON.WKCAPIToken) {
				return moi.ControlAlertTokenUnavailable();
			}

			moi.propertiesAPIToken(responseJSON.WKCAPIToken);

			completionHandler();
		}, moi.ControlAlertConnectionError);
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
				return moi.ControlAlertSubscriptionsUnavailable();
			}

			moi.propertiesSubscriptionObjects(responseJSON.map(function(e) {
				return Object.assign(e, {
					WKCSubscriptionDateCreated: new Date(e.WKCSubscriptionDateCreated),
					WKCSubscriptionDateUpdated: new Date(e.WKCSubscriptionDateUpdated),
					WKCSubscriptionFetchDate: new Date(e.WKCSubscriptionFetchDate),
				});
			}));

			completionHandler();
		}, moi.ControlAlertConnectionError);
	};

	//_ setupOutlookObjects

	moi.setupOutlookObjects = function () {
		moi.propertiesOutlookObjects([
			kWKCReadOutlookInbox,
			kWKCReadOutlookArchived,
			kWKCReadOutlookDiscarded,
		]);

		moi.ControlSourcesSelect(kWKCReadOutlookInbox);
	};

	//_ setupShortcuts

	moi.setupShortcuts = function () {
		window.addEventListener('keydown', function (event) {
			if (event.key === 'Backspace') {
				return moi.interfaceArticlesDeleteShortcutDidClick();
			}

			if (event.key === 'Escape') {
				return moi.interfaceSubscriptionsCreateCloseButtonDidClick();
			};
		});
	};

	//# LIFECYCLE

	//_ lifecyclePageWillLoad

	moi.lifecyclePageWillLoad = function () {
		moi.setupEverything();
	};

	//# UTILITIES

	//_ utilitiesNextArticle

	moi.utilitiesNextArticle = function (currentArticle) {
		var currentIndex = moi.propertiesArticleObjects().indexOf(currentArticle);

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
