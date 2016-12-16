/*\
title: $:/core/modules/wiki-bulkops.js
type: application/javascript
module-type: wikimethod

Bulk tiddler operations such as rename.

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

/*
Rename a tiddler, and relink any tags or lists that reference it.
*/
function renameTiddler(fromTitle,toTitle,options) {
	var self = this;
	fromTitle = (fromTitle || "").trim();
	toTitle = (toTitle || "").trim();
	options = options || {};
	if(fromTitle && toTitle && fromTitle !== toTitle) {
		// Rename the tiddler itself
		var tiddler = this.getTiddler(fromTitle);
		this.addTiddler(new $tw.Tiddler(tiddler,{title: toTitle},this.getModificationFields()));
		this.deleteTiddler(fromTitle);
		// Rename any tags or lists that reference it
		relinkTiddler(fromTitle,toTitle,options)
	}
}

/*
Relink any tags or lists that reference a given tiddler
*/
function relinkTiddler(fromTitle,toTitle,options) {
	var self = this;
	fromTitle = (fromTitle || "").trim();
	toTitle = (toTitle || "").trim();
	options = options || {};
	if(fromTitle && toTitle && fromTitle !== toTitle) {
		this.each(function(tiddler,title) {
			var type = tiddler.fields.type || "";
			// Don't touch plugins or JavaScript modules
			if(!tiddler.fields["plugin-type"] && type !== "application/javascript") {
				var tags = (tiddler.fields.tags || []).slice(0),
					list = (tiddler.fields.list || []).slice(0),
					isModified = false;
				if(!options.dontRenameInTags) {
					// Rename tags
					$tw.utils.each(tags,function (title,index) {
						if(title === fromTitle) {
console.log("Renaming tag '" + tags[index] + "' to '" + toTitle + "' of tiddler '" + tiddler.fields.title + "'");
							tags[index] = toTitle;
							isModified = true;
						}
					});
				}
				if(!options.dontRenameInLists) {
					// Rename lists
					$tw.utils.each(list,function (title,index) {
						if(title === fromTitle) {
console.log("Renaming list item '" + list[index] + "' to '" + toTitle + "' of tiddler '" + tiddler.fields.title + "'");
							list[index] = toTitle;
							isModified = true;
						}
					});
				}
				if(isModified) {
					self.addTiddler(new $tw.Tiddler(tiddler,{tags: tags, list: list},self.getModificationFields()));
				}
			}
		});
	}
};

exports.renameTiddler = renameTiddler;
exports.relinkTiddler = relinkTiddler;

})();
