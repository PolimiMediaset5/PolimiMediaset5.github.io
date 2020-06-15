function playerEngine(boxobjs, currentTime) {
  for (var i = 0; i < boxobjs.length; i++) {
    var item = boxobjs[i];
    var showhotspot = true; //THE OBJECT WILL BE VISIBLE IN THE SCENE - FOR THE TARGET OBJECT
    if (typeof item.properties.vo !== "undefined") {
      if (typeof item.properties.vo.showhotspot !== "undefined") {
        showhotspot = item.properties.vo.showhotspot;
      }
    }
    if (showhotspot === true) {
      if (
        item.tStart >= 0 &&
        item.tEnd > 0 &&
        item.fulltime === false &&
        showhotspot === true
      ) {
        //new element has the fulltime option and will be without time control
        if (currentTime >= item.tStart && currentTime <= item.tEnd) {
          //sendMessage({'type': 'currentelements', 'action': 'show', 'item': item._id})
          postMessage({
            type: "currentelements",
            action: "show",
            item: item._id
          });
          if (
            item.category === "text" ||
            item.category === "textline" ||
            item.category === "htmlpage" ||
            item.category === "image" ||
            item.category === "audio" ||
            item.category === "metadata" ||
            item.category === "video2d"
          ) {
            var checkvo = false;
            if (typeof item.properties.vo !== "undefined") {
              if (item.properties.vo.ontop === true) {
                if (item.category === "image") {
                  //center of FOV is not necessary
                  postMessage({
                    type: "imageBeahaviourOnTopFromProperties",
                    item: i,
                    checkvo: true
                  });
                  checkvo = true;
                } else if (item.category === "htmlpage") {
                  postMessage({
                    type: "htmlpageBeahaviourOnTopFromProperties",
                    item: i,
                    checkvo: true
                  });
                  checkvo = true;
                } else if (item.category === "text") {
                  postMessage({
                    type: "textBeahaviourOnTopFromProperties",
                    item: i,
                    checkvo: true
                  });
                  checkvo = true;
                } else if (item.category === "textline") {
                  postMessage({
                    type: "textlineBeahaviourOnTopFromProperties",
                    item: i,
                    checkvo: true
                  });
                  checkvo = true;
                } else if (item.category === "audio") {
                  postMessage({
                    type: "audioBeahaviourOnTopFromProperties",
                    item: i,
                    checkvo: true
                  });
                  checkvo = true;
                } else if (item.category === "metadata") {
                  //center of FOV is not necessary
                  postMessage({
                    type: "metadataBeahaviourOnTopFromProperties",
                    item: i,
                    checkvo: true
                  });
                  checkvo = true;
                } else if (item.category === "video2d") {
                  //center of FOV is not necessary
                  postMessage({
                    type: "videoBeahaviourOnTopFromProperties",
                    item: i,
                    checkvo: true
                  });
                  checkvo = true;
                }
              }
            }
            if (!checkvo) {
              var checkevent = false;
              if (item.properties.events) {
                if (
                  item.properties.events.length > 0 &&
                  currentTime >= item.tStart
                ) {
                  //manage onappear/disappear event
                  // console.log(item.properties.events);
                  for (j = 0; j < item.properties.events.length; j++) {
                    if (
                      item.properties.events[j].evenType.toUpperCase() ===
                      "ONAPPEAR"
                    ) {
                      switch (item.properties.events[j].actionType) {
                        case "jump":
                          postMessage({
                            type: "jump",
                            idVideo: item.properties.events[j].idVideo,
                            idConfig: item.properties.events[j].idConfig,
                            tStart: item.properties.events[j].tStart,
                            actionOptions:
                              item.properties.events[j].actionOptions
                          });
                          break;
                        default:
                          break;
                      }
                    }
                  }
                }
              }
              if (!checkevent) {
                if (item.category === "metadata") {
                  postMessage({
                    type: "metadatabeahaviourshow",
                    item: i,
                    checkvo: false
                  });
                } else {
                  postMessage({
                    type: "novo",
                    item: i,
                    checkvo: false,
                    category: item.category
                  });
                }
              }
            }
          } else {
            var checkvo = false;
            /*if (typeof item.properties !== 'undefined' && item.properties && item.properties !== null) {
							if (typeof item.properties.vo !== 'undefined') {
								if (item.properties.vo.ontop === true) {
									if(item.category === 'video2d'){
										postMessage({'type': 'videoBeahaviourOnTopFromProperties', 'item': i,'checkvo':true});
										checkvo = true;
									}
								}
							}
						}*/
            if (!checkvo) {
              var checkevent = false;
              if (item.properties.events) {
                if (
                  item.properties.events.length > 0 &&
                  currentTime >= item.tStart
                ) {
                  //manage onappear/disappear event
                  for (j = 0; j < item.properties.events.length; j++) {
                    if (
                      item.properties.events[j].evenType.toUpperCase() ===
                      "ONAPPEAR"
                    ) {
                      switch (item.properties.events[j].actionType) {
                        case "jump":
                          checkevent = true;
                          postMessage({
                            type: "jump",
                            idVideo: item.properties.events[j].idVideo,
                            idConfig: item.properties.events[j].idConfig,
                            tStart: item.properties.events[j].tStart,
                            actionOptions:
                              item.properties.events[j].actionOptions
                          });
                          break;
                        default:
                          break;
                      }
                    }
                  }
                }
                if (!checkevent) {
                  postMessage({
                    type: "novo2",
                    item: i,
                    checkvo: false,
                    category: item.category
                  });
                }
              }
            }
          }
        } else {
          //HIDE
          postMessage({
            type: "currentelements",
            action: "hide",
            item: item._id
          });

          if (
            item.category === "text" ||
            item.category === "textline" ||
            item.category === "htmlpage" ||
            item.category === "image" ||
            item.category === "audio" ||
            item.category === "metadata" ||
            item.category === "video2d"
          ) {
            var checkvo = false;
            if (typeof item.properties.vo !== "undefined") {
              if (item.properties.vo.ontop === true) {
                if (item.category === "image") {
                  //center of FOV is not necessary
                  postMessage({
                    type: "imageBeahaviourOnTopHideFromProperties",
                    item: i,
                    checkvo: true
                  });
                  checkvo = true;
                } else if (item.category === "htmlpage") {
                  postMessage({
                    type: "htmlpageBeahaviourOnTopHideFromProperties",
                    item: i,
                    checkvo: true
                  });
                  checkvo = true;
                } else if (item.category === "text") {
                  postMessage({
                    type: "textBeahaviourOnTopHideFromProperties",
                    item: i,
                    checkvo: true
                  });
                  checkvo = true;
                } else if (item.category === "textline") {
                  postMessage({
                    type: "textlineBeahaviourOnTopHideFromProperties",
                    item: i,
                    checkvo: true
                  });
                  checkvo = true;
                } else if (item.category === "audio") {
                  postMessage({
                    type: "audioBeahaviourOnTopHideFromProperties",
                    item: i,
                    checkvo: true
                  });
                  checkvo = true;
                } else if (item.category === "metadata") {
                  //center of FOV is not necessary
                  postMessage({
                    type: "metadataBeahaviourOnTopHideFromProperties",
                    item: i,
                    checkvo: true
                  });
                  checkvo = true;
                } else if (item.category === "video2d") {
                  //center of FOV is not necessary
                  postMessage({
                    type: "videoBeahaviourOnTopHideFromProperties",
                    item: i,
                    checkvo: true
                  });
                  checkvo = true;
                }
              }
            }
            if (!checkvo) {
              var checkevent = false;
              if (item.properties.events) {
                if (
                  item.properties.events.length > 0 &&
                  currentTime >= item.tEnd
                ) {
                  //the object must be show in the scene){
                  //manage onappear/disappear event
                  for (j = 0; j < item.properties.events.length; j++) {
                    if (
                      item.properties.events[j].evenType.toUpperCase() ===
                      "ONDISAPPEAR"
                    ) {
                      switch (item.properties.events[j].actionType) {
                        case "jump":
                          checkevent = true;
                          postMessage({
                            type: "jump",
                            idVideo: item.properties.events[j].idVideo,
                            idConfig: item.properties.events[j].idConfig,
                            tStart: item.properties.events[j].tStart,
                            actionOptions:
                              item.properties.events[j].actionOptions
                          });
                          break;
                        default:
                          break;
                      }
                    }
                  }
                }
              }
              if (!checkevent) {
                if (item.category === "metadata") {
                  postMessage({
                    type: "metadarabeahaviourhide",
                    item: i,
                    checkvo: false
                  });
                } else {
                  postMessage({ type: "novohide", item: i, checkvo: false });
                }
              }
            }
          } else {
            var checkvo = false;
            /*if (typeof item.properties !== 'undefined' && item.properties && item.properties !== null) {
							if (typeof item.properties.vo !== 'undefined') {
								if (item.properties.vo.ontop === true) {
									if(item.category === 'video2d'){
										postMessage({'type': 'videoBeahaviourOnTopHideFromProperties', 'item': i,'checkvo':true});
										checkvo = true;
									}
								}
							}
						}*/
            if (!checkvo) {
              var checkevent = false;
              if (item.properties.events) {
                if (
                  item.properties.events.length > 0 &&
                  currentTime >= item.tEnd
                ) {
                  //the object must be show in the scene
                  //manage onappear/disappear event
                  for (j = 0; j < item.properties.events.length; j++) {
                    if (
                      item.properties.events[j].evenType.toUpperCase() ===
                      "ONDISAPPEAR"
                    ) {
                      switch (item.properties.events[j].actionType) {
                        case "jump":
                          checkevent = true;
                          postMessage({
                            type: "jump",
                            idVideo: item.properties.events[j].idVideo,
                            idConfig: item.properties.events[j].idConfig,
                            tStart: item.properties.events[j].tStart,
                            actionOptions:
                              item.properties.events[j].actionOptions
                          });
                          break;
                        default:
                          break;
                      }
                    }
                  }
                }
              }
              if (!checkevent) {
                postMessage({ type: "novohide2", item: i, checkvo: false });
              }
            }
          }
        }
      } else if (item.fulltime == true && showhotspot === true) {
        //FULLTIME MANAGEMENT
        if (
          item.category === "text" ||
          item.category === "textline" ||
          item.category === "htmlpage" ||
          item.category === "image" ||
          item.category === "audio" ||
          item.category === "metadata" ||
          item.category === "video2d"
        ) {
          var checkvo = false;
          if (typeof item.properties.vo !== "undefined") {
            if (item.properties.vo.ontop === true) {
              if (item.category === "image") {
                //center of FOV is not necessary
                postMessage({
                  type: "imageBeahaviourOnTopFromProperties",
                  item: i,
                  checkvo: true
                });
                checkvo = true;
              } else if (item.category === "htmlpage") {
                postMessage({
                  type: "htmlpageBeahaviourOnTopFromProperties",
                  item: i,
                  checkvo: true
                });
                checkvo = true;
              } else if (item.category === "text") {
                postMessage({
                  type: "textBeahaviourOnTopFromProperties",
                  item: i,
                  checkvo: true
                });
                checkvo = true;
              } else if (item.category === "textline") {
                postMessage({
                  type: "textlineBeahaviourOnTopFromProperties",
                  item: i,
                  checkvo: true
                });
                checkvo = true;
              } else if (item.category === "audio") {
                postMessage({
                  type: "audioBeahaviourOnTopFromProperties",
                  item: i,
                  checkvo: true
                });
                checkvo = true;
              } else if (item.category === "metadata") {
                //center of FOV is not necessary
                postMessage({
                  type: "metadataBeahaviourOnTopFromProperties",
                  item: i,
                  checkvo: true
                });
                checkvo = true;
              } else if (item.category === "video2d") {
                //center of FOV is not necessary
                postMessage({
                  type: "videoBeahaviourOnTopFromProperties",
                  item: i,
                  checkvo: true
                });
                checkvo = true;
              }
            }
          }
          if (!checkvo) {
            if (item.category === "metadata") {
              postMessage({
                type: "metadarabeahaviourfulltime",
                item: i,
                checkvo: false
              });
            } else {
              postMessage({ type: "novo", item: i, checkvo: false });
            }
          }
        } else {
          var checkvo = false;
          /*if (typeof item.properties !== 'undefined' && item.properties && item.properties !== null) {
						if (typeof item.properties.vo !== 'undefined') {
							if (item.properties.vo.ontop === true) {
								if(item.category === 'video2d'){
									postMessage({'type': 'videoBeahaviourOnTopFromProperties', 'item': i,'checkvo':true});
									checkvo = true;
								}
							}
						}
					}*/
          if (!checkvo) {
            postMessage({ type: "novo2", item: i, checkvo: false });
          }
        }
      }
      if (i === boxobjs.length - 1) {
        postMessage({ type: "toclean" });
      }
    } else {
      //showhotspot = false -> HIDE OBJECT;
      postMessage({ type: "currentelements", action: "hide", item: item._id });
      if (
        item.category === "text" ||
        item.category === "textline" ||
        item.category === "htmlpage" ||
        item.category === "image" ||
        item.category === "audio" ||
        item.category === "metadata" ||
        item.category === "video2d"
      ) {
        var checkvo = false;
        if (typeof item.properties.vo !== "undefined") {
          if (item.properties.vo.ontop === true) {
            if (item.category === "image") {
              //center of FOV is not necessary
              postMessage({
                type: "imageBeahaviourOnTopHideFromProperties",
                item: i,
                checkvo: true
              });
              checkvo = true;
            } else if (item.category === "htmlpage") {
              postMessage({
                type: "htmlpageBeahaviourOnTopHideFromProperties",
                item: i,
                checkvo: true
              });
              checkvo = true;
            } else if (item.category === "text") {
              postMessage({
                type: "textBeahaviourOnTopHideFromProperties",
                item: i,
                checkvo: true
              });
              checkvo = true;
            } else if (item.category === "textline") {
              postMessage({
                type: "textlineBeahaviourOnTopHideFromProperties",
                item: i,
                checkvo: true
              });
              checkvo = true;
            } else if (item.category === "audio") {
              postMessage({
                type: "audioBeahaviourOnTopHideFromProperties",
                item: i,
                checkvo: true
              });
              checkvo = true;
            } else if (item.category === "metadata") {
              //center of FOV is not necessary
              postMessage({
                type: "metadataBeahaviourOnTopHideFromProperties",
                item: i,
                checkvo: true
              });
              checkvo = true;
            } else if (item.category === "video2d") {
              //center of FOV is not necessary
              postMessage({
                type: "videoBeahaviourOnTopHideFromProperties",
                item: i,
                checkvo: true
              });
              checkvo = true;
            }
          }
        }
        if (!checkvo) {
          if (item.category === "metadata") {
            postMessage({
              type: "metadarabeahaviourhide",
              item: i,
              checkvo: false
            });
          } else {
            postMessage({ type: "novohide", item: i, checkvo: false });
          }
        }
      } else {
        var checkvo = false;
        /*if (typeof item.properties !== 'undefined' && item.properties && item.properties !== null) {
					if (typeof item.properties.vo !== 'undefined') {
						if (item.properties.vo.ontop === true) {
							if(item.category === 'video2d'){
								postMessage({'type': 'videoBeahaviourOnTopHideFromProperties', 'item': i,'checkvo':true});
								checkvo = true;
							}
						}
					}
				}*/
        if (!checkvo) {
          postMessage({ type: "novohide2", item: i, checkvo: false });
        }
      }
    }
  }
}

onmessage = function(e) {
  // the passed-in data is available via e.data
  //console.log(e.data.currentTime
  if (e.data.boxobjs && e.data.currentTime) {
    playerEngine(e.data.boxobjs, e.data.currentTime);
  }
};
