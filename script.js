var sections = [];
var sectionsYStart = [];
var activeSection = 0;

var pageInit = function(){
    sections = [];
    sectionsYStart = [];
    $("section").each(function(i,v){
        sections[i] = v;
        sectionsYStart[i] = $(v).offset().top;
    });
};

var ChangeColorOnScroll = function(){
    var scroll = $(window).scrollTop();
    scrollColors(scroll, $("body"), ["#000000", "#805875", "#a1a0ac", "#cdcdcd", "#e2db9a"]);
}

var scrollColors = function(scroll, el, colors){
    var z = 0, seclen = sections.length;
    for(var i = 0; i < seclen; i ++){
        if (scroll > sectionsYStart[i]){
            z = i;            
        }
    }
    activeSection = z;    

    $('h1').each(function() {       
        if ($(this).offset().top+$(this).height() < scroll) {
            $(this).removeClass('animated fadeInDown fadeInUp').css('opacity',0);
        }
        if ($(this).offset().top > scroll+$(window).height()) {
            $(this).removeClass('animated fadeInDown fadeInUp').css('opacity',0);
        }
    });   
    $('.text-column').each(function() {       
        if ($(this).offset().top+$(this).height() < scroll) {
            $(this).removeClass('animated fadeInDown fadeInUp').css('opacity',0);
        }
        if ($(this).offset().top > scroll+$(window).height()) {
            $(this).removeClass('animated fadeInDown fadeInUp').css('opacity',0);
        }
    });   

    scroll_pos = scroll;
    var animation_begin_pos = sectionsYStart[z];
    var animation_end_pos = sectionsYStart[z+1];    
    var beginning_color = $.Color(colors[z]);
    var ending_color = $.Color(colors[z+1]);

    if(scroll_pos >= animation_begin_pos && scroll_pos <= animation_end_pos ){
        var percentScrolled = scroll_pos / ( animation_end_pos - animation_begin_pos );        
        if (percentScrolled-activeSection > 0.34) {
            /*$('body').css('-webkit-scroll-snap-type','none');
            setTimeout(function() {
                $('body').css('-webkit-scroll-snap-type','mandatory');
            },1100);*/
            if (!$(sections[activeSection+1]).find('h1').hasClass('animated')) {
                $(sections[activeSection+1]).find('h1').addClass('animated fadeInDown');                             
                $(sections[activeSection]).find('footer').fadeOut(400);                  
            }
            if (!$(sections[activeSection+1]).find('.text-column').hasClass('animated')) {
                $(sections[activeSection+1]).find('.text-column').addClass('animated fadeInUp');   
            }

            if (percentScrolled-activeSection > .95) { 
                $(sections[activeSection+1]).find('footer').fadeIn(400);
            }
        }        
        if(percentScrolled>1) { 
            percentScrolled = percentScrolled - z; 
        }
        var newRed = beginning_color.red() + ( ( ending_color.red() - beginning_color.red() ) * percentScrolled );
        var newGreen = beginning_color.green() + ( ( ending_color.green() - beginning_color.green() ) * percentScrolled );
        var newBlue = beginning_color.blue() + ( ( ending_color.blue() - beginning_color.blue() ) * percentScrolled );
        
        var newAlpha = beginning_color.alpha() + ( ( ending_color.alpha() - beginning_color.alpha() ) * percentScrolled );

        var newColor = new $.Color( newRed, newGreen, newBlue, newAlpha );
        el.animate({ backgroundColor: newColor }, 0);
        if (activeSection === 0) {
            $('video').css('opacity', 1-percentScrolled);
            $('.fade').css('opacity',percentScrolled > 0.3 ? percentScrolled+0.25 : percentScrolled).css('background',newColor);        
        }
        if (activeSection == 0)
        { 
            //$('.fade').css('background','linear-gradient(transparent,'+ newColor+')');
        }
    } else {        
        if ( scroll_pos > animation_end_pos ) {
            el.animate({ backgroundColor: ending_color }, 0);
        }
        else if ( scroll_pos < animation_begin_pos ) {
            el.animate({ backgroundColor: beginning_color }, 0);
        }
    }
};

$(function(){
    pageInit();
    $(document).scroll(ChangeColorOnScroll);
    $(window).resize(pageInit);

    $('footer a').on('click', function(e) {
        e.preventDefault();
        $('footer').fadeOut();
        $("html, body").animate({ scrollTop: "4000vh" }, 1750, function() {
            $('section:last-of-type footer').fadeIn();
        });
    });
});