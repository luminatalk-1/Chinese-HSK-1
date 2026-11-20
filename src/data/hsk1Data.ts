export interface HskUnit {
  id: number;
  titleEn: string;
  titleAr: string;
  descEn: string;
  descAr: string;
}

export interface HskWord {
  id: string;
  u: number;
  h: string;
  p: string;
  en: string;
  ar: string;
  posEn: string;
  posAr: string;
  hookEn: string;
  hookAr: string;
  exH: string;
  exP: string;
  exEn: string;
  exAr: string;
}

export interface GrammarRule {
  num: number;
  titleEn: string;
  titleAr: string;
  pattern: string;
  explanationEn: string;
  explanationAr: string;
  examples: Array<{ h: string; p: string; en: string; ar: string }>;
}

export interface ToneDemo {
  syl: string;
  hanzi: string;
  tone: number;
  en: string;
  ar: string;
  descEn: string;
  descAr: string;
  path: string;
}

export interface SoundItem {
  sym: string;
  sampleH: string;
  sampleP: string;
  en: string;
  ar: string;
  tipEn: string;
  tipAr: string;
}

export interface SoundboardGroup {
  groupEn: string;
  groupAr: string;
  items: Array<{ p: string; h: string; en: string; ar: string }>;
}

export interface RadicalItem {
  radical: string;
  pinyin: string;
  nameEn: string;
  nameAr: string;
  examples: Array<{ h: string; p: string; en: string; ar: string }>;
}

export interface StrokeItem {
  symbol: string;
  nameEn: string;
  nameAr: string;
  pinyin: string;
  sampleH: string;
  sampleP: string;
  tipEn: string;
  tipAr: string;
}

export interface SentenceChallenge {
  en: string;
  ar: string;
  fullH: string;
  fullP: string;
  target: string[];
  tiles: string[];
  noteEn: string;
  noteAr: string;
}

export interface DialogueOption {
  h: string;
  p: string;
  en: string;
  ar: string;
  ok: boolean;
  tipEn: string;
  tipAr: string;
}

export interface DialogueTurn {
  npcH: string;
  npcP: string;
  npcEn: string;
  npcAr: string;
  options: DialogueOption[];
}

export interface DialogueScenario {
  id: string;
  titleEn: string;
  titleAr: string;
  partnerEn: string;
  partnerAr: string;
  turns: DialogueTurn[];
}

export function stripPinyinTones(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ǖ|ǘ|ǚ|ǜ/g, 'u')
    .toLowerCase();
}

export const UNITS: HskUnit[] = [
  {
    id: 1,
    titleEn: 'Unit 1: Greetings & Pronouns',
    titleAr: 'الوحدة ١: التحيات والضمائر',
    descEn: 'Polite greetings, personal & demonstrative pronouns, and essential question words.',
    descAr: 'التحيات المهذبة، الضمائر الشخصية وأسماء الإشارة، وأدوات الاستفهام الأساسية.',
  },
  {
    id: 2,
    titleEn: 'Unit 2: Numbers & Measure Words',
    titleAr: 'الوحدة ٢: الأرقام وأدوات التمييز',
    descEn: 'Numbers 0–10, counting people, age, books, currency, and quantifiers.',
    descAr: 'الأرقام من ٠ إلى ١٠، عدّ الأشخاص والأعمار والكتب والعملة وأدوات التمييز.',
  },
  {
    id: 3,
    titleEn: 'Unit 3: Time, Dates & Calendar',
    titleAr: 'الوحدة ٣: الوقت والتاريخ والتقويم',
    descEn: 'Hours, minutes, parts of the day, days, months, years, and weekdays.',
    descAr: 'الساعات والدقائق، أجزاء اليوم، الأيام والشهور والسنوات وأيام الأسبوع.',
  },
  {
    id: 4,
    titleEn: 'Unit 4: Family, People & Titles',
    titleAr: 'الوحدة ٤: العائلة والأشخاص والألقاب',
    descEn: 'Family members, social titles, friends, teachers, students, and professions.',
    descAr: 'أفراد العائلة، الألقاب الاجتماعية، الأصدقاء، المعلمون والطلاب والمهن.',
  },
  {
    id: 5,
    titleEn: 'Unit 5: Food, Drink & Dining',
    titleAr: 'الوحدة ٥: الطعام والشراب والمطعم',
    descEn: 'Meals, drinks, fruit, dining verbs, restaurants, and expressing hunger or thirst.',
    descAr: 'الوجبات والمشروبات والفواكه وأفعال الأكل والشرب والتعبير عن الجوع والعطش.',
  },
  {
    id: 6,
    titleEn: 'Unit 6: Places & Directions',
    titleAr: 'الوحدة ٦: الأماكن والاتجاهات',
    descEn: 'Countries, cities, public places, and spatial position words (front, back, inside, on, under).',
    descAr: 'الدول والمدن والأماكن العامة وظروف المكان (أمام، خلف، داخل، فوق، تحت).',
  },
  {
    id: 7,
    titleEn: 'Unit 7: Transport & Movement',
    titleAr: 'الوحدة ٧: المواصلات والحركة',
    descEn: 'Vehicles, motion verbs (go, come, return, walk, drive), and distance adjectives.',
    descAr: 'وسائل النقل، أفعال الحركة (يذهب، يأتي، يعود، يمشي، يقود)، والمسافات.',
  },
  {
    id: 8,
    titleEn: 'Unit 8: Shopping, Money & Objects',
    titleAr: 'الوحدة ٨: التسوق والأشياء اليومية',
    descEn: 'Money, shopping verbs, electronics, furniture, books, and household pets.',
    descAr: 'النقود والشراء والأجهزة الإلكترونية والأثاث والكتب والحيوانات الأليفة.',
  },
  {
    id: 9,
    titleEn: 'Unit 9: Daily Verbs & Communication',
    titleAr: 'الوحدة ٩: الأفعال اليومية والتواصل',
    descEn: 'Core HSK 1 verbs: being, having, speaking, reading, writing, studying, working, and modals.',
    descAr: 'الأفعال المحورية في HSK 1: الكينونة والملكية والتحدث والقراءة والكتابة والدراسة والقدرة.',
  },
  {
    id: 10,
    titleEn: 'Unit 10: Adjectives & Descriptions',
    titleAr: 'الوحدة ١٠: الصفات والوصف',
    descEn: 'Size, quantity, temperature, emotions, beauty, and evaluative expressions.',
    descAr: 'الحجم والكمية والحرارة والمشاعر والجمال وصفات التقييم الشائعة.',
  },
  {
    id: 11,
    titleEn: 'Unit 11: Weather & Nature',
    titleAr: 'الوحدة ١١: الطقس والطبيعة',
    descEn: 'Essential weather, rain, sun, and moon vocabulary.',
    descAr: 'مفردات الطقس والمطر والشمس والقمر الأساسية.',
  },
  {
    id: 12,
    titleEn: 'Unit 12: Grammar Particles & Connectors',
    titleAr: 'الوحدة ١٢: أدوات القواعد والربط',
    descEn: 'Particles (的, 了, 吗, 呢), negation (不, 没), degree adverbs, and polite connectors.',
    descAr: 'أدوات القواعد (的, 了, 吗, 呢)، أدوات النفي، ظروف الدرجة وأدوات الربط.',
  },
];

export const HSK1_WORDS: HskWord[] = [
  // UNIT 1: Greetings & Pronouns (22)
  { id: 'w1', u: 1, h: '你好', p: 'nǐ hǎo', en: 'Hello', ar: 'مرحباً', posEn: 'Greeting', posAr: 'تحية', hookEn: '你 (you) + 好 (good). Spoken as ní hǎo due to 3rd-tone sandhi.', hookAr: 'تتكون من 你 (أنت) + 好 (جيد). وتنطق عملياً ní hǎo لتوالي نغمتين ثالثتين.', exH: '你好！你叫什么名字？', exP: 'Nǐ hǎo! Nǐ jiào shénme míngzi?', exEn: 'Hello! What is your name?', exAr: 'مرحباً! ما اسمك؟' },
  { id: 'w2', u: 1, h: '谢谢', p: 'xièxie', en: 'Thank you', ar: 'شكراً لك', posEn: 'Verb', posAr: 'فعل', hookEn: 'Carries the speech radical 讠 on the left — expressing gratitude with words.', hookAr: 'يبدأ بجذر الكلام 讠 على اليسار للتعبير عن الامتنان بالكلمات.', exH: '谢谢你的帮助！', exP: 'Xièxie nǐ de bāngzhù!', exEn: 'Thank you for your help!', exAr: 'شكراً لمساعدتك!' },
  { id: 'w3', u: 1, h: '不客气', p: 'bú kèqi', en: 'You’re welcome', ar: 'عفواً / لا شكر على واجب', posEn: 'Phrase', posAr: 'عبارة', hookEn: '不 shifts to 2nd tone (bú) before 4th-tone 客 (kè).', hookAr: 'تتغير نغمة 不 إلى الثانية (bú) لأنها تسبق النغمة الرابعة في 客.', exH: '谢谢你！— 不客气。', exP: 'Xièxie nǐ! — Bú kèqi.', exEn: 'Thank you! — You’re welcome.', exAr: 'شكراً لك! — عفواً.' },
  { id: 'w4', u: 1, h: '再见', p: 'zàijiàn', en: 'Goodbye', ar: 'مع السلامة / إلى اللقاء', posEn: 'Verb', posAr: 'فعل', hookEn: '再 (again) + 见 (see) = "See you again."', hookAr: '再 (مرة أخرى) + 见 (يرى) = حرفياً «أراك مجدداً».', exH: '老师，再见！', exP: 'Lǎoshī, zàijiàn!', exEn: 'Goodbye, teacher!', exAr: 'مع السلامة يا أستاذ!' },
  { id: 'w5', u: 1, h: '对不起', p: 'duìbuqǐ', en: 'Sorry / Excuse me', ar: 'آسف / المعذرة', posEn: 'Phrase', posAr: 'عبارة', hookEn: 'Used for sincere apologies; standard reply is 没关系.', hookAr: 'تُستخدم للاعتذار الصادق، والرد المعتاد عليها هو 没关系.', exH: '对不起，我来晚了。', exP: 'Duìbuqǐ, wǒ lái wǎn le.', exEn: 'Sorry, I arrived late.', exAr: 'آسف، لقد تأخرت.' },
  { id: 'w6', u: 1, h: '没关系', p: 'méi guānxi', en: 'It doesn’t matter / No problem', ar: 'لا بأس / لا مشكلة', posEn: 'Phrase', posAr: 'عبارة', hookEn: 'Literally "no relation/issue" — polite reply to 对不起.', hookAr: 'تعني حرفياً «لا مشكلة»، وهي الرد القياسي على الاعتذار.', exH: '对不起！— 没关系。', exP: 'Duìbuqǐ! — Méi guānxi.', exEn: 'Sorry! — No problem.', exAr: 'آسف! — لا بأس.' },
  { id: 'w161', u: 1, h: '喂', p: 'wèi', en: 'Hello (on the phone) / Hey', ar: 'ألو (في الهاتف) / مرحباً', posEn: 'Interjection', posAr: 'نداء', hookEn: 'Mouth radical 口 on the left — standard greeting when answering a phone call.', hookAr: 'يبدأ بجذر الفم 口 على اليسار، وهو التحية القياسية عند الرد على الهاتف.', exH: '喂，你好！请问你是谁？', exP: 'Wèi, nǐ hǎo! Qǐngwèn nǐ shì shéi?', exEn: 'Hello! May I ask who is speaking?', exAr: 'ألو، مرحباً! عفواً من المتحدث؟' },
  { id: 'w7', u: 1, h: '我', p: 'wǒ', en: 'I / Me', ar: 'أنا', posEn: 'Pronoun', posAr: 'ضمير', hookEn: 'Ancient pictograph of a hand holding a ceremonial halberd representing the self.', hookAr: 'شكل تاريخي يرمز للذات؛ يُستخدم لضمير المتكلم المفرد (أنا).', exH: '我是学生。', exP: 'Wǒ shì xuéshēng.', exEn: 'I am a student.', exAr: 'أنا طالب.' },
  { id: 'w8', u: 1, h: '你', p: 'nǐ', en: 'You', ar: 'أنتَ / أنتِ', posEn: 'Pronoun', posAr: 'ضمير', hookEn: 'Person radical 亻 on the left + 尔 phonetic.', hookAr: 'يبدأ بجذر الشخص 亻 على اليسار ويدل على المخاطب المفرد.', exH: '你好吗？', exP: 'Nǐ hǎo ma?', exEn: 'How are you?', exAr: 'كيف حالك؟' },
  { id: 'w9', u: 1, h: '他', p: 'tā', en: 'He / Him', ar: 'هو', posEn: 'Pronoun', posAr: 'ضمير', hookEn: 'Person radical 亻 indicates male or general third person.', hookAr: 'يبدأ بجذر الشخص 亻 للدلالة على الغائب المذكر (هو).', exH: '他是我的朋友。', exP: 'Tā shì wǒ de péngyou.', exEn: 'He is my friend.', exAr: 'هو صديقي.' },
  { id: 'w10', u: 1, h: '她', p: 'tā', en: 'She / Her', ar: 'هي', posEn: 'Pronoun', posAr: 'ضمير', hookEn: 'Woman radical 女 on the left; pronounced identically to 他 (tā).', hookAr: 'يبدأ بجذر المرأة 女 على اليسار، وينطق تماماً مثل 他.', exH: '她很漂亮。', exP: 'Tā hěn piàoliang.', exEn: 'She is very pretty.', exAr: 'هي جميلة جداً.' },
  { id: 'w11', u: 1, h: '我们', p: 'wǒmen', en: 'We / Us', ar: 'نحن', posEn: 'Pronoun', posAr: 'ضمير', hookEn: 'Suffix 们 (men) pluralizes pronouns: 我们 (we), 你们 (you all), 他们 (they).', hookAr: 'اللاحقة 们 تحوّل الضمير إلى الجمع: 我们 (نحن)، 你们 (أنتم)، 他们 (هم).', exH: '我们去学校。', exP: 'Wǒmen qù xuéxiào.', exEn: 'We go to school.', exAr: 'نحن نذهب إلى المدرسة.' },
  { id: 'w12', u: 1, h: '这', p: 'zhè', en: 'This', ar: 'هذا / هذه', posEn: 'Pronoun', posAr: 'اسم إشارة', hookEn: 'Walking radical 辶 — pointing to something close by.', hookAr: 'يحمل جذر الحركة 辶 ويشير إلى القريب (هذا/هذه).', exH: '这是我的书。', exP: 'Zhè shì wǒ de shū.', exEn: 'This is my book.', exAr: 'هذا كتابي.' },
  { id: 'w13', u: 1, h: '那', p: 'nà', en: 'That', ar: 'ذلك / تلك', posEn: 'Pronoun', posAr: 'اسم إشارة', hookEn: 'Refers to something farther away from the speaker.', hookAr: 'اسم إشارة للبعيد (ذلك/تلك).', exH: '那是什么？', exP: 'Nà shì shénme?', exEn: 'What is that?', exAr: 'ما ذلك؟' },
  { id: 'w14', u: 1, h: '哪', p: 'nǎ', en: 'Which', ar: 'أيّ', posEn: 'Pronoun', posAr: 'أداة استفهام', hookEn: 'Mouth 口 + 那 = asking "which?" (哪国人 = which nationality).', hookAr: 'فم 口 + 那 = للسؤال «أيّ؟»، مثل 哪国人 (من أي بلد؟).', exH: '你是哪国人？', exP: 'Nǐ shì nǎ guó rén?', exEn: 'Which country are you from?', exAr: 'من أي بلد أنت؟' },
  { id: 'w162', u: 1, h: '哪儿', p: 'nǎr', en: 'Where', ar: 'أين', posEn: 'Pronoun', posAr: 'أداة استفهام', hookEn: '哪 (which) + 儿 = "where?" Placed after 在 or 去: 在哪儿 / 去哪儿.', hookAr: 'تُستخدم للسؤال عن المكان وتوضع بعد الفعل في نفس ترتيب الجملة: 在哪儿؟', exH: '火车站在哪儿？', exP: 'Huǒchēzhàn zài nǎr?', exEn: 'Where is the train station?', exAr: 'أين محطة القطار؟' },
  { id: 'w15', u: 1, h: '谁', p: 'shéi', en: 'Who / Whom', ar: 'مَن', posEn: 'Pronoun', posAr: 'أداة استفهام', hookEn: 'Speech radical 讠 on the left — asking who someone is.', hookAr: 'يبدأ بجذر الكلام 讠 ويُستخدم للسؤال عن الشخص (مَن؟).', exH: '他是谁？', exP: 'Tā shì shéi?', exEn: 'Who is he?', exAr: 'من هو؟' },
  { id: 'w16', u: 1, h: '什么', p: 'shénme', en: 'What', ar: 'ماذا / ما', posEn: 'Pronoun', posAr: 'أداة استفهام', hookEn: 'Placed directly where the answer goes in SVO word order.', hookAr: 'توضع في نفس مكان الإجابة في الجملة دون تقديمها للبداية.', exH: '你吃什么？', exP: 'Nǐ chī shénme?', exEn: 'What do you eat?', exAr: 'ماذا تأكل؟' },
  { id: 'w17', u: 1, h: '多少', p: 'duōshao', en: 'How many / How much', ar: 'كم (للسعر والعدد الكبير)', posEn: 'Pronoun', posAr: 'أداة استفهام', hookEn: '多 (many) + 少 (few) = asking quantity (>10) or price.', hookAr: 'كثير 多 + قليل 少 = للسؤال عن السعر أو الأعداد الكبيرة.', exH: '这个多少钱？', exP: 'Zhège duōshao qián?', exEn: 'How much money is this?', exAr: 'بكم هذا؟' },
  { id: 'w18', u: 1, h: '几', p: 'jǐ', en: 'How many (under 10)', ar: 'كم (للأعداد الصغيرة)', posEn: 'Pronoun', posAr: 'أداة استفهام', hookEn: 'Used for small numbers (1–10), children’s age, and clock time.', hookAr: 'تُستخدم للأعداد الصغيرة (١–١٠) والسؤال عن الساعة والعمر الصغير.', exH: '你有几个苹果？', exP: 'Nǐ yǒu jǐ gè píngguǒ?', exEn: 'How many apples do you have?', exAr: 'كم تفاحة لديك؟' },
  { id: 'w19', u: 1, h: '怎么', p: 'zěnme', en: 'How / Why', ar: 'كيف / لماذا', posEn: 'Pronoun', posAr: 'أداة استفهام', hookEn: 'Heart 心 at the bottom — asking "how" an action is done.', hookAr: 'تحتوي على جذر القلب 心 في الأسفل وتُسأل عن الكيفية (كيف؟).', exH: '这个字怎么读？', exP: 'Zhège zì zěnme dú?', exEn: 'How is this character read?', exAr: 'كيف يُقرأ هذا الحرف؟' },
  { id: 'w20', u: 1, h: '怎么样', p: 'zěnmeyàng', en: 'How is it? / How about...?', ar: 'كيف الحال / ما رأيك؟', posEn: 'Pronoun', posAr: 'أداة استفهام', hookEn: 'Placed at the end of a sentence to ask for an opinion or condition.', hookAr: 'توضع في نهاية الجملة للسؤال عن الرأي أو الحالة.', exH: '今天天气怎么样？', exP: 'Jīntiān tiānqì zěnmeyàng?', exEn: 'How is the weather today?', exAr: 'كيف الطقس اليوم؟' },

  // UNIT 2: Numbers & Measure Words (17)
  { id: 'w21', u: 2, h: '一', p: 'yī', en: 'One (1)', ar: 'واحد (١)', posEn: 'Number', posAr: 'رقم', hookEn: 'Single horizontal stroke representing 1.', hookAr: 'خط أفقي واحد يمثل الرقم ١.', exH: '我有一个杯子。', exP: 'Wǒ yǒu yí gè bēizi.', exEn: 'I have one cup.', exAr: 'لدي كوب واحد.' },
  { id: 'w22', u: 2, h: '二', p: 'èr', en: 'Two (2)', ar: 'اثنان (٢)', posEn: 'Number', posAr: 'رقم', hookEn: 'Two horizontal strokes representing 2 (use 两 before measure words).', hookAr: 'خطان أفقيان يمثلان الرقم ٢ (ونستخدم 两 قبل أدوات التمييز).', exH: '今天二月二日。', exP: 'Jīntiān èryuè èr rì.', exEn: 'Today is February 2nd.', exAr: 'اليوم هو الثاني من فبراير.' },
  { id: 'w23', u: 2, h: '三', p: 'sān', en: 'Three (3)', ar: 'ثلاثة (٣)', posEn: 'Number', posAr: 'رقم', hookEn: 'Three horizontal strokes representing 3.', hookAr: 'ثلاثة خطوط أفقية تمثل الرقم ٣.', exH: '我有三本书。', exP: 'Wǒ yǒu sān běn shū.', exEn: 'I have three books.', exAr: 'لدي ثلاثة كتب.' },
  { id: 'w24', u: 2, h: '四', p: 'sì', en: 'Four (4)', ar: 'أربعة (٤)', posEn: 'Number', posAr: 'رقم', hookEn: 'Enclosure 口 with two inner strokes.', hookAr: 'مربع 口 بداخله خطان منحنيان يمثل الرقم ٤.', exH: '今天星期四。', exP: 'Jīntiān xīngqīsì.', exEn: 'Today is Thursday.', exAr: 'اليوم هو الخميس.' },
  { id: 'w25', u: 2, h: '五', p: 'wǔ', en: 'Five (5)', ar: 'خمسة (٥)', posEn: 'Number', posAr: 'رقم', hookEn: 'Crossed strokes between top and bottom bars.', hookAr: 'خطوط متقاطعة بين خط علوي وسفلي تمثل الرقم ٥.', exH: '现在五点。', exP: 'Xiànzài wǔ diǎn.', exEn: 'It is 5 o’clock now.', exAr: 'الساعة الخامسة الآن.' },
  { id: 'w26', u: 2, h: '六', p: 'liù', en: 'Six (6)', ar: 'ستة (٦)', posEn: 'Number', posAr: 'رقم', hookEn: 'Top dot and horizontal bar over two legs.', hookAr: 'نقطة وخط أفقي فوق ساقين تمثل الرقم ٦.', exH: '我有六个朋友。', exP: 'Wǒ yǒu liù gè péngyou.', exEn: 'I have six friends.', exAr: 'لدي ستة أصدقاء.' },
  { id: 'w27', u: 2, h: '七', p: 'qī', en: 'Seven (7)', ar: 'سبعة (٧)', posEn: 'Number', posAr: 'رقم', hookEn: 'Crossed horizontal and curved vertical hook.', hookAr: 'تقاطع خط أفقي مع خط معقوف يمثل الرقم ٧.', exH: '七月很热。', exP: 'Qīyuè hěn rè.', exEn: 'July is very hot.', exAr: 'شهر يوليو حار جداً.' },
  { id: 'w28', u: 2, h: '八', p: 'bā', en: 'Eight (8)', ar: 'ثمانية (٨)', posEn: 'Number', posAr: 'رقم', hookEn: 'Two strokes spreading outward — lucky number in China.', hookAr: 'خطان متباعدان للخارج، وهو رقم الحظ في الصين (٨).', exH: '他八岁了。', exP: 'Tā bā suì le.', exEn: 'He is eight years old.', exAr: 'عمره ثماني سنوات.' },
  { id: 'w29', u: 2, h: '九', p: 'jiǔ', en: 'Nine (9)', ar: 'تسعة (٩)', posEn: 'Number', posAr: 'رقم', hookEn: 'Curved hook stroke representing 9.', hookAr: 'خط معقوف متقاطع يمثل الرقم ٩.', exH: '九月九日。', exP: 'Jiǔyuè jiǔ rì.', exEn: 'September 9th.', exAr: 'التاسع من سبتمبر.' },
  { id: 'w30', u: 2, h: '十', p: 'shí', en: 'Ten (10)', ar: 'عشرة (١٠)', posEn: 'Number', posAr: 'رقم', hookEn: 'Cross shape representing 10.', hookAr: 'شكل متقاطع (+) يمثل الرقم ١٠.', exH: '十块钱。', exP: 'Shí kuài qián.', exEn: 'Ten yuan (money).', exAr: 'عشرة يوانات.' },
  { id: 'w31', u: 2, h: '零', p: 'líng', en: 'Zero (0)', ar: 'صفر (٠)', posEn: 'Number', posAr: 'رقم', hookEn: 'Rain radical 雨 on top — drops falling like zero.', hookAr: 'يحمل جذر المطر 雨 في الأعلى ويمثل الرقم صفر.', exH: '二零二六年。', exP: 'Èr líng èr liù nián.', exEn: 'Year 2026.', exAr: 'عام ٢٠٢٦.' },
  { id: 'w32', u: 2, h: '个', p: 'gè', en: 'General measure word', ar: 'أداة تمييز عامة', posEn: 'Measure', posAr: 'أداة تمييز', hookEn: 'Universal classifier used between numbers and nouns.', hookAr: 'أشهر أداة تمييز عامة توضع بين الرقم والاسم المعدود.', exH: '三个人。', exP: 'Sān gè rén.', exEn: 'Three people.', exAr: 'ثلاثة أشخاص.' },
  { id: 'w33', u: 2, h: '岁', p: 'suì', en: 'Years old (age)', ar: 'سنة (للعمر)', posEn: 'Measure', posAr: 'أداة تمييز', hookEn: 'Mountain 山 on top — counting years of age.', hookAr: 'جبل 山 في الأعلى، وتُستخدم لعدّ سنوات العمر.', exH: '你今年几岁？', exP: 'Nǐ jīnnián jǐ suì?', exEn: 'How old are you this year?', exAr: 'كم عمرك هذه السنة؟' },
  { id: 'w34', u: 2, h: '本', p: 'běn', en: 'Measure word for books', ar: 'أداة تمييز للكتب', posEn: 'Measure', posAr: 'أداة تمييز', hookEn: 'Tree 木 with root mark — books are made from trees.', hookAr: 'شجرة 木 مع علامة الجذر — فالكتب تُصنع من الأشجار.', exH: '一本书。', exP: 'Yì běn shū.', exEn: 'One book.', exAr: 'كتاب واحد.' },
  { id: 'w35', u: 2, h: '些', p: 'xiē', en: 'Some / A few', ar: 'بعض / قليل من', posEn: 'Measure', posAr: 'أداة كمية', hookEn: 'Used in 一些 (some) and 这些 (these).', hookAr: 'تُستخدم في 一些 (بعض) و 这些 (هؤلاء/هذه).', exH: '我买了一些水果。', exP: 'Wǒ mǎi le yìxiē shuǐguǒ.', exEn: 'I bought some fruit.', exAr: 'اشتريت بعض الفواكه.' },
  { id: 'w163', u: 2, h: '一点儿', p: 'yìdiǎnr', en: 'A little / A bit', ar: 'قليلاً / بعض الشيء', posEn: 'Measure', posAr: 'كمية', hookEn: 'Used after verbs/adjectives: 说一点儿汉语 (speak a little Chinese).', hookAr: 'تُستخدم بعد الأفعال والصفات للتخفيف أو التعبير عن القلة.', exH: '我会说一点儿汉语。', exP: 'Wǒ huì shuō yìdiǎnr Hànyǔ.', exEn: 'I can speak a little Chinese.', exAr: 'أستطيع التحدث بالقليل من الصينية.' },
  { id: 'w36', u: 2, h: '块', p: 'kuài', en: 'Yuan (currency unit) / Piece', ar: 'يوان (عملة) / قطعة', posEn: 'Measure', posAr: 'أداة تمييز', hookEn: 'Earth 土 + 夬 — everyday spoken unit for Chinese money (RMB).', hookAr: 'الوحدة المتداولة يومياً للعملة الصينية (اليوان).', exH: '五块钱。', exP: 'Wǔ kuài qián.', exEn: 'Five yuan.', exAr: 'خمسة يوانات.' },

  // UNIT 3: Time, Dates & Calendar (16)
  { id: 'w37', u: 3, h: '现在', p: 'xiànzài', en: 'Now', ar: 'الآن', posEn: 'Time', posAr: 'ظرف زمان', hookEn: 'Placed at the start of a sentence or right after the subject.', hookAr: 'توضع في بداية الجملة أو بعد الفاعل مباشرة.', exH: '现在几点？', exP: 'Xiànzài jǐ diǎn?', exEn: 'What time is it now?', exAr: 'كم الساعة الآن؟' },
  { id: 'w38', u: 3, h: '点', p: 'diǎn', en: 'O’clock / Dot', ar: 'الساعة (تماماً)', posEn: 'Measure', posAr: 'وحدة وقت', hookEn: 'Four dots at the bottom — used for clock hours.', hookAr: 'أربع نقاط في الأسفل وتُستخدم للدلالة على الساعة.', exH: '现在八点。', exP: 'Xiànzài bā diǎn.', exEn: 'It is 8 o’clock now.', exAr: 'الساعة الثامنة الآن.' },
  { id: 'w39', u: 3, h: '分', p: 'fēn', en: 'Minute / Divide', ar: 'دقيقة / يقسم', posEn: 'Measure', posAr: 'وحدة وقت', hookEn: 'Eight 八 over knife 刀 — dividing an hour into minutes.', hookAr: 'تُقسم الساعة إلى دقائق؛ مثل 九点十分 (٩:١٠).', exH: '九点十分。', exP: 'Jiǔ diǎn shí fēn.', exEn: '9:10 (nine ten).', exAr: 'التاسعة وعشر دقائق.' },
  { id: 'w164', u: 3, h: '分钟', p: 'fēnzhōng', en: 'Minute (duration)', ar: 'دقيقة (مدة زمنية)', posEn: 'Noun', posAr: 'اسم', hookEn: 'Use 分 for clock time (9:10) and 分钟 for duration (10 minutes).', hookAr: 'تُستخدم 分钟 للمدة الزمنية (عشر دقائق) بينما 分 للساعة.', exH: '我等了十分钟。', exP: 'Wǒ děng le shí fēnzhōng.', exEn: 'I waited for ten minutes.', exAr: 'انتظرت لمدة عشر دقائق.' },
  { id: 'w40', u: 3, h: '中午', p: 'zhōngwǔ', en: 'Noon / Midday', ar: 'الظهيرة', posEn: 'Time', posAr: 'ظرف زمان', hookEn: '中 (middle) + 午 (noon).', hookAr: '中 (منتصف) + 午 (النهار) = الظهيرة.', exH: '我中午吃米饭。', exP: 'Wǒ zhōngwǔ chī mǐfàn.', exEn: 'I eat rice at noon.', exAr: 'آكل الأرز في الظهيرة.' },
  { id: 'w41', u: 3, h: '上午', p: 'shàngwǔ', en: 'Morning (before noon)', ar: 'الصباح (قبل الظهر)', posEn: 'Time', posAr: 'ظرف زمان', hookEn: '上 (before/upper) + 午 (noon).', hookAr: '上 (قبل) + 午 (الظهر) = فترة الصباح.', exH: '上午我去商店。', exP: 'Shàngwǔ wǒ qù shāngdiàn.', exEn: 'In the morning I go to the store.', exAr: 'في الصباح أذهب إلى المتجر.' },
  { id: 'w42', u: 3, h: '下午', p: 'xiàwǔ', en: 'Afternoon', ar: 'بعد الظهر / المساء المبكر', posEn: 'Time', posAr: 'ظرف زمان', hookEn: '下 (after/lower) + 午 (noon).', hookAr: '下 (بعد) + 午 (الظهر) = فترة بعد الظهر.', exH: '下午我看书。', exP: 'Xiàwǔ wǒ kàn shū.', exEn: 'In the afternoon I read books.', exAr: 'بعد الظهر أقرأ الكتب.' },
  { id: 'w43', u: 3, h: '今天', p: 'jīntiān', en: 'Today', ar: 'اليوم', posEn: 'Time', posAr: 'ظرف زمان', hookEn: '今 (present) + 天 (day).', hookAr: '今 (الحاضر) + 天 (يوم) = اليوم.', exH: '今天很冷。', exP: 'Jīntiān hěn lěng.', exEn: 'Today is very cold.', exAr: 'اليوم بارد جداً.' },
  { id: 'w44', u: 3, h: '明天', p: 'míngtiān', en: 'Tomorrow', ar: 'غداً', posEn: 'Time', posAr: 'ظرف زمان', hookEn: '明 (bright: sun 日 + moon 月) + 天 (day) = next bright day.', hookAr: '明 (شمس 日 + قمر 月 = مشرق) + 天 (يوم) = الغد.', exH: '明天见！', exP: 'Míngtiān jiàn!', exEn: 'See you tomorrow!', exAr: 'أراك غداً!' },
  { id: 'w45', u: 3, h: '昨天', p: 'zuótiān', en: 'Yesterday', ar: 'أمس', posEn: 'Time', posAr: 'ظرف زمان', hookEn: 'Sun radical 日 on the left — past day.', hookAr: 'جذر الشمس 日 على اليسار ويدل على اليوم الماضي (أمس).', exH: '昨天我没工作。', exP: 'Zuótiān wǒ méi gōngzuò.', exEn: 'Yesterday I did not work.', exAr: 'أمس لم أعمل.' },
  { id: 'w46', u: 3, h: '年', p: 'nián', en: 'Year', ar: 'سنة / عام', posEn: 'Noun', posAr: 'اسم', hookEn: 'Mandarin dates go big-to-small: Year → Month → Day.', hookAr: 'يُرتب التاريخ في الصينية من الأكبر للأصغر: سنة ← شهر ← يوم.', exH: '今年是二零二六年。', exP: 'Jīnnián shì èr líng èr liù nián.', exEn: 'This year is 2026.', exAr: 'هذه السنة هي ٢٠٢٦.' },
  { id: 'w47', u: 3, h: '月', p: 'yuè', en: 'Month / Moon', ar: 'شهر / قمر', posEn: 'Noun', posAr: 'اسم', hookEn: 'Pictograph of a crescent moon; 1月 = Jan, 12月 = Dec.', hookAr: 'رسم لهلال القمر؛ وتُصاغ الشهور بوضع الرقم قبل 月.', exH: '一月很冷。', exP: 'Yīyuè hěn lěng.', exEn: 'January is very cold.', exAr: 'شهر يناير بارد جداً.' },
  { id: 'w48', u: 3, h: '日', p: 'rì', en: 'Day / Sun (written dates)', ar: 'يوم / شمس (للتواريخ)', posEn: 'Noun', posAr: 'اسم', hookEn: 'Pictograph of the sun; used for formal/written calendar dates.', hookAr: 'رسم للشمس ويُستخدم لكتابة أيام الشهر رسمياً.', exH: '五月十日。', exP: 'Wǔyuè shí rì.', exEn: 'May 10th.', exAr: 'العاشر من مايو.' },
  { id: 'w165', u: 3, h: '号', p: 'hào', en: 'Day of month (spoken) / Number', ar: 'تاريخ اليوم (محادثة) / رقم', posEn: 'Noun', posAr: 'اسم', hookEn: 'Spoken equivalent of 日 for dates: 今天几号？(What is today’s date?)', hookAr: 'المقابل الشفوي لكلمة 日 لذكر تاريخ اليوم في المحادثات.', exH: '今天五月十号。', exP: 'Jīntiān wǔyuè shí hào.', exEn: 'Today is May 10th.', exAr: 'اليوم العاشر من مايو.' },
  { id: 'w49', u: 3, h: '星期', p: 'xīngqī', en: 'Week', ar: 'أسبوع', posEn: 'Noun', posAr: 'اسم', hookEn: '星期一 (Mon) through 星期六 (Sat), and 星期日/天 (Sun).', hookAr: 'تُركب أيام الأسبوع بـ 星期 + رقم من ١ (الاثنين) إلى ٦ (السبت)، والأحد 星期日.', exH: '今天星期三。', exP: 'Jīntiān xīngqīsān.', exEn: 'Today is Wednesday.', exAr: 'اليوم هو الأربعاء.' },
  { id: 'w50', u: 3, h: '时候', p: 'shíhou', en: 'Time / Moment (when)', ar: 'وقت / عندما', posEn: 'Noun', posAr: 'اسم', hookEn: '什么时候 = "when?" (literally "what time").', hookAr: 'العبارة 什么时候 تعني «متى؟» (في أي وقت).', exH: '你什么时候回家？', exP: 'Nǐ shénme shíhou huí jiā?', exEn: 'When do you return home?', exAr: 'متى تعود إلى المنزل؟' },

  // UNIT 4: Family & People (14)
  { id: 'w51', u: 4, h: '家', p: 'jiā', en: 'Home / Family', ar: 'منزل / عائلة', posEn: 'Noun', posAr: 'اسم', hookEn: 'Roof radical 宀 over 豕 — livelihood under a roof = home.', hookAr: 'جذر السقف 宀 في الأعلى يرمز للبيت الذي يجمع العائلة.', exH: '我在家。', exP: 'Wǒ zài jiā.', exEn: 'I am at home.', exAr: 'أنا في المنزل.' },
  { id: 'w166', u: 4, h: '人', p: 'rén', en: 'Person / People', ar: 'إنسان / شخص', posEn: 'Noun', posAr: 'اسم', hookEn: 'Pictograph of a walking person with two legs.', hookAr: 'رسم توضيحي لإنسان يمشي على ساقين.', exH: '这里人很多。', exP: 'Zhèlǐ rén hěn duō.', exEn: 'There are many people here.', exAr: 'يوجد الكثير من الناس هنا.' },
  { id: 'w167', u: 4, h: '名字', p: 'míngzi', en: 'Name', ar: 'اسم', posEn: 'Noun', posAr: 'اسم', hookEn: '名 (reputation/name) + 字 (character).', hookAr: '名 (اسم) + 字 (حرف) = الاسم الشخصي.', exH: '你叫什么名字？', exP: 'Nǐ jiào shénme míngzi?', exEn: 'What is your name?', exAr: 'ما اسمك؟' },
  { id: 'w52', u: 4, h: '爸爸', p: 'bàba', en: 'Dad / Father', ar: 'أب / بابا', posEn: 'Noun', posAr: 'اسم', hookEn: 'Father radical 父 on top + 巴 phonetic.', hookAr: 'جذر الأب 父 في الأعلى والمقطع الصوتي 巴 في الأسفل.', exH: '我爸爸是医生。', exP: 'Wǒ bàba shì yīshēng.', exEn: 'My dad is a doctor.', exAr: 'أبي طبيب.' },
  { id: 'w53', u: 4, h: '妈妈', p: 'māma', en: 'Mom / Mother', ar: 'أم / ماما', posEn: 'Noun', posAr: 'اسم', hookEn: 'Woman radical 女 + 马 (mǎ phonetic).', hookAr: 'جذر المرأة 女 مع المقطع الصوتي 马.', exH: '我爱妈妈。', exP: 'Wǒ ài māma.', exEn: 'I love Mom.', exAr: 'أنا أحب أمي.' },
  { id: 'w54', u: 4, h: '儿子', p: 'érzi', en: 'Son', ar: 'ابن', posEn: 'Noun', posAr: 'اسم', hookEn: '儿 (child/legs) + 子 (child).', hookAr: 'تتكون من مقطعين يدلان على الابن الذكر.', exH: '他有三个儿子。', exP: 'Tā yǒu sān gè érzi.', exEn: 'He has three sons.', exAr: 'لديه ثلاثة أبناء.' },
  { id: 'w55', u: 4, h: '女儿', p: 'nǚ’ér', en: 'Daughter', ar: 'ابنة', posEn: 'Noun', posAr: 'اسم', hookEn: '女 (female) + 儿 (child).', hookAr: '女 (أنثى) + 儿 (طفل) = ابنة.', exH: '这是我的女儿。', exP: 'Zhè shì wǒ de nǚ’ér.', exEn: 'This is my daughter.', exAr: 'هذه ابنتي.' },
  { id: 'w56', u: 4, h: '先生', p: 'xiānsheng', en: 'Mr. / Sir / Husband', ar: 'سيد / أستاذ', posEn: 'Noun', posAr: 'لقب', hookEn: 'Placed after a surname: 王先生 (Mr. Wang).', hookAr: 'تُوضع بعد اسم العائلة كـ 王先生 (السيد وانغ).', exH: '王先生你好！', exP: 'Wáng xiānsheng nǐ hǎo!', exEn: 'Hello, Mr. Wang!', exAr: 'مرحباً سيد وانغ!' },
  { id: 'w57', u: 4, h: '小姐', p: 'xiǎojiě', en: 'Miss / Young lady', ar: 'آنسة', posEn: 'Noun', posAr: 'لقب', hookEn: '小 (small/young) + 姐 (older sister).', hookAr: 'تُوضع بعد اسم العائلة لمخاطبة الآنسة: 李小姐.', exH: '李小姐很漂亮。', exP: 'Lǐ xiǎojiě hěn piàoliang.', exEn: 'Miss Li is very pretty.', exAr: 'الآنسة لي جميلة جداً.' },
  { id: 'w58', u: 4, h: '朋友', p: 'péngyou', en: 'Friend', ar: 'صديق', posEn: 'Noun', posAr: 'اسم', hookEn: '朋 shows two moons side by side — companions together.', hookAr: 'الحرف 朋 يشبه قمرين متجاورين يرمزان للرفقة والصداقة.', exH: '她是我的好朋友。', exP: 'Tā shì wǒ de hǎo péngyou.', exEn: 'She is my good friend.', exAr: 'هي صديقتي المقربة.' },
  { id: 'w59', u: 4, h: '同学', p: 'tóngxué', en: 'Classmate', ar: 'زميل دراسة', posEn: 'Noun', posAr: 'اسم', hookEn: '同 (same/together) + 学 (study) = studying together.', hookAr: '同 (معاً/نفس) + 学 (يدرس) = زميل في الدراسة.', exH: '我们是同学。', exP: 'Wǒmen shì tóngxué.', exEn: 'We are classmates.', exAr: 'نحن زملاء دراسة.' },
  { id: 'w60', u: 4, h: '老师', p: 'lǎoshī', en: 'Teacher', ar: 'معلم / أستاذ', posEn: 'Noun', posAr: 'اسم', hookEn: '老 (respected/senior) + 师 (master/teacher).', hookAr: '老 (موقّر) + 师 (معلم) = الأستاذ أو المعلم.', exH: '张老师教汉语。', exP: 'Zhāng lǎoshī jiāo Hànyǔ.', exEn: 'Teacher Zhang teaches Chinese.', exAr: 'الأستاذ تشانغ يعلّم اللغة الصينية.' },
  { id: 'w61', u: 4, h: '学生', p: 'xuéshēng', en: 'Student', ar: 'طالب', posEn: 'Noun', posAr: 'اسم', hookEn: '学 (study) + 生 (person/life).', hookAr: '学 (يدرس) + 生 (شخص) = طالب علم.', exH: '我是大学生。', exP: 'Wǒ shì dàxuéshēng.', exEn: 'I am a university student.', exAr: 'أنا طالب جامعي.' },
  { id: 'w62', u: 4, h: '医生', p: 'yīshēng', en: 'Doctor', ar: 'طبيب', posEn: 'Noun', posAr: 'اسم', hookEn: '医 (medicine) + 生 (person).', hookAr: '医 (الطب) + 生 (شخص) = طبيب.', exH: '他在医院做医生。', exP: 'Tā zài yīyuàn zuò yīshēng.', exEn: 'He works as a doctor at the hospital.', exAr: 'يعمل طبيباً في المستشفى.' },

  // UNIT 5: Food, Drink & Dining (12)
  { id: 'w63', u: 5, h: '水', p: 'shuǐ', en: 'Water', ar: 'ماء', posEn: 'Noun', posAr: 'اسم', hookEn: 'Pictograph of flowing water streams.', hookAr: 'رسم يشبه تيار الماء المتدفق.', exH: '我想喝水。', exP: 'Wǒ xiǎng hē shuǐ.', exEn: 'I want to drink water.', exAr: 'أريد أن أشرب الماء.' },
  { id: 'w64', u: 5, h: '茶', p: 'chá', en: 'Tea', ar: 'شاي', posEn: 'Noun', posAr: 'اسم', hookEn: 'Plant radical 艹 on top + person 人 + tree 木.', hookAr: 'جذر النبات 艹 في الأعلى يرمز لأوراق الشاي.', exH: '请喝茶！', exP: 'Qǐng hē chá!', exEn: 'Please drink some tea!', exAr: 'تفضل بشرب الشاي!' },
  { id: 'w65', u: 5, h: '米饭', p: 'mǐfàn', en: 'Cooked rice', ar: 'أرز مطبوخ', posEn: 'Noun', posAr: 'اسم', hookEn: '米 (rice grains) + 饭 (meal/food).', hookAr: '米 (حبات الأرز) + 饭 (وجبة) = الأرز المطبوخ.', exH: '我喜欢吃米饭。', exP: 'Wǒ xǐhuan chī mǐfàn.', exEn: 'I like eating rice.', exAr: 'أحب أكل الأرز.' },
  { id: 'w66', u: 5, h: '菜', p: 'cài', en: 'Dish / Vegetable / Cuisine', ar: 'طبق طعام / خضار', posEn: 'Noun', posAr: 'اسم', hookEn: 'Plant radical 艹 on top; 中国菜 = Chinese cuisine.', hookAr: 'جذر النبات 艹 في الأعلى؛ وتُستخدم للأطباق والخضار، مثل 中国菜.', exH: '中国菜很好吃。', exP: 'Zhōngguó cài hěn hǎochī.', exEn: 'Chinese food is delicious.', exAr: 'الطعام الصيني لذيذ جداً.' },
  { id: 'w67', u: 5, h: '水果', p: 'shuǐguǒ', en: 'Fruit', ar: 'فاكهة', posEn: 'Noun', posAr: 'اسم', hookEn: '水 (water/juicy) + 果 (fruit on a tree).', hookAr: '水 (ماء/عصارة) + 果 (ثمرة) = فاكهة.', exH: '我想买水果。', exP: 'Wǒ xiǎng mǎi shuǐguǒ.', exEn: 'I want to buy fruit.', exAr: 'أريد شراء الفاكهة.' },
  { id: 'w68', u: 5, h: '苹果', p: 'píngguǒ', en: 'Apple', ar: 'تفاحة', posEn: 'Noun', posAr: 'اسم', hookEn: 'Plant radical 艹 + 平 (píng phonetic) + 果 (fruit).', hookAr: 'يبدأ بجذر النبات 艹 مع ثمرة 果 = تفاحة.', exH: '这个苹果很大。', exP: 'Zhège píngguǒ hěn dà.', exEn: 'This apple is very big.', exAr: 'هذه التفاحة كبيرة جداً.' },
  { id: 'w69', u: 5, h: '杯子', p: 'bēizi', en: 'Cup / Glass', ar: 'كوب / كأس', posEn: 'Noun', posAr: 'اسم', hookEn: 'Wood radical 木 on left — originally wooden cups.', hookAr: 'جذر الخشب 木 على اليسار — فقد صُنعت الأكواب قديماً من الخشب.', exH: '桌子上有一个杯子。', exP: 'Zhuōzi shàng yǒu yí gè bēizi.', exEn: 'There is a cup on the table.', exAr: 'يوجد كوب على الطاولة.' },
  { id: 'w70', u: 5, h: '吃', p: 'chī', en: 'To eat', ar: 'يأكل', posEn: 'Verb', posAr: 'فعل', hookEn: 'Mouth radical 口 on left — eating with the mouth.', hookAr: 'يبدأ بجذر الفم 口 على اليسار لأن الأكل يتم بالفم.', exH: '你吃什么？', exP: 'Nǐ chī shénme?', exEn: 'What are you eating?', exAr: 'ماذا تأكل؟' },
  { id: 'w71', u: 5, h: '喝', p: 'hē', en: 'To drink', ar: 'يشرب', posEn: 'Verb', posAr: 'فعل', hookEn: 'Mouth radical 口 on left — drinking with the mouth.', hookAr: 'يبدأ بجذر الفم 口 على اليسار لأن الشرب يتم بالفم.', exH: '我喝茶，不喝水。', exP: 'Wǒ hē chá, bù hē shuǐ.', exEn: 'I drink tea, not water.', exAr: 'أشرب الشاي، لا أشرب الماء.' },
  { id: 'w72', u: 5, h: '饭店', p: 'fàndiàn', en: 'Restaurant / Hotel', ar: 'مطعم / فندق', posEn: 'Noun', posAr: 'اسم', hookEn: '饭 (meal) + 店 (shop) = place serving meals.', hookAr: '饭 (وجبة) + 店 (متجر) = مطعم أو فندق.', exH: '我们在饭店吃饭。', exP: 'Wǒmen zài fàndiàn chīfàn.', exEn: 'We eat at the restaurant.', exAr: 'نحن نأكل في المطعم.' },
  { id: 'w73', u: 5, h: '饿', p: 'è', en: 'Hungry', ar: 'جائع', posEn: 'Adjective', posAr: 'صفة', hookEn: 'Food radical 饣 on left + 我 (wǒ phonetic).', hookAr: 'يبدأ بجذر الطعام 饣 على اليسار ليدل على الجوع.', exH: '我饿了，想吃饭。', exP: 'Wǒ è le, xiǎng chīfàn.', exEn: 'I’m hungry and want to eat.', exAr: 'أنا جائع وأريد أن آكل.' },
  { id: 'w74', u: 5, h: '渴', p: 'kě', en: 'Thirsty', ar: 'عطشان', posEn: 'Adjective', posAr: 'صفة', hookEn: 'Water radical 氵 on left — needing water.', hookAr: 'يبدأ بجذر الماء 氵 على اليسار ليدل على الحاجة للماء.', exH: '我很渴，想喝水。', exP: 'Wǒ hěn kě, xiǎng hē shuǐ.', exEn: 'I am very thirsty and want water.', exAr: 'أنا عطشان جداً وأريد ماءً.' },

  // UNIT 6: Places & Locations (16)
  { id: 'w75', u: 6, h: '中国', p: 'Zhōngguó', en: 'China', ar: 'الصين', posEn: 'Noun', posAr: 'اسم علم', hookEn: '中 (middle) + 国 (country) = "Middle Kingdom."', hookAr: '中 (الوسط) + 国 (دولة) = دولة الوسط (الصين).', exH: '我在中国学习。', exP: 'Wǒ zài Zhōngguó xuéxí.', exEn: 'I study in China.', exAr: 'أدرس في الصين.' },
  { id: 'w76', u: 6, h: '北京', p: 'Běijīng', en: 'Beijing', ar: 'بكين', posEn: 'Noun', posAr: 'اسم علم', hookEn: '北 (north) + 京 (capital) = "Northern Capital."', hookAr: '北 (الشمال) + 京 (العاصمة) = العاصمة الشمالية (بكين).', exH: '北京很漂亮。', exP: 'Běijīng hěn piàoliang.', exEn: 'Beijing is very beautiful.', exAr: 'بكين جميلة جداً.' },
  { id: 'w77', u: 6, h: '学校', p: 'xuéxiào', en: 'School', ar: 'مدرسة', posEn: 'Noun', posAr: 'اسم', hookEn: '学 (study) + 校 (campus/school).', hookAr: '学 (يتعلم) + 校 (حرم) = مدرسة.', exH: '这是我们的学校。', exP: 'Zhè shì wǒmen de xuéxiào.', exEn: 'This is our school.', exAr: 'هذه مدرستنا.' },
  { id: 'w78', u: 6, h: '医院', p: 'yīyuàn', en: 'Hospital', ar: 'مستشفى', posEn: 'Noun', posAr: 'اسم', hookEn: '医 (medical) + 院 (courtyard/institution).', hookAr: '医 (الطب) + 院 (مؤسسة) = مستشفى.', exH: '他在医院工作。', exP: 'Tā zài yīyuàn gōngzuò.', exEn: 'He works at the hospital.', exAr: 'هو يعمل في المستشفى.' },
  { id: 'w79', u: 6, h: '商店', p: 'shāngdiàn', en: 'Shop / Store', ar: 'متجر / دكان', posEn: 'Noun', posAr: 'اسم', hookEn: '商 (commerce) + 店 (shop).', hookAr: '商 (تجارة) + 店 (محل) = متجر.', exH: '我去商店买衣服。', exP: 'Wǒ qù shāngdiàn mǎi yīfu.', exEn: 'I go to the store to buy clothes.', exAr: 'أذهب إلى المتجر لشراء الملابس.' },
  { id: 'w80', u: 6, h: '火车站', p: 'huǒchēzhàn', en: 'Train station', ar: 'محطة القطار', posEn: 'Noun', posAr: 'اسم', hookEn: '火 (fire) + 车 (vehicle) + 站 (station).', hookAr: '火车 (قطار) + 站 (محطة) = محطة القطار.', exH: '火车站在哪儿？', exP: 'Huǒchēzhàn zài nǎr?', exEn: 'Where is the train station?', exAr: 'أين محطة القطار؟' },
  { id: 'w81', u: 6, h: '飞机场', p: 'fēijīchǎng', en: 'Airport', ar: 'مطار', posEn: 'Noun', posAr: 'اسم', hookEn: '飞机 (airplane) + 场 (open field/ground).', hookAr: '飞机 (طائرة) + 场 (ساحة) = مطار.', exH: '我去飞机场。', exP: 'Wǒ qù fēijīchǎng.', exEn: 'I am going to the airport.', exAr: 'أنا ذاهب إلى المطار.' },
  { id: 'w82', u: 6, h: '家里', p: 'jiālǐ', en: 'At home / Inside the house', ar: 'في المنزل / داخل البيت', posEn: 'Noun', posAr: 'مكان', hookEn: '家 (home) + 里 (inside).', hookAr: '家 (البيت) + 里 (داخل) = في المنزل.', exH: '妈妈在家里。', exP: 'Māma zài jiālǐ.', exEn: 'Mom is at home.', exAr: 'أمي في المنزل.' },
  { id: 'w168', u: 6, h: '里', p: 'lǐ', en: 'Inside / In', ar: 'داخل / في', posEn: 'Location', posAr: 'ظرف مكان', hookEn: 'Placed after a noun to mean "inside": 学校里 (inside school).', hookAr: 'يوضع بعد الاسم ليدل على الداخل، مثل 书包里 (داخل الحقيبة).', exH: '杯子里有水。', exP: 'Bēizi lǐ yǒu shuǐ.', exEn: 'There is water inside the cup.', exAr: 'يوجد ماء داخل الكوب.' },
  { id: 'w169', u: 6, h: '上', p: 'shàng', en: 'On / Up / Attend / Last', ar: 'فوق / يصعد / يحضر', posEn: 'Location', posAr: 'مكان / فعل', hookEn: 'Line above the horizon: 桌子上 (on the table), 上课 (attend class).', hookAr: 'خط فوق خط الأساس: 桌子上 (فوق الطاولة) أو 上班 (يذهب للعمل).', exH: '桌子上有书。', exP: 'Zhuōzi shàng yǒu shū.', exEn: 'There is a book on the table.', exAr: 'يوجد كتاب على الطاولة.' },
  { id: 'w170', u: 6, h: '下', p: 'xià', en: 'Under / Down / Next', ar: 'تحت / ينزل / القادم', posEn: 'Location', posAr: 'مكان / فعل', hookEn: 'Line below the horizon: 椅子下 (under the chair), 下雨 (rain falls).', hookAr: 'خط أسفل خط الأساس: 椅子下 (تحت الكرسي) أو 下个星期 (الأسبوع القادم).', exH: '小狗在椅子下。', exP: 'Xiǎogǒu zài yǐzi xià.', exEn: 'The dog is under the chair.', exAr: 'الكلب تحت الكرسي.' },
  { id: 'w83', u: 6, h: '前面', p: 'qiánmiàn', en: 'In front / Ahead', ar: 'أمام', posEn: 'Location', posAr: 'ظرف مكان', hookEn: '前 (front) + 面 (side/face).', hookAr: '前 (أمام) + 面 (جهة) = في الأمام.', exH: '学校在前面。', exP: 'Xuéxiào zài qiánmiàn.', exEn: 'The school is ahead.', exAr: 'المدرسة في الأمام.' },
  { id: 'w84', u: 6, h: '后面', p: 'hòumiàn', en: 'Behind / Back', ar: 'خلف / وراء', posEn: 'Location', posAr: 'ظرف مكان', hookEn: '后 (back/after) + 面 (side).', hookAr: '后 (خلف) + 面 (جهة) = في الخلف.', exH: '商店在医院后面。', exP: 'Shāngdiàn zài yīyuàn hòumiàn.', exEn: 'The store is behind the hospital.', exAr: 'المتجر خلف المستشفى.' },
  { id: 'w85', u: 6, h: '里面', p: 'lǐmiàn', en: 'Inside', ar: 'داخل', posEn: 'Location', posAr: 'ظرف مكان', hookEn: '里 (inner) + 面 (side).', hookAr: '里 (داخل) + 面 (جهة) = بالداخل.', exH: '猫在房间里面。', exP: 'Māo zài fángjiān lǐmiàn.', exEn: 'The cat is inside the room.', exAr: 'القطة داخل الغرفة.' },
  { id: 'w86', u: 6, h: '上面', p: 'shàngmiàn', en: 'On top / Above', ar: 'فوق / أعلى', posEn: 'Location', posAr: 'ظرف مكان', hookEn: '上 (up/top) + 面 (surface).', hookAr: '上 (أعلى) + 面 (سطح) = في الأعلى / فوق.', exH: '书在桌子上面。', exP: 'Shū zài zhuōzi shàngmiàn.', exEn: 'The book is on top of the table.', exAr: 'الكتاب فوق الطاولة.' },
  { id: 'w87', u: 6, h: '下面', p: 'xiàmiàn', en: 'Under / Below', ar: 'تحت / أسفل', posEn: 'Location', posAr: 'ظرف مكان', hookEn: '下 (down/under) + 面 (surface).', hookAr: '下 (أسفل) + 面 (سطح) = تحت / بالأسفل.', exH: '小狗在椅子下面。', exP: 'Xiǎogǒu zài yǐzi xiàmiàn.', exEn: 'The puppy is under the chair.', exAr: 'الجرو تحت الكرسي.' },

  // UNIT 7: Transport & Directions (11)
  { id: 'w88', u: 7, h: '去', p: 'qù', en: 'To go', ar: 'يذهب', posEn: 'Verb', posAr: 'فعل', hookEn: '去 + Place: 去北京 (go to Beijing).', hookAr: 'يتبعها المكان مباشرة: 去北京 (يذهب إلى بكين).', exH: '明天我去北京。', exP: 'Míngtiān wǒ qù Běijīng.', exEn: 'Tomorrow I go to Beijing.', exAr: 'غداً أذهب إلى بكين.' },
  { id: 'w89', u: 7, h: '来', p: 'lái', en: 'To come', ar: 'يأتي', posEn: 'Verb', posAr: 'فعل', hookEn: 'Opposite of 去 (go) — movement toward the speaker.', hookAr: 'عكس 去 (يذهب) — وتعني الحركة باتجاه المتحدث (يأتي).', exH: '他来我家了。', exP: 'Tā lái wǒ jiā le.', exEn: 'He came to my home.', exAr: 'لقد أتى إلى منزلي.' },
  { id: 'w90', u: 7, h: '回', p: 'huí', en: 'To return / Go back', ar: 'يعود / يرجع', posEn: 'Verb', posAr: 'فعل', hookEn: 'Box inside a box — returning back to origin.', hookAr: 'مربع داخل مربع يرمز للعودة إلى نقطة البداية (البيت/البلد).', exH: '我五点回家。', exP: 'Wǒ wǔ diǎn huí jiā.', exEn: 'I return home at 5 o’clock.', exAr: 'أعود إلى المنزل الساعة الخامسة.' },
  { id: 'w91', u: 7, h: '出租车', p: 'chūzūchē', en: 'Taxi', ar: 'سيارة أجرة (تاكسي)', posEn: 'Noun', posAr: 'اسم', hookEn: '出租 (for rent) + 车 (car).', hookAr: '出租 (للإيجار) + 车 (سيارة) = تاكسي.', exH: '我们坐出租车去。', exP: 'Wǒmen zuò chūzūchē qù.', exEn: 'We go by taxi.', exAr: 'نذهب بالتاكسي.' },
  { id: 'w92', u: 7, h: '飞机', p: 'fēijī', en: 'Airplane', ar: 'طائرة', posEn: 'Noun', posAr: 'اسم', hookEn: '飞 (fly) + 机 (machine) = flying machine.', hookAr: '飞 (يطير) + 机 (آلة) = طائرة.', exH: '我坐飞机去中国。', exP: 'Wǒ zuò fēijī qù Zhōngguó.', exEn: 'I take an airplane to China.', exAr: 'أسافر بالطائرة إلى الصين.' },
  { id: 'w93', u: 7, h: '开', p: 'kāi', en: 'To drive / To open / Turn on', ar: 'يقود / يفتح / يشغّل', posEn: 'Verb', posAr: 'فعل', hookEn: '开车 (drive a car), 开门 (open a door).', hookAr: 'تُستخدم مع السيارة 开车 (يقود) والباب 开门 (يفتح).', exH: '爸爸会开车。', exP: 'Bàba huì kāichē.', exEn: 'Dad knows how to drive.', exAr: 'أبي يعرف قيادة السيارة.' },
  { id: 'w94', u: 7, h: '坐', p: 'zuò', en: 'To sit / To travel by', ar: 'يجلس / يستقل وسيلة نقل', posEn: 'Verb', posAr: 'فعل', hookEn: 'Two people 人 sitting on earth 土.', hookAr: 'شخصان 人 يجلسان على الأرض 土؛ وتُستخدم أيضاً لركوب المواصلات.', exH: '请坐！', exP: 'Qǐng zuò!', exEn: 'Please sit down!', exAr: 'تفضل بالجلوس!' },
  { id: 'w95', u: 7, h: '走', p: 'zǒu', en: 'To walk / To leave', ar: 'يمشي / يغادر', posEn: 'Verb', posAr: 'فعل', hookEn: 'Earth 土 over foot — walking on the ground.', hookAr: 'أرض 土 فوق قدم، وتعني يمشي أو ينصرف.', exH: '我们走吧！', exP: 'Wǒmen zǒu ba!', exEn: 'Let’s go / walk!', exAr: 'هيا نمشي / لنذهب!' },
  { id: 'w96', u: 7, h: '路', p: 'lù', en: 'Road / Street / Route', ar: 'طريق / شارع', posEn: 'Noun', posAr: 'اسم', hookEn: 'Foot radical 足 on left — path walked by feet.', hookAr: 'جذر القدم 足 على اليسار — المسار الذي تمشي عليه الأقدام.', exH: '这是去学校的路。', exP: 'Zhè shì qù xuéxiào de lù.', exEn: 'This is the road to school.', exAr: 'هذا هو الطريق إلى المدرسة.' },
  { id: 'w97', u: 7, h: '远', p: 'yuǎn', en: 'Far', ar: 'بعيد', posEn: 'Adjective', posAr: 'صفة', hookEn: 'Walking radical 辶 — a long walk away.', hookAr: 'يحمل جذر المشي 辶 ويدل على البُعد.', exH: '飞机场很远。', exP: 'Fēijīchǎng hěn yuǎn.', exEn: 'The airport is very far.', exAr: 'المطار بعيد جداً.' },
  { id: 'w98', u: 7, h: '近', p: 'jìn', en: 'Near / Close', ar: 'قريب', posEn: 'Adjective', posAr: 'صفة', hookEn: 'Walking radical 辶 + 斤 (jīn phonetic).', hookAr: 'يحمل جذر المشي 辶 ويدل على القرب.', exH: '商店离我家很近。', exP: 'Shāngdiàn lí wǒ jiā hěn jìn.', exEn: 'The store is very close to my home.', exAr: 'المتجر قريب جداً من منزلي.' },

  // UNIT 8: Shopping, Money & Objects (14)
  { id: 'w99', u: 8, h: '钱', p: 'qián', en: 'Money', ar: 'نقود / مال', posEn: 'Noun', posAr: 'اسم', hookEn: 'Metal radical 钅 on left — coins made of metal.', hookAr: 'جذر المعدن 钅 على اليسار لأن العملات قديماً كانت معدنية.', exH: '我有十块钱。', exP: 'Wǒ yǒu shí kuài qián.', exEn: 'I have ten yuan.', exAr: 'لدي عشرة يوانات.' },
  { id: 'w100', u: 8, h: '买', p: 'mǎi', en: 'To buy', ar: 'يشتري', posEn: 'Verb', posAr: 'فعل', hookEn: 'Opposite of 卖 (mài, to sell).', hookAr: 'فعل الشراء (بنغمة ثالثة)، عكسه 卖 (يبيع) بنغمة رابعة.', exH: '我想买一本书。', exP: 'Wǒ xiǎng mǎi yì běn shū.', exEn: 'I want to buy a book.', exAr: 'أريد شراء كتاب.' },
  { id: 'w101', u: 8, h: '东西', p: 'dōngxi', en: 'Thing / Stuff', ar: 'شيء / أغراض', posEn: 'Noun', posAr: 'اسم', hookEn: '东 (east) + 西 (west) = things from everywhere.', hookAr: '东 (شرق) + 西 (غرب) = أشياء من كل مكان.', exH: '她买了很多东西。', exP: 'Tā mǎi le hěn duō dōngxi.', exEn: 'She bought many things.', exAr: 'اشترت أشياء كثيرة.' },
  { id: 'w102', u: 8, h: '衣服', p: 'yīfu', en: 'Clothes', ar: 'ملابس', posEn: 'Noun', posAr: 'اسم', hookEn: '衣 (clothing) + 服 (garment).', hookAr: 'كلمة شاملة للملابس.', exH: '这件衣服很漂亮。', exP: 'Zhè jiàn yīfu hěn piàoliang.', exEn: 'This piece of clothing is pretty.', exAr: 'هذه الملابس جميلة جداً.' },
  { id: 'w103', u: 8, h: '电脑', p: 'diànnǎo', en: 'Computer', ar: 'حاسوب / كمبيوتر', posEn: 'Noun', posAr: 'اسم', hookEn: '电 (electric) + 脑 (brain) = "electric brain."', hookAr: '电 (كهرباء) + 脑 (عقل) = العقل الإلكتروني (حاسوب).', exH: '我有新电脑。', exP: 'Wǒ yǒu xīn diànnǎo.', exEn: 'I have a new computer.', exAr: 'لدي حاسوب جديد.' },
  { id: 'w104', u: 8, h: '电视', p: 'diànshì', en: 'Television', ar: 'تلفاز', posEn: 'Noun', posAr: 'اسم', hookEn: '电 (electric) + 视 (vision/view).', hookAr: '电 (كهرباء) + 视 (رؤية) = تلفاز.', exH: '爸爸在看电视。', exP: 'Bàba zài kàn diànshì.', exEn: 'Dad is watching TV.', exAr: 'أبي يشاهد التلفاز.' },
  { id: 'w105', u: 8, h: '电影', p: 'diànyǐng', en: 'Movie / Film', ar: 'فيلم', posEn: 'Noun', posAr: 'اسم', hookEn: '电 (electric) + 影 (shadow/image).', hookAr: '电 (كهرباء) + 影 (ظل/صورة) = فيلم سينمائي.', exH: '我喜欢看电影。', exP: 'Wǒ xǐhuan kàn diànyǐng.', exEn: 'I like watching movies.', exAr: 'أحب مشاهدة الأفلام.' },
  { id: 'w106', u: 8, h: '手机', p: 'shǒujī', en: 'Mobile phone', ar: 'هاتف محمول', posEn: 'Noun', posAr: 'اسم', hookEn: '手 (hand) + 机 (machine) = handheld device.', hookAr: '手 (يد) + 机 (جهاز) = الجهاز المحمول باليد.', exH: '这是我的手机。', exP: 'Zhè shì wǒ de shǒujī.', exEn: 'This is my mobile phone.', exAr: 'هذا هاتفي المحمول.' },
  { id: 'w107', u: 8, h: '书', p: 'shū', en: 'Book', ar: 'كتاب', posEn: 'Noun', posAr: 'اسم', hookEn: 'Simplified shape of stacked pages with a bookmark.', hookAr: 'شكل مبسط لصفحات كتاب مع فاصل.', exH: '我爱看书。', exP: 'Wǒ ài kàn shū.', exEn: 'I love reading books.', exAr: 'أحب قراءة الكتب.' },
  { id: 'w171', u: 8, h: '字', p: 'zì', en: 'Character / Word', ar: 'حرف / رمز صيني', posEn: 'Noun', posAr: 'اسم', hookEn: 'Roof 宀 over child 子 — characters nurtured in a home/school.', hookAr: 'سقف 宀 فوق طفل 子؛ تُستخدم للرموز الصينية 汉字.', exH: '这个字怎么写？', exP: 'Zhège zì zěnme xiě?', exEn: 'How is this character written?', exAr: 'كيف يُكتب هذا الحرف؟' },
  { id: 'w108', u: 8, h: '桌子', p: 'zhuōzi', en: 'Table / Desk', ar: 'طاولة / مكتب', posEn: 'Noun', posAr: 'اسم', hookEn: 'Wood 木 at bottom — wooden furniture.', hookAr: 'جذر الخشب 木 في الأسفل لأن الطاولات تُصنع من الخشب.', exH: '桌子上有电脑。', exP: 'Zhuōzi shàng yǒu diànnǎo.', exEn: 'There is a computer on the desk.', exAr: 'يوجد حاسوب على الطاولة.' },
  { id: 'w109', u: 8, h: '椅子', p: 'yǐzi', en: 'Chair', ar: 'كرسي', posEn: 'Noun', posAr: 'اسم', hookEn: 'Wood radical 木 on left + 奇 (qí phonetic).', hookAr: 'جذر الخشب 木 على اليسار = كرسي.', exH: '椅子很小。', exP: 'Yǐzi hěn xiǎo.', exEn: 'The chair is very small.', exAr: 'الكرسي صغير جداً.' },
  { id: 'w110', u: 8, h: '猫', p: 'māo', en: 'Cat', ar: 'قطة', posEn: 'Noun', posAr: 'اسم', hookEn: 'Animal radical 犭 on left + 苗 (miáo sound like meow).', hookAr: 'جذر الحيوان 犭 على اليسار، ونطقها يشبه صوت القطة (مياو).', exH: '我有一只小猫。', exP: 'Wǒ yǒu yì zhī xiǎomāo.', exEn: 'I have a little cat.', exAr: 'لدي قطة صغيرة.' },
  { id: 'w111', u: 8, h: '狗', p: 'gǒu', en: 'Dog', ar: 'كلب', posEn: 'Noun', posAr: 'اسم', hookEn: 'Animal radical 犭 on left + 句 (jù).', hookAr: 'جذر الحيوان 犭 على اليسار = كلب.', exH: '他喜欢小狗。', exP: 'Tā xǐhuan xiǎogǒu.', exEn: 'He likes puppies.', exAr: 'هو يحب الكلاب الصغيرة.' },

  // UNIT 9: Daily Verbs & Actions (26)
  { id: 'w112', u: 9, h: '是', p: 'shì', en: 'To be (am / is / are)', ar: 'يكون (فعل الكينونة)', posEn: 'Verb', posAr: 'فعل', hookEn: 'Links Noun + Noun (never conjugates for person or tense).', hookAr: 'يربط بين اسمين ولا يتصرف مع الضمائر أو الأزمنة، ولا يسبق الصفات.', exH: '我是老师。', exP: 'Wǒ shì lǎoshī.', exEn: 'I am a teacher.', exAr: 'أنا معلم.' },
  { id: 'w113', u: 9, h: '有', p: 'yǒu', en: 'To have / There is', ar: 'يملك / يوجد', posEn: 'Verb', posAr: 'فعل', hookEn: 'Always negated with 没 (没有), never 不!', hookAr: 'يُنفى دائماً بـ 没 (没有) ولا يُنفى أبداً بـ 不.', exH: '我有两本书。', exP: 'Wǒ yǒu liǎng běn shū.', exEn: 'I have two books.', exAr: 'لدي كتابان.' },
  { id: 'w172', u: 9, h: '没有', p: 'méiyǒu', en: 'Don’t have / There isn’t', ar: 'لا يملك / لا يوجد', posEn: 'Verb', posAr: 'فعل منفي', hookEn: 'Standard negative form of 有 (to have).', hookAr: 'النفي القياسي لفعل الملكية والوجود 有.', exH: '我没有电脑。', exP: 'Wǒ méiyǒu diànnǎo.', exEn: 'I don’t have a computer.', exAr: 'ليس لدي حاسوب.' },
  { id: 'w114', u: 9, h: '在', p: 'zài', en: 'To be at / in / on', ar: 'يوجد في / في', posEn: 'Verb', posAr: 'فعل / حرف جر', hookEn: 'Indicates location of a person or thing.', hookAr: 'يحدد موقع الشخص أو الشيء أو مكان وقوع الفعل.', exH: '我在学校。', exP: 'Wǒ zài xuéxiào.', exEn: 'I am at school.', exAr: 'أنا في المدرسة.' },
  { id: 'w115', u: 9, h: '看', p: 'kàn', en: 'To look / To watch / To read', ar: 'ينظر / يشاهد / يقرأ', posEn: 'Verb', posAr: 'فعل', hookEn: 'Hand 手 shading eye 目 to look into the distance.', hookAr: 'يد 手 فوق عين 目 تظللها للنظر بعيداً.', exH: '我看书。', exP: 'Wǒ kàn shū.', exEn: 'I read a book.', exAr: 'أقرأ كتاباً.' },
  { id: 'w116', u: 9, h: '听', p: 'tīng', en: 'To listen', ar: 'يستمع', posEn: 'Verb', posAr: 'فعل', hookEn: 'Mouth 口 + 斤 — listening carefully.', hookAr: 'يبدأ بجذر الفم 口 على اليسار ويعني الاستماع.', exH: '我喜欢听音乐。', exP: 'Wǒ xǐhuan tīng yīnyuè.', exEn: 'I like listening to music.', exAr: 'أحب الاستماع إلى الموسيقى.' },
  { id: 'w173', u: 9, h: '说', p: 'shuō', en: 'To speak / To say', ar: 'يتحدث / يقول', posEn: 'Verb', posAr: 'فعل', hookEn: 'Speech radical 讠 on left — 说汉语 (speak Chinese).', hookAr: 'يبدأ بجذر الكلام 讠؛ مثل 说汉语 (يتحدث الصينية).', exH: '我会说汉语。', exP: 'Wǒ huì shuō Hànyǔ.', exEn: 'I can speak Mandarin Chinese.', exAr: 'أستطيع التحدث بالصينية.' },
  { id: 'w117', u: 9, h: '说话', p: 'shuōhuà', en: 'To speak / To talk', ar: 'يتكلم / يتحدث', posEn: 'Verb', posAr: 'فعل', hookEn: '说 (speak) + 话 (words/speech).', hookAr: '说 (يقول) + 话 (كلام) = يتحدث.', exH: '请不要说话。', exP: 'Qǐng búyào shuōhuà.', exEn: 'Please do not talk.', exAr: 'من فضلك لا تتحدث.' },
  { id: 'w174', u: 9, h: '汉语', p: 'Hànyǔ', en: 'Mandarin Chinese (language)', ar: 'اللغة الصينية', posEn: 'Noun', posAr: 'اسم', hookEn: '汉 (Han people) + 语 (language).', hookAr: '汉 (قومية الهان) + 语 (لغة) = اللغة الصينية الفصحى.', exH: '我学习汉语。', exP: 'Wǒ xuéxí Hànyǔ.', exEn: 'I study Chinese.', exAr: 'أدرس اللغة الصينية.' },
  { id: 'w118', u: 9, h: '读', p: 'dú', en: 'To read aloud / Study', ar: 'يقرأ بصوت / يدرس', posEn: 'Verb', posAr: 'فعل', hookEn: 'Speech radical 讠 on left — reading out loud.', hookAr: 'يبدأ بجذر الكلام 讠 للدلالة على القراءة بصوت مسموع.', exH: '我读汉语书。', exP: 'Wǒ dú Hànyǔ shū.', exEn: 'I read a Chinese book.', exAr: 'أقرأ كتاب اللغة الصينية.' },
  { id: 'w119', u: 9, h: '写', p: 'xiě', en: 'To write', ar: 'يكتب', posEn: 'Verb', posAr: 'فعل', hookEn: '写汉字 (write Chinese characters).', hookAr: 'يُستخدم لكتابة الحروف والكلمات، مثل 写汉字.', exH: '我会写汉字。', exP: 'Wǒ huì xiě Hànzì.', exEn: 'I can write Chinese characters.', exAr: 'أستطيع كتابة الحروف الصينية.' },
  { id: 'w120', u: 9, h: '看见', p: 'kànjiàn', en: 'To see (result)', ar: 'يرى (نتيجة النظر)', posEn: 'Verb', posAr: 'فعل', hookEn: '看 (look) + 见 (perceive) = actually seeing something.', hookAr: '看 (ينظر) + 见 (يدرك) = يرى بالفعل.', exH: '我看见他了。', exP: 'Wǒ kànjiàn tā le.', exEn: 'I saw him.', exAr: 'لقد رأيته.' },
  { id: 'w121', u: 9, h: '听见', p: 'tīngjiàn', en: 'To hear (result)', ar: 'يسمع (نتيجة الاستماع)', posEn: 'Verb', posAr: 'فعل', hookEn: '听 (listen) + 见 (perceive) = hearing a sound.', hookAr: '听 (يستمع) + 见 (يدرك) = يسمع الصوت بوضوح.', exH: '你听见了吗？', exP: 'Nǐ tīngjiàn le ma?', exEn: 'Did you hear that?', exAr: 'هل سمعت ذلك؟' },
  { id: 'w122', u: 9, h: '叫', p: 'jiào', en: 'To be called / To call', ar: 'يُدعى / ينادي', posEn: 'Verb', posAr: 'فعل', hookEn: 'Mouth radical 口 on left — calling out a name.', hookAr: 'جذر الفم 口 على اليسار — يُستخدم لذكر الاسم: 我叫...', exH: '我叫李明。', exP: 'Wǒ jiào Lǐ Míng.', exEn: 'My name is Li Ming.', exAr: 'اسمي لي مينغ.' },
  { id: 'w123', u: 9, h: '认识', p: 'rènshi', en: 'To know / Meet (someone)', ar: 'يتعرف على / يعرف شخصاً', posEn: 'Verb', posAr: 'فعل', hookEn: 'Both characters carry speech radical 讠.', hookAr: 'كلا الحرفين يبدأ بجذر الكلام 讠، وتعني معرفة الأشخاص.', exH: '认识你很高兴！', exP: 'Rènshi nǐ hěn gāoxìng!', exEn: 'Nice to meet you!', exAr: 'سعيد بالتعرف إليك!' },
  { id: 'w124', u: 9, h: '爱', p: 'ài', en: 'To love', ar: 'يحب (بعمق)', posEn: 'Verb', posAr: 'فعل', hookEn: 'Caring deeply for someone or something.', hookAr: 'تعبر عن المحبة العميقة للأشخاص أو الأوطان أو الهوايات.', exH: '我爱中国。', exP: 'Wǒ ài Zhōngguó.', exEn: 'I love China.', exAr: 'أنا أحب الصين.' },
  { id: 'w125', u: 9, h: '喜欢', p: 'xǐhuan', en: 'To like', ar: 'يحب / يعجب بـ', posEn: 'Verb', posAr: 'فعل', hookEn: '喜 (joy) + 欢 (cheerful).', hookAr: '喜 (فرح) + 欢 (بهجة) = يُعجب بـ أو يفضّل.', exH: '我喜欢喝茶。', exP: 'Wǒ xǐhuan hē chá.', exEn: 'I like drinking tea.', exAr: 'أحب شرب الشاي.' },
  { id: 'w126', u: 9, h: '想', p: 'xiǎng', en: 'To want / To think / To miss', ar: 'يريد / يفكر / يشتاق', posEn: 'Verb', posAr: 'فعل', hookEn: '相 (appearance) over heart 心 — picturing in one’s heart.', hookAr: 'جذر القلب 心 في الأسفل — للتعبير عن الرغبة أو التفكير أو الاشتياق.', exH: '我想去中国。', exP: 'Wǒ xiǎng qù Zhōngguó.', exEn: 'I want to go to China.', exAr: 'أريد الذهاب إلى الصين.' },
  { id: 'w127', u: 9, h: '会', p: 'huì', en: 'Can (learned skill) / Will', ar: 'يستطيع (مهارة مكتسبة)', posEn: 'Modal Verb', posAr: 'فعل مساعد', hookEn: 'Used for acquired skills like speaking a language or driving.', hookAr: 'تدل على مهارة تم تعلمها مثل التحدث بلغة أو قيادة السيارة.', exH: '我会说汉语。', exP: 'Wǒ huì shuō Hànyǔ.', exEn: 'I can speak Mandarin Chinese.', exAr: 'أستطيع التحدث بالصينية.' },
  { id: 'w128', u: 9, h: '能', p: 'néng', en: 'Can / Be able to (permission/ability)', ar: 'يقدر / يمكن (إذن أو قدرة)', posEn: 'Modal Verb', posAr: 'فعل مساعد', hookEn: 'Used for physical ability or polite permission.', hookAr: 'تدل على القدرة الجسدية أو طلب الإذن بأدب.', exH: '我能坐这儿吗？', exP: 'Wǒ néng zuò zhèr ma?', exEn: 'May I sit here?', exAr: 'هل يمكنني الجلوس هنا؟' },
  { id: 'w129', u: 9, h: '睡觉', p: 'shuìjiào', en: 'To sleep', ar: 'ينام', posEn: 'Verb', posAr: 'فعل', hookEn: '睡 has eye radical 目 — closing eyes to sleep.', hookAr: 'الحرف 睡 يحتوي على جذر العين 目 — إغماض العين للنوم.', exH: '我十点睡觉。', exP: 'Wǒ shí diǎn shuìjiào.', exEn: 'I go to sleep at 10 o’clock.', exAr: 'أنام في الساعة العاشرة.' },
  { id: 'w130', u: 9, h: '打电话', p: 'dǎ diànhuà', en: 'To make a phone call', ar: 'يتصل هاتفياً', posEn: 'Verb', posAr: 'فعل', hookEn: '打 (hit/dial) + 电话 (telephone).', hookAr: '打 (يطلب) + 电话 (هاتف) = يجري اتصالاً هاتفياً.', exH: '我在打电话。', exP: 'Wǒ zài dǎ diànhuà.', exEn: 'I am making a phone call.', exAr: 'أنا أجري مكالمة هاتفية.' },
  { id: 'w131', u: 9, h: '工作', p: 'gōngzuò', en: 'To work / Job', ar: 'يعمل / عمل', posEn: 'Verb / Noun', posAr: 'فعل / اسم', hookEn: '工 (labor/tool) + 作 (do/make).', hookAr: '工 (عمل) + 作 (صنع) = يعمل أو وظيفة.', exH: '我爸爸在北京工作。', exP: 'Wǒ bàba zài Běijīng gōngzuò.', exEn: 'My dad works in Beijing.', exAr: 'أبي يعمل في بكين.' },
  { id: 'w132', u: 9, h: '学习', p: 'xuéxí', en: 'To study / To learn', ar: 'يدرس / يتعلم', posEn: 'Verb', posAr: 'فعل', hookEn: '学 (study) + 习 (practice repeatedly).', hookAr: '学 (يتعلم) + 习 (يتمرن) = يدرس ويتعلم.', exH: '我喜欢学习汉语。', exP: 'Wǒ xǐhuan xuéxí Hànyǔ.', exEn: 'I like studying Mandarin.', exAr: 'أحب دراسة اللغة الصينية.' },
  { id: 'w133', u: 9, h: '做', p: 'zuò', en: 'To do / To make', ar: 'يفعل / يصنع', posEn: 'Verb', posAr: 'فعل', hookEn: 'Person radical 亻 on left — human action.', hookAr: 'جذر الشخص 亻 على اليسار — فعل القيام بشيء أو طبخ الطعام.', exH: '你在做什么？', exP: 'Nǐ zài zuò shénme?', exEn: 'What are you doing?', exAr: 'ماذا تفعل؟' },
  { id: 'w134', u: 9, h: '住', p: 'zhù', en: 'To live / To reside', ar: 'يسكن / يعيش', posEn: 'Verb', posAr: 'فعل', hookEn: 'Person 亻 + master 主 = residing in a home.', hookAr: 'شخص 亻 + مالك 主 = يسكن في مكان ما.', exH: '我住在北京。', exP: 'Wǒ zhù zài Běijīng.', exEn: 'I live in Beijing.', exAr: 'أسكن في بكين.' },

  // UNIT 10: Adjectives & States (11)
  { id: 'w135', u: 10, h: '好', p: 'hǎo', en: 'Good / Well', ar: 'جيد / بخير', posEn: 'Adjective', posAr: 'صفة', hookEn: 'Woman 女 + child 子 = goodness and harmony.', hookAr: 'امرأة 女 بجانب طفل 子 = الخير والطيب.', exH: '我很好。', exP: 'Wǒ hěn hǎo.', exEn: 'I am very well.', exAr: 'أنا بخير جداً.' },
  { id: 'w136', u: 10, h: '大', p: 'dà', en: 'Big / Large', ar: 'كبير', posEn: 'Adjective', posAr: 'صفة', hookEn: 'Person stretching both arms wide.', hookAr: 'رسم لشخص يفتح ذراعيه بالكامل للدلالة على الكِبر.', exH: '这个学校很大。', exP: 'Zhège xuéxiào hěn dà.', exEn: 'This school is very big.', exAr: 'هذه المدرسة كبيرة جداً.' },
  { id: 'w137', u: 10, h: '小', p: 'xiǎo', en: 'Small / Little', ar: 'صغير', posEn: 'Adjective', posAr: 'صفة', hookEn: 'Three tiny strokes representing smallness.', hookAr: 'ثلاث نقاط وخطوط صغيرة تمثل الصِغر.', exH: '小猫很可爱。', exP: 'Xiǎomāo hěn kě’ài.', exEn: 'The little cat is cute.', exAr: 'القطة الصغيرة لطيفة.' },
  { id: 'w138', u: 10, h: '多', p: 'duō', en: 'Many / Much', ar: 'كثير', posEn: 'Adjective', posAr: 'صفة', hookEn: 'Two crescent moons 夕 stacked = plentiful.', hookAr: 'هلالان 夕 فوق بعضهما يدلان على الكثرة.', exH: '这里人很多。', exP: 'Zhèlǐ rén hěn duō.', exEn: 'There are many people here.', exAr: 'يوجد الكثير من الناس هنا.' },
  { id: 'w139', u: 10, h: '少', p: 'shǎo', en: 'Few / Little', ar: 'قليل', posEn: 'Adjective', posAr: 'صفة', hookEn: 'Small 小 with a diagonal slash — scarce.', hookAr: 'حرف 小 (صغير) مع خط مائل يدل على القلة.', exH: '我喝水很少。', exP: 'Wǒ hē shuǐ hěn shǎo.', exEn: 'I drink very little water.', exAr: 'أشرب القليل من الماء.' },
  { id: 'w140', u: 10, h: '冷', p: 'lěng', en: 'Cold', ar: 'بارد', posEn: 'Adjective', posAr: 'صفة', hookEn: 'Two-dot ice radical 冫 on left — icy cold.', hookAr: 'جذر الجليد 冫 (نقطتان) على اليسار يدل على البرودة.', exH: '今天太冷了！', exP: 'Jīntiān tài lěng le!', exEn: 'Today is too cold!', exAr: 'اليوم بارد جداً!' },
  { id: 'w141', u: 10, h: '热', p: 'rè', en: 'Hot', ar: 'حار', posEn: 'Adjective', posAr: 'صفة', hookEn: 'Four-dot fire radical 灬 at bottom — heat/fire.', hookAr: 'جذر النار 灬 (أربع نقاط في الأسفل) يدل على الحرارة.', exH: '北京夏天很热。', exP: 'Běijīng xiàtiān hěn rè.', exEn: 'Beijing summer is very hot.', exAr: 'الصيف في بكين حار جداً.' },
  { id: 'w142', u: 10, h: '高兴', p: 'gāoxìng', en: 'Happy / Glad', ar: 'سعيد / مسرور', posEn: 'Adjective', posAr: 'صفة', hookEn: '高 (high) + 兴 (spirits) = high spirits.', hookAr: '高 (عالي) + 兴 (معنويات) = سعيد ومسرور.', exH: '我今天很高兴。', exP: 'Wǒ jīntiān hěn gāoxìng.', exEn: 'I am very happy today.', exAr: 'أنا سعيد جداً اليوم.' },
  { id: 'w143', u: 10, h: '漂亮', p: 'piàoliang', en: 'Pretty / Beautiful', ar: 'جميل', posEn: 'Adjective', posAr: 'صفة', hookEn: 'Water 氵 + 票 + bright 亮.', hookAr: 'وصف للجمال (للأشخاص أو الملابس أو الأماكن).', exH: '你的衣服很漂亮。', exP: 'Nǐ de yīfu hěn piàoliang.', exEn: 'Your clothes are very pretty.', exAr: 'ملابسك جميلة جداً.' },
  { id: 'w144', u: 10, h: '好听', p: 'hǎotīng', en: 'Pleasant to hear / Melodious', ar: 'جميل الصوت / عذب', posEn: 'Adjective', posAr: 'صفة', hookEn: '好 (good) + 听 (listen) = good to listen to.', hookAr: '好 (جيد) + 听 (يستمع) = عذب وجميل للسماع.', exH: '这首歌很好听。', exP: 'Zhè shǒu gē hěn hǎotīng.', exEn: 'This song sounds very nice.', exAr: 'هذه الأغنية جميلة جداً.' },
  { id: 'w145', u: 10, h: '好看', p: 'hǎokàn', en: 'Good-looking / Interesting to watch', ar: 'جميل المنظر / ممتع', posEn: 'Adjective', posAr: 'صفة', hookEn: '好 (good) + 看 (look/watch) = good to look at.', hookAr: '好 (جيد) + 看 (ينظر/يشاهد) = جميل للرؤية أو فيلم ممتع.', exH: '这个电影很好看。', exP: 'Zhège diànyǐng hěn hǎokàn.', exEn: 'This movie is really good.', exAr: 'هذا الفيلم ممتع جداً.' },

  // UNIT 11: Weather & Nature (4)
  { id: 'w146', u: 11, h: '天气', p: 'tiānqì', en: 'Weather', ar: 'الطقس', posEn: 'Noun', posAr: 'اسم', hookEn: '天 (sky/heaven) + 气 (air/breath) = sky atmosphere.', hookAr: '天 (سماء) + 气 (هواء) = حالة الطقس.', exH: '今天天气很好。', exP: 'Jīntiān tiānqì hěn hǎo.', exEn: 'Today’s weather is very good.', exAr: 'الطقس اليوم جميل جداً.' },
  { id: 'w147', u: 11, h: '下雨', p: 'xiàyǔ', en: 'To rain', ar: 'تمطر', posEn: 'Verb', posAr: 'فعل', hookEn: '下 (fall down) + 雨 (raindrops in a window).', hookAr: '下 (ينزل) + 雨 (مطر — يشبه قطرات المطر من النافذة).', exH: '明天会下雨吗？', exP: 'Míngtiān huì xiàyǔ ma?', exEn: 'Will it rain tomorrow?', exAr: 'هل ستمطر غداً؟' },
  { id: 'w148', u: 11, h: '太阳', p: 'tàiyáng', en: 'Sun', ar: 'الشمس', posEn: 'Noun', posAr: 'اسم', hookEn: '太 (great) + 阳 (yang/sunlight).', hookAr: '太 (عظيم) + 阳 (شمس/نور) = الشمس.', exH: '今天有太阳。', exP: 'Jīntiān yǒu tàiyáng.', exEn: 'The sun is out today.', exAr: 'الشمس مشرقة اليوم.' },
  { id: 'w149', u: 11, h: '月亮', p: 'yuèliang', en: 'Moon', ar: 'القمر', posEn: 'Noun', posAr: 'اسم', hookEn: '月 (moon) + 亮 (bright).', hookAr: '月 (قمر) + 亮 (مضيء) = القمر.', exH: '今晚月亮很圆。', exP: 'Jīnwǎn yuèliang hěn yuán.', exEn: 'Tonight the moon is very round.', exAr: 'القمر مكتمل الليلة.' },

  // UNIT 12: Grammar Particles & Connectors (11)
  { id: 'w150', u: 12, h: '的', p: 'de', en: 'Possessive / Descriptive particle', ar: 'أداة الملكية والوصف', posEn: 'Particle', posAr: 'أداة', hookEn: 'Links owner + noun: 我的书 (my book).', hookAr: 'تربط المالك بالمملوك أو الصفة بالموصوف: 我的书 (كتابي).', exH: '这是妈妈的杯子。', exP: 'Zhè shì māma de bēizi.', exEn: 'This is Mom’s cup.', exAr: 'هذا كوب أمي.' },
  { id: 'w151', u: 12, h: '了', p: 'le', en: 'Completed action / Change of state', ar: 'أداة إتمام الفعل أو تغير الحال', posEn: 'Particle', posAr: 'أداة', hookEn: 'Placed after a verb or at sentence end.', hookAr: 'توضع بعد الفعل لإتمامه أو في نهاية الجملة لتغير الحالة.', exH: '我买了三个苹果。', exP: 'Wǒ mǎi le sān gè píngguǒ.', exEn: 'I bought three apples.', exAr: 'اشتريت ثلاث تفاحات.' },
  { id: 'w152', u: 12, h: '吗', p: 'ma', en: 'Yes/No question particle', ar: 'أداة استفهام (هل)', posEn: 'Particle', posAr: 'أداة', hookEn: 'Added to the end of any statement to form a yes/no question.', hookAr: 'تُضاف لنهاية أي جملة لتحويلها إلى سؤال إجابته نعم أو لا.', exH: '你是学生吗？', exP: 'Nǐ shì xuéshēng ma?', exEn: 'Are you a student?', exAr: 'هل أنت طالب؟' },
  { id: 'w153', u: 12, h: '呢', p: 'ne', en: 'Bounce-back question particle', ar: 'أداة سؤال (وماذا عن...؟)', posEn: 'Particle', posAr: 'أداة', hookEn: 'Used after a noun/pronoun: 我很好，你呢？(I’m good, and you?)', hookAr: 'تُستخدم بعد الاسم أو الضمير للسؤال: وماذا عنك؟ أو أين...؟', exH: '我的书呢？', exP: 'Wǒ de shū ne?', exEn: 'Where is my book? / What about my book?', exAr: 'أين كتابي؟' },
  { id: 'w154', u: 12, h: '不', p: 'bù', en: 'Not / No (present/future/habit)', ar: 'لا / ليس (للنفي)', posEn: 'Adverb', posAr: 'أداة نفي', hookEn: 'Negates verbs & adjectives; becomes bú before 4th tone.', hookAr: 'تنفي الأفعال والصفات؛ وتتغير نغمتها إلى bú قبل النغمة الرابعة.', exH: '我不喝咖啡。', exP: 'Wǒ bù hē kāfēi.', exEn: 'I don’t drink coffee.', exAr: 'لا أشرب القهوة.' },
  { id: 'w155', u: 12, h: '没', p: 'méi', en: 'Not (negates 有 & past actions)', ar: 'لم / ليس (للماضي و 有)', posEn: 'Adverb', posAr: 'أداة نفي', hookEn: 'Always used with 有 (没有) and completed past actions.', hookAr: 'تنفي فعل الملكية 有 والأفعال في الزمن الماضي.', exH: '他昨天没去学校。', exP: 'Tā zuótiān méi qù xuéxiào.', exEn: 'He didn’t go to school yesterday.', exAr: 'لم يذهب إلى المدرسة أمس.' },
  { id: 'w156', u: 12, h: '很', p: 'hěn', en: 'Very (adjectival linker)', ar: 'جداً (رابط الصفة)', posEn: 'Adverb', posAr: 'ظرف', hookEn: 'Links Subject + Adjective naturally: 我很好。', hookAr: 'تربط الفاعل بالصفة بشكل طبيعي بدلاً من 是.', exH: '汉语很有意思。', exP: 'Hànyǔ hěn yǒuyìsi.', exEn: 'Chinese is very interesting.', exAr: 'اللغة الصينية ممتعة جداً.' },
  { id: 'w157', u: 12, h: '太', p: 'tài', en: 'Too / Extremely (太…了)', ar: 'جداً / للغاية', posEn: 'Adverb', posAr: 'ظرف', hookEn: 'Framed with 了: 太好了！(Awesome / Too good!).', hookAr: 'تأتي غالباً مع 了 في النهاية: 太好了！(رائع للغاية!).', exH: '今天太热了！', exP: 'Jīntiān tài rè le!', exEn: 'Today is too hot!', exAr: 'اليوم حار للغاية!' },
  { id: 'w158', u: 12, h: '都', p: 'dōu', en: 'All / Both', ar: 'جميعاً / كلاهما', posEn: 'Adverb', posAr: 'ظرف', hookEn: 'Always placed BEFORE the verb: 我们都是学生。', hookAr: 'توضع دائماً قبل الفعل وليس بعده: 我们都是学生.', exH: '我们都是中国人。', exP: 'Wǒmen dōu shì Zhōngguórén.', exEn: 'We are all Chinese.', exAr: 'نحن جميعاً صينيون.' },
  { id: 'w159', u: 12, h: '和', p: 'hé', en: 'And (connects nouns)', ar: 'و (لربط الأسماء)', posEn: 'Conjunction', posAr: 'حرف عطف', hookEn: 'Connects nouns/pronouns only (never full clauses).', hookAr: 'تربط بين الأسماء والضمائر فقط، ولا تربط بين الجمل أو الأفعال.', exH: '我和他是好朋友。', exP: 'Wǒ hé tā shì hǎo péngyou.', exEn: 'He and I are good friends.', exAr: 'أنا وهو صديقان مقربان.' },
  { id: 'w160', u: 12, h: '请', p: 'qǐng', en: 'Please / To invite', ar: 'من فضلك / يدعو', posEn: 'Verb', posAr: 'فعل / طلب', hookEn: 'Speech radical 讠 — polite request at sentence start.', hookAr: 'يبدأ بجذر الكلام 讠 ويُستخدم للطلب المهذب في بداية الجملة.', exH: '请问，火车站在哪儿？', exP: 'Qǐngwèn, huǒchēzhàn zài nǎr?', exEn: 'Excuse me, where is the train station?', exAr: 'عفواً، أين محطة القطار؟' },
];

export const GRAMMAR_RULES: GrammarRule[] = [
  {
    num: 1,
    titleEn: 'Equational Sentences with 是 (shì)',
    titleAr: 'جمل التعريف باستخدام 是 (يكون)',
    pattern: 'Subject + 是 + Noun / Pronoun',
    explanationEn: '是 (shì) links two nouns (A = B). Mandarin verbs never conjugate for person or tense, and 是 is NOT used before adjectives.',
    explanationAr: 'يربط الفعل 是 بين اسمين (أ = ب). الأفعال الصينية لا تتصرف مع الضمائر أو الزمن، ولا يُستخدم 是 قبل الصفات.',
    examples: [
      { h: '我是学生。', p: 'Wǒ shì xuéshēng.', en: 'I am a student.', ar: 'أنا طالب.' },
      { h: '他是我爸爸。', p: 'Tā shì wǒ bàba.', en: 'He is my dad.', ar: 'هو أبي.' },
    ],
  },
  {
    num: 2,
    titleEn: 'Negation: 不 (bù) vs. 没 (méi)',
    titleAr: 'النفي باستخدام 不 و 没',
    pattern: 'Subject + 不 + Verb/Adj   |   Subject + 没(有) + Noun/Past Verb',
    explanationEn: 'Use 不 (bù) for present/habitual actions, future intent, and adjectives. Always use 没 (méi) to negate 有 (to have) or completed past actions.',
    explanationAr: 'نستخدم 不 لنفي الأفعال المعتادة والمستقبلية والصفات. بينما نستخدم 没 دائماً لنفي الملكية (没有) أو الأفعال الماضية.',
    examples: [
      { h: '我不喝茶。', p: 'Wǒ bù hē chá.', en: 'I don’t drink tea.', ar: 'لا أشرب الشاي.' },
      { h: '我没有电脑。', p: 'Wǒ méiyǒu diànnǎo.', en: 'I don’t have a computer.', ar: 'ليس لدي حاسوب.' },
    ],
  },
  {
    num: 3,
    titleEn: 'Possession & Modification with 的 (de)',
    titleAr: 'الملكية والوصف باستخدام 的',
    pattern: 'Owner + 的 + Noun',
    explanationEn: '的 (de) marks possession like apostrophe-s (’s). For close family members (我爸爸, 我妈妈), 的 is often omitted.',
    explanationAr: 'تُستخدم أداة 的 لبيان الملكية أو الوصف بين المالك والمملوك. ومع أفراد العائلة المقربين غالباً ما تُحذف للاختصار.',
    examples: [
      { h: '这是我的书。', p: 'Zhè shì wǒ de shū.', en: 'This is my book.', ar: 'هذا كتابي.' },
      { h: '老师的手机很漂亮。', p: 'Lǎoshī de shǒujī hěn piàoliang.', en: 'The teacher’s phone is pretty.', ar: 'هاتف المعلم جميل جداً.' },
    ],
  },
  {
    num: 4,
    titleEn: 'Yes/No Questions with 吗 (ma) & Bounce-Back 呢 (ne)',
    titleAr: 'أسئلة هل (吗) وأسئلة المتابعة (呢)',
    pattern: 'Statement + 吗？   |   Topic/Pronoun + 呢？',
    explanationEn: 'Add 吗 (ma) to the end of any statement to form a yes/no question without changing word order. Add 呢 (ne) after a noun/pronoun to ask "What about...?"',
    explanationAr: 'أضف 吗 في نهاية أي جملة لتحويلها إلى سؤال (هل) دون تغيير ترتيب الكلمات. وأضف 呢 بعد الاسم للسؤال: وماذا عن...؟',
    examples: [
      { h: '你喜欢中国菜吗？', p: 'Nǐ xǐhuan Zhōngguó cài ma?', en: 'Do you like Chinese food?', ar: 'هل تحب الطعام الصيني؟' },
      { h: '我很好，你呢？', p: 'Wǒ hěn hǎo, nǐ ne?', en: 'I’m very good, and you?', ar: 'أنا بخير جداً، وأنت؟' },
    ],
  },
  {
    num: 5,
    titleEn: 'Question Words (什么, 谁, 哪, 几, 多少)',
    titleAr: 'أدوات الاستفهام في نفس ترتيب الجملة',
    pattern: 'Subject + Verb + Question Word (In-situ order)',
    explanationEn: 'Mandarin keeps question words in place rather than moving them to the front. Put 什么 (what), 谁 (who), 哪 (which), 几 (how many <10), or 多少 (how much/many) where the answer belongs.',
    explanationAr: 'لا تتقدم أدوات الاستفهام إلى بداية الجملة في الصينية، بل توضع في نفس مكان الإجابة تماماً.',
    examples: [
      { h: '你叫什么名字？', p: 'Nǐ jiào shénme míngzi?', en: 'What is your name?', ar: 'ما اسمك؟' },
      { h: '这个杯子多少钱？', p: 'Zhège bēizi duōshao qián?', en: 'How much is this cup?', ar: 'بكم هذا الكوب؟' },
    ],
  },
  {
    num: 6,
    titleEn: 'Measure Words (个, 本, 块, 岁)',
    titleAr: 'أدوات التمييز والعد',
    pattern: 'Number / 这 / 那 + Measure Word + Noun',
    explanationEn: 'A measure word is required between a number (or 这/那) and a noun: 个 (general), 本 (books), 块 (yuan currency), 岁 (years of age).',
    explanationAr: 'يجب وضع أداة تمييز بين الرقم (أو اسم الإشارة) والاسم المعدود: 个 عامة، 本 للكتب، 块 للعملة، 岁 للعمر.',
    examples: [
      { h: '我买了三本书。', p: 'Wǒ mǎi le sān běn shū.', en: 'I bought three books.', ar: 'اشتريت ثلاثة كتب.' },
      { h: '我女儿五岁了。', p: 'Wǒ nǚ’ér wǔ suì le.', en: 'My daughter is five years old.', ar: 'ابنتي عمرها خمس سنوات.' },
    ],
  },
  {
    num: 7,
    titleEn: 'Modal Verbs: 会 (huì), 能 (néng), 想 (xiǎng)',
    titleAr: 'أفعال القدرة والرغبة',
    pattern: 'Subject + 会 / 能 / 想 + Verb + Object',
    explanationEn: '会 (huì) = learned skill ("know how to"); 能 (néng) = physical ability or permission ("can/may"); 想 (xiǎng) = desire ("would like to / want to").',
    explanationAr: '会 تعبر عن مهارة مكتسبة بالتعلم، 能 عن القدرة أو الإذن، و 想 عن الرغبة في فعل شيء.',
    examples: [
      { h: '我会说一点儿汉语。', p: 'Wǒ huì shuō yìdiǎnr Hànyǔ.', en: 'I can speak a little Mandarin.', ar: 'أستطيع التحدث بالقليل من الصينية.' },
      { h: '我想去北京。', p: 'Wǒ xiǎng qù Běijīng.', en: 'I want to go to Beijing.', ar: 'أريد الذهاب إلى بكين.' },
    ],
  },
  {
    num: 8,
    titleEn: 'Location & Preposition 在 (zài)',
    titleAr: 'المكان وحرف الجر 在',
    pattern: 'Subject + 在 + Place   |   Subject + 在 + Place + Verb',
    explanationEn: '在 works both as a main verb ("to be located at") and as a preposition before an action verb ("do X at Place").',
    explanationAr: 'يعمل 在 كفعل رئيسي بمعنى (يوجد في) وكحرف جر يسبق الفعل الأساسي لتحديد مكان الحدث.',
    examples: [
      { h: '小猫在椅子下面。', p: 'Xiǎomāo zài yǐzi xiàmiàn.', en: 'The kitten is under the chair.', ar: 'القطة الصغيرة تحت الكرسي.' },
      { h: '我在学校学习汉语。', p: 'Wǒ zài xuéxiào xuéxí Hànyǔ.', en: 'I study Chinese at school.', ar: 'أدرس اللغة الصينية في المدرسة.' },
    ],
  },
  {
    num: 9,
    titleEn: 'Time Expressions (Big-to-Small Order)',
    titleAr: 'ترتيب الوقت والتاريخ (من الأكبر للأصغر)',
    pattern: 'Year (年) → Month (月) → Day (日/号) → Weekday (星期) → Hour (点) → Minute (分)',
    explanationEn: 'Mandarin orders time strictly from largest unit to smallest unit, placed either before or immediately after the subject.',
    explanationAr: 'يُرتب الوقت في الصينية دائماً من الوحدة الأكبر إلى الأصغر، ويوضع قبل الفاعل أو بعده مباشرة.',
    examples: [
      { h: '明天上午九点我去医院。', p: 'Míngtiān shàngwǔ jiǔ diǎn wǒ qù yīyuàn.', en: 'Tomorrow at 9:00 AM I am going to the hospital.', ar: 'غداً الساعة التاسعة صباحاً أذهب إلى المستشفى.' },
      { h: '今天是十月八日星期五。', p: 'Jīntiān shì shíyuè bā rì xīngqīwǔ.', en: 'Today is Friday, October 8th.', ar: 'اليوم هو الجمعة الثامن من أكتوبر.' },
    ],
  },
  {
    num: 10,
    titleEn: 'Completed Action 了 (le) & Degree 很 / 太…了',
    titleAr: 'إتمام الفعل (了) ودرجة الصفة (很 / 太…了)',
    pattern: 'Subject + Verb + 了 + Object   |   Subject + 很 / 太 + Adj + 了',
    explanationEn: '了 after a verb marks completion; 太 + Adj + 了 expresses "too / extremely!" while 很 links adjectives neutrally.',
    explanationAr: 'الأداة 了 بعد الفعل تدل على إتمامه، و 太...了 للمبالغة (جداً/للغاية)، بينما تربط 很 الصفة بالفاعل بشكل طبيعي.',
    examples: [
      { h: '昨天我买了一件衣服。', p: 'Zuótiān wǒ mǎi le yí jiàn yīfu.', en: 'Yesterday I bought a piece of clothing.', ar: 'أمس اشتريت قطعة ملابس.' },
      { h: '这个电影太好看了！', p: 'Zhège diànyǐng tài hǎokàn le!', en: 'This movie is so good!', ar: 'هذا الفيلم رائع للغاية!' },
    ],
  },
];

export const TONE_DEMOS: ToneDemo[] = [
  { syl: 'mā', hanzi: '妈', tone: 1, en: 'Mother', ar: 'أم', descEn: 'High & steady flat pitch (5-5).', descAr: 'نغمة عالية ومستقيمة وثابتة (٥-٥).', path: 'M 15 22 L 105 22' },
  { syl: 'má', hanzi: '麻', tone: 2, en: 'Hemp / Numb', ar: 'خدر / قنب', descEn: 'Rising pitch like asking "What?" (3-5).', descAr: 'نغمة صاعدة للأعلى كما في السؤال (٣-٥).', path: 'M 15 68 Q 60 55 105 22' },
  { syl: 'mǎ', hanzi: '马', tone: 3, en: 'Horse', ar: 'حصان', descEn: 'Low dipping pitch then slight rise (2-1-4).', descAr: 'نغمة تهبط للأسفل ثم ترتفع قليلاً (٢-١-٤).', path: 'M 15 52 Q 55 90 105 40' },
  { syl: 'mà', hanzi: '骂', tone: 4, en: 'To scold', ar: 'يوبخ', descEn: 'Sharp downward drop like "No!" (5-1).', descAr: 'نغمة هابطة بقوة وحسم للأسفل (٥-١).', path: 'M 15 20 L 105 84' },
  { syl: 'ma', hanzi: '吗', tone: 0, en: 'Question particle', ar: 'أداة استفهام', descEn: 'Short, light, unstressed neutral syllable.', descAr: 'نغمة محايدة قصيرة وخفيفة دون تشديد.', path: 'M 38 52 L 82 56' },
];

export const PINYIN_INITIALS: SoundItem[] = [
  { sym: 'b', sampleH: '爸爸', sampleP: 'bàba', en: 'Dad', ar: 'أب', tipEn: 'Unaspirated p/b (soft b)', tipAr: 'باء خفيفة غير مهموسة' },
  { sym: 'p', sampleH: '苹果', sampleP: 'píngguǒ', en: 'Apple', ar: 'تفاحة', tipEn: 'Strong puff of air', tipAr: 'پ مع نفخة هواء قوية' },
  { sym: 'm', sampleH: '妈妈', sampleP: 'māma', en: 'Mom', ar: 'أم', tipEn: 'Like English m', tipAr: 'مثل حرف الميم' },
  { sym: 'f', sampleH: '飞机', sampleP: 'fēijī', en: 'Airplane', ar: 'طائرة', tipEn: 'Like English f', tipAr: 'مثل حرف الفاء' },
  { sym: 'd', sampleH: '大', sampleP: 'dà', en: 'Big', ar: 'كبير', tipEn: 'Soft unaspirated t/d', tipAr: 'دال خفيفة غير مهموسة' },
  { sym: 't', sampleH: '他', sampleP: 'tā', en: 'He', ar: 'هو', tipEn: 'Strong puff of air t', tipAr: 'تاء مع نفخة هواء قوية' },
  { sym: 'n', sampleH: '你', sampleP: 'nǐ', en: 'You', ar: 'أنت', tipEn: 'Like English n', tipAr: 'مثل حرف النون' },
  { sym: 'l', sampleH: '老师', sampleP: 'lǎoshī', en: 'Teacher', ar: 'معلم', tipEn: 'Like English l', tipAr: 'مثل حرف اللام' },
  { sym: 'g', sampleH: '狗', sampleP: 'gǒu', en: 'Dog', ar: 'كلب', tipEn: 'Soft unaspirated k/g', tipAr: 'جيم مصرية خفيفة غير مهموسة' },
  { sym: 'k', sampleH: '看', sampleP: 'kàn', en: 'Look', ar: 'ينظر', tipEn: 'Strong puff of air k', tipAr: 'كاف مع نفخة هواء قوية' },
  { sym: 'h', sampleH: '好', sampleP: 'hǎo', en: 'Good', ar: 'جيد', tipEn: 'Gentle throaty h (like خ/هـ)', tipAr: 'بين الهاء والخاء الخفيفة' },
  { sym: 'j', sampleH: '家', sampleP: 'jiā', en: 'Home', ar: 'منزل', tipEn: 'Flat tongue soft j (like jee)', tipAr: 'جيم مرققة بلسان مسطح' },
  { sym: 'q', sampleH: '去', sampleP: 'qù', en: 'Go', ar: 'يذهب', tipEn: 'Flat tongue ch with air (chee)', tipAr: 'تش مرققة بلسان مسطح وهواء' },
  { sym: 'x', sampleH: '谢谢', sampleP: 'xièxie', en: 'Thanks', ar: 'شكراً', tipEn: 'Flat tongue sh (shee)', tipAr: 'شين مرققة بلسان مسطح' },
  { sym: 'zh', sampleH: '中国', sampleP: 'Zhōngguó', en: 'China', ar: 'الصين', tipEn: 'Curled tongue soft j', tipAr: 'جيم مفخمة مع التفاف اللسان للأعلى' },
  { sym: 'ch', sampleH: '吃', sampleP: 'chī', en: 'Eat', ar: 'يأكل', tipEn: 'Curled tongue ch with air', tipAr: 'تش مفخمة مع التفاف اللسان وهواء' },
  { sym: 'sh', sampleH: '书', sampleP: 'shū', en: 'Book', ar: 'كتاب', tipEn: 'Curled tongue sh', tipAr: 'شين مفخمة مع التفاف اللسان' },
  { sym: 'r', sampleH: '热', sampleP: 'rè', en: 'Hot', ar: 'حار', tipEn: 'Curled tongue voiced r/zh', tipAr: 'راء/جيم خفيفة بلسان ملتف' },
  { sym: 'z', sampleH: '在', sampleP: 'zài', en: 'At', ar: 'في', tipEn: 'Like ds in beds', tipAr: 'مثل صوت (دز) خفيف' },
  { sym: 'c', sampleH: '菜', sampleP: 'cài', en: 'Dish', ar: 'طبق', tipEn: 'Like ts in cats with air', tipAr: 'مثل صوت (تس) مع هواء قوي' },
  { sym: 's', sampleH: '岁', sampleP: 'suì', en: 'Years old', ar: 'سنة', tipEn: 'Sharp English s', tipAr: 'مثل حرف السين الواضحة' },
  { sym: 'y', sampleH: '一', sampleP: 'yī', en: 'One', ar: 'واحد', tipEn: 'Like y in yes', tipAr: 'مثل حرف الياء' },
  { sym: 'w', sampleH: '我', sampleP: 'wǒ', en: 'I / Me', ar: 'أنا', tipEn: 'Like w in water', tipAr: 'مثل حرف الواو' },
];

export const PINYIN_FINALS: SoundItem[] = [
  { sym: 'a', sampleH: '大', sampleP: 'dà', en: 'Big', ar: 'كبير', tipEn: 'Open a as in father', tipAr: 'ألف ممدودة مفتوحة' },
  { sym: 'o', sampleH: '我', sampleP: 'wǒ', en: 'I / Me', ar: 'أنا', tipEn: 'Rounded o/uo', tipAr: 'واو مدوّرة' },
  { sym: 'e', sampleH: '喝', sampleP: 'hē', en: 'Drink', ar: 'يشرب', tipEn: 'Back-throat uh', tipAr: 'صوت حلقي بين الفتحة والضمة' },
  { sym: 'i', sampleH: '七', sampleP: 'qī', en: 'Seven', ar: 'سبعة', tipEn: 'ee as in see', tipAr: 'ياء ممدودة صافية' },
  { sym: 'u', sampleH: '书', sampleP: 'shū', en: 'Book', ar: 'كتاب', tipEn: 'oo as in moon', tipAr: 'واو مضمومة طويلة' },
  { sym: 'ü', sampleH: '女儿', sampleP: 'nǚ’ér', en: 'Daughter', ar: 'ابنة', tipEn: 'Say ee with rounded lips', tipAr: 'انطق ياء مع تدوير الشفتين كالواو' },
  { sym: 'ai', sampleH: '来', sampleP: 'lái', en: 'Come', ar: 'يأتي', tipEn: 'eye as in bike', tipAr: 'آي كما في كلمة باي' },
  { sym: 'ei', sampleH: '谁', sampleP: 'shéi', en: 'Who', ar: 'مَن', tipEn: 'ay as in say', tipAr: 'إي مائلة للفتح' },
  { sym: 'ao', sampleH: '好', sampleP: 'hǎo', en: 'Good', ar: 'جيد', tipEn: 'ow as in how', tipAr: 'آو مفتوحة' },
  { sym: 'ou', sampleH: '狗', sampleP: 'gǒu', en: 'Dog', ar: 'كلب', tipEn: 'oh as in go', tipAr: 'أو مضمومة' },
  { sym: 'an', sampleH: '看', sampleP: 'kàn', en: 'Look', ar: 'ينظر', tipEn: 'ahn', tipAr: 'آن واضحة' },
  { sym: 'en', sampleH: '人', sampleP: 'rén', en: 'Person', ar: 'شخص', tipEn: 'uhn', tipAr: 'نطق سريع مثل (إِن/أَن)' },
  { sym: 'ang', sampleH: '上', sampleP: 'shàng', en: 'On / Up', ar: 'فوق', tipEn: 'ahng (nasal back)', tipAr: 'آنغ أنفية مفخمة' },
  { sym: 'eng', sampleH: '冷', sampleP: 'lěng', en: 'Cold', ar: 'بارد', tipEn: 'uhng (nasal back)', tipAr: 'أونغ أنفية من الخلف' },
  { sym: 'ing', sampleH: '听', sampleP: 'tīng', en: 'Listen', ar: 'يستمع', tipEn: 'eeng as in sing', tipAr: 'ينغ' },
  { sym: 'ong', sampleH: '中国', sampleP: 'Zhōngguó', en: 'China', ar: 'الصين', tipEn: 'oong', tipAr: 'أونغ مضمومة' },
];

export const PINYIN_SOUNDBOARD: SoundboardGroup[] = [
  {
    groupEn: 'Labials (b, p, m, f)',
    groupAr: 'الأصوات الشفوية (b, p, m, f)',
    items: [
      { p: 'bàba', h: '爸爸', en: 'Dad', ar: 'أب' },
      { p: 'píngguǒ', h: '苹果', en: 'Apple', ar: 'تفاحة' },
      { p: 'māma', h: '妈妈', en: 'Mom', ar: 'أم' },
      { p: 'fēijī', h: '飞机', en: 'Airplane', ar: 'طائرة' },
    ],
  },
  {
    groupEn: 'Palatals — Flat Tongue (j, q, x)',
    groupAr: 'أصوات اللسان المسطح (j, q, x)',
    items: [
      { p: 'jiā', h: '家', en: 'Home', ar: 'منزل' },
      { p: 'qù', h: '去', en: 'Go', ar: 'يذهب' },
      { p: 'xièxie', h: '谢谢', en: 'Thanks', ar: 'شكراً' },
      { p: 'xuéxí', h: '学习', en: 'Study', ar: 'يدرس' },
    ],
  },
  {
    groupEn: 'Retroflexes — Curled Tongue (zh, ch, sh, r)',
    groupAr: 'أصوات اللسان الملتف (zh, ch, sh, r)',
    items: [
      { p: 'Zhōngguó', h: '中国', en: 'China', ar: 'الصين' },
      { p: 'chī', h: '吃', en: 'Eat', ar: 'يأكل' },
      { p: 'shū', h: '书', en: 'Book', ar: 'كتاب' },
      { p: 'rè', h: '热', en: 'Hot', ar: 'حار' },
    ],
  },
  {
    groupEn: 'Dental Sibilants (z, c, s)',
    groupAr: 'الأصوات الأسنانية (z, c, s)',
    items: [
      { p: 'zài', h: '在', en: 'At', ar: 'في' },
      { p: 'cài', h: '菜', en: 'Dish', ar: 'طبق' },
      { p: 'suì', h: '岁', en: 'Years old', ar: 'سنة' },
      { p: 'zàijiàn', h: '再见', en: 'Goodbye', ar: 'وداعاً' },
    ],
  },
];

export const RADICALS_DATA: RadicalItem[] = [
  { radical: '亻', pinyin: 'dānrénpáng', nameEn: 'Person', nameAr: 'شخص / إنسان', examples: [{ h: '你', p: 'nǐ', en: 'you', ar: 'أنت' }, { h: '他', p: 'tā', en: 'he', ar: 'هو' }, { h: '住', p: 'zhù', en: 'live', ar: 'يسكن' }] },
  { radical: '口', pinyin: 'kǒuzìpáng', nameEn: 'Mouth / Speech', nameAr: 'فم / كلام', examples: [{ h: '吃', p: 'chī', en: 'eat', ar: 'يأكل' }, { h: '喝', p: 'hē', en: 'drink', ar: 'يشرب' }, { h: '叫', p: 'jiào', en: 'called', ar: 'يُدعى' }] },
  { radical: '女', pinyin: 'nǚzìpáng', nameEn: 'Woman / Female', nameAr: 'امرأة / أنثى', examples: [{ h: '她', p: 'tā', en: 'she', ar: 'هي' }, { h: '妈妈', p: 'māma', en: 'mom', ar: 'أم' }, { h: '好', p: 'hǎo', en: 'good', ar: 'جيد' }] },
  { radical: '讠', pinyin: 'yánzìpáng', nameEn: 'Words / Language', nameAr: 'كلام / لغة', examples: [{ h: '说', p: 'shuō', en: 'speak', ar: 'يتحدث' }, { h: '请', p: 'qǐng', en: 'please', ar: 'من فضلك' }, { h: '谢谢', p: 'xièxie', en: 'thanks', ar: 'شكراً' }] },
  { radical: '氵', pinyin: 'sāndiǎnshuǐ', nameEn: 'Water / Liquid', nameAr: 'ماء / سائل', examples: [{ h: '渴', p: 'kě', en: 'thirsty', ar: 'عطشان' }, { h: '汉语', p: 'Hànyǔ', en: 'Chinese', ar: 'الصينية' }, { h: '漂亮', p: 'piàoliang', en: 'pretty', ar: 'جميل' }] },
  { radical: '木', pinyin: 'mùzìpáng', nameEn: 'Wood / Tree', nameAr: 'خشب / شجرة', examples: [{ h: '桌子', p: 'zhuōzi', en: 'table', ar: 'طاولة' }, { h: '椅子', p: 'yǐzi', en: 'chair', ar: 'كرسي' }, { h: '杯子', p: 'bēizi', en: 'cup', ar: 'كوب' }] },
  { radical: '日', pinyin: 'rìzìpáng', nameEn: 'Sun / Time / Day', nameAr: 'شمس / وقت', examples: [{ h: '明天', p: 'míngtiān', en: 'tomorrow', ar: 'غداً' }, { h: '昨天', p: 'zuótiān', en: 'yesterday', ar: 'أمس' }, { h: '时候', p: 'shíhou', en: 'time', ar: 'وقت' }] },
  { radical: '月', pinyin: 'yuèzìpáng', nameEn: 'Moon / Body', nameAr: 'قمر / شهر', examples: [{ h: '朋友', p: 'péngyou', en: 'friend', ar: 'صديق' }, { h: '月亮', p: 'yuèliang', en: 'moon', ar: 'قمر' }, { h: '能', p: 'néng', en: 'can', ar: 'يستطيع' }] },
  { radical: '艹', pinyin: 'cǎozìtóu', nameEn: 'Grass / Plants', nameAr: 'نبات / عشب', examples: [{ h: '茶', p: 'chá', en: 'tea', ar: 'شاي' }, { h: '菜', p: 'cài', en: 'dish', ar: 'طبق' }, { h: '苹果', p: 'píngguǒ', en: 'apple', ar: 'تفاحة' }] },
  { radical: '辶', pinyin: 'zǒuzhīdǐ', nameEn: 'Walking / Movement', nameAr: 'مشي / حركة', examples: [{ h: '这', p: 'zhè', en: 'this', ar: 'هذا' }, { h: '远', p: 'yuǎn', en: 'far', ar: 'بعيد' }, { h: '近', p: 'jìn', en: 'near', ar: 'قريب' }] },
  { radical: '宀', pinyin: 'bǎogàitóu', nameEn: 'Roof / Building', nameAr: 'سقف / بيت', examples: [{ h: '家', p: 'jiā', en: 'home', ar: 'منزل' }, { h: '字', p: 'zì', en: 'character', ar: 'حرف' }, { h: '医院', p: 'yīyuàn', en: 'hospital', ar: 'مستشفى' }] },
  { radical: '心 / 忄', pinyin: 'xīnzìdǐ', nameEn: 'Heart / Mind / Feeling', nameAr: 'قلب / شعور', examples: [{ h: '想', p: 'xiǎng', en: 'think/want', ar: 'يريد/يفكر' }, { h: '怎么', p: 'zěnme', en: 'how', ar: 'كيف' }, { h: '高兴', p: 'gāoxìng', en: 'happy', ar: 'سعيد' }] },
  { radical: '饣', pinyin: 'shízìpáng', nameEn: 'Food / Eating', nameAr: 'طعام / أكل', examples: [{ h: '饭店', p: 'fàndiàn', en: 'restaurant', ar: 'مطعم' }, { h: '米饭', p: 'mǐfàn', en: 'rice', ar: 'أرز' }, { h: '饿', p: 'è', en: 'hungry', ar: 'جائع' }] },
  { radical: '钅', pinyin: 'jīnzìpáng', nameEn: 'Metal / Money', nameAr: 'معدن / نقود', examples: [{ h: '钱', p: 'qián', en: 'money', ar: 'نقود' }, { h: '分钟', p: 'fēnzhōng', en: 'minute', ar: 'دقيقة' }] },
  { radical: '犭', pinyin: 'fǎnquǎnpáng', nameEn: 'Animal', nameAr: 'حيوان', examples: [{ h: '猫', p: 'māo', en: 'cat', ar: 'قطة' }, { h: '狗', p: 'gǒu', en: 'dog', ar: 'كلب' }] },
  { radical: '冫', pinyin: 'liǎngdiǎnshuǐ', nameEn: 'Ice / Cold', nameAr: 'جليد / برودة', examples: [{ h: '冷', p: 'lěng', en: 'cold', ar: 'بارد' }, { h: '一点儿', p: 'yìdiǎnr', en: 'a little', ar: 'قليلاً' }] },
  { radical: '灬 / 火', pinyin: 'huǒ / sìdiǎndǐ', nameEn: 'Fire / Heat', nameAr: 'نار / حرارة', examples: [{ h: '热', p: 'rè', en: 'hot', ar: 'حار' }, { h: '点', p: 'diǎn', en: 'o’clock', ar: 'الساعة' }, { h: '火车站', p: 'huǒchēzhàn', en: 'station', ar: 'محطة قطار' }] },
  { radical: '目', pinyin: 'mùzìpáng', nameEn: 'Eye / Vision', nameAr: 'عين / رؤية', examples: [{ h: '看', p: 'kàn', en: 'look', ar: 'ينظر' }, { h: '睡觉', p: 'shuìjiào', en: 'sleep', ar: 'ينام' }] },
];

export const STROKES_DATA: StrokeItem[] = [
  { symbol: '一', nameEn: 'Horizontal (Héng)', nameAr: 'أفقية (Héng)', pinyin: 'héng', sampleH: '一', sampleP: 'yī', tipEn: 'Drawn left to right.', tipAr: 'تُكتب من اليسار إلى اليمين.' },
  { symbol: '丨', nameEn: 'Vertical (Shù)', nameAr: 'عمودية (Shù)', pinyin: 'shù', sampleH: '十', sampleP: 'shí', tipEn: 'Drawn top to bottom.', tipAr: 'تُكتب من الأعلى إلى الأسفل.' },
  { symbol: '丿', nameEn: 'Left-falling (Piě)', nameAr: 'مائلة لليسار (Piě)', pinyin: 'piě', sampleH: '人', sampleP: 'rén', tipEn: 'Sweeps down to the left.', tipAr: 'تنسحب للأسفل جهة اليسار.' },
  { symbol: '㇏', nameEn: 'Right-falling (Nà)', nameAr: 'مائلة لليمين (Nà)', pinyin: 'nà', sampleH: '大', sampleP: 'dà', tipEn: 'Sweeps down to the right.', tipAr: 'تنسحب للأسفل جهة اليمين.' },
  { symbol: '丶', nameEn: 'Dot (Diǎn)', nameAr: 'نقطة (Diǎn)', pinyin: 'diǎn', sampleH: '六', sampleP: 'liù', tipEn: 'Short downward flick.', tipAr: 'ضغطة قصيرة مائلة.' },
  { symbol: '㇀', nameEn: 'Rising (Tí)', nameAr: 'صاعدة (Tí)', pinyin: 'tí', sampleH: '我', sampleP: 'wǒ', tipEn: 'Flicks up from bottom-left to top-right.', tipAr: 'تصعد من أسفل اليسار إلى أعلى اليمين.' },
  { symbol: '亅', nameEn: 'Hook (Gōu)', nameAr: 'خطّاف (Gōu)', pinyin: 'gōu', sampleH: '小', sampleP: 'xiǎo', tipEn: 'Ends with a sharp flick.', tipAr: 'تنتهي بعطفة صغيرة حادة.' },
  { symbol: '┐', nameEn: 'Turning (Zhé)', nameAr: 'منعطفة (Zhé)', pinyin: 'zhé', sampleH: '口', sampleP: 'kǒu', tipEn: '90-degree corner in a single stroke.', tipAr: 'زاوية قائمة تُرسم كضربة واحدة.' },
];

export const STROKE_ORDER_RULES = [
  { num: 1, en: 'Top before bottom (先上后下)', ar: 'من الأعلى إلى الأسفل (先上后下)', sample: '三 / 是' },
  { num: 2, en: 'Left before right (先左后右)', ar: 'من اليسار إلى اليمين (先左后右)', sample: '你 / 好' },
  { num: 3, en: 'Horizontal before vertical (先横后竖)', ar: 'الأفقي قبل العمودي (先横后竖)', sample: '十 / 七' },
  { num: 4, en: 'Left-falling before right-falling (先撇后捺)', ar: 'المائل لليسار قبل المائل لليمين', sample: '人 / 大' },
  { num: 5, en: 'Outside before inside (从外到内)', ar: 'من الخارج إلى الداخل', sample: '月 / 问' },
  { num: 6, en: 'Inside before closing bottom (先里头后封口)', ar: 'ملء الداخل قبل إغلاق الإطار', sample: '回 / 国' },
];

export const SENTENCE_CHALLENGES: SentenceChallenge[] = [
  {
    en: 'What is your name?',
    ar: 'ما اسمك؟',
    fullH: '你叫什么名字？',
    fullP: 'Nǐ jiào shénme míngzi?',
    target: ['你', '叫', '什么', '名字'],
    tiles: ['名字', '叫', '你', '什么', '我'],
    noteEn: 'Question word 什么 stays in place after the verb 叫.',
    noteAr: 'أداة الاستفهام 什么 تبقى في مكانها بعد الفعل 叫.',
  },
  {
    en: 'How much money is this cup?',
    ar: 'بكم هذا الكوب؟',
    fullH: '这个杯子多少钱？',
    fullP: 'Zhège bēizi duōshao qián?',
    target: ['这个', '杯子', '多少', '钱'],
    tiles: ['钱', '杯子', '这个', '多少', '几'],
    noteEn: '这个 (this + measure word) + 杯子 (cup) + 多少钱 (how much money).',
    noteAr: 'هذا (这个) + الكوب (杯子) + كم السعر (多少钱).',
  },
  {
    en: 'I don’t have a computer.',
    ar: 'ليس لدي حاسوب.',
    fullH: '我没有电脑。',
    fullP: 'Wǒ méiyǒu diànnǎo.',
    target: ['我', '没有', '电脑'],
    tiles: ['电脑', '不', '我', '没有', '是'],
    noteEn: 'Always negate 有 (to have) with 没, never 不!',
    noteAr: 'يُنفى الفعل 有 دائماً باستخدام 没 وليس 不.',
  },
  {
    en: 'We are all university students.',
    ar: 'نحن جميعاً طلاب جامعيون.',
    fullH: '我们都是大学生。',
    fullP: 'Wǒmen dōu shì dàxuéshēng.',
    target: ['我们', '都', '是', '大学生'],
    tiles: ['大学生', '是', '都', '我们', '很'],
    noteEn: 'Adverb 都 (all/both) always comes before the verb 是.',
    noteAr: 'الظرف 都 (جميعاً) يأتي دائماً قبل الفعل 是.',
  },
  {
    en: 'I want to go to China to study Mandarin.',
    ar: 'أريد الذهاب إلى الصين لدراسة الصينية.',
    fullH: '我想去中国学习汉语。',
    fullP: 'Wǒ xiǎng qù Zhōngguó xuéxí Hànyǔ.',
    target: ['我', '想', '去', '中国', '学习', '汉语'],
    tiles: ['汉语', '中国', '想', '我', '学习', '去'],
    noteEn: 'Serial verb order: 想 (want) + 去中国 (go to China) + 学习汉语 (study Mandarin).',
    noteAr: 'تسلسل الأفعال: أريد (想) + الذهاب للصين (去中国) + دراسة الصينية (学习汉语).',
  },
  {
    en: 'The little cat is under the chair.',
    ar: 'القطة الصغيرة تحت الكرسي.',
    fullH: '小猫在椅子下面。',
    fullP: 'Xiǎomāo zài yǐzi xiàmiàn.',
    target: ['小猫', '在', '椅子', '下面'],
    tiles: ['下面', '在', '小猫', '椅子', '上面'],
    noteEn: 'Subject + 在 + Reference Object + Localizer (下面 = under).',
    noteAr: 'الفاعل + 在 + المكان المرجعي + الاتجاه (下面 = تحت).',
  },
  {
    en: 'Yesterday I bought three books.',
    ar: 'أمس اشتريت ثلاثة كتب.',
    fullH: '昨天我买了三本书。',
    fullP: 'Zuótiān wǒ mǎi le sān běn shū.',
    target: ['昨天', '我', '买了', '三本', '书'],
    tiles: ['书', '我', '买了', '昨天', '三本'],
    noteEn: 'Completed action particle 了 follows the verb 买, and 本 is the measure word for books.',
    noteAr: 'تأتي 了 بعد الفعل للدلالة على إتمامه، و 本 هي أداة تمييز الكتب.',
  },
  {
    en: 'Today’s weather is too hot!',
    ar: 'الطقس اليوم حار للغاية!',
    fullH: '今天天气太热了！',
    fullP: 'Jīntiān tiānqì tài rè le!',
    target: ['今天', '天气', '太', '热', '了'],
    tiles: ['了', '热', '天气', '太', '今天'],
    noteEn: '太 + Adjective + 了 expresses high degree ("too / extremely").',
    noteAr: 'الصيغة 太 + صفة + 了 تعبر عن الدرجة العالية جداً.',
  },
];

export const DIALOGUE_SCENARIOS: DialogueScenario[] = [
  {
    id: 'restaurant',
    titleEn: '1. At the Beijing Restaurant',
    titleAr: '١. في المطعم الصيني',
    partnerEn: 'Waiter (服务员)',
    partnerAr: 'النادل (服务员)',
    turns: [
      {
        npcH: '你好！请问你想吃什么？',
        npcP: 'Nǐ hǎo! Qǐngwèn nǐ xiǎng chī shénme?',
        npcEn: 'Hello! May I ask what you would like to eat?',
        npcAr: 'مرحباً! عفواً، ماذا تريد أن تأكل؟',
        options: [
          {
            h: '我想吃米饭和中国菜。',
            p: 'Wǒ xiǎng chī mǐfàn hé Zhōngguó cài.',
            en: 'I would like to eat rice and Chinese dishes.',
            ar: 'أريد أن آكل أرزاً وطعاماً صينياً.',
            ok: true,
            tipEn: 'Perfect! 和 connects the two nouns 米饭 and 中国菜.',
            tipAr: 'ممتاز! الأداة 和 تربط بين الاسمين بشكل صحيح.',
          },
          {
            h: '我吃米饭和喝茶。',
            p: 'Wǒ chī mǐfàn hé hē chá.',
            en: 'I eat rice and drink tea (incorrect 和).',
            ar: 'استخدام غير صحيح لـ 和 بين فعلين.',
            ok: false,
            tipEn: 'Remember: 和 only connects nouns, not verb phrases!',
            tipAr: 'تذكر: الأداة 和 تربط الأسماء فقط ولا تربط الأفعال!',
          },
        ],
      },
      {
        npcH: '好的！你想喝水还是喝茶？',
        npcP: 'Hǎo de! Nǐ xiǎng hē shuǐ háishi hē chá?',
        npcEn: 'Okay! Would you like to drink water or tea?',
        npcAr: 'حسناً! هل تريد شرب الماء أم الشاي؟',
        options: [
          {
            h: '我很渴，我想喝茶。谢谢！',
            p: 'Wǒ hěn kě, wǒ xiǎng hē chá. Xièxie!',
            en: 'I am very thirsty, I want to drink tea. Thank you!',
            ar: 'أنا عطشان جداً، أريد شرب الشاي. شكراً!',
            ok: true,
            tipEn: 'Natural and polite!',
            tipAr: 'رد طبيعي ومهذب جداً!',
          },
          {
            h: '我是渴，我喝茶。',
            p: 'Wǒ shì kě, wǒ hē chá.',
            en: 'I am thirsty (incorrect 是 before adjective).',
            ar: 'استخدام غير صحيح لـ 是 قبل الصفة.',
            ok: false,
            tipEn: 'Use 很 before adjectives like 渴 (thirsty), never 是!',
            tipAr: 'استخدم 很 قبل الصفات مثل 渴 (عطشان)، وليس 是!',
          },
        ],
      },
      {
        npcH: '不客气！一共三十五块钱。',
        npcP: 'Bú kèqi! Yígòng sānshíwǔ kuài qián.',
        npcEn: 'You’re welcome! In total it is 35 yuan.',
        npcAr: 'عفواً! المجموع ٣٥ يواناً.',
        options: [
          {
            h: '给你钱，再见！',
            p: 'Gěi nǐ qián, zàijiàn!',
            en: 'Here is the money, goodbye!',
            ar: 'تفضل النقود، مع السلامة!',
            ok: true,
            tipEn: 'Scenario completed!',
            tipAr: 'أتممت السيناريو بنجاح!',
          },
          {
            h: '我没有去商店。',
            p: 'Wǒ méiyǒu qù shāngdiàn.',
            en: 'I didn’t go to the store.',
            ar: 'لم أذهب إلى المتجر.',
            ok: false,
            tipEn: 'That doesn’t answer the bill!',
            tipAr: 'هذه الجملة لا تناسب دفع الحساب!',
          },
        ],
      },
    ],
  },
  {
    id: 'market',
    titleEn: '2. Shopping at the Fruit Market',
    titleAr: '٢. التسوق في سوق الفواكه',
    partnerEn: 'Shopkeeper (商店老板)',
    partnerAr: 'البائع (商店老板)',
    turns: [
      {
        npcH: '你好！你想买什么水果？',
        npcP: 'Nǐ hǎo! Nǐ xiǎng mǎi shénme shuǐguǒ?',
        npcEn: 'Hello! What fruit would you like to buy?',
        npcAr: 'مرحباً! أي فاكهة تريد أن تشتري؟',
        options: [
          {
            h: '我想买苹果。这个苹果多少钱？',
            p: 'Wǒ xiǎng mǎi píngguǒ. Zhège píngguǒ duōshao qián?',
            en: 'I want to buy apples. How much is this apple?',
            ar: 'أريد شراء تفاح. بكم هذه التفاحة؟',
            ok: true,
            tipEn: 'Great use of 多少钱 (how much money)!',
            tipAr: 'استخدام ممتاز لـ 多少钱 للسؤال عن السعر!',
          },
          {
            h: '我想买苹果。这个苹果几岁？',
            p: 'Wǒ xiǎng mǎi píngguǒ. Zhège píngguǒ jǐ suì?',
            en: 'How old is this apple?',
            ar: 'كم عمر هذه التفاحة؟',
            ok: false,
            tipEn: '几岁 asks age! Use 多少钱 for price.',
            tipAr: '几岁 للسؤال عن العمر! استخدم 多少钱 للسعر.',
          },
        ],
      },
      {
        npcH: '五块钱一个。你要几个？',
        npcP: 'Wǔ kuài qián yí gè. Nǐ yào jǐ gè?',
        npcEn: 'Five yuan each. How many do you want?',
        npcAr: 'خمسة يوانات للواحدة. كم واحدة تريد؟',
        options: [
          {
            h: '我要四个苹果，一共二十块钱。',
            p: 'Wǒ yào sì gè píngguǒ, yígòng èrshí kuài qián.',
            en: 'I want four apples, 20 yuan in total.',
            ar: 'أريد أربع تفاحات، المجموع ٢٠ يواناً.',
            ok: true,
            tipEn: 'Spot on with measure word 个 and currency 块!',
            tipAr: 'ممتاز في استخدام أداة التمييز 个 والعملة 块!',
          },
          {
            h: '我要四苹果。',
            p: 'Wǒ yào sì píngguǒ.',
            en: 'Missing measure word 个.',
            ar: 'تنقصها أداة التمييز 个.',
            ok: false,
            tipEn: 'Always put measure word 个 between 四 and 苹果: 四个苹果!',
            tipAr: 'ضع دائماً أداة التمييز 个 بين الرقم والاسم: 四个苹果!',
          },
        ],
      },
    ],
  },
  {
    id: 'station',
    titleEn: '3. Asking Directions to the Station',
    titleAr: '٣. السؤال عن طريق محطة القطار',
    partnerEn: 'Local Passerby (北京人)',
    partnerAr: 'أحد المارة (北京人)',
    turns: [
      {
        npcH: '你好！有什么事吗？',
        npcP: 'Nǐ hǎo! Yǒu shénme shì ma?',
        npcEn: 'Hello! Can I help you with something?',
        npcAr: 'مرحباً! هل هناك ما أساعدك به؟',
        options: [
          {
            h: '请问，火车站在哪儿？远吗？',
            p: 'Qǐngwèn, huǒchēzhàn zài nǎr? Yuǎn ma?',
            en: 'Excuse me, where is the train station? Is it far?',
            ar: 'عفواً، أين محطة القطار؟ هل هي بعيدة؟',
            ok: true,
            tipEn: 'Polite opening with 请问 + 在哪儿!',
            tipAr: 'بداية مهذبة باستخدام 请问 والسؤال بـ 在哪儿!',
          },
          {
            h: '火车站是什么？',
            p: 'Huǒchēzhàn shì shénme?',
            en: 'What is a train station?',
            ar: 'ما هي محطة القطار؟',
            ok: false,
            tipEn: 'Use 在哪儿 (where is...) to ask location.',
            tipAr: 'استخدم 在哪儿 للسؤال عن المكان.',
          },
        ],
      },
      {
        npcH: '不远，就在学校前面。你可以坐出租车去。',
        npcP: 'Bù yuǎn, jiù zài xuéxiào qiánmiàn. Nǐ kěyǐ zuò chūzūchē qù.',
        npcEn: 'Not far, right in front of the school. You can take a taxi there.',
        npcAr: 'ليست بعيدة، أمام المدرسة مباشرة. يمكنك أخذ تاكسي.',
        options: [
          {
            h: '太好了，谢谢你！再见！',
            p: 'Tài hǎo le, xièxie nǐ! Zàijiàn!',
            en: 'Awesome, thank you! Goodbye!',
            ar: 'رائع جداً، شكراً لك! مع السلامة!',
            ok: true,
            tipEn: 'Natural 太好了 response!',
            tipAr: 'رد طبيعي وممتاز!',
          },
          {
            h: '对不起，我不会去。',
            p: 'Duìbuqǐ, wǒ bú huì qù.',
            en: 'Sorry, I don’t know how to go.',
            ar: 'آسف، لا أعرف الذهاب.',
            ok: false,
            tipEn: 'Thank them with 谢谢你!',
            tipAr: 'اشكرهم باستخدام 谢谢你!',
          },
        ],
      },
    ],
  },
  {
    id: 'university',
    titleEn: '4. Meeting a Classmate at University',
    titleAr: '٤. التعارف في الجامعة',
    partnerEn: 'Classmate (王朋)',
    partnerAr: 'زميل الدراسة (王朋)',
    turns: [
      {
        npcH: '你好！我是王朋，我是大学生。你呢？',
        npcP: 'Nǐ hǎo! Wǒ shì Wáng Péng, wǒ shì dàxuéshēng. Nǐ ne?',
        npcEn: 'Hello! I am Wang Peng, I am a university student. And you?',
        npcAr: 'مرحباً! أنا وانغ بنغ، طالب جامعي. وأنت؟',
        options: [
          {
            h: '你好！我也是学生，我学习汉语。',
            p: 'Nǐ hǎo! Wǒ yě shì xuéshēng, wǒ xuéxí Hànyǔ.',
            en: 'Hello! I am also a student, I study Chinese.',
            ar: 'مرحباً! أنا أيضاً طالب، وأدرس الصينية.',
            ok: true,
            tipEn: 'Great use of 也 (also) before 是!',
            tipAr: 'استخدام ممتاز لـ 也 (أيضاً) قبل الفعل 是!',
          },
          {
            h: '你好！我是也学生。',
            p: 'Nǐ hǎo! Wǒ shì yě xuéshēng.',
            en: 'I am also a student (wrong word order).',
            ar: 'ترتيب غير صحيح لـ 也.',
            ok: false,
            tipEn: 'Place 也 before the verb 是: 我也是学生.',
            tipAr: 'ضع 也 قبل الفعل 是: 我也是学生.',
          },
        ],
      },
      {
        npcH: '你的汉语很好！认识你很高兴！',
        npcP: 'Nǐ de Hànyǔ hěn hǎo! Rènshi nǐ hěn gāoxìng!',
        npcEn: 'Your Chinese is very good! Nice to meet you!',
        npcAr: 'لغتك الصينية جيدة جداً! سعيد بالتعرف إليك!',
        options: [
          {
            h: '谢谢！认识你我也很高兴！',
            p: 'Xièxie! Rènshi nǐ wǒ yě hěn gāoxìng!',
            en: 'Thank you! Nice to meet you too!',
            ar: 'شكراً! وأنا أيضاً سعيد بالتعرف إليك!',
            ok: true,
            tipEn: 'All 4 HSK 1 scenarios mastered!',
            tipAr: 'أحسنت! أتممت جميع السيناريوهات بنجاح!',
          },
          {
            h: '不客气，我不认识。',
            p: 'Bú kèqi, wǒ bú rènshi.',
            en: 'You’re welcome, I don’t know.',
            ar: 'عفواً، لا أعرف.',
            ok: false,
            tipEn: 'Reply with 认识你我也很高兴！',
            tipAr: 'رد بعبارة: 认识你我也很高兴！',
          },
        ],
      },
    ],
  },
];
