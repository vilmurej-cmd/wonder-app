import { COLORS } from './theme';

export const TOOLS = [
  { key: 'island', name: 'WONDER Island', emoji: '🏝️', tagline: 'Explore & learn!', color: COLORS.primary, screen: 'Island' },
  { key: 'story', name: 'Story Spark', emoji: '📖', tagline: 'Bedtime stories', color: COLORS.storySpark, screen: 'StorySpark' },
  { key: 'chef', name: 'Tiny Chef', emoji: '🧑‍🍳', tagline: 'Cooking fun!', color: COLORS.tinyChef, screen: 'TinyChef' },
  { key: 'quest', name: 'QUEST', emoji: '🗺️', tagline: 'Daily adventure', color: COLORS.quest, screen: 'Quest' },
  { key: 'feelings', name: 'Feelings Friends', emoji: '💛', tagline: 'How do you feel?', color: COLORS.feelings, screen: 'Feelings' },
  { key: 'abc', name: 'ABC World', emoji: '🔤', tagline: 'Learn your letters', color: COLORS.abc, screen: 'ABCWorld' },
];

export const SAFETY_TOOLS = [
  { key: 'circle', name: 'My Circle', emoji: '💛', tagline: 'Trusted grown-ups', color: COLORS.safeCircle, screen: 'MyCircle' },
  { key: 'tell', name: 'Tell Someone', emoji: '🗣️', tagline: 'Learn when to tell', color: COLORS.safeTell, screen: 'TellSomeone' },
  { key: 'safewords', name: 'Safe Words', emoji: '🔑', tagline: 'Family code word', color: COLORS.safeWords, screen: 'SafeWords' },
  { key: 'checkin', name: 'Feelings Check-In', emoji: '😊', tagline: 'How are you today?', color: COLORS.safeCheck, screen: 'FeelingsCheckIn' },
  { key: 'hero', name: 'Emergency Hero', emoji: '🦸', tagline: 'Learn to call 911', color: COLORS.safeHero, screen: 'EmergencyHero' },
  { key: 'buddy', name: 'Buddy System', emoji: '🛡️', tagline: 'Family connection', color: COLORS.safeBuddy, screen: 'BuddySystem', locked: true },
];

export const ISLANDS = [
  { name: 'Numbers', emoji: '🔢', color: COLORS.numbers, unlocked: true },
  { name: 'Letters', emoji: '🔤', color: COLORS.letters, unlocked: true },
  { name: 'Colors', emoji: '🎨', color: COLORS.colors, unlocked: true },
  { name: 'Shapes', emoji: '🔷', color: COLORS.shapes, unlocked: false },
  { name: 'Animals', emoji: '🦁', color: COLORS.animals, unlocked: false },
  { name: 'Space', emoji: '🚀', color: COLORS.storySpark, unlocked: false },
  { name: 'Ocean', emoji: '🐙', color: COLORS.abc, unlocked: false },
  { name: 'Music', emoji: '🎵', color: COLORS.heart, unlocked: false },
  { name: 'Body', emoji: '🫀', color: COLORS.tinyChef, unlocked: false },
  { name: 'Nature', emoji: '🌿', color: COLORS.quest, unlocked: false },
];

export const FEELINGS = [
  { name: 'Happy', emoji: '🐻', animal: 'Bear', color: COLORS.feelings,
    message: "It's wonderful to feel happy! Everyone deserves happy moments.",
    activity: "Let's do a happy dance! 💃" },
  { name: 'Sad', emoji: '🐧', animal: 'Penguin', color: COLORS.letters,
    message: "It's okay to feel sad. Everyone feels sad sometimes.",
    activity: "Let's take 3 deep breaths together.\nIn... out... In... out... In... out..." },
  { name: 'Angry', emoji: '🦁', animal: 'Lion', color: COLORS.tinyChef,
    message: "It's okay to feel angry. Your feelings are important.",
    activity: "Let's squeeze our fists tight...\nand let go. Feel better?" },
  { name: 'Scared', emoji: '🐰', animal: 'Bunny', color: COLORS.primary,
    message: "You're safe. Being scared is totally normal.",
    activity: "Let's count to 5 together.\n1... 2... 3... 4... 5!\nYou're so brave!" },
  { name: 'Excited', emoji: '🐕', animal: 'Puppy', color: COLORS.quest,
    message: "Yay! Being excited is the best feeling!",
    activity: "Let's jump up and down! 🎉\nWoohoo!" },
  { name: 'Confused', emoji: '🦉', animal: 'Owl', color: COLORS.animals,
    message: "That's okay! Everyone gets confused sometimes.",
    activity: "Let's think about it together. 🤔\nTake your time — you'll figure it out!" },
];

export const RECIPES = [
  { name: 'Cookie', emoji: '🍪', color: COLORS.feelings, steps: [
    { text: 'Add flour to the bowl!', emoji: '🥣' },
    { text: 'Add sugar — sweet!', emoji: '🍬' },
    { text: 'Crack an egg!', emoji: '🥚' },
    { text: 'Mix it all together!', emoji: '🥄' },
    { text: 'Time to bake!', emoji: '🔥' },
  ]},
  { name: 'Smoothie', emoji: '🥤', color: COLORS.tinyChef, steps: [
    { text: 'Add banana!', emoji: '🍌' },
    { text: 'Add strawberries!', emoji: '🍓' },
    { text: 'Pour in milk!', emoji: '🥛' },
    { text: 'Blend it up!', emoji: '🌀' },
  ]},
  { name: 'Pizza', emoji: '🍕', color: COLORS.animals, steps: [
    { text: 'Roll out the dough!', emoji: '🫓' },
    { text: 'Spread the sauce!', emoji: '🥫' },
    { text: 'Add cheese!', emoji: '🧀' },
    { text: 'Pick your toppings!', emoji: '🫑' },
    { text: 'Into the oven!', emoji: '🔥' },
  ]},
  { name: 'Pancake', emoji: '🥞', color: COLORS.numbers, steps: [
    { text: 'Mix the batter!', emoji: '🥣' },
    { text: 'Pour on the pan!', emoji: '🍳' },
    { text: 'Wait for bubbles...', emoji: '🫧' },
    { text: 'Flip it!', emoji: '🔄' },
    { text: 'Add syrup!', emoji: '🍯' },
  ]},
];

export const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export const LETTER_EXAMPLES: Record<string, { word: string; emoji: string; sound: string }> = {
  A: { word: 'Astronaut', emoji: '🚀', sound: 'A says ah, ah, Astronaut!' },
  B: { word: 'Bear', emoji: '🐻', sound: 'B says buh, buh, Bear!' },
  C: { word: 'Cat', emoji: '🐱', sound: 'C says kuh, kuh, Cat!' },
  D: { word: 'Dog', emoji: '🐕', sound: 'D says duh, duh, Dog!' },
  E: { word: 'Elephant', emoji: '🐘', sound: 'E says eh, eh, Elephant!' },
  F: { word: 'Fish', emoji: '🐟', sound: 'F says fff, fff, Fish!' },
  G: { word: 'Giraffe', emoji: '🦒', sound: 'G says guh, guh, Giraffe!' },
  H: { word: 'Horse', emoji: '🐴', sound: 'H says huh, huh, Horse!' },
  I: { word: 'Ice cream', emoji: '🍦', sound: 'I says ih, ih, Ice cream!' },
  J: { word: 'Jellyfish', emoji: '🪼', sound: 'J says juh, juh, Jellyfish!' },
  K: { word: 'Koala', emoji: '🐨', sound: 'K says kuh, kuh, Koala!' },
  L: { word: 'Lion', emoji: '🦁', sound: 'L says lll, lll, Lion!' },
  M: { word: 'Moon', emoji: '🌙', sound: 'M says mmm, mmm, Moon!' },
  N: { word: 'Nest', emoji: '🪺', sound: 'N says nnn, nnn, Nest!' },
  O: { word: 'Octopus', emoji: '🐙', sound: 'O says ah, ah, Octopus!' },
  P: { word: 'Penguin', emoji: '🐧', sound: 'P says puh, puh, Penguin!' },
  Q: { word: 'Queen', emoji: '👑', sound: 'Q says kwuh, kwuh, Queen!' },
  R: { word: 'Rainbow', emoji: '🌈', sound: 'R says rrr, rrr, Rainbow!' },
  S: { word: 'Star', emoji: '⭐', sound: 'S says sss, sss, Star!' },
  T: { word: 'Turtle', emoji: '🐢', sound: 'T says tuh, tuh, Turtle!' },
  U: { word: 'Umbrella', emoji: '☂️', sound: 'U says uh, uh, Umbrella!' },
  V: { word: 'Violin', emoji: '🎻', sound: 'V says vvv, vvv, Violin!' },
  W: { word: 'Whale', emoji: '🐋', sound: 'W says wuh, wuh, Whale!' },
  X: { word: 'Xylophone', emoji: '🎵', sound: 'X says ks, ks, Xylophone!' },
  Y: { word: 'Yak', emoji: '🐃', sound: 'Y says yuh, yuh, Yak!' },
  Z: { word: 'Zebra', emoji: '🦓', sound: 'Z says zzz, zzz, Zebra!' },
};
