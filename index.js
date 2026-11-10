
'use strict';

const { Telegraf, Markup } = require('telegraf');
const fs = require('fs');
const path = require('path');

// ==========================================
// ASHTARAKBD TELEGRAM BOT
// Version: 1.0.0
// Languages: Armenian / English / Russian
// ==========================================

// BOT CONFIGURATION

const BOT_TOKEN = process.env.BOT_TOKEN;

const GROUP_LINK = 'https://t.me/ashtarakbd';

const GROUP_NAME = 'AshtarakBD';

if (!BOT_TOKEN) {
    console.error('ERROR: BOT_TOKEN is missing!');
    process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);

// ==========================================
// DATABASE
// ==========================================

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'users.json');

if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

let database = {
    users: {},
    referrals: {}
};

try {
    if (fs.existsSync(DB_FILE)) {
        database = JSON.parse(
            fs.readFileSync(DB_FILE, 'utf8')
        );
    }
} catch (error) {
    console.error('Database error:', error.message);
}

function saveDatabase() {
    try {
        const tempFile = DB_FILE + '.tmp';

        fs.writeFileSync(
            tempFile,
            JSON.stringify(database, null, 2)
        );

        fs.renameSync(tempFile, DB_FILE);
    } catch (error) {
        console.error('Database save error:', error.message);
    }
}

// ==========================================
// LANGUAGES
// ==========================================

const translations = {

    hy: {

        choose: '🌍 Ընտրեք բոտի լեզուն:',

        welcome: `
🏙️ <b>Բարի գալուստ AshtarakBD:</b>

Աշտարակ քաղաքի հայտարարությունների միասնական հարթակ։

Այստեղ կարող եք գտնել հետաքրքիր հայտարարություններ, առաջարկներ և օգտակար տեղեկություններ՝ կապված Աշտարակի հետ։

📢 <b>Միացե՛ք մեր Telegram խմբին։</b>

Խմբում կարող եք՝

🏠 Տեղադրել անշարժ գույքի հայտարարություններ։
🚗 Գնել կամ վաճառել ավտոմեքենաներ։
💼 Գտնել կամ առաջարկել աշխատանք։
🛍️ Գնել և վաճառել տարբեր ապրանքներ։
🔧 Առաջարկել ծառայություններ։
📣 Տեղադրել նաև այլ օգտակար հայտարարություններ։

👥 Միացեք, որպեսզի կարողանաք և՛ տեսնել մյուսների հայտարարությունները, և՛ ավելացնել ձերը։

<b>AshtarakBD — Աշտարակի հայտարարությունները մեկ վայրում։</b>
`,

        join: '👥 Միանալ խմբին',

        view: '📢 Դիտել հայտարարությունները',

        add: '➕ Ինչպե՞ս ավելացնել հայտարարություն',

        about: 'ℹ️ Մեր մասին',

        language: '🌍 Փոխել լեզուն',

        share: '📤 Տարածել ընկերների հետ',

        help: '❓ Օգնություն',

        back: '⬅️ Գլխավոր մենյու',

        addText: `
➕ <b>Ինչպե՞ս ավելացնել հայտարարություն</b>

1️⃣ Սեղմեք «Միանալ խմբին»։
2️⃣ Միանալուց հետո բացեք մեր խումբը։
3️⃣ Տեղադրեք ձեր հայտարարությունը խմբում։

📸 Ցանկալի է ավելացնել որակյալ լուսանկարներ։

📝 Հայտարարությունը պետք է լինի հասկանալի և պարունակի անհրաժեշտ տեղեկությունները՝ գին, նկարագրություն և կապի միջոց։

⚠️ Խնդրում ենք չտեղադրել կեղծ, խաբուսիկ կամ արգելված հայտարարություններ։
`,

        aboutText: `
🏙️ <b>AshtarakBD</b>

AshtarakBD-ը Աշտարակ քաղաքի հայտարարությունների Telegram հարթակն է։

Մեր նպատակն է մեկ վայրում միավորել Աշտարակի բնակիչներին, գնորդներին, վաճառողներին, աշխատանք փնտրողներին և ծառայություններ առաջարկողներին։

Այստեղ կարող եք հրապարակել տարբեր բնույթի հայտարարություններ և ծանոթանալ մյուս օգտատերերի առաջարկներին։

📍 Աշտարակ, Հայաստան։

🌐 Telegram՝ @ashtarakbd
`,

        rules: `
⚠️ <b>ԿԱՐԵՎՈՐ ԾԱՆՈՒՑՈՒՄ</b>

Հայտարարությունների միջոցով կատարվող գործարքների ժամանակ զգույշ եղեք։

Մինչև որևէ գործարք կատարելը ստուգեք տեղեկությունները, անձը և առաջարկի հավաստիությունը։

Գործարքների, վճարումների, ապրանքների և ծառայությունների հետ կապված ամբողջ պատասխանատվությունը կրում են անմիջականորեն գործարքի մասնակիցները։

AshtarakBD խումբը և բոտը չեն հանդիսանում գործարքների կողմ և պատասխանատվություն չեն կրում մասնակիցների միջև առաջացած խնդիրների, վնասների կամ վեճերի համար։
`,

        shareText: '🏙️ Աշտարակի հայտարարությունների հարթակ։ Միացե՛ք AshtarakBD խմբին և հրապարակեք ձեր հայտարարությունները։',

        joined: 'Շնորհակալություն։ Միացեք մեր խմբին և բաց մի թողեք նոր հայտարարությունները։',

        unknown: 'Խնդրում եմ ընտրեք առաջարկվող բաժիններից մեկը։',

        stats: '👥 Բոտի օգտատերեր՝',

        groupWelcome: '👋 Բարի գալուստ AshtarakBD։ Այստեղ կարող եք տեսնել և հրապարակել Աշտարակ քաղաքի հայտարարությունները։'
    },

    en: {

        choose: '🌍 Please choose your language:',

        welcome: `
🏙️ <b>Welcome to AshtarakBD!</b>

The community classifieds platform for Ashtarak city, Armenia.

Discover local offers, services, opportunities and useful announcements.

📢 <b>Join our Telegram group!</b>

You can:

🏠 Post real estate listings.
🚗 Buy or sell vehicles.
💼 Find or offer jobs.
🛍️ Buy and sell products.
🔧 Advertise your services.
📣 Share other useful local announcements.

👥 Join our community to browse existing listings and publish your own announcements.

<b>AshtarakBD — Your local classifieds community.</b>
`,

        join: '👥 Join the group',

        view: '📢 Browse announcements',

        add: '➕ How to post an announcement',

        about: 'ℹ️ About us',

        language: '🌍 Change language',

        share: '📤 Share with friends',

        help: '❓ Help',

        back: '⬅️ Main menu',

        addText: `
➕ <b>How to post an announcement</b>

1️⃣ Click the Join the group button.
2️⃣ Open our Telegram group.
3️⃣ Publish your announcement.

📸 Add clear and relevant photos whenever possible.

📝 Include an informative description, price and contact details.

⚠️ Fake, misleading or prohibited announcements are not allowed.
`,

        aboutText: `
🏙️ <b>About AshtarakBD</b>

AshtarakBD is a Telegram classifieds community dedicated to Ashtarak, Armenia.

Our goal is to connect local residents, buyers, sellers, job seekers and service providers.

Discover local opportunities and share your own announcements.

📍 Ashtarak, Armenia.

🌐 Telegram: @ashtarakbd
`,

        rules: `
⚠️ <b>IMPORTANT DISCLAIMER</b>

Please exercise caution before entering into any transaction.

Always verify the information, the identity of the other party and the legitimacy of an offer.

All responsibility for transactions, payments, products and services lies solely with the individuals directly involved.

The AshtarakBD group and bot are not parties to private transactions and accept no responsibility for disputes, losses or damages arising between participants.
`,

        shareText: '🏙️ Discover AshtarakBD, the local classifieds community for Ashtarak, Armenia. Join us and share your announcements!',

        joined: 'Thank you! Join our group and discover local announcements.',

        unknown: 'Please choose one of the available options.',

        stats: '👥 Bot users:',

        groupWelcome: '👋 Welcome to AshtarakBD! Discover and publish local announcements.'
    },

    ru: {

        choose: '🌍 Пожалуйста, выберите язык:',

        welcome: `
🏙️ <b>Добро пожаловать в AshtarakBD!</b>

Единая платформа объявлений города Аштарак, Армения.

Здесь вы можете находить интересные предложения, услуги и полезные объявления.

📢 <b>Присоединяйтесь к нашей Telegram-группе!</b>

В группе вы можете:

🏠 Размещать объявления о недвижимости.
🚗 Покупать и продавать автомобили.
💼 Находить работу или предлагать вакансии.
🛍️ Покупать и продавать товары.
🔧 Предлагать свои услуги.
📣 Публиковать другие полезные объявления.

👥 Присоединяйтесь, чтобы просматривать объявления и размещать собственные.

<b>AshtarakBD — объявления города Аштарак в одном месте.</b>
`,

        join: '👥 Вступить в группу',

        view: '📢 Смотреть объявления',

        add: '➕ Как добавить объявление',

        about: 'ℹ️ О нас',

        language: '🌍 Изменить язык',

        share: '📤 Поделиться с друзьями',

        help: '❓ Помощь',

        back: '⬅️ Главное меню',

        addText: `
➕ <b>Как разместить объявление</b>

1️⃣ Нажмите кнопку «Вступить в группу».
2️⃣ Откройте нашу Telegram-группу.
3️⃣ Опубликуйте своё объявление.

📸 По возможности добавляйте качественные фотографии.

📝 Указывайте подробное описание, цену и контактную информацию.

⚠️ Запрещены ложные, вводящие в заблуждение и запрещённые объявления.
`,

        aboutText: `
🏙️ <b>О проекте AshtarakBD</b>

AshtarakBD — Telegram-сообщество объявлений города Аштарак, Армения.

Наша цель — объединить жителей города, покупателей, продавцов, соискателей и поставщиков услуг.

Публикуйте свои объявления и находите интересные предложения.

📍 Аштарак, Армения.

🌐 Telegram: @ashtarakbd
`,

        rules: `
⚠️ <b>ВАЖНОЕ ПРЕДУПРЕЖДЕНИЕ</b>

Будьте внимательны перед совершением любых сделок.

Проверяйте информацию, личность второй стороны и достоверность предложений.

Всю ответственность за сделки, платежи, товары и услуги несут исключительно непосредственные участники сделки.

Группа и бот AshtarakBD не являются сторонами частных сделок и не несут ответственности за споры, убытки или ущерб, возникшие между участниками.
`,

        shareText: '🏙️ Присоединяйтесь к AshtarakBD — платформе объявлений города Аштарак. Публикуйте свои объявления и находите интересные предложения!',

        joined: 'Спасибо! Присоединяйтесь к нашей группе и следите за новыми объявлениями.',

        unknown: 'Пожалуйста, выберите один из доступных разделов.',

        stats: '👥 Пользователи бота:',

        groupWelcome: '👋 Добро пожаловать в AshtarakBD! Здесь можно просматривать и публиковать объявления города.'
    }

};

// ==========================================
// USER LANGUAGE
// ==========================================

function getLanguage(ctx) {

    const id = String(ctx.from?.id || '');

    return database.users[id]?.language || 'hy';
}

function saveUser(ctx, language) {

    if (!ctx.from) return;

    const id = String(ctx.from.id);

    if (!database.users[id]) {
        database.users[id] = {
            language: language || 'hy',
            firstName: ctx.from.first_name || '',
            username: ctx.from.username || '',
            joinedAt: new Date().toISOString()
        };
    } else {

        if (language) {
            database.users[id].language = language;
        }

        database.users[id].firstName = ctx.from.first_name || '';
        database.users[id].username = ctx.from.username || '';
    }

    saveDatabase();
}

// ==========================================
// KEYBOARDS
// ==========================================

function languageKeyboard() {

    return Markup.inlineKeyboard([

        [
            Markup.button.callback('🇦🇲 Հայերեն', 'lang_hy'),
            Markup.button.callback('🇬🇧 English', 'lang_en')
        ],

        [
            Markup.button.callback('🇷🇺 Русский', 'lang_ru')
        ]

    ]);
}

function mainKeyboard(lang) {

    const t = translations[lang];

    return Markup.inlineKeyboard([

        [
            Markup.button.url(t.join, GROUP_LINK)
        ],

        [
            Markup.button.url(t.view, GROUP_LINK)
        ],

        [
            Markup.button.callback(t.add, 'menu_add')
        ],

        [
            Markup.button.callback(t.about, 'menu_about')
        ],

        [
            Markup.button.callback(t.rules, 'menu_rules')
        ],

        [
            Markup.button.callback(t.share, 'menu_share')
        ],

        [
            Markup.button.callback(t.language, 'menu_language')
        ]

    ]);
}

function backKeyboard(lang) {

    return Markup.inlineKeyboard([

        [
            Markup.button.callback(
                translations[lang].back,
                'menu_home'
            )
        ],

        [
            Markup.button.url(
                translations[lang].join,
                GROUP_LINK
            )
        ]

    ]);
}

// ==========================================
// START COMMAND
// ==========================================

bot.start(async (ctx) => {

    const id = String(ctx.from.id);

    const payload = ctx.message?.text?.split(/\s+/)[1] || '';

    // Referral tracking

    if (
        payload.startsWith('ref_') &&
        payload !== `ref_${id}` &&
        !database.users[id]
    ) {

        const referrer = payload.substring(4);

        database.referrals[referrer] =
            (database.referrals[referrer] || 0) + 1;
    }

    const isNew = !database.users[id];

    saveUser(ctx);

    const lang = getLanguage(ctx);

    if (isNew || !database.users[id].language) {

        await ctx.reply(
            translations.hy.choose,
            languageKeyboard()
        );

        return;
    }

    await ctx.reply(
        translations[lang].welcome,
        {
            parse_mode: 'HTML',
            ...mainKeyboard(lang)
        }
    );

});

// ==========================================
// LANGUAGE SELECTION
// ==========================================

bot.action(/^lang_(hy|en|ru)$/, async (ctx) => {

    const lang = ctx.match[1];

    saveUser(ctx, lang);

    await ctx.answerCbQuery('Language updated!');

    await ctx.editMessageText(
        translations[lang].welcome,
        {
            parse_mode: 'HTML',
            ...mainKeyboard(lang)
        }
    );

});

// ==========================================
// MAIN MENU
// ==========================================

bot.action('menu_home', async (ctx) => {

    const lang = getLanguage(ctx);

    await ctx.answerCbQuery();

    await ctx.editMessageText(
        translations[lang].welcome,
        {
            parse_mode: 'HTML',
            ...mainKeyboard(lang)
        }
    );

});

// ==========================================
// ADD ANNOUNCEMENT
// ==========================================

bot.action('menu_add', async (ctx) => {

    const lang = getLanguage(ctx);

    await ctx.answerCbQuery();

    await ctx.editMessageText(
        translations[lang].addText,
        {
            parse_mode: 'HTML',
            ...backKeyboard(lang)
        }
    );

});

// ==========================================
// ABOUT
// ==========================================

bot.action('menu_about', async (ctx) => {

    const lang = getLanguage(ctx);

    await ctx.answerCbQuery();

    await ctx.editMessageText(
        translations[lang].aboutText,
        {
            parse_mode: 'HTML',
            ...backKeyboard(lang)
        }
    );

});

// ==========================================
// DISCLAIMER
// ==========================================

bot.action('menu_rules', async (ctx) => {

    const lang = getLanguage(ctx);

    await ctx.answerCbQuery();

    await ctx.editMessageText(
        translations[lang].rules,
        {
            parse_mode: 'HTML',
            ...backKeyboard(lang)
        }
    );

});

// ==========================================
// SHARE
// ==========================================

bot.action('menu_share', async (ctx) => {

    const lang = getLanguage(ctx);

    const text = translations[lang].shareText;

    const shareURL =
        'https://t.me/share/url?url=' +
        encodeURIComponent(GROUP_LINK) +
        '&text=' +
        encodeURIComponent(text);

    await ctx.answerCbQuery();

    await ctx.reply(
        text,
        {
            reply_markup: {
                inline_keyboard: [
                    [
                        Markup.button.url(
                            translations[lang].share,
                            shareURL
                        )
                    ],
                    [
                        Markup.button.url(
                            translations[lang].join,
                            GROUP_LINK
                        )
                    ]
                ]
            }
        }
    );

});

// ==========================================
// LANGUAGE MENU
// ==========================================

bot.action('menu_language', async (ctx) => {

    const lang = getLanguage(ctx);

    await ctx.answerCbQuery();

    await ctx.reply(
        translations[lang].choose,
        languageKeyboard()
    );

});

// ==========================================
// COMMANDS
// ==========================================

bot.command('language', async (ctx) => {

    const lang = getLanguage(ctx);

    await ctx.reply(
        translations[lang].choose,
        languageKeyboard()
    );

});

bot.command('join', async (ctx) => {

    const lang = getLanguage(ctx);

    await ctx.reply(
        translations[lang].joined,
        Markup.inlineKeyboard([
            [
                Markup.button.url(
                    translations[lang].join,
                    GROUP_LINK
                )
            ]
        ])
    );

});

bot.command('about', async (ctx) => {

    const lang = getLanguage(ctx);

    await ctx.reply(
        translations[lang].aboutText,
        { parse_mode: 'HTML' }
    );

});

bot.command('rules', async (ctx) => {

    const lang = getLanguage(ctx);

    await ctx.reply(
        translations[lang].rules,
        { parse_mode: 'HTML' }
    );

});

bot.command('help', async (ctx) => {

    const lang = getLanguage(ctx);

    await ctx.reply(
        translations[lang].welcome,
        {
            parse_mode: 'HTML',
            ...mainKeyboard(lang)
        }
    );

});

// ==========================================
// ADMIN STATISTICS
// Set ADMIN_ID in hosting environment.
// ==========================================

bot.command('stats', async (ctx) => {

    const adminId = process.env.ADMIN_ID;

    if (!adminId || String(ctx.from.id) !== String(adminId)) {
        return;
    }

    const totalUsers = Object.keys(database.users).length;

    const totalReferrals = Object.values(
        database.referrals
    ).reduce((sum, value) => sum + value, 0);

    await ctx.reply(
        `📊 <b>ASHTARAKBD STATISTICS</b>\n\n` +
        `👥 Total bot users: ${totalUsers}\n` +
        `📨 Referred users: ${totalReferrals}`,
        { parse_mode: 'HTML' }
    );

});

// ==========================================
// GROUP WELCOME
// Add the bot to the Telegram group.
// ==========================================

bot.on('new_chat_members', async (ctx) => {

    const members = ctx.message.new_chat_members || [];

    for (const member of members) {

        if (member.is_bot) continue;

        await ctx.reply(
            `👋 Welcome to AshtarakBD!\n\n` +
            `🏙️ Discover and publish announcements from Ashtarak.\n\n` +
            `📢 Group: ${GROUP_LINK}`
        );
    }

});

// ==========================================
// UNKNOWN MESSAGES
// ==========================================

bot.on('text', async (ctx) => {

    if (ctx.chat.type !== 'private') return;

    const lang = getLanguage(ctx);

    await ctx.reply(
        translations[lang].unknown,
        mainKeyboard(lang)
    );

});

// ==========================================
// ERROR HANDLING
// ==========================================

bot.catch((error, ctx) => {

    console.error(
        'Bot error:',
        error.message
    );

});

// ==========================================
// START BOT
// ==========================================

async function startBot() {

    try {

        await bot.launch({
            dropPendingUpdates: true
        });

        console.log('================================');
        console.log(' ASHTARAKBD BOT STARTED');
        console.log(' Status: ONLINE');
        console.log(' Languages: HY / EN / RU');
        console.log('================================');

    } catch (error) {

        console.error(
            'Bot startup error:',
            error.message
        );

        process.exit(1);

    }

}

startBot();

// ==========================================
// GRACEFUL SHUTDOWN
// ==========================================

process.once('SIGINT', () => bot.stop('SIGINT'));

process.once('SIGTERM', () => bot.stop('SIGTERM'));
