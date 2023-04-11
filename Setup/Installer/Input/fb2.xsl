<?xml version="1.0" encoding="utf-8"?>

<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:f="http://www.gribuser.ru/xml/fictionbook/2.0"
	xmlns:l="http://www.w3.org/1999/xlink">

	<xsl:import href="eng.xsl"/>

	<xsl:output method="html" indent="no"/>

	<xsl:param name="dlgFG"/>
	<xsl:param name="dlgBG"/>
	<xsl:param name="descscript"/>

	<!-- colors and fonts -->
	<xsl:param name="font" select="'Trebuchet MS'"/>
	<xsl:param name="fontSize" select="'12'"/>
	<xsl:param name="colorFG"/>
	<xsl:param name="colorBG"/>

	<xsl:template match="/" mode="description">
		<div class="float" id="prevImgPanel">
			<img id="prevImg"/>
		</div>

		<div class="float" id="fullImgPanel" align="center">
			<img id="fullImg" onclick="HideFullImage()"/>
		</div>

		<fieldset style="border:none">
			<button id="tiShowBtn" onclick="ShowElementsMenu(this)" unselectable="on" style="font-family: Tahoma; float: left;">
				<xsl:value-of select="$IDS_VIEW_BTN"/>
			</button>
		</fieldset>
		<br/>

	<!-- title-info -->
	<xsl:call-template name="ti">
		<xsl:with-param name="cur" select="/f:FictionBook/f:description/f:title-info"/>
	</xsl:call-template>

	<!-- source-title-info -->
	<xsl:if test="not(/f:FictionBook/f:description/f:src-title-info)">
		<span id = "sti_all" block="true">
			<xsl:call-template name="sti">
				<xsl:with-param name="cur" select="/f:FictionBook/f:description/f:src-title-info"/>
			</xsl:call-template>
		</span>
	</xsl:if>
	<xsl:if test="(/f:FictionBook/f:description/f:src-title-info)">
		<xsl:call-template name="sti">
			<xsl:with-param name="cur" select="/f:FictionBook/f:description/f:src-title-info"/>
		</xsl:call-template>
	</xsl:if>

	<!-- document-info -->
	<xsl:call-template name="di">
		<xsl:with-param name="cur" select="/f:FictionBook/f:description/f:document-info"/>
	</xsl:call-template>

	<!-- publish-info -->
	<xsl:call-template name="pi">
		<xsl:with-param name="cur" select="/f:FictionBook/f:description/f:publish-info"/>
	</xsl:call-template>

	<!-- custom-info -->
	<xsl:if test="not(/f:FictionBook/f:description/f:custom-info)">
		<span id = "ci_all" block="true">
			<xsl:call-template name="custom-info">
				<xsl:with-param name="items" select="/f:FictionBook/f:description/f:custom-info"/>
			</xsl:call-template>
		</span>
	</xsl:if>
	<xsl:if test="/f:FictionBook/f:description/f:custom-info">
		<xsl:call-template name="custom-info">
				<xsl:with-param name="items" select="/f:FictionBook/f:description/f:custom-info"/>
		</xsl:call-template>
	</xsl:if>

		<!-- binary objects -->
		<fieldset id="binobj" unselectable="on">
			<legend unselectable="on" class="top"><xsl:value-of select="$IDS_BINARY_OBJ"/></legend>
			<br/>
		</fieldset>
		<br/>
        <fieldset unselectable="on">
         <legend unselectable="on" class="top"><xsl:value-of select="$IDS_STYLES_TABLE"/></legend>
         <textarea id="stylesheetId" rows="10"><xsl:value-of select="/f:FictionBook/f:stylesheet"/></textarea>
        </fieldset>
	</xsl:template>

  <xsl:template match="/" mode="body">
	<!-- book annotation -->
	  <div class="annotation">
	    <xsl:apply-templates select="/f:FictionBook/f:description/f:title-info/f:annotation/*"/>
	    <xsl:if test="not(/f:FictionBook/f:description/f:title-info/f:annotation/*)">
	      <p/>
	    </xsl:if>
	  </div>
	<!-- book history -->
	  <div class="history">
	    <xsl:apply-templates select="/f:FictionBook/f:description/f:document-info/f:history/*"/>
	    <xsl:if test="not(/f:FictionBook/f:description/f:document-info/f:history/*)">
	      <p/>
	    </xsl:if>
	  </div>
	<!-- bodies -->
	<xsl:apply-templates select="/f:FictionBook/f:body"/>
	<xsl:if test="not(/f:FictionBook/f:body)">
	  <div class="body">
	    <div class="title">
	      <p/>
	    </div>
	    <div class="section">
	      <p/>
	    </div>
	  </div>
	</xsl:if>
  </xsl:template>

  <!-- structure -->
  <xsl:template match="f:body">
    <div class="body" fbname="{@name}"><!-- container -->
      <xsl:apply-templates/>
    </div>
  </xsl:template>


  <!--xsl:template match="f:section">
    <div class="hider" contentEditable='false' unselectable="on"><a contentEditable='false' href="" style="text-decoration:none" onclick="HideSec(this);return false;">+</a></div>
    <div class="{local-name()}">
      <xsl:call-template name="id"/>
      <xsl:apply-templates/>
    </div>
  </xsl:template-->

  <xsl:template match="f:section | f:annotation | f:epigraph | f:cite | f:poem | f:stanza | f:title">
    <div class="{local-name()}"><!-- container -->
      <xsl:call-template name="id"/>
      <!-- element content -->
      <xsl:apply-templates/>
    </div>
  </xsl:template>

     <!-- table -->
      
  
  <xsl:template match="f:table">
    <div class="table">
      <xsl:call-template name="id"/>
      <xsl:call-template name="style"/>
      <xsl:apply-templates/>
    </div>
  </xsl:template> 
  
    <xsl:template match="f:tr">
    <div class="tr">
      <xsl:call-template name="id"/>
      <xsl:call-template name="align"/>
      <xsl:apply-templates/>
    </div>
  </xsl:template>   
 
  <!-- text -->
  <xsl:template match="f:p | f:v">
    <p><xsl:call-template name="id"/><xsl:call-template name="style"/><xsl:apply-templates/></p>
  </xsl:template>
  <xsl:template match="f:empty-line">
    <p><xsl:call-template name="id"/></p>
  </xsl:template>
  <xsl:template match="f:text-author | f:subtitle">
    <p class="{local-name()}">
      <xsl:call-template name="id"/>
      <xsl:apply-templates/>
    </p>
  </xsl:template>
  <xsl:template match="f:date">
    <p class="text-author">
      <xsl:call-template name="id"/>
      <xsl:apply-templates/>
    </p>
  </xsl:template>
  
   <xsl:template match="f:th | f:td">
    <p class="{local-name()}">
      <xsl:call-template name="id"/>
      <xsl:call-template name="style"/>
      <xsl:call-template name="colspan"/> 
      <xsl:call-template name="rowspan"/>
      <xsl:call-template name="align"/>  
      <xsl:call-template name="valign"/>
      <xsl:apply-templates/>
    </p>
  </xsl:template>  

  <!-- inline -->
  <xsl:template match="f:emphasis">
    <em><xsl:apply-templates/></em>
  </xsl:template>
  <xsl:template match="f:strong">
    <strong><xsl:apply-templates/></strong>
  </xsl:template>
  <xsl:template match="f:style">
    <span class="{@name}"><xsl:apply-templates/></span>
  </xsl:template>
  <xsl:template match="f:a">
    <a class="{@type}" href="{@l:href}"><xsl:apply-templates/></a>
  </xsl:template>
  <xsl:template match="f:strikethrough">
    <STRIKE><xsl:apply-templates/></STRIKE>
  </xsl:template>  
  <xsl:template match="f:sub">
    <SUB><xsl:apply-templates/></SUB>
  </xsl:template>
  <xsl:template match="f:sup">
    <SUP><xsl:apply-templates/></SUP>
  </xsl:template>
  <xsl:template match="f:code">
    <span class="code"><xsl:apply-templates/></span>
  </xsl:template>
  <!-- Added by SeNS -->
  <!-- inline images -->
  <xsl:template match="f:p//f:image | f:subtitle//f:image | f:text-author//f:image | f:td//f:image | f:th//f:image | f:v//f:image">
   <span onresizestart="return false" class='image' contentEditable='false' href="{@l:href}">
	<xsl:call-template name="image_title"/>
	<img src="fbw-internal:{@l:href}"/>
   </span>
  </xsl:template>

  <!-- images -->
  <xsl:template match="f:image">
   <div onresizestart="return false" class='image' contentEditable='false' href="{@l:href}">
	<xsl:call-template name="image_title"/>
        <xsl:call-template name="id"/>
	<img src="fbw-internal:{@l:href}"/>
   </div>
  </xsl:template>      
  
  <xsl:template match="*">
    <span class="unknown_element" source_class="{local-name()}">
		<xsl:for-each select="@*">
			<xsl:attribute name="unknown_attribute_{name()}"><xsl:value-of select="."/></xsl:attribute>
		</xsl:for-each>
		<xsl:apply-templates/>
	</span>
  </xsl:template>   

 
 <!-- IDs -->
  <xsl:template name="id">
    <xsl:if test="@id">
      <xsl:attribute name="id"><xsl:value-of select="@id"/></xsl:attribute>
    </xsl:if>
  </xsl:template>

  <xsl:template name="image_title">
    <xsl:if test="@title">
      <xsl:attribute name="title"><xsl:value-of select="@title"/></xsl:attribute>
    </xsl:if>
  </xsl:template>
  
  <!-- paragraph styles -->
  <xsl:template name="style">
    <xsl:if test="@style">
      <xsl:attribute name="fbstyle"><xsl:value-of select="@style"/></xsl:attribute>
    </xsl:if>
  </xsl:template>


    <xsl:template name="align">
    <xsl:if test="@align">
      <xsl:attribute name="fbalign"><xsl:value-of select="@align"/></xsl:attribute>
    </xsl:if>
  </xsl:template>  
  <xsl:template name="valign">
    <xsl:if test="@valign">
      <xsl:attribute name="fbvalign"><xsl:value-of select="@valign"/></xsl:attribute>
    </xsl:if>
  </xsl:template>   
  
  <!-- table colspans -->
  <xsl:template name="colspan">
    <xsl:if test="@colspan">
      <xsl:attribute name="fbcolspan"><xsl:value-of select="@colspan"/></xsl:attribute>
    </xsl:if>
  </xsl:template>
  
  <!-- table rowspans -->
  <xsl:template name="rowspan">
    <xsl:if test="@rowspan">
      <xsl:attribute name="fbrowspan"><xsl:value-of select="@rowspan"/></xsl:attribute>
    </xsl:if>
  </xsl:template>

	<!-- title-info -->
	<xsl:template name="ti">
		<xsl:param name="cur"/>
		<fieldset unselectable="on">
			<legend unselectable="on" class="top"><xsl:value-of select="$IDS_BOOK"/></legend>
			<fieldset id="tiGenre" unselectable="on" class="kid">
				<legend unselectable="on"><xsl:value-of select="$IDS_GENRES"/></legend>
				<xsl:for-each select="$cur/f:genre">
					<div unselectable="on">
						<button id="del" onclick="Remove(this.parentNode)" unselectable="on">&#x72;</button>
						<button onclick="Clone(this.parentNode)" unselectable="on">&#x32;</button>
						<label unselectable="on" class="hl"><xsl:value-of select="$IDS_GENRE"/></label><input type="text" maxlength="25" id="genre" value="{.}" disabled="1"/>
						<button class="popup_btn" onclick="GetGenre(this)" unselectable="on">&#x34;</button>
						<xsl:if test="not(@match)">
							<span id = "ti_genre_match" unselectable="on">
								<button onclick="ShowElement(this.parentNode.id, false)" unselectable="on" style="font-family : Tahoma;">-</button>
								<label unselectable="on"><xsl:value-of select="$IDS_MATCH"/></label><input type="text" maxlength="3" id="match" value="{@match}" class="short"/>
							</span>
						</xsl:if>
						<xsl:if test="@match">
							<label unselectable="on"><xsl:value-of select="$IDS_MATCH"/></label><input type="text" maxlength="3" id="match" value="{@match}" class="short"/>
						</xsl:if>
					</div>
				</xsl:for-each>
				<xsl:if test="not($cur/f:genre)">
					<div unselectable="on">
						<button id="del" onclick="Remove(this.parentNode)" unselectable="on">&#x72;</button>
						<button onclick="Clone(this.parentNode)" unselectable="on">&#x32;</button>
						<label unselectable="on" class="hl"><xsl:value-of select="$IDS_GENRE"/></label>
						<input type="text" maxlength="25" id="genre" value="" disabled="1"/>
						<button onclick="GetGenre(this)" unselectable="on">&#x34;</button>			
					</div>
				</xsl:if>
			</fieldset>
			<br/>
      <fieldset id="tiAuthor" unselectable="on" class="kid">
		<legend unselectable="on"><xsl:value-of select="$IDS_AUTHORS"/></legend>
		<xsl:call-template name="authors_main">
		  <xsl:with-param name="items" select="$cur/f:author"/>
		</xsl:call-template>
	  </fieldset>
	  <br/><br/>
	  <label unselectable="on" class="hl"><xsl:value-of select="$IDS_TITLE"/></label>
	  <input type="text" maxlength="256" id="tiTitle" class="wide" value="{$cur/f:book-title}"/><br/>
	  <xsl:if test="not($cur/f:keywords)">
		  <span id = "ti_kw" unselectable="on">
				<!--<button id="kwCollapse" onclick="ShowElement(this.parentNode.id, false)" unselectable="on" style="font-family : Tahoma;">-</button>-->
				<label unselectable="on" desc_extended="true"><xsl:value-of select="$IDS_KEYWORDS"/></label>
				<input type="text" maxlength="256" id="tiKwd" class="wide" value="{$cur/f:keywords}"/><br/>
		  </span>
	  </xsl:if>
	  <xsl:if test="$cur/f:keywords">
		<label unselectable="on" desc_extended="true"><xsl:value-of select="$IDS_KEYWORDS"/></label>
		<input type="text" maxlength="256" id="tiKwd" class="wide" value="{$cur/f:keywords}"/><br/>
	  </xsl:if>
	  <label unselectable="on"><xsl:value-of select="$IDS_DATE_TEXT"/></label>
	  <input type="text" maxlength="256" id="tiDate" value="{$cur/f:date}"/>
	  <label unselectable="on" style="width:6.4em"><xsl:value-of select="$IDS_DATE_VALUE"/></label>
	  <input type="text" maxlength="256" id="tiDateVal" value="{$cur/f:date/@value}"/><br/>
      <fieldset id="tiCover" unselectable="on" class="kid">
	<legend class="cover" unselectable="on"><xsl:value-of select="$IDS_COVERPAGE"/></legend>
	<xsl:for-each select="$cur/f:coverpage/f:image">
	  <div unselectable="on">
	    <button id="del" onclick="Remove(this.parentNode)" unselectable="on">&#x72;</button>
	    <button onclick="Clone(this.parentNode)" unselectable="on">&#x32;</button>
	    <button id="show" onmouseover="ShowCoverImage(this.parentNode,false);" onmouseout="HidePrevImage();" onclick="ShowCoverImage(this.parentNode,true);">&#x4e;</button>
	    <label unselectable="on"><xsl:value-of select="$IDS_IMAGE"/></label>
		<select id="href" class="wide">
		<option selected="yes" value="{@l:href}"></option>
		</select>
	  </div>
	</xsl:for-each>
	<xsl:if test="not($cur/f:coverpage/f:image)">
	  <div unselectable="on">
	    <button id="del" onclick="Remove(this.parentNode)" unselectable="on">&#x72;</button>
	    <button onclick="Clone(this.parentNode)" unselectable="on">&#x32;</button>
	    <label unselectable="on"><xsl:value-of select="$IDS_IMAGE"/></label>
		<select id="href" class="wide" ></select>
	  </div>
	</xsl:if>
      </fieldset>
	  <br/><br/>
      <label unselectable="on" class="hl"><xsl:value-of select="$IDS_LANGUAGE"/></label>
      <!--input type="text" maxlength="2" id="tiLang" class="short" value="{$cur/f:lang}"/-->

      <select id="tiLang" title="Language of the text" onchange="document.getElementById('fbw_updater').innerHTML=document.getElementById('fbw_updater').innerHTML=='0'?'1':'0';">
		<xsl:call-template name="fill_languages_combo">
			<xsl:with-param name="lang" select="$cur/f:lang"/>
		</xsl:call-template>
      </select>

      <label unselectable="on" style="width: 10em"><xsl:value-of select="$IDS_SOURCE_LANG"/></label>
      
      <select id="tiSrcLang" title="Original language">
		<xsl:call-template name="fill_languages_combo">
			<xsl:with-param name="lang" select="$cur/f:src-lang"/>
		</xsl:call-template>
      </select>
      <br/>
      <fieldset id="tiTrans" unselectable="on" class="kid">
	<legend unselectable="on"><xsl:value-of select="$IDS_TRANSLATORS"/></legend>
	<xsl:call-template name="authors">
	  <xsl:with-param name="items" select="$cur/f:translator"/>
	</xsl:call-template>
      </fieldset>
			<br/>
      <fieldset id="tiSeq" unselectable="on" class="kid">
      <br/>
	<legend unselectable="on"><xsl:value-of select="$IDS_SEQUENCE"/></legend>
	<xsl:for-each select="$cur/f:sequence">
	  <xsl:call-template name="seq">
	    <xsl:with-param name="item" select="."/>
	  </xsl:call-template>
	</xsl:for-each>
	<xsl:if test="not($cur/f:sequence)">
	  <xsl:call-template name="seq">
	    <xsl:with-param name="item" select="."/>
	  </xsl:call-template>
	</xsl:if>
      </fieldset>	 
    </fieldset>
    <br/>
  </xsl:template>

  
  <!-- source title-info -->
  <xsl:template name="sti">
    <xsl:param name="cur"/>

	<fieldset unselectable="on">
	    <legend unselectable="on" class="top"><xsl:value-of select="$IDS_STI"/><xsl:if test="not($cur)"><button onclick="ShowElement(this.parentNode.parentNode.parentNode.id, false)" unselectable="on" style="font-family : Tahoma; float:none">-</button></xsl:if></legend>
	    <fieldset id="stiGenre" unselectable="on" class="kid">
			<legend unselectable="on"><xsl:value-of select="$IDS_GENRES"/></legend>
			<xsl:for-each select="$cur/f:genre">
				<div unselectable="on">
					<button id="del" onclick="Remove(this.parentNode)" unselectable="on">&#x72;</button>
					<button onclick="Clone(this.parentNode)" unselectable="on">&#x32;</button>
					<label unselectable="on" class="hl"><xsl:value-of select="$IDS_GENRE"/></label><input type="text" maxlength="25" id="genre" value="{.}" disabled="1"/>
					<button class="popup_btn" onclick="GetGenre(this)" unselectable="on">&#x34;</button>	
					<label unselectable="on"><xsl:value-of select="$IDS_MATCH"/></label><input type="text" maxlength="3" id="match" value="{@match}" class="short"/>
				</div>
			</xsl:for-each>
			<xsl:if test="not($cur/f:genre)">
				<div unselectable="on">
					<button id="del" onclick="Remove(this.parentNode)" unselectable="on">&#x72;</button>
					<button onclick="Clone(this.parentNode)" unselectable="on">&#x32;</button>
					<label unselectable="on" class="hl"><xsl:value-of select="$IDS_GENRE"/></label><input type="text" maxlength="25" id="genre" value="" disabled="1"/>
					<button class="popup_btn" onclick="GetGenre(this)" unselectable="on">&#x34;</button>
					<label unselectable="on"><xsl:value-of select="$IDS_MATCH"/></label><input type="text" maxlength="3" id="match" value="" class="short"/>
				</div>
			</xsl:if>
	    </fieldset>
	    <fieldset id="stiAuthor" unselectable="on" class="kid">
			<legend unselectable="on"><xsl:value-of select="$IDS_AUTHORS"/></legend>
			<xsl:call-template name="authors_main">
				<xsl:with-param name="items" select="$cur/f:author"/>
			</xsl:call-template>
		</fieldset>
		<br/><br/><br/>
		<label unselectable="on" class="hl"><xsl:value-of select="$IDS_TITLE"/></label>
		<input type="text" maxlength="256" id="stiTitle" class="wide" value="{$cur/f:book-title}"/><br/>
		<label unselectable="on"><xsl:value-of select="$IDS_KEYWORDS"/></label>
		<input type="text" maxlength="256" id="stiKwd" class="wide" value="{$cur/f:keywords}"/><br/>
		<label unselectable="on"><xsl:value-of select="$IDS_DATE_TEXT"/></label>
		<input type="text" maxlength="256" id="stiDate" value="{$cur/f:date}"/>
		<label unselectable="on" style="width:6.4em"><xsl:value-of select="$IDS_DATE_VALUE"/></label>
		<input type="text" maxlength="256" id="stiDateVal" value="{$cur/f:date/@value}"/><br/>
	    <fieldset id="stiCover" unselectable="on" class="kid">
			<legend class="cover" unselectable="on"><xsl:value-of select="$IDS_COVERPAGE"/></legend>
			<xsl:for-each select="$cur/f:coverpage/f:image">
				<div unselectable="on">
					<button id="del" onclick="Remove(this.parentNode)" unselectable="on">&#x72;</button>
					<button onclick="Clone(this.parentNode)" unselectable="on">&#x32;</button>
	    			<button id="show" onmouseover="ShowCoverImage(this.parentNode,false);" onmouseout="HidePrevImage();" onclick="ShowCoverImage(this.parentNode,true);">&#x4e;</button>
					<label unselectable="on"><xsl:value-of select="$IDS_IMAGE"/></label>
					<select id="href" class="wide">
						<option selected="yes" value="{@l:href}"></option>
					</select>
				</div>
			</xsl:for-each>
			<xsl:if test="not($cur/f:coverpage/f:image)">
				<div unselectable="on">
					<button id="del" onclick="Remove(this.parentNode)" unselectable="on">&#x72;</button>
					<button onclick="Clone(this.parentNode)" unselectable="on">&#x32;</button>
					<label unselectable="on"><xsl:value-of select="$IDS_IMAGE"/></label>
					<select id="href" class="wide" ></select>
				</div>
			</xsl:if>
	    </fieldset>
		<br/><br/>
	    <label unselectable="on" class="hl"><xsl:value-of select="$IDS_LANGUAGE"/></label>
	    <!--input type="text" maxlength="2" id="tiLang" class="short" value="{$cur/f:lang}"/-->

	    <select id="stiLang" title="Language of the text">
			<xsl:call-template name="fill_languages_combo">
				<xsl:with-param name="lang" select="$cur/f:lang"/>
			</xsl:call-template>
	    </select>

	    <label unselectable="on" style="width: 10em"><xsl:value-of select="$IDS_SOURCE_LANG"/></label>
	    <!--input type="text" maxlength="2" id="tiSrcLang" class="short" value="{$cur/f:src-lang}"/-->

	    <select id="stiSrcLang" title="Original language">
			<xsl:call-template name="fill_languages_combo">
				<xsl:with-param name="lang" select="$cur/f:src-lang"/>
			</xsl:call-template>
	    </select>
	    
	    <br/>
	    <fieldset id="stiTrans" unselectable="on" class="kid">
			<legend unselectable="on"><xsl:value-of select="$IDS_TRANSLATORS"/></legend>
			<xsl:call-template name="authors">
				<xsl:with-param name="items" select="$cur/f:translator"/>
			</xsl:call-template>
	    </fieldset>
	    <fieldset id="stiSeq" unselectable="on" class="kid">
		    <br/>
			<legend unselectable="on"><xsl:value-of select="$IDS_SEQUENCE"/></legend>
			<xsl:for-each select="$cur/f:sequence">
				<xsl:call-template name="seq">
					<xsl:with-param name="item" select="."/>
				</xsl:call-template>
			</xsl:for-each>
			<xsl:if test="not($cur/f:sequence)">
				<xsl:call-template name="seq">
					<xsl:with-param name="item" select="."/>
				</xsl:call-template>
			</xsl:if>
		 </fieldset>
	</fieldset>
    <br/>
  </xsl:template>

	<!-- document-info -->
	<xsl:template name="di">
		<xsl:param name="cur"/>
		<fieldset unselectable="on">
			<legend unselectable="on" class="top"><xsl:value-of select="$IDS_DOCUMENT"/></legend>
			<fieldset id="diAuthor" unselectable="on" class="kid">
				<label unselectable="on" class="hl">
					<xsl:value-of select="$IDS_VERSION"/>
				</label>
				<input type="text" maxlength="10" id="diVersion" class="short" value="{$cur/f:version}"/>
				<span id = "di_id" unselectable="on">
					<button style="font-family:Tahoma,Arial;margin-right:0.6em;" unselectable="on">
						<xsl:attribute name="onclick">NewDocumentID("<xsl:value-of select="$IDS_ID_WARN"></xsl:value-of>")</xsl:attribute>
						<xsl:value-of select="$IDS_NEW"/>
					</button>
					<button onclick="ShowElement(this.parentNode.id, false)" unselectable="on" style="font-family : Tahoma;">-</button>
					<label unselectable="on" class="hl" style="width:4em;">
						<xsl:value-of select="$IDS_ID"/>
					</label>
					<input type="text" maxlength="256" id="diID" style="width:40em;" disabled="1" value="{$cur/f:id}"/>
				</span>
				<br/>
				<legend unselectable="on"><xsl:value-of select="$IDS_AUTHORS"/></legend>
				<xsl:call-template name="authors">
					<xsl:with-param name="items" select="$cur/f:author"/>
				</xsl:call-template>
			</fieldset>
      <br/><br/>
      <label unselectable="on"><xsl:value-of select="$IDS_TOOLS_USED"/></label>
      <input type="text" maxlength="256" id="diProgs" class="middle" value="{$cur/f:program-used}"/>
			<br/>
      <label unselectable="on"><xsl:value-of select="$IDS_DATE_TEXT"/></label>
      <input type="text" maxlength="256" id="diDate" value="{$cur/f:date}"/>
      <label unselectable="on" style="width:6.4em"><xsl:value-of select="$IDS_DATE_VALUE"/></label>
      <input type="text" maxlength="256" id="diDateVal" value="{$cur/f:date/@value}"/>
	  <br/>
      <label unselectable="on" style="width:6.7em"><xsl:value-of select="$IDS_SOURCE_OCR"/></label>
      <input type="text" maxlength="256" id="diOCR" class="wide" value="{$cur/f:src-ocr}"/><br/>
      <fieldset id="diURL" unselectable="on" class="kid">
	<legend unselectable="on"><xsl:value-of select="$IDS_SOURCE_URL"/></legend>
	<xsl:for-each select="$cur/f:src-url">
	  <div unselectable="on">
	    <button id="del" onclick="Remove(this.parentNode)" unselectable="on">&#x72;</button>
	    <button onclick="Clone(this.parentNode)" unselectable="on">&#x32;</button>
	    <input type="text" class="url" maxlength="256" value="{.}"/>
	  </div>
	</xsl:for-each>
	<xsl:if test="not($cur/f:src-url)">
	  <div unselectable="on">
	    <button id="del" onclick="Remove(this.parentNode)" unselectable="on">&#x72;</button>
	    <button onclick="Clone(this.parentNode)" unselectable="on">&#x32;</button>
	    <input type="text" class="url" maxlength="256" value=""/>
	  </div>
	</xsl:if>
      </fieldset>
    </fieldset>
    <br/>
  </xsl:template>

  <!-- publish-info -->
  <xsl:template name="pi">
    <xsl:param name="cur"/>

    <fieldset unselectable="on">
      <legend unselectable="on" class="top"><xsl:value-of select="$IDS_PAPER_BOOK"/></legend>
      <label unselectable="on"><xsl:value-of select="$IDS_BOOK_TITLE"/></label>
      <input type="text" maxlength="256" id="piName" class="wide" value="{$cur/f:book-name}"/><br/>
      <label unselectable="on"><xsl:value-of select="$IDS_PUBLISHER"/></label>
      <input type="text" maxlength="256" id="piPub" class="wide" value="{$cur/f:publisher}"/><br/><br/>
      <label unselectable="on"><xsl:value-of select="$IDS_CITY"/></label>
      <input type="text" maxlength="256" id="piCity" value="{$cur/f:city}"/>
      <label unselectable="on" class="short"><xsl:value-of select="$IDS_YEAR"/></label>
      <input type="text" maxlength="256" id="piYear" style="width:6em" value="{$cur/f:year}"/>
	  <br/>
      <label unselectable="on" class="short"><xsl:value-of select="$IDS_ISBN"/></label>
      <input type="text" maxlength="256" id="piISBN" class="wide" value="{$cur/f:isbn}"/><br/><br/>
      <fieldset id="piSeq" unselectable="on" class="kid">
	<legend unselectable="on"><xsl:value-of select="$IDS_SEQUENCE"/></legend>
	<xsl:for-each select="$cur/f:sequence">
	  <xsl:call-template name="seq">
	    <xsl:with-param name="item" select="."/>
	  </xsl:call-template>
	</xsl:for-each>
	<xsl:if test="not($cur/f:sequence)">
	  <xsl:call-template name="seq">
	    <xsl:with-param name="item" select="."/>
	  </xsl:call-template>
	</xsl:if>
      </fieldset>
    </fieldset>
    <br/>
  </xsl:template>

  <!-- custom-info -->
  <xsl:template name="custom-info">
    <xsl:param name="items"/>
	<fieldset id="ci" unselectable="on">
      <legend unselectable="on" class="top"><xsl:value-of select="$IDS_CUSTOM_INFO"/><xsl:if test="not($items)"><button onclick="ShowElement(this.parentNode.parentNode.parentNode.id, false)" unselectable="on" style="font-family : Tahoma; float:none">-</button></xsl:if></legend>
	  <xsl:for-each select="$items">
	<div unselectable="on">
	  <button id="del" onclick="Remove(this.parentNode)" unselectable="on">&#x72;</button>
	  <button onclick="Clone(this.parentNode)" unselectable="on">&#x32;</button>
	  <label unselectable="on"><xsl:value-of select="$IDS_TYPE"/></label>
	  <input type="text" maxlength="256" id="type" value="{@info-type}"/><br/>
	  <span class="top" unselectable="on"><label unselectable="on"><xsl:value-of select="$IDS_VALUE"/></label></span>
	  <textarea rows="6" id="val"><xsl:value-of select="."/></textarea>
	</div>
      </xsl:for-each>
      <xsl:if test="not($items)">
	<div unselectable="on">
	  <button id="del" onclick="Remove(this.parentNode)" unselectable="on">&#x72;</button>
	  <button onclick="Clone(this.parentNode)" unselectable="on">&#x32;</button>
	  <label unselectable="on"><xsl:value-of select="$IDS_TYPE"/></label>
	  <input type="text" maxlength="256" id="type" value=""/><br/>
	  <span class="top" unselectable="on"><label unselectable="on"><xsl:value-of select="$IDS_VALUE"/></label></span>
	  <textarea rows="6" id="val"/>
	</div>
      </xsl:if>	  
    </fieldset>
    <br/>
  </xsl:template>

  <!-- authors_main -->
  <xsl:template name="authors_main">
    <xsl:param name="items"/>

    <xsl:for-each select="$items">
      <xsl:call-template name="author_main">
	<xsl:with-param name="item" select="."/>
      </xsl:call-template>
    </xsl:for-each>
    <xsl:if test="not($items)">
      <xsl:call-template name="author_main">
	<xsl:with-param name="item" select="."/>
      </xsl:call-template>
    </xsl:if>
  </xsl:template>

  <!-- authors -->
  <xsl:template name="authors">
    <xsl:param name="items"/>

    <xsl:for-each select="$items">
      <xsl:call-template name="author">
	<xsl:with-param name="item" select="."/>
      </xsl:call-template>
    </xsl:for-each>
    <xsl:if test="not($items)">
      <xsl:call-template name="author">
	<xsl:with-param name="item" select="."/>
      </xsl:call-template>
    </xsl:if>
  </xsl:template>
  
  <!-- author -->
  <xsl:template name="author">
    <xsl:param name="item"/>

    <div unselectable="on">
      <button id="del" onclick="Remove(this.parentNode)" unselectable="on">&#x72;</button>
      <button onclick="Clone(this.parentNode)" unselectable="on">&#x32;</button>
      <label unselectable="on"><xsl:value-of select="$IDS_FIRST"/></label>
      <input type="text" maxlength="256" id="first" value="{$item/f:first-name}"/>
      <label unselectable="on"><xsl:value-of select="$IDS_MIDLE"/></label>
      <input type="text" maxlength="256" id="middle" value="{$item/f:middle-name}"/>
      <label unselectable="on"><xsl:value-of select="$IDS_LAST"/></label>
      <input type="text" maxlength="256" id="last" value="{$item/f:last-name}"/>
      <span id = "ti_nic_mail_web" block="true">
		<br/>
		<button onclick="ShowElement(this.parentNode.id, false)" unselectable="on" style="font-family : Tahoma;">-</button>
	    <label unselectable="on"><xsl:value-of select="$IDS_NICKNAME"/></label>
		<input type="text" maxlength="256" id="nick" value="{$item/f:nickname}"/>
		<label unselectable="on"><xsl:value-of select="$IDS_EMAIL"/></label>
		<input type="text" maxlength="256" id="email" value="{$item/f:email}"/>
		<label unselectable="on"><xsl:value-of select="$IDS_WEBSITE"/></label>
		<SPAN class = "id" block="true" value="{$item/f:id}"></SPAN>
		<input type="text" maxlength="256" id="home" value="{$item/f:home-page}"/>		
	  </span>
    </div>
  </xsl:template>

  <!-- author main-->
  <xsl:template name="author_main">
    <xsl:param name="item"/>

    <div unselectable="on">
      <button id="del" onclick="Remove(this.parentNode)" unselectable="on">&#x72;</button>
      <button onclick="Clone(this.parentNode)" unselectable="on">&#x32;</button>
      <label unselectable="on" class="h"><xsl:value-of select="$IDS_FIRST"/></label>
      <input type="text" maxlength="256" id="first" value="{$item/f:first-name}"/>
      <label unselectable="on"><xsl:value-of select="$IDS_MIDLE"/></label>
      <input type="text" maxlength="256" id="middle" value="{$item/f:middle-name}"/>
      <label unselectable="on" class="h"><xsl:value-of select="$IDS_LAST"/></label>
      <input type="text" maxlength="256" id="last" value="{$item/f:last-name}"/>      
	  <span id = "ti_nic_mail_web" block="true">
			<br/>
			<button onclick="ShowElement(this.parentNode.id, false)" unselectable="on" style="font-family : Tahoma;">-</button>
		    <label unselectable="on"><xsl:value-of select="$IDS_NICKNAME"/></label>
		    <input type="text" maxlength="256" id="nick" value="{$item/f:nickname}"/>
		    <label unselectable="on"><xsl:value-of select="$IDS_EMAIL"/></label>
		    <input type="text" maxlength="256" id="email" value="{$item/f:email}"/>
		    <label unselectable="on"><xsl:value-of select="$IDS_WEBSITE"/></label>
		    <input type="text" maxlength="256" id="home" value="{$item/f:home-page}"/>
			<SPAN id = "id" block="true" value="{$item/f:id}"></SPAN>
			<br/>
	  </span>
    </div>
  </xsl:template>
  
  <!-- sequence -->
  <xsl:template name="seq">
    <xsl:param name="item"/>

    <div unselectable="on" style="margin-left:2em;">
      <button id="del" onclick="Remove(this.parentNode)" unselectable="on">&#x72;</button>
      <button onclick="Clone(this.parentNode)" unselectable="on">&#x32;</button>
      <button onclick="ChildClone(this.parentNode)" unselectable="on">&#x34;</button>
      <label unselectable="on"><xsl:value-of select="$IDS_NAME"/></label>
      <input type="text" maxlength="256" id="name" style="width:26em;" value="{$item/@name}"/>
      <label unselectable="on"><xsl:value-of select="$IDS_NUMBER"/></label>
      <input type="text" maxlength="5" id="number" style="width:3em;" value="{$item/@number}"/>
      <xsl:for-each select="$item/f:sequence">
	<xsl:call-template name="seq">
	  <xsl:with-param name="item" select="."/>
	</xsl:call-template>
      </xsl:for-each>
    </div>
  </xsl:template>
  
  </xsl:stylesheet>

