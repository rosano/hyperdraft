<div class="OLSKDecorNotice">

This document is a work-in-progress. Feel free to reach out on [Mastodon](https://rosano.ca/mastodon) or [Bluesky](https://rosano.ca/bluesky).

</div>

Hyperdraft helps you organize your thinking with text notes, and makes it simple to turn them into a website.

Inspired by modeless and keyboard-centric [Notational Velocity](http://notational.net) it lets you quickly and easily network your ideas via a simple *double-bracket syntax*.

Use it for ideas, todo lists, brainstorming, recipes, reading notes, journaling, or anything involving writing.

# Item catalog

This is the first and only screen of the app.

On the left side of the interface, you can create, search, and select notes. On the right side, you can edit, archive, publish, and delete.

If you're on a mobile device, clicking an item in the list (left), shows you the details (right).

<div class="OLSKDecorNotice">

Editing the same note on multiple devices at the same time can result in data loss. Editing different notes does note have this issue.

</div>

## The focus

Keyboard shortcuts are based on whether the list or the editor have *the focus*.

If the list has *the focus*, the selected note will highlighted in blue and the search box will have a blue border.

If the editor has *the focus*, the selected note will be highlighted in grey, the search box will have no border, and the editor will show a blinking cursor.

Try alternating between the two with the `Tab` key.

## Notes list

All your notes are listed here. Type text in the search box to filter notes that match the exact text. Click a note to select it and focus the editor.

## Editor

This is a *plaintext* editor, which means there is no formatting, no images, no special magic – literally just plain simple text. What you type is exactly what is saved, and there is nothing there that you cannot see.

# Writing

## The only important thing you might need to learn

Hyperdraft uses the *double-bracket syntax*, which is a popular way to link between notes. It's very simple after you use it for the first time: if you have a note called *apples are crunchy*, you can link to it from another note by enclosing the text "apples are crunchy" in double-brackets, like this ``[[apples are crunchy]]``.

That's really the only thing that might be new or special about this editor. Learning this tiny syntax allows you to click through the links between your notes as well as make pages on a website that link to each other.

## Markdown

You can specify structure and formatting with Markdown, which is a set of symbols that signify things like headings, bold text, links. It is designed to be readable in this kind of *plaintext* editor.

| | Syntax | Result |
:--- | --- | ---
| bold  | `**alfa**` | **alfa** |
| italics  | `*bravo*` | *bravo* |
| heading  | `# charlie` | <h1>charlie</h1> |
| quote  | `> delta` | <blockquote>delta</blockquote> |
| list  | `- echo` | <ul><li>echo</li></ul> |
| horizontal rule  | `* * *` | <hr /> |

See the [Markdown Guide](https://www.markdownguide.org/basic-syntax/) for more examples.

## Headings

When navigating large documents, it's useful to be able to quickly jump between sections. Press the *KVCWriteDetailToolbarJumpButtonText* button or use the shortcut `AccessKey+j` to bring up a list of headings. You can use the `Up` or `Down` key to move between sections, or filter by typing text. Click the heading to close the list, or press `Enter`.

## Links

There are a few different ways to link:

- `[[apples are crunchy]]` internal link
- `[crunchy fruits](apples are crunchy)` internal link with alternate text
- `[essay about fruits](https://example.com)` external link

Notice how they all start with a square bracket.

# Publishing

Connect your *cloud* to make notes accessible to the public Internet. Simply press the `KVCWriteDetailToolbarPublishButtonText` button and a shareable link will appear. In the same location, press the `KVCWriteDetailToolbarRetractButtonText` button to remove public access.

## Custom domain name

By default, the public link may have a long format like

> https://[ your provider's domain name ]/[ your user name ]/public/wikiavec/[ the note's public ID ]

Using a custom domain name requires *hosting*, which means another site will fetch from the public link above and then show the content. You can use a paid service such as [Garden](https://hmm.garden) (no technical knowledge required) or [host it yourself](https://github.com/rosano/flowerpot).

There are three steps to the configuring a custom domain:
1. Run the `KVCWriteLauncherItemConfigureCustomDomainText` command. (See the [Shortcuts](/guide/#shortcuts) for more info)
2. You should see a *root URL* that looks like the one above. Copy it and put it into your *hosting*.
3. Enter your domain name.

Your public links should now have a format like

> https://[ your domain name ]/[ the note's public ID ]

### Home page

After setting up a custom domain, designate any note as the home page with the `KVCWriteDetailLauncherItemSetAsRootPageText` command.

# Shortcuts

<div class="OLSKDecorNotice">

*AccessKey* refers to a one or more shortcut keys followed by a single character. Usually it's `Alt` on Windows or `Control+Alt` on macOS, but it changes [based on your browser and operating system](https://www.w3schools.com/tags/att_global_accesskey.asp#table2).

*Launcher* refers to the app's command runner: press `Alt+Space`, type the command, then press `Enter` to run.

</div>

| Item catalog ||
:--- | ---
| KVCWriteCreateButtonText | `AccessKey+n` |
| Select previous or next item, if filter field is focused | `Up` or `Down` |
| Create item from filter text, if filter field is focused | `Enter` |
| Clear filter text and selected item, focus filter field | `Escape` |

| Editor ||
:--- | ---
| `KVCWriteDetailToolbarArchiveButtonText` | Launcher |
| `KVCWriteDetailToolbarUnarchiveButtonText` | Launcher |
| `KVCWriteDetailLauncherItemCloneText` | Launcher |
| `KVCWriteDetailLauncherItemShowLocalVersionsText` | Launcher |
| `KVCWriteDetailLauncherItemExportText` | Launcher |
| `KVCWriteDetailLauncherItemDebugText` | Launcher |
| KVCWriteDetailToolbarJumpButtonText | `AccessKey+j` |
| Select previous or next note, if filter field is focused | `Up` or `Down` |
| Clear filter text and selected note, focus filter field | `Escape` |
| Open link under cursor | `Cmd+Enter` or `Ctrl+Enter` |

| Editor (while cloud connected) ||
:--- | ---
| `KVCWriteDetailToolbarPublishButtonText` (if not public) | Launcher |
| `KVCWriteDetailLauncherItemOpenPublicLinkText` (if public) | Launcher |
| `KVCWriteDetailLauncherItemSetAsRootPageText` (if public) | Launcher |
| `KVCWriteDetailToolbarRetractButtonText` (if public) | Launcher |

| Global ||
:--- | ---
| Alternate *the focus* between the Notes list and the editor | `Tab` |
| `KVCWriteLauncherItemJournalText` | Launcher |
| `KVCWriteLauncherItemBacklinksText` | Launcher |
| `KVCWriteLauncherItemShowPublicNotesText` | Launcher |
| `KVCWriteRevealArchiveButtonText` | Launcher |
| `OLSKRemoteStorageLauncherItemOpenLoginLinkText` | Launcher |
| `OLSKServiceWorkerLauncherItemReloadText` | Launcher |
| `OLSKServiceWorkerLauncherItemDebugForceUpdateText` | Launcher |
| Launcher | `Alt+Space` |

| Global (import/export) ||
:--- | ---
| `OLSKTransportLauncherItemImportJSONText` | Launcher |
| `KVCWriteLauncherItemImportTXTText` | Launcher |
| `KVCWriteLauncherItemImportNVText` | Launcher |
| `OLSKTransportLauncherItemExportJSONText` | Launcher |
| `KVCWriteLauncherItemExportZIPText` | Launcher |

| Global (while cloud connected) ||
:--- | ---
| `KVCWriteLauncherItemPublishAllText` | Launcher |
| `KVCWriteLauncherItemRetractAllText` | Launcher |
| `KVCWriteLauncherItemConfigureCustomDomainText` | Launcher |
| `KVCWriteLauncherItemRemoveCustomDomainText` | Launcher |
| `KVCWriteLauncherItemConfigureCustomTemplateText` | Launcher |
| `KVCWriteLauncherItemRemoveCustomTemplateText` | Launcher |
| `OLSKRemoteStorageLauncherItemCopyLoginLinkText` | Launcher |
| `OLSKRemoteStorageLauncherItemDebugFlushDataText` | Launcher |

# Add to Home screen on mobile and tablet devices

This web app can be 'installed' and used as if it were a native mobile app (with an icon, working without internet access, running as a standalone app outside of the browser).

1. [Open the app](KVCWriteRoute) in your browser, then follow the steps based on your operating system:

## iOS + Safari
2. Tap the Share button <img height="22" valign="middle" alt="Share button icon" src="/_shared/__external/OLSKUIAssets/_OLSKSharediOSShare.svg" />
3. Tap *Add to Home Screen* <img height="22" valign="middle" alt="Add to Home Screen icon" src="/_shared/__external/OLSKUIAssets/_OLSKSharediOSA2HS.svg">

## Android + Chrome
2. Tap the More button <img height="22" valign="middle" alt="More button icon" src="/_shared/__external/OLSKUIAssets/_OLSKSharedAndroidMore.svg" />
3. Tap *Add to home screen*

# What are remoteStorage and Fission?

[remoteStorage](https://remotestorage.io) and [Fission](https://fission.codes) are open protocols for synchronizing data between multiple devices. Both take the level of control and flexibility of something like email and bring it to your personal data. You could think of it as a USB key for your documents that you can plug into websites to work on your stuff.

You can get a remoteStorage account for free from [5apps](https://5apps.com/storage/) or [host your own](https://remotestorage.io/servers).

You can get a Fission account for free from [Fission Auth](https://auth.fission.codes) or [setup your own server](https://github.com/fission/fission).
