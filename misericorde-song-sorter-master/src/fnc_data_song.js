// 2008/7/3 Scripted by K-Factory@migiwa
// 2009/1/27 Modified by K-Factory@migiwa
// 2014/6/29 Modified by nkeronkow
// 2018/11/26 Added to relick's github, changes tracked there
// github.com/relick/touhou-song-sorter

// *****************************************************************************
"use strict";
const str_CenterT = 'Tie!';
const str_CenterB = 'Undo last choice';

const str_ImgPath = 'images/';
const str_YouPath = 'https://www.youtube.com/embed/';
const str_YouLink = 'https://www.youtube.com/watch?v=';

// Up to which position should images be shown for?
var int_ResultRank = 3;

// Maximum number of result rows before being broken off into another table.
var maxRows = 42;

// Letty waz here
const deepFreeze = obj => {
	Object.keys(obj).forEach(prop => {
		if (typeof obj[prop] === 'object') deepFreeze(obj[prop]);
	}); return Object.freeze(obj);
};

// * Game and album titles
// name: used during the sort and in the final result table
// abbrev: abbreviated form (also used during the sort and in the final result table)
// selectionName: used in the initial option table for selecting which titles to sort over
const TITLE = deepFreeze({
	
	Volume1: { name: "Volume 1", image: "", shortName: "Volume 1", abbrev:"Volume 1", },
	Volume2: { name: "Volume 2", image: "", shortName: "Volume 2", abbrev:"Volume 2", }
});

// Not included in main filters, but used for song data display
const EXTRA_TITLES = deepFreeze({
	BAiJR: { image: "w9FZqDn.jpg", shortName: "Bohemian Archive in Japanese Red", abbrev: "BAiJR", },
	EaLND: { image: "YfoRCHQ.jpg", shortName: "Eastern and Little Nature Deity", abbrev: "EaLND", },
	PMiSS: { image: "mu8UUhH.jpg", shortName: "Perfect Memento in Strict Sense", abbrev: "PMiSS", },
	SaBND: { image: "MGwqCJo.jpg", shortName: "Strange and Bright Nature Deity", abbrev: "SaBND", },
	SSiB: { image: "p8GtjLf.jpg", shortName: "Silent Sinner in Blue", abbrev: "SSiB", },
	GoM: { image: "FI9IsdC.jpg", shortName: "The Grimoire of Marisa", abbrev: "GoM", },
	OSP: { image: "Kw2uOqV.jpg", shortName: "Oriental Sacred Place", abbrev: "OSP", },
	FS: { image: "fs.jpg", shortName: "Forbidden Scrollery", abbrev: "FS", },
	TO: { image: "daisakusen.png", shortName: "Touhou Otohanabi", abbrev: "TO", },
});

const getTitleData = function (songTitleDataObj) {
	// We'll have to handle individual song overrides either way (mostly going to be coming from old saved data)

	const titleData = TITLE[songTitleDataObj.title];

	if (!songTitleDataObj.extra) {
		return {
			name: titleData.name,
			image: songTitleDataObj.image || titleData.image,
			shortName: songTitleDataObj.shortName || titleData.shortName,
			abbrev: songTitleDataObj.abbrev || titleData.abbrev,
		};
	}

	// Also handle extra overrides
	const extraTitleData = EXTRA_TITLES[songTitleDataObj.extra];
	return {
		name: titleData.name,
		image: songTitleDataObj.image || extraTitleData.image || titleData.image,
		shortName: songTitleDataObj.shortName || extraTitleData.shortName || titleData.shortName,
		abbrev: songTitleDataObj.abbrev || extraTitleData.abbrev || titleData.abbrev,
	};
}

const CATEGORY = deepFreeze({
	
	Misericorde: { name: "Misericorde", titles: ["Volume1", "Volume2"]},
});

// Number of columns in the selection list.
var int_Colspan = 3;

// * Music information
// [Index: Meaning]
// 0: Track name
const TRACK_NAME = 0;
// 1: Set of titles that this track appears in
const TRACK_TITLES = 1;
// 2: Object specifying the title to draw data from, and any overrides
const TRACK_TITLE_DATA = 2;
// 3: Youtube video ID
const TRACK_YOUTUBE_ID = 3;
// 4: Description of track
const TRACK_DESCRIPTION = 4;
// 5: If the *exact* same track appears in a later game then it should use [1] to specify rather than setting as arrangement.
const TRACK_IS_ARRANGEMENT = 5;
	const ORIGINAL_TRACK = 0;
	const ARRANGED_TRACK = 1;
	const LUTE_TRACK = 2;
// 6: Track type, Album tracks should all be marked as OTHER_THEME.
const TRACK_TYPE = 6;
	const STAGE_THEME = 0;
	const BOSS_THEME = 1;
	const STAGE_AND_BOSS_THEME = 2;
	const OTHER_THEME = 3;

// Old song data format, for transitioning old save data
// 2: Image filename
const LEGACY_TRACK_IMAGE = 2;
// 4: Title (game/album) name
const LEGACY_TRACK_TITLE_NAME = 4;
// 5: Title (game/album) abbreviation
const LEGACY_TRACK_TITLE_ABBREV = 5;

var ary_SongData = [

	//Volume 1
	["Misericorde",						new Set([TITLE.Volume1]), { title: "Volume1", },"IWyTIh2NZ9k", "Track 01", ORIGINAL_TRACK, OTHER_THEME],
	["Spooky Stories",					new Set([TITLE.Volume1]), { title: "Volume1", },"VXxIV6dbfA0", "Track 02", ORIGINAL_TRACK, OTHER_THEME],
	["Candida Navis",					new Set([TITLE.Volume1]), { title: "Volume1", },"XYWwVEEGxaA", "Track 03", ORIGINAL_TRACK, OTHER_THEME],
	["Conspiracy",			 			new Set([TITLE.Volume1]), { title: "Volume1", },"CIRTcHKevWU", "Track 04", ORIGINAL_TRACK, OTHER_THEME],
	["Glass Chapel",						new Set([TITLE.Volume1]), { title: "Volume1", },"SqGnVT5s5KA", "Track 05", ORIGINAL_TRACK, OTHER_THEME],
	["Oblation",							new Set([TITLE.Volume1]), { title: "Volume1", },"-nxp2VLktEo", "Track 06", ORIGINAL_TRACK, OTHER_THEME],
	["Aultre Venus",						new Set([TITLE.Volume1]), { title: "Volume1", },"dnUv3NWIEIM", "Track 07", ORIGINAL_TRACK, OTHER_THEME],
	["Pareidolia",						new Set([TITLE.Volume1]), { title: "Volume1", },"WKC0gG--vOs", "Track 08", ORIGINAL_TRACK, OTHER_THEME],
	["Scivia",							new Set([TITLE.Volume1]), { title: "Volume1", },"T9zgjyVDOt0", "Track 09", ORIGINAL_TRACK, OTHER_THEME],
	["Deep in the Walls",				new Set([TITLE.Volume1]), { title: "Volume1", },"P0AWy0QKij4", "Track 10", ORIGINAL_TRACK, OTHER_THEME],
	["Bile Black",						new Set([TITLE.Volume1]), { title: "Volume1", },"DzbiAPnx7hk", "Track 11", ORIGINAL_TRACK, OTHER_THEME],
	["Quiet Mountain",					new Set([TITLE.Volume1]), { title: "Volume1", },"BQu4vmgw8Bg", "Track 12", ORIGINAL_TRACK, OTHER_THEME],
	["Enchanté!",						new Set([TITLE.Volume1]), { title: "Volume1", },"hs-sToqPi_c", "Track 13", ORIGINAL_TRACK, OTHER_THEME],
	["Shepherd's Crook",					new Set([TITLE.Volume1]), { title: "Volume1", },"cDRSrEPfdr0", "Track 14", ORIGINAL_TRACK, OTHER_THEME],
	["Being Sneaky",						new Set([TITLE.Volume1]), { title: "Volume1", },"WhDScN8xDt8", "Track 15", ORIGINAL_TRACK, OTHER_THEME],
	["Suspicion",						new Set([TITLE.Volume1]), { title: "Volume1", },"qE7LHFntlzU", "Track 16", ORIGINAL_TRACK, OTHER_THEME],
	["Chroniclers",						new Set([TITLE.Volume1]), { title: "Volume1", },"-kgJWacDOrU", "Track 17", ORIGINAL_TRACK, OTHER_THEME],
	["Lectio Divina",					new Set([TITLE.Volume1]), { title: "Volume1", },"hQNFZrf8bJc", "Track 18", ORIGINAL_TRACK, OTHER_THEME],
	["Each Day Here",					new Set([TITLE.Volume1]), { title: "Volume1", },"Jt4BZbJGudM", "Track 19", ORIGINAL_TRACK, OTHER_THEME],
	["Lute Ambience 1",					new Set([TITLE.Volume1]), { title: "Volume1", },"k7z9mHVZiNY", "Track 20", LUTE_TRACK, OTHER_THEME],
	["Bossa Profunda",					new Set([TITLE.Volume1]), { title: "Volume1", },"dY77jW1e7K0", "Track 21", ORIGINAL_TRACK, OTHER_THEME],
	["Cauue",							new Set([TITLE.Volume1]), { title: "Volume1", },"MrQH2bhuPGs", "Track 22", ORIGINAL_TRACK, OTHER_THEME],
	["Tentate",							new Set([TITLE.Volume1]), { title: "Volume1", },"Pd9YNhyKMtY", "Track 23", ORIGINAL_TRACK, OTHER_THEME],
	["Paganorum",						new Set([TITLE.Volume1]), { title: "Volume1", },"jcTv3Nnfdos", "Track 24", ORIGINAL_TRACK, OTHER_THEME],
	["Bells Tension",					new Set([TITLE.Volume1]), { title: "Volume1", },"1zed-JhiGD8", "Track 25", ORIGINAL_TRACK, OTHER_THEME],
	["It's All Talk",					new Set([TITLE.Volume1]), { title: "Volume1", },"U2Wd7QkP6do", "Track 26", ORIGINAL_TRACK, OTHER_THEME],
	["Doghead",							new Set([TITLE.Volume1]), { title: "Volume1", },"wilQO2YQHLs", "Track 27", ORIGINAL_TRACK, OTHER_THEME],
	["Wait a Minute",					new Set([TITLE.Volume1]), { title: "Volume1", },"wBiQYrXXuT8", "Track 28", ORIGINAL_TRACK, OTHER_THEME],
	["Harpwall",							new Set([TITLE.Volume1]), { title: "Volume1", },"BNxpH6DITf8", "Track 29", ORIGINAL_TRACK, OTHER_THEME],
	["Lute Ambience Reverb",				new Set([TITLE.Volume1]), { title: "Volume1", },"ug5m1TJRR4g", "Track 30", LUTE_TRACK, OTHER_THEME],
	["Romanesque",						new Set([TITLE.Volume1]), { title: "Volume1", },"Zsx5mSqVWs4", "Track 31", ORIGINAL_TRACK, OTHER_THEME],
	["Lazy Dulcimer",					new Set([TITLE.Volume1]), { title: "Volume1", },"KmxPj6WBCWo", "Track 32", ORIGINAL_TRACK, OTHER_THEME],
	["Trip Advisor Remix",				new Set([TITLE.Volume1]), { title: "Volume1", },"rRyayATTL7I", "Track 33", ORIGINAL_TRACK, OTHER_THEME],
	["Good Mushroom",					new Set([TITLE.Volume1]), { title: "Volume1", },"yeTeVCmYm3Q", "Track 34", ORIGINAL_TRACK, OTHER_THEME],
	["Tympanum",							new Set([TITLE.Volume1]), { title: "Volume1", },"NauVQuqWrQw", "Track 35", ORIGINAL_TRACK, OTHER_THEME],
	["Who's There",						new Set([TITLE.Volume1]), { title: "Volume1", },"4NvOuoUxc3E", "Track 36", ORIGINAL_TRACK, OTHER_THEME],
	["Sister Mine",						new Set([TITLE.Volume1]), { title: "Volume1", },"pI899dZ4BOU", "Track 37", ORIGINAL_TRACK, OTHER_THEME],
	["Fire Goat!",						new Set([TITLE.Volume1]), { title: "Volume1", },"Fxmu8Zxeudc", "Track 38", ORIGINAL_TRACK, OTHER_THEME],
	["Deducer",							new Set([TITLE.Volume1]), { title: "Volume1", },"zZzjefs5FIc", "Track 39", ORIGINAL_TRACK, OTHER_THEME],
	["Ocassum",							new Set([TITLE.Volume1]), { title: "Volume1", },"HNsuMhRHVF4", "Track 40", ORIGINAL_TRACK, OTHER_THEME],
	["Dubium",							new Set([TITLE.Volume1]), { title: "Volume1", },"MiNKyb3J95E", "Track 41", ORIGINAL_TRACK, OTHER_THEME],
	["The Library",						new Set([TITLE.Volume1]), { title: "Volume1", },"Pn9WJ-j_Svo", "Track 42", ORIGINAL_TRACK, OTHER_THEME],
	["Everything is Normal",				new Set([TITLE.Volume1]), { title: "Volume1", },"fF4MXLFwPwA", "Track 43", ORIGINAL_TRACK, OTHER_THEME],
	["Lute Ambience 2",					new Set([TITLE.Volume1]), { title: "Volume1", },"BfEKmr0HDYo", "Track 44", LUTE_TRACK, OTHER_THEME],
	["Lute Ambience 3",					new Set([TITLE.Volume1]), { title: "Volume1", },"gcdjBRneka8", "Track 45", LUTE_TRACK, OTHER_THEME],
	["Membrum",							new Set([TITLE.Volume1]), { title: "Volume1", },"lqG3jXWmKZ8", "Track 46", ORIGINAL_TRACK, OTHER_THEME],
	["Mechane",							new Set([TITLE.Volume1]), { title: "Volume1", },"62O1aUBgx64", "Track 47", ORIGINAL_TRACK, OTHER_THEME],
	["Being Sneaky... 2!",				new Set([TITLE.Volume1]), { title: "Volume1", },"Q0AIFhqgFAE", "Track 48", ARRANGED_TRACK, OTHER_THEME],
	["Purple Carrots",					new Set([TITLE.Volume1]), { title: "Volume1", },"wow25MQhxKA", "Track 49", ORIGINAL_TRACK, OTHER_THEME],
	["Doves and Pigeons",				new Set([TITLE.Volume1]), { title: "Volume1", },"QiIJjaXu2hE", "Track 50", ORIGINAL_TRACK, OTHER_THEME],
	["Frekynge",							new Set([TITLE.Volume1]), { title: "Volume1", },"ACfgBTjuBqo", "Track 51", ORIGINAL_TRACK, OTHER_THEME],
	["Lacrimae",							new Set([TITLE.Volume1]), { title: "Volume1", },"Xba9H5ZiVUw", "Track 52", ORIGINAL_TRACK, OTHER_THEME],
	["Genesis! Basic! Elementary!",		new Set([TITLE.Volume1]), { title: "Volume1", },"jCbgkPklueI", "Track 53", ORIGINAL_TRACK, OTHER_THEME],
	["Hermes",							new Set([TITLE.Volume1]), { title: "Volume1", },"A39n_aGH-Ms", "Track 54", ORIGINAL_TRACK, OTHER_THEME],
	["Maleficarum",						new Set([TITLE.Volume1]), { title: "Volume1", },"4zXpzr8YQ24", "Track 55", ORIGINAL_TRACK, OTHER_THEME],
	["En Passant",						new Set([TITLE.Volume1]), { title: "Volume1", },"RiJKsKB_8ss", "Track 56", ORIGINAL_TRACK, OTHER_THEME],
	["How Mysterious!",					new Set([TITLE.Volume1]), { title: "Volume1", },"z9pUoNkdYz8", "Track 57", ORIGINAL_TRACK, OTHER_THEME],
	["Half Remembered",					new Set([TITLE.Volume1]), { title: "Volume1", },"ICzhRIjwXyA", "Track 58", ORIGINAL_TRACK, OTHER_THEME],
	["Gothic",							new Set([TITLE.Volume1]), { title: "Volume1", },"Xu9nWbJ7X4M", "Track 59", ORIGINAL_TRACK, OTHER_THEME],
	["Mousehole",						new Set([TITLE.Volume1]), { title: "Volume1", },"uhw4Zoh6_Ag", "Track 60", ORIGINAL_TRACK, OTHER_THEME],
	["How Strange!",						new Set([TITLE.Volume1]), { title: "Volume1", },"S0FOe8bruqQ", "Track 61", ORIGINAL_TRACK, OTHER_THEME],
	["Synamome",							new Set([TITLE.Volume1]), { title: "Volume1", },"egVp3wQE-5k", "Track 62", ORIGINAL_TRACK, OTHER_THEME],
	["Steorra",							new Set([TITLE.Volume1]), { title: "Volume1", },"z2x04kdjNII", "Track 63", ORIGINAL_TRACK, OTHER_THEME],
	["Strawberye",						new Set([TITLE.Volume1]), { title: "Volume1", },"qeOPX1pl3DY", "Track 64", ORIGINAL_TRACK, OTHER_THEME],
	["Guilt",							new Set([TITLE.Volume1]), { title: "Volume1", },"l7LsAOGl4WI", "Track 65", ORIGINAL_TRACK, OTHER_THEME],
	["I've Seen a Ghost",				new Set([TITLE.Volume1]), { title: "Volume1", },"Va2t-_pXSCE", "Track 66", ORIGINAL_TRACK, OTHER_THEME],
	["Thimbles",							new Set([TITLE.Volume1]), { title: "Volume1", },"nmQKGvtpwa0", "Track 67", ORIGINAL_TRACK, OTHER_THEME],
	["Lute Filler 2",					new Set([TITLE.Volume1]), { title: "Volume1", },"XOR5zwcVYrE", "Track 68", LUTE_TRACK, OTHER_THEME],
	["Inventio",							new Set([TITLE.Volume1]), { title: "Volume1", },"fKdCTm-K7HM", "Track 69", ORIGINAL_TRACK, OTHER_THEME],
	["Saltarello",						new Set([TITLE.Volume1]), { title: "Volume1", },"H2nlC8kIH34", "Track 70", ORIGINAL_TRACK, OTHER_THEME],
	["Margaret's Song",					new Set([TITLE.Volume1]), { title: "Volume1", },"UmL7y8KnLLw", "Track 71", ORIGINAL_TRACK, OTHER_THEME],
	["Catherine's Canon",				new Set([TITLE.Volume1]), { title: "Volume1", },"sMLqEfyTfBg", "Track 72", ORIGINAL_TRACK, OTHER_THEME],
	["Flora's Theme",					new Set([TITLE.Volume1]), { title: "Volume1", },"_U4pRi0lzJs", "Track 73", ORIGINAL_TRACK, OTHER_THEME],
	["Five Pointed",						new Set([TITLE.Volume1]), { title: "Volume1", },"FM-7ucQMmI0", "Track 74", ORIGINAL_TRACK, OTHER_THEME],
	["Unease",							new Set([TITLE.Volume1]), { title: "Volume1", },"hyWtmMvbBzo", "Track 75", ORIGINAL_TRACK, OTHER_THEME],
	["Danger Nun!",						new Set([TITLE.Volume1]), { title: "Volume1", },"PPjx9aGC658", "Track 76", ORIGINAL_TRACK, OTHER_THEME],
	["Scandal!",							new Set([TITLE.Volume1]), { title: "Volume1", },"B218YWZwomA", "Track 77", ORIGINAL_TRACK, OTHER_THEME],
	["Each Day Here Wrong RPM",			new Set([TITLE.Volume1]), { title: "Volume1", },"_E_cwBVvj4k", "Track 78", ARRANGED_TRACK, OTHER_THEME],
	["Shepherd's Crook Wrong RPM",		new Set([TITLE.Volume1]), { title: "Volume1", },"WdISdNZNrG8", "Track 79", ARRANGED_TRACK, OTHER_THEME],
	["Talk to Me",						new Set([TITLE.Volume1]), { title: "Volume1", },"FltxiMz7EgE", "Track 80", ORIGINAL_TRACK, OTHER_THEME],
	["Creature Junction",				new Set([TITLE.Volume1]), { title: "Volume1", },"OE8Za06eWBk", "Track 81", ORIGINAL_TRACK, OTHER_THEME],
	["Thinking is Hard",					new Set([TITLE.Volume1]), { title: "Volume1", },"ZyR8BS7L_iE", "Track 82", ORIGINAL_TRACK, OTHER_THEME],
	["My My My",							new Set([TITLE.Volume1]), { title: "Volume1", },"DtzcFRiQt-Q", "Track 83", ORIGINAL_TRACK, OTHER_THEME],	
	["Sacristan",						new Set([TITLE.Volume1]), { title: "Volume1", },"UmyNXkq_X10", "Track 84", ORIGINAL_TRACK, OTHER_THEME],
	["Synnar",							new Set([TITLE.Volume1]), { title: "Volume1", },"5odnftucsS8", "Track 85", ORIGINAL_TRACK, OTHER_THEME],
	["Miserere",							new Set([TITLE.Volume1]), { title: "Volume1", },"OoD_oatoaHo", "Track 86", ORIGINAL_TRACK, OTHER_THEME],
	["A Vision",							new Set([TITLE.Volume1]), { title: "Volume1", },"5nBhYliFWys", "Track 87", ORIGINAL_TRACK, OTHER_THEME],
	["Wisdom & her Sisters",				new Set([TITLE.Volume1]), { title: "Volume1", },"ui2DlW2WSvs", "Track 88", ORIGINAL_TRACK, OTHER_THEME],
	["Soup's Song Interrupted",			new Set([TITLE.Volume1]), { title: "Volume1", },"yR4ym4s4F6I", "Track 89", ORIGINAL_TRACK, OTHER_THEME],
	["Let's make a pact",				new Set([TITLE.Volume1]), { title: "Volume1", },"vGteni1o_PA", "Track 90", ORIGINAL_TRACK, OTHER_THEME],
	["Caritas",							new Set([TITLE.Volume1]), { title: "Volume1", },"3r4A1Ja7TNc", "Track 91", ORIGINAL_TRACK, OTHER_THEME],
	["Eulogy",							new Set([TITLE.Volume1]), { title: "Volume1", },"8py7HBilP78", "Track 92", ORIGINAL_TRACK, OTHER_THEME],
	["Balanced Humors",					new Set([TITLE.Volume1]), { title: "Volume1", },"6ef-i4JtUdw", "Track 93", ORIGINAL_TRACK, OTHER_THEME],
	["Goodbye, Sherry",					new Set([TITLE.Volume1]), { title: "Volume1", },"liNmXloRl74", "Track 94", ORIGINAL_TRACK, OTHER_THEME],
	["Violence",							new Set([TITLE.Volume1]), { title: "Volume1", },"G53_kH3MIvY", "Track 95", ORIGINAL_TRACK, OTHER_THEME],
	["More than most",					new Set([TITLE.Volume1]), { title: "Volume1", },"LWmeFTl27Qk", "Track 96", ORIGINAL_TRACK, OTHER_THEME],
	["Aethling",							new Set([TITLE.Volume1]), { title: "Volume1", },"i6rlaK_Ct0g", "Track 97", ORIGINAL_TRACK, OTHER_THEME],
	["Busybody",							new Set([TITLE.Volume1]), { title: "Volume1", },"KdUU-kK5xoQ", "Track 98", ORIGINAL_TRACK, OTHER_THEME],
	["Vellum",							new Set([TITLE.Volume1]), { title: "Volume1", },"cLsw-_BKMAE", "Track 99", ORIGINAL_TRACK, OTHER_THEME],
	["Anchoress",						new Set([TITLE.Volume1]), { title: "Volume1", },"NGhklWpEtE4", "Track 100", ORIGINAL_TRACK, OTHER_THEME],
	["Chess Metaphor",					new Set([TITLE.Volume1]), { title: "Volume1", },"YzfHXcPxuY4", "Track 101", ORIGINAL_TRACK, OTHER_THEME],
	["Escapement",						new Set([TITLE.Volume1]), { title: "Volume1", },"NSbRR6EctnU", "Track 102", ORIGINAL_TRACK, OTHER_THEME],
	["Premade Root",					new Set([TITLE.Volume1]), { title: "Volume1", },"nWkdj8VsDeg", "Track 103", ORIGINAL_TRACK, OTHER_THEME],
	["Paganorum Wrong RPM",				new Set([TITLE.Volume1]), { title: "Volume1", },"AUvVtLGY3y8", "Track 104", ARRANGED_TRACK, OTHER_THEME],
/*
	fnc_main_song.js:227 Uncaught TypeError: Cannot read properties of undefined (reading '1')
    at init (fnc_main_song.js:227:38)
    at fnc_Sort (fnc_main_song.js:505:3)
    at HTMLTableCellElement.onclick ((index):62:59)
	*/
];
