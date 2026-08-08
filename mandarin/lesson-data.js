(() => {
  "use strict";

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

  const lessonOneOverview = {
    cards: [
      ["Early morning", "早上好", "zǎoshang hǎo", "good morning"],
      ["Before noon", "上午好", "shàngwǔ hǎo", "good morning"],
      ["Afternoon", "下午好", "xiàwǔ hǎo", "good afternoon"],
      ["Evening", "晚上好", "wǎnshang hǎo", "good evening"],
      ["Bedtime", "晚安", "wǎn'ān", "good night"],
    ],
    feature: ["小李", "这是小李。他是中国人，他是我们的朋友。他喜欢鸡肉。", "Zhè shì Xiǎo Lǐ. Tā shì Zhōngguó rén, tā shì wǒmen de péngyou. Tā xǐhuan jīròu.", "This is Xiao Li. He is Chinese, he is our friend, and he likes chicken."],
  };
  
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

  const lessonTwoVocabulary = [
    // Likes, health, and people
    ["喜欢", "xǐhuan", "to like", "Daily life"],
    ["最", "zuì", "most", "Descriptions"],
    ["最喜欢", "zuì xǐhuan", "favorite; like the most", "Descriptions"],
    ["健康", "jiànkāng", "healthy", "Health"],
    ["病", "bìng", "illness; sick", "Health"],
    ["生病", "shēngbìng", "to be sick; become ill", "Health"],
    ["生病了", "shēngbìng le", "became sick; am sick now", "Health"],
    ["医生", "yīshēng", "doctor", "People"],
    ["老师", "lǎoshī", "teacher", "People"],
    ["朋友", "péngyou", "friend", "People"],

    // Work and places
    ["医院", "yīyuàn", "hospital", "Places"],
    ["学校", "xuéxiào", "school", "Places"],
    ["家", "jiā", "home; family", "Places"],
    ["工作", "gōngzuò", "to work; job", "Daily life"],
    ["做", "zuò", "to do; to make", "Daily life"],
    ["忙", "máng", "busy", "Descriptions"],
    ["起床", "qǐchuáng", "to get up", "Daily life"],

    // Time, age, and numbers
    ["今天", "jīntiān", "today", "Time"],
    ["今年", "jīnnián", "this year", "Time"],
    ["年", "nián", "year", "Time"],
    ["昨天", "zuótiān", "yesterday", "Time"],
    ["星期二", "xīngqī'èr", "Tuesday", "Time"],
    ["星期五见", "xīngqīwǔ jiàn", "see you Friday", "Greetings"],
    ["三十", "sānshí", "thirty", "Numbers"],
    ["三十九", "sānshíjiǔ", "thirty-nine", "Numbers"],
    ["五十五", "wǔshíwǔ", "fifty-five", "Numbers"],
    ["岁", "suì", "years old", "People"],

    // Questions and choices
    ["谁", "shéi / shuí", "who", "Grammar"],
    ["多大", "duō dà", "how old", "Grammar"],
    ["还是", "háishi", "or; used in a choice question", "Grammar"],

    // Food and pronunciation words
    ["牛肉面", "niúròu miàn", "beef noodles", "Food & drink"],
    ["美国菜", "měiguó cài", "American food", "Food & drink"],
    ["白酒", "báijiǔ", "strong Chinese white liquor", "Food & drink"],
    ["茄子", "qiézi", "eggplant", "Food & drink"],
    ["排球", "páiqiú", "volleyball", "Daily life"],
    ["约", "yuē", "to arrange; appointment or date", "Daily life"],
  ];

  const lessonTwoSentenceGroups = {
    "Favorites & health": [
      ["我最喜欢的中国菜是牛肉面。", "Wǒ zuì xǐhuan de Zhōngguó cài shì niúròu miàn.", "My favorite Chinese food is beef noodles."],
      ["我喜欢中国菜。", "Wǒ xǐhuan Zhōngguó cài.", "I like Chinese food."],
      ["你健康吗？", "Nǐ jiànkāng ma?", "Are you healthy?"],
      ["我生病了。", "Wǒ shēngbìng le.", "I am sick."],
      ["我生病了，我要去医院。", "Wǒ shēngbìng le, wǒ yào qù yīyuàn.", "I am sick, so I need to go to the hospital."],
      ["医生很健康。", "Yīshēng hěn jiànkāng.", "The doctor is healthy."],
    ],
    "Work & places": [
      ["我在家工作。", "Wǒ zài jiā gōngzuò.", "I work from home."],
      ["老师在学校工作。", "Lǎoshī zài xuéxiào gōngzuò.", "The teacher works at school."],
      ["医生在医院工作。", "Yīshēng zài yīyuàn gōngzuò.", "The doctor works at the hospital."],
      ["你在学校工作吗？", "Nǐ zài xuéxiào gōngzuò ma?", "Do you work at a school?"],
      ["我不在学校工作，我在医院工作。", "Wǒ bú zài xuéxiào gōngzuò, wǒ zài yīyuàn gōngzuò.", "I do not work at a school; I work at a hospital."],
      ["小李是医生，小王是老师。", "Xiǎo Lǐ shì yīshēng, Xiǎo Wáng shì lǎoshī.", "Xiao Li is a doctor, and Xiao Wang is a teacher."],
    ],
    "Questions": [
      ["他是谁？", "Tā shì shéi?", "Who is he?"],
      ["他几岁？", "Tā jǐ suì?", "How old is he?"],
      ["他多大？", "Tā duō dà?", "How old is he?"],
      ["你在哪里工作？", "Nǐ zài nǎlǐ gōngzuò?", "Where do you work?"],
      ["你做什么工作？", "Nǐ zuò shénme gōngzuò?", "What do you do for work?"],
      ["你昨天几点睡觉？", "Nǐ zuótiān jǐ diǎn shuìjiào?", "What time did you go to sleep yesterday?"],
    ],
    "还是 choices": [
      ["妈妈喜欢茶还是咖啡？", "Māma xǐhuan chá háishi kāfēi?", "Does Mom like tea or coffee?"],
      ["今天是星期一还是星期二？", "Jīntiān shì xīngqīyī háishi xīngqī'èr?", "Is today Monday or Tuesday?"],
      ["你在Shama饭店还是在Starbucks？", "Nǐ zài Shama Fàndiàn háishi zài Starbucks?", "Are you at Shama Restaurant or Starbucks?"],
      ["你是老师还是医生？", "Nǐ shì lǎoshī háishi yīshēng?", "Are you a teacher or a doctor?"],
      ["你喜欢中国菜还是美国菜？", "Nǐ xǐhuan Zhōngguó cài háishi Měiguó cài?", "Do you like Chinese food or American food?"],
    ],
    "Daily review": [
      ["我七点起床。", "Wǒ qī diǎn qǐchuáng.", "I get up at seven."],
      ["我吃了美国菜。", "Wǒ chī le Měiguó cài.", "I ate American food."],
      ["一共五十五块钱。", "Yígòng wǔshíwǔ kuài qián.", "It was 55 yuan altogether."],
      ["我见了朋友。", "Wǒ jiàn le péngyou.", "I met a friend."],
      ["我的朋友三十九岁。", "Wǒ de péngyou sānshíjiǔ suì.", "My friend is 39 years old."],
      ["我太忙了。", "Wǒ tài máng le.", "I became too busy."],
      ["他三十岁了。", "Tā sānshí suì le.", "He is 30 years old now."],
      ["他今年三十岁。", "Tā jīnnián sānshí suì.", "He is 30 this year."],
      ["星期五见。", "Xīngqīwǔ jiàn.", "See you Friday."],
    ],
  };

  const lessonTwoDialogue = [
    ["安", "小李，你好！", "Xiǎo Lǐ, nǐ hǎo!", "Hello, Xiao Li!"],
    ["李", "你好，Anthony。你今天怎么样？", "Nǐ hǎo, Anthony. Nǐ jīntiān zěnmeyàng?", "Hello, Anthony. How are you today?"],
    ["安", "我很好。你呢？", "Wǒ hěn hǎo. Nǐ ne?", "I am very well. And you?"],
    ["李", "我不太好，我生病了。", "Wǒ bú tài hǎo, wǒ shēngbìng le.", "I am not very well; I am sick."],
    ["安", "你要去医院吗？", "Nǐ yào qù yīyuàn ma?", "Do you need to go to the hospital?"],
    ["李", "要，我下午去医院。", "Yào, wǒ xiàwǔ qù yīyuàn.", "Yes, I am going to the hospital this afternoon."],
    ["安", "医生在医院工作吗？", "Yīshēng zài yīyuàn gōngzuò ma?", "Does the doctor work at the hospital?"],
    ["李", "是，医生在医院工作。", "Shì, yīshēng zài yīyuàn gōngzuò.", "Yes, the doctor works at the hospital."],
    ["安", "你做什么工作？", "Nǐ zuò shénme gōngzuò?", "What do you do for work?"],
    ["李", "我是老师。", "Wǒ shì lǎoshī.", "I am a teacher."],
    ["安", "你在哪里工作？", "Nǐ zài nǎlǐ gōngzuò?", "Where do you work?"],
    ["李", "我在学校工作。你呢？", "Wǒ zài xuéxiào gōngzuò. Nǐ ne?", "I work at a school. And you?"],
    ["安", "我在家工作。", "Wǒ zài jiā gōngzuò.", "I work from home."],
    ["李", "你今天忙吗？", "Nǐ jīntiān máng ma?", "Are you busy today?"],
    ["安", "我太忙了。", "Wǒ tài máng le.", "I am too busy."],
    ["李", "你几点起床？", "Nǐ jǐ diǎn qǐchuáng?", "What time do you get up?"],
    ["安", "我七点起床。", "Wǒ qī diǎn qǐchuáng.", "I get up at seven."],
    ["李", "你今天吃什么？", "Nǐ jīntiān chī shénme?", "What are you eating today?"],
    ["安", "我吃了美国菜。", "Wǒ chī le Měiguó cài.", "I ate American food."],
    ["李", "你喜欢美国菜还是中国菜？", "Nǐ xǐhuan Měiguó cài háishi Zhōngguó cài?", "Do you like American food or Chinese food?"],
    ["安", "我最喜欢中国菜。", "Wǒ zuì xǐhuan Zhōngguó cài.", "I like Chinese food the most."],
    ["李", "你最喜欢的中国菜是什么？", "Nǐ zuì xǐhuan de Zhōngguó cài shì shénme?", "What is your favorite Chinese food?"],
    ["安", "我最喜欢的中国菜是牛肉面。", "Wǒ zuì xǐhuan de Zhōngguó cài shì niúròu miàn.", "My favorite Chinese food is beef noodles."],
    ["李", "你喜欢喝茶还是咖啡？", "Nǐ xǐhuan hē chá háishi kāfēi?", "Do you like drinking tea or coffee?"],
    ["安", "我喜欢咖啡。你呢？", "Wǒ xǐhuan kāfēi. Nǐ ne?", "I like coffee. And you?"],
    ["李", "我喜欢茶。", "Wǒ xǐhuan chá.", "I like tea."],
    ["安", "你星期五有时间吗？", "Nǐ xīngqīwǔ yǒu shíjiān ma?", "Do you have time Friday?"],
    ["李", "有。我们星期五去吃饭吧。", "Yǒu. Wǒmen xīngqīwǔ qù chīfàn ba.", "Yes. Let's go eat Friday."],
    ["安", "好的，星期五见！", "Hǎo de, xīngqīwǔ jiàn!", "Okay, see you Friday!"],
    ["李", "星期五见！", "Xīngqīwǔ jiàn!", "See you Friday!"],
  ];

  const lessonTwoPronunciationDrills = [
    [1, "xiè", "ie", "谢谢 · thank you"],
    [2, "xué", "üe", "学校 · school"],
    [3, "zuò", "uo", "工作 · work"],
    [4, "ròu", "ou", "牛肉 · beef"],
    [5, "shuǐ", "ui", "水 · water"],
    [6, "jiǔ", "iu", "白酒 · white liquor"],
    [7, "kàn", "an", "看 · look"],
    [8, "rén", "en", "人 · person"],
    [9, "máng", "ang", "忙 · busy"],
    [10, "shēng", "eng", "生病 · be sick"],
    [11, "èr", "er", "二 · two; tone changes by word"],
  ];

  const lessonTwoReadings = [
    {
      chinese: "今天我七点起床。我吃了美国菜，一共五十五块钱。下午我见了朋友。我的朋友三十九岁。今天我太忙了。",
      pinyin: "Jīntiān wǒ qī diǎn qǐchuáng. Wǒ chī le Měiguó cài, yígòng wǔshíwǔ kuài qián. Xiàwǔ wǒ jiàn le péngyou. Wǒ de péngyou sānshíjiǔ suì. Jīntiān wǒ tài máng le.",
      english: "Today I got up at seven. I ate American food, which cost 55 yuan altogether. In the afternoon I met a friend. My friend is 39 years old. I was too busy today.",
      newWords: [],
    },
    {
      chinese: "这是小李。他是医生。他今年三十岁。他在医院工作。老师问：“他是谁？他几岁？”我说：“他是小李，他三十岁了。”",
      pinyin: "Zhè shì Xiǎo Lǐ. Tā shì yīshēng. Tā jīnnián sānshí suì. Tā zài yīyuàn gōngzuò. Lǎoshī wèn: “Tā shì shéi? Tā jǐ suì?” Wǒ shuō: “Tā shì Xiǎo Lǐ, tā sānshí suì le.”",
      english: "This is Xiao Li. He is a doctor. He is 30 this year. He works at a hospital. The teacher asks, “Who is he? How old is he?” I say, “He is Xiao Li, and he is now 30.”",
      newWords: [],
    },
    {
      chinese: "妈妈喜欢茶还是咖啡？妈妈喜欢茶。我喜欢咖啡。我最喜欢的中国菜是牛肉面。星期五我们去饭店吃饭。星期五见！",
      pinyin: "Māma xǐhuan chá háishi kāfēi? Māma xǐhuan chá. Wǒ xǐhuan kāfēi. Wǒ zuì xǐhuan de Zhōngguó cài shì niúròu miàn. Xīngqīwǔ wǒmen qù fàndiàn chīfàn. Xīngqīwǔ jiàn!",
      english: "Does Mom like tea or coffee? Mom likes tea. I like coffee. My favorite Chinese food is beef noodles. On Friday we will go eat at a restaurant. See you Friday!",
      newWords: [],
    },
  ];

  const lessonTwoCharacters = [
    ["最", "zuì", "most"], ["健", "jiàn", "healthy; strong"], ["康", "kāng", "healthy"],
    ["病", "bìng", "illness"], ["生", "shēng", "life; become"], ["医", "yī", "medicine"],
    ["院", "yuàn", "institution; courtyard"], ["学", "xué", "study"], ["校", "xiào", "school"],
    ["工", "gōng", "work"], ["作", "zuò", "do; make"], ["家", "jiā", "home; family"],
    ["今", "jīn", "current; today"], ["年", "nián", "year"], ["忙", "máng", "busy"],
    ["白", "bái", "white"], ["酒", "jiǔ", "alcohol"], ["茄", "qié", "eggplant"],
    ["排", "pái", "row; arrange"], ["球", "qiú", "ball"], ["约", "yuē", "arrange; appointment"],
  ];

  const lessonTwoOverview = {
    cards: [
      ["Favorite", "最喜欢", "zuì xǐhuan", "like the most"],
      ["Healthy", "健康", "jiànkāng", "healthy"],
      ["Hospital", "医院", "yīyuàn", "hospital"],
      ["Work", "工作", "gōngzuò", "work"],
      ["This year", "今年", "jīnnián", "this year"],
    ],
    feature: ["还是 · A or B", "妈妈喜欢茶还是咖啡？", "Māma xǐhuan chá háishi kāfēi?", "Use 还是 for an A-or-B question. Do not add 吗."],
  };

  const pinyinSoundGroups = Object.freeze({
    Initials: [
      ["b", "八", "bā"], ["p", "怕", "pà"], ["m", "妈", "mā"], ["f", "发", "fā"],
      ["d", "大", "dà"], ["t", "他", "tā"], ["n", "你", "nǐ"], ["l", "来", "lái"],
      ["g", "哥", "gē"], ["k", "看", "kàn"], ["h", "好", "hǎo"], ["j", "家", "jiā"],
      ["q", "去", "qù"], ["x", "小", "xiǎo"], ["zh", "中", "zhōng"], ["ch", "吃", "chī"],
      ["sh", "是", "shì"], ["r", "人", "rén"], ["z", "早", "zǎo"], ["c", "菜", "cài"],
      ["s", "三", "sān"], ["y", "一", "yī"], ["w", "我", "wǒ"],
    ],
    Finals: [
      ["a", "八", "bā"], ["o", "我", "wǒ"], ["uo", "做", "zuò"], ["e", "饿", "è"], ["i", "你", "nǐ"],
      ["u", "路", "lù"], ["ü", "鱼", "yú"], ["ai", "爱", "ài"], ["ei", "杯", "bēi"],
      ["ui", "水", "shuǐ"], ["ao", "好", "hǎo"], ["ou", "肉", "ròu"], ["iu", "六", "liù"],
      ["ie", "谢", "xiè"], ["üe", "月", "yuè"], ["er", "二", "èr"], ["an", "三", "sān"],
      ["en", "人", "rén"], ["in", "您", "nín"], ["un", "问", "wèn"], ["ün", "云", "yún"],
      ["ang", "忙", "máng"], ["eng", "冷", "lěng"], ["ing", "听", "tīng"], ["ong", "中", "zhōng"],
    ],
    "Whole syllables": [
      ["zhi", "知", "zhī"], ["chi", "吃", "chī"], ["shi", "是", "shì"], ["ri", "日", "rì"],
      ["zi", "字", "zì"], ["ci", "次", "cì"], ["si", "四", "sì"], ["yi", "一", "yī"],
      ["wu", "五", "wǔ"], ["yu", "鱼", "yú"], ["ye", "也", "yě"], ["yue", "月", "yuè"],
      ["yin", "音", "yīn"], ["yun", "云", "yún"], ["yuan", "元", "yuán"], ["ying", "英", "yīng"],
    ],
    Tones: [
      ["mā", "妈", "first · level"], ["má", "麻", "second · rising"], ["mǎ", "马", "third · dipping"],
      ["mà", "骂", "fourth · falling"], ["ma", "吗", "neutral · light"],
    ],
  });
  

  const lessons = [
    {
      id: "lesson-1",
      title: "Lesson 1",
      status: "learned",
      overview: lessonOneOverview,
      vocabulary,
      sentenceGroups: patternGroups,
      dialogue: planDialogue,
      pronunciationDrills,
      readings: conversationReadings,
      characters,
    },
    {
      id: "lesson-2",
      title: "Lesson 2",
      status: "learned",
      overview: lessonTwoOverview,
      vocabulary: lessonTwoVocabulary,
      sentenceGroups: lessonTwoSentenceGroups,
      dialogue: lessonTwoDialogue,
      pronunciationDrills: lessonTwoPronunciationDrills,
      readings: lessonTwoReadings,
      characters: lessonTwoCharacters,
    },
  ];

  function get(id) {
    return lessons.find((lesson) => lesson.id === id) || lessons[0];
  }

  function uniqueRows(rows) {
    return [...new Map(rows.map((row) => [`${row[0]}\u0000${row[2]}`, row])).values()];
  }

  function allVocabulary() {
    return uniqueRows(lessons.flatMap((lesson) => lesson.vocabulary));
  }

  function allSentences() {
    return uniqueRows(lessons.flatMap((lesson) => Object.values(lesson.sentenceGroups).flat()));
  }

  function allCharacters() {
    return [...new Map(lessons.flatMap((lesson) => lesson.characters).map((row) => [row[0], row])).values()];
  }

  window.MandarinLessons = Object.freeze({ lessons, get, allVocabulary, allSentences, allCharacters, pinyinSoundGroups });
})();
