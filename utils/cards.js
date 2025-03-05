const Cards = {

card2Rank : 'A 2 3 4 5 6 7 8 9 10 J Q K'.split(' '),
card2Suit : '♠♥♦♣'.split(''),

initDeck : function() {
	return new Array(52).fill(0).map((e, i) => i);
},

// card: int
card2Str : function(card) {
	if (card == 52) return '-★';
	if (card == 53) return '-☆';

	let rank = Cards.card2Rank[card % 13];
	let suit = Cards.card2Suit[Math.floor(card / 13)];

	return rank + suit;
},

// card: int
card2Unicode : function(card) {
	if (card == 52) return String.fromCodePoint(0x1f0bf);
	if (card == 53) return String.fromCodePoint(0x1f0df);

	const blockStart = 0x1f0a1;

	let rank = card % 13;
	let suit = Math.floor(card / 13);

	if (rank >= 11) rank++;

	return String.fromCodePoint(blockStart + rank + (suit * 16));
},

// card: int, arr: Array[int]
filterByRank : function(card, arr) {
	if (card >= 52) return arr.filter(e => e >= 52);
	return arr.filter(e => e < 52 && (e % 13 == card % 13));
},

// card: int, arr: Array[int]
filterBySuit : function(card, arr) {
	if (card >= 52) return arr.filter(e => e >= 52);
	return arr.filter(e => e < 52 && (Math.floor(e / 13) == Math.floor(card / 13)));
}

}