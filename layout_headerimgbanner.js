function layout_headerimgbanner(imglist,social_media_list,platform_list,auto_loop,loop_sec,container_style,platform_list_display_control,social_media_list_control,contactus_control){
    let screenmode = platform_screenmode();
    let mytheme = platform_gettheme();
    let max_z_index = M_zIndex['imgbanner'];

    if(isarrayset(imglist) === false){console_error('imglist is empty or null.');return false;}
    for(let key in imglist){
        imglist[key] = chkhash({img:'', mobile_img:'',action:'',contact_text_face:'',contact_icon:'',contact_action:'',contact_icon_style:''}, imglist[key]);
    }

    if(isarrayset(social_media_list) === true){
        for(let key in social_media_list){
            social_media_list[key] = chkhash({icon:'', icon_style:'',action:''}, social_media_list[key]);
        }
    }else{
        social_media_list = '';
    }

    if(isarrayset(platform_list) === true){
        for(let key in platform_list){
            platform_list[key] = chkhash({icon:'', icon_style:'',action:''}, platform_list[key]);
        }
    }else{
        platform_list = '';
    }

    
    if(isarrayset(platform_list_display_control)===true){
            platform_list_display_control = chkhash({disable_on_desktop:'', disable_on_mobile:''}, platform_list_display_control);
    }else{
        platform_list_display_control = chkhash({disable_on_desktop:'', disable_on_mobile:''}, {});
    }

    if(isarrayset(social_media_list_control)===true ){
        social_media_list_control = chkhash({disable_on_desktop:'', disable_on_mobile:''}, social_media_list_control);
    }else{
        social_media_list_control = chkhash({disable_on_desktop:'', disable_on_mobile:''}, {});
    }

    if(isarrayset(contactus_control)===true){
        contactus_control = chkhash({disable_on_desktop:'', disable_on_mobile:''}, contactus_control);
    }else{
        contactus_control = chkhash({disable_on_desktop:'', disable_on_mobile:''}, {});
    }

    let disable_platformlist_ondesktop = '';
    let disable_platformlist_onmobile = '';
    if(platform_list_display_control.disable_on_desktop == true || platform_list_display_control.disable_on_desktop == '1' || platform_list_display_control.disable_on_desktop == 1){disable_platformlist_ondesktop = 'display:none;';}
    if(platform_list_display_control.disable_on_mobile == true || platform_list_display_control.disable_on_mobile == '1' || platform_list_display_control.disable_on_mobile == 1){disable_platformlist_onmobile = 'display:none;';}

    let disable_socialmedia_onmobile = '';
    let disable_socialmedia_ondesktop = '';
    if(social_media_list_control.disable_on_mobile == true || social_media_list_control.disable_on_mobile == '1' || social_media_list_control.disable_on_mobile == 1){disable_socialmedia_onmobile = 'display:none;';}
    if(social_media_list_control.disable_on_desktop == true || social_media_list_control.disable_on_desktop == '1' || social_media_list_control.disable_on_desktop == 1){disable_socialmedia_ondesktop = 'display:none;';}

    let disable_contactus_ondesktop ='';
    let disable_contactus_onmobile = '';
    if(contactus_control.disable_on_desktop == true || contactus_control.disable_on_desktop == '1' || contactus_control.disable_on_desktop == 1){disable_contactus_ondesktop = 'display:none;';}
    if(contactus_control.disable_on_mobile == true || contactus_control.disable_on_mobile == '1' || contactus_control.disable_on_mobile == 1){disable_contactus_onmobile = 'display:none;';}
    

    if(isemptyzeroset(auto_loop)==true || isset(auto_loop) == false || isBoolean(auto_loop)==false){auto_loop = true;}
    if(isemptyzeroset(loop_sec)==true || isset(loop_sec) == false ){loop_sec = 5000;} // -- default 5s --
    
    let mylayout = '';
    // -- prefix -- //
    let layout_header_imgbanner_prefix = 'layout_headerimgbanner_'+getuniqueid()+'_';
    let social_icon_id_prefix = layout_header_imgbanner_prefix+'social_icon_';
    let platform_icon_id_prefix = layout_header_imgbanner_prefix+'platform_icon_';

    // -- id -- //
    let main_container_id = layout_header_imgbanner_prefix + 'main_container_';
    let img_selection_id = layout_header_imgbanner_prefix + 'img_selection_';
    let contact_div_id = layout_header_imgbanner_prefix + 'contact_div_';
    let platform_div_id = layout_header_imgbanner_prefix + 'platform_div_';
    let contact_icon_id = layout_header_imgbanner_prefix + 'contact_icon_';
    let contact_text_id = layout_header_imgbanner_prefix + 'contact_text_';
    let social_media_div_id = layout_header_imgbanner_prefix + 'social_media_div_';
    let contact_div_container_id = layout_header_imgbanner_prefix + 'contact_div_containter_';
    let platform_div_containter_id = layout_header_imgbanner_prefix + 'platform_div_';
    let hidden_img_control_input = layout_header_imgbanner_prefix + 'hidden_img_control_input';

    // -- loop event -- //
    let interval;

    let _start_loop_event  = (sec) => {
        _stop_loop_event(interval);

        if(isvalidid(hidden_img_control_input)==false){
            return false;
        }

        interval = setInterval(() => {
            if(isvalidid(hidden_img_control_input)==false){
                _stop_loop_event(interval);
                return false;
            }
            let hidden_control_val = document.getElementById(hidden_img_control_input).value;
            hidden_control_val = parseInt(hidden_control_val) + 1;
            if(hidden_control_val >= imglist.length){hidden_control_val = 0;}
            let current_div = document.getElementById(layout_header_imgbanner_prefix + 'img_selection_'+ hidden_control_val);
            current_div.click();
        },sec)
    }

    let _stop_loop_event = (p_interval) => {
        if(p_interval){clearInterval(p_interval);}
    }

    // -- desktop style -- //
    let default_banner_img = imglist[0].img;
    let default_contact_text_face = imglist[0].contact_text_face;
    if(isemptyzeroset(default_contact_text_face)===true){
        default_contact_text_face = '<p style="color:#FFFFFF; padding:0px 5px 0px 0px; font-weight:bolder;">Contact Us</p>';
    }
    let contact_us_icon = mytheme['IMGShare'] +'contact_us_icon.png';// default contact icon image

    let banner_img_length = Object.keys(imglist).length;
    let img_selection_display_style = 'display:inline-flex; justify-content:center;';
    if(banner_img_length > 4) {img_selection_display_style = 'display:inline-flex; justify-content:flex-start;';}
    let img_selection_mobile_bg_div = '';

    let main_container_style = 'width:100%; position:relative; cursor:pointer; object-fit: cover;' + container_style;
    let img_selection_style = 'z-index:'+max_z_index+'; height:100%; background-color:transparent; left:85%; position:absolute; flex-direction:column; overflow-y:auto;' + img_selection_display_style;
    let each_img_style = ' width:80%;height:80%; border-radius:10px; display:inline-block;';
    // -- social media style -- //
    let social_media_div_style = 'z-index:'+max_z_index+'; background:#8383839E; border-radius:25px; padding:6px; position:absolute; bottom: 10%; right:15%; display:inline-flex; justify-content:center; align-items: center; gap:12px;'+disable_socialmedia_ondesktop;

    // -- contact us style -- //
    let contact_us_icon_style = 'height:35px;';
    let contact_us_div_style = 'z-index:'+max_z_index+'; cursor:pointer; position:absolute; bottom: 10%; left:8%; display:inline-flex; justify-content:center; align-items: center; gap:6px; background:#8383839E; border-radius:25px; padding:6px; width:170px;'+disable_contactus_ondesktop;
    //-- platform list style -- //
    let platform_list_div_style ='z-index:'+max_z_index+'; cursor:pointer; position:absolute; bottom: 10%; left:8%; display:inline-flex; justify-content:center; align-items: center; gap:6px; background:#8383839E; border-radius:25px; padding:6px; width:170px; margin-left:210px;'+disable_platformlist_ondesktop;
    

    // -- mobile style -- //
    if(screenmode == 'mobile'){
        // --img selection bg div -- //
        default_banner_img = imglist[0].mobile_img;
        img_selection_mobile_bg_div += '<div id="'+img_selection_id+'" style="z-index:'+max_z_index+'; height:100%; background-color:#D9D9D9B2; left:79.5%; position:absolute; display:inline-flex; flex-direction:column; justify-content:center;">'; // img selection container
        img_selection_mobile_bg_div += '<img src="'+imglist[0].mobile_img+'" style="visibility:hidden; max-width:100%; max-height:100%; width:auto;height:auto; border-radius:10px; display:inline-block;" />'; 
        img_selection_mobile_bg_div += '</div>';

        // -- change style -- //
        main_container_style = 'position:relative; cursor:pointer;' + container_style;
        img_selection_style = 'height:100%; background-color:transparent; left:80%; position:absolute; flex-direction:column; gap:10px; overflow-y:auto; z-index:'+max_z_index+'; ' + img_selection_display_style; // justify-content:flex-start / center
        contact_us_icon_style = 'height:25px;';    
        each_img_style = 'max-width:90%; width:auto;height:auto; border-radius:10px; display:inline-block;';
        // -- social media div -- //
        social_media_div_style = 'z-index:'+max_z_index+'; background-color:transparent; position:absolute; bottom: 2%; right:23%; display:inline-flex; justify-content:center; align-items: center; gap:12px;'+disable_socialmedia_onmobile;
        // -- contact_us div -- //
        contact_us_div_style = 'z-index:'+max_z_index+'; cursor:pointer; position:absolute; bottom: 10%; left:8%; display:inline-flex; justify-content:center; align-items: center; gap:6px; background:#8383839E; border-radius:25px; padding:6px; width:170px;'+disable_contactus_onmobile;
        // -- platform_list div -- //
        platform_list_div_style ='z-index:'+max_z_index+'; cursor:pointer; position:absolute; bottom: 10%; left:8%; display:inline-flex; justify-content:center; align-items: center; gap:6px; background:#8383839E; border-radius:25px; padding:6px; width:170px; margin-bottom:50px;'+disable_platformlist_onmobile;
    }

    // -- start create layout -- //
    // -- hidden control element -- //
    mylayout += '<input type="number" style="display:none;" id="'+hidden_img_control_input+'" value="0">';

    mylayout += '<div id="' + main_container_id + '" style="'+main_container_style+'">'; // main container

    // -- banner img -- //
    mylayout += '<div style="position:absolute; z-index:1; top:0; left:0; width:100%; height:auto;">';
    mylayout += '<div style="position:relative; z-index:1; top:0; left:0; width:100%; height:auto;">';
    for(let i = 0; i < imglist.length; i++){
        let img_main_id = layout_header_imgbanner_prefix + 'img_main_' + i;
        let _opacity = 0;
        if(i == 0){
            _opacity = 1;
        }

        let img_src = imglist[i].img;
        if(screenmode == 'mobile'){
            img_src = imglist[i].mobile_img;
        }

        mylayout += '<img src="'+img_src+'" style=" width:100%; height:auto; z-index:1; opacity:'+_opacity+'; transition: opacity 0.4s linear; position:absolute;" id="'+img_main_id+'" />';
    }
    mylayout += '</div>';
    mylayout += '</div>';
    // -- dummy img for holding the height and width -- //
    mylayout += '<img src="'+default_banner_img + '" style="width:100%; height:100%;z-index:1; opacity:0; transition: opacity 0.4s ease;"/>';

    mylayout += img_selection_mobile_bg_div;

    // -- img selection container -- //
    mylayout += '<div id="'+img_selection_id+'" style="'+img_selection_style+'" class="hidescrollbar">';
    for(let key in imglist){
        let img_selection_id = layout_header_imgbanner_prefix + 'img_selection_' + key;
        mylayout += '<div style="margin:5px 0px 0px 0px; cursor:pointer; border-radius:10px; display:flex; justify-content:center; align-items:center;" id="'+img_selection_id+'">';
        mylayout += '<img src="'+imglist[key].mobile_img+'" style="'+each_img_style+'" />'; 
        mylayout += '</div>';
    }
    mylayout += '</div>';

    // -- contact us -- //
    mylayout +='<div id="'+contact_div_container_id+'">';
    mylayout += '<div id="'+contact_div_id+'" style="'+contact_us_div_style+'" >'; // contact div
    mylayout += '<img src="' +contact_us_icon +'" id="'+contact_icon_id+'" style="'+contact_us_icon_style+'"/>';

    mylayout += '<div id="'+contact_text_id+'">';
    mylayout += default_contact_text_face;
    mylayout += '</div>';
    mylayout += '</div>';
    mylayout += '</div>';

    // -- platform list -- //
    mylayout += '<div id="'+platform_div_containter_id+'">';
    mylayout += '<div id="'+platform_div_id+'" style="'+platform_list_div_style+'" >'; // contact div
    mylayout += '<div style="display:flex; justify-content:center; align-items: center; flex-direction:row; gap:6px;">';

    for(let key in platform_list){
        let icon_id = platform_icon_id_prefix + key;
        let icon_style = platform_list[key].icon_style;
        if(isemptyzeroset(icon_style)===true){icon_style = 'height:35px;'}
        if(screenmode == 'mobile'){icon_style = 'height:25px;'}
        mylayout += '<img src="' +platform_list[key].icon +'" style="cursor:pointer; '+icon_style+'" id="'+icon_id+'" />';
    }

    mylayout += '</div>';
    mylayout += '</div>';
    mylayout += '</div>';

    // -- social media button -- //

    mylayout += '<div id="'+social_media_div_id+'" style="'+social_media_div_style+'" >'; 
    for(let key in social_media_list){
        let icon_id = social_icon_id_prefix + key;
        let icon_style = social_media_list[key].icon_style;
        if(isemptyzeroset(icon_style)===true){icon_style = 'height:35px;'}
        if(screenmode == 'mobile'){icon_style = 'height:25px;'}
        mylayout += '<img src="' +social_media_list[key].icon +'" style="cursor:pointer; '+icon_style+'" id="'+icon_id+'" />';

    }
    mylayout += '</div>';

    mylayout += '</div>'; // end of main container

    waitfordomid(main_container_id,()=>{
        // -- main container action -- //
        let main_container = document.getElementById(main_container_id);

        if(isIOS()==true || isAndroid()==true){
            main_container.style.setProperty('--webkit-tap-highlight-color', 'transparent');
            main_container.style.setProperty('tap-highlight-color', 'transparent');
        }

        main_container.addEventListener('click',(e)=>{
            let hidden_control_val = document.getElementById(hidden_img_control_input).value;
            
            if(is_callable(imglist[hidden_control_val].action)===true){
                imglist[hidden_control_val].action();
            }else if(isemptyzeroset(imglist[hidden_control_val].action)===false && isString(imglist[hidden_control_val].action)===true){
                window.open(imglist[hidden_control_val].action,"_blank");
            }else{
                window.open('http://www.ucruising.com/ca/',"_blank");
            }
        });

        main_container.addEventListener('mouseenter',()=>{
            _stop_loop_event(interval);
        });

        main_container.addEventListener('mouseout',(e)=>{
            let in_main_area = !main_container.contains(e.relatedTarget);
            if(in_main_area == false){
                return false;
            }
            _stop_loop_event(interval);
            _start_loop_event(loop_sec);
        });

        // -- contact button click event -- //
        let contact_div = document.getElementById(contact_div_id);
        contact_div.addEventListener('click',(e)=>{
            e.stopPropagation();
            let hidden_control_val = document.getElementById(hidden_img_control_input).value;
            if(is_callable(imglist[hidden_control_val].contact_action)===true){
                imglist[0].contact_action();
            }else if(isemptyzeroset(imglist[hidden_control_val].contact_action)===false && isString(imglist[hidden_control_val].contact_action)===true){
                window.open(imglist[hidden_control_val].contact_action,"_blank");
            }else{
                window.open('http://www.ucruising.com/ca/',"_blank");
            }
        });

        // -- img selection click event -- //
        for(let key in imglist){
            let img_selection_id = layout_header_imgbanner_prefix + 'img_selection_' + key;
            let img_selection_div = document.getElementById(img_selection_id);

            img_selection_div.addEventListener('click',(e)=>{

                e.stopPropagation();
                // -- contact icon setting -- //
                // -- icon --//
                let contact_icon_img_tag = document.getElementById(contact_icon_id);
                let custom_icon_path = imglist[key].contact_icon;
                let custom_icon_style = imglist[key].contact_icon_style;
                if(isemptyzeroset(custom_icon_path)===true){custom_icon_path = contact_us_icon;}
                if(isemptyzeroset(custom_icon_style)===true){custom_icon_style = contact_us_icon_style;}
                contact_icon_img_tag.style.cssText = custom_icon_style;
                contact_icon_img_tag.src = custom_icon_path;

                // -- text face -- //
                let contact_text_div = document.getElementById(contact_text_id);
                let custom_contact_text = '';
                custom_contact_text = imglist[key].contact_text_face;
                if(isemptyzeroset(custom_contact_text)===true){custom_contact_text = default_contact_text_face};
                contact_text_div.innerHTML = custom_contact_text;

                // -- action -- //
                let hidden_control = document.getElementById(hidden_img_control_input);
                hidden_control.value = key;

                // -- logic of animation -- //
                let img_main_id = layout_header_imgbanner_prefix + 'img_main_' + key;
                current_img = document.getElementById(img_main_id);
                setTimeout(()=>{
                    for(let n in imglist){
                        let tmp_img_main_id = layout_header_imgbanner_prefix + 'img_main_' + n;
                        let tmp_img_main = document.getElementById(tmp_img_main_id);
                        tmp_img_main.style.opacity = '0';
                    }
                    current_img.style.opacity = '1';
                },200);
                // -- end logic of animation -- //
            });
        }

        // -- social icon click event -- //
        if(isvalidid(social_media_div_id)===true){
            for(let key in social_media_list){
                let social_media_icon = document.getElementById(social_icon_id_prefix + key);
                social_media_icon.addEventListener('click',(e)=>{
                    e.stopPropagation();
                    if(is_callable(social_media_list[key].action)===true){
                        social_media_list[key].action();
                    }else if(isemptyzeroset(social_media_list[key].action)===false && isString(social_media_list[key].action)===true){
                        window.open(social_media_list[key].action,"_blank");
                    }
                });
            }
        }

        // -- platform list icon click event -- //
        if(isvalidid(platform_div_id)==true){
            for(let key in platform_list){
                let platform_icon = document.getElementById(platform_icon_id_prefix + key);
                platform_icon.addEventListener('click',(e)=>{
                    e.stopPropagation();
                    if(is_callable(platform_list[key].action)===true){
                        platform_list[key].action();
                    }else if(isemptyzeroset(platform_list[key].action)===false && isString(platform_list[key].action)===true){
                        window.open(platform_list[key].action,"_blank");
                    }
                });
            }
        }

        // -- auto loop event -- //
        if(auto_loop){
            _start_loop_event(loop_sec);
        }
    });

    return mylayout;
}