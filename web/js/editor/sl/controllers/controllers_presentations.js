'use strict';
 export const  controllerpresentation ={
    init : function () {
        this.data   = TWIG.dataPres,
        this.slides = this.data.slides,
        this.popins = this.data.popin,
        this.createTemplate(),
        this.setBackgrounPopins();
    },
    createTemplate : function () {
        let textVideo       = 'Your browser does not support the video tag.',
            image           = `<img src="<%= content.data.src%>" <% if (content.data.attributes) { %> <% Object.keys(content.data.attributes).forEach(function(key) { %> <%- key %> ="<%- content.data.attributes[key] %>"<% }); %> <%}%>>`,
            video           = `<video id="video" <% if (content.data.attributes) { %> <% Object.keys(content.data.attributes).forEach(function(key) { %> <%- key %> ="<%- content.data.attributes[key] %>"<% }); %> <%}%> >
                                            <source  src="<%= content.data.source %>">
                                             ${textVideo}
                                        </video>`,
            text            = `<%- content.data %>`,
            table           = `<%- content.data.data%>`,
            shape           = `<svg <% Object.keys(content.data.attributes).forEach(function(key) { %> <%- key %> ="<%- content.data.attributes[key] %>"<% }); %> >
                                           <%- content.data.data %>
                                        </svg>`,
            linkedpopin     = `<div class="<%= block.linkedpopin.class %>" id="<%= block.linkedpopin.id %>" ><%-block.linkedpopin.data%></div>`,
            linkedscreen    = `<div class="<%= block.linkedscreen.class %>" id="<%= block.linkedscreen.id %>" ><%-block.linkedscreen.data%></div>`,
            blocks          = ` <div class="<%=content.class%>"  <% if (content.attributes) { %> <% Object.keys(content.attributes).forEach(function(key) { %> <%- key %> ="<%- content.attributes[key] %>"<% }); %> <%}%> style="<% if (content.style) { %> <% Object.keys(content.style).forEach(function(key) { %> <%- key %>:<%- content.style[key] %> ;<% }); %> <%}%>">

                                            <% switch (type) {
                                                case 'image' : %>
                                                         ${image}
                                                    <% break;
                                                case 'video' : %>
                                                         ${video}
                                                    <% break;
                                                case 'shape' : %>
                                                        ${shape}
                                                    <% break;
                                                case 'survey' : %>
                                                       ${text}
                                                    <% break;
                                                case 'text' : %>
                                                        ${text}
                                                    <% break;
                                                case 'scrollabletext' : %>
                                                        ${text}
                                                    <% break;
                                                case 'table' : %>
                                                        ${table}
                                                    <% break;
                                        } %>
                                        </div>
                                      `,
            surveryBlock    = `<% if (block.type == "survey") { %>
                                              <div  class="<%= survey.class %>">
                                                    <%- survey.data  %>
                                              </div>
                                        <% } %>`,
            children        = `<section class='<%=section.class%>' <% if (section.attributes) { %> <% Object.keys(section.attributes).forEach(function(key) { %> <%- key %> ="<%- section.attributes[key] %>"<% }); %> <%}%>>
                                             <% blocks = section.blocks; childs = section.children %>
                                             <% if (blocks) { %>
                                               <% blocks.forEach(function(block){ %>
                                                     <div class="<%= block.class %>" <% if (block.attributes) { %> <% Object.keys(block.attributes).forEach(function(key) { %> <%- key %> ="<%- block.attributes[key] %>"<% }); %> <%}%>
                                                         <% if (block.style) { %> style="<% Object.keys(block.style).forEach(function(key) { %> <%- key %>:<%- block.style[key] %> ;<% }); %> " <%}%>
                                                       >
                                                         <div class="block-style"  <% if (block.blockStyle.style) { %>  style="<% Object.keys(block.blockStyle.style).forEach(function(key) { %> <%- key %>:<%- block.blockStyle.style[key] %> ;<% }); %>" <%}%>>
                                                               <% content = block.blockStyle.blockcontent ; type =  block.type; survey = block.blockStyle.survey %>
                                                                 ${blocks}
                                                                 ${surveryBlock}
                                                               <% if (block.linkedpopin != "") { %>${linkedpopin}<%}%>
                                                               <% if (block.linkedscreen != "") { %>${linkedscreen}<%}%>
                                                         </div>
                                                     </div>
                                               <%})%>
                                             <% } %>
                                    </section>`,
            $section        = `<% slides.forEach(function(section){ %>
                                               <section class='<%=section.class%>' <% if (section.attributes) { %> <% Object.keys(section.attributes).forEach(function(key) { %> <%- key %> ="<%- section.attributes[key] %>"<% }); %> <%}%>>
                                                        <% blocks = section.blocks; childs = section.children %>
                                                        <% if(childs) { %>
                                                            <% childs.forEach(function(section){ %>
                                                                ${children}
                                                            <%})%>
                                                        <%} else { %>
                                                            <% if (blocks) { %>
                                                              <% blocks.forEach(function(block){ %>
                                                                    <div class="<%= block.class %>" <% if (block.attributes) { %> <% Object.keys(block.attributes).forEach(function(key) { %> <%- key %> ="<%- block.attributes[key] %>"<% }); %> <%}%>
                                                                        <% if (block.style) { %> style="<% Object.keys(block.style).forEach(function(key) { %> <%- key %>:<%- block.style[key] %> ;<% }); %> " <%}%>
                                                                      >
                                                                        <div class="block-style"  <% if (block.blockStyle.style) { %>  style="<% Object.keys(block.blockStyle.style).forEach(function(key) { %> <%- key %>:<%- block.blockStyle.style[key] %> ;<% }); %>" <%}%>>
                                                                              <% content = block.blockStyle.blockcontent ; type =  block.type; survey = block.blockStyle.survey %>
                                                                                ${blocks}
                                                                                ${surveryBlock}
                                                                               <% if (block.linkedpopin != "") { %>${linkedpopin}<%}%>
                                                                                <% if (block.linkedscreen != "") { %>${linkedscreen}<%}%>

                                                                        </div>
                                                                    </div>
                                                              <%})%>
                                                            <% } %>
                                                        <% } %>
                                               </section>
                                          <% }); %>`,
            $popin          = `<% if (popins.length > 0 ) { %>
                                          <% popins.forEach(function(section){ %>
                                               <section class='<%=section.class%>' <% if (section.attributes) { %> <% Object.keys(section.attributes).forEach(function(key) { %> <%- key %> ="<%- section.attributes[key] %>"<% }); %> <%}%>
                                                        <% if (section.style) { %> style="<% Object.keys(section.style).forEach(function(key) { %> <%- key %> :<%- section.style[key] %>;<% }); %>" <%}%>>
                                                        <% blocks = section.blocks%>
                                                          <% if (blocks) { %>
                                                            <% blocks.forEach(function(block){ %>
                                                                  <div class="<%= block.class %>" <% if (block.attributes) { %> <% Object.keys(block.attributes).forEach(function(key) { %> <%- key %> ="<%- block.attributes[key] %>"<% }); %> <%}%>
                                                                      <% if (block.style) { %> style="<% Object.keys(block.style).forEach(function(key) { %> <%- key %>:<%- block.style[key] %> ;<% }); %> " <%}%>
                                                                    >
                                                                      <div class="block-style"  <% if (block.blockStyle.style) { %>  style="<% Object.keys(block.blockStyle.style).forEach(function(key) { %> <%- key %>:<%- block.blockStyle.style[key] %> ;<% }); %>" <%}%>>
                                                                            <% content = block.blockStyle.blockcontent ; type =  block.type; survey = block.blockStyle.survey %>
                                                                              ${blocks}
                                                                              ${surveryBlock}
                                                                      </div>
                                                                  </div>
                                                            <%})%>
                                                          <% } %>
                                               </section>
                                          <% }); %>
                                    <% } %>`,
        htmlSlides      = ejs.render($section, {slides: this.slides} ),
        htmlPopin       = ejs.render($popin ,  {popins : this.popins});
        $(function () {
            $('.slides').prepend(htmlSlides);
            $('.slidespop').prepend(htmlPopin);
        });
    },
    setBackgrounPopins: function () {

        $('.slidespop section.popin').each(function () {

                let popin = $(this),
                    popinBg = popin.attr('data-bg-image');

                if (popinBg !== "" ){
                    popin.css('background-image', `url(${popinBg})`)
                }
        });
        $('.sl-block.submit-btn-output').each(function () {
             $(this).find('.sl-block-content').empty();
        })

    }
};