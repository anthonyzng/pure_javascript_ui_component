function formstyle_ratingstar(domid,total_star,rating_star,rated_color,unrated_color,rating_mode,star_style){
    if(isemptyzeroset(domid) === true){ console_error('you must give a domid for getting the value back!');return false; }
    if(isemptyzeroset(total_star) === true){ total_star = 6; }
    if(isemptyzeroset(rating_star) === true){ rating_star = 0; }
    if(isemptyzeroset(rated_color) === true){ rated_color = 'gold'; }
    if(isemptyzeroset(unrated_color) === true){ unrated_color = 'lightgray'; }
    if(isemptyzeroset(rating_mode) === true){ rating_mode = 0; } // -- rating mode 0 = accept int , 1 = accept float; , 2 = accept half of star -- // 
    if(isemptyzeroset(star_style) === true){ star_style = ''; }

    let mylayout = '';
    let container_style = 'display:inline-flex; direction:ltr; align-items:center; position:relative;';
    let each_star_style = 'color:' + unrated_color + ';' +
                'cursor:pointer; position:relative; display:inline-block; ' +
                'width:30px; height:30px; background:' + unrated_color + '; ' +
                'clip-path: polygon(50% 0%, 63% 38%, 98% 38%, 69% 59%, 79% 91%, ' +
                '50% 70%, 21% 91%, 31% 59%, 2% 38%, 37% 38%); margin-right:5px;' +
                'transition: transform 0.2s ease, clip-path 0.1s ease; transform: scale(1);';

    mylayout += '<div id="'+domid+'" style="'+container_style+'" data-rating="'+rating_star+'" data-clicked="0">'; // containter

    for(let i = 0 ;i < total_star; i ++){
        let current_star_id = domid+'_'+i;
        mylayout += '<div id="'+current_star_id+'" style="'+each_star_style+''+star_style+'"></div>';
    }

    mylayout += '</div>';

    waitfordomid(domid,()=>{

        if(rating_star != 0){
            document.getElementById(domid).setAttribute('data-clicked',1);
        }

        formstyle__register_star_event(domid,total_star,rating_star,rated_color,unrated_color,rating_mode,star_style);

        formstyle_ratingstar__fillstar(domid,rating_star,rated_color,unrated_color,rating_mode);
    });

    return mylayout;
}

function formstyle_ratingstar__fillstar(domid,rating_star,rated_color,unrated_color,rating_mode){
    if(isemptyzeroset(domid) === true){ console_error('you must give a domid for getting the value back!');return false; }
    if(isvalidid(domid)===false){console_error('This domid is invalid!'); return false;}
    if(isemptyzeroset(rating_star) === true ){ rating_star = 0; }
    if(isemptyzeroset(rated_color) === true){ rated_color = 'gold'; }
    if(isemptyzeroset(unrated_color) === true){ unrated_color = 'lightgray'; }

    let star_list = document.getElementById(domid).children;
    for(let i = 0 ; i <star_list.length; i ++){

        let star_node = star_list[i];
        let starRating = i + 1;

        let fractionalWidth = (rating_star - (starRating - 1)) * 100; // get the width % of the star

        let fill_star = `linear-gradient(90deg, ${rated_color} 100%, ${unrated_color} 100%)`;
        if(rating_mode == 1 || rating_mode == 2){
            fill_star = `linear-gradient(90deg, ${rated_color} ${fractionalWidth}%, ${unrated_color} ${fractionalWidth}%)`;
        }

        if(starRating <= rating_star){
            star_node.style.background = rated_color;
        }else if(starRating - 1 < rating_star){
            star_node.style.background = fill_star;
        }else{
            star_node.style.background = unrated_color;
        }
    }

    return true;
}

function formstyle_ratingstar_getvalue(domid){
    if(isemptyzeroset(domid) === true){ console_error('you must give a domid for getting the value back!');return false; }
    if(isvalidid(domid)===false){console_error('This domid is invalid!'); return false;}
    return document.getElementById(domid).getAttribute('data-rating');
}

function formstyle__register_star_event(domid,total_star,rating_star,rated_color,unrated_color,rating_mode,star_style){
    if(isemptyzeroset(domid) === true){ console_error('you must give a domid for getting the value back!');return false; }
    if(isemptyzeroset(total_star) === true){ total_star = 6; }
    if(isemptyzeroset(rating_star) === true){ rating_star = 0; }
    if(isemptyzeroset(rated_color) === true){ rated_color = 'gold'; }
    if(isemptyzeroset(unrated_color) === true){ unrated_color = 'lightgray'; }
    if(isemptyzeroset(rating_mode) === true){ rating_mode = 0; } // -- rating mode 0 = accept int , 1 = accept float; , 2 = accept half of star -- // 
    if(isemptyzeroset(star_style) === true){ star_style = ''; }

    let star_list = document.getElementById(domid).children;
    let main_div = document.getElementById(domid);

    for(let i = 0 ; i <star_list.length; i ++){
        let star_node = star_list[i];
        let current_star_rating = i+1;

        if(rating_mode == 1 || rating_mode == 2){ // -- accept float

            star_node.addEventListener('mousemove',()=>{
                let click_status = main_div.getAttribute('data-clicked');
                if(click_status == 0){
                    let rect = star_node.getBoundingClientRect();
                    let x = event.clientX - rect.left;
                    let widthPercent = (x / rect.width).toFixed(2);
                    
                    let updated_rating = current_star_rating - 1 + parseFloat(widthPercent);

                    if(rating_mode == 2){
                        updated_rating = Math.ceil(updated_rating*2)/2;
                    }

                    main_div.setAttribute('data-rating',updated_rating);
                    formstyle_ratingstar__fillstar(domid,updated_rating, rated_color, unrated_color, rating_mode);
                }
                
                setTimeout(()=>{star_node.style.transform = 'scale(1.2)';},200);
            });

            star_node.addEventListener('mouseout',()=>{
                setTimeout(()=>{star_node.style.transform = 'scale(1)';},200);
            })

            main_div.addEventListener('mouseout',(e)=>{
                let click_status = main_div.getAttribute('data-clicked');
                if(!main_div.contains(e.relatedTarget) && click_status == 0){
                    formstyle_ratingstar__fillstar(domid,0, rated_color, unrated_color, rating_mode);
                    main_div.setAttribute('data-rating',0);
                }
            });

            star_node.addEventListener('click',()=>{
                let click_status = main_div.getAttribute('data-clicked');
                let rect = star_node.getBoundingClientRect();
                let x = event.clientX - rect.left;
                let widthPercent = (x / rect.width).toFixed(2);
    
                let updated_rating = current_star_rating - 1 + parseFloat(widthPercent);
    
                let last_rating = main_div.getAttribute('data-rating');

                if(click_status == 0){
                    main_div.setAttribute('data-clicked',1);
                }

                if(rating_mode == 2){ // round up by 0.5 to do the half of star rating.
                    updated_rating = Math.ceil(updated_rating*2)/2;
                }

                if(updated_rating == last_rating && click_status == 1){
                    updated_rating = 0; // for clean the rating
                    main_div.setAttribute('data-clicked',0);
                }

                main_div.setAttribute('data-rating',updated_rating);

                formstyle_ratingstar__fillstar(domid,updated_rating, rated_color, unrated_color, rating_mode);
            });

        }else{ // -- mode 0 -- //
            star_node.addEventListener('click',()=>{
                
                let rect = star_node.getBoundingClientRect();
                let x = event.clientX - rect.left;
                let widthPercent = (x / rect.width).toFixed(2);
    
                let updated_rating = current_star_rating - 1 + parseFloat(widthPercent);
    
                let last_rating = main_div.getAttribute('data-rating');
    
                updated_rating = Math.ceil(updated_rating);

                if(parseInt(updated_rating) == parseInt(last_rating)){
                    updated_rating = 0; // for clean the rating
                }

                main_div.setAttribute('data-rating',updated_rating);

                if(updated_rating != 0){
                    updated_rating = updated_rating - 0.01;
                }
                
                formstyle_ratingstar__fillstar(domid,updated_rating, rated_color, unrated_color, rating_mode);
            });
        }
    }

    return true;
}

function formstyle_ratingstar_setvalue(domid,total_star,rating_star,rated_color,unrated_color,rating_mode,star_style){
    if(isemptyzeroset(domid) === true){ console_error('you must give a domid for getting the value back!');return false }
    if(isvalidid(domid)===false){console_error('This domid is invalid!'); return false;}
    if(isemptyzeroset(total_star) === true){ total_star = 6; }
    if(isemptyzeroset(rating_star) === true){ rating_star = 0; }
    if(isemptyzeroset(rated_color) === true){ rated_color = 'gold'; }
    if(isemptyzeroset(unrated_color) === true){ unrated_color = 'lightgray'; }
    if(isemptyzeroset(rating_mode) === true){ rating_mode = 0; } // -- rating mode 0 = accept int , 1 = accept float; , 2 = accept half of star -- // 
    if(isemptyzeroset(star_style) === true){ star_style = ''; }

    let each_star_style = 'color:' + unrated_color + ';' +
                'cursor:pointer; position:relative; display:inline-block; ' +
                'width:30px; height:30px; background:' + unrated_color + '; ' +
                'clip-path: polygon(50% 0%, 63% 38%, 98% 38%, 69% 59%, 79% 91%, ' +
                '50% 70%, 21% 91%, 31% 59%, 2% 38%, 37% 38%); margin-right:5px;' +
                'transition: transform 0.2s ease, clip-path 0.1s ease; transform: scale(1);';

    let main_container = document.getElementById(domid);
    main_container.innerHTML = '';
    
    let mylayout = '';
    for(let i = 0 ;i < total_star; i ++){
        let current_star_id = domid+'_'+i;
        mylayout += '<div id="'+current_star_id+'" style="'+each_star_style+''+star_style+'"></div>';
    }

    main_container.innerHTML = mylayout;

    main_container.setAttribute('data-rating',rating_star);

    main_container.setAttribute('data-clicked',0);

    formstyle__register_star_event(domid,total_star,rating_star,rated_color,unrated_color,rating_mode,star_style);

    formstyle_ratingstar__fillstar(domid,rating_star,rated_color,unrated_color,rating_mode);

    return true;
}
