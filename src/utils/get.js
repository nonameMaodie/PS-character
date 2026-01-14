import { get, lib } from "noname";

/* <-------------------------获取花色数-------------------------> */
/**
 * 获取牌的花色数
 * @param { object[] } cards 一堆牌
 * @param { object } player 可选参数，是否以该角色来判断花色
 * @returns { number } 返回花色数
 */
export function getCardsSuitsLen(cards, player) {
  const suits = [];
  for (let i = 0; i < cards.length; i++) {
    const suit = get.suit(cards[i], player);
    if (!lib.suit.includes(suit) || suits.includes(suit)) continue;
    suits.add(suit);
    if (lib.suit.length === suits.length) break;
  }
  return suits.length;
}
