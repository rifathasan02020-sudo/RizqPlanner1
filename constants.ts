export const APP_NAME_PREFIX = "Rizq";
export const APP_NAME_SUFFIX = "Planner";

export const QUOTES = [
  "অর্থ সঞ্চয় মানে কেবল টাকা জমানো নয়, এটি ভবিষ্যতের নিরাপত্তা।",
  "অপ্রয়োজনীয় ব্যয় কমালে আয় বাড়ানোর সমান কাজ হয়।",
  "আপনার প্রতিটি টাকা হিসাব করে খরচ করুন, ভবিষ্যৎ সহজ হবে।",
  "ধৈর্য ধরুন, সঞ্চয় করুন, এবং আপনার সম্পদ বাড়তে দেখুন।",
  "বুদ্ধিমানের কাজ হলো আয়ের চেয়ে ব্যয় কম রাখা।"
];

// Replaced with a cleaner, premium "unknown user" avatar suitable for dark theme
export const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"; 

// Fallback logic
export const getAvatar = () => {
  return "https://cdn-icons-png.flaticon.com/512/149/149071.png";
};