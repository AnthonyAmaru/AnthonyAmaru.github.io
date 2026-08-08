const vocabulary = [
  // Greetings and courtesy
  ["你好", "nǐ hǎo", "hello", "Greetings"],
  ["早上好", "zǎoshang hǎo", "good morning; early morning", "Greetings"],
  ["上午好", "shàngwǔ hǎo", "good morning; before noon", "Greetings"],
  ["下午好", "xiàwǔ hǎo", "good afternoon", "Greetings"],
  ["晚上好", "wǎnshang hǎo", "good evening", "Greetings"],
  ["晚安", "wǎn'ān", "good night", "Greetings"],
  ["很好", "hěn hǎo", "very good; doing well", "Greetings"],
  ["不好", "bù hǎo", "not good", "Greetings"],
  ["不错", "bù cuò", "not bad", "Greetings"],
  ["最近怎么样？", "zuìjìn zěnmeyàng?", "How have you been recently?", "Greetings"],
  ["对不起", "duìbuqǐ", "sorry", "Greetings"],
  ["不好意思", "bù hǎoyìsi", "excuse me; sorry", "Greetings"],
  ["没关系", "méi guānxi", "it is okay; no problem", "Greetings"],
  ["谢谢", "xièxie", "thank you", "Greetings"],
  ["明天见", "míngtiān jiàn", "see you tomorrow", "Greetings"],
  ["见", "jiàn", "to see; to meet", "Greetings"],
  ["拜拜", "bāibāi", "bye-bye", "Greetings"],
  ["加油", "jiāyóu", "keep going; you can do it", "Greetings"],

  // Identity and people
  ["我", "wǒ", "I; me", "People"],
  ["你", "nǐ", "you", "People"],
  ["他", "tā", "he; him", "People"],
  ["我们", "wǒmen", "we; us", "People"],
  ["你们", "nǐmen", "you (plural)", "People"],
  ["他们", "tāmen", "they; them", "People"],
  ["人", "rén", "person; people", "People"],
  ["朋友", "péngyou", "friend", "People"],
  ["老师", "lǎoshī", "teacher", "People"],
  ["叫", "jiào", "to be called; to call", "People"],
  ["名字", "míngzi", "name", "People"],
  ["美国", "měiguó", "United States", "People"],
  ["中国", "zhōngguó", "China", "People"],
  ["加拿大", "jiānádà", "Canada", "People"],
  ["中文", "zhōngwén", "Chinese language", "People"],
  ["说", "shuō", "to say; to speak", "People"],
  ["问", "wèn", "to ask", "People"],
  ["自己", "zìjǐ", "oneself", "People"],
  ["妈妈", "māma", "mom", "People"],
  ["爸爸", "bàba", "dad", "People"],
  ["中国人", "zhōngguó rén", "Chinese person", "People"],
  ["美国人", "měiguó rén", "American person", "People"],
  ["岁", "suì", "years old", "People"],
  ["几岁", "jǐ suì", "how old", "People"],

  // Daily life
  ["知道", "zhīdào", "to know", "Daily life"],
  ["睡觉", "shuìjiào", "to sleep; go to bed", "Daily life"],
  ["喜欢", "xǐhuan", "to like", "Daily life"],
  ["先", "xiān", "first; before doing something else", "Daily life"],

  // Food and drink
  ["面包", "miànbāo", "bread", "Food & drink"],
  ["饺子", "jiǎozi", "dumplings", "Food & drink"],
  ["面条", "miàntiáo", "noodles", "Food & drink"],
  ["米饭", "mǐfàn", "cooked rice", "Food & drink"],
  ["鸡肉", "jīròu", "chicken", "Food & drink"],
  ["牛肉", "niúròu", "beef", "Food & drink"],
  ["西兰花", "xīlánhuā", "broccoli", "Food & drink"],
  ["馄饨", "húntun", "wontons", "Food & drink"],
  ["鱼", "yú", "fish", "Food & drink"],
  ["肉", "ròu", "meat", "Food & drink"],
  ["可乐", "kělè", "cola", "Food & drink"],
  ["咖啡", "kāfēi", "coffee", "Food & drink"],
  ["茶", "chá", "tea", "Food & drink"],
  ["水", "shuǐ", "water", "Food & drink"],
  ["冰水", "bīngshuǐ", "ice water", "Food & drink"],
  ["热水", "rèshuǐ", "hot water", "Food & drink"],
  ["吃", "chī", "to eat", "Food & drink"],
  ["喝", "hē", "to drink", "Food & drink"],
  ["吃饭", "chīfàn", "to eat a meal", "Food & drink"],
  ["饿", "è", "hungry", "Food & drink"],
  ["好吃", "hǎochī", "tasty; delicious", "Food & drink"],
  ["辣", "là", "spicy", "Food & drink"],
  ["披萨", "pīsà", "pizza", "Food & drink"],
  ["菜", "cài", "dish; cuisine; vegetables", "Food & drink"],
  ["中国菜", "zhōngguó cài", "Chinese food", "Food & drink"],
  ["美国菜", "měiguó cài", "American food", "Food & drink"],
  ["墨西哥菜", "mòxīgē cài", "Mexican food", "Food & drink"],

  // Restaurant
  ["饭店", "fàndiàn", "restaurant", "Restaurant"],
  ["服务员", "fúwùyuán", "server; waiter", "Restaurant"],
  ["要", "yào", "to want", "Restaurant"],
  ["还要", "hái yào", "also want; want more", "Restaurant"],
  ["有", "yǒu", "to have; there is", "Restaurant"],
  ["没有", "méi yǒu", "not have; there is not", "Restaurant"],
  ["请客", "qǐngkè", "to treat someone; pay for guests", "Restaurant"],
  ["买单", "mǎidān", "to ask for or pay the bill", "Restaurant"],
  ["一共", "yígòng", "altogether; in total", "Restaurant"],
  ["打包", "dǎbāo", "to pack food to go", "Restaurant"],
  ["杯", "bēi", "cup; measure word for cups", "Restaurant"],
  ["碗", "wǎn", "bowl; measure word for bowls", "Restaurant"],
  ["块", "kuài", "informal unit for yuan", "Restaurant"],
  ["钱", "qián", "money", "Restaurant"],
  ["好的", "hǎo de", "okay; all right", "Restaurant"],
  ["多少钱？", "duōshao qián?", "How much money?", "Restaurant"],
  ["买", "mǎi", "to buy", "Restaurant"],

  // Descriptions
  ["大", "dà", "big; large", "Descriptions"],
  ["小", "xiǎo", "small", "Descriptions"],
  ["热", "rè", "hot", "Descriptions"],
  ["冰", "bīng", "ice; iced", "Descriptions"],
  ["很", "hěn", "very; linking degree word", "Descriptions"],
  ["非常", "fēicháng", "extremely; very", "Descriptions"],
  ["太…了", "tài…le", "too…; extremely…", "Descriptions"],
  ["大的", "dà de", "the large one", "Descriptions"],
  ["小的", "xiǎo de", "the small one", "Descriptions"],
  ["热的", "rè de", "the hot one", "Descriptions"],
  ["冰的", "bīng de", "the iced or cold one", "Descriptions"],
  ["辣的", "là de", "the spicy one", "Descriptions"],

  // Numbers
  ["零", "líng", "zero", "Numbers"],
  ["一", "yī", "one", "Numbers"],
  ["二", "èr", "two in counting", "Numbers"],
  ["两", "liǎng", "two before most measure words", "Numbers"],
  ["三", "sān", "three", "Numbers"],
  ["四", "sì", "four", "Numbers"],
  ["五", "wǔ", "five", "Numbers"],
  ["六", "liù", "six", "Numbers"],
  ["七", "qī", "seven", "Numbers"],
  ["八", "bā", "eight", "Numbers"],
  ["九", "jiǔ", "nine", "Numbers"],
  ["十", "shí", "ten", "Numbers"],
  ["百", "bǎi", "one hundred", "Numbers"],
  ["个", "ge", "general measure word", "Numbers"],

  // Calendar and time
  ["今天", "jīntiān", "today", "Time"],
  ["昨天", "zuótiān", "yesterday", "Time"],
  ["明天", "míngtiān", "tomorrow", "Time"],
  ["星期", "xīngqī", "week", "Time"],
  ["星期一", "xīngqīyī", "Monday", "Time"],
  ["星期五", "xīngqīwǔ", "Friday", "Time"],
  ["星期日", "xīngqīrì", "Sunday", "Time"],
  ["月", "yuè", "month", "Time"],
  ["号 / 日", "hào / rì", "day of the month", "Time"],
  ["生日", "shēngrì", "birthday", "Time"],
  ["时间", "shíjiān", "time", "Time"],
  ["现在", "xiànzài", "now", "Time"],
  ["点", "diǎn", "o'clock", "Time"],
  ["分", "fēn", "minute", "Time"],
  ["刻", "kè", "quarter hour", "Time"],
  ["半", "bàn", "half", "Time"],
  ["上午", "shàngwǔ", "morning", "Time"],
  ["下午", "xiàwǔ", "afternoon", "Time"],
  ["晚上", "wǎnshang", "evening; night", "Time"],
  ["几点", "jǐ diǎn", "what time", "Time"],
  ["早上", "zǎoshang", "early morning", "Time"],
  ["早", "zǎo", "early", "Time"],
  ["晚", "wǎn", "late", "Time"],

  // Places and movement
  ["去", "qù", "to go", "Places"],
  ["在", "zài", "to be at; in; on", "Places"],
  ["到", "dào", "to arrive; reach", "Places"],
  ["到了", "dào le", "arrived", "Places"],
  ["哪里", "nǎlǐ", "where", "Places"],
  ["操场", "cāochǎng", "playground; athletic field", "Places"],
  ["上课", "shàngkè", "to attend or start class", "Places"],
  ["太阳", "tàiyáng", "sun", "Places"],
  ["云", "yún", "cloud", "Places"],
  ["猫", "māo", "cat", "Places"],
  ["小猫饭店", "Xiǎomāo Fàndiàn", "Little Cat Restaurant", "Places"],

  // Grammar tools
  ["是", "shì", "to be; identifies or classifies", "Grammar"],
  ["不", "bù", "not; negates habits and descriptions", "Grammar"],
  ["没 / 没有", "méi / méi yǒu", "not have; there is not", "Grammar"],
  ["吗", "ma", "yes or no question particle", "Grammar"],
  ["呢", "ne", "and…?; what about…?", "Grammar"],
  ["了", "le", "new situation or completed action", "Grammar"],
  ["的", "de", "links possession or description", "Grammar"],
  ["吧", "ba", "softens a suggestion", "Grammar"],
  ["这", "zhè", "this", "Grammar"],
  ["那", "nà", "that; then", "Grammar"],
  ["什么", "shénme", "what", "Grammar"],
  ["怎么", "zěnme", "how; by what method", "Grammar"],
  ["怎么样", "zěnmeyàng", "how is it?; how are things?", "Grammar"],
  ["几", "jǐ", "how many; usually a small number", "Grammar"],
  ["多少", "duōshao", "how many; how much", "Grammar"],
  ["谁", "shéi / shuí", "who", "Grammar"],
];

const patternGroups = {
  "Greetings & time": [
    ["早上好。", "Zǎoshang hǎo.", "Good morning (early)."],
    ["上午好。", "Shàngwǔ hǎo.", "Good morning (before noon)."],
    ["下午好。", "Xiàwǔ hǎo.", "Good afternoon."],
    ["晚上好。", "Wǎnshang hǎo.", "Good evening."],
    ["晚安。", "Wǎn'ān.", "Good night."],
    ["太早了。", "Tài zǎo le.", "It is too early."],
    ["太晚了，我们睡觉吧。", "Tài wǎn le, wǒmen shuìjiào ba.", "It is too late; let's go to sleep."],
    ["你好，你好吗？", "Nǐ hǎo, nǐ hǎo ma?", "Hello, how are you?"],
    ["谢谢，我很好。", "Xièxie, wǒ hěn hǎo.", "Thank you, I am very well."],
    ["今天晚上你有时间吗？", "Jīntiān wǎnshang nǐ yǒu shíjiān ma?", "Do you have time this evening?"],
  ],
  "Introductions": [
    ["我叫…", "Wǒ jiào…", "My name is…"],
    ["我叫安东尼。", "Wǒ jiào Āndōngní.", "My name is Anthony."],
    ["我…岁。", "Wǒ…suì.", "I am … years old."],
    ["我现在在美国。", "Wǒ xiànzài zài Měiguó.", "I am in America now."],
    ["我是美国人。", "Wǒ shì měiguó rén.", "I am American."],
    ["我不是中国人。", "Wǒ bú shì zhōngguó rén.", "I am not Chinese."],
    ["你是哪国人？", "Nǐ shì nǎ guó rén?", "What country are you from?"],
    ["你叫什么名字？", "Nǐ jiào shénme míngzi?", "What is your name?"],
    ["你呢？", "Nǐ ne?", "What about you?"],
    ["这是小李。", "Zhè shì Xiǎo Lǐ.", "This is Xiao Li."],
    ["他是中国人。", "Tā shì Zhōngguó rén.", "He is Chinese."],
    ["他现在在美国。", "Tā xiànzài zài Měiguó.", "He is in America now."],
    ["今天是他的生日。", "Jīntiān shì tā de shēngrì.", "Today is his birthday."],
    ["你几岁？", "Nǐ jǐ suì?", "How old are you?"],
    ["这是我的朋友。", "Zhè shì wǒ de péngyou.", "This is my friend."],
    ["他叫什么名字？", "Tā jiào shénme míngzi?", "What is his name?"],
    ["我们都是美国人。", "Wǒmen dōu shì Měiguó rén.", "We are all American."],
  ],
  "Likes & food": [
    ["我喜欢饺子。", "Wǒ xǐhuan jiǎozi.", "I like dumplings."],
    ["我不喜欢面条。", "Wǒ bù xǐhuan miàntiáo.", "I do not like noodles."],
    ["你喜欢吃什么？", "Nǐ xǐhuan chī shénme?", "What do you like to eat?"],
    ["你喜欢喝什么？", "Nǐ xǐhuan hē shénme?", "What do you like to drink?"],
    ["他不喜欢吃鸡肉。", "Tā bù xǐhuan chī jīròu.", "He does not like eating chicken."],
    ["我饿了。", "Wǒ è le.", "I am hungry now."],
    ["我喜欢睡觉。", "Wǒ xǐhuan shuìjiào.", "I like sleeping."],
    ["我喜欢钱。", "Wǒ xǐhuan qián.", "I like money."],
    ["我喜欢中国菜。", "Wǒ xǐhuan Zhōngguó cài.", "I like Chinese food."],
    ["我喜欢美国菜。", "Wǒ xǐhuan Měiguó cài.", "I like American food."],
    ["我喜欢墨西哥菜。", "Wǒ xǐhuan Mòxīgē cài.", "I like Mexican food."],
    ["我喜欢喝咖啡。", "Wǒ xǐhuan hē kāfēi.", "I like drinking coffee."],
    ["你喜欢牛肉还是鸡肉？", "Nǐ xǐhuan niúròu háishi jīròu?", "Do you like beef or chicken?"],
    ["这个披萨很好吃。", "Zhège pīsà hěn hǎochī.", "This pizza is delicious."],
  ],
  "Restaurant": [
    ["我们去吃饭吧。", "Wǒmen qù chīfàn ba.", "Let's go eat."],
    ["我要一碗米饭。", "Wǒ yào yì wǎn mǐfàn.", "I want one bowl of rice."],
    ["我还要两杯冰水。", "Wǒ hái yào liǎng bēi bīngshuǐ.", "I also want two cups of ice water."],
    ["你要大的还是小的？", "Nǐ yào dà de háishi xiǎo de?", "Do you want the large one or the small one?"],
    ["一共多少钱？", "Yígòng duōshao qián?", "How much is it altogether?"],
    ["我请客。", "Wǒ qǐngkè.", "It's my treat."],
    ["我要打包。", "Wǒ yào dǎbāo.", "I want it packed to go."],
    ["我们一共买了四碗馄饨。", "Wǒmen yígòng mǎi le sì wǎn húntun.", "We bought four bowls of wontons in total."],
    ["服务员，请问有冰水吗？", "Fúwùyuán, qǐngwèn yǒu bīngshuǐ ma?", "Excuse me, server, do you have ice water?"],
    ["我要一杯咖啡和一碗馄饨。", "Wǒ yào yì bēi kāfēi hé yì wǎn húntun.", "I want one cup of coffee and one bowl of wontons."],
    ["这碗牛肉面多少钱？", "Zhè wǎn niúròu miàn duōshao qián?", "How much is this bowl of beef noodles?"],
  ],
  "Time & place": [
    ["今天星期几？", "Jīntiān xīngqī jǐ?", "What day of the week is today?"],
    ["今天是几月几号？", "Jīntiān shì jǐ yuè jǐ hào?", "What is today's date?"],
    ["现在几点？", "Xiànzài jǐ diǎn?", "What time is it now?"],
    ["现在七点半。", "Xiànzài qī diǎn bàn.", "It is 7:30 now."],
    ["你在哪里？", "Nǐ zài nǎlǐ?", "Where are you?"],
    ["明天下午你有时间吗？", "Míngtiān xiàwǔ nǐ yǒu shíjiān ma?", "Do you have time tomorrow afternoon?"],
    ["你到了吗？", "Nǐ dào le ma?", "Have you arrived?"],
    ["明天是星期六。", "Míngtiān shì xīngqīliù.", "Tomorrow is Saturday."],
    ["我现在在小猫饭店。", "Wǒ xiànzài zài Xiǎomāo Fàndiàn.", "I am at Little Cat Restaurant now."],
    ["你下午几点到？", "Nǐ xiàwǔ jǐ diǎn dào?", "What time will you arrive this afternoon?"],
  ],
  "Making plans": [
    ["你明天上午有时间吗？", "Nǐ míngtiān shàngwǔ yǒu shíjiān ma?", "Do you have time tomorrow morning?"],
    ["明天上午没有。", "Míngtiān shàngwǔ méiyǒu.", "I do not have time tomorrow morning."],
    ["那下午呢？", "Nà xiàwǔ ne?", "Then how about the afternoon?"],
    ["下午有时间。", "Xiàwǔ yǒu shíjiān.", "I have time in the afternoon."],
    ["我们去吃披萨吧。", "Wǒmen qù chī pīsà ba.", "Let's go eat pizza."],
    ["好的，几点？在哪里？", "Hǎo de, jǐ diǎn? Zài nǎlǐ?", "Okay. What time? Where?"],
    ["5点，在小猫饭店。", "Wǔ diǎn, zài Xiǎomāo Fàndiàn.", "At five, at Little Cat Restaurant."],
    ["明天见。", "Míngtiān jiàn.", "See you tomorrow."],
    ["今天晚上去吃饭吗？", "Jīntiān wǎnshang qù chīfàn ma?", "Shall we go eat this evening?"],
    ["我们下午五点见。", "Wǒmen xiàwǔ wǔ diǎn jiàn.", "We will meet at five this afternoon."],
    ["我们一起去买咖啡吧。", "Wǒmen yìqǐ qù mǎi kāfēi ba.", "Let's go buy coffee together."],
  ],
  "Daily life": [
    ["我知道。", "Wǒ zhīdào.", "I know."],
    ["我晚上睡觉。", "Wǒ wǎnshang shuìjiào.", "I sleep at night."],
    ["我喜欢吃牛肉。", "Wǒ xǐhuan chī niúròu.", "I like eating beef."],
    ["我早上喝咖啡。", "Wǒ zǎoshang hē kāfēi.", "I drink coffee in the morning."],
    ["我下午吃米饭和鸡肉。", "Wǒ xiàwǔ chī mǐfàn hé jīròu.", "I eat rice and chicken in the afternoon."],
    ["我晚上十点睡觉。", "Wǒ wǎnshang shí diǎn shuìjiào.", "I sleep at ten at night."],
  ],
  "Possession": [
    ["这是我的面包。", "Zhè shì wǒ de miànbāo.", "This is my bread."],
    ["这杯咖啡是你的。", "Zhè bēi kāfēi shì nǐ de.", "This cup of coffee is yours."],
    ["他是我们的朋友。", "Tā shì wǒmen de péngyou.", "He is our friend."],
    ["我要辣的。", "Wǒ yào là de.", "I want the spicy one."],
    ["这是你的咖啡吗？", "Zhè shì nǐ de kāfēi ma?", "Is this your coffee?"],
    ["那是他的面包。", "Nà shì tā de miànbāo.", "That is his bread."],
    ["哪一杯是我的？", "Nǎ yì bēi shì wǒ de?", "Which cup is mine?"],
  ],
  "Questions": [
    ["这是什么？", "Zhè shì shénme?", "What is this?"],
    ["他是谁？", "Tā shì shéi?", "Who is he?"],
    ["你有几个朋友？", "Nǐ yǒu jǐ ge péngyou?", "How many friends do you have?"],
    ["你怎么去饭店？", "Nǐ zěnme qù fàndiàn?", "How do you go to the restaurant?"],
    ["这个菜怎么样？", "Zhège cài zěnmeyàng?", "How is this dish?"],
    ["你要多少杯水？", "Nǐ yào duōshao bēi shuǐ?", "How many cups of water do you want?"],
  ],
};

const planDialogue = [
  ["安", "小李，早上好！", "Xiǎo Lǐ, zǎoshang hǎo!", "Good morning, Xiao Li!"],
  ["李", "Anthony，早上好！你好吗？", "Anthony, zǎoshang hǎo! Nǐ hǎo ma?", "Good morning, Anthony! How are you?"],
  ["安", "我很好，谢谢。你呢？", "Wǒ hěn hǎo, xièxie. Nǐ ne?", "I am very well, thank you. And you?"],
  ["李", "我也很好。今天星期几？", "Wǒ yě hěn hǎo. Jīntiān xīngqī jǐ?", "I am very well too. What day is today?"],
  ["安", "今天星期五。今天也是我的生日。", "Jīntiān xīngqīwǔ. Jīntiān yě shì wǒ de shēngrì.", "Today is Friday. Today is also my birthday."],
  ["李", "生日快乐！你今天有时间吗？", "Shēngrì kuàilè! Nǐ jīntiān yǒu shíjiān ma?", "Happy birthday! Do you have time today?"],
  ["安", "上午没有时间，下午有时间。", "Shàngwǔ méiyǒu shíjiān, xiàwǔ yǒu shíjiān.", "I do not have time in the morning, but I have time in the afternoon."],
  ["李", "那我们下午去吃饭吧。", "Nà wǒmen xiàwǔ qù chīfàn ba.", "Then let's go eat this afternoon."],
  ["安", "好的。你想吃什么？", "Hǎo de. Nǐ xiǎng chī shénme?", "Okay. What do you want to eat?"],
  ["李", "我想吃中国菜。你呢？", "Wǒ xiǎng chī Zhōngguó cài. Nǐ ne?", "I want to eat Chinese food. And you?"],
  ["安", "我也喜欢中国菜。我们去小猫饭店吧。", "Wǒ yě xǐhuan Zhōngguó cài. Wǒmen qù Xiǎomāo Fàndiàn ba.", "I like Chinese food too. Let's go to Little Cat Restaurant."],
  ["李", "好的，几点见面？", "Hǎo de, jǐ diǎn jiànmiàn?", "Okay. What time should we meet?"],
  ["安", "五点。你现在在哪里？", "Wǔ diǎn. Nǐ xiànzài zài nǎlǐ?", "Five o'clock. Where are you now?"],
  ["李", "我现在在家。你在哪里？", "Wǒ xiànzài zài jiā. Nǐ zài nǎlǐ?", "I am at home now. Where are you?"],
  ["安", "我在工作。下午五点在饭店见。", "Wǒ zài gōngzuò. Xiàwǔ wǔ diǎn zài fàndiàn jiàn.", "I am at work. See you at the restaurant at five this afternoon."],
  ["李", "好的，下午见。", "Hǎo de, xiàwǔ jiàn.", "Okay, see you this afternoon."],
  ["安", "你到了吗？", "Nǐ dào le ma?", "Have you arrived?"],
  ["李", "我到了。我在饭店里面。", "Wǒ dào le. Wǒ zài fàndiàn lǐmiàn.", "I have arrived. I am inside the restaurant."],
  ["安", "你想喝什么？", "Nǐ xiǎng hē shénme?", "What do you want to drink?"],
  ["李", "我要一杯冰水。你呢？", "Wǒ yào yì bēi bīngshuǐ. Nǐ ne?", "I want one cup of ice water. And you?"],
  ["安", "我要咖啡。你想吃什么？", "Wǒ yào kāfēi. Nǐ xiǎng chī shénme?", "I want coffee. What do you want to eat?"],
  ["李", "我要一碗牛肉面。", "Wǒ yào yì wǎn niúròu miàn.", "I want one bowl of beef noodles."],
  ["安", "我要鸡肉西兰花和一碗馄饨。", "Wǒ yào jīròu xīlánhuā hé yì wǎn húntun.", "I want chicken with broccoli and one bowl of wontons."],
  ["李", "这个饭店的鸡肉很好吃。", "Zhège fàndiàn de jīròu hěn hǎochī.", "The chicken at this restaurant is delicious."],
  ["安", "是的。你饿了吗？", "Shì de. Nǐ è le ma?", "Yes. Are you hungry?"],
  ["李", "我饿了。我们吃饭吧。", "Wǒ è le. Wǒmen chīfàn ba.", "I am hungry. Let's eat."],
  ["安", "好的。吃完以后我去买单。", "Hǎo de. Chī wán yǐhòu wǒ qù mǎidān.", "Okay. After we finish eating, I will pay the bill."],
  ["李", "谢谢！一共多少钱？", "Xièxie! Yígòng duōshao qián?", "Thank you! How much is it altogether?"],
  ["安", "一共一百五十三块。我请客。", "Yígòng yìbǎi wǔshísān kuài. Wǒ qǐngkè.", "It is 153 yuan altogether. It is my treat."],
  ["李", "谢谢，明天见！", "Xièxie, míngtiān jiàn!", "Thank you, see you tomorrow!"],
];

const pronunciationDrills = [
  [1, "zhī", "zh", "1st tone"], [2, "chū", "ch", "1st tone"], [3, "shū", "sh", "1st tone"],
  [4, "rù", "r", "4th tone"], [5, "jǐ", "j", "3rd tone"], [6, "qù", "q", "4th tone"],
  [7, "xǐ", "x", "3rd tone"], [8, "lǜ", "l", "4th tone"], [9, "zhuī", "zh", "1st tone"],
  [10, "chuò", "ch", "4th tone"], [11, "shuǐ", "sh", "3rd tone"], [12, "ròu", "r", "4th tone"],
];

const conversationReadings = [
  {
    chinese: "周末，Anthony问小李：“你明天下午有时间吗？我们一起去小猫饭店吃饭吧。”小李说：“当然有时间。几点见面？”Anthony说：“五点方便吗？”小李说：“好的，明天见。”",
    pinyin: "Zhōumò, Anthony wèn Xiǎo Lǐ: “Nǐ míngtiān xiàwǔ yǒu shíjiān ma? Wǒmen yìqǐ qù Xiǎomāo Fàndiàn chīfàn ba.” Xiǎo Lǐ shuō: “Dāngrán yǒu shíjiān. Jǐ diǎn jiànmiàn?” Anthony shuō: “Wǔ diǎn fāngbiàn ma?” Xiǎo Lǐ shuō: “Hǎo de, míngtiān jiàn.”",
    english: "On the weekend, Anthony asks Xiao Li, “Do you have time tomorrow afternoon? Let's go eat together at Little Cat Restaurant.” Xiao Li says, “Of course. What time should we meet?” Anthony asks, “Is five o'clock convenient?” Xiao Li says, “Okay, see you tomorrow.”",
    newWords: [["周末", "zhōumò", "weekend"], ["一起", "yìqǐ", "together"], ["当然", "dāngrán", "of course"], ["见面", "jiànmiàn", "meet"], ["方便", "fāngbiàn", "convenient"]],
  },
  {
    chinese: "到了饭店，服务员问：“你们想喝什么？”Anthony说：“我要两杯冰水，再来一碗馄饨。”小李说：“我想尝试牛肉面。”服务员说：“没问题，请稍等。”吃完以后，Anthony去买单，他们都觉得很好吃。",
    pinyin: "Dào le fàndiàn, fúwùyuán wèn: “Nǐmen xiǎng hē shénme?” Anthony shuō: “Wǒ yào liǎng bēi bīngshuǐ, zài lái yì wǎn húntun.” Xiǎo Lǐ shuō: “Wǒ xiǎng chángshì niúròu miàn.” Fúwùyuán shuō: “Méi wèntí, qǐng shāo děng.” Chī wán yǐhòu, Anthony qù mǎidān, tāmen dōu juéde hěn hǎochī.",
    english: "At the restaurant, the server asks, “What would you like to drink?” Anthony says, “I want two cups of ice water and another bowl of wontons.” Xiao Li says, “I want to try beef noodles.” The server says, “No problem, please wait a moment.” After eating, Anthony pays the bill, and they both think the food is delicious.",
    newWords: [["再来", "zài lái", "another"], ["尝试", "chángshì", "try"], ["没问题", "méi wèntí", "no problem"], ["稍等", "shāo děng", "wait a moment"], ["觉得", "juéde", "think or feel"]],
  },
  {
    chinese: "今天是Anthony的生日。下午五点，小李到了小猫饭店。他给Anthony一个小礼物。Anthony很高兴，说：“谢谢，你是我的好朋友。”他们一起吃披萨，还喝了咖啡。",
    pinyin: "Jīntiān shì Anthony de shēngrì. Xiàwǔ wǔ diǎn, Xiǎo Lǐ dào le Xiǎomāo Fàndiàn. Tā gěi Anthony yí ge xiǎo lǐwù. Anthony hěn gāoxìng, shuō: “Xièxie, nǐ shì wǒ de hǎo péngyou.” Tāmen yìqǐ chī pīsà, hái hē le kāfēi.",
    english: "Today is Anthony's birthday. At five in the afternoon, Xiao Li arrives at Little Cat Restaurant. He gives Anthony a small gift. Anthony is very happy and says, “Thank you, you are my good friend.” They eat pizza together and also drink coffee.",
    newWords: [["给", "gěi", "give"], ["礼物", "lǐwù", "gift"], ["高兴", "gāoxìng", "happy"], ["还", "hái", "also"]],
  },
  {
    chinese: "每天早上，Anthony七点起床。他喝一杯咖啡，吃面包。上午他学习中文，下午他说中文。晚上十点，他说“晚安”，然后睡觉。",
    pinyin: "Měitiān zǎoshang, Anthony qī diǎn qǐchuáng. Tā hē yì bēi kāfēi, chī miànbāo. Shàngwǔ tā xuéxí Zhōngwén, xiàwǔ tā shuō Zhōngwén. Wǎnshang shí diǎn, tā shuō ‘wǎn'ān,’ ránhòu shuìjiào.",
    english: "Every morning, Anthony gets up at seven. He drinks a cup of coffee and eats bread. In the morning he studies Chinese, and in the afternoon he speaks Chinese. At ten at night, he says “good night” and then sleeps.",
    newWords: [["每天", "měitiān", "every day"], ["起床", "qǐchuáng", "get up"], ["学习", "xuéxí", "study"], ["然后", "ránhòu", "then"]],
  },
  {
    chinese: "星期日下午，Anthony和他的儿子一起去公园。他们走路，也说中文。Anthony问：“你喜欢吃什么？”儿子说：“我喜欢披萨，也喜欢鸡肉。”回家以前，他们买了两杯水。",
    pinyin: "Xīngqīrì xiàwǔ, Anthony hé tā de érzi yìqǐ qù gōngyuán. Tāmen zǒulù, yě shuō Zhōngwén. Anthony wèn: “Nǐ xǐhuan chī shénme?” Érzi shuō: “Wǒ xǐhuan pīsà, yě xǐhuan jīròu.” Huíjiā yǐqián, tāmen mǎi le liǎng bēi shuǐ.",
    english: "On Sunday afternoon, Anthony and his son go to the park together. They walk and also speak Chinese. Anthony asks, “What do you like to eat?” His son says, “I like pizza, and I also like chicken.” Before going home, they buy two cups of water.",
    newWords: [["儿子", "érzi", "son"], ["公园", "gōngyuán", "park"], ["走路", "zǒulù", "walk"], ["回家", "huíjiā", "go home"], ["以前", "yǐqián", "before"]],
  },
];

const characters = [
  ["我", "wǒ", "I; me"], ["你", "nǐ", "you"], ["他", "tā", "he"], ["们", "men", "plural marker"],
  ["人", "rén", "person"], ["爱", "ài", "love"], ["想", "xiǎng", "think; want"], ["不", "bù", "not"],
  ["没", "méi", "not have"], ["是", "shì", "to be"], ["有", "yǒu", "have"], ["要", "yào", "want"],
  ["吃", "chī", "eat"], ["喝", "hē", "drink"], ["说", "shuō", "speak"], ["问", "wèn", "ask"],
  ["去", "qù", "go"], ["到", "dào", "arrive"], ["在", "zài", "at"], ["叫", "jiào", "be called"],
  ["天", "tiān", "day; sky"], ["月", "yuè", "month"], ["日", "rì", "day; sun"], ["时", "shí", "time"],
  ["现", "xiàn", "present"], ["中", "zhōng", "middle; China"], ["文", "wén", "language"], ["水", "shuǐ", "water"],
  ["饭", "fàn", "rice; meal"], ["面", "miàn", "noodles; flour"], ["鸡", "jī", "chicken"], ["肉", "ròu", "meat"],
  ["鱼", "yú", "fish"], ["茶", "chá", "tea"], ["钱", "qián", "money"], ["大", "dà", "big"],
  ["小", "xiǎo", "small"], ["热", "rè", "hot"], ["好", "hǎo", "good"], ["朋", "péng", "friend"],
];

const WRITING_WORDS_KEY = "anthony_mandarin_written_words_v1";
const WRITING_WORDS_CLOUD_KEY = "mandarin_written_words_v1";
const KNOWN_WORDS_KEY = "mandarin-known";
const KNOWN_WORDS_CLOUD_KEY = "mandarin_known_words_v1";

const state = {
  activeCategory: "All",
  query: "",
  showPinyin: true,
  patternGroup: Object.keys(patternGroups)[0],
  readingLayer: "chinese",
  session: [],
  sessionIndex: 0,
  known: new Set(readKnownWords()),
};

let writingWords = readWritingWords();
let mandarinCloudSyncPromise = null;

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);
const shuffle = (items) => [...items].sort(() => Math.random() - 0.5);

function normalizeWritingWords(value) {
  return [...new Set((Array.isArray(value) ? value : []).map((word) => String(word || "").trim()).filter(Boolean))];
}

function readWritingWords() {
  try { return normalizeWritingWords(JSON.parse(localStorage.getItem(WRITING_WORDS_KEY) || "[]")); }
  catch { return []; }
}

function writeWritingWords(value) {
  writingWords = normalizeWritingWords(value);
  localStorage.setItem(WRITING_WORDS_KEY, JSON.stringify(writingWords));
  renderWritingWords();
}

function readKnownWords() {
  try { return normalizeWritingWords(JSON.parse(localStorage.getItem(KNOWN_WORDS_KEY) || "[]")); }
  catch { return []; }
}

function writeKnownWords(value) {
  state.known = new Set(normalizeWritingWords(value));
  localStorage.setItem(KNOWN_WORDS_KEY, JSON.stringify([...state.known]));
  updateProgress();
  renderSession();
}

async function saveKnownWords() {
  writeKnownWords([...state.known]);
  if (!window.musicCloud?.isSignedIn()) return;
  try {
    await musicCloud.saveContent("anthony", KNOWN_WORDS_CLOUD_KEY, [...state.known]);
  } catch (error) {
    console.warn("Mandarin known-word save failed", error);
  }
}

async function saveWritingWords() {
  writeWritingWords(writingWords);
  const status = $("#writing-save-status");
  if (!window.musicCloud?.isSignedIn()) {
    status.textContent = "Saved on this device";
    return;
  }
  try {
    await musicCloud.saveContent("anthony", WRITING_WORDS_CLOUD_KEY, writingWords);
    status.textContent = "Saved to cloud";
  } catch (error) {
    status.textContent = "Saved on device · cloud retry needed";
    console.warn("Mandarin writing list save failed", error);
  }
}

async function syncWritingWordsFromCloud() {
  const status = $("#writing-save-status");
  if (!window.musicCloud?.isSignedIn()) {
    status.textContent = "Saved on this device";
    return renderWritingWords();
  }
  try {
    const row = await musicCloud.getContent("anthony", WRITING_WORDS_CLOUD_KEY);
    const merged = normalizeWritingWords([...(row?.value || []), ...writingWords]);
    writeWritingWords(merged);
    if (!row?.value || merged.length !== normalizeWritingWords(row.value).length) await musicCloud.saveContent("anthony", WRITING_WORDS_CLOUD_KEY, merged);
    status.textContent = "Synced privately across devices";
  } catch (error) {
    status.textContent = "Saved on device · cloud unavailable";
    console.warn("Mandarin writing list sync failed", error);
  }
}

async function syncKnownWordsFromCloud() {
  if (!window.musicCloud?.isSignedIn()) return;
  try {
    const row = await musicCloud.getContent("anthony", KNOWN_WORDS_CLOUD_KEY);
    const cloudWords = normalizeWritingWords(row?.value);
    const merged = normalizeWritingWords([...cloudWords, ...state.known]);
    writeKnownWords(merged);
    if (!row?.value || merged.length !== cloudWords.length) await musicCloud.saveContent("anthony", KNOWN_WORDS_CLOUD_KEY, merged);
  } catch (error) {
    console.warn("Mandarin known-word sync failed", error);
  }
}

function syncMandarinProgressFromCloud() {
  if (mandarinCloudSyncPromise) return mandarinCloudSyncPromise;
  mandarinCloudSyncPromise = Promise.all([syncWritingWordsFromCloud(), syncKnownWordsFromCloud()])
    .finally(() => { mandarinCloudSyncPromise = null; });
  return mandarinCloudSyncPromise;
}

function renderWritingWords() {
  const list = $("#writing-word-list");
  $("#writing-word-count").textContent = String(writingWords.length);
  $("#writing-word-empty").hidden = writingWords.length > 0;
  list.innerHTML = writingWords.map((word) => `<li><span lang="zh-Hans">${escapeHtml(word)}</span><button type="button" data-remove-writing-word="${escapeHtml(word)}" aria-label="Remove ${escapeHtml(word)}">×</button></li>`).join("");
  enhanceMandarinSpeech(list);
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>\"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '\"': "&quot;" })[character]);
}

function updateProgress() {
  const percent = Math.round((state.known.size / vocabulary.length) * 100);
  $("#hero-progress").textContent = `${percent}%`;
  $("#hero-progress-bar").style.width = `${percent}%`;
}

function makeSession() {
  state.session = shuffle(vocabulary).slice(0, 5);
  state.sessionIndex = 0;
  renderSession();
  renderFlashcard();
}

function renderSession() {
  const list = $("#session-list");
  list.replaceChildren();
  state.session.forEach((word, index) => {
    const item = document.createElement("li");
    if (index === state.sessionIndex) item.classList.add("active");
    if (state.known.has(word[0])) item.classList.add("known");
    const number = document.createElement("span");
    number.className = "session-number";
    number.textContent = state.known.has(word[0]) ? "✓" : index + 1;
    const label = document.createElement("span");
    label.lang = "zh-Hans";
    label.textContent = word[0];
    item.append(number, label);
    list.append(item);
  });
}

function renderFlashcard() {
  const word = state.session[state.sessionIndex];
  if (!word) return;
  $("#flashcard").classList.remove("revealed");
  $("#flash-answer").setAttribute("aria-hidden", "true");
  $("#flash-category").textContent = word[3];
  $("#flash-position").textContent = `${state.sessionIndex + 1} / ${state.session.length}`;
  $("#flash-hanzi").textContent = word[0];
  $("#flash-pinyin").textContent = word[1];
  $("#flash-meaning").textContent = word[2];
  renderSession();
}

function revealCard() {
  $("#flashcard").classList.toggle("revealed");
  const revealed = $("#flashcard").classList.contains("revealed");
  $("#flash-answer").setAttribute("aria-hidden", String(!revealed));
}

function advanceCard(markKnown) {
  const word = state.session[state.sessionIndex];
  if (markKnown) {
    state.known.add(word[0]);
    void saveKnownWords();
  }
  state.sessionIndex = (state.sessionIndex + 1) % state.session.length;
  renderFlashcard();
}

function renderFilters() {
  const categories = ["All", ...new Set(vocabulary.map((word) => word[3]))];
  const row = $("#category-filters");
  categories.forEach((category) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "filter-chip";
    button.textContent = category;
    if (category === state.activeCategory) button.classList.add("active");
    button.addEventListener("click", () => {
      state.activeCategory = category;
      row.querySelectorAll("button").forEach((chip) => chip.classList.toggle("active", chip === button));
      renderVocabulary();
    });
    row.append(button);
  });
}

function renderVocabulary() {
  const query = state.query.trim().toLocaleLowerCase();
  const filtered = vocabulary.filter((word) => {
    const inCategory = state.activeCategory === "All" || word[3] === state.activeCategory;
    const matches = !query || word.slice(0, 3).some((value) => value.toLocaleLowerCase().includes(query));
    return inCategory && matches;
  });

  const grid = $("#vocab-grid");
  grid.replaceChildren();
  grid.classList.toggle("hide-pinyin", !state.showPinyin);
  filtered.forEach(([hanzi, pinyin, meaning, category]) => {
    const article = document.createElement("article");
    article.className = "word-card";
    const h3 = document.createElement("h3");
    h3.className = "word-hanzi";
    h3.lang = "zh-Hans";
    h3.textContent = hanzi;
    const py = document.createElement("p");
    py.className = "word-pinyin";
    py.textContent = pinyin;
    const en = document.createElement("p");
    en.className = "word-meaning";
    en.textContent = meaning;
    const tag = document.createElement("span");
    tag.className = "word-category";
    tag.textContent = category;
    article.append(h3, py, en, tag);
    grid.append(article);
  });
  $("#visible-count").textContent = filtered.length;
  $("#vocab-empty").hidden = filtered.length !== 0;
}

function renderPatternTabs() {
  const tabs = $("#pattern-tabs");
  Object.keys(patternGroups).forEach((group) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "pattern-tab";
    button.setAttribute("role", "tab");
    button.setAttribute("aria-selected", String(group === state.patternGroup));
    button.textContent = group;
    button.addEventListener("click", () => {
      state.patternGroup = group;
      tabs.querySelectorAll("button").forEach((tab) => tab.setAttribute("aria-selected", String(tab === button)));
      renderPatterns();
    });
    tabs.append(button);
  });
}

function renderPatterns() {
  const list = $("#pattern-list");
  list.replaceChildren();
  patternGroups[state.patternGroup].forEach(([chinese, pinyin, english]) => {
    const row = document.createElement("article");
    row.className = "pattern-item";
    const zh = document.createElement("p");
    zh.className = "pattern-chinese";
    zh.lang = "zh-Hans";
    zh.textContent = chinese;
    const py = document.createElement("p");
    py.className = "pattern-pinyin";
    py.textContent = pinyin;
    const en = document.createElement("p");
    en.className = "pattern-english";
    en.textContent = english;
    row.append(zh, py, en);
    list.append(row);
  });
}

function renderReading() {
  const article = $("#reading-copy");
  article.replaceChildren();
  conversationReadings.forEach((reading) => {
    const paragraph = document.createElement("p");
    paragraph.className = "reading-paragraph";
    paragraph.dataset.layer = state.readingLayer;
    const line = reading[state.readingLayer];
    if (state.readingLayer === "chinese") {
      paragraph.lang = "zh-Hans";
      appendHighlightedWords(paragraph, line, reading.newWords.map(([word]) => word));
    } else paragraph.textContent = line;
    const wordList = document.createElement("div");
    wordList.className = "new-word-list";
    reading.newWords.slice(0, 5).forEach(([word, pinyin, meaning]) => {
      const chip = document.createElement("span");
      chip.textContent = `${word} · ${pinyin} · ${meaning}`;
      wordList.append(chip);
    });
    article.append(paragraph, wordList);
  });
}

function appendHighlightedWords(container, text, words) {
  const pattern = new RegExp(`(${words.map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "g");
  text.split(pattern).filter(Boolean).forEach((piece) => {
    if (words.includes(piece)) {
      const mark = document.createElement("mark");
      mark.className = "new-word";
      mark.textContent = piece;
      container.append(mark);
    } else container.append(document.createTextNode(piece));
  });
}

function speakMandarin(text) {
  if (window.MandarinSpeech) return window.MandarinSpeech.speak(text);
  if (!("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "zh-CN";
  utterance.rate = 0.82;
  utterance.voice = speechSynthesis.getVoices().find((voice) => /^zh[-_]/i.test(voice.lang)) || null;
  speechSynthesis.speak(utterance);
}

function enhanceMandarinSpeech(root = document) {
  const selector = '[lang="zh-Hans"], [data-speak-mandarin]';
  const elements = [...(root.matches?.(selector) ? [root] : []), ...root.querySelectorAll(selector)];
  elements.forEach((element) => {
    element.classList.add("speakable-mandarin");
    element.title ||= "Tap to hear Mandarin";
    if (!element.matches("button, a, input, select, textarea, [tabindex]")) {
      element.tabIndex = 0;
      element.setAttribute("role", "button");
    }
  });
}

function speakFromElement(element) {
  const text = element.dataset.speakMandarin || element.textContent.trim();
  if (text) speakMandarin(text);
}

function renderDialogue() {
  const list = $("#dialogue-list");
  planDialogue.forEach(([speaker, chinese, pinyin, english]) => {
    const row = document.createElement("article");
    row.className = "dialogue-turn";
    const speakerName = speaker === "安" ? "Anthony" : "Xiao Li";
    row.innerHTML = `<span class="dialogue-speaker" aria-label="${speakerName}" title="${speakerName}">${speaker}</span><div><p class="dialogue-chinese" lang="zh-Hans">${chinese}</p><p class="dialogue-pinyin">${pinyin}</p></div><p class="dialogue-english">${english}</p>`;
    list.append(row);
  });
}

function renderPronunciation() {
  const grid = $("#sound-grid");
  pronunciationDrills.forEach(([number, syllable, initial, tone]) => {
    const card = document.createElement("article");
    card.className = "sound-card";
    card.dataset.speakMandarin = syllable;
    card.innerHTML = `<span class="sound-number">${number}</span><strong>${syllable}</strong><small>${initial} · ${tone}</small>`;
    grid.append(card);
  });
}

function renderCharacters() {
  const grid = $("#character-grid");
  characters.forEach(([character, pinyin, meaning], index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "character-button";
    button.lang = "zh-Hans";
    button.textContent = character;
    button.setAttribute("aria-label", `${character}, ${pinyin}, ${meaning}`);
    if (index === 0) button.classList.add("active");
    button.addEventListener("click", () => {
      grid.querySelectorAll("button").forEach((item) => item.classList.toggle("active", item === button));
      $("#focus-character").textContent = character;
      $("#focus-pinyin").textContent = pinyin;
      $("#focus-meaning").textContent = meaning;
    });
    grid.append(button);
  });
}

$("#word-count").textContent = vocabulary.length;
$("#flashcard").addEventListener("click", revealCard);
$("#flashcard").addEventListener("keydown", (event) => {
  if (event.code === "Space" || event.code === "Enter") {
    event.preventDefault();
    revealCard();
  }
});
$("#review-again").addEventListener("click", () => advanceCard(false));
$("#know-word").addEventListener("click", () => advanceCard(true));
$("#new-session").addEventListener("click", makeSession);
$("#vocab-search").addEventListener("input", (event) => {
  state.query = event.target.value;
  renderVocabulary();
});
$("#toggle-pinyin").addEventListener("click", (event) => {
  state.showPinyin = !state.showPinyin;
  event.currentTarget.textContent = state.showPinyin ? "Hide pinyin" : "Show pinyin";
  event.currentTarget.setAttribute("aria-pressed", String(!state.showPinyin));
  renderVocabulary();
});
$("#writing-word-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const input = $("#writing-word-input");
  const word = input.value.trim();
  if (!word) return;
  if (!writingWords.includes(word)) writingWords.push(word);
  input.value = "";
  await saveWritingWords();
  input.focus();
});
$("#writing-word-list").addEventListener("click", async (event) => {
  const button = event.target.closest("[data-remove-writing-word]");
  if (!button) return;
  writingWords = writingWords.filter((word) => word !== button.dataset.removeWritingWord);
  await saveWritingWords();
});
$("#reading-controls").addEventListener("click", (event) => {
  const button = event.target.closest("button[data-layer]");
  if (!button) return;
  state.readingLayer = button.dataset.layer;
  $("#reading-controls").querySelectorAll("button").forEach((item) => {
    const active = item === button;
    item.classList.toggle("active", active);
    item.setAttribute("aria-pressed", String(active));
  });
  renderReading();
});
$("#speak-reading").addEventListener("click", () => speakMandarin(conversationReadings.map((reading) => reading.chinese).join("。")));
document.addEventListener("click", (event) => {
  const target = event.target.closest('.speakable-mandarin, [lang="zh-Hans"], [data-speak-mandarin]');
  if (target) speakFromElement(target);
});
document.addEventListener("keydown", (event) => {
  if (!['Enter', ' '].includes(event.key)) return;
  const target = event.target.closest('.speakable-mandarin, [lang="zh-Hans"], [data-speak-mandarin]');
  if (!target) return;
  event.preventDefault();
  speakFromElement(target);
});
const requestedPage = new URLSearchParams(location.search).get("page");
const mandarinPages = ["lesson", "cards", "sounds", "words", "writing", "sentences", "plans", "reading", "characters"];
const activePage = mandarinPages.includes(requestedPage) ? requestedPage : "home";
$$('.mandarin-page').forEach((page) => { page.hidden = page.dataset.page !== activePage; });
$$('[data-page-link]').forEach((link) => {
  if (link.dataset.pageLink === activePage) link.setAttribute("aria-current", "page");
  else link.removeAttribute("aria-current");
});

renderFilters();
renderVocabulary();
renderPronunciation();
renderPatternTabs();
renderPatterns();
renderDialogue();
renderReading();
renderCharacters();
renderWritingWords();
makeSession();
updateProgress();
enhanceMandarinSpeech();
syncMandarinProgressFromCloud();
window.addEventListener("site-cloud-change", () => { void syncMandarinProgressFromCloud(); });
const mandarinMain = $("main");
if (mandarinMain) {
  new MutationObserver((records) => records.forEach((record) => record.addedNodes.forEach((node) => {
    if (node.nodeType === Node.ELEMENT_NODE) enhanceMandarinSpeech(node);
  }))).observe(mandarinMain, { childList: true, subtree: true });
}
