function windowResizeEngine(boxobjs) {
  for (var i = 0; i < boxobjs.length; i++) {
    var item = boxobjs[i];
    if (typeof item.properties.vo !== "undefined") {
      if (typeof item.properties.vo.showhotspot !== "undefined") {
        showhotspot = item.properties.vo.showhotspot;
      }
    }
    //new element has the fulltime option and will be without time control
    if (item.category === "image" || item.category === "audio") {
      if (typeof item.properties.vo !== "undefined") {
        if (item.properties.vo.ontop === true) {
          if (item.category === "image") {
            //center of FOV is not necessary
            postMessage({
              type: "imageOnTopResizeEvent",
              item: i
            });
          } else if (item.category === "audio") {
            postMessage({
              type: "audioOnTopResizeEvent",
              item: i
            });
          }
        }
      }
    }
  }
}

onmessage = function(e) {
  // the passed-in data is available via e.data
  //console.log(e.data.currentTime
  if (e.data.boxobjs) {
    windowResizeEngine(e.data.boxobjs);
  }
};
