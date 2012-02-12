$(document).ready(function(){
    var flightsObj = {
        "flightsDirect" : [
            {
                "b_location":"AAAA",
                "e_location":"FFFF",
                "time":1329061405486
            },
            {
                "b_location":"CCC",
                "e_location":"AAAA",
                "time":1329061431888
            },
            {
                "b_location":"EEEE",
                "e_location":"BBBB",
                "time":1329061424231
            },
            {
                "b_location":"CCC",
                "e_location":"AAAA",
                "time":1
            },
            {
                "b_location":"EEEE",
                "e_location":"BBBB",
                "time":3
            },
            {
                "b_location":"CCC",
                "e_location":"AAAA",
                "time":1
            },
            {
                "b_location":"EEEE",
                "e_location":"BBBB",
                "time":3
            },
            {
                "b_location":"CCC",
                "e_location":"AAAA",
                "time":1
            },
            {
                "b_location":"EEEE",
                "e_location":"BBBB",
                "time":3
            },
            {
                "b_location":"CCC",
                "e_location":"AAAA",
                "time":1
            },
            {
                "b_location":"EEEE",
                "e_location":"BBBB",
                "time":3
            },
            {
                "b_location":"CCC",
                "e_location":"AAAA",
                "time":1
            },
            {
                "b_location":"EEEE",
                "e_location":"BBBB",
                "time":3
            },
            {
                "b_location":"CCC",
                "e_location":"AAAA",
                "time":1
            },
            {
                "b_location":"EEEE",
                "e_location":"BBBB",
                "time":3
            },
            {
                "b_location":"CCC",
                "e_location":"AAAA",
                "time":1
            },
            {
                "b_location":"EEEE",
                "e_location":"BBBB",
                "time":3
            }
        ]
    };



    var Flight = Backbone.Model.extend({
    });

    var FlightsList = Backbone.Collection.extend({
        model:Flight
    });
    var SelectedFlights = Backbone.Collection.extend({
        model:Flight
    });

    var selectedFlights = new SelectedFlights();

    var SummaryPanelView = Backbone.View.extend({
        el : $("#summaryPanel"),
        initialize : function(){
            _.bindAll(this,'render','changeSummary');
            this.collection = selectedFlights;
            this.collection.bind("add",this.changeSummary);
        },
        render : function(){

        },
        changeSummary : function(flight){
            var flight = flight.toJSON();
            this.el.append("<td>" + flight.b_location + "</td><td>" + flight.e_location + "</td><td>" + new Date(flight.time).format("m/dd/yy") + " </td>");
        }
    });
    var summaryPanelView = new SummaryPanelView();

    var FlightRowView = Backbone.View.extend({
        "tagName" : "tr",
        events: {
                "click td": "showId"
            },
        initialize : function(){
            _.bindAll(this, "showId");
            this.render();
        },
        showId:function (e) {
            e.preventDefault();
            var name = this.model.get("b_location");
            selectedFlights.add(this.model);
        },
        render: function () {
            var innerModel = this.model;
            $(this.el).append("<td>" + innerModel.get("b_location") + "</td><td>" + innerModel.get("e_location") + "</td><td>" + new Date(innerModel.get("time")).format("m/dd/yy") + " </td>");
        }
    });
    var FlightsTabelView = Backbone.View.extend({
        tagName : "table",
        events : {
            "click th" : "sortFlights"
        },
        initialize:function () {
            _.bindAll(this, 'render', 'updateFlightsSummary', 'fetchBeResponseToBackBone','sortFlights');
            this.collection = new FlightsList();
            this.fetchBeResponseToBackBone(flightsObj);
            $(this.el).append("<tr><th>from</th><th>to</th><th>time</th></tr>");
            this.render();
            /**
             * event refresh is triggered for example by sort
             */
            this.collection.bind("refresh",this.render,this);
        },
        render:function () {
            var self = this;
            $(this.el).find("tr").not(":first").remove();
            _(this.collection.models).each(function (flight) {
               var flightView = new FlightRowView({model : flight});
                $(self.el).append(flightView.el);
            });
        },
        updateFlightsSummary:function (e) {
            e.preventDefault();
            var name = this.model.get("b_location");
            alert(name);
        },
        fetchBeResponseToBackBone: function(obj){
            if(typeof obj.flightsDirect != "undefined"){
                var directFlights = obj.flightsDirect;
                for(var i = 0; i<directFlights.length; i++){
                    var flight = new Flight();
                    flight.set(directFlights[i]);
                    this.collection.add(flight);
                }
            }
        },
        sortFlights : function(e){
            this.collection.comparator = function (flight) {
                var param;
                var target = $(e.target).text();
                if(target == "from") {
                    param =  flight.get("b_location");
                }
                else if (target == "to") {
                    param =  flight.get("e_location");
                }
                else{
                    param =  flight.get("time");
                }
                return param;
            }
            /*
            sort calls refresh event
             */
            this.collection.sort();

        }
    })
        var flightsTabelView = new FlightsTabelView();
    $("#holder").html(flightsTabelView.el);

})