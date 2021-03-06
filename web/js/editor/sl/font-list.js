'use strict';

const fontList = {
    "fonts":[
        {"name":"Merck", "url":"/fonts/merck-webfont", "size":"0.048828125"},
        {"name":"FuturaStd-CondensedLight", "url":"/fonts/FuturaStd-CondensedLight", "size":"0.025390625"},
        {"name":"ProximaNova", "url":"/fonts/proximanova-regular-webfont", "size":"0.091796875"},
        {"name":"ProximaNovaBold", "url":"/fonts/proximanova-bold-webfont", "size":"0.3134765625"},
        {"name":"ProximaNovaSemibold", "url":"/fonts/proximanova-semibold-webfont", "size":"0.08984375"},
        {"name":"MerckPro", "url":"/fonts/MerckSansSerifPro", "size":"0.0458984375"},
        {"name":"MerckBold", "url":"/fonts/MerckSansSerifPro-Bold", "size":"0.0458984375"},
        {"name":"Montserrat", "url":"/fonts/Montserrat-Regular", "size":"0.0908203125"},
        {"name":"OpenSans", "url":"/fonts/opensans-regular-webfont", "size":"0.0439453125"},
        {"name":"Asul", "url":"/fonts/asul-regular", "size":"0.0126953125"},
        {"name":"JosefinSans", "url":"/fonts/JosefinSans-Regular", "size":"0.091796875"},
        {"name":"LeagueGothic", "url":"/fonts/LeagueGothic-Regular", "size":"0.0234375"},
        {"name":"MerriweatherSans", "url":"/fonts/MerriweatherSans-Regular", "size":"0.0380859375"},
        {"name":"Overpass", "url":"/fonts/overpass-regular", "size":"0.0673828125"},
        {"name":"CabinSketch", "url":"/fonts/cabinsketch-regular", "size":"0.080078125"},
        {"name":"NewsCycle", "url":"/fonts/NewsCycle-Regular", "size":"0.375"},
        {"name":"RajdhaniBold", "url": "/fonts/Rajdhani-Bold", "size": "0.3916015625"},
        {"name":"RajdhaniLight", "url": "/fonts/rajdhani-light-webfont", "size": "0.04296875"},
        {"name":"RajdhaniMedium", "url": "/fonts/rajdhani-medium-webfont", "size": "0.04296875"},
        {"name":"RajdhaniRegular", "url": "/fonts/Rajdhani-Regular", "size": "0.369140625"},
        {"name":"RajdhaniSemiBold", "url": "/fonts/Rajdhani-Semibold", "size": "0.380859375"},
        {"name":"futuraBdCn", "url": "/fonts/futurabdcn", "size": "0.04296875"},
        {"name":"futuraBlackBold", "url": "/fonts/futurablackbold", "size": "0.04296875"},
        {"name":"futuraBold", "url": "/fonts/futurabold", "size": "0.0439453125"},
        {"name":"futuraBoldItalic", "url": "/fonts/futuraBoldItalic", "size": "0.0478515625"},
        {"name":"futuraBook", "url": "/fonts/futuraBook", "size": "0.0419921875"},
        {"name":"futuraBookItalic", "url": "/fonts/futuraBookItalic", "size": "0.048828125"},
        {"name":"futuraExtraBlack", "url": "/fonts/futuraExtraBlack", "size": "0.0419921875"},
        {"name":"futuraExtrablackItalic", "url": "/fonts/futuraExtrablackItalic", "size": "0.0458984375"},
        {"name":"futuraHeavy", "url": "/fonts/futuraHeavy", "size": "0.0419921875"},
        {"name":"futuraHeavyItalic", "url": "/fonts/futuraHeavyItalic", "size": "0.048828125"},
        {"name":"futuraLightBt", "url": "/fonts/futuraLightBt", "size": "0.0419921875"},
        {"name":"futuraLightItalic", "url": "/fonts/futuraLightItalic", "size": "0.0498046875"},
        {"name":"futuraLtCnLight", "url": "/fonts/futuraLtCnLight", "size": "0.0419921875"},
        {"name":"futuramediumBt", "url": "/fonts/futuramediumBt", "size": "0.0419921875"},
        {"name":"futuraMediumItalic", "url": "/fonts/futuraMediumItalic", "size": "0.0478515625"},
        {"name":"futuraMediumMdCn", "url": "/fonts/futuraMediumMdCn", "size": "0.0419921875"},
        {"name":"GilroyBold", "url": "/fonts/GilroyBold", "size": "0.0888671875"},
        {"name":"GilroyBoldItalic", "url": "/fonts/GilroyBoldItalic", "size": "0.0927734375"},
        {"name":"GilroyLight", "url": "/fonts/GilroyLight", "size": "0.0830078125"},
        {"name":"GilroyLightItalic", "url": "/fonts/GilroyLightItalic", "size": "0.087890625"},
        {"name":"GilroyMedium", "url": "/fonts/GilroyMedium", "size": "0.0859375"},
        {"name":"GilroyMediumItalic", "url": "/fonts/GilroyMediumItalic", "size": "0.0908203125"},
        {"name":"GilroyRegular", "url": "/fonts/GilroyRegular", "size": "0.0830078125"},
        {"name":"GilroyRegularItalic", "url": "/fonts/GilroyRegularItalic", "size": "0.0888671875"},
        {"name":"GilroySemiBold", "url": "/fonts/GilroySemiBold", "size": "0.0869140625"},
        {"name":"GilroySemiBoldItalic", "url": "/fonts/GilroySemiBoldItalic", "size": "0.091796875"},
        {"name":"FuturaBTMediumItalic", "url": "/fonts/FuturaBTMediumItalic", "size": "0.068359375"},
        {"name":"FuturaBTCondMedium", "url": "/fonts/FuturaBTCondMedium", "size": "0.06640625"},
        {"name":"FuturaBTMedium", "url": "/fonts/FuturaBTMedium", "size": "0.0625"},
        {"name":"SignPainterHouse", "url": "/fonts/signPainter", "size": "0.095703125"},
        {"name":"EagleBook", "url": "/fonts/EagleBook", "size": "0.0439453125"},
        {"name":"UniversLTStdBoldCn", "url": "/fonts/UniversLTStdBoldCn", "size": "0.0283203125"},
        {"name":"WhitneyBold", "url": "/fonts/WhitneyBold", "size": "0.10546875"},
        {"name":"WhitneyBoldItalic", "url": "/fonts/WhitneyBoldItalic", "size": "0.1083984375"},
        {"name":"WhitneyBook", "url": "/fonts/WhitneyBook", "size": "0.1064453125"},
        {"name":"WhitneyBookItalic", "url": "/fonts/WhitneyBookItalic", "size": "0.1103515625"},
        {"name":"WhitneyMedium", "url": "/fonts/WhitneyMedium", "size": "0.109375"},
        {"name":"WhitneyMediumItalic", "url": "/fonts/WhitneyMediumItalic", "size": "0.109375"},
        {"name":"WhitneySemiblod", "url": "/fonts/WhitneySemiblod", "size": "0.10546875"},
        {"name":"WhitneySemiboldItalic", "url": "/fonts/WhitneySemiboldItalic", "size": "0.109375"},
        {"name": "Quicksand", "url":"/fonts/Quicksand-Regular", "size":"0.048828125"}
    ]
};

module.exports = fontList;