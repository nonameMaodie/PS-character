/**
 * 将数据转换为拆分重组为选项
 * @param { {
 * name: String
 * translate: String
 * }} pack 武将包，包含武将包id和武将包翻译
 * @param { Object } data 数据
 * @returns { Object }
 */
export function convertDataToOptions(pack, data) {
	const options = {
		character: {},
		characterFilter: {},
		characterIntro: {},
		characterReplace: {},
		characterTitle: {},
		characterSubstitute: {},
		translate: {},
		dynamicTranslate: {},
		skill: {},
		rank: {},
		characterSort: {
			[pack.name]: {}
		},
	}
	for (const [name, value] of Object.entries(data)) {
		const {
			info,
			sort,
			skills,
			filter,
			intro,
			title,
			replace,
			substitute,
			translate,
			rank,
			dynamicTranslate,
		} = value;

		info && (options.character[name] = info, options.character[name].img = `extension/PS武将/image/character/${name}.jpg`);
		filter && (options.characterFilter[name] = filter);
		intro && (options.characterIntro[name] = intro);
		replace && (options.characterReplace[name] = replace);
		title && (options.characterTitle[name] = title);
		substitute && (options.characterSubstitute[name] = substitute);
		// 将武将id加入对应评级分组
		const currentRankGroup = options.rank;
		const rankKey = rank[0];
		currentRankGroup[rankKey] = currentRankGroup[rankKey] || [];
		currentRankGroup[rankKey].push(name);
		// 将武将id加入对应分类分组
		const currentSortGroup = options.characterSort[pack.name];
		const sortKey = sort[0];
		const sortTranslate = sort[1];
		currentSortGroup[sortKey] = currentSortGroup[sortKey] || [];
		currentSortGroup[sortKey].push(name);
		options.translate[sortKey] || (options.translate[sortKey] = sortTranslate); // 武将包分类翻译
		// 批量生成武将前缀翻译
		if (name.includes("PS")) {
			const prefix = name.includes("PSshen_") ? "PS神" : "PS";
			options.translate[name + "_prefix"] = prefix;
		}
		options.translate[pack.name] = pack.translate; // 武将包翻译
		translate && (Object.assign(options.translate, translate));
		dynamicTranslate && (Object.assign(options.dynamicTranslate, dynamicTranslate));
		skills && (Object.assign(options.skill, skills));
	}
	return options;
}

/* <-------------------------花色符号染色-------------------------> */
/**
 * 获取牌的花色数
 * @param { string|string[] } suit 诸如'spade'、'heart'的字符串
 * @returns { string } 返回包含HTML标签的字符串
 */
export function convertSuitToHTML(data) {
	if (Array.isArray(suit)) {
		return suit.map(function (s) {
			return convertSuitToHTML(s);
		}).join('、');
	}
	else if (typeof suit !== 'string') {
		return void 0;
	}
	const obj = {
		'spade': '<font color="black">♠︎</font>',
		'heart': '<font color="red">♥︎</font>',
		'club': '<font color="black">♣︎</font>',
		'diamond': '<font color="red">♦︎</font>',
	}
	return obj[suit];
}
