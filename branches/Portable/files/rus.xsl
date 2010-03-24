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
	<xsl:variable name="IDS_DATE_VALUE" select="'Значение даты:'"/>
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
	
	<xsl:template name="fill_languages_combo">
		<xsl:param name="lang"/>
		<option selected="yes" value="{$lang}">-org-</option>
        <option value=""></option>
	    <optgroup label="Main">
		    <option value="ru">Russian (ru)</option>
	    	<option value="en">English (en)</option>
	    </optgroup>

	    <optgroup label="Europe">
			<option value="sq">Albanian (sq)</option>
			<option value="ba">Bashkir (ba)</option>
			<option value="eu">Basque (eu)</option>
			<option value="br">Breton (br)</option>
			<option value="bg">Bulgarian (bg)</option>
			<option value="be">Byelorussian (be)</option>
			<option value="ca">Catalan (ca)</option>
			<option value="co">Corsican (co)</option>
			<option value="hr">Croatian (hr)</option>
			<option value="cs">Czech (cs)</option>
			<option value="da">Danish (da)</option>
			<option value="nl">Dutch (nl)</option>
			<option value="et">Estonian (et)</option>
			<option value="fo">Faroese (fo)</option>
			<option value="fi">Finnish (fi)</option>
			<option value="fr">French (fr)</option>
			<option value="fy">Frisian (fy)</option>
			<option value="gl">Galician (gl)</option>
			<option value="de">German (de)</option>
			<option value="el">Greek (el)</option>
			<option value="hu">Hungarian (hu)</option>
			<option value="is">Icelandic (is)</option>
			<option value="ga">Irish (ga)</option>
			<option value="it">Italian (it)</option>
			<option value="la">Latin (la)</option>
			<option value="lv">Latvian (lv)</option>
			<option value="lt">Lithuanian (lt)</option>
			<option value="mk">Macedonian (mk)</option>
			<option value="mt">Maltese (mt)</option>
			<option value="mo">Moldavian (mo)</option>
			<option value="no">Norwegian (no)</option>
			<option value="oc">Occitan (oc)</option>
			<option value="pl">Polish (pl)</option>
			<option value="pt">Portuguese (pt)</option>
			<option value="rm">Rhaeto-Romance (rm)</option>
			<option value="ro">Romanian (ro)</option>
			<option value="gd">Scots Gaelic (gd)</option>
			<option value="sr">Serbian (sr)</option>
			<option value="sh">Serbo-Croatian (sh)</option>
			<option value="sk">Slovak (sk)</option>
			<option value="sl">Slovenian (sl)</option>
			<option value="es">Spanish (es)</option>
			<option value="sv">Swedish (sv)</option>
			<option value="tt">Tatar (tt)</option>
			<option value="uk">Ukrainian (uk)</option>
			<option value="cy">Welsh (cy)</option>
	    </optgroup>

	    <optgroup label="Asia">
			<option value="ab">Abkhazian (ab)</option>
			<option value="ar">Arabic (ar)</option>
			<option value="hy">Armenian (hy)</option>
			<option value="as">Assamese (as)</option>
			<option value="az">Azerbaijani (az)</option>
			<option value="bn">Bengali (bn)</option>
			<option value="dz">Bhutani (dz)</option>
			<option value="bh">Bihari (bh)</option>
			<option value="my">Burmese (my)</option>
			<option value="km">Cambodian (km)</option>
			<option value="zh">Chinese (zh)</option>
			<option value="fj">Fiji (fj)</option>
			<option value="ka">Georgian (ka)</option>
			<option value="gu">Gujarati (gu)</option>
			<option value="he">Hebrew (he)</option>
			<option value="hi">Hindi (hi)</option>
			<option value="in">Indonesian (in)</option>
			<option value="ja">Japanese (ja)</option>
			<option value="jw">Javanese (jw)</option>
			<option value="kn">Kannada (kn)</option>
			<option value="ks">Kashmiri (ks)</option>
			<option value="kk">Kazakh (kk)</option>
			<option value="ky">Kirghiz (ky)</option>
			<option value="ko">Korean (ko)</option>
			<option value="ku">Kurdish (ku)</option>
			<option value="lo">Laotian (lo)</option>
			<option value="mg">Malagasy (mg)</option>
			<option value="ms">Malay (ms)</option>
			<option value="ml">Malayalam (ml)</option>
			<option value="mi">Maori (mi)</option>
			<option value="mr">Marathi (mr)</option>
			<option value="mn">Mongolian (mn)</option>
			<option value="na">Nauru (na)</option>
			<option value="ne">Nepali (ne)</option>
			<option value="or">Oriya (or)</option>
			<option value="fa">Persian (fa)</option>
			<option value="pa">Pundjabi (pa)</option>
			<option value="sm">Samoan (sm)</option>
			<option value="sa">Sanskrit (sa)</option>
			<option value="sd">Sindhi (sd)</option>
			<option value="si">Singhalese (si)</option>
			<option value="tl">Tagalog (tl)</option>
			<option value="tg">Tajik (tg)</option>
			<option value="ta">Tamil (ta)</option>
			<option value="te">Telugu (te)</option>
			<option value="th">Thai (th)</option>
			<option value="bo">Tibetan (bo)</option>
			<option value="tr">Turkish (tr)</option>
			<option value="tk">Turkman (tk)</option>
			<option value="ug">Uigur (ug)</option>
			<option value="ur">Urdu (ur)</option>
			<option value="uz">Uzbek (uz)</option>
			<option value="vi">Vietnamese (vi)</option>
			<option value="za">Zhuang (za)</option>
	    </optgroup>

	      <optgroup label="America">
			<option value="ay">Aymara (ay)</option>
			<option value="kl">Greenlandic (kl)</option>
			<option value="gn">Guarani (gn)</option>
			<option value="qu">Quechua (qu)</option>
	    </optgroup>

	    <optgroup label="Africa">
			<option value="aa">Afar (aa)</option>
			<option value="af">Afrikaans (af)</option>
			<option value="am">Amharic (am)</option>
			<option value="ha">Hausa (ha)</option>
			<option value="st">Sesotho (st)</option>
			<option value="tn">Setswana (tn)</option>
			<option value="sn">Shona (sn)</option>
			<option value="ss">Siswati (ss)</option>
			<option value="so">Somali (so)</option>
			<option value="su">Sudanese (su)</option>
			<option value="sw">Swahili (sw)</option>
			<option value="to">Tonga (to)</option>
			<option value="ts">Tsonga (ts)</option>
			<option value="wo">Wolof (wo)</option>
			<option value="xh">Xhosa (xh)</option>
			<option value="yo">Yorouba (yo)</option>
			<option value="zu">Zulu (zu)</option>
	    </optgroup>

	    <optgroup label="Artificial">
			<option value="eo">Esperanto (eo)</option>
			<option value="ia">Interlingua (ia)</option>
			<option value="vo">Volapuk (vo)</option>
			<option value="yi">Yiddish (yi)</option>
	    </optgroup>

	    <optgroup label="Other">
			<option value="bi">Bislama (bi)</option>
			<option value="iu">Inuktitut (iu)</option>
			<option value="ik">Inupiak (ik)</option>
			<option value="rn">Kirundi (rn)</option>
			<option value="rw">Kiyarwanda (rw)</option>
			<option value="ln">Lingala (ln)</option>
			<option value="om">Oromo (om)</option>
			<option value="ps">Pashto (ps)</option>
			<option value="sg">Sangho (sg)</option>
			<option value="ti">Tigrinya (ti)</option>
			<option value="tw">Twi (tw)</option>
	    </optgroup>
  </xsl:template>

</xsl:stylesheet>