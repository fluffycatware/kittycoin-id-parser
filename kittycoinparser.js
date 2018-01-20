"use strict";

(function(){
    var root = this;
    var prev_kittycoinparser = root.kittycoinparser;
    var designs = ["22222000000000022222.22220111111111102222.22201000000000010222.22010111111111101022.20101111111111110102.01011111111111111010.01011111111111111010.01011111111111111010.01011111111111111010.01011111111111111010.01011111111111111010.01011111111111111010.01011111111111111010.01011111111111111010.01011111111111111010.20101111111111110102.22010111111111101022.22201000000000010222.22220111111111102222.22222000000000022222"]
    function RGBToHSL(r, g, b) {
	if (Array.isArray(r)) {
	    g = r[1];
	    b = r[2];
	    r = r[0];
	}
	var r = r / 255;
	var g = g / 255;
	var b = b / 255;
	var cMax = Math.max(r, g, b);
	var cMin = Math.min(r, g, b);
	var delta = cMax - cMin;
	if (delta == 0) {
	    var h = 0;
	} else if (cMax == r) {
	    var h = 60 * (((g - b) / delta) % 6);
	} else if (cMax == g) {
	    var h = 60 * ((b - r) / delta + 2);
	} else if (cMax == b) {
	    var h = 60 * ((r - g) / delta + 4);
	}
	if (h < 0) {
	    h += 360;
	}
	var l = (cMax + cMin) / 2;

	if (delta == 0) {
	    var s = 0;
	} else {
	    var s = delta / (1 - Math.abs(2 * l - 1));
	}

	return [h, s, l]
    }

    function HSLToRGB(h, s, l) {
	if (Array.isArray(h)) {
	    s = h[1];
	    l = h[2];
	    h = h[0];
	}
	var c = (1 - Math.abs(2 * l - 1)) * s;
	var x = c * (1 - Math.abs((h / 60) % 2 - 1));
	var m = l - c / 2;
	if (h >= 0 && h < 60) {
	    var r = c,
		g = x,
		b = 0;
	} else if (h >= 60 && h < 120) {
	    var r = x,
		g = c,
		b = 0;
	} else if (h >= 120 && h < 180) {
	    var r = 0,
		g = c,
		b = x;
	} else if (h >= 180 && h < 240) {
	    var r = 0,
		g = x,
		b = c;
	} else if (h >= 240 && h < 300) {
	    var r = x,
		g = 0,
		b = c;
	} else if (h >= 300 && h < 360) {
	    var r = c,
		g = 0,
		b = x;
	}
	r = Math.round((r + m) * 255);
	g = Math.round((g + m) * 255);
	b = Math.round((b + m) * 255);
	return [r, g, b];
    }

    function RGBToHex(arr) {
	var r = arr[0],
	    g = arr[1],
	    b = arr[2];
	return "#" + ("0" + r.toString(16)).slice(-2) + ("0" + g.toString(16)).slice(-2) + ("0" + b.toString(16)).slice(-2);
    }

    function derivePalette(r, g, b, invert) {
	var hsl = RGBToHSL(r, g, b);

	var h = hsl[0];
	var s = hsl[1];
	var l = hsl[2];
	var hx = h % 360;
	var hy = (h + 320) % 360;

	var c1 = HSLToRGB(hx, 1, 0.1);
	if (invert) {
	    var c4 = HSLToRGB(hx, 1, 0.2);
	    var c5 = HSLToRGB(hx, 1, 0.45);
	    var c2 = HSLToRGB(hx, 1, 0.7);
	    var c3 = HSLToRGB(hy, 1, 0.8);
	} else {
	    var c2 = HSLToRGB(hx, 1, 0.2);
	    var c3 = HSLToRGB(hx, 1, 0.45);
	    var c4 = HSLToRGB(hx, 1, 0.7);
	    var c5 = HSLToRGB(hy, 1, 0.8);

	}

	return [
	    null,
	    RGBToHex(c1),
	    RGBToHex(c2),
	    RGBToHex(c3),
	    RGBToHex(c4),
	    RGBToHex(c5)
	];
    }

    function hexToBytes(hex){
	var result = []
	for(var i = 0; i < hex.length; i+=2){
	    result.push(parseInt(hex.slice(i, i+2),16));
	}
	return result;
    }

    var kittycoinparser = function (catId){
	if(catId.slice(0,2) == "0x"){
	    catId = catId.slice(2);
	}
	var bytes = hexToBytes(catId);
	var genesis = bytes[0],
	    k = bytes[1],
	    r = bytes[2],
	    g = bytes[3],
	    b = bytes[4];

	var size = size || 10;
	var invert = k >= 128;
	k = 0;
	var design = designs[k].split(".");
	var colors;
	if(genesis){
	    if(k % 2 === 0 && invert || k % 2 === 1 && !invert){
		colors = [null, "#555555", "#d3d3d3", "#ffffff", "#aaaaaa", "#ff9999"];
	    }else{
		colors = [null, "#555555", "#222222", "#111111", "#bbbbbb", "#ff9999"];
	    }
	}else{
	    colors = derivePalette(r, g, b, invert);
	}

	return design.map(function(row){
	    return row.split("").map(function(cell){
		return colors[cell];
	    })
	})
    }

    kittycoinparser.noConflict = function(){
	root.kittycoinparser = prev_kittycoinparser;
	return kittycoinparser;
    }

    if( typeof exports !== 'undefined' ) {
	if( typeof module !== 'undefined' && module.exports ) {
	    exports = module.exports = kittycoinparser;
	}
	exports.kittycoinparser = kittycoinparser;
    } else {
	root.kittycoinparser = kittycoinparser;
    }
}).call(this);
