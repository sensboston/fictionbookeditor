//======================================
//     Интерактивный поиск пропущенной точки перед Прописной
//                                      14 мая 2008 г.
//                                                         Engine by ©Sclex
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// v.1.1 — добавлены двойные угловые кавычки
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// v.1.2 — не предлагается по умолчанию добавление точки после строчной;
//             теперь при «Отмене» запоминается имя собственное, «ОК» — нет.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// v.1.3 — в имена добавлены дефисы и апосторофы
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// v.1.4 — вложенные кавычки
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// v.1.5 — запрос на выход
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// v.1.6 — переход на следующий абзац — "ready for FBE"
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// v.1.7 — подсветка сомнительного места
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// v.1.8 — кастомизированные nbsp — Sclex (20.03.2010)
//======================================
var VersionNumber="2.4";

//обрабатывать ли history
var ObrabotkaHistory=false;
//обрабатывать ли annotation
var ObrabotkaAnnotation=true;
var sIB="<EM>|<STRONG>|<EM><STRONG>|<STRONG><EM>";
var eIB="</EM>|</STRONG>|</EM></STRONG>|</STRONG></EM>";
var aIB="<EM>|<STRONG>|<EM><STRONG>|<STRONG><EM>|</EM>|</STRONG>|</EM></STRONG>|</STRONG></EM>";

function Run() {

  var Ts=new Date().getTime();
  var TimeStr=0;
  var count=0;                           //  счётчик

  try { var nbspChar=window.external.GetNBSP(); var nbspEntity; if (nbspChar.charCodeAt(0)==160) nbspEntity="&nbsp;"; else nbspEntity=nbspChar;}
  catch(e) { var nbspChar=String.fromCharCode(160); var nbspEntity="&nbsp;";}

  var krat = 1;
  var counttt=0;

  var nak = 0;                   // коррекция сдвига подсветки после вставки временых замен и курсива.

  var Col = new Object();                        // коллекции проверенных словосочетаний
  var k = 0;

  var sobCol = new Object();                   // коллекция имён Собственных, перед которыми не стоит ставить точку, набивается при «Отмене»

// Можно, конечно, набить предварительный словарь, но он должен быть огромным и не факт, что все Имена собственные располагаются в середине предложения, а не в начале. Однако с ним веселее. ;)

sobCol["Абдуллой"] = true;
sobCol["Абиссинией"] = true;
sobCol["Абиссинии"] = true;
sobCol["Абиссинию"] = true;
sobCol["Абрам"] = true;
sobCol["Абруцц"] = true;
sobCol["Австралии"] = true;
sobCol["Австралию"] = true;
sobCol["Адуве"] = true;
sobCol["Азии"] = true;
sobCol["Алгабено"] = true;
sobCol["Алгоа"] = true;
sobCol["Александр"] = true;
sobCol["Александра"] = true;
sobCol["Александре"] = true;
sobCol["Александром"] = true;
sobCol["Александру"] = true;
sobCol["Аликанте"] = true;
sobCol["Аллах"] = true;
sobCol["Аллаха"] = true;
sobCol["Аллаху"] = true;
sobCol["Альба"] = true;
sobCol["Альбуферы"] = true;
sobCol["Альварес"] = true;
sobCol["Алькала-де-Энарес"] = true;
sobCol["Альмерию"] = true;
sobCol["Альп"] = true;
sobCol["Альпами"] = true;
sobCol["Альфонса"] = true;
sobCol["Америка"] = true
sobCol["Америке"] = true
sobCol["Америки"] = true
sobCol["Америкой"] = true;
sobCol["Америку"] = true;
sobCol["Анакостия"] = true;
sobCol["Анатолию"] = true;
sobCol["Англией"] = true;
sobCol["Англии"] = true
sobCol["Андалузия"] = true;
sobCol["Андалусии"] = true;
sobCol["Андах"] = true;
sobCol["Андижан"] = true;
sobCol["Андижана"] = true;
sobCol["Андижане"] = true;
sobCol["Андрей"] = true;
sobCol["Андрея"] = true;
sobCol["Анжелика"] = true;
sobCol["Анжелике"] = true;
sobCol["Анжелики"] = true;
sobCol["Анжеликой"] = true;
sobCol["Анжелику"] = true;
sobCol["Анну"] = true;
sobCol["Антоний"] = true;
sobCol["Антонина"] = true;
sobCol["Антониной"] = true;
sobCol["Антония"] = true;
sobCol["Апеннины"] = true;
sobCol["Аппер-Минни"] = true;
sobCol["Аппиевой"] = true;
sobCol["Аравии"] = true;
sobCol["Арагон"] = true;
sobCol["Арагона"] = true;
sobCol["Арагоне"] = true;
sobCol["Арагонском"] = true;
sobCol["Аральское"] = true;
sobCol["Аранды"] = true;
sobCol["Аргадский"] = true;
sobCol["Аргандской"] = true;
sobCol["Аргонны"] = true;
sobCol["Арльберге"] = true;
sobCol["Армении"] = true;
sobCol["Армению"] = true;
sobCol["Армения"] = true;
sobCol["Арсиеро"] = true;
sobCol["Артемьев"] = true;
sobCol["Артемьева"] = true;
sobCol["Артемьеву"] = true;
sobCol["Артур"] = true;
sobCol["Артура"] = true;
sobCol["Артуром"] = true;
sobCol["Артуру"] = true;
sobCol["Аруше"] = true;
sobCol["Архимеда"] = true;
sobCol["Арчи"] = true;
sobCol["Асалоне"] = true;
sobCol["Астурии"] = true;
sobCol["Африка"] = true;
sobCol["Африке"] = true;
sobCol["Африки"] = true;
sobCol["Африку"] = true;
sobCol["Аэрофлоту"] = true;
sobCol["Багамах"] = true;
sobCol["Бадольо"] = true;
sobCol["Бае"] = true;
sobCol["Базилио"] = true;
sobCol["Байкал"] = true;
sobCol["Барбаросса"] = true;
sobCol["Баренцевом"] = true;
sobCol["Баркер"] = true;
sobCol["Барселона"] = true;
sobCol["Барселоне"] = true;
sobCol["Барселону"] = true;
sobCol["Барселоны"] = true;
sobCol["Бартоломео"] = true;
sobCol["Бастилии"] = true;
sobCol["Батыя"] = true;
sobCol["Бельмонте"] = true;
sobCol["Бельчите"] = true;
sobCol["Беляев"] = true;
sobCol["Беникарло"] = true;
sobCol["Берлин"] = true;
sobCol["Билл"] = true;
sobCol["Билла"] = true;
sobCol["Биллом"] = true;
sobCol["Блек-Ривер"] = true;
sobCol["Бломберг"] = true;
sobCol["Блуденц"] = true;
sobCol["Блум"] = true;
sobCol["Бовари"] = true;
sobCol["Боинги"] = true;
sobCol["Бойн-Сити"] = true;
sobCol["Болгарии"] = true;
sobCol["Бонапарт"] = true;
sobCol["Борис"] = true;
sobCol["Босфора"] = true;
sobCol["Бразилии"] = true;
sobCol["Бриуэга"] = true;
sobCol["Бриуэге"] = true;
sobCol["Бриуэги"] = true;
sobCol["Бриуэгой"] = true;
sobCol["Бриуэгу"] = true;
sobCol["Бруклина"] = true;
sobCol["Брунете"] = true;
sobCol["Брянских"] = true;
sobCol["Будда"] = true;
sobCol["Будденброков"] = true;
sobCol["Буддой"] = true;
sobCol["Будды"] = true;
sobCol["Бурано"] = true;
sobCol["Бэнкс"] = true;
sobCol["Бэрд"] = true;
sobCol["Бэрнхейма"] = true;
sobCol["Вайоминге"] = true;
sobCol["Валдайской"] = true;
sobCol["Валенсией"] = true;
sobCol["Валенсии"] = true;
sobCol["Валенсию"] = true;
sobCol["Валенсия"] = true;
sobCol["Валентина"] = true;
sobCol["Вальтер"] = true;
sobCol["Вальядолида"] = true;
sobCol["Ван-Хусена"] = true;
sobCol["Вандербилтом"] = true;
sobCol["Васильевич"] = true;
sobCol["Васильевича"] = true;
sobCol["Васильевичем"] = true;
sobCol["Васильевичу"] = true;
sobCol["Васильевский"] = true;
sobCol["Васильевского"] = true;
sobCol["Васко"] = true;
sobCol["Вашингтона"] = true;
sobCol["Веласкеса"] = true;
sobCol["Веллу"] = true;
sobCol["Венгрию"] = true;
sobCol["Венера"] = true;
sobCol["Венерой"] = true;
sobCol["Венеру"] = true;
sobCol["Венеры"] = true;
sobCol["Венеции"] = true;
sobCol["Версалем"] = true;
sobCol["Версаль"] = true;
sobCol["Версалю"] = true;
sobCol["Версаля"] = true;
sobCol["Вест-Индию"] = true;
sobCol["Виа"] = true;
sobCol["Византией"] = true;
sobCol["Византии"] = true;
sobCol["Византийской"] = true;
sobCol["Византия"] = true;
sobCol["Виллостар"] = true;
sobCol["Винарос"] = true;
sobCol["Виченцы"] = true;
sobCol["Владивосток"] = true;
sobCol["Воробьёвы"] = true;
sobCol["Вселенная"] = true;
sobCol["Вселенные"] = true;
sobCol["Вуэльве"] = true;
sobCol["Гавриил"] = true;
sobCol["Гагарина"] = true;
sobCol["Галилей"] = true;
sobCol["Галисии"] = true;
sobCol["Гама"] = true;
sobCol["Гандесе"] = true;
sobCol["Гандесой"] = true;
sobCol["Гандесы"] = true;
sobCol["Ганнибал"] = true;
sobCol["Ганс"] = true;
sobCol["Гансу"] = true;
sobCol["Гарабитас"] = true;
sobCol["Гарбо"] = true;
sobCol["Гарольд"] = true;
sobCol["Гарри"] = true;
sobCol["Гаруна"] = true;
sobCol["Гаутама"] = true;
sobCol["Гаутамов"] = true;
sobCol["Гвадалахаре"] = true;
sobCol["Гвадалахарой"] = true;
sobCol["Гвадалахарского"] = true;
sobCol["Гвадалахарское"] = true;
sobCol["Гвадалахарском"] = true;
sobCol["Гвадалахары"] = true;
sobCol["Гейтс"] = true;
sobCol["Гекльберри"] = true;
sobCol["Геннадий"] = true;
sobCol["Генри"] = true;
sobCol["Генрих"] = true;
sobCol["Герасимову"] = true;
sobCol["Германии"] = true;
sobCol["Германия"] = true;
sobCol["Герострат"] = true;
sobCol["Герострата"] = true;
sobCol["Геростратов"] = true;
sobCol["Гертруды"] = true;
sobCol["Гиббса"] = true;
sobCol["Гилмор"] = true;
sobCol["Гималаи"] = true;
sobCol["Гитлер"] = true;
sobCol["Гитлера"] = true;
sobCol["Горелл"] = true;
sobCol["Госдуме"] = true;
sobCol["Господом"] = true;
sobCol["Гран-Виа"] = true;
sobCol["Гренландию"] = true;
sobCol["Гретой"] = true;
sobCol["Григорьевич"] = true;
sobCol["Грэнд-Рэпидс"] = true;
sobCol["Гувер"] = true;
sobCol["Гулливером"] = true;
sobCol["Д'Арк"] = true;
sobCol["Дали"] = true;
sobCol["Данте"] = true;
sobCol["Дария"] = true;
sobCol["Декарт"] = true
sobCol["Декарта"] = true
sobCol["Дельгадо"] = true;
sobCol["Джеймсе"] = true;
sobCol["Джеки"] = true;
sobCol["Джи"] = true;
sobCol["Джим"] = true;
sobCol["Джима"] = true;
sobCol["Джиме"] = true;
sobCol["Джозефа"] = true;
sobCol["Джози"] = true;
sobCol["Джойс"] = true;
sobCol["Джойса"] = true;
sobCol["Джон"] = true
sobCol["Джона"] = true;
sobCol["Джоном"] = true;
sobCol["Джонса"] = true;
sobCol["Джону"] = true;
sobCol["Джордж"] = true;
sobCol["Джорджа"] = true;
sobCol["Джосеру"] = true;
sobCol["Диану"] = true;
sobCol["Дианы"] = true;
sobCol["Диас"] = true;
sobCol["Диаш"] = true;
sobCol["Диаша"] = true;
sobCol["Дилворта"] = true;
sobCol["Дитц"] = true;
sobCol["Доломитовых"] = true;
sobCol["Домреми"] = true;
sobCol["Дону"] = true;
sobCol["Достоевского"] = true;
sobCol["Драйзер"] = true;
sobCol["Дюнкерка"] = true;
sobCol["Евгение"] = true;
sobCol["Евгенией"] = true;
sobCol["Евгением"] = true;
sobCol["Евгении"] = true;
sobCol["Евгений"] = true;
sobCol["Евгению"] = true;
sobCol["Евгения"] = true;
sobCol["Европа"] = true;
sobCol["Европе"] = true;
sobCol["Европу"] = true;
sobCol["Европы"] = true;
sobCol["Египте"] = true;
sobCol["Ельцин"] = true;
sobCol["Енисея"] = true;
sobCol["ЖЭКа"] = true;
sobCol["Жак"] = true;
sobCol["Жан"] = true;
sobCol["Жана"] = true;
sobCol["Жанна"] = true;
sobCol["Жанне"] = true;
sobCol["Жанной"] = true;
sobCol["Жанну"] = true;
sobCol["Жанны"] = true;
sobCol["Жаном"] = true;
sobCol["Жорж"] = true;
sobCol["Жоржем"] = true;
sobCol["Жукова"] = true;
sobCol["Занзибар"] = true;
sobCol["Ибаррского"] = true;
sobCol["Иван"] = true;
sobCol["Ивана"] = true;
sobCol["Иванов"] = true;
sobCol["Ивановна"] = true;
sobCol["Иваны"] = true;
sobCol["Иваныч"] = true;
sobCol["Иваныча"] = true;
sobCol["Ивенс"] = true;
sobCol["Ивенса"] = true;
sobCol["Игнатьевна"] = true;
sobCol["Игнатьевну"] = true;
sobCol["Иешуа"] = true;
sobCol["Изи"] = true;
sobCol["Иисус"] = true;
sobCol["Иисуса"] = true;
sobCol["Ильи"] = true;
sobCol["Илья"] = true;
sobCol["Индии"] = true;
sobCol["Индийского"] = true;
sobCol["Индию"] = true;
sobCol["Индиях"] = true;
sobCol["Иоанн"] = true
sobCol["Иоанна"] = true
sobCol["Иоганн"] = true;
sobCol["Иоганна"] = true;
sobCol["Иолла"] = true;
sobCol["Иоллой"] = true;
sobCol["Иоллу"] = true;
sobCol["Иордана"] = true;
sobCol["Иорисом"] = true;
sobCol["Иран"] = true;
sobCol["Иранах"] = true;
sobCol["Ирвинг"] = true;
sobCol["Ирода"] = true;
sobCol["Ирочка"] = true;
sobCol["Ирочке"] = true;
sobCol["Ирочки"] = true;
sobCol["Ирочкин"] = true;
sobCol["Ирочкина"] = true;
sobCol["Ирочкиного"] = true;
sobCol["Ирочкины"] = true;
sobCol["Ирочкиными"] = true;
sobCol["Ирочкиных"] = true;
sobCol["Ирочкой"] = true;
sobCol["Ирочку"] = true;
sobCol["Исаакия"] = true;
sobCol["Испании"] = true;
sobCol["Испанию"] = true;
sobCol["Испания"] = true;
sobCol["Испанской"] = true;
sobCol["Ист-Оренджа"] = true;
sobCol["Италии"] = true;
sobCol["Италию"] = true;
sobCol["Италия"] = true;
sobCol["Иудеи"] = true;
sobCol["Йетса"] = true;
sobCol["КВ"] = true;
sobCol["КГБ"] = true;
sobCol["Кааба"] = true;
sobCol["Казбек"] = true;
sobCol["Каире"] = true;
sobCol["Калигулы"] = true;
sobCol["Калифорнийского"] = true;
sobCol["Калье-Сан-Херонимо"] = true;
sobCol["Камелиста"] = true;
sobCol["Каммингса"] = true;
sobCol["Каммингсом"] = true;
sobCol["Камчатке"] = true;
sobCol["Канады"] = true;
sobCol["Кандесу"] = true;
sobCol["Каннах"] = true;
sobCol["Капица"] = true;
sobCol["Капоретто"] = true;
sobCol["Карабанчеле"] = true;
sobCol["Карабанчеля"] = true;
sobCol["Карагач"] = true;
sobCol["Карагаче"] = true;
sobCol["Карамазовых"] = true;
sobCol["Карл"] = true;
sobCol["Карла"] = true;
sobCol["Карлос"] = true;
sobCol["Карлу"] = true;
sobCol["Карлуша"] = true;
sobCol["Карлушу"] = true;
sobCol["Кармен"] = true;
sobCol["Карпаты"] = true;
sobCol["Каррера-Сан-Херонимо"] = true;
sobCol["Каса-де-Веласкес"] = true;
sobCol["Каса-дель-Кампо"] = true;
sobCol["Каспийского"] = true;
sobCol["Кастеллон"] = true;
sobCol["Кастеллоне"] = true;
sobCol["Кастильском"] = true;
sobCol["Кастральво"] = true;
sobCol["Каталаюд"] = true;
sobCol["Каталонии"] = true;
sobCol["Каталонию"] = true;
sobCol["Каталонского"] = true;
sobCol["Кати"] = true;
sobCol["Кашона"] = true;
sobCol["Кембриджа"] = true;
sobCol["Ки-Уэст"] = true;
sobCol["Киевом"] = true;
sobCol["Килиманджаро"] = true;
sobCol["Кинто"] = true;
sobCol["Кио"] = true;
sobCol["Киплинга"] = true;
sobCol["Китай"] = true;
sobCol["Китая"] = true;
sobCol["Клавиус"] = true;
sobCol["Клавиуса"] = true;
sobCol["Клавиусе"] = true;
sobCol["Кливленда"] = true;
sobCol["Кливленде"] = true;
sobCol["Коминтерна"] = true;
sobCol["Компьень"] = true;
sobCol["Комти"] = true;
sobCol["Комтон"] = true;
sobCol["Комтона"] = true;
sobCol["Конгони"] = true;
sobCol["Конкуд"] = true;
sobCol["Конкуда"] = true;
sobCol["Константин"] = true;
sobCol["Константина"] = true;
sobCol["Константинополе"] = true;
sobCol["Константину"] = true;
sobCol["Коперник"] = true;
sobCol["Коперника"] = true;
sobCol["Копернике"] = true;
sobCol["Корана"] = true;
sobCol["Корберы"] = true;
sobCol["Кордильерами"] = true;
sobCol["Кордовой"] = true;
sobCol["Королёвым"] = true;
sobCol["Корунского"] = true;
sobCol["Коула"] = true;
sobCol["Коутс"] = true;
sobCol["Крамер"] = true;
sobCol["Крамеру"] = true;
sobCol["Красс"] = true;
sobCol["Красса"] = true;
sobCol["Крассом"] = true;
sobCol["Кригер"] = true;
sobCol["Кригера"] = true;
sobCol["Кригеру"] = true;
sobCol["Крийон"] = true;
sobCol["Кубу"] = true;
sobCol["Кубы"] = true;
sobCol["Курске"] = true;
sobCol["Кусто"] = true;
sobCol["Куэнкой"] = true;
sobCol["Кэйт"] = true;
sobCol["ЛЭП"] = true;
sobCol["Лайку"] = true;
sobCol["Ламанче"] = true;
sobCol["Ларго"] = true;
sobCol["Леванта"] = true;
sobCol["Левий"] = true;
sobCol["Леклерка"] = true;
sobCol["Ленин"] = true;
sobCol["Ленинград"] = true;
sobCol["Ленинграда"] = true;
sobCol["Ленинграде"] = true;
sobCol["Ленинградом"] = true;
sobCol["Ленинграду"] = true;
sobCol["Лентула"] = true;
sobCol["Ленц"] = true;
sobCol["Леонид"] = true;
sobCol["Леонида"] = true;
sobCol["Леонидом"] = true;
sobCol["Леониду"] = true;
sobCol["Лериду"] = true;
sobCol["Лестер"] = true;
sobCol["Лиз"] = true;
sobCol["Линарских"] = true;
sobCol["Линкольна"] = true;
sobCol["Лисбоа"] = true;
sobCol["Листер"] = true;
sobCol["Листера"] = true;
sobCol["Ллойд"] = true;
sobCol["Лонг-Айленда"] = true;
sobCol["Лонг-Айленде"] = true;
sobCol["Лондон"] = true;
sobCol["Лондона"] = true;
sobCol["Лондоне"] = true;
sobCol["Лора"] = true;
sobCol["Лоран"] = true
sobCol["Лорана"] = true
sobCol["Лоранами"] = true
sobCol["Лорану"] = true
sobCol["Лос-Аламосе"] = true;
sobCol["Луарка"] = true;
sobCol["Луарке"] = true;
sobCol["Луарки"] = true;
sobCol["Луарку"] = true;
sobCol["Лубянке"] = true;
sobCol["Луис"] = true;
sobCol["Луиса"] = true;
sobCol["Лукача"] = true;
sobCol["Лукачем"] = true;
sobCol["Лукулла"] = true;
sobCol["Луне"] = true;
sobCol["Луну"] = true;
sobCol["Лэнгли"] = true;
sobCol["Люксембургском"] = true;
sobCol["Лютер"] = true;
sobCol["Магальянес"] = true;
sobCol["Магальянесе"] = true;
sobCol["Магда"] = true;
sobCol["Магомет"] = true;
sobCol["Магриб"] = true;
sobCol["Мадагаскар"] = true;
sobCol["Маджид"] = true;
sobCol["Мадленер-Хаус"] = true;
sobCol["Мадрид"] = true;
sobCol["Мадрида"] = true;
sobCol["Мадриде"] = true;
sobCol["Мадридом"] = true;
sobCol["Мадридском"] = true;
sobCol["Мадриду"] = true;
sobCol["Майами"] = true;
sobCol["Майлдмэя"] = true;
sobCol["Макомбер"] = true;
sobCol["Макомбера"] = true;
sobCol["Макомбере"] = true;
sobCol["Макомбером"] = true;
sobCol["Макомберу"] = true;
sobCol["Малагу"] = true;
sobCol["Манн"] = true;
sobCol["Мансуэто"] = true;
sobCol["Мануэль"] = true;
sobCol["Маргарет"] = true;
sobCol["Маргарите"] = true
sobCol["Марго"] = true;
sobCol["Мари"] = true
sobCol["Марка"] = true;
sobCol["Маркс"] = true;
sobCol["Марокко"] = true;
sobCol["Марриэта"] = true;
sobCol["Марс"] = true;
sobCol["Марса"] = true;
sobCol["Марсе"] = true;
sobCol["Марселе"] = true;
sobCol["Марсом"] = true;
sobCol["Мартин"] = true;
sobCol["Мартинес"] = true;
sobCol["Мартой"] = true;
sobCol["Матайга-клубе"] = true;
sobCol["Матвей"] = true;
sobCol["Матекумбе"] = true;
sobCol["Мауну"] = true;
sobCol["Махди"] = true;
sobCol["Махмуд"] = true;
sobCol["Маша"] = true;
sobCol["Маше"] = true;
sobCol["Маэра"] = true;
sobCol["Маэры"] = true;
sobCol["Мекка"] = true;
sobCol["Мексиканский"] = true;
sobCol["Меллер"] = true;
sobCol["Менгеле"] = true;
sobCol["Менделеев"] = true;
sobCol["Мендельсона"] = true;
sobCol["Ментенона"] = true;
sobCol["Меркурий"] = true;
sobCol["Мефистофель"] = true;
sobCol["Мехиас"] = true;
sobCol["Микки"] = true;
sobCol["Милана"] = true;
sobCol["Миннесотский"] = true;
sobCol["Миннесоты"] = true;
sobCol["Миравейта"] = true;
sobCol["Миурасе"] = true;
sobCol["Михайлович"] = true;
sobCol["Мичиган"] = true;
sobCol["Монмартре"] = true;
sobCol["Монмартру"] = true;
sobCol["Мономаха"] = true;
sobCol["Монпарнас"] = true;
sobCol["Монтана"] = true;
sobCol["Монте"] = true;
sobCol["Монте-Корно"] = true;
sobCol["Монтесум"] = true;
sobCol["Монти"] = true;
sobCol["Мопассана"] = true;
sobCol["Моралехе"] = true;
sobCol["Мората-да-Тахуна"] = true;
sobCol["Морелахе"] = true;
sobCol["Москва"] = true;
sobCol["Москве"] = true;
sobCol["Москвой"] = true;
sobCol["Москву"] = true;
sobCol["Москвы"] = true;
sobCol["Московии"] = true;
sobCol["Московской"] = true;
sobCol["Мурсии"] = true;
sobCol["Муссолини"] = true;
sobCol["Муфтар"] = true;
sobCol["Мухаммед"] = true;
sobCol["Мухаммеда"] = true;
sobCol["Мухаммедом"] = true;
sobCol["Мухаммеду"] = true;
sobCol["Муэта-де-Теруэль"] = true;
sobCol["Мюллер"] = true;
sobCol["НЗ"] = true;
sobCol["НКВД"] = true;
sobCol["Найроби"] = true;
sobCol["Нансеновской"] = true;
sobCol["Наполеон"] = true;
sobCol["Наполеона"] = true;
sobCol["Нармера"] = true;
sobCol["Нгайэ-Нгайя"] = true;
sobCol["Нева"] = true;
sobCol["Неве"] = true;
sobCol["Неву"] = true;
sobCol["Невы"] = true;
sobCol["Нейва"] = true;
sobCol["Нерли"] = true;
sobCol["Нерона"] = true;
sobCol["Нестерова"] = true;
sobCol["Ник"] = true;
sobCol["Нила"] = true;
sobCol["Нина"] = true;
sobCol["Нине"] = true;
sobCol["Ниной"] = true;
sobCol["Нину"] = true;
sobCol["Нирвану"] = true;
sobCol["Ницца"] = true;
sobCol["Ниццей"] = true;
sobCol["Нориса"] = true;
sobCol["Ноф-ле-Вье"] = true;
sobCol["Нью-Джерси"] = true;
sobCol["Нью-Йорк"] = true;
sobCol["Нью-Йорка"] = true;
sobCol["Нью-Йорке"] = true;
sobCol["Нью-Йоркера"] = true;
sobCol["Ньютон"] = true;
sobCol["Огайо"] = true;
sobCol["Одгар"] = true;
sobCol["Одгара"] = true;
sobCol["Олимпиаду"] = true;
sobCol["Олю"] = true;
sobCol["Орлеанская"] = true;
sobCol["Орлеанской"] = true;
sobCol["Освенциме"] = true;
sobCol["Ош"] = true;
sobCol["Оша"] = true;
sobCol["Оше"] = true;
sobCol["Павлович"] = true;
sobCol["Пако"] = true;
sobCol["Памир"] = true;
sobCol["Памира"] = true;
sobCol["Памире"] = true;
sobCol["Памплоне"] = true;
sobCol["Папуа"] = true;
sobCol["Пардо"] = true;
sobCol["Париж"] = true;
sobCol["Парижа"] = true;
sobCol["Париже"] = true
sobCol["Парижем"] = true;
sobCol["Парижская"] = true;
sobCol["Пармскую"] = true;
sobCol["Парфии"] = true;
sobCol["Пархоменко"] = true;
sobCol["Пасионария"] = true;
sobCol["Пасубио"] = true;
sobCol["Паулюса"] = true;
sobCol["Пелле"] = true;
sobCol["Пепе"] = true;
sobCol["Пер-Лашез"] = true;
sobCol["Пера-Палас"] = true;
sobCol["Петоски"] = true;
sobCol["Петра"] = true;
sobCol["Петрикой"] = true;
sobCol["Петром"] = true;
sobCol["Пилар"] = true;
sobCol["Пилат"] = true;
sobCol["Пиренеев"] = true;
sobCol["Питера"] = true;
sobCol["Питерсон"] = true;
sobCol["Питерсона"] = true;
sobCol["Плутон"] = true;
sobCol["Подмосковье"] = true;
sobCol["Покрова"] = true;
sobCol["Полтавой"] = true;
sobCol["Польше"] = true;
sobCol["Помпея"] = true;
sobCol["Понтий"] = true;
sobCol["Порт-Саида"] = true;
sobCol["Португалии"] = true;
sobCol["Пугачёва"] = true;
sobCol["Пьомбино"] = true;
sobCol["Пьяве"] = true;
sobCol["РСФСР"] = true;
sobCol["Равой-Русской"] = true;
sobCol["Рай"] = true;
sobCol["Ральф"] = true;
sobCol["Рамбуйе"] = true;
sobCol["Рашидовича"] = true;
sobCol["Реглер"] = true;
sobCol["Реймсский"] = true;
sobCol["Реус"] = true;
sobCol["Реуса"] = true;
sobCol["Ривьеру"] = true;
sobCol["Рим"] = true;
sobCol["Рима"] = true;
sobCol["Риме"] = true;
sobCol["Риммили-Хисса"] = true;
sobCol["Римская"] = true;
sobCol["Римской"] = true;
sobCol["Ритца"] = true;
sobCol["Ритце"] = true;
sobCol["Роберт"] = true;
sobCol["Роберта"] = true;
sobCol["Ролли"] = true;
sobCol["Рома"] = true;
sobCol["России"] = true;
sobCol["Российской"] = true;
sobCol["Россию"] = true;
sobCol["Россия"] = true;
sobCol["Рузвельт"] = true;
sobCol["Руси"] = true;
sobCol["СВЧ"] = true;
sobCol["СС"] = true;
sobCol["СССР"] = true;
sobCol["США"] = true;
sobCol["Савл"] = true;
sobCol["Савла"] = true;
sobCol["Савойя-Марчетти"] = true;
sobCol["Саломеи"] = true
sobCol["Саломея"] = true
sobCol["Сальвадор"] = true;
sobCol["Сан-Габриэлем"] = true;
sobCol["Сан-Габриэля"] = true;
sobCol["Сан-Карлоса"] = true;
sobCol["Сан-Себастиане"] = true;
sobCol["Сан-Себастьяне"] = true;
sobCol["Сарагосского"] = true;
sobCol["Саргассовом"] = true;
sobCol["Сардинских"] = true;
sobCol["Сатурн"] = true;
sobCol["Сатурна"] = true;
sobCol["Сахаров"] = true;
sobCol["Свердловск"] = true;
sobCol["Свире"] = true;
sobCol["Севилье"] = true;
sobCol["Сегре"] = true;
sobCol["Сегуридад"] = true;
sobCol["Сезанн"] = true;
sobCol["Сезанна"] = true;
sobCol["Сезаннов"] = true;
sobCol["Семирамиды"] = true;
sobCol["Сен-Жерменском"] = true;
sobCol["Сен-Реми-де-Шеврез"] = true;
sobCol["Сен-Реми-ле-Шеврез"] = true;
sobCol["Си-Ай-Си"] = true;
sobCol["Сибири"] = true;
sobCol["Сиддхартха"] = true;
sobCol["Сиддхартхе"] = true;
sobCol["Сиддхартхи"] = true;
sobCol["Сиддхартхой"] = true;
sobCol["Симплон"] = true;
sobCol["Скотта"] = true;
sobCol["Смит"] = true;
sobCol["Смита"] = true;
sobCol["Смитов"] = true;
sobCol["Смитом"] = true;
sobCol["Советский"] = true;
sobCol["Соколовский"] = true;
sobCol["Соколовским"] = true;
sobCol["Соколовскому"] = true;
sobCol["Солнца"] = true;
sobCol["Солнце"] = true;
sobCol["Соломоновых"] = true;
sobCol["Сочи"] = true;
sobCol["Спартак"] = true;
sobCol["Спартака"] = true;
sobCol["Средиземноморьем"] = true;
sobCol["Средиземноморью"] = true;
sobCol["Сталин"] = true;
sobCol["Сталина"] = true;
sobCol["Сталинград"] = true;
sobCol["Сталинградом"] = true;
sobCol["Стендаля"] = true;
sobCol["Стивена"] = true;
sobCol["Сторк"] = true;
sobCol["Струда"] = true;
sobCol["Стэрджен"] = true;
sobCol["Стюарта"] = true;
sobCol["Суэцкий"] = true;
sobCol["Сьерры"] = true;
sobCol["Сьете-Коммуни"] = true;
sobCol["Тадж-Махал"] = true;
sobCol["Таксима"] = true;
sobCol["Тантала"] = true;
sobCol["Таррагоной"] = true;
sobCol["Таррагоны"] = true;
sobCol["Тауантинсуйу"] = true;
sobCol["Тахо"] = true;
sobCol["Ташкент"] = true;
sobCol["Ташкенте"] = true;
sobCol["Твена"] = true;
sobCol["Террамото"] = true;
sobCol["Теруэле"] = true;
sobCol["Теруэлем"] = true;
sobCol["Теруэль"] = true;
sobCol["Теруэльский"] = true;
sobCol["Теруэлю"] = true;
sobCol["Теруэля"] = true;
sobCol["Тимура"] = true;
sobCol["Токио"] = true;
sobCol["Толедском"] = true;
sobCol["Томас"] = true;
sobCol["Томаса"] = true;
sobCol["Томасом"] = true;
sobCol["Тоне"] = true;
sobCol["Тоней"] = true;
sobCol["Тониной"] = true;
sobCol["Тоню"] = true;
sobCol["Тоня"] = true;
sobCol["Тортосе"] = true;
sobCol["Тортосой"] = true;
sobCol["Тортосского"] = true;
sobCol["Тортосскому"] = true;
sobCol["Тортосу"] = true;
sobCol["Тортосы"] = true;
sobCol["Торчелло"] = true;
sobCol["Траппом"] = true;
sobCol["Триберга"] = true;
sobCol["Триберге"] = true;
sobCol["Тристаном"] = true;
sobCol["Триуэгой"] = true;
sobCol["Тулона"] = true;
sobCol["Тулузы"] = true;
sobCol["Тургенева"] = true;
sobCol["Турина"] = true;
sobCol["Тэмучжин"] = true;
sobCol["Тэмучжина"] = true;
sobCol["Тэмучжину"] = true;
sobCol["Тюрин"] = true;
sobCol["Тюрину"] = true;
sobCol["Уилсон"] = true;
sobCol["Уилсона"] = true;
sobCol["Уилсоне"] = true;
sobCol["Уилсоном"] = true;
sobCol["Уилсону"] = true;
sobCol["Уильямсон"] = true;
sobCol["Уильямсона"] = true;
sobCol["Уильямсоном"] = true;
sobCol["Украины"] = true;
sobCol["Улисса"] = true;
sobCol["Улиссе"] = true;
sobCol["Уолдорф-Астории"] = true;
sobCol["Уоллунского"] = true;
sobCol["Уотерс"] = true;
sobCol["Уотерсом"] = true;
sobCol["Усере"] = true;
sobCol["Усерой"] = true;
sobCol["Утанде"] = true;
sobCol["Уэске"] = true;
sobCol["Уэстбери"] = true;
sobCol["Фаберже"] = true;
sobCol["Фебе"] = true;
sobCol["Феде"] = true;
sobCol["Федей"] = true;
sobCol["Феди"] = true;
sobCol["Федя"] = true;
sobCol["Феодора"] = true;
sobCol["Ферма"] = true;
sobCol["Ферно"] = true;
sobCol["Филдинга"] = true;
sobCol["Филипп"] = true;
sobCol["Финна"] = true;
sobCol["Фицджеральд"] = true;
sobCol["Фицджеральду"] = true;
sobCol["Флобера"] = true;
sobCol["Флоренции"] = true;
sobCol["Флорида"] = true;
sobCol["Флориде"] = true;
sobCol["Флоридские"] = true;
sobCol["Флоридских"] = true;
sobCol["Флориды"] = true;
sobCol["Фолсету"] = true;
sobCol["Форарльберге"] = true;
sobCol["Форкса"] = true;
sobCol["Форнос"] = true;
sobCol["Фракии"] = true;
sobCol["Франклин"] = true;
sobCol["Франко"] = true;
sobCol["Франсиско"] = true;
sobCol["Франции"] = true;
sobCol["Францию"] = true;
sobCol["Франция"] = true;
sobCol["Фрэнсис"] = true;
sobCol["Фрэнсиса"] = true;
sobCol["Фрэнсису"] = true;
sobCol["Фуко"] = true;
sobCol["Фуэнтедуэньи"] = true;
sobCol["Фуэнтедуэнья"] = true;
sobCol["Фуэнтес-дель-Эбро"] = true;
sobCol["Фью"] = true;
sobCol["Хаке"] = true;
sobCol["Хаммурапи"] = true;
sobCol["Хань"] = true;
sobCol["Хараме"] = true;
sobCol["Хараму"] = true;
sobCol["Хейльбрун"] = true;
sobCol["Хейльбруна"] = true;
sobCol["Хейльбруном"] = true;
sobCol["Хект"] = true;
sobCol["Хеллас"] = true;
sobCol["Хемингуэй"] = true;
sobCol["Хиросимой"] = true;
sobCol["Хиросимы"] = true;
sobCol["Хиры"] = true;
sobCol["Хортона"] = true;
sobCol["Хортонс-Бей"] = true;
sobCol["Хортонс-Крике"] = true;
sobCol["Хосе"] = true;
sobCol["Христа"] = true;
sobCol["Хуана"] = true;
sobCol["Хулиан"] = true;
sobCol["Хуэрты"] = true;
sobCol["Хэддоксе"] = true;
sobCol["ЦРУ"] = true;
sobCol["Царь-пушка"] = true;
sobCol["Царь-пушке"] = true;
sobCol["Царь-пушку"] = true;
sobCol["Цейлоне"] = true;
sobCol["Цельсий"] = true;
sobCol["Цельсию"] = true;
sobCol["Цельсия"] = true;
sobCol["Церетели"] = true;
sobCol["Циолковский"] = true;
sobCol["Цицерон"] = true;
sobCol["Цицерона"] = true;
sobCol["Чарли"] = true;
sobCol["Черноморья"] = true;
sobCol["Чикоте"] = true;
sobCol["Чингис-хан"] = true;
sobCol["Чингис-хана"] = true;
sobCol["Чингис-ханом"] = true;
sobCol["Чингис-хану"] = true;
sobCol["Шанель"] = true;
sobCol["Шарлевуа"] = true;
sobCol["Шарльвуа"] = true;
sobCol["Шартра"] = true;
sobCol["Шартре"] = true;
sobCol["Шварцкопф"] = true;
sobCol["Шеврез"] = true;
sobCol["Шекспира"] = true;
sobCol["Шервуда"] = true;
sobCol["Шлыков"] = true;
sobCol["Шлыкова"] = true;
sobCol["Шотландии"] = true;
sobCol["Шрунсе"] = true;
sobCol["Штерна"] = true;
sobCol["Эбро"] = true;
sobCol["Эдик"] = true;
sobCol["Эдуарда"] = true;
sobCol["Эдуардович"] = true;
sobCol["Эдуардовича"] = true;
sobCol["Эйнштейн"] = true;
sobCol["Эйфеля"] = true;
sobCol["Элен"] = true;
sobCol["Эллен"] = true;
sobCol["Эль"] = true;
sobCol["Эмпайр"] = true;
sobCol["Эмундс"] = true;
sobCol["Энола"] = true;
sobCol["Эноле"] = true;
sobCol["Энрике"] = true;
sobCol["Эпериона"] = true;
sobCol["Эпернона"] = true;
sobCol["Эперноном"] = true;
sobCol["Эр-Франс"] = true;
sobCol["Эстремадурского"] = true;
sobCol["Эстремадуры"] = true;
sobCol["Юлия"] = true;
sobCol["Юнайтед"] = true;
sobCol["Юпитер"] = true;
sobCol["Юпитера"] = true;
sobCol["Юпитером"] = true;
sobCol["Юстин"] = true;
sobCol["Юстиниан"] = true;
sobCol["Юстиниана"] = true;
sobCol["Юстинианом"] = true;
sobCol["Ямале"] = true;
sobCol["Япете"] = true;
sobCol["Японию"] = true;
                                                   // После строчной через пробел Прописная — возможно пропущена точка
 var re10 = new RegExp("^(.*?){0,1}([А-ЯЁ]*[а-яё]+“{0,1}»{0,1})("+eIB+"){0,1}( |"+nbspChar+")("+sIB+"){0,1}(«{0,1}„{0,1}([А-ЯЁ]+[А-яё\\\-']*))(.*?){0,1}$","g");
 var re11 = "$2$3$4$5$6";
 var re12 = "$1";
 var re13 = "$8";
 var re14 = "$2$4$6";
 var re15 = "$7";                    // Слово с Прописной после пробела (в коллекцию)

  var re1s = new RegExp("([А-ЯЁ]*[а-яё]+“{0,1}»{0,1}("+eIB+"){0,1}) (("+sIB+"){0,1}«{0,1}„{0,1}([А-ЯЁ]+[А-яё\\\-']*))","g");

  var re1cl = new RegExp("<[^<>]+>","g");
  var re11cl = "";

  var re2cl = new RegExp(nbspEntity,"g");
  var re21cl = nbspChar;

  var re3cl = new RegExp("&#\\\d+;","g");
  var re31cl = "q";

                                                   // шаблоны для финального восстановления временных замен
  var re_fin1 = new RegExp("col5_\\d{5}","g");


//    window.external.BeginUndoUnit(document,"точка, точка, запятая...");                               // отключил откат — жрёт оперативку

 var s="";
 var log="";
 
 //function addToLog(s) {
 //  log+=s;
 //  window.clipboardData.setData("text",log);
 //}
 function addZeros(n,n_len) {
  var s=n.toString();
  while (s.length<n_len) s="0"+s;
  return s;
 } 
 var nbspRE=new RegExp(nbspEntity,"g");
 // функция, обрабатывающая абзац P
 function HandleP(ptr) {
  //addToLog("Вошли в HandleP. ");
  s=ptr.innerHTML;
  s=s.replace(nbspRE,nbspChar);
  //alert("s: "+s);

  ptr2=ptr;                                      // следующий абзац за совпадением — переход на него, чтобы в FBE было видно  проблемное место
  if (ptr2.hasChildNodes()) {
     ptr2=ptr2.firstChild;
  } else {
     while (ptr2!=fbw_body && !ptr2.nextSibling) ptr2=ptr2.parentNode;
     if (ptr2!=fbw_body) ptr2=ptr2.nextSibling;
  }
  while (ptr2!=fbw_body && ptr2.nodeName!="P") {
     if (ptr2.hasChildNodes() && ptr2.nodeName!="P") {
       ptr2=ptr2.firstChild;
     } else {
       while (ptr2!=fbw_body && !ptr2.nextSibling) ptr2=ptr2.parentNode;
       if (ptr2!=fbw_body) ptr2=ptr2.nextSibling;
     }
  }

  if (s.search(re10)!=-1) {
  
   if (ptr2==fbw_body) GoTo(ptr); else GoTo(ptr2);

   while (s.search(re10)!=-1) {
     var v1  = s.replace(re10, re11);
     var sl1   = s.replace(re10, re12);
     var sp1   = s.replace(re10, re13);

     var sob = s.replace(re10, re15);

     //                  Подсветка                                    //
     var ss = s;                      // очистка абзаца от тегов, неразрывных, умляутов
     if (s.search(re1cl)!=-1) ss=ss.replace(re1cl, re11cl);
     //if (s.search(re2cl)!=-1) ss=ss.replace(re2cl, re21cl);
     if (s.search(re3cl)!=-1) ss=ss.replace(re3cl, re31cl);
    
     var s1=s.replace(re10, re14);
     var a1=ss.search(s1)+nak;
     var b1=s1.length
    
     var range1=document.body.createTextRange();
     range1.moveToElementText(ptr);
     range1.collapse();
     range1.move("character",a1);
     range1.moveEnd("character",b1);
     range1.select();
    
    // MsgBox("a1: "+a1+"\nsearch: "+ss.search(s1)+"\nnakat: "+nak+"\ns1: "+s1+"\nb1: "+b1+"\nem2: "+em2+"\nem3: "+em3+"\n\ns: \n"+s+"\nss: \n"+ss);
    //                   Конец подсветки                           //
     if (sobCol[sob]==true)  {
       Col[k] = v1;
       s=sl1+("col5_" +addZeros(k,5))+sp1;
       nak+=b1-10;
       k++;
     } 

     // MsgBox ('      И где это я?     \nv1:  ' +v1+ '\nsobCol[l]: ' +sob+ '  =  ' +sobCol[sob]+ '\n\nабзац:\n' +s );
     //alert("s: "+s);
     // changed by SeNS
     if (sobCol[sob]==null) {
       var r=Object();
       if (InputBox(" :: Пропущена точка ::                                                                … " +count+ "\nВведите свой вариант:                " +v1,v1, r) == IDCANCEL) return "exit";
       // var r=prompt(" :: Пропущена точка ::                                                                … " +count+ "\nВведите свой вариант:                " +v1,v1)
       if (r!=null && r.$!="")  {
         Col[k] = r.$;
         s=sl1+("col5_" +addZeros(k,5))+sp1;
         if (r.$!=v1) count++;
       }
       else {
         Col[k] = v1;
         sobCol[sob]=true;
         s=sl1+("col5_"+addZeros(k,5))+sp1
       };
       counttt++;
       nak=nak+b1-10;
     }
 //addToLog("Точка 4. ");
     k++;
   }
 //addToLog("Точка 5. ");				
 }

   var re200, re201;
   
   if (s.search(re_fin1)!=-1) { //Восстановление временных замен
     for (z=0;z<k;z++)  {
       re200 = new RegExp("col5_("+addZeros(z,5)+")","g");
       re201 = Col[z];
       //alert("Заменяем re200: "+re200);
       s=s.replace(re200,re201);
      } 
      k=0;
      nak=0;
   }

   ptr.innerHTML=s; 
// changed by SeNS
   //addToLog("Вышли из HandleP. ");
   return true;
 }

 var body=document.getElementById("fbw_body");
 var ptr=body;
 var ProcessingEnding=false;
 if (document.selection==null || document.selection.type=="Control") {
  alert("Нет выделения типа \"Текст\".");
  return;
 }
 var tr=document.selection.createRange();
 if (!tr) return;
 tr.collapse();
 var ptr=tr.parentElement();
 if (!body.contains(ptr)) return;
 var ptr2=ptr;
 while (ptr2 && ptr2.nodeName!="BODY" && ptr2.nodeName!="P")
  ptr2=ptr2.parentNode;
 if (ptr2 && ptr2.nodeName=="P") ptr=ptr2;
 //alert(ptr.outerHTML);
 while (!ProcessingEnding && ptr) {
  SaveNext=ptr;
  if (SaveNext.firstChild!=null && SaveNext.nodeName!="P" && 
      !(SaveNext.nodeName=="DIV" && 
        ((SaveNext.className=="history" && !ObrabotkaHistory) || 
         (SaveNext.className=="annotation" && !ObrabotkaAnnotation))))
  {    SaveNext=SaveNext.firstChild; }                                                         // либо углубляемся...

  else {
    while (SaveNext && SaveNext!=body && SaveNext.nextSibling==null)  {
     SaveNext=SaveNext.parentNode;                                                           // ...либо поднимаемся (если уже сходили вглубь)
                                                                                                                // поднявшись до элемента P, не забудем поменять флаг
     if (SaveNext==body) {ProcessingEnding=true;}
                                                         }
   if (SaveNext && SaveNext!=body) SaveNext=SaveNext.nextSibling; //и переходим на соседний элемент
         }
  if (ptr.nodeName=="P") 
   if (HandleP(ptr)=="exit") break;
  ptr=SaveNext;
 }

  window.external.EndUndoUnit(document);

  var Tf=new Date().getTime();
  var Thour = Math.floor((Tf-Ts)/3600000);
  var Tmin  = Math.floor((Tf-Ts)/60000-Thour*60);
  var Tsec = Math.ceil((Tf-Ts)/1000-Tmin*60-Thour*3600);
  var Tsec1 = Math.ceil(10*((Tf-Ts)/1000-Tmin*60))/10;
  var Tsec2 = Math.ceil(100*((Tf-Ts)/1000-Tmin*60))/100;
  var Tsec3 = Math.ceil(1000*((Tf-Ts)/1000-Tmin*60))/1000;

  if (Tsec3<1 && Tmin<1)    TimeStr=Tsec3+ " сек"
  else { if (Tsec2<10 && Tmin<1)   TimeStr=Tsec2+ " сек"
  else { if (Tsec1<30 && Tmin<1)   TimeStr=Tsec1+ " сек"
  else { if (Tmin<1)                       TimeStr=Tsec+ " сек" 
  else { if (Tmin>=1 && Thour<1)   TimeStr=Tmin+ " мин " +Tsec+ " с"
  else { if (Thour>=1)                    TimeStr=Thour+ " ч " +Tmin+ " мин " +Tsec+ " с"  }}}}}

  MsgBox ('–= Jurgen Script =–          \n'+
              '«Точка.» v.'+VersionNumber+'	\n\n'+

              ' Произведено замен: ' +count+'\n\n'+

              ' Время: ' +TimeStr+ '.\n' ); 

} 