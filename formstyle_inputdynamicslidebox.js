// -- formstyle_inputdynamicslidebox -- //
function formstyle_inputdynamicslidebox(domid,itemlist,arrow_list,size,container_style){
    // -- id -- //
    let dom_prefix = 'formstyle_inputdynamicslidebox_';
    if(isset(domid)===false || domid == ''){ domid = dom_prefix + getuniqueid();}
    let slide_div_id = formstyle_inputdynamicslidebox__getslideboxdivid(domid);
    let left_arrow_div_id = formstyle_inputdynamicslidebox__getleftarrowdivid(domid);
    let right_arrow_div_id = formstyle_inputdynamicslidebox__getrightarrowdivid(domid);
    
    if(isarrayset(itemlist)===false){console_error('datalist is empty');return false;}
    if(isarrayset(arrow_list)===false){console_error('arrow_list is empty');return false;}
    if(isarrayset(size)===false){console_error('size is empty');return false;}
    
    size = formstyle_inputdynamicslidebox_chksize(size);

    // -- layout -- //
    let mylayout = '';

    mylayout += '<div style="display:flex; flex-direction:row; justify-content:center; align-items:center; box-sizing: border-box; '+container_style+';" id="'+domid+'">';
    /// left 
    mylayout += '<div style="cursor:pointer; box-sizing: border-box;" id="'+left_arrow_div_id+'">'
    mylayout += '<img src="'+arrow_list['left'].arrow_img+'" style="'+arrow_list['left'].arrow_style+' box-sizing: border-box;" class="right middle" />';
    mylayout += '</div>';
    
    // slide box
    mylayout += '<div style="display:flex; flex-direction:row; overflow-x: hidden; scroll-snap-type: x mandatory; scroll-snap-stop: always; overflow-y:hidden; margin-left:10px; margin-right:10px; box-sizing: border-box; " id="'+slide_div_id+'">';
    mylayout += '</div>';
    // right
    mylayout += '<div style="cursor:pointer; box-sizing: border-box;" id="'+right_arrow_div_id+'">';
    mylayout += '<img src="'+arrow_list['right'].arrow_img+'" style="'+arrow_list['right'].arrow_style+' box-sizing: border-box;" class="right middle" />';
    mylayout += '</div>';

    mylayout += '</div>';


    waitfordomid(domid,()=>{
        let left_arrow_div = document.getElementById(left_arrow_div_id);
        let right_arrow_div = document.getElementById(right_arrow_div_id);
        let slidebox_div = document.getElementById(slide_div_id);
        
        // -- add callback into left and right arrow -- //
        left_arrow_div.addEventListener('click', ()=>{
            if(slidebox_div.scrollLeft == 0){
                if(is_callable(arrow_list['left'].far_left_callback) === true){
                    arrow_list['left'].far_left_callback();
                }
            }

            let scrollleftto = slidebox_div.scrollLeft - size['Imgwidth'];
            slidebox_div.scrollTo({
                left: scrollleftto,
                behavior: 'smooth',
            });

            if(is_callable(arrow_list['left'].click_callback)){
                arrow_list['left'].click_callback();
            }
        });

        left_arrow_div.addEventListener('mouseenter', ()=>{
            left_arrow_div.children[0].src = arrow_list['left'].arrow_hover_img;
        });

        left_arrow_div.addEventListener('mouseleave', ()=>{
            left_arrow_div.children[0].src = arrow_list['left'].arrow_img;
        });

        right_arrow_div.addEventListener('click', ()=>{
            let maximum_width = slidebox_div.scrollWidth - slidebox_div.clientWidth;
            if(slidebox_div.scrollLeft == maximum_width){
                if(is_callable(arrow_list['right'].far_right_callback) === true){
                    arrow_list['right'].far_right_callback();
                }
            }

            let scrollleftto = slidebox_div.scrollLeft + size['Imgwidth'];
            slidebox_div.scrollTo({
                left: scrollleftto,
                behavior: 'smooth',
            });

            if(is_callable(arrow_list['right'].click_callback)){
                arrow_list['right'].click_callback();
            }
        });

        right_arrow_div.addEventListener('mouseenter', ()=>{
            right_arrow_div.children[0].src = arrow_list['right'].arrow_hover_img;
        });

        right_arrow_div.addEventListener('mouseleave', ()=>{
            right_arrow_div.children[0].src = arrow_list['right'].arrow_img;
        });

        // -- layout initialize -- //

        for(let key in itemlist){
            let item = itemlist[key];
            let item_layout = formstyle_inputdynamicslidebox__createitemlayout(item,size);
            formstyle_inputdynamicslidebox__additemtoslidebox(domid,item_layout);
            formstyle_inputdynamicslidebox__resizeslidebox(domid,size);
        }

        // -- resize action -- //
        platform_setonresize(() => {
            if (isvalidid(domid) === true) {
                formstyle_inputdynamicslidebox__resizeslidebox(domid,size);
            } else {
                // remove the resize action if the domid is not valid or not in page
                platform_setonresize(null, false, domid);
            }
        }, false, domid);

        return true;
    });
    
    return mylayout;
}

function formstyle_inputdynamicslidebox_setitemslist(domid,itemlist,size){
    if(isvalidid(domid)===false){console_error('Invalid domid');return false;}
    if(isemptyzeroset(itemlist)===true){console_error('itemlist is empty'); return false;}
    if(isemptyzeroset(size)===true){console_error('size is empty'); return false;}

    size = formstyle_inputdynamicslidebox_chksize(size);

    let slidebox_div = document.getElementById(formstyle_inputdynamicslidebox__getslideboxdivid(domid));
    slidebox_div.innerHTML = '';

    for(let key in itemlist){
        let item = itemlist[key];
        let item_layout = formstyle_inputdynamicslidebox__createitemlayout(item,size);
        formstyle_inputdynamicslidebox__additemtoslidebox(domid,item_layout);
    }

    formstyle_inputdynamicslidebox__resizeslidebox(domid,size);

    return true;
}

function formstyle_inputdynamicslidebox__resizeslidebox(domid,size){
    if(isvalidid(domid)===false){console_error('Invalid domid');return false;}
    if(isemptyzeroset(size)===true){console_error('size is empty'); return false;}
    let main_container_div = document.getElementById(domid);
    let slidebox_div = document.getElementById(formstyle_inputdynamicslidebox__getslideboxdivid(domid));
    let left_arrow_div = document.getElementById(formstyle_inputdynamicslidebox__getleftarrowdivid(domid));
    let right_arrow_div = document.getElementById(formstyle_inputdynamicslidebox__getrightarrowdivid(domid));

    let slidebox_width = main_container_div.offsetWidth - right_arrow_div.offsetWidth - left_arrow_div.offsetWidth;
    let display_item_count = Math.floor(slidebox_width / size['Itemwidth']);
    let new_max_width = display_item_count * size['Itemwidth'];
    slidebox_div.style.maxWidth = new_max_width + 'px';

    return true;
}

function formstyle_inputdynamicslidebox__createitemlayout(item,size){
    if(isemptyzeroset(item)===true){console_error('item is empty'); return false;}
    if(isemptyzeroset(size)===true){console_error('size is empty'); return false;}

    let item_div_id = 'formstyle_inputdynamicslidebox_item_'+getuniqueid();
    let mylayout = '';
    mylayout += '<div style="width:'+size['Itemwidth']+'px; height:'+size['Itemheight']+'px;  display:flex; flex-direction:column; justify-content:center; align-items:center; cursor:pointer; box-sizing: border-box;" class="center middle">';
    mylayout += '<img src="'+item['imgurl']+'" style="width:'+size['Imgwidth']+'px; height:'+size['Imgheight']+'px; box-sizing: border-box; border-radius:10px;" alt="'+item['title']+'" />';
    mylayout += '<span style="width:'+size['Imgwidth']+'px; margin-top:10px; font-size:'+size['TitleFontSize']+'px; color:'+item['TitleFontSize']+'; '+item['title_style']+' box-sizing: border-box; -webkit-line-clamp: 2; text-overflow: ellipsis; overflow: hidden; -webkit-box-orient: vertical; display:-webkit-box;">'+item['title']+'</span>';
    mylayout += '<span style="width:'+size['Imgwidth']+'px; margin-top:10px; font-size:'+size['DescFontSize']+'px; color:'+item['DescFontColor']+'; '+item['description_style']+' box-sizing: border-box; -webkit-line-clamp:1; text-overflow: ellipsis; overflow: hidden; -webkit-box-orient: vertical; display:-webkit-box;">'+item['description']+'</span>';
    mylayout += '</div>';

    mylayout = clicknode_basenode(mylayout, item_div_id, '', 'cursor:pointer; border-radius: 10px;',true);
    clicknode_regaction(item_div_id, 'click', ()=>{
        item['callback']();
    });

    return mylayout;
}

function formstyle_inputdynamicslidebox__additemtoslidebox(domid,itemlayout){
    if(isvalidid(domid)===false){console_error('Invalid domid');return false;}
    if(isemptyzeroset(itemlayout)===true){console_error('itemlayout is empty'); return false;}
    let slidebox_div_id = formstyle_inputdynamicslidebox__getslideboxdivid(domid);
    let slidebox_div = document.getElementById(slidebox_div_id);

    let tmp_div = document.createElement('div');
    tmp_div.style.cssText = 'flex: 1 0 auto; scroll-snap-align: start; box-sizing: border-box;';

    tmp_div.innerHTML = itemlayout;
    slidebox_div.appendChild(tmp_div);
    
    return true;
}

function formstyle_inputdynamicslidebox_chksize(size) {
    if (isset(size) === false || isarrayset(size) === false) { size = {}; }
    let mysize = {};
    let screenmode = platform_screenmode();
    if (screenmode == 'mobile') {
        // mobile
        mysize['Imgwidth'] = 75;
        mysize['Imgheight'] = 50;
        mysize['Itemwidth'] = 110;
        mysize['Itemheight'] = 180;
        mysize['Itempadding'] = 8;
        mysize['TitleFontSize'] = 14;
        mysize['DescFontSize'] = 12;
        mysize['TitleFontColor'] = 'var(--font-color)';
        mysize['DescFontColor'] = 'var(--font-color)';
    } else {
        // desktop
        mysize['Imgwidth'] = 225;
        mysize['Imgheight'] = 150;
        mysize['Itemwidth'] = 280;
        mysize['Itemheight'] = 280;
        mysize['Itempadding'] = 10;
        mysize['TitleFontSize'] = 16;
        mysize['DescFontSize'] = 12;
        mysize['TitleFontColor'] = 'var(--font-color)';
        mysize['DescFontColor'] = 'var(--font-color)';
    }
    return chkhash(mysize, size);
}

// -- get ID -- //
function formstyle_inputdynamicslidebox__getleftarrowdivid(domid){
    if (isemptyzeroset(domid) === true) { domid = ''; }
    return 'formstyle_inputdynamicslidebox__left_arrow_div_' + domid;
}

function formstyle_inputdynamicslidebox__getrightarrowdivid(domid){
    if (isemptyzeroset(domid) === true) { domid = ''; }
    return 'formstyle_inputdynamicslidebox__right_arrow_div_' + domid;
}

function formstyle_inputdynamicslidebox__getslideboxdivid(domid){
    if (isemptyzeroset(domid) === true) { domid = ''; }
    return 'formstyle_inputdynamicslidebox__slide_box_' + domid;
}