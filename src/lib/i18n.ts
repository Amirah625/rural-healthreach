export const SUPPORTED_LANGUAGES = [
  { code: "en", label: "English" },
  { code: "yo", label: "Yoruba" },
  { code: "ha", label: "Hausa" },
  { code: "fr", label: "French" },
  { code: "ar", label: "Arabic" },
  { code: "tw", label: "Twi" },
] as const;

export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number]["code"];

export type ThemePreference = "light" | "dark" | "system";

type TranslationKey =
  | "profile"
  | "home"
  | "map"
  | "messages"
  | "resources"
  | "findCare"
  | "healthAssistant"
  | "ussdSms"
  | "emergency"
  | "healthInformation"
  | "findHealthcareFacility"
  | "ussdSmsAccess"
  | "emergencyHelp"
  | "goBack"
  | "notifications"
  | "ruralReachTagline"
  | "myProfile"
  | "welcomeToRuralReach"
  | "welcomeBack"
  | "profileSettings"
  | "appearance"
  | "language"
  | "theme"
  | "light"
  | "dark"
  | "systemDefault"
  | "profilePicture"
  | "uploadPicture"
  | "replacePicture"
  | "removePicture"
  | "account"
  | "active"
  | "signOut"
  | "signIn"
  | "signInToPersonalize"
  | "saveSettings"
  | "settingsSaved"
  | "uploadingPicture"
  | "profilePictureHelp"
  | "invalidImage"
  | "imageTooLarge";

const translations: Record<LanguageCode, Record<TranslationKey, string>> = {
  en: {
    profile: "Profile",
    home: "Home",
    map: "Map",
    messages: "Messages",
    resources: "Resources",
    findCare: "Find care",
    healthAssistant: "Health Assistant",
    ussdSms: "USSD / SMS",
    emergency: "Emergency",
    healthInformation: "Health Information",
    findHealthcareFacility: "Find Healthcare Facility",
    ussdSmsAccess: "USSD / SMS Access",
    emergencyHelp: "Emergency / Help",
    goBack: "Go back",
    notifications: "Notifications",
    ruralReachTagline: "Healthcare that reaches you, wherever you are.",
    myProfile: "My Profile",
    welcomeToRuralReach: "Welcome to RuralReach",
    welcomeBack: "Welcome back",
    profileSettings: "Profile settings",
    appearance: "Appearance",
    language: "Language",
    theme: "Theme",
    light: "Light",
    dark: "Dark",
    systemDefault: "System default",
    profilePicture: "Profile picture",
    uploadPicture: "Upload picture",
    replacePicture: "Replace picture",
    removePicture: "Remove picture",
    account: "Account",
    active: "Active",
    signOut: "Sign out",
    signIn: "Sign in",
    signInToPersonalize: "Sign in to personalize your experience.",
    saveSettings: "Save settings",
    settingsSaved: "Settings saved.",
    uploadingPicture: "Uploading picture…",
    profilePictureHelp: "JPG, PNG or WebP up to 5 MB.",
    invalidImage: "Choose a JPG, PNG or WebP image.",
    imageTooLarge: "Your image must be 5 MB or smaller.",
  },
  yo: {
    profile: "Profaili",
    home: "Ìdílé",
    map: "Maapu",
    messages: "Àwọn ìránṣẹ́",
    resources: "Àwọn ohun èlò",
    findCare: "Wa ìtọ́jú",
    healthAssistant: "Olùrànlọ́wọ́ ìlera",
    ussdSms: "USSD / SMS",
    emergency: "Pajawiri",
    healthInformation: "Àlàyé ìlera",
    findHealthcareFacility: "Wa ilé ìtọ́jú",
    ussdSmsAccess: "Wọlé USSD / SMS",
    emergencyHelp: "Pajawiri / Ìrànlọ́wọ́",
    goBack: "Padà sẹ́yìn",
    notifications: "Àwọn ìfitónilétí",
    ruralReachTagline: "Ìlera tó ń dé bá ọ, ibikíbi tí o bá wà.",
    myProfile: "Profaili mi",
    welcomeToRuralReach: "Káàbọ̀ sí RuralReach",
    welcomeBack: "Káàbọ̀ padà",
    profileSettings: "Àwọn ètò profaili",
    appearance: "Ìfarahàn",
    language: "Èdè",
    theme: "Àwọ̀ ojú ìwé",
    light: "Ìmọ́lẹ̀",
    dark: "Òkùnkùn",
    systemDefault: "Àṣàyàn ẹ̀rọ",
    profilePicture: "Àwòrán profaili",
    uploadPicture: "Gbé àwòrán sókè",
    replacePicture: "Rọ́pò àwòrán",
    removePicture: "Yọ àwòrán kúrò",
    account: "Àkáǹtì",
    active: "Ó ń ṣiṣẹ́",
    signOut: "Jáde",
    signIn: "Wọlé",
    signInToPersonalize: "Wọlé láti ṣe àdáni ìrírí rẹ.",
    saveSettings: "Fipamọ́ àwọn ètò",
    settingsSaved: "A ti fipamọ́ àwọn ètò.",
    uploadingPicture: "Ń gbé àwòrán sókè…",
    profilePictureHelp: "JPG, PNG tàbí WebP tó kéré ju 5 MB.",
    invalidImage: "Yan àwòrán JPG, PNG tàbí WebP.",
    imageTooLarge: "Àwòrán rẹ gbọ́dọ̀ kéré ju 5 MB.",
  },
  ha: {
    profile: "Bayanan martaba",
    home: "Gida",
    map: "Taswira",
    messages: "Saƙonni",
    resources: "Bayanai",
    findCare: "Nemo kulawa",
    healthAssistant: "Mataimakin lafiya",
    ussdSms: "USSD / SMS",
    emergency: "Gaggawa",
    healthInformation: "Bayanin lafiya",
    findHealthcareFacility: "Nemo cibiyar lafiya",
    ussdSmsAccess: "Samun USSD / SMS",
    emergencyHelp: "Gaggawa / Taimako",
    goBack: "Koma baya",
    notifications: "Sanarwa",
    ruralReachTagline: "Lafiya da ta isa gare ka, duk inda kake.",
    myProfile: "Bayanan martaba na",
    welcomeToRuralReach: "Barka da zuwa RuralReach",
    welcomeBack: "Barka da dawowa",
    profileSettings: "Saitunan bayanan martaba",
    appearance: "Bayyanuwa",
    language: "Harshe",
    theme: "Jigo",
    light: "Haske",
    dark: "Duhu",
    systemDefault: "Saitin na’ura",
    profilePicture: "Hoton bayanan martaba",
    uploadPicture: "Loda hoto",
    replacePicture: "Sauya hoto",
    removePicture: "Cire hoto",
    account: "Asusu",
    active: "Aiki",
    signOut: "Fita",
    signIn: "Shiga",
    signInToPersonalize: "Shiga don keɓance ƙwarewarka.",
    saveSettings: "Ajiye saituna",
    settingsSaved: "An ajiye saituna.",
    uploadingPicture: "Ana loda hoto…",
    profilePictureHelp: "JPG, PNG ko WebP har zuwa 5 MB.",
    invalidImage: "Zaɓi hoton JPG, PNG ko WebP.",
    imageTooLarge: "Hotonka ya zama 5 MB ko ƙasa da haka.",
  },
  fr: {
    profile: "Profil",
    home: "Accueil",
    map: "Carte",
    messages: "Messages",
    resources: "Ressources",
    findCare: "Trouver des soins",
    healthAssistant: "Assistant santé",
    ussdSms: "USSD / SMS",
    emergency: "Urgence",
    healthInformation: "Informations santé",
    findHealthcareFacility: "Trouver un établissement",
    ussdSmsAccess: "Accès USSD / SMS",
    emergencyHelp: "Urgence / Aide",
    goBack: "Retour",
    notifications: "Notifications",
    ruralReachTagline: "Des soins qui vous rejoignent, où que vous soyez.",
    myProfile: "Mon profil",
    welcomeToRuralReach: "Bienvenue sur RuralReach",
    welcomeBack: "Bon retour",
    profileSettings: "Paramètres du profil",
    appearance: "Apparence",
    language: "Langue",
    theme: "Thème",
    light: "Clair",
    dark: "Sombre",
    systemDefault: "Système",
    profilePicture: "Photo de profil",
    uploadPicture: "Importer une photo",
    replacePicture: "Remplacer la photo",
    removePicture: "Supprimer la photo",
    account: "Compte",
    active: "Actif",
    signOut: "Se déconnecter",
    signIn: "Se connecter",
    signInToPersonalize: "Connectez-vous pour personnaliser votre expérience.",
    saveSettings: "Enregistrer",
    settingsSaved: "Paramètres enregistrés.",
    uploadingPicture: "Importation de la photo…",
    profilePictureHelp: "JPG, PNG ou WebP jusqu’à 5 Mo.",
    invalidImage: "Choisissez une image JPG, PNG ou WebP.",
    imageTooLarge: "Votre image doit faire 5 Mo ou moins.",
  },
  ar: {
    profile: "الملف الشخصي",
    home: "الرئيسية",
    map: "الخريطة",
    messages: "الرسائل",
    resources: "الموارد",
    findCare: "ابحث عن الرعاية",
    healthAssistant: "المساعد الصحي",
    ussdSms: "USSD / SMS",
    emergency: "الطوارئ",
    healthInformation: "معلومات صحية",
    findHealthcareFacility: "ابحث عن مرفق صحي",
    ussdSmsAccess: "الوصول عبر USSD / SMS",
    emergencyHelp: "الطوارئ / المساعدة",
    goBack: "رجوع",
    notifications: "الإشعارات",
    ruralReachTagline: "رعاية صحية تصل إليك أينما كنت.",
    myProfile: "ملفي الشخصي",
    welcomeToRuralReach: "مرحباً بك في RuralReach",
    welcomeBack: "مرحباً بعودتك",
    profileSettings: "إعدادات الملف الشخصي",
    appearance: "المظهر",
    language: "اللغة",
    theme: "السمة",
    light: "فاتح",
    dark: "داكن",
    systemDefault: "إعداد النظام",
    profilePicture: "صورة الملف الشخصي",
    uploadPicture: "رفع صورة",
    replacePicture: "استبدال الصورة",
    removePicture: "إزالة الصورة",
    account: "الحساب",
    active: "نشط",
    signOut: "تسجيل الخروج",
    signIn: "تسجيل الدخول",
    signInToPersonalize: "سجّل الدخول لتخصيص تجربتك.",
    saveSettings: "حفظ الإعدادات",
    settingsSaved: "تم حفظ الإعدادات.",
    uploadingPicture: "جارٍ رفع الصورة…",
    profilePictureHelp: "JPG أو PNG أو WebP حتى 5 ميجابايت.",
    invalidImage: "اختر صورة JPG أو PNG أو WebP.",
    imageTooLarge: "يجب ألا تتجاوز الصورة 5 ميجابايت.",
  },
  tw: {
    profile: "Profile",
    home: "Fie",
    map: "Asase mfonini",
    messages: "Nkra",
    resources: "Nneɛma a wɔde boa",
    findCare: "Hwehwɛ ayaresa",
    healthAssistant: "Akwahosan boafo",
    ussdSms: "USSD / SMS",
    emergency: "Ntɛmpɔn",
    healthInformation: "Akwahosan ho nsɛm",
    findHealthcareFacility: "Hwehwɛ ayaresa beae",
    ussdSmsAccess: "USSD / SMS kwan",
    emergencyHelp: "Ntɛmpɔn / Mmoa",
    goBack: "San kɔ",
    notifications: "Amanneɛbɔ",
    ruralReachTagline: "Akwahosan a ɛdu wo nkyɛn, baabiara a wowɔ.",
    myProfile: "Me profile",
    welcomeToRuralReach: "Akwaaba wɔ RuralReach",
    welcomeBack: "Akwaaba bio",
    profileSettings: "Profile nhyehyɛe",
    appearance: "Ɛkwan a ɛte",
    language: "Kasa",
    theme: "Nhwɛso",
    light: "Hann",
    dark: "Sum",
    systemDefault: "Mfiri nhyehyɛe",
    profilePicture: "Profile mfonini",
    uploadPicture: "Fa mfonini gu so",
    replacePicture: "Si mfonini ananmu",
    removePicture: "Yi mfonini",
    account: "Akonta",
    active: "Ɛreyɛ adwuma",
    signOut: "Fi mu",
    signIn: "Kɔ mu",
    signInToPersonalize: "Kɔ mu na yɛ wo suahu no sɛ wo de.",
    saveSettings: "Sie nhyehyɛe",
    settingsSaved: "Wɔawie sie nhyehyɛe.",
    uploadingPicture: "Mfonini rekɔ so…",
    profilePictureHelp: "JPG, PNG anaa WebP a ɛntra 5 MB.",
    invalidImage: "Paw JPG, PNG anaa WebP mfonini.",
    imageTooLarge: "Ɛsɛ sɛ wo mfonini no yɛ 5 MB anaa nea ɛsua.",
  },
};

export function isLanguageCode(value: string | null | undefined): value is LanguageCode {
  return SUPPORTED_LANGUAGES.some((language) => language.code === value);
}

export function isThemePreference(value: string | null | undefined): value is ThemePreference {
  return value === "light" || value === "dark" || value === "system";
}

export function translate(language: LanguageCode, key: TranslationKey): string {
  return translations[language][key] ?? translations.en[key];
}

export type { TranslationKey };