var formstyle_create_dragdrop_obj_cloneobj = null;
var formstyle_create_dragdrop_obj_lastest_target = null; // Store original dragged element
var formstyle_create_dragdrop_obj_crusorobj  = null;
var formstyle_create_dragdrop_obj_prefix = 'formstyle_create_dragdrop_obj_';
var formstyle_create_dragdrop_obj_clickstart_timer = null;
var formstyle_create_dragdrop_obj_enabledragevent = null;

function formstyle_create_dragdrop_obj_throttle(callback,delay) {
    let timeoutId;
    let lastExecTime = 0;
    return function (...args) {
        const currentTime = Date.now();
        
        if (currentTime - lastExecTime > delay) {
            callback.apply(this, args);
            lastExecTime = currentTime;
        } else {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                callback.apply(this, args);
                lastExecTime = Date.now();
            }, delay - (currentTime - lastExecTime));
        }
    };
}

const formstyle_create_dragdrop_obj_optimizedHandleMoving = formstyle_create_dragdrop_obj_throttle(function(event) {
    if (formstyle_create_dragdrop_obj_cloneobj == null) {
        return false;
    }

    if (!(event.target instanceof HTMLElement) || event.target.tagName == 'HTML') {
        return false;
    }

    if (!event || !event.target) return false;

    // Prevent default only when necessary
    if (event.type !== 'touchmove') { 
        event.preventDefault();
    }

    if(formstyle_create_dragdrop_obj_isMobile()){
        document.getElementsByTagName('body')[0].style.overflow = 'hidden';
        window.addEventListener('touchmove', formstyle_create_dragdrop_disableScroll, { passive: false });
    }

    let selected_element = event.target;
    
    // Optimize element traversal
    if (!selected_element.classList.contains('formstyle_create_dragdrop_obj_css')) {
        const closest = selected_element.closest('.formstyle_create_dragdrop_obj_css');
        if (closest) {
            selected_element = closest;
        }
    }

    // Cursor moving with reduced DOM operations
    formstyle_create_dragdrop_obj_handleMoving(event);

}, 10); // ~60fps throttling


function formstyle_create_dragdrop_obj(groupid,direction,master_container_style,item_container_style,default_title){
    if (groupid == '' || groupid == undefined || groupid == null) { console_error("Missing groupid."); return false; }
    if (master_container_style == '' || master_container_style == undefined || master_container_style == null) {
        master_container_style = 'background-color: #EAEAEA; border: 2px dashed var(--theme-color); border-radius: 8px; width:300px; margin:12px;';
    }
    if(item_container_style == '' || item_container_style == undefined || item_container_style == null) { item_container_style = ''; }
    if (direction == '' || direction == undefined || direction == null) { direction = 'column'; }
    if (default_title == '' || default_title == undefined || default_title == null) { default_title = 'Default Title'; }
    
    // -- id -- //
    let master_container_id = formstyle_create_dragdrop_obj_prefix +'master_container_' +groupid;
    let container_id = formstyle_create_dragdrop_obj_prefix + 'container_'+groupid;
    let mylayout = '';

    mylayout += '<div id="' + master_container_id + '" style="' + master_container_style + ' overscroll-behavior: none;">';
    // -- item container -- //
    mylayout += '<div id="' + container_id + '" style="display:flex; flex-direction:'+direction+'; flex-wrap:wrap; gap:8px; margin:8px; min-height:60px; padding:20px; overscroll-behavior: none; '+item_container_style+'">';
    mylayout += '</div>';
    // -- end of item container -- //
    mylayout += '</div>';

    // -- default title layout -- //
    let default_title_layout = ()=>{
        let this_layout = '';
        let default_title_id = formstyle_create_dragdrop_obj_prefix + 'default_title_' + groupid + formstyle_create_dragdrop_getUniqueId();
        let default_edit_icon_id = formstyle_create_dragdrop_obj_prefix + 'default_edit_icon_' + groupid + formstyle_create_dragdrop_getUniqueId();
        let default_menu_icon_id = formstyle_create_dragdrop_obj_prefix + 'default_menu_icon_' + groupid + formstyle_create_dragdrop_getUniqueId();

        this_layout += '<div style="background-color: #EAEAEA; display:flex; flex-direction:row; align-items:center; padding:4px; margin:8px;'+ '" >';
        this_layout += '<div style="background-color: #EAEAEA; display:flex; flex-direction:row; align-items:center; border: 2px dashed var(--theme-color); border-radius: 8px; padding:4px; margin:8px;'+ '" >';
        this_layout += '<input type="text" value="'+default_title+'" style="border: none; background: transparent; outline: none; flex: 1; color:var(--theme-color); " id="'+default_title_id+'" />';
        this_layout += '<img src="'+'https://www.w3schools.com/html/pic_trulli.jpg'+'" draggable="false" style="height:20px; padding:0px 5px 0px 5px; margin-left:auto; cursor:pointer;" id="'+default_edit_icon_id+'"/>';
        this_layout += '</div>';
        this_layout += '<img src="'+'https://www.w3schools.com/html/img_girl.jpg'+'" draggable="false" style="height:20px; padding:0px 5px 0px 5px; margin-left:auto; cursor:pointer;" id="'+default_menu_icon_id+'" />';
        this_layout += '</div>';

        formstyle_create_dragdrop_obj_waitForElement('#'+default_edit_icon_id,()=>{
            document.getElementById(default_edit_icon_id).addEventListener('click',()=>{
                console.log('edit title clicked');
            });

            document.getElementById(default_menu_icon_id).addEventListener('click',()=>{
                console.log('menu icon clicked');
            });
        });

        return this_layout;
    }

    let default_add_item_layout = ()=>{
        let default_btn_add_item_id = formstyle_create_dragdrop_obj_prefix + 'default_btn_add_item_' + groupid + formstyle_create_dragdrop_getUniqueId();
        let this_layout = '';
        this_layout += '<div style=" display:flex; flex-direction:row; justify-content:center; align-items:center; margin:12px; cursor:pointer;" id="'+default_btn_add_item_id+'">';
        this_layout += '<img src="'+'https://www.w3schools.com/html/img_girl.jpg'+'" draggable="false" style="height:20px; padding:0px 5px 0px 5px;" />';
        this_layout += '<p style="color:var(--theme-color);" >Add New Item</p>';
        this_layout += '</div>';

        formstyle_create_dragdrop_obj_waitForElement('#'+default_btn_add_item_id,()=>{
            document.getElementById(default_btn_add_item_id).addEventListener('click',()=>{
                // -- add item to item container -- //
                formstyle_create_dragdrop_obj_addItem(groupid,'<p style="color:red; padding:6px; ">Added Item </p>');
            });
        });

        return this_layout;
    }

    let default_item_layout = (item_name)=>{
        let this_layout = '';
        let item_name_id = formstyle_create_dragdrop_obj_prefix + 'item_name_' + groupid + formstyle_create_dragdrop_getUniqueId();
        this_layout += '<div style="background-color: blue; border-radius: 8px; padding:4px; margin:8px;'+ '" >';
        this_layout += '<p id="'+item_name_id+'" style="color:var(--theme-color);">'+item_name+'</p>';
        this_layout += '</div>';

        formstyle_create_dragdrop_obj_waitForElement('#'+item_name_id,()=>{
            document.getElementById(item_name_id).addEventListener('click',()=>{
                console.log('item clicked : ' + item_name_id);
            });

            clicknode_regaction('testbtnid'+item_name, 'click', () => {
                console.log("call other ui function is working.");
            });
        });
        return this_layout;
    }

    formstyle_create_dragdrop_obj_waitForElement('#'+master_container_id, () => {
        if(formstyle_create_dragdrop_obj_isMobile()){
            document.body.style.overscrollBehavior = 'none';
        }else{
            document.body.style.overscrollBehavior = '';
        }

        // -- add the event listener to the screen
        document.addEventListener('touchstart', formstyle_create_dragdrop_obj_handleMoveStart);
        document.addEventListener('mousedown', formstyle_create_dragdrop_obj_handleMoveStart);
        // -- testing items -- //
        for(let i = 0; i < 20; i++) {
            formstyle_create_dragdrop_obj_addItem(groupid,default_item_layout('Item '+i));
        }

        // -- given default title and add item button -- //
        if(document.getElementById(master_container_id).children.length == 1){
            formstyle_create_dragdrop_obj_addBeforeItemContainer(groupid,default_title_layout());
            formstyle_create_dragdrop_obj_addAfterItemContainer(groupid,default_add_item_layout());
        }
        
    });

    return mylayout;
}


function formstyle_create_dragdrop_obj_clickstart(){
    formstyle_create_dragdrop_obj_clickstart_timer = setTimeout(()=>{
        document.addEventListener('touchmove', formstyle_create_dragdrop_obj_handleMoving);
        document.addEventListener('mousemove', formstyle_create_dragdrop_obj_handleMoving);
        formstyle_create_dragdrop_obj_enabledragevent = true;
    },1000);
}

function formstyle_create_dragdrop_obj_cancelclickstart_timer(){
    if(formstyle_create_dragdrop_obj_clickstart_timer){
        clearTimeout(formstyle_create_dragdrop_obj_clickstart_timer);
        formstyle_create_dragdrop_obj_clickstart_timer = null;
        formstyle_create_dragdrop_obj_removeEvent();
        formstyle_create_dragdrop_obj_enabledragevent = false;
    }
}


function formstyle_create_dragdrop_obj_isClickable(element){
    return (typeof element.onclick === 'function' || element.hasClickListener === true);
}

function formstyle_create_dragdrop_obj_isEditable(element){
    return (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || element.isContentEditable );
}

function formstyle_create_dragdrop_obj_ignoreEvent(event){
    let element = event.target;

    while (element) {
        if (formstyle_create_dragdrop_obj_isEditable(element) || formstyle_create_dragdrop_obj_isClickable(element)) {
        return true; // found something editable or clickable
        }
        element = element.parentElement; // move up the DOM tree
    }

    return false; // no matches
}


function formstyle_create_dragdrop_obj_handleMoveStart(event){
    let selected_element = event.target;

    if(formstyle_create_dragdrop_obj_ignoreEvent(event)){return false;}
    
    if ( event.target.type !== 'INPUT') { 
        event.preventDefault();
    }

    let earlyreturn = false;
    if (selected_element.classList.contains('formstyle_create_dragdrop_obj_css') == false) {earlyreturn = true;}
    if (selected_element.closest('.formstyle_create_dragdrop_obj_css')){selected_element = selected_element.closest('.formstyle_create_dragdrop_obj_css');}
    if (selected_element.classList.contains('formstyle_create_dragdrop_obj_css') == false){earlyreturn = true;}else{earlyreturn = false;}
    if(earlyreturn){return false}

    formstyle_create_dragdrop_obj_cleanUp();
    formstyle_create_dragdrop_obj_removeEvent();
    // -- disable scroll function for mobile -- //
    if(formstyle_create_dragdrop_obj_isMobile()){
        document.getElementsByTagName('body')[0].style.overflow = 'hidden';
        window.addEventListener('touchmove', formstyle_create_dragdrop_disableScroll, { passive: false });
    }

    // -- end of disable scroll function for mobile -- //
    formstyle_create_dragdrop_obj_cloneobj = null; // -- clean the clone object
    formstyle_create_dragdrop_obj_cloneobj = selected_element.cloneNode(true);
    formstyle_create_dragdrop_obj_lastest_target = selected_element; // Store original element

    // -- curso object -- //
    formstyle_create_dragdrop_obj_crusorobj = document.createElement('div');
    formstyle_create_dragdrop_obj_crusorobj.appendChild(formstyle_create_dragdrop_obj_cloneobj.cloneNode(true));
    formstyle_create_dragdrop_obj_crusorobj = formstyle_create_dragdrop_obj_cloneobj.cloneNode(true);
    formstyle_create_dragdrop_obj_crusorobj.style.backgroundColor = 'white';
    formstyle_create_dragdrop_obj_crusorobj.style.opacity = '0.8';
    formstyle_create_dragdrop_obj_crusorobj.style.padding = '6px';
    formstyle_create_dragdrop_obj_crusorobj.style.position = 'absolute';
    formstyle_create_dragdrop_obj_crusorobj.style.display = 'none';
    formstyle_create_dragdrop_obj_crusorobj.style.zIndex = '999'; // -- set the zindex to the highest -- //
    formstyle_create_dragdrop_obj_crusorobj.classList.remove('formstyle_create_dragdrop_obj_css');
    formstyle_create_dragdrop_obj_crusorobj.classList.add('formstyle_create_dragdrop_obj_animated-border');

    if(formstyle_create_dragdrop_obj_crusorobj != null){
        document.body.appendChild(formstyle_create_dragdrop_obj_crusorobj);
    }

    selected_element.classList.add('formstyle_create_dragdrop_obj_border');

    formstyle_create_dragdrop_obj_clickstart();
    document.addEventListener('touchend', formstyle_create_dragdrop_obj_handleMoveEnd);
    document.addEventListener('mouseup', formstyle_create_dragdrop_obj_handleMoveEnd);
}

function formstyle_create_dragdrop_obj_handleMoving(event){
    if(formstyle_create_dragdrop_obj_cloneobj == null){
        return false;
    }

    if (!(event.target instanceof HTMLElement)) {
        return false;
    }

    if(event.target.tagName == 'HTML'){return false;} // -- avoid out range of browser -- //

    if(isset(event) == false || event == null || isset(event.target) == false || event.target == null){return false;}

    if (event.type !== 'touchmove') { event.preventDefault();}

    let selected_element = event.target; // -- current target 
    if(selected_element.classList.contains('formstyle_create_dragdrop_obj_css') == false){selected_element = selected_element.parentElement;}else{selected_element = event.target;}

    // -- crusor  moving -- //
    let currentX, currentY;
    if (event.type === 'touchmove') {
        if (event.changedTouches && event.changedTouches.length > 0) {
            currentX = event.changedTouches[0].pageX;
            currentY = event.changedTouches[0].pageY;
        } else {
            return false;
        }
    }else{
        currentX = event.pageX;
        currentY = event.pageY;
    }
    
    formstyle_create_dragdrop_obj_crusorobj.style.display = 'block';
    formstyle_create_dragdrop_obj_crusorobj.style.top = (currentY + 0) + 'px';
    formstyle_create_dragdrop_obj_crusorobj.style.left = (currentX + 10) + 'px';

    document.body.style.cursor = 'grabbing';
    if(formstyle_create_dragdrop_obj_crusorobj != null){
        document.body.appendChild(formstyle_create_dragdrop_obj_crusorobj);
    }
    
    // -- auto scroll when cursor is near top or bottom of window -- //
    formstyle_create_dragdrop_obj_handleAutoScroll(event);
    //-- end crusor moving -- //

    // -- add css to selected element -- //

    if (event.type === 'mouseup' || event.type === 'mousemove') {
        currentX = event.clientX;
        currentY = event.clientY;
    } else if (event.type === 'touchend' || event.type === 'touchmove' || event.type === 'touchstart') {
        if (event.changedTouches && event.changedTouches.length > 0) {
            currentX = event.changedTouches[0].clientX;
            currentY = event.changedTouches[0].clientY;
        } else {
            return false;
        }
    }

    selected_element = document.elementFromPoint(currentX, currentY);

    if(selected_element.classList.contains('formstyle_create_dragdrop_obj_css')==false && selected_element.closest('.formstyle_create_dragdrop_obj_css')){
        selected_element = selected_element.closest('.formstyle_create_dragdrop_obj_css');
    }
    
    if (selected_element.classList.contains('formstyle_create_dragdrop_obj_css') && selected_element != formstyle_create_dragdrop_obj_lastest_target) {
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

function formstyle_create_dragdrop_obj_handleMoveEnd(event){
    if(formstyle_create_dragdrop_obj_cloneobj == null){
        return false; // No drag operation in progress
    }

    if (isset(formstyle_create_dragdrop_obj_crusorobj) == true) {
        formstyle_create_dragdrop_obj_crusorobj.remove();
        formstyle_create_dragdrop_obj_crusorobj = null;
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
            formstyle_create_dragdrop_obj_cleanUp();
            return false;
        }
    } else {
        // Unknown event type, abort
        formstyle_create_dragdrop_obj_cleanUp();
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
            currentElement.id !== formstyle_create_dragdrop_obj_lastest_target.closest('[id^="formstyle_create_dragdrop_obj_"]').id) {
            isValidDropTarget = true;
            dropTargetElement = currentElement;
            break;
        }
        currentElement = currentElement.parentElement;
    }

    if (isValidDropTarget && dropTargetElement) {
        formstyle_create_dragdrop_obj_performDrop(dropTargetElement);
    } else {
        // console.log("❌ Invalid drop - released outside drop zone");
    }

    // Clean up
    if(isset(formstyle_create_dragdrop_obj_lastest_target)){
        formstyle_create_dragdrop_obj_lastest_target.classList.remove('formstyle_create_dragdrop_obj_border');
    }
    
    formstyle_create_dragdrop_obj_cleanUp();
    formstyle_create_dragdrop_obj_stopOptimizedAutoScroll();
    // -- enable scroll function for mobile -- //
    if(formstyle_create_dragdrop_obj_isMobile()){
        document.getElementsByTagName('body')[0].style.overflow = 'auto';
        window.removeEventListener('touchmove', formstyle_create_dragdrop_disableScroll, { passive: false });
    }
}

function formstyle_create_dragdrop_disableScroll(e){
    e.preventDefault();
}

function formstyle_create_dragdrop_obj_performDrop(dropTarget) {

    if(dropTarget.classList.contains('formstyle_create_dragdrop_obj_css') == false && dropTarget.closest('.formstyle_create_dragdrop_obj_css')){
        dropTarget = dropTarget.closest('.formstyle_create_dragdrop_obj_css');
    }

    if (dropTarget.classList.contains('formstyle_create_dragdrop_obj_css')) {
        if(dropTarget.previousElementSibling == formstyle_create_dragdrop_obj_lastest_target){
            dropTarget.parentElement.insertBefore(dropTarget, formstyle_create_dragdrop_obj_lastest_target); // -- insert after
        }else{
            dropTarget.parentElement.insertBefore(formstyle_create_dragdrop_obj_lastest_target, dropTarget); // -- insert before
        }
    } else if (dropTarget.id && dropTarget.id.startsWith('formstyle_create_dragdrop_obj_container_')) {
        dropTarget.appendChild(formstyle_create_dragdrop_obj_lastest_target);
    }

    formstyle_create_dragdrop_obj_lastest_target.classList.remove('formstyle_create_dragdrop_obj_border');
    dropTarget.classList.remove('formstyle_create_dragdrop_obj_animated-border');
    formstyle_create_dragdrop_obj_cleanUp();
    formstyle_create_dragdrop_obj_removeEvent();
}

function formstyle_create_dragdrop_obj_cleanUp() {
    // Reset all background colors
    let all_dragobj = document.querySelectorAll('.formstyle_create_dragdrop_obj_css');
    all_dragobj.forEach((dragobj) => {
        dragobj.style.backgroundColor = '';
    });
    
    // Reset cursor
    document.body.style.cursor = '';
    
    // Clear global variables
    formstyle_create_dragdrop_obj_cloneobj = null;
    formstyle_create_dragdrop_obj_lastest_target = null;
    formstyle_create_dragdrop_obj_lastest_target = null;
}

function formstyle_create_dragdrop_obj_removeEvent() {
    document.removeEventListener('touchmove', formstyle_create_dragdrop_obj_handleMoving);
    document.removeEventListener('touchend', formstyle_create_dragdrop_obj_handleMoveEnd);
    document.removeEventListener('mousemove', formstyle_create_dragdrop_obj_handleMoving);
    document.removeEventListener('mouseup', formstyle_create_dragdrop_obj_handleMoveEnd);
}

function formstyle_create_dragdrop_obj_addBeforeItemContainer(groupid,layout){
    if (groupid == '' || groupid == undefined || groupid == null) { console_error("Missing groupid."); return false; }
    if (layout == '' || layout == undefined || layout == null) { console_error("Missing layout."); return false; }
    let formstyle_create_dragdrop_obj_prefix = 'formstyle_create_dragdrop_obj_';
    // -- id -- //
    let container_id = formstyle_create_dragdrop_obj_prefix + 'container_'+groupid;
    let container = document.getElementById(container_id);
    container.insertAdjacentHTML('beforebegin', layout);
    return true;
}

function formstyle_create_dragdrop_obj_addAfterItemContainer(groupid,layout){
    if (groupid == '' || groupid == undefined || groupid == null) { console_error("Missing groupid."); return false; }
    if (layout == '' || layout == undefined || layout == null) { console_error("Missing layout."); return false; }
    let formstyle_create_dragdrop_obj_prefix = 'formstyle_create_dragdrop_obj_';
    // -- id -- //
    let container_id = formstyle_create_dragdrop_obj_prefix + 'container_'+groupid;
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

function formstyle_create_dragdrop_obj_addItem(groupid,layout,draggable){
    if (groupid == '' || groupid == undefined || groupid == null) { console_error("Missing groupid."); return false; }
    if (layout == '' || layout == undefined || layout == null) { console_error("Missing layout."); return false; }
    if (isset(draggable) === false || draggable == '' || draggable == false || draggable == 0) { draggable = 'false'; }else{draggable = 'true';}

    // -- id -- //
    let container_id = formstyle_create_dragdrop_obj_prefix + 'container_'+groupid;
    let container = document.getElementById(container_id);
    
    let tmp_div = document.createElement('div');
    tmp_div.classList.add('formstyle_create_dragdrop_obj_css');
    tmp_div.setAttribute('draggable', draggable);
    tmp_div.innerHTML = layout;
    container.appendChild(tmp_div);

    formstyle_create_dragdrop_obj_addClass2AllChildren(tmp_div, 'formstyle_create_dragdrop_obj_css_child');

    return true;
}

function formstyle_create_dragdrop_obj_getItemContainer(groupid){
    if (isset(groupid) === false || groupid == '') { console_error("Missing groupid."); return false; }
    // -- id -- //
    let container_id = formstyle_create_dragdrop_obj_prefix + 'container_'+groupid;
    let container = document.getElementById(container_id);
    return container;
}

function formstyle_create_dragdrop_obj_getSortedItemMap(groupid,sortmode){
    if (isset(groupid) === false || groupid == '') { console_error("Missing groupid."); return false; }
    if (isset(sortmode) === false || sortmode == '') { sortmode = 0; } else { sortmode = 1; }

    // -- id -- //
    let container_id = formstyle_create_dragdrop_obj_prefix + 'container_'+groupid;
    let container = document.getElementById(container_id);
    let result_map = {};

    // if sortmode == 1 ,sort the result_map sorting to be descending by key
    if (sortmode == 1) {
        let all_items = container.querySelectorAll('.formstyle_create_dragdrop_obj_css');
        Array.from(all_items).slice().reverse().forEach((item, index) => {
            result_map[index] = item.id;
        });
    }else{
        container.querySelectorAll('.formstyle_create_dragdrop_obj_css').forEach((item, index) => {
            result_map[index] = item.id;
        });
    }

    return result_map;
}

function formstyle_create_dragdrop_obj_deleteitem(itemid){
    if(isset(itemid) === false || itemid == '') { console_error("Missing item ID."); return false; }
    let item = document.getElementById(itemid);
    if(isset(item) && isvalidid(itemid)) {
        item.remove();
    }
    
    return true;
}

function formstyle_create_dragdrop_obj_deleteobj(groupid){
    if (isset(groupid) === false || groupid == '') { console_error("Missing groupid."); return false; }
    let master_container_id = formstyle_create_dragdrop_obj_prefix + 'master_container_' + groupid;
    let master_container = document.getElementById(master_container_id);
    if(isset(master_container) && isvalidid(master_container_id)) {
        master_container.remove();
    }
    return true;
}

function formstyle_create_dragdrop_getUniqueId() {
    return 'formstyle_create_dragdrop_obj_' + crypto.randomUUID();
}

function formstyle_create_dragdrop_obj_isMobile() {
    const ua = navigator.userAgent || navigator.vendor || window.opera;

  // Detect Android
    if (/android/i.test(ua)) return true;

  // Detect iOS (iPhone, iPad, iPod)
    if (/iPhone|iPad|iPod/i.test(ua)) return true;

  // Detect Windows Phone
    if (/windows phone/i.test(ua)) return true;

  // Detect Blackberry
    if (/blackberry/i.test(ua)) return true;

  return false; // default = not mobile
}

function formstyle_create_dragdrop_obj_waitForElement(selector, callback, interval = 50, timeout = 5000) {
    return new Promise((resolve) => {
        if (!selector || typeof selector !== 'string') {
            console.error('waitForElement: selector must be a non-empty string.');
            return resolve(false);
        }
        if (typeof callback !== 'function') {
            console.error('waitForElement: callback must be a function.');
            return resolve(false);
        }

        const startTime = Date.now();

        const timer = setInterval(() => {
            const el = document.querySelector(selector);
            if (el) {
                clearInterval(timer);
                callback(el);
                return resolve(true);
            } else if (Date.now() - startTime > timeout) {
                clearInterval(timer);
                console.warn(`waitForElement: element "${selector}" not found within ${timeout}ms.`);
                return resolve(false);
            }
        }, interval);
    });
}

var autoScrollTimer = null;
var isAutoScrolling = false;
var autoScrollRAF = null;


function formstyle_create_dragdrop_obj_handleAutoScroll(event) {
    let mouseY = event.clientY;
    if (event.type === 'touchmove' && event.touches && event.touches[0]) {
        mouseY = event.touches[0].clientY;
    }
    
    const windowHeight = window.innerHeight;
    const bottomThreshold = 200;
    const topThreshold = 200;

    if (mouseY <= topThreshold) {
        if (!isAutoScrolling) {
            formstyle_create_dragdrop_obj_startAutoScroll('up');
        }
    } else if (windowHeight - mouseY <= bottomThreshold) {
        if (!isAutoScrolling) {
            formstyle_create_dragdrop_obj_startAutoScroll('down');
        }
    } else {
        formstyle_create_dragdrop_obj_stopOptimizedAutoScroll();
    }
}

function formstyle_create_dragdrop_obj_startAutoScroll(direction) {
    if (isset(direction) === false || direction == '') { direction = 'down'; }
    if (isAutoScrolling) return;
    
    isAutoScrolling = true;
    
    function scroll() {
        if (!isAutoScrolling) return;
        
        if (direction === 'down') {
            if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 10) {
                formstyle_create_dragdrop_obj_stopOptimizedAutoScroll();
                return;
            }
            window.scrollBy(0, 10); // Smaller, smoother increments
        } else if (direction === 'up') {
            if (window.scrollY <= 0) {
                formstyle_create_dragdrop_obj_stopOptimizedAutoScroll();
                return;
            }
            window.scrollBy(0, -10);
        }
        
        autoScrollRAF = requestAnimationFrame(scroll);
    }
    
    autoScrollRAF = requestAnimationFrame(scroll);
}

function formstyle_create_dragdrop_obj_stopOptimizedAutoScroll() {
    if (!isAutoScrolling) return;
    
    isAutoScrolling = false;
    if (autoScrollRAF) {
        cancelAnimationFrame(autoScrollRAF);
        autoScrollRAF = null;
    }
}
