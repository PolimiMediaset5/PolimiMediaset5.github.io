function getPropertyFromWeight(weight, category){
	if(weight < 0.49 && weight > 0){
		return recommenderweightarray[category][0];
	}else if(weight >= 0.49 && weight < 0.84){
		return recommenderweightarray[category][1];
	}else if(weight >= 0.84 && weight <= 1){
		return recommenderweightarray[category][2];
	}
}

function getAlphaValue(actualAlpha, weight ){
	var alpha = actualAlpha*weight;
	if (alpha>= 0.35 ){
		return alpha;
	}else {
		return 0.35; 
	}
}
