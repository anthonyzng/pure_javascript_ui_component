function formstyle_create_dragdrop_obj(groupid,direction,master_container_style,item_container_style,default_title){
    if (isset(groupid) === false) { console_error("Missing groupid."); return false; }
    if (isset(master_container_style) === false || master_container_style == '') { 
        master_container_style = 'background-color: #EAEAEA; border: 2px dashed var(--theme-color); border-radius: 8px; width:300px; margin:12px;';
    }
    if (isset(item_container_style) === false || item_container_style == '') { item_container_style = ''; }
    if (isset(direction) === false || direction == '') { direction = 'column'; }
    if (isset(default_title) === false || default_title == '') { default_title = ''; }
    let mytheme = platform_gettheme();

    let prefix = 'formstyle_create_dragdrop_obj_';
    // -- id -- //
    let master_container_id = prefix +'master_container_' +groupid;
    let container_id = prefix + 'container_'+groupid;
    let mylayout = '';

    mylayout += '<div id="' + master_container_id + '" style="' + master_container_style + ' overscroll-behavior: none;">';
    // -- item container -- //
    mylayout += '<div id="' + container_id + '" style="display:flex; flex-direction:'+direction+'; flex-wrap:wrap; gap:8px; margin:8px; min-height:60px; padding:20px; overscroll-behavior: none;">';
    mylayout += '</div>';
    // -- end of item container -- //
    mylayout += '</div>';

    // -- default title layout -- //
    let default_title_layout = ()=>{
        if(isset(default_title) === false || default_title == '') { default_title = 'Default Title'; }
        let this_layout = '';
        let default_title_id = prefix + 'default_title_' + groupid + getuniqueid();
        let default_edit_icon_id = prefix + 'default_edit_icon_' + groupid + getuniqueid();
        let default_menu_icon_id = prefix + 'default_menu_icon_' + groupid + getuniqueid();

        this_layout += '<div style="background-color: #EAEAEA; display:flex; flex-direction:row; align-items:center; padding:4px; margin:8px;'+ '" >';
        this_layout += '<div style="background-color: #EAEAEA; display:flex; flex-direction:row; align-items:center; border: 2px dashed var(--theme-color); border-radius: 8px; padding:4px; margin:8px;'+ '" >';
        this_layout += '<input type="text" value="'+default_title+'" style="border: none; background: transparent; outline: none; flex: 1; color:var(--theme-color); " id="'+default_title_id+'" />';
        this_layout += '<img src="'+mytheme['IMGFolder']+'pencil2_icon.png'+'" draggable="false" style="height:20px; padding:0px 5px 0px 5px; margin-left:auto; cursor:pointer;" id="'+default_edit_icon_id+'"/>';
        this_layout += '</div>';
        this_layout += '<img src="'+mytheme['IMGFolder']+'moreoptions_icon.png'+'" draggable="false" style="height:20px; padding:0px 5px 0px 5px; margin-left:auto; cursor:pointer;" id="'+default_menu_icon_id+'" />';
        this_layout += '</div>';

        waitfordomid(default_edit_icon_id,()=>{
            document.getElementById(default_edit_icon_id).addEventListener('click',()=>{
                console.log('edit title clicked');
            });

            document.getElementById(default_menu_icon_id).addEventListener('click',()=>{

                let this_layout = '<H1>Menu</H1>';
                focusbox_blockscreen(this_layout, true, 'width:80%; height:80%; max-width:650px;', '', 'top center', 'box', '', '');
            });
        });

        return this_layout;
    }

    let default_add_item_layout = ()=>{
        let default_btn_add_item_id = prefix + 'default_btn_add_item_' + groupid + getuniqueid();
        let this_layout = '';
        this_layout += '<div style=" display:flex; flex-direction:row; justify-content:center; align-items:center; margin:12px; cursor:pointer;" id="'+default_btn_add_item_id+'">';
        this_layout += '<img src="'+mytheme['IMGFolder']+'addnew_icon.png'+'" draggable="false" style="height:20px; padding:0px 5px 0px 5px;" />';
        this_layout += '<p style="color:var(--theme-color);" >Add New Item</p>';
        this_layout += '</div>';

        waitfordomid(default_btn_add_item_id,()=>{
            document.getElementById(default_btn_add_item_id).addEventListener('click',()=>{
                formstyle_create_dragdrop_obj_additem(groupid,'<p style="color:red; padding:6px; ">Added Item </p>');
            });
        });

        return this_layout;
    }

    let default_item_layout = (item_name)=>{
        let this_layout = '';
        let item_name_id = prefix + 'item_name_' + groupid + getuniqueid();
        this_layout += '<div style="background-color: blue; border-radius: 8px; padding:4px; margin:8px;'+ '" >';
        this_layout += '<p id="'+item_name_id+'" style="color:var(--theme-color);">'+item_name+'</p>';
        // this_layout += clicknode_basenode(formstyle_clickbutton('btn_ucs_login', 'LOGIN', 'LOGIN', 'formtheme', '120px', '', '555'),'testbtnid'+item_name);
        this_layout += '</div>';

        waitfordomid(item_name_id,()=>{
            document.getElementById(item_name_id).addEventListener('click',()=>{
                console.log('item clicked : ' + item_name_id);
            });

            clicknode_regaction('testbtnid'+item_name, 'click', () => {
                console.log("call other ui function is working.");
            });
        });

        return this_layout;
    }

    waitfordomid(master_container_id, () => {

        let screenmode = platform_screenmode();
        if(screenmode == 'mobile'){
            document.body.style.overscrollBehavior = 'none';
        }else{
            document.body.style.overscrollBehavior = '';
        }

        // -- add the event listener to the screen
        document.addEventListener('touchstart', formstyle_create_dragdrop_obj_handlemovestart);
        document.addEventListener('mousedown', formstyle_create_dragdrop_obj_handlemovestart);
        // -- set default title layout -- //
        for(let i = 0; i < 20; i++) {
            formstyle_create_dragdrop_obj_additem(groupid,default_item_layout('Item '+i));
        }

        // -- given default title and add item button -- //
        if(document.getElementById(master_container_id).children.length == 1){
            formstyle_create_dragdrop_obj_addbeforeitemcontainer(groupid,default_title_layout());
            formstyle_create_dragdrop_obj_addafteritemcontainer(groupid,default_add_item_layout());
        }
        
    });

    return mylayout;
}

// -- test variables -- //
var formstyle_create_dragdrop_cloneobj = null;
var formstyle_create_dragdrop_lastest_target = null; // Store original dragged element
var formstyle_create_dragdrop_crusorobj  = null;

function formstyle_create_dragdrop_obj_handlemovestart(event){
    let selected_element = event.target;

    if(event.target.tagName == 'HTML'){return false;} // -- avoid out range of browser -- //

    if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA' || event.target.isContentEditable) {
        return;
    }
    if (event.type !== 'touchstart' && event.target.type !== 'INPUT') { 
        event.preventDefault();
    }

    let earlyreturn = false;
    if (selected_element.classList.contains('formstyle_create_dragdrop_obj_css') == false) {earlyreturn = true;}
    if (selected_element.closest('.formstyle_create_dragdrop_obj_css')){selected_element = selected_element.closest('.formstyle_create_dragdrop_obj_css');}
    if (selected_element.classList.contains('formstyle_create_dragdrop_obj_css') == false){earlyreturn = true;}else{earlyreturn = false;}
    if(earlyreturn){return false}

    formstyle_create_dragdrop_obj_cleanup();
    formstyle_create_dragdrop_obj_removeevent();
    
    formstyle_create_dragdrop_cloneobj = null; // -- clean the clone object
    formstyle_create_dragdrop_cloneobj = selected_element.cloneNode(true);
    formstyle_create_dragdrop_lastest_target = selected_element; // Store original element

    selected_element.classList.add('formstyle_create_dragdrop_obj_border');
    document.addEventListener('touchmove', formstyle_create_dragdrop_obj_handlemoving);
    document.addEventListener('touchend', formstyle_create_dragdrop_obj_handlemoveend);
    document.addEventListener('mousemove', formstyle_create_dragdrop_obj_handlemoving);
    document.addEventListener('mouseup', formstyle_create_dragdrop_obj_handlemoveend);
}

function formstyle_create_dragdrop_obj_handlemoving(event){
    if(formstyle_create_dragdrop_cloneobj == null){
        return false;
    }

    if (!(event.target instanceof HTMLElement)) {
        return false;
    }

    if(event.target.tagName == 'HTML'){return false;} // -- avoid out range of browser -- //

    if(isset(event) == false || event == null || isset(event.target) == false || event.target == null){return false;}

    if (event.type !== 'touchmove') { event.preventDefault();}

    let selected_element = event.target; // -- current target 
    if(selected_element.classList.contains('formstyle_create_dragdrop_obj_css') == false){selected_element = selected_element.parentElement;}
    if(selected_element.classList.contains('formstyle_create_dragdrop_obj_css') == false){selected_element = event.target;}

    // -- crusor  moving -- //
    let clkpos = screen_coords(event);

    if (isset(formstyle_create_dragdrop_crusorobj) == true) {
        formstyle_create_dragdrop_crusorobj.remove();
        formstyle_create_dragdrop_crusorobj = null;
    }
    
    formstyle_create_dragdrop_crusorobj = document.createElement('div');
    formstyle_create_dragdrop_crusorobj.appendChild(formstyle_create_dragdrop_cloneobj.cloneNode(true));
    formstyle_create_dragdrop_crusorobj = formstyle_create_dragdrop_cloneobj.cloneNode(true);
    formstyle_create_dragdrop_crusorobj.style.backgroundColor = 'white';
    formstyle_create_dragdrop_crusorobj.style.opacity = '0.8';
    formstyle_create_dragdrop_crusorobj.style.padding = '6px';
    formstyle_create_dragdrop_crusorobj.classList.add('formstyle_create_dragdrop_obj_animated-border');
    formstyle_create_dragdrop_crusorobj.style.position = 'absolute';
    formstyle_create_dragdrop_crusorobj.style.top = (clkpos['Y'] + 0) + 'px';
    formstyle_create_dragdrop_crusorobj.style.left = (clkpos['X'] + 10) + 'px';
    formstyle_create_dragdrop_crusorobj.style.zIndex = '999'; // -- set the zindex to the highest -- //
    formstyle_create_dragdrop_crusorobj.classList.remove('formstyle_create_dragdrop_obj_css');

    document.body.style.cursor = 'grabbing';
    if(formstyle_create_dragdrop_crusorobj != null){
        document.body.appendChild(formstyle_create_dragdrop_crusorobj);
    }
    
    // -- auto scroll when cursor is near top or bottom of window -- //
    let mouseY = event.clientY;
    if (event.type == 'touchmove') { mouseY = event.touches[0].clientY; }
    const windowHeight = window.innerHeight;
    const bottomThreshold = 100; // px from bottom to trigger scroll down
    const topThreshold = 100;    // px from top to trigger scroll up

    if (mouseY <= topThreshold) {
        // Cursor near top → start auto scroll up
        if (!isAutoScrolling) {
            startAutoScroll('up');
        }
    } else if (windowHeight - mouseY <= bottomThreshold) {
        // Cursor near bottom → start auto scroll down
        if (!isAutoScrolling) {
            startAutoScroll('down');
        }
    } else {
        // Cursor not near edges → stop scrolling
        stopAutoScroll();
    }

    // // -- end crusor moving -- //
    //  selected_element = selected_element.closest('.formstyle_create_dragdrop_obj_container');
    if(selected_element.classList.contains('formstyle_create_dragdrop_obj_css')==false && selected_element.closest('.formstyle_create_dragdrop_obj_css')){
        selected_element = selected_element.closest('.formstyle_create_dragdrop_obj_css');
    }
    
    if (selected_element.classList.contains('formstyle_create_dragdrop_obj_css') && selected_element != formstyle_create_dragdrop_lastest_target) {
        selected_element.classList.add('formstyle_create_dragdrop_obj_animated-border');
    }else{
        let all_dragobj = document.querySelectorAll('.formstyle_create_dragdrop_obj_css');
        all_dragobj.forEach((dragobj) => {
            dragobj.classList.remove('formstyle_create_dragdrop_obj_animated-border');
        });
    }

    // if target is container // 
    if (selected_element.id.startsWith('formstyle_create_dragdrop_obj_container_')){
        selected_element.classList.add('formstyle_create_dragdrop_obj_animated-border');
    }else{
        let all_dragobj = document.querySelectorAll('[id^="formstyle_create_dragdrop_obj_container_"]');
        all_dragobj.forEach((dragobj) => {
            dragobj.classList.remove('formstyle_create_dragdrop_obj_animated-border');
        });
    }

}

function formstyle_create_dragdrop_obj_handlemoveend(event){
    if(formstyle_create_dragdrop_cloneobj == null){
        return false; // No drag operation in progress
    }

    if (isset(formstyle_create_dragdrop_crusorobj) == true) {
        formstyle_create_dragdrop_crusorobj.remove();
        formstyle_create_dragdrop_crusorobj = null;
    }

    // -- Get the actual release position
    let releaseX, releaseY;
    if (event.type === 'mouseup') {
        releaseX = event.clientX;
        releaseY = event.clientY;
    } else if (event.type === 'touchend') {
        if (event.changedTouches && event.changedTouches.length > 0) {
            releaseX = event.changedTouches[0].clientX;
            releaseY = event.changedTouches[0].clientY;
        } else {
            // No valid touch data, abort
            formstyle_create_dragdrop_obj_cleanup();
            return false;
        }
    } else {
        // Unknown event type, abort
        formstyle_create_dragdrop_obj_cleanup();
        return false;
    }

    // Find the element at the release position
    let elementAtReleasePos = document.elementFromPoint(releaseX, releaseY);
    
    // Check if we released over a valid drop target
    let isValidDropTarget = false;
    let dropTargetElement = null;

    // Walk up the DOM tree to find a valid drop target
    let currentElement = elementAtReleasePos;
    while (currentElement && currentElement !== document.body) {
        if (currentElement.classList && currentElement.classList.contains('formstyle_create_dragdrop_obj_css')) {
            isValidDropTarget = true;
            dropTargetElement = currentElement;
            break;
        }
        // Also check if it's a container (div with formstyle_create_dragdrop_obj_ id)
        if (currentElement.id && currentElement.id.startsWith('formstyle_create_dragdrop_obj_') && 
            currentElement.id !== formstyle_create_dragdrop_lastest_target.closest('[id^="formstyle_create_dragdrop_obj_"]').id) {
            isValidDropTarget = true;
            dropTargetElement = currentElement;
            break;
        }
        currentElement = currentElement.parentElement;
    }

    if (isValidDropTarget && dropTargetElement) {
        formstyle_create_dragdrop_obj_performdrop(dropTargetElement);
    } else {
        // console.log("❌ Invalid drop - released outside drop zone");
    }

    // Clean up
    if(isset(formstyle_create_dragdrop_lastest_target)){
        formstyle_create_dragdrop_lastest_target.classList.remove('formstyle_create_dragdrop_obj_border');
    }
    
    formstyle_create_dragdrop_obj_cleanup();
    stopAutoScroll();
}

function formstyle_create_dragdrop_obj_performdrop(dropTarget) {

    if(dropTarget.classList.contains('formstyle_create_dragdrop_obj_css') == false && dropTarget.closest('.formstyle_create_dragdrop_obj_css')){
        dropTarget = dropTarget.closest('.formstyle_create_dragdrop_obj_css');
    }

    if (dropTarget.classList.contains('formstyle_create_dragdrop_obj_css')) {
        if(dropTarget.previousElementSibling == formstyle_create_dragdrop_lastest_target){
            dropTarget.parentElement.insertBefore(dropTarget, formstyle_create_dragdrop_lastest_target); // -- insert after
        }else{
            dropTarget.parentElement.insertBefore(formstyle_create_dragdrop_lastest_target, dropTarget); // -- insert before
        }
    } else if (dropTarget.id && dropTarget.id.startsWith('formstyle_create_dragdrop_obj_container_')) {
        dropTarget.appendChild(formstyle_create_dragdrop_lastest_target);
    }

    formstyle_create_dragdrop_lastest_target.classList.remove('formstyle_create_dragdrop_obj_border');
    dropTarget.classList.remove('formstyle_create_dragdrop_obj_animated-border');
    formstyle_create_dragdrop_obj_cleanup();
    formstyle_create_dragdrop_obj_removeevent();
}

function formstyle_create_dragdrop_obj_cleanup() {
    // Reset all background colors
    let all_dragobj = document.querySelectorAll('.formstyle_create_dragdrop_obj_css');
    all_dragobj.forEach((dragobj) => {
        dragobj.style.backgroundColor = '';
    });
    
    // Reset cursor
    document.body.style.cursor = '';
    
    // Clear global variables
    formstyle_create_dragdrop_cloneobj = null;
    formstyle_create_dragdrop_lastest_target = null;
    formstyle_create_dragdrop_lastest_target = null;
}

function formstyle_create_dragdrop_obj_removeevent() {
    document.removeEventListener('touchmove', formstyle_create_dragdrop_obj_handlemoving);
    document.removeEventListener('touchend', formstyle_create_dragdrop_obj_handlemoveend);
    document.removeEventListener('mousemove', formstyle_create_dragdrop_obj_handlemoving);
    document.removeEventListener('mouseup', formstyle_create_dragdrop_obj_handlemoveend);
}

function formstyle_create_dragdrop_obj_addbeforeitemcontainer(groupid,layout){
    if (isset(groupid) === false || groupid == '') { console_error("Missing groupid."); return false; }
    if (isset(layout) === false || layout == '') { console_error("Missing layout."); return false; }
    let prefix = 'formstyle_create_dragdrop_obj_';
    // -- id -- //
    let container_id = prefix + 'container_'+groupid;
    let container = document.getElementById(container_id);
    container.insertAdjacentHTML('beforebegin', layout);
    return true;
}

function formstyle_create_dragdrop_obj_addafteritemcontainer(groupid,layout){
    if (isset(groupid) === false || groupid == '') { console_error("Missing groupid."); return false; }
    if (isset(layout) === false || layout == '') { console_error("Missing layout."); return false; }
    let prefix = 'formstyle_create_dragdrop_obj_';
    // -- id -- //
    let container_id = prefix + 'container_'+groupid;
    let container = document.getElementById(container_id);
    container.insertAdjacentHTML('afterend', layout);
    return true;
}

function formstyle_create_dragdrop_obj_addClass2AllChildren(element, className) {
    element.classList.add(className);

    // Loop through all children recursively
    for (const child of element.children) {
        formstyle_create_dragdrop_obj_addClass2AllChildren(child, className);
    }
}

function formstyle_create_dragdrop_obj_additem(groupid,layout,draggable){
    if (isset(groupid) === false || groupid == '') { console_error("Missing groupid."); return false; }
    if (isset(layout) === false || layout == '') { console_error("Missing layout."); return false; }
    if (isset(draggable) === false || draggable == '' || draggable == false || draggable == 0) { draggable = 'false'; }else{draggable = 'true';}

    let prefix = 'formstyle_create_dragdrop_obj_';
    // -- id -- //
    let container_id = prefix + 'container_'+groupid;
    let container = document.getElementById(container_id);
    
    let tmp_div = document.createElement('div');
    tmp_div.classList.add('formstyle_create_dragdrop_obj_css');
    tmp_div.setAttribute('draggable', draggable);
    tmp_div.innerHTML = layout;
    container.appendChild(tmp_div);

    formstyle_create_dragdrop_obj_addClass2AllChildren(tmp_div, 'formstyle_create_dragdrop_obj_css_child');

    return true;
}


var autoScrollTimer = null;
var isAutoScrolling = false;

function startAutoScroll(direction) {
    if (isset(direction) === false || direction == '') { direction = 'down'; }
    if (isAutoScrolling) return;

    isAutoScrolling = true;
    autoScrollTimer = setInterval(function () {
        if (direction === 'down') {
            // ✅ Check bottom
            if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 10) {
                stopAutoScroll();
                return;
            }
            // Scroll down
            window.scrollBy({
                top: 60,
                behavior: 'smooth'
            });
        } else if (direction === 'up') {
            // ✅ Check top
            if (window.scrollY <= 0) {
                stopAutoScroll();
                return;
            }
            // Scroll up
            window.scrollBy({
                top: -60,
                behavior: 'smooth'
            });
        }
    }, 200);
}

function stopAutoScroll() {
    if (!isAutoScrolling) return;
    
    isAutoScrolling = false;
    if (autoScrollTimer) {
        clearInterval(autoScrollTimer);
        autoScrollTimer = null;
    }
}
