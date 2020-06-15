function imageBeahaviourOnTopFromProperties(
  properties,
  data,
  containerHeight,
  containerWidth
) {
  //It's just the overlay of html components overlay out of the scene
  if (properties.vo.ontop) {
    //you must verify if the img is already on the scene
    if (!document.getElementById(properties.id)) {
      var imagecontainer = document.getElementById("container");
      var img = document.createElement("img");
      if (properties.coverpath.length > 0) {
        img.src = properties.coverpath;
      } else {
        img.src = domain + "/resources/video/assets/window.png";
      }
      img.properties = properties;
      img.data = JSON.stringify(data);
      img.width = properties.width ? properties.width : properties.coverwidth;
      img.height = properties.height ? properties.height : properties.coverheight;
      img.style.display = "block";
      img.style.objectFit = "contain";
      img.id = properties.id;

      if (properties.vo.free2d === true) {
        //free2d
        img.style.position = "absolute";
        img.style.objectFit = null;
        var tempx = parseInt(properties.vo.x2d);
        var tempy = parseInt(properties.vo.y2d);
        var temptop = parseInt(data.envinronmentHeight); //db
        var templeft = parseInt(data.envinronmentWidth); //db

        var yRelative = (tempy * parseInt(containerHeight)) / temptop;
        var xRelative = (tempx * parseInt(containerWidth)) / templeft;

        //console.log(yRelative);
        //console.log(xRelative);
        //img.style.left = properties.vo.x2d+'px';
        //img.style.top = properties.vo.y2d+'px';
        img.style.left = xRelative + "px";
        img.style.top = yRelative + "px";
        img.style.zIndex = properties.vo.depth;

        var widthDyn = (img.width * parseInt(containerWidth)) / templeft;
        var heightDyn = (img.height * parseInt(containerHeight)) / temptop;
        //img.width = widthDyn;
        img.width = widthDyn;
        img.height = heightDyn;
      } else if (
        properties.vo.ontopoptionshor === "left" &&
        properties.vo.ontopoptionsver === "top"
      ) {
        img.className = imageEngineClassNameFromProperties(properties);
        img.style.marginLeft = "0px";
        img.style.marginTop = "0px";
      } else if (
        properties.vo.ontopoptionshor === "right" &&
        properties.vo.ontopoptionsver === "top"
      ) {
        img.className = imageEngineClassNameFromProperties(properties);
        img.style.marginLeft = "0px";
        img.style.marginTop = "0px";
      } else if (
        properties.vo.ontopoptionshor === "center" &&
        properties.vo.ontopoptionsver === "top"
      ) {
        img.className = imageEngineClassNameFromProperties(properties);
        img.style.marginLeft = "-" + img.width / 2 + "px";
        img.style.marginTop = "0px";
      } else if (
        properties.vo.ontopoptionshor === "left" &&
        properties.vo.ontopoptionsver === "bottom"
      ) {
        img.className = imageEngineClassNameFromProperties(properties);
        img.style.marginLeft = "0px";
        img.style.marginTop = "0px";
      } else if (
        properties.vo.ontopoptionshor === "right" &&
        properties.vo.ontopoptionsver === "bottom"
      ) {
        img.className = imageEngineClassNameFromProperties(properties);
        img.style.marginLeft = "0px";
        img.style.marginTop = "0px";
      } else if (
        properties.vo.ontopoptionshor === "center" &&
        properties.vo.ontopoptionsver === "bottom"
      ) {
        img.className = imageEngineClassNameFromProperties(properties);
        img.style.marginLeft = "-" + img.width / 2 + "px";
        img.style.marginTop = "0px";
      } else if (
        properties.vo.ontopoptionshor === "left" &&
        properties.vo.ontopoptionsver === "middle"
      ) {
        img.className = imageEngineClassNameFromProperties(properties);
        img.style.marginLeft = "0px";
        img.style.marginTop = "-" + img.height / 2 + "px";
      } else if (
        properties.vo.ontopoptionshor === "right" &&
        properties.vo.ontopoptionsver === "middle"
      ) {
        img.className = imageEngineClassNameFromProperties(properties);
        img.style.marginLeft = "0px";
        img.style.marginTop = "-" + img.height / 2 + "px";
      } else if (
        properties.vo.ontopoptionshor === "center" &&
        properties.vo.ontopoptionsver === "middle"
      ) {
        img.className = imageEngineClassNameFromProperties(properties);
        img.style.marginLeft = "-" + img.width / 2 + "px";
        img.style.marginTop = "-" + img.height / 2 + "px";
      }
      if (properties.vo) {
        if (properties.vo.onblink) {
          switch (properties.vo.onblinkduration) {
            case "fast":
              img.classList.add("imgblinkfast");
              break;
            case "slow":
              img.classList.add("imgblinkslow");
              break;
            default:
              //Medium
              img.classList.add("imgblinkmedium");
          }
        }
      }
      img.addEventListener("click", eventListenerH360);
      imagecontainer.appendChild(img);
    } else if (properties.vo.free2d === true) {
      //free2d
      var img = document.getElementById(properties.id);
      img.style.position = "absolute";

      var tempx = parseInt(properties.vo.x2d);
      var tempy = parseInt(properties.vo.y2d);
      var temptop = parseInt(data.envinronmentHeight);
      var templeft = parseInt(data.envinronmentWidth);

      var yRelative = (tempy * parseInt(containerHeight)) / temptop;
      var xRelative = (tempx * parseInt(containerWidth)) / templeft;
      //console.log(yRelative);
      //console.log(xRelative);
      //img.style.left = properties.vo.x2d+'px';
      //img.style.top = properties.vo.y2d+'px';
      img.style.left = xRelative + "px";
      img.style.top = yRelative + "px";
    }
  }
}

function imageBeahaviourOnTopHideFromProperties(properties) {
  //It's just the overlay of html components overlay out of the scene
  if (properties.vo.ontop) {
    //you must verify if the img is already on the scene
    var element = document.getElementById(properties.id);
    if (element) {
      element.parentNode.removeChild(element);
    }
  }
}


/*
* RESIZING OBJECT AFTER WINDOW RESIZE
*/
function imageOnTopResizeFromProperties(
  properties,
  data,
  containerHeight,
  containerWidth
) {
  //It's just the overlay of html components overlay out of the scene
  if (properties.vo.ontop && properties.vo.free2d === true) {
    //free2d
    var img = document.getElementById(properties.id);
    img.width = properties.width ? properties.width : properties.coverwidth;
    img.height = properties.height ? properties.height : properties.coverheight;
    img.style.position = "absolute";
    var tempx = parseInt(properties.vo.x2d);
    var tempy = parseInt(properties.vo.y2d);
    var temptop = parseInt(data.envinronmentHeight);
    var templeft = parseInt(data.envinronmentWidth);

    var yRelative = (tempy * parseInt(containerHeight)) / temptop;
    var xRelative = (tempx * parseInt(containerWidth)) / templeft;
    //console.log(yRelative);
    //console.log(xRelative);
    //img.style.left = properties.vo.x2d+'px';
    //img.style.top = properties.vo.y2d+'px';
    img.style.left = xRelative + "px";
    img.style.top = yRelative + "px";

    var widthDyn = (img.width * parseInt(containerWidth)) / templeft;
    var heightDyn = (img.height * parseInt(containerHeight)) / temptop;
    //img.width = widthDyn;
    img.width = widthDyn;
    img.height = heightDyn;

  }
}