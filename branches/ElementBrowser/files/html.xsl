<?xml version="1.0" encoding="us-ascii"?>

<X:stylesheet version="1.0"
  xmlns:X="http://www.w3.org/1999/XSL/Transform"
  xmlns:F="http://www.gribuser.ru/xml/fictionbook/2.0"
  xmlns:L="http://www.w3.org/1999/xlink">

  <X:output method="html" 
    encoding="utf-8"
    version="4.01"
    doctype-public="-//W3C//DTD HTML 4.01 Transitional//EN"
    doctype-system="http://www.w3.org/TR/1999/REC-html401-19991224/loose.dtd"
    indent="yes"/>

  <!-- create <img> elements or not? -->
  <X:param name="saveimages" select="0"/>
  <X:param name="imgprefix" select="''"/>
  <X:param name="includedesc" select="1"/>
  <X:param name="tocdepth" select="1"/>
  
  <!-- note about attributes: this template can be called
       with both qualified and unqualified attributes,
       so we have to accept both -->

  <X:template match="/">
    <html>
      <head>
	<!-- stick in a simple html stylesheet -->
        <style type="text/css">
	  body { font-family: serif; }
	  h1,h2,h3,h4,h5,h6 { text-align: center; font-weight: bold; }
	  h1 { font-size: 200%; }
	  h2 { font-size: 180%; }
	  h3 { font-size: 160%; }
	  h4 { font-size: 140%; }
	  h5 { font-size: 120%; }
	  h6 { font-size: 100%; }
	  p { margin-top: 0pt; margin-bottom: 0.1em; text-indent: 3em; text-align: justify; }
	  img { border: none; }
	  blockquote { margin-left: 1em; margin-right: 1em; color: rgb(228,175,0); }
          li { display: block; }
	  .epigraph { max-width: 25em; float: right; margin: 0pt; font-size: smaller; }
	  .epigraph p { text-indent: 2em; }
	  .espace { clear: right; margin: 0pt; padding: 0pt; }
	  .author { margin-left: 3em; margin-bottom: 1em; color: rgb(192,64,64); }
	  .poem { margin: 2em; }
	  .stanza + .stanza { margin-top: 1em; }
	  .stanza p { text-align: left; text-indent: 0pt; }
	  .note { position: relative; top: -0.3em; font-size: smaller; text-decoration: none; }
	  .annotation { border: solid black 1px; font-size: smaller;
			margin-left: 2em; margin-right: 2em; padding-left: 0.3em; }
	  .toclink { text-decoration: none; }
	  .props { margin-top: 2em; border: none; border-collapse: collapse; }
	  .props td { border: solid black 1px; vertical-align: top; padding-left: 0.3em; }
	  .propsec { text-align: center; font-weight: bolder; border: none !important }
	  td p { text-indent: 0pt; }
	  .center { text-align: center; }
	</style>
	<title>
		<X:value-of select="/F:FictionBook/F:description/F:title-info/F:book-title"/>
	</title>
	<!-- include some metainfo -->
	<X:for-each select="/F:FictionBook/F:description/F:title-info/F:author">
	  <meta name="author">
	    <X:attribute name="content">
	      <X:call-template name="author-prop"/>
	    </X:attribute>
	  </meta>
	</X:for-each>
	<meta name="title">
	  <X:attribute name="content">
	    <X:value-of select="/F:FictionBook/F:description/F:title-info/F:book-title"/>
	  </X:attribute>
	</meta>
      </head>
      <body>
        <X:choose>
          <X:when test="string-length(/F:FictionBook/F:description/F:title-info/F:coverpage/F:image/@L:href)">
            <div class="center">
              <img>
                <X:choose>
                  <X:when test="starts-with(/F:FictionBook/F:description/F:title-info/F:coverpage/F:image/@L:href,'#')">                
                        <X:attribute name="src">
                          <X:value-of select="concat($imgprefix,substring(/F:FictionBook/F:description/F:title-info/F:coverpage/F:image/@L:href,2))"/>
                        </X:attribute>
                  </X:when>
                  <X:otherwise>
                    <X:attribute name="src">
                      <X:value-of select="concat($imgprefix,/F:FictionBook/F:description/F:title-info/F:coverpage/F:image/@L:href)"/>
                    </X:attribute>
                  </X:otherwise>
                </X:choose>
              </img>
            </div>
          </X:when>
        </X:choose>					
	<!-- image from the first body -->
	<X:apply-templates select="/F:FictionBook/F:body[1]/F:image[1]" mode="first"/>
	<!-- title from the first body -->
	<X:apply-templates select="/F:FictionBook/F:body[1]/F:title[1]" mode="first"/>
	<!-- table of contents -->
	<X:if test="//F:section/F:title">
	  <h4>Table of contents</h4>
          <ul>
	    <X:apply-templates mode="toc" select="/F:FictionBook/F:body/F:section"/>
	    <!-- insert links to annotation and description -->
	    <X:if test="$includedesc">
	      <X:if test="/F:FictionBook/F:description/F:title-info/F:annotation">
		<li><p><a class="toclink" href="#_fbh_annotation">Annotation</a></p></li>
	      </X:if>
	      <li><p><a class="toclink" href="#_fbh_description">Document information</a></p></li>
	    </X:if>
	  </ul>
	</X:if>
	<!-- main text -->
	<X:apply-templates select="/F:FictionBook/F:body"/>
	<!-- generate description -->
	<X:if test="$includedesc">
	  <hr/>
	  <!-- annotation -->
	  <X:apply-templates select="/F:FictionBook/F:description/F:title-info/F:annotation"/>
	  <!-- description properties -->
	  <a name="_fbh_description"/>
	  <table class="props">
	    <X:apply-templates select="/F:FictionBook/F:description/F:title-info"/>
	    <X:apply-templates select="/F:FictionBook/F:description/F:document-info"/>
	    <X:apply-templates select="/F:FictionBook/F:description/F:publish-info"/>
	    <X:if test="/F:FictionBook/F:description/F:custom-info">
	      <tr><td class="propsec" colspan="2">Custom Info</td>
		<X:apply-templates select="/F:FictionBook/F:description/F:custom-info"/>
	      </tr>
	    </X:if>
	  </table>
	</X:if>
      </body>
    </html>
  </X:template>

  <!-- text body -->
  <X:template match="F:body">
    <!-- provide a visual separator between body elements -->
    <!-- <hr/> -->
    <X:apply-templates/>
  </X:template>

  <!-- text sections -->
  <X:template match="F:section">
    <!-- add an anchor for intra-document links -->
    <X:call-template name="id"/>
    <!-- add a anchor for toc -->
    <X:if test="F:title">
      <a>
	<X:attribute name="name">
	  <X:text>_toc_</X:text><X:value-of select="generate-id()"/>
	</X:attribute>
      </a>
    </X:if>
    <X:apply-templates/>
  </X:template>

  <!-- special case to insert table of contents after the first header -->
  <X:template match="/F:FictionBook/F:body[1]/F:title[1]">
    <!-- swallow this header in normal mode -->
  </X:template>

  <X:template match="/F:FictionBook/F:body[1]/F:title[1]" mode="first">
    <X:call-template name="sb-title"/>
  </X:template>

  <X:template match="/F:FictionBook/F:body[1]/F:image[1]">
    <!-- swallow this header in normal mode -->
  </X:template>

  <X:template match="/F:FictionBook/F:body[1]/F:image[1]" mode="first">
    <X:call-template name="sb-image"/>
  </X:template>

  <X:template match="F:title">
    <X:call-template name="sb-title"/>
  </X:template>

  <!-- section and body titles -->
  <X:template name="sb-title">
    <!-- figure an appropriate heading -->
    <X:variable name="level" select="2+count(ancestor::F:section)+count(ancestor::F:description)"/>
    <X:choose>
      <!-- always use h4 when nesting level is >4 -->
      <X:when test="$level>4">
	<h4><X:call-template name="hx-title"/></h4>
      </X:when>
      <X:otherwise>
	<!-- compute an appropriate heading element -->
	<X:element name="h{$level}"><X:call-template name="hx-title"/></X:element>
      </X:otherwise>
    </X:choose>
  </X:template>

  <!-- we have to jump through the hoops because Hx elements can't have block
       level content in them -->
  <X:template name="hx-title">
    <X:for-each select="F:p | F:empty-line">
      <X:if test="position()>1">
	<br/>
      </X:if>
      <X:apply-templates/>
    </X:for-each>
  </X:template>

  <!-- annotations -->
  <X:template match="F:annotation">
    <div class="annotation">
      <a name="#_fbh_annotation"/>
      <X:apply-templates/>
    </div>
  </X:template>

  <!-- plain paragraphs -->
  <X:template match="F:p">
    <X:call-template name="id"/>
    <p><X:apply-templates/></p>
  </X:template>

  <!-- empty-lines -->
  <X:template match="F:empty-line">
    <p>&#160;</p>
  </X:template>

  <!-- text decoration inside paragraphs: strong, emphasis -->
  <X:template match="F:strong">
    <strong><X:apply-templates/></strong>
  </X:template>
  <X:template match="F:emphasis">
    <em><X:apply-templates/></em>
  </X:template>

  <!-- hyperlinks in text -->
  <X:template match="F:a">
    <a>
      <X:attribute name="href"><X:value-of select="@L:href"/></X:attribute>
      <X:if test='@type="note" or @F:type="note"'>
	<X:attribute name="class">note</X:attribute>
      </X:if>
      <X:apply-templates/>
    </a>
  </X:template>

  <!-- images -->
  <X:template match="F:image">
    <X:call-template name="sb-image"/>
  </X:template>

  <X:template name="sb-image">
    <X:if test="$saveimages">
      <div class="center"><img>
	<X:choose>
	  <X:when test="starts-with(@L:href,'#')">
	    <X:attribute name="src">
	      <X:value-of select="concat($imgprefix,substring(@L:href,2))"/>
	    </X:attribute>
	  </X:when>
	  <X:otherwise>
	    <X:attribute name="src">
	      <X:value-of select="concat($imgprefix,@L:href)"/>
	    </X:attribute>
	  </X:otherwise>
	</X:choose>
      </img></div>
    </X:if>
  </X:template>

  <!-- hyperlink targets -->
  <X:template name="id">
    <X:if test="@id | @F:id">
      <a><X:attribute name="name"><X:value-of select="@id | @F:id"/></X:attribute></a>
    </X:if>
  </X:template>

  <!-- style elements are converted into span -->
  <X:template match="F:style">
    <span>
      <X:attribute name="class">
	<X:text>xc_</X:text><X:value-of select="@name | @F:name"/>
      </X:attribute>
      <X:apply-templates/>
    </span>
  </X:template>

  <!-- subtitles -->
  <X:template match="F:subtitle">
    <h5><X:apply-templates/></h5>
  </X:template>

  <!-- epigraphs -->
  <X:template match="F:epigraph">
    <X:call-template name="id"/>
    <!-- move epigraph to the far right -->
    <div class="epigraph">
      <X:apply-templates/>
    </div>
    <!-- force other text to start below the epigraph -->
    <div class="espace"/>
  </X:template>

  <!-- citations -->
  <X:template match="F:cite">
    <X:call-template name="id"/>
    <blockquote>
      <X:apply-templates/>
    </blockquote>
  </X:template>

  <!-- poems -->
  <X:template match="F:poem">
    <X:call-template name="id"/>
    <!-- add some space around it -->
    <div class="poem">
      <X:apply-templates/>
    </div>
  </X:template>

  <X:template match="F:stanza">
    <div class="stanza">
      <X:apply-templates/>
    </div>
  </X:template>

  <X:template match="F:v">
    <p><X:apply-templates/></p>
  </X:template>

  <!-- epigraph/citation/poem author -->
  <X:template match="F:text-author">
    <p class="author"><X:apply-templates/></p>
  </X:template>

  <!-- everything else is just swallowed and ignored -->
  <X:template match="F:*"/>

  <!-- properties -->
  <X:template match="F:title-info">
    <tr><td class="propsec" colspan="2">Title Info</td></tr>
    <tr>
      <td>Genre<X:if test="count(F:genre) &gt; 1">s</X:if></td>
      <td>
	<X:for-each select="F:genre">
	  <X:text> </X:text>
	  <X:value-of select="."/>
	  <X:if test="@match &lt; 100 or @F:match &lt; 100">
	    <X:text>[</X:text><X:value-of select="@match | @F:match"/><X:text>%]</X:text>
	  </X:if>
	</X:for-each>
      </td>
    </tr>
    <tr>
      <td>Author<X:if test="count(F:author) &gt; 1">s</X:if></td>
      <td>
	<X:for-each select="F:author">
	  <X:if test="position() &gt; 1">,</X:if>
	  <X:call-template name="author-prop"/>
	</X:for-each>
      </td>
    </tr>
    <tr><td>Title</td><td><X:value-of select="F:book-title"/></td></tr>
    <X:if test="F:keywords">
      <tr><td>Keywords</td><td><X:value-of select="F:keywords"/></td></tr>
    </X:if>
    <X:apply-templates select="F:date"/>
    <X:if test="F:lang">
      <tr><td>Language</td><td><X:value-of select="F:lang"/></td></tr>
    </X:if>
    <X:if test="F:src-lang">
      <tr><td>Source Language</td><td><X:value-of select="F:src-lang"/></td></tr>
    </X:if>
    <X:if test="F:translator">
      <tr>
	<td>Translator<X:if test="count(F:translator) &gt; 1">s</X:if></td>
	<td>
	  <X:for-each select="F:translator">
	    <X:if test="position() &gt; 1">,</X:if>
	    <X:call-template name="author-prop"/>
	  </X:for-each>
	</td>
      </tr>
    </X:if>
  </X:template>

  <X:template match="F:document-info">
    <tr><td class="propsec" colspan="2">Document Info</td></tr>
    <tr>
      <td>Author<X:if test="count(F:translator) &gt; 1">s</X:if></td>
      <td>
	<X:for-each select="F:author">
	  <X:if test="position() &gt; 1">,</X:if>
	  <X:call-template name="author-prop"/>
	</X:for-each>
      </td>
    </tr>
    <X:if test="F:program-used">
      <tr><td>Program used</td><td><X:value-of select="F:program-used"/></td></tr>
    </X:if>
    <X:apply-templates select="F:date"/>
    <X:if test="F:src-url">
      <tr><td>Source URL</td>
	<td>
	  <a>
	    <X:attribute name="href"><X:value-of select="F:src-url"/></X:attribute>
	    <X:value-of select="F:src-url"/>
	  </a>
	</td>
      </tr>
    </X:if>
    <X:if test="F:src-ocr">
      <tr><td>Source OCR</td><td><X:value-of select="F:src-ocr"/></td></tr>
    </X:if>
    <tr><td>ID</td><td><X:value-of select="F:id"/></td></tr>
    <tr><td>Version</td><td><X:value-of select="F:version"/></td></tr>
    <X:if test="F:history">
      <tr><td>History</td><td><X:apply-templates select="F:history/*"/></td></tr>
    </X:if>
  </X:template>

  <X:template match="F:publish-info">
    <tr><td class="propsec" colspan="2">Publisher Info</td></tr>
    <X:if test="F:book-name">
      <tr><td>Book name</td><td><X:value-of select="F:book-name"/></td></tr>
    </X:if>
    <X:if test="F:publisher">
      <tr><td>Publisher</td><td><X:value-of select="F:publisher"/></td></tr>
    </X:if>
    <X:if test="F:city">
      <tr><td>City</td><td><X:value-of select="F:city"/></td></tr>
    </X:if>
    <X:if test="F:year">
      <tr><td>Year</td><td><X:value-of select="F:year"/></td></tr>
    </X:if>
    <X:if test="F:isbn">
      <tr><td>ISBN</td><td><X:value-of select="F:isbn"/></td></tr>
    </X:if>
  </X:template>

  <X:template match="F:custom-info">
    <tr><td><X:value-of select="@info-type | @F:info-type"/></td><td><X:value-of select="."/></td></tr>
  </X:template>

  <X:template match="F:date">
    <tr>
      <td>Date</td>
      <td>
	<X:value-of select="."/>
	<X:if test="string(@value | @F:value) != concat(string(),'-01-01') and string() != string(@value | @F:value)">
	  <X:text> (</X:text><X:value-of select="@value | @F:value"/><X:text>)</X:text>
	</X:if>
      </td>
    </tr>
  </X:template>

  <X:template name="author-prop">
    <X:value-of select="F:first-name"/><X:text> </X:text>
    <X:value-of select="F:middle-name"/><X:text> </X:text>
    <X:value-of select="F:last-name"/>
    <X:if test="F:nickname">
      <X:text> [</X:text><X:value-of select="F:nickname"/>]
    </X:if>
    <X:if test="F:email">
      <X:text> &lt;</X:text><X:value-of select="F:email"/>&gt;
    </X:if>
  </X:template>

  <!-- table of contents generator -->
  <X:template match="F:section" mode="toc">
    <!-- only include sections that have a title -->
    <X:if test="F:title | .//F:section/F:title">
      <li>
	<X:if test="F:title">
	  <p><a class="toclink">
	      <X:attribute name="href">
		<X:text>#_toc_</X:text><X:value-of select="generate-id()"/>
	      </X:attribute>
	      <!-- insert text content -->
	      <X:for-each select="F:title/F:p">
		<X:if test="position()>1"><X:text> </X:text></X:if>
		<X:value-of select="."/>
	      </X:for-each>
	  </a></p>
	</X:if>
	<X:if test=".//F:section/F:title and count(ancestor::F:section) &lt; $tocdepth">
	  <ul><X:apply-templates select="F:section" mode="toc"/></ul>
	</X:if>
      </li>
    </X:if>
  </X:template>

</X:stylesheet>
