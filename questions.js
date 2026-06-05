// Question bank for the english-basics practice app.
//
// Each question has:
//   id          – unique slug for the bank
//   category    – one of CATEGORIES
//   type        – "multiple-choice" | "free-write"
//   prompt      – for MC: a sentence with a deliberate mistake.
//                 for free-write: a short task telling the user what to write.
//   options     – for MC: array of 4 candidate sentences (1 is correct).
//                 unused for free-write (left as []).
//   correct     – for MC: index (0–3) of the right option.
//                 unused for free-write (left as null).
//   explanation – for MC: short note on why the correct option works and
//                 why the others don't. For free-write: a model answer the
//                 user can compare to, plus a one-line coaching tip.
//
// Mistakes here target the patterns a Spanish native speaker most often
// produces in English: article misuse, preposition carry-overs, false
// friends (actualmente ≠ actually), and word order quirks from SVO→SOV
// interference. Free-write prompts force the learner to actually produce
// the form, which is where the rule really sticks.

const QUESTIONS = [
  // =====================================================================
  // ARTICLES — a / an / the / (zero article)
  // =====================================================================
  {
    id: "articles-1",
    category: "Articles",
    type: "multiple-choice",
    prompt: "Choose the correct sentence.",
    options: [
      "I had a apple for breakfast.",
      "I had an apple for breakfast.",
      "I had the apple for breakfast.",
      "I had apple for breakfast.",
    ],
    correct: 1,
    explanation:
      "'An' is used before vowel sounds, including the vowel sound at the start of 'apple' (/æ/). Use 'a' for consonant sounds (a banana, a car), 'an' for vowel sounds (an egg, an hour — note the silent h).",
  },
  {
    id: "articles-2",
    category: "Articles",
    type: "multiple-choice",
    prompt: "Choose the correct sentence.",
    options: [
      "I love the music of the 80s.",
      "I love music of the 80s.",
      "I love the music of 80s.",
      "I love music of 80s.",
    ],
    correct: 0,
    explanation:
      "We say 'the 80s' (definite article + decade) and 'the music' (specific genre being talked about). The article goes on both: 'the music of the 80s'.",
  },
  {
    id: "articles-3",
    category: "Articles",
    type: "multiple-choice",
    prompt: "Choose the correct sentence.",
    options: [
      "I go to the school every day.",
      "I go to school every day.",
      "I go to a school every day.",
      "I go to school the every day.",
    ],
    correct: 1,
    explanation:
      "When you mean 'as a student / for the purpose of education' (a general activity), English uses ZERO article with 'school', 'work', 'home', 'bed', 'church'. Say 'go to school' (study), 'go to work' (do your job), 'go to bed' (sleep). Use 'the school' only when you mean the specific building or a specific institution.",
  },
  {
    id: "articles-4",
    category: "Articles",
    type: "multiple-choice",
    prompt: "Choose the correct sentence.",
    options: [
      "Life is beautiful.",
      "The life is beautiful.",
      "A life is beautiful.",
      "An life is beautiful.",
    ],
    correct: 0,
    explanation:
      "When you mean 'life' as a general concept (existence, life in general), English uses NO article. Same pattern with 'love', 'death', 'happiness': 'Love is blind', 'Death is certain'. Use 'the life' only when referring to a specific person's life: 'The life of a nurse is hard.'",
  },
  {
    id: "articles-5",
    category: "Articles",
    type: "multiple-choice",
    prompt: "Choose the correct sentence.",
    options: [
      "I am student at the university.",
      "I am a student at university.",
      "I am the student at university.",
      "I am an student at university.",
    ],
    correct: 1,
    explanation:
      "You need the indefinite article 'a' before the profession ('a student', 'a teacher', 'a doctor'). British English also tends to say 'at university' (no article) when speaking generally; American English typically says 'at the university' (referring to a specific one). Either way, 'I am student' with zero article is the mistake to fix.",
  },
  {
    id: "articles-6",
    category: "Articles",
    type: "multiple-choice",
    prompt: "Choose the correct sentence.",
    options: [
      "I need the money to pay the rent.",
      "I need money to pay rent.",
      "I need a money to pay rent.",
      "I need money to pay a rent.",
    ],
    correct: 1,
    explanation:
      "Both 'money' and 'rent' are uncountable / used in a general sense here, so neither takes 'the' or 'a'. 'Money' is uncountable (no 'a money'). 'Rent' here means the general concept of monthly housing payment, not a specific amount, so no article. Compare: 'I need THE money you owe me' (specific, definite).",
  },
  {
    id: "articles-7",
    category: "Articles",
    type: "multiple-choice",
    prompt: "Choose the correct sentence.",
    options: [
      "She plays the piano since she was 5.",
      "She plays piano since she was 5.",
      "She plays a piano since she was 5.",
      "She plays an piano since she was 5.",
    ],
    correct: 0,
    explanation:
      "Musical instruments take 'the' when you talk about playing them: 'play the piano', 'play the guitar', 'play the violin'. This is a fixed pattern. The other mistake here is 'plays ... since' — it should be 'has been playing ... since' (present perfect continuous).",
  },
  {
    id: "articles-8",
    category: "Articles",
    type: "multiple-choice",
    prompt: "Choose the correct sentence.",
    options: [
      "I have the cat and two dogs.",
      "I have a cat and two dogs.",
      "I have cat and two dogs.",
      "I have an cat and two dogs.",
    ],
    correct: 1,
    explanation:
      "When you mention a pet/animal for the first time and the listener doesn't know which one, use the indefinite article 'a/an': 'a cat', 'a dog', 'an elephant'. 'The cat' implies you both already know which cat. 'Cat' with no article sounds unnatural here.",
  },

  // =====================================================================
  // PREPOSITIONS — in / on / at, for / by / with, of / to
  // =====================================================================
  {
    id: "prepositions-1",
    category: "Prepositions",
    type: "multiple-choice",
    prompt: "Choose the correct sentence.",
    options: [
      "I am interesting in music.",
      "I am interesting on music.",
      "I am interest in music.",
      "I am interesting of music.",
    ],
    correct: 0,
    explanation:
      "The collocation is 'interested IN something' (not 'on', 'of', or 'at'). The adjective is 'interested', not 'interesting': 'I am interested in music' (how I feel), 'Music is interesting' (the music itself). Don't confuse the two — they look similar but flip the perspective.",
  },
  {
    id: "prepositions-2",
    category: "Prepositions",
    type: "multiple-choice",
    prompt: "Choose the correct sentence.",
    options: [
      "I arrived to the station late.",
      "I arrived the station late.",
      "I arrived at the station late.",
      "I arrived in the station late.",
    ],
    correct: 2,
    explanation:
      "In English, 'arrive' is intransitive — it does NOT take 'to'. You 'arrive AT' a small/medium place (station, airport, office) and 'arrive IN' a city or country ('arrive in Buenos Aires'). Spanish speakers often say 'arrive to' out of habit, but it's a direct translation error.",
  },
  {
    id: "prepositions-3",
    category: "Prepositions",
    type: "multiple-choice",
    prompt: "Choose the correct sentence.",
    options: [
      "I have been working here since five years.",
      "I have been working here for five years.",
      "I have been working here five years.",
      "I have been working here from five years.",
    ],
    correct: 1,
    explanation:
      "Use 'for' + a DURATION (for five years, for three months, for a long time). Use 'since' + a STARTING POINT (since 2019, since Monday, since I was a kid). 'Since' a duration is wrong. 'From' can mean 'since' in some contexts but not with 'have been working'.",
  },
  {
    id: "prepositions-4",
    category: "Prepositions",
    type: "multiple-choice",
    prompt: "Choose the correct sentence.",
    options: [
      "I go to the gym on Monday.",
      "I go to the gym in Monday.",
      "I go to the gym at Monday.",
      "I go to the gym of Monday.",
    ],
    correct: 0,
    explanation:
      "Days take 'ON': on Monday, on Fridays, on the weekend. Months take 'IN': in March, in July. Times of day take 'AT': at 8pm, at noon, at night. This is a strict rule: ON + day, IN + month/year, AT + time.",
  },
  {
    id: "prepositions-5",
    category: "Prepositions",
    type: "multiple-choice",
    prompt: "Choose the correct sentence.",
    options: [
      "I am good in math.",
      "I am good at math.",
      "I am good on math.",
      "I am good of math.",
    ],
    correct: 1,
    explanation:
      "'Good AT + skill/activity' (good at math, good at chess, good at writing). 'Good IN + subject' is rarer and sounds slightly off. 'Good for' is for recommending something (this food is good for you). 'Good with' is for handling things or people (good with kids, good with his hands).",
  },
  {
    id: "prepositions-6",
    category: "Prepositions",
    type: "multiple-choice",
    prompt: "Choose the correct sentence.",
    options: [
      "I depend of my parents for money.",
      "I depend on my parents for money.",
      "I depend from my parents for money.",
      "I depend in my parents for money.",
    ],
    correct: 1,
    explanation:
      "'Depend ON' is the fixed collocation in English. Spanish 'depender DE' is a false-friend trap — the preposition is different. Same with 'rely ON', 'count ON', 'insist ON'. Memorize them as a chunk: depend on, rely on, count on.",
  },
  {
    id: "prepositions-7",
    category: "Prepositions",
    type: "multiple-choice",
    prompt: "Choose the correct sentence.",
    options: [
      "I go to work by bus.",
      "I go to work in bus.",
      "I go to work with bus.",
      "I go to work on bus.",
    ],
    correct: 0,
    explanation:
      "Transportation collocations: 'BY + vehicle' (by bus, by car, by train, by bike). 'ON + vehicle' ONLY for specific named services (on the 5pm train, on a plane when boarding). 'In' is for being inside something (in a car, in a taxi — walking into one). 'With' is not used here.",
  },
  {
    id: "prepositions-8",
    category: "Prepositions",
    type: "multiple-choice",
    prompt: "Choose the correct sentence.",
    options: [
      "I was born in March 15, 1995.",
      "I was born on March 15, 1995.",
      "I was born at March 15, 1995.",
      "I was born of March 15, 1995.",
    ],
    correct: 1,
    explanation:
      "Specific dates take 'ON' (on March 15th, on the 15th of March, on your birthday). Months/years/seasons take 'IN' (in March, in 1995, in winter). Times of day take 'AT' (at 3pm). Saying 'born in March 15' is the Spanish-influenced mistake — Spanish uses 'en' for everything, English splits them up.",
  },

  // =====================================================================
  // VERB TENSES — past / present / future consistency
  // =====================================================================
  {
    id: "tenses-1",
    category: "Verb tenses",
    type: "multiple-choice",
    prompt: "Choose the correct sentence.",
    options: [
      "I am living here since 2019.",
      "I live here since 2019.",
      "I have lived here since 2019.",
      "I lived here since 2019.",
    ],
    correct: 2,
    explanation:
      "An action that started in the past and CONTINUES to the present takes the present perfect: 'I have lived here since 2019' (and I still do). 'I am living' is wrong because present continuous describes temporary actions, not ongoing situations that started in the past. Spanish uses present tense here ('vivo acá desde 2019') — English does not.",
  },
  {
    id: "tenses-2",
    category: "Verb tenses",
    type: "multiple-choice",
    prompt: "Choose the correct sentence.",
    options: [
      "Yesterday I go to the cinema with my brother.",
      "Yesterday I went to the cinema with my brother.",
      "Yesterday I have gone to the cinema with my brother.",
      "Yesterday I am going to the cinema with my brother.",
    ],
    correct: 1,
    explanation:
      "'Yesterday' is a finished past time → simple past ('went'). Don't use present ('go'), present perfect ('have gone'), or present continuous ('am going') with 'yesterday'. The simple past is the workhorse tense for completed past actions.",
  },
  {
    id: "tenses-3",
    category: "Verb tenses",
    type: "multiple-choice",
    prompt: "Choose the correct sentence.",
    options: [
      "I have been to Paris last summer.",
      "I have gone to Paris last summer.",
      "I was in Paris last summer.",
      "I am in Paris last summer.",
    ],
    correct: 2,
    explanation:
      "Present perfect ('have been', 'have gone') does NOT pair with finished time expressions like 'last summer', 'yesterday', 'in 2020', 'two days ago'. For those, use simple past: 'I was in Paris last summer', 'I went to Paris last summer'. Use present perfect for unfinished time ('this week', 'lately', 'so far') or no time at all.",
  },
  {
    id: "tenses-4",
    category: "Verb tenses",
    type: "multiple-choice",
    prompt: "Choose the correct sentence.",
    options: [
      "I am knowing the answer.",
      "I know the answer.",
      "I am know the answer.",
      "I have know the answer.",
    ],
    correct: 1,
    explanation:
      "'Know' is a STATE verb — it doesn't take the continuous ('-ing') form. State verbs: know, believe, want, need, like, love, hate, own, belong, remember, understand. They describe a condition, not an action in progress. Say 'I know', 'I want', 'I understand' — never 'I am knowing', 'I am wanting'.",
  },
  {
    id: "tenses-5",
    category: "Verb tenses",
    type: "multiple-choice",
    prompt: "Choose the correct sentence.",
    options: [
      "I didn't went to the party.",
      "I didn't go to the party.",
      "I don't went to the party.",
      "I didn't gone to the party.",
    ],
    correct: 1,
    explanation:
      "After 'did' (the past-tense auxiliary used for negation and questions), the main verb stays in its BASE form: 'didn't go', 'didn't see', 'didn't know'. Never double-past: 'didn't went', 'didn't see-ed', etc. This is one of the most common errors in beginner writing.",
  },
  {
    id: "tenses-6",
    category: "Verb tenses",
    type: "multiple-choice",
    prompt: "Choose the correct sentence.",
    options: [
      "She has 25 years.",
      "She is having 25 years.",
      "She has 25 years old.",
      "She is 25 years old.",
    ],
    correct: 3,
    explanation:
      "To express age in English, use the pattern 'to be + number + years old': 'I am 28 years old', 'She is 25', 'My dog is 3'. Never 'I have 25 years' — that's a direct translation from Spanish ('tengo 25 años') and it's wrong in English. 'Have' is used for possessions, not age.",
  },
  {
    id: "tenses-7",
    category: "Verb tenses",
    type: "multiple-choice",
    prompt: "Choose the correct sentence.",
    options: [
      "When I arrived, he left.",
      "When I arrived, he was leaving.",
      "When I arrived, he has left.",
      "When I arrived, he leaves.",
    ],
    correct: 1,
    explanation:
      "Past continuous ('was leaving') describes an action IN PROGRESS at a moment in the past. The pattern 'When + past simple, past continuous' captures an action interrupting another: 'When I arrived (interrupting action), he was leaving (ongoing action)'. Using two simple pasts implies two sequential completed events, not interruption.",
  },
  {
    id: "tenses-8",
    category: "Verb tenses",
    type: "multiple-choice",
    prompt: "Choose the correct sentence.",
    options: [
      "By next year, I will finish my degree.",
      "By next year, I will have finished my degree.",
      "By next year, I finish my degree.",
      "By next year, I am finishing my degree.",
    ],
    correct: 1,
    explanation:
      "'By + future time' (by next year, by 2030, by the time you arrive) requires the FUTURE PERFECT ('will have + past participle') to show that an action will be completed before that future reference point. 'Will finish' is just the future simple, which doesn't capture the 'by-then' completion idea.",
  },
  {
    id: "tenses-9",
    category: "Verb tenses",
    type: "multiple-choice",
    prompt: "Choose the correct sentence.",
    options: [
      "I am study English for two hours every day.",
      "I study English for two hours every day.",
      "I studying English for two hours every day.",
      "I am studying English since two hours.",
    ],
    correct: 1,
    explanation:
      "Routines and habits use simple present ('I study every day', 'She works at a bank'). Present continuous ('I am studying') is for actions happening RIGHT NOW or for temporary situations. The 'for two hours' here means duration of a daily habit, so simple present is correct.",
  },

  // =====================================================================
  // WORD ORDER — adverb placement, questions, adjectives
  // =====================================================================
  {
    id: "wordorder-1",
    category: "Word order",
    type: "multiple-choice",
    prompt: "Choose the natural-sounding English sentence.",
    options: [
      "I like very much chocolate.",
      "I very much like chocolate.",
      "I like chocolate very much.",
      "I like very much the chocolate.",
    ],
    correct: 2,
    explanation:
      "In English, adverbs of intensity ('very much', 'a lot', 'really') usually go AFTER the object, not after the verb or before it. The structure is: subject + verb + object + adverb. Spanish allows 'Me gusta mucho el chocolate' (verb + adverb + object) — English does not.",
  },
  {
    id: "wordorder-2",
    category: "Word order",
    type: "multiple-choice",
    prompt: "Choose the correct sentence.",
    options: [
      "She speaks well English.",
      "She speaks English well.",
      "She well speaks English.",
      "She well English speaks.",
    ],
    correct: 1,
    explanation:
      "Pattern: subject + verb + object + manner adverb. Never put the adverb between the verb and object ('speaks well English'). The adverb of manner ('well', 'quickly', 'carefully') goes at the END of the clause. Manner-before-verb is a Spanish and German habit — English wants it last.",
  },
  {
    id: "wordorder-3",
    category: "Word order",
    type: "multiple-choice",
    prompt: "Choose the correct sentence.",
    options: [
      "I have a car black.",
      "I have a black car.",
      "I have black a car.",
      "I have car black a.",
    ],
    correct: 1,
    explanation:
      "Adjective order in English: opinion (nice, beautiful) → size (big, small) → age (old, new) → color (red, black) → origin (Argentinian) → material (wooden) → noun. 'Black' (color) goes BEFORE the noun 'car'. Spanish puts adjectives AFTER the noun ('un coche negro') — English puts them BEFORE.",
  },
  {
    id: "wordorder-4",
    category: "Word order",
    type: "multiple-choice",
    prompt: "Choose the correct sentence.",
    options: [
      "I don't know where he lives.",
      "I don't know where lives he.",
      "I don't know where does he live.",
      "I don't know he lives where.",
    ],
    correct: 0,
    explanation:
      "INDIRECT questions (questions inside a statement) keep the normal subject-verb order: 'I know where he lives', 'She asked what time it is', 'Can you tell me where the bank is?'. Direct question order ('Where does he live?') is only for direct questions. No inversion in indirect ones.",
  },
  {
    id: "wordorder-5",
    category: "Word order",
    type: "multiple-choice",
    prompt: "Choose the correct sentence.",
    options: [
      "She is a woman very intelligent.",
      "She is a very intelligent woman.",
      "She is very intelligent a woman.",
      "She very intelligent is a woman.",
    ],
    correct: 1,
    explanation:
      "Adjectives go BEFORE the noun in English: 'a very intelligent woman', 'a tall building', 'an interesting book'. Spanish allows them after: 'una mujer muy inteligente'. The English structure is 'a [adverb] [adjective] noun'.",
  },
  {
    id: "wordorder-6",
    category: "Word order",
    type: "multiple-choice",
    prompt: "Choose the correct sentence.",
    options: [
      "What does he do for living?",
      "What does he do for a living?",
      "What he does for a living?",
      "What does he for a living do?",
    ],
    correct: 1,
    explanation:
      "The idiom is 'to make a living' / 'for a LIVING' — note the article 'a' before 'living'. Forgetting the article is a super common error. The full sentence pattern is: 'What does he do for a living?' (What's his job / how does he earn money?)",
  },
  {
    id: "wordorder-7",
    category: "Word order",
    type: "multiple-choice",
    prompt: "Choose the correct sentence.",
    options: [
      "I go always to the gym in the morning.",
      "I always go to the gym in the morning.",
      "Always I go to the gym in the morning.",
      "I go to the gym always in the morning.",
    ],
    correct: 1,
    explanation:
      "Frequency adverbs (always, usually, often, sometimes, never) go BEFORE the main verb: 'I always go', 'She never eats meat', 'They often travel'. NEVER after 'to be' ('I am always' is the ONLY exception). Spanish allows them at the start ('Siempre voy') — English typically puts them mid-sentence.",
  },
  {
    id: "wordorder-8",
    category: "Word order",
    type: "multiple-choice",
    prompt: "Choose the correct sentence.",
    options: [
      "I have two brothers younger.",
      "I have two younger brothers.",
      "I have younger two brothers.",
      "I two have younger brothers.",
    ],
    correct: 1,
    explanation:
      "Number adjectives ('two', 'three', 'many') go BEFORE other adjectives: 'two younger brothers', 'three beautiful cities', 'five large boxes'. Pattern: number → opinion → size → age → color → noun. Saying 'brothers younger' (adjective after noun) is a Spanish carry-over.",
  },

  // =====================================================================
  // COMMON MISTAKES — Spanish → English false friends & false cognates
  // =====================================================================
  {
    id: "false-friends-1",
    category: "Common mistakes",
    type: "multiple-choice",
    prompt:
      "Your Argentinian friend says: 'Actualmente trabajo en una startup.' What's the correct English version?",
    options: [
      "Actually I work at a startup.",
      "Currently I work at a startup.",
      "Eventually I work at a startup.",
      "Really I work at a startup.",
    ],
    correct: 1,
    explanation:
      "'Actualmente' in Spanish means 'nowadays / at the moment', which is 'CURRENTLY' in English. 'Actually' means 'in fact / en realidad'. These are false friends — they look alike but mean different things. Same with 'eventualmente' = 'eventually' (finally), not 'possibly'.",
  },
  {
    id: "false-friends-2",
    category: "Common mistakes",
    type: "multiple-choice",
    prompt: "Choose the correct English sentence.",
    options: [
      "I realized my dream when I was 28.",
      "I carried out my dream when I was 28.",
      "I noticed my dream when I was 28.",
      "I made my dream when I was 28.",
    ],
    correct: 1,
    explanation:
      "Spanish 'realizar' means 'to carry out / to fulfill / to achieve'. English 'realize' means 'to become aware of / to understand' (darse cuenta). 'Carry out' (or 'achieve' / 'fulfill') is the right verb for 'hacer realidad'. This is a classic false friend that confuses many learners.",
  },
  {
    id: "false-friends-3",
    category: "Common mistakes",
    type: "multiple-choice",
    prompt: "Choose the correct English sentence.",
    options: [
      "I'm embarrassed — I'm pregnant!",
      "I'm pregnant — I'm constipated!",
      "I'm embarrassed — I'm constipated!",
      "I'm pregnant — I'm embarrassed!",
    ],
    correct: 3,
    explanation:
      "'Embarazada' in Spanish means 'pregnant'. 'Embarrassed' in English means 'avergonzado/a' (the feeling of shame/awkwardness). They look similar but mean totally different things. Saying 'I'm embarrassed, I'm pregnant' would confuse a native English speaker badly.",
  },
  {
    id: "false-friends-4",
    category: "Common mistakes",
    type: "multiple-choice",
    prompt: "Choose the correct English sentence.",
    options: [
      "I went to the library to buy a book.",
      "I went to the bookshop to buy a book.",
      "I went to the fabric to buy a book.",
      "I went to the carpet to buy a book.",
    ],
    correct: 1,
    explanation:
      "'Librería' in Spanish = 'bookshop / bookstore' (where you BUY books). 'Library' in English = 'biblioteca' (where you BORROW or read books). Other false friends on this list: 'fabric' = 'tela' (NOT 'fábrica' = factory); 'carpet' = 'alfombra' (NOT 'carpeta' = folder).",
  },
  {
    id: "false-friends-5",
    category: "Common mistakes",
    type: "multiple-choice",
    prompt: "Choose the correct English sentence.",
    options: [
      "My parents are coming to visit next week.",
      "My relatives are coming to visit next week.",
      "My parientes are coming to visit next week.",
      "My parentes are coming to visit next week.",
    ],
    correct: 1,
    explanation:
      "'Parientes' in Spanish = 'relatives' (the broad family — uncles, cousins, in-laws). 'Parents' in English means specifically 'mother and father' only. Don't confuse them: 'My parents live in Buenos Aires' = my mom and dad. 'My relatives live all over Argentina' = the wider family.",
  },
  {
    id: "false-friends-6",
    category: "Common mistakes",
    type: "multiple-choice",
    prompt: "Choose the correct English sentence.",
    options: [
      "Please, can you record me your number?",
      "Please, can you remember me your number?",
      "Please, can you remind me of your number?",
      "Please, can you write me your number?",
    ],
    correct: 2,
    explanation:
      "'Recordar' in Spanish can mean both 'to remember' and 'to remind'. English splits them: 'REMEMBER' = you call up a memory yourself (I remember his name). 'REMIND' = someone/something causes you to remember (Remind me of your number / This song reminds me of summer). To get someone's info, you ask them to REMIND you of it (or just 'tell me').",
  },
  {
    id: "false-friends-7",
    category: "Common mistakes",
    type: "multiple-choice",
    prompt: "Choose the correct English sentence.",
    options: [
      "The exit of the project was a disaster.",
      "The success of the project was a disaster.",
      "The success of the project was a success.",
      "The exit of the project was a success.",
    ],
    correct: 1,
    explanation:
      "'Éxito' in Spanish = 'success'. 'Exit' in English = 'salida' (a way out of a building). Don't translate 'éxito' as 'exit' — they're totally different words. Similarly, 'sane' is not 'sano' (sano = healthy). 'Exquisite' is OK for rare/delicate things; for food use 'delicious'.",
  },
  {
    id: "false-friends-8",
    category: "Common mistakes",
    type: "multiple-choice",
    prompt: "Choose the correct English sentence.",
    options: [
      "I can't support this heat anymore.",
      "I can't tolerate this heat anymore.",
      "I can't realize this heat anymore.",
      "I can't constipate this heat anymore.",
    ],
    correct: 1,
    explanation:
      "'Soportar' in Spanish = to endure / to bear. 'Support' in English = to hold up / to back up (Soportar a alguien, respaldar). 'Stand' / 'tolerate' / 'bear' are the right verbs for 'I can't take it anymore'. Common ones to memorize: 'stand the heat', 'bear the pain', 'tolerate the noise'.",
  },
  {
    id: "false-friends-9",
    category: "Common mistakes",
    type: "multiple-choice",
    prompt: "Choose the correct English sentence.",
    options: [
      "I have a large problem with this.",
      "I have a big issue with this.",
      "I have an old problem with this.",
      "I have a tall problem with this.",
    ],
    correct: 1,
    explanation:
      "'Largo' in Spanish = 'long' (length, duration). 'Large' in English = 'grande' (size, big in 2D or 3D). For problems/issues, the natural English word is 'big' or 'major', not 'large' or 'long'. Same trap: 'mayor' in Spanish often = 'older' or 'bigger', not 'major'.",
  },

  // =====================================================================
  // IDIOMS — common idiomatic expressions
  // =====================================================================
  {
    id: "idioms-1",
    category: "Idioms",
    type: "multiple-choice",
    prompt: "What does this sentence mean?\n\n'That new phone costs an arm and a leg.'",
    options: [
      "The phone is very cheap.",
      "The phone is very expensive.",
      "The phone is broken.",
      "The phone is good for your health.",
    ],
    correct: 1,
    explanation:
      "'Cost an arm and a leg' = very expensive. Imagery: if a phone cost you an arm and a leg, you'd be missing body parts — meaning you paid a huge price. Use it for anything pricey: 'The trip cost an arm and a leg', 'Law school costs an arm and a leg'.",
  },
  {
    id: "idioms-2",
    category: "Idioms",
    type: "multiple-choice",
    prompt: "Choose the natural way to wish a friend good luck before a job interview.",
    options: [
      "I hope you break a leg!",
      "I hope you hit the books!",
      "I hope you spill the beans!",
      "I hope you bite the bullet!",
    ],
    correct: 0,
    explanation:
      "'Break a leg' = good luck (especially before a performance, interview, or any big moment). It's said TO the person, never ABOUT them. The origin is theatrical: saying 'good luck' on stage is considered bad luck, so they reversed it.",
  },
  {
    id: "idioms-3",
    category: "Idioms",
    type: "multiple-choice",
    prompt: "What does 'piece of cake' mean?",
    options: [
      "Something delicious",
      "Something easy",
      "Something expensive",
      "Something confusing",
    ],
    correct: 1,
    explanation:
      "'A piece of cake' = something very easy. 'That exam was a piece of cake' = it was easy. 'Don't worry, this code change is a piece of cake' = it won't take long. The idiom comes from the idea of cakes being common, easy rewards at fairs and gatherings.",
  },
  {
    id: "idioms-4",
    category: "Idioms",
    type: "multiple-choice",
    prompt: "What does 'under the weather' mean?",
    options: [
      "Cold and rainy",
      "Feeling a little sick",
      "Outdoors a lot",
      "In a good mood",
    ],
    correct: 1,
    explanation:
      "'Under the weather' = feeling a bit sick, not at 100%. 'I'm feeling a bit under the weather today' = I have a cold or just feel off. Origin: sailors who felt seasick would go below deck, 'under the weather'.",
  },
  {
    id: "idioms-5",
    category: "Idioms",
    type: "multiple-choice",
    prompt: "What does 'hit the books' mean?",
    options: [
      "Punch your textbooks out of anger",
      "Study hard",
      "Sell your books",
      "Lose your books",
    ],
    correct: 1,
    explanation:
      "'Hit the books' = to study intensively. 'I have an exam tomorrow, I need to hit the books tonight'. It doesn't mean physically hitting them — 'hit' here means 'get into / tackle' (like 'hit the gym').",
  },
  {
    id: "idioms-6",
    category: "Idioms",
    type: "multiple-choice",
    prompt: "What does 'once in a blue moon' mean?",
    options: [
      "On nights with a full moon",
      "Very rarely",
      "At midnight",
      "During a lunar eclipse",
    ],
    correct: 1,
    explanation:
      "'Once in a blue moon' = very rarely / hardly ever. 'We go out to dinner once in a blue moon' = we almost never do. Origin: a 'blue moon' is the rare second full moon in a calendar month — astronomically uncommon.",
  },
  {
    id: "idioms-7",
    category: "Idioms",
    type: "multiple-choice",
    prompt: "What does 'spill the beans' mean?",
    options: [
      "Make a mess while cooking",
      "Reveal a secret",
      "Lose your balance",
      "Plant a garden",
    ],
    correct: 1,
    explanation:
      "'Spill the beans' = tell a secret before it's supposed to be told. 'Don't spill the beans about the surprise party!' Origin: ancient Greece, where beans were used to vote secretly — spilling them revealed the votes early.",
  },
  {
    id: "idioms-8",
    category: "Idioms",
    type: "multiple-choice",
    prompt: "What does 'bite the bullet' mean?",
    options: [
      "To eat something dangerous",
      "To accept something unpleasant and just do it",
      "To complain a lot",
      "To make a mistake",
    ],
    correct: 1,
    explanation:
      "'Bite the bullet' = accept something painful or unpleasant and do it anyway. 'I'll bite the bullet and ask my boss for a raise.' Origin: 19th-century patients biting a bullet to distract from the pain of surgery without anesthesia.",
  },
  {
    id: "idioms-9",
    category: "Idioms",
    type: "multiple-choice",
    prompt: "What does 'beat around the bush' mean?",
    options: [
      "Hit plants while gardening",
      "Avoid saying what you really mean",
      "Go hiking in the forest",
      "Travel to remote places",
    ],
    correct: 1,
    explanation:
      "'Beat around the bush' = avoid the main topic, talk around it without getting to the point. 'Stop beating around the bush and tell me what you want.' Origin: medieval hunting, where beaters would tap bushes to flush out birds, not hit them directly.",
  },

  // =====================================================================
  // FREE-WRITE PROMPTS — task cards, AI grades
  // =====================================================================
  {
    id: "freewrite-1",
    category: "Articles",
    type: "free-write",
    prompt:
      "Write one sentence using the words 'university' and 'study' correctly. Your sentence should mention where you go to study and what you study there.",
    options: [],
    correct: null,
    explanation:
      "Model answer: 'I am a student at the university, where I study computer science.' Coaching: in British English 'at university' (no article) is common; American English prefers 'at the university'. Either is correct — what's wrong is 'I am student' (missing 'a').",
  },
  {
    id: "freewrite-2",
    category: "Prepositions",
    type: "free-write",
    prompt:
      "Write one sentence that says you have been living in your city for at least three years. Use the correct preposition for duration.",
    options: [],
    correct: null,
    explanation:
      "Model answer: 'I have been living in Buenos Aires for four years.' (OR: 'I have lived in Buenos Aires for four years.') Coaching: 'for' goes with a duration (for four years), 'since' goes with a starting point (since 2022). Don't say 'since four years' — that mix is the most common error.",
  },
  {
    id: "freewrite-3",
    category: "Verb tenses",
    type: "free-write",
    prompt:
      "Write one sentence about something you did yesterday afternoon. Use the simple past tense correctly.",
    options: [],
    correct: null,
    explanation:
      "Model answer: 'Yesterday afternoon I played football with my friends and then I cooked dinner.' Coaching: 'Yesterday' + simple past (played, cooked, studied, went). Avoid 'I have played', 'I am playing', 'I play' — they all break the rule for a finished past time.",
  },
  {
    id: "freewrite-4",
    category: "Verb tenses",
    type: "free-write",
    prompt:
      "Write one sentence about a habit you have had for many years. Use the present perfect correctly.",
    options: [],
    correct: null,
    explanation:
      "Model answer: 'I have played the guitar for ten years.' Coaching: present perfect = 'have/has + past participle' (have played, have lived, have studied). Pair with 'for + duration' or 'since + start time'. Don't use it with 'yesterday' or 'last year' — those need simple past.",
  },
  {
    id: "freewrite-5",
    category: "Common mistakes",
    type: "free-write",
    prompt:
      "Write one sentence that uses the word 'actually' correctly — meaning 'in fact', not as a translation of 'actualmente' (which means 'currently').",
    options: [],
    correct: null,
    explanation:
      "Model answer: 'I thought the meeting was at 5, but actually it was at 6.' Coaching: 'actually' = 'in fact / en realidad' (a surprise or correction). 'Currently' = 'nowadays / en este momento' (the time). Don't swap them — Spanish speakers often do.",
  },
  {
    id: "freewrite-6",
    category: "Idioms",
    type: "free-write",
    prompt:
      "Write one sentence that uses the idiom 'piece of cake' naturally. It should describe something easy (a task, a test, a recipe — your choice).",
    options: [],
    correct: null,
    explanation:
      "Model answer: 'The exam was a piece of cake — I finished in twenty minutes.' Coaching: pattern is 'X is/was a piece of cake'. Use it for anything that feels easy. Don't say 'a piece of cake' to mean 'a slice of dessert' — that is a different use.",
  },
  {
    id: "freewrite-7",
    category: "Word order",
    type: "free-write",
    prompt:
      "Write one sentence using the adverb 'always' and a daily habit. Make sure the word order is natural in English.",
    options: [],
    correct: null,
    explanation:
      "Model answer: 'I always drink coffee in the morning.' Coaching: frequency adverbs (always, usually, often, sometimes, never) go BEFORE the main verb. 'Always I drink' is Spanish order — English wants it mid-sentence.",
  },
  {
    id: "freewrite-8",
    category: "Prepositions",
    type: "free-write",
    prompt:
      "Write one sentence saying you're good at something (a skill or activity). Use the right preposition.",
    options: [],
    correct: null,
    explanation:
      "Model answer: 'I am good at chess but I'm bad at cooking.' Coaching: 'good AT + skill' (good at math, good at tennis). 'Good IN' is rare. 'Good for' is for recommendations. 'Good with' is for handling things or people.",
  },
  {
    id: "freewrite-9",
    category: "Common mistakes",
    type: "free-write",
    prompt:
      "Write one sentence using the verb 'achieve' or 'carry out' correctly — for fulfilling a goal, NOT 'realize' (which means 'become aware of' in English).",
    options: [],
    correct: null,
    explanation:
      "Model answer: 'I worked hard to achieve my goal of learning English.' Coaching: 'realizar' (Spanish) = 'achieve / carry out / fulfill' (English). English 'realize' = 'darse cuenta'. So 'I realized I was wrong' is correct; 'I realized my dream' is not.",
  },
];

// Build categories list with counts so the UI can show "Articles (8)".
const CATEGORIES = [
  "Articles",
  "Prepositions",
  "Verb tenses",
  "Word order",
  "Common mistakes",
  "Idioms",
];

module.exports = { QUESTIONS, CATEGORIES };
