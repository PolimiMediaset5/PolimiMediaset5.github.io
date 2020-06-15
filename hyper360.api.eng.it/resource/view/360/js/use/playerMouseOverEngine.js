function mouseOverCheckEvent(properties) {
    if(properties.events){
        let i = 0;
        let isEvent = false;
        while(i<properties.events.length &&  isEvent === false){
            if(properties.events[i].evenType.toUpperCase() === 'ONCLICK'){
                switch (properties.events[i].actionType){
                case 'jump':
                    postMessage({'type': 'jump','idVideo':properties.events[i].idVideo,'idConfig':properties.events[i].idConfig,'tStart':properties.events[i].tStart,'actionOptions':properties.events[i].actionOptions});
                    isEvent = true;
                    break;
                case 'link':
                    postMessage({'type': 'link', 'link':properties.events[i].itemSelect,'actionOptions':properties.events[i].actionOptions});
                    isEvent = true;
                    break;
                case 'drivehotspot':
                    var itemSelectArrayIndex=[];
                    //porzione di codice che serve per ovviare alla differenza tra vecchi e nuovi oggetti itemSelect
                    for (var y=0 ;y<properties.events[i].itemSelect.length;y++){
                        if (properties.events[i].itemSelect[y].value){
                            itemSelectArrayIndex.push(properties.events[i].itemSelect[y].value);
                        }else {
                            itemSelectArrayIndex.push(properties.events[i].itemSelect[y]);
                        }
                    }
                    postMessage({'type': 'drivehotspot', 'id':itemSelectArrayIndex});
                    isEvent = true;
                    break;
                default:
                    break;
                }
            }
            i=i+1;
        }
        if(isEvent === false && properties.cover === true){
            postMessage({'type': 'cover', 'id':""});
        }   
    }else if(properties.cover === true){
        postMessage({'type': 'cover', 'id':""});
    }
  }

  onmessage = function(e) {
    if (e.data.properties) {
        mouseOverCheckEvent(e.data.properties);
    }
  };
  