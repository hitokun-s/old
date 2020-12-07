var layerTitles = [
  "saintmarc", "tullys","doutor","komeda","starbucks"
];
var chains = new Vue({
  el: '#chain-selector',
  data: {
    chains: layerTitles,
    checkedChains: [true, true, true, true, true]
  },
  mounted: function(){
    console.log("mounted");
  },
  methods: {
    clicked: function(e){
      console.log("clicked");
      // map.getLayers().getArray()[layerTitles.indexOf(target) + 1].setVisible(checked);
    }
  },
  watch: {
  },
  components: {
  }
});

var map;
$(function () {

  var layer = new ol.layer.Tile({
    source: new ol.source.XYZ({
      url: 'https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaGl0b2t1biIsImEiOiJjaXVqYnd0NXUwMGRwMm9tc3RvcGZ1ZDZ5In0.Q4wyiiGDLH_lTi3zzFcAtA'
    })
  });

  map = new ol.Map({
    layers: [layer],
    target: 'map',
    view: new ol.View({
      center: ol.proj.transform([138, 37.8], 'EPSG:4326', 'EPSG:3857'),
      zoom: 6
    })
  });

  d3.queue()
  .defer(d3.csv, "data/starbucks.csv")
  .defer(d3.csv, "data/komeda.csv")
  .defer(d3.csv, "data/doutor.csv")
  .defer(d3.csv, "data/tullys.csv")
  .defer(d3.csv, "data/saintmarc.csv")
  .await(function(error, starbucks, komeda, doutor, tullys, saintmarc) {
    if (error) {
      console.error('Oh dear, something went wrong: ' + error);
      return;
    }

    var addMarkers = function(data, color, name){
      var markers = new ol.layer.Vector({
        source: new ol.source.Vector({
          features: data.map(function(d){
            return new ol.Feature({
              geometry: new ol.geom.Point(ol.proj.fromLonLat([parseFloat(d.lng), parseFloat(d.lat)])),
              name: d.name
            })
          })
        }),
        style: new ol.style.Style({
          image: new ol.style.Circle({
            radius: 1,
            stroke: new ol.style.Stroke({
              color: color
            }),
            fill: new ol.style.Fill({
              color: color
            })
          })
        })
      });
      markers.set("name", name);
      map.addLayer(markers);
    };
    addMarkers(tullys, "brown", "saintmarc");
    addMarkers(tullys, "red", "tullys");
    addMarkers(doutor, "black", "doutor");
    addMarkers(komeda, "blue", "komeda");
    addMarkers(starbucks, "green", "starbucks");

    map.on("pointerdrag", function(){
      map.getLayers().getArray().forEach(function(l,i){
        if(i == 0)return;
        // l.setVisible(false);
      });
    });

    map.on("moveend", function(){
      map.getLayers().getArray().forEach(function(l,i){
        if(i == 0)return;
        if(chains.checkedChains.indexOf(l.get("name")) > -1){
          l.setVisible(true);
        }
      });
    });
  });
});
$(window).on('load resize', function () {
  $("#map").css("padding-top", $(".coffee-header").height());
});

var hoge = function(target, checked){
  console.log(target);
  // chains.clicked(target, checked);
  map.getLayers().getArray()[layerTitles.indexOf(target) + 1].setVisible(checked);
}