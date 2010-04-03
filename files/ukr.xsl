<?xml version="1.0" encoding="utf-8"?>

<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:l="http://www.w3.org/1999/xlink">

	<xsl:variable name="IDS_VIEW_BTN" select="'Показати'"/>
	<xsl:variable name="IDS_BINARY_OBJ" select="'Двійкові файли'"/>
	<xsl:variable name="IDS_BOOK" select="'Книга'"/>
	<xsl:variable name="IDS_GENRES" select="'Жанри'"/>
	<xsl:variable name="IDS_GENRE" select="'Жанр:'"/>
	<xsl:variable name="IDS_MATCH" select="'Відповідність (%):'"/>
	<xsl:variable name="IDS_AUTHORS" select="'Автори'"/>
	<xsl:variable name="IDS_TITLE" select="'Назва:'"/>
	<xsl:variable name="IDS_KEYWORDS" select="'Ключові слова:'"/>
	<xsl:variable name="IDS_DATE_TEXT" select="'Дата написання:'"/>
	<xsl:variable name="IDS_DATE_VALUE" select="'Значення дати:'"/>
	<xsl:variable name="IDS_COVERPAGE" select="'Обкладинка'"/>
	<xsl:variable name="IDS_IMAGE" select="'Зображення:'"/>
	<xsl:variable name="IDS_LANGUAGE" select="'Мова:'"/>
	<xsl:variable name="IDS_SOURCE_LANG" select="'Мова оригіналу:'"/>
	<xsl:variable name="IDS_TRANSLATORS" select="'Перекладачі'"/>
	<xsl:variable name="IDS_SEQUENCE" select="'Серія'"/>
	<xsl:variable name="IDS_STI" select="'Інформація про оригинал книги (заповнюється мовою оригіналу)'"/>
	<xsl:variable name="IDS_DOCUMENT" select="'FB2-документ'"/>
	<xsl:variable name="IDS_VERSION" select="'Версія:'"/>
	<xsl:variable name="IDS_NEW" select="'новий'"/>
	<xsl:variable name="IDS_ID" select="'ID:'"/>
	<xsl:variable name="IDS_TOOLS_USED" select="'Використані програми:'"/>
	<xsl:variable name="IDS_SOURCE_OCR" select="'Оцифровувач тексту-джерела:'"/>
	<xsl:variable name="IDS_SOURCE_URL" select="'URL тексту-джерела'"/>
	<xsl:variable name="IDS_PAPER_BOOK" select="'Паперова книга (видання)'"/>
	<xsl:variable name="IDS_BOOK_TITLE" select="'Заголовок книги:'"/>
	<xsl:variable name="IDS_PUBLISHER" select="'Видавництво:'"/>
	<xsl:variable name="IDS_CITY" select="'Місто:'"/>
	<xsl:variable name="IDS_YEAR" select="'Рік:'"/>
	<xsl:variable name="IDS_ISBN" select="'ISBN:'"/>	
	<xsl:variable name="IDS_CUSTOM_INFO" select="'Додаткова інформація'"/>
	<xsl:variable name="IDS_TYPE" select="'Тип:'"/>
	<xsl:variable name="IDS_VALUE" select="'Значення:'"/>
	<xsl:variable name="IDS_FIRST" select="'Ім’я:'"/>
	<xsl:variable name="IDS_MIDLE" select="'По батькові:'"/>
	<xsl:variable name="IDS_LAST" select="'Прізвище:'"/>
	<xsl:variable name="IDS_NICKNAME" select="'Псевдо(нім):'"/>
	<xsl:variable name="IDS_EMAIL" select="'Е-пошта:'"/>
	<xsl:variable name="IDS_WEBSITE" select="'Сайт:'"/>
	<xsl:variable name="IDS_NAME" select="'Назва:'"/>		
	<xsl:variable name="IDS_NUMBER" select="'Номер:'"/>		
        <xsl:variable name="IDS_STYLES_TABLE" select="'Таблиця стилів'"/>
	
	<xsl:template name="fill_languages_combo">
		<xsl:param name="lang"/>
		<option selected="yes" value="{$lang}">-org-</option>
        <option value=""></option>
	    <optgroup label="Основні">
			  <option value="uk">Українська (uk)</option>
	    	<option value="en">Англійська (en)</option>
		    <option value="ru">Російська (ru)</option>    
	    </optgroup>

	    <optgroup label="Європа">
			<option value="sq">Албанська (sq)</option>
			<option value="eu">Баскська (eu)</option>
			<option value="ba">Башкирська (ba)</option>
			<option value="be">Білоруська (be)</option>
			<option value="bg">Болгарська (bg)</option>
			<option value="br">Бретонська (br)</option>
			<option value="cy">Валлійська (cy)</option>
			<option value="gl">Галісійська (gl)</option>
			<option value="gd">Гельська (gd)</option>
			<option value="el">Грецька (el)</option>
			<option value="da">Данська (da)</option>
			<option value="nl">Датська (nl)</option>
			<option value="et">Естонська (et)</option>
			<option value="ga">Ірландська (ga)</option>
			<option value="is">Ісландська (is)</option>
			<option value="es">Іспанська (es)</option>
			<option value="it">Італійська (it)</option>
			<option value="ca">Каталанська (ca)</option>
			<option value="co">Корсиканська (co)</option>
			<option value="lv">Латвійська (lv)</option>
			<option value="la">Латина (la)</option>
			<option value="lt">Литовська (lt)</option>
			<option value="mk">Македонська (mk)</option>
			<option value="mt">Мальтійська (mt)</option>
			<option value="mo">Молдавська (mo)</option>
			<option value="de">Німецька (de)</option>
			<option value="no">Норвезька (no)</option>
			<option value="oc">Окситанська (oc)</option>
			<option value="pl">Польська (pl)</option>		
			<option value="pt">Португальська (pt)</option>
			<option value="ro">Румунська (ro)</option>
			<option value="ry">Русинська (ry)</option>
			<option value="rm">Ретороманська (rm)</option>
			<option value="sh">Сербо-Хорватська (sh)</option>
			<option value="sr">Сербська (sr)</option>
			<option value="sk">Словацька (sk)</option>
			<option value="sl">Словенська (sl)</option>
			<option value="tt">Татарська (tt)</option>
			<option value="hu">Угорська (hu)</option>
			<option value="fo">Фарерська (fo)</option>
			<option value="fi">Фінська (fi)</option>
			<option value="fr">Французька (fr)</option>
			<option value="fy">Фризька (fy)</option>
			<option value="hr">Хорватська (hr)</option>
			<option value="cu">Церковнослов'янська (cu)</option>
			<option value="cs">Чеська (cs)</option>
			<option value="sv">Шведська (sv)</option>
	    </optgroup>

	    <optgroup label="Азія">
			<option value="ab">Абхазька (ab)</option>
			<option value="az">Азербайджанська (az)</option>
			<option value="ar">Арабська (ar)</option>
			<option value="as">Ассамська (as)</option>
			<option value="bn">Бенгальська (bn)</option>
			<option value="vi">В'єтнамська (vi)</option>
			<option value="hy">Вірменська (hy)</option>
			<option value="my">Бірманська (my)</option>
			<option value="bh">Біхарська (bh)</option>
			<option value="he">Гебрейська/Іврит (he)</option>
			<option value="hi">Гінді (hi)</option>
			<option value="ka">Грузинська (ka)</option>
			<option value="gu">Ґуджаратська (gu)</option>
			<option value="dz">Дзонґкха (dz)</option>
			<option value="in">Індонезійська (in)</option>
			<option value="kk">Казахська (kk)</option>
			<option value="kn">Каннада (kn)</option>
			<option value="ks">Кашмірська (ks)</option>
			<option value="ky">Киргизька (ky)</option>
			<option value="zh">Китайська (zh)</option>
			<option value="ko">Корейська (ko)</option>
			<option value="ku">Курдська (ku)</option>
			<option value="km">Кхмерська (km)</option>
			<option value="lo">Лаоська (lo)</option>
			<option value="mg">Малаґасійська (mg)</option>
			<option value="ms">Малайська (ms)</option>
			<option value="ml">Малаялам (ml)</option>
			<option value="mi">Маорі (mi)</option>
			<option value="mr">Маратхі (mr)</option>
			<option value="mn">Монгольська (mn)</option>
			<option value="na">Науруанська (na)</option>
			<option value="ne">Непальська (ne)</option>
			<option value="or">Орія (or)</option>
			<option value="pa">Панджабі (pa)</option>
			<option value="pi">Палі (pi)</option>
			<option value="fa">Перська (fa)</option>
			<option value="sm">Самоанська (sm)</option>
			<option value="sa">Санскрит (sa)</option>
			<option value="si">Сінгальська (si)</option>
			<option value="sd">Сіндхі (sd)</option>
			<option value="tl">Тагальська (tl)</option>
			<option value="tg">Таджицька (tg)</option>
			<option value="th">Тайська (th)</option>
			<option value="ta">Тамільська (ta)</option>
			<option value="te">Телуґу (te)</option>
			<option value="bo">Тибетська (bo)</option>
			<option value="tr">Турецька (tr)</option>
			<option value="tk">Туркменська (tk)</option>
			<option value="uz">Узбецька (uz)</option>
			<option value="ug">Уйгурська (ug)</option>
			<option value="ur">Урду (ur)</option>
			<option value="fj">Фіджійська (fj)</option>
			<option value="za">Чжуанська (za)</option>
			<option value="jw">Яванська (jw)</option>
			<option value="ja">Японська (ja)</option>
	    </optgroup>

	      <optgroup label="Америка">
			<option value="ay">Аймара (ay)</option>
			<option value="kl">Гренландська (kl)</option>
			<option value="gn">Ґуарані (gn)</option>
			<option value="qu">Кечуа (qu)</option>
	    </optgroup>

	    <optgroup label="Африка">
			<option value="am">Амхарська (am)</option>
			<option value="aa">Афарська (aa)</option>
			<option value="af">Африкаанс (af)</option>
			<option value="wo">Волоф (wo)</option>
			<option value="zu">Зулу (zu)</option>
			<option value="yo">Йоруба (yo)</option>
			<option value="xh">Ксоза (xh)</option>
			<option value="ss">Сваті (ss)</option>
			<option value="sw">Свахілі (sw)</option>
			<option value="st">Сесото (st)</option>
			<option value="so">Сомалійська (so)</option>
			<option value="su">Сунданська (su)</option>
			<option value="to">Тонґанська (to)</option>
			<option value="tn">Тсвана (tn)</option>
			<option value="ts">Тсонґа (ts)</option>
			<option value="ha">Хауса (ha)</option>
			<option value="sn">Шона (sn)</option>
	    </optgroup>

	    <optgroup label="Штучні">
			<option value="vo">Волапюк (vo)</option>
			<option value="eo">Есперанто (eo)</option>
			<option value="ia">Інтерлінґва (ia)</option>
			<option value="yi">Їдиш (yi)</option>
	    </optgroup>

	    <optgroup label="Інші">
			<option value="bi">Біслама (bi)</option>
			<option value="iu">Інуктітут (iu)</option>
			<option value="ik">Інюпіак (ik)</option>
			<option value="rw">Кіньяруанда (rw)</option>
			<option value="ln">Лінґала (ln)</option>
			<option value="om">Оромо (om)</option>
			<option value="ps">Пушту (ps)</option>
			<option value="rn">Рунді (rn)</option>
			<option value="sg">Санґо (sg)</option>
			<option value="ti">Тіґрінья (ti)</option>
			<option value="tw">Тві (tw)</option>
	    </optgroup>
  </xsl:template>

</xsl:stylesheet>