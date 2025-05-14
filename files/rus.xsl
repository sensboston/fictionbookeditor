<?xml version="1.0" encoding="utf-8"?>

<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:l="http://www.w3.org/1999/xlink">

	<xsl:variable name="IDS_VIEW_BTN" select="'Показать'"/>
	<xsl:variable name="IDS_BINARY_OBJ" select="'Бинарные файлы'"/>
	<xsl:variable name="IDS_BOOK" select="'Книга'"/>
	<xsl:variable name="IDS_GENRES" select="'Жанры'"/>
	<xsl:variable name="IDS_GENRE" select="'Жанр:'"/>
	<xsl:variable name="IDS_MATCH" select="'Соответствие (%):'"/>
	<xsl:variable name="IDS_AUTHORS" select="'Авторы'"/>
	<xsl:variable name="IDS_TITLE" select="'Название:'"/>
	<xsl:variable name="IDS_KEYWORDS" select="'Ключевые слова:'"/>
	<xsl:variable name="IDS_DATE_TEXT" select="'Дата текстом:'"/>
	<xsl:variable name="IDS_DATE_VALUE" select="'Значение даты (в формате ГГГГ-ММ-ДД):'"/>
	<xsl:variable name="IDS_COVERPAGE" select="'Обложка'"/>
	<xsl:variable name="IDS_IMAGE" select="'Изображение:'"/>
	<xsl:variable name="IDS_LANGUAGE" select="'Язык:'"/>
	<xsl:variable name="IDS_SOURCE_LANG" select="'Язык оригинала:'"/>
	<xsl:variable name="IDS_TRANSLATORS" select="'Переводчики'"/>
	<xsl:variable name="IDS_SEQUENCE" select="'Серия'"/>
	<xsl:variable name="IDS_STI" select="'Информация об оригинале книги (заполняется на языке оригинала)'"/>
	<xsl:variable name="IDS_DOCUMENT" select="'FB2 документ'"/>
	<xsl:variable name="IDS_VERSION" select="'Версия:'"/>
	<xsl:variable name="IDS_NEW" select="'новый'"/>
	<xsl:variable name="IDS_ID" select="'ID:'"/>
	<xsl:variable name="IDS_TOOLS_USED" select="'Использованы программы:'"/>
	<xsl:variable name="IDS_SOURCE_OCR" select="'Source OCR:'"/>
	<xsl:variable name="IDS_SOURCE_URL" select="'Source URLs'"/>
	<xsl:variable name="IDS_PAPER_BOOK" select="'Бумажная книга'"/>
	<xsl:variable name="IDS_BOOK_TITLE" select="'Заголовок книги:'"/>
	<xsl:variable name="IDS_PUBLISHER" select="'Издатель:'"/>
	<xsl:variable name="IDS_CITY" select="'Город:'"/>
	<xsl:variable name="IDS_YEAR" select="'Год:'"/>
	<xsl:variable name="IDS_ISBN" select="'ISBN:'"/>	
	<xsl:variable name="IDS_CUSTOM_INFO" select="'Дополнительная информация'"/>
	<xsl:variable name="IDS_TYPE" select="'Тип:'"/>
	<xsl:variable name="IDS_VALUE" select="'Значение:'"/>
	<xsl:variable name="IDS_FIRST" select="'Имя:'"/>
	<xsl:variable name="IDS_MIDLE" select="'Отчество:'"/>
	<xsl:variable name="IDS_LAST" select="'Фамилия:'"/>
	<xsl:variable name="IDS_NICKNAME" select="'Ник:'"/>
	<xsl:variable name="IDS_EMAIL" select="'Email:'"/>
	<xsl:variable name="IDS_WEBSITE" select="'Website:'"/>
	<xsl:variable name="IDS_NAME" select="'Название:'"/>		
	<xsl:variable name="IDS_NUMBER" select="'Номер:'"/>		
    <xsl:variable name="IDS_STYLES_TABLE" select="'Таблица стилей'"/>
	<xsl:variable name="IDS_ID_WARN" select="'\nВы уверены, что хотите изменить ID?\n\nЭто повлияет на уникальность книги в библиотеке.\nПредыдущее значение будет утеряно!\n\n'"/>
	
	<xsl:template name="fill_languages_combo">
		<xsl:param name="lang"/>
		<option selected="yes" value="{$lang}">-org-</option>
        <option value=""></option>
	    <optgroup label=" Основные">
			<option value="ru">Русский (ru)</option>
			<option value="en">Английский (en)</option>
			<option value="fr">Французский (fr)</option>
			<option value="de">Немецкий (de)</option>
	    </optgroup>

	    <optgroup label=" Распространённые">
			<option value="be">Белорусский (be)</option>
			<option value="bg">Болгарский (bg)</option>
			<option value="hu">Венгерский (hu)</option>
			<option value="el">Греческий (el)</option>
			<option value="da">Датский (da)</option>
			<option value="he">Иврит (he)</option>
			<option value="es">Испанский (es)</option>
			<option value="it">Итальянский (it)</option>
			<option value="zh">Китайский (zh)</option>
			<option value="ko">Корейский (ko)</option>
			<option value="lv">Латышский (lv)</option>
			<option value="lt">Литовский (lt)</option>
			<option value="nl">Нидерландский (nl)</option>
			<option value="no">Норвежский (no)</option>
			<option value="pl">Польский (pl)</option>
			<option value="pt">Португальский (pt)</option>
			<option value="sr">Сербский (sr)</option>
			<option value="uk">Украинский (uk)</option>
			<option value="fi">Финский (fi)</option>
			<option value="cs">Чешский (cs)</option>
			<option value="sv">Шведский (sv)</option>
			<option value="et">Эстонский (et)</option>
			<option value="ja">Японский (ja)</option>
	    </optgroup>

	    <optgroup label=" Редкие">
			<option value="ab">Абхазский (ab)</option>
			<option value="az">Азербайджанский (az)</option>
			<option value="ay">Аймара (ay)</option>
			<option value="sq">Албанский (sq)</option>
			<option value="am">Амхарский (am)</option>
			<option value="ar">Арабский (ar)</option>
			<option value="hy">Армянский (hy)</option>
			<option value="as">Ассамский (as)</option>
			<option value="aa">Афарский (aa)</option>
			<option value="af">Африкаанс (af)</option>
			<option value="eu">Баскский (eu)</option>
			<option value="ba">Башкирский (ba)</option>
			<option value="bn">Бенгальский (bn)</option>
			<option value="my">Бирманский (my)</option>
			<option value="bi">Бислама (bi)</option>
			<option value="br">Бретонский (br)</option>
			<option value="cy">Валлийский (cy)</option>
			<option value="vo">Волапюк (vo)</option>
			<option value="wo">Волоф (wo)</option>
			<option value="vi">Вьетнамский (vi)</option>
			<option value="gl">Галисийский (gl)</option>
			<option value="kl">Гренландский (kl)</option>
			<option value="ka">Грузинский (ka)</option>
			<option value="gn">Гуарани (gn)</option>
			<option value="gu">Гуджарати (gu)</option>
			<option value="dz">Дзонг-кэ (dz)</option>
			<option value="zu">Зулу (zu)</option>
			<option value="yi">Идиш (yi)</option>
			<option value="ia">Интерлингва (ia)</option>
			<option value="iu">Инуктитут (iu)</option>
			<option value="ik">Инупиак (ik)</option>
			<option value="ga">Ирландский (ga)</option>
			<option value="is">Исландский (is)</option>
			<option value="yo">Йоруба (yo)</option>
			<option value="kk">Казахский (kk)</option>
			<option value="kn">Каннада (kn)</option>
			<option value="ca">Каталанский (ca)</option>
			<option value="ks">Кашмири (ks)</option>
			<option value="qu">Кечуа (qu)</option>
			<option value="ky">Киргизский (ky)</option>
			<option value="co">Корсиканский (co)</option>
			<option value="xh">Коса (xh)</option>
			<option value="ku">Курдский (ku)</option>
			<option value="km">Кхмерский (km)</option>
			<option value="lo">Лаосский (lo)</option>
			<option value="la">Латинский (la)</option>
			<option value="ln">Лингала (ln)</option>
			<option value="mk">Македонский (mk)</option>
			<option value="mg">Малагасийский (mg)</option>
			<option value="ms">Малайский (ms)</option>
			<option value="ml">Малаялам (ml)</option>
			<option value="mt">Мальтийский (mt)</option>
			<option value="mi">Маори (mi)</option>
			<option value="mr">Маратхи (mr)</option>
			<option value="mo">Молдавский (mo)</option>
			<option value="mn">Монгольский (mn)</option>
			<option value="na">Науру (na)</option>
			<option value="ne">Непальский (ne)</option>
			<option value="oc">Окситанский (oc)</option>
			<option value="or">Ория (or)</option>
			<option value="om">Оромо (om)</option>
			<option value="pa">Пенджабский (pa)</option>
			<option value="fa">Персидский (fa)</option>
			<option value="ps">Пушту (ps)</option>
			<option value="rm">Ретороманский (rm)</option>
			<option value="rw">Руанда (rw)</option>
			<option value="ro">Румынский (ro)</option>
			<option value="rn">Рунди (rn)</option>
			<option value="sm">Самоанский (sm)</option>
			<option value="sg">Санго (sg)</option>
			<option value="sa">Санскрит (sa)</option>
			<option value="ss">Свази (ss)</option>
			<option value="st">Сесото (st)</option>
			<option value="si">Сингальский (si)</option>
			<option value="sd">Синдхи (sd)</option>
			<option value="sk">Словацкий (sk)</option>
			<option value="sl">Словенский (sl)</option>
			<option value="so">Сомали (so)</option>
			<option value="sw">Суахили (sw)</option>
			<option value="su">Сунданский (su)</option>
			<option value="tl">Тагальский (tl)</option>
			<option value="tg">Таджикский (tg)</option>
			<option value="th">Тайский (th)</option>
			<option value="ta">Тамильский (ta)</option>
			<option value="tt">Татарский (tt)</option>
			<option value="tw">Тви (tw)</option>
			<option value="te">Телугу (te)</option>
			<option value="bo">Тибетский (bo)</option>
			<option value="ti">Тигринья (ti)</option>
			<option value="to">Тонганский (to)</option>
			<option value="tn">Тсвана (tn)</option>
			<option value="ts">Тсонга (ts)</option>
			<option value="tr">Турецкий (tr)</option>
			<option value="tk">Туркменский (tk)</option>
			<option value="uz">Узбекский (uz)</option>
			<option value="ug">Уйгурский (ug)</option>
			<option value="ur">Урду (ur)</option>
			<option value="fo">Фарерский (fo)</option>
			<option value="fj">Фиджи (fj)</option>
			<option value="fy">Фризский (fy)</option>
			<option value="ha">Хауса (ha)</option>
			<option value="hi">Хинди (hi)</option>
			<option value="hr">Хорватский (hr)</option>
			<option value="za">Чжуанский (za)</option>
			<option value="sn">Шона (sn)</option>
			<option value="gd">Шотландский (gd)</option>
			<option value="eo">Эсперанто (eo)</option>
	    </optgroup>

	    <optgroup label=" Невалидные коды">
	    </optgroup>

	    <optgroup label=" в старых версиях">
			<option value="av">Аварский (av)</option>
			<option value="ae">Авестийский (ae)</option>
			<option value="ak">Акан (ak)</option>
			<option value="bm">Бамана (bm)</option>
			<option value="bs">Боснийский (bs)</option>
			<option value="ve">Венда (ve)</option>
			<option value="hz">Гереро (hz)</option>
			<option value="ig">Игбо (ig)</option>
			<option value="id">Индонезийский (id)</option>
			<option value="ie">Интерлингве (ie)</option>
			<option value="kr">Канури (kr)</option>
			<option value="ki">Кикуйю (ki)</option>
			<option value="kj">Киньяма (kj)</option>
			<option value="kv">Коми (kv)</option>
			<option value="kg">Конго (kg)</option>
			<option value="kw">Корнский (kw)</option>
			<option value="lu">Луба-катанга (lu)</option>
			<option value="lg">Луганда (lg)</option>
			<option value="lb">Люксембургский (lb)</option>
			<option value="dv">Мальдивский (dv)</option>
			<option value="cm">Мандаринский (cm)</option>
			<option value="mh">Маршалльский (mh)</option>
			<option value="me">Мерянский (me)</option>
			<option value="gv">Мэнский (gv)</option>
			<option value="nv">Навахо (nv)</option>
			<option value="ng">Ндонга (ng)</option>
			<option value="nn">Новонорвежский (nn)</option>
			<option value="ny">Ньянджа (ny)</option>
			<option value="oj">Оджибве (oj)</option>
			<option value="os">Осетинский (os)</option>
			<option value="pi">Пали (pi)</option>
			<option value="sc">Сардинский (sc)</option>
			<option value="nd">Северный ндебеле (nd)</option>
			<option value="ty">Таитянский (ty)</option>
			<option value="fl">Филиппинский (fl)</option>
			<option value="ff">Фулах (ff)</option>
			<option value="ho">Хиримоту (ho)</option>
			<option value="cu">Церковнославянский (cu)</option>
			<option value="ch">Чаморро (ch)</option>
			<option value="ce">Чеченский (ce)</option>
			<option value="cv">Чувашский (cv)</option>
			<option value="ee">Эве (ee)</option>
			<option value="nr">Южный ндебеле (nr)</option>
			<option value="jv">Яванский (jv)</option>
	    </optgroup>
	    <optgroup label=" Устаревшие коды">
			<option value="bh">Бихарский (bh)</option>
			<option value="in">Индонезийский (in)</option>
			<option value="sh">Сербохорватский (sh)</option>
			<option value="jw">Яванский (jw)</option>
	    </optgroup>
  </xsl:template>

</xsl:stylesheet>