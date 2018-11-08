/**
 * @license Copyright (c) 2003-2016, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */
/*
CKEDITOR.editorConfig = function (config) {
    // Define changes to default configuration here.
    // For complete reference see:
    // http://docs.ckeditor.com/#!/api/CKEDITOR.config

    // The toolbar groups arrangement, optimized for two toolbar rows.
    config.toolbarGroups = [
        {name: "clipboard", groups: ["clipboard", "undo"]},
        {name: "editing", groups: ["find", "selection", "spellchecker"]},
        {name: "links"},
        {name: "insert"},
        {name: "forms"},
        {name: "tools"},
        {name: "document", groups: ["mode", "document", "doctools"]},
        {name: "others"},
        "/",
        {name: "basicstyles", groups: ["basicstyles", "cleanup"]},
        {name: "paragraph", groups: ["list", "indent", "blocks", "align", "bidi"]},
        {name: "styles"},
        {name: "colors"},
        {name: "about"},
        {name: "screen"}
    ];

    // Remove some buttons provided by the standard plugins, which are
    // not needed in the Standard(s) toolbar.
    config.removeButtons = "Underline,Subscript,Superscript";

    // Set the most common block elements.
    config.format_tags = "p;h1;h2;h3;pre";

    // Simplify the dialog windows.
    config.removeDialogTabs = "image:advanced;link:advanced";
    CKEDITOR.config.extraAllowedContent = "span {*}(*)";
    config.extraPlugins = "ondestroy";
    config.extraPlugins = "screen";
};
*/

if (TWIG.urlBase.indexOf("merck") == -1) {
    /**CONFIG GLOBAL CKEDITOR**/
    CKEDITOR.editorConfig = function (config) {
        // Define changes to default configuration here:
        config.fontSize_sizes = '6/6px;7/7px;8/8px;9/9px;10/10px;11/11px;12/12px;13/13px;14/14px;15/15px;16/16px;17/17px;18/18px;19/19px;20/20px;21/21px;22/22px;23/23px;24/24px;25/25px;26/26px;27/27px;28/28px;29/29px;30/30px;31/31px;32/32px;33/33px;34/34px;35/35px;36/36px;37/37px;38/38px;39/39px;40/40px;41/41px;42/42px;43/43px;44/44px;45/45px;46/46px;47/47px;48/48px;49/49px;50/50px;51/51px;52/52px;53/53px;54/54px;55/55px;56/56px;57/57px;58/58px;59/59px;60/60px;61/61px;62/62px;63/63px;64/64px;65/65px;66/66px;67/67px;68/68px;69/69px;70/70px;71/71px;72/72px;73/73px;74/74px;75/75px;76/76px;77/77px;78/78px;79/79px;80/80px;81/81px;82/82px;83/83px;84/84px;85/85px;86/86px;87/87px;88/88px;89/89px;90/90px;91/91px;92/92px;93/93px;94/94px;95/95px;96/96px;97/97px;98/98px;99/99px;100/100px;101/101px;102/102px;103/103px;104/104px;105/105px;106/106px;107/107px;108/108px;109/109px;110/110px;111/111px;112/112px;113/113px;114/114px;115/115px;116/116px;117/117px;118/118px;119/119px;120/120px;121/121px;122/122px;123/123px;124/124px;125/125px;126/126px;127/127px;128/128px;129/129px;130/130px;131/131px;132/132px;133/133px;134/134px;135/135px;136/136px;137/137px;138/138px;139/139px;140/140px;141/141px;142/142px;143/143px;144/144px;145/145px;146/146px;147/147px;148/148px;149/149px;150/150px;151/151px;152/152px;153/153px;154/154px;155/155px;156/156px;157/157px;158/158px;159/159px;160/160px;161/161px;162/162px;163/163px;164/164px;165/165px;166/166px;167/167px;168/168px;169/169px;170/170px;171/171px;172/172px;173/173px;174/174px;175/175px;176/176px;177/177px;178/178px;179/179px;180/180px;181/181px;182/182px;183/183px;184/184px;185/185px;186/186px;187/187px;188/188px;189/189px;190/190px;191/191px;192/192px;193/193px;194/194px;195/195px;196/196px;197/197px;198/198px;199/199px;200/200px;';
        config.contentsCss = '/css/editorfonts.css';
        config.font_names =  config.font_names+
            'Asul;'+
            'CabinSketch;'+
            'JosefinSans;'+
            'Lato;'+
            'Montserrat;'+
            'NewsCycle;'+
            'LeagueGothic;'+
            'OpenSans;'+
            'Overpass;'+
            'Oxygen;'+
            'Quicksand;';
        /*config.font_names = 'FuturaStd-CondensedLight;'+
         'futuraBdCn;' +
         'futuraBlackBold;' +
         'futuraBold;' +
         'futuraBoldItalic;' +
         'futuraBoldRegular;' +
         'futuraBook;' +
         'futuraBookItalic;' +
         'futuraExtraBlack;' +
         'futuraExtrablackItalic;' +
         'futuraHeavy;' +
         'futuraHeavyItalic;' +
         'futuraLightBt;' +
         'futuraLightItalic;' +
         'futuraLtCnLight;' +
         'futuramediumBt;' +
         'futuraMediumItalic;' +
         'futuraMediumMdCn;' +
         config.font_names;*/
    };

} else {
    CKEDITOR.editorConfig = function (config) {
        // Define changes to default configuration here:
        config.fontSize_sizes = "6/6px;7/7px;8/8px;9/9px;10/10px;11/11px;12/12px;13/13px;14/14px;15/15px;16/16px;17/17px;18/18px;19/19px;20/20px;21/21px;22/22px;23/23px;24/24px;25/25px;26/26px;27/27px;28/28px;29/29px;30/30px;31/31px;32/32px;33/33px;34/34px;35/35px;36/36px;37/37px;38/38px;39/39px;40/40px;41/41px;42/42px;43/43px;44/44px;45/45px;46/46px;47/47px;48/48px;49/49px;50/50px;51/51px;52/52px;53/53px;54/54px;55/55px;56/56px;57/57px;58/58px;59/59px;60/60px;61/61px;62/62px;63/63px;64/64px;65/65px;66/66px;67/67px;68/68px;69/69px;70/70px;71/71px;72/72px;73/73px;74/74px;75/75px;76/76px;77/77px;78/78px;79/79px;80/80px;81/81px;82/82px;83/83px;84/84px;85/85px;86/86px;87/87px;88/88px;89/89px;90/90px;91/91px;92/92px;93/93px;94/94px;95/95px;96/96px;97/97px;98/98px;99/99px;100/100px;101/101px;102/102px;103/103px;104/104px;105/105px;106/106px;107/107px;108/108px;109/109px;110/110px;111/111px;112/112px;113/113px;114/114px;115/115px;116/116px;117/117px;118/118px;119/119px;120/120px;121/121px;122/122px;123/123px;124/124px;125/125px;126/126px;127/127px;128/128px;129/129px;130/130px;131/131px;132/132px;133/133px;134/134px;135/135px;136/136px;137/137px;138/138px;139/139px;140/140px;141/141px;142/142px;143/143px;144/144px;145/145px;146/146px;147/147px;148/148px;149/149px;150/150px;151/151px;152/152px;153/153px;154/154px;155/155px;156/156px;157/157px;158/158px;159/159px;160/160px;161/161px;162/162px;163/163px;164/164px;165/165px;166/166px;167/167px;168/168px;169/169px;170/170px;171/171px;172/172px;173/173px;174/174px;175/175px;176/176px;177/177px;178/178px;179/179px;180/180px;181/181px;182/182px;183/183px;184/184px;185/185px;186/186px;187/187px;188/188px;189/189px;190/190px;191/191px;192/192px;193/193px;194/194px;195/195px;196/196px;197/197px;198/198px;199/199px;200/200px;";
        //config.contentsCss = "/ckeditor/customfonts/fonts.css";
        config.contentsCss = "/css/editorfonts.css";
        //the next line add the new font to the combobox in CKEditor
        //config.font_names = '<Cutsom Font Name>/<YourFontName>;' + config.font_names;
        config.font_names =  config.font_names+
            "AvenirMedium;"+
            "AvenirLightOblique;"+
            "AvenirLight;"+
            "AvenirBlack;"+
            "avenirHeavy;"+
            "arialBold;"+
            "arialItalic;"+
            "arialBoldItalic;"+
            'Asul;'+
            'CabinSketch;'+
            "EagleBook;" +
            'FuturaStd CondensedLight/FuturaStd-CondensedLight;' +
            "FuturaBTCondMedium;" +
            "FuturaBTMediumItalic;" +
            "FuturaBTMedium;" +
            "GilroySemiBoldItalic;" +
            "GilroySemiBold;" +
            "GilroyRegularItalic;" +
            "GilroyRegular;" +
            "GilroyMediumItalic;" +
            "GilroyMedium;" +
            "GilroyLightItalic;" +
            "GilroyLight;" +
            "GilroyBoldItalic;" +
            "GilroyBold;" +
            'JosefinSans;'+
            'Lato;'+
            'LeagueGothic;'+
            'Merck Regular/Merck;' +
            'MerckSans Serif Pro/MerckPro;' +
            'MerckSans Serif Pro Bold/MerckBold;' +
            'Montserrat;'+
            'NewsCycle;'+
            'OpenSans;'+
            'Overpass;'+
            'Oxygen;'+
            'Quicksand;'+
            'ProximaNova Bold/ProximaNovaBold;' +
            'ProximaNova Regular/ProximaNova;' +
            'ProximaNova Semibold/ProximaNovaSemibold;' +
            "RajdhaniBold;" +
            "RajdhaniLight;" +
            "RajdhaniMedium;" +
            "RajdhaniRegular;" +
            "RajdhaniSemiBold;" +
            "RobotoBlack;" +
            "RobotoBlackItalic;" +
            "RobotoBold;" +
            "RobotoBoldCondensed;" +
            "RobotoBoldCondensedItalic;" +
            "RobotoBoldItalic;" +
            "RobotoCondensed;" +
            "RobotoCondensedItalic;" +
            "RobotoItalic;" +
            "RobotoLight;" +
            "RobotoLightItalic;" +
            "RobotoMedium;" +
            "RobotoMediumItalic;" +
            "RobotoRegular;" +
            "RobotoThin;" +
            "RobotoThinItalic;" +
            "RotisSansSerifStdBold;"+
            "RotisSansSerifStdExtraBold;"+
            "RotisSansSerifStdItalic;"+
            "RotisSansSerifStdLight;"+
            "RotisSansSerifStdLightItalic;"+
            "RotisSansSerifStdRegular;"+
            "SignPainterHouse;" +
            "UniversLTStdBoldCn;" +
            "WhitneyBold;" +
            "WhitneyBoldItalic;" +
            "WhitneyBook;" +
            "WhitneyBookItalic;" +
            "WhitneyMedium;" +
            "WhitneyMediumItalic;" +
            "WhitneySemiblod;" +
            "WhitneySemiboldItalic;";
    };
}
