WDSClass.extend("CO_UPSLForm", "WDSForm");
function CO_UPSLForm() {
    previousSelectedObj = JSON.parse($.cookie("coBckBtn"));
    this.rank = 2;
    this.fromCald = this.getFromCald();
    this.flexpricerDataMapUI;
    this.tripType = theJJUtils.getTripType();
    this.isAvailability = this.getAvailability();
    CO_UPSLForm.superclass.constructor.call(this, "CO_UPSL_Form", "", true);
    theJJUtils.WDSProgressInit(this.rank);
    this.boundTrip = $("div#outboundUpsellPanel, div#inboundUpsellPanel");
    this.initSpecificPanels();
    this.initToolTip();
    this.handleCalendarTabs();
    this.verifAvailability();
    theJJUtils.switchCurrencyNumber();
    theJJUtils.createTaxesAndFeesTooltip()
}
CO_UPSLForm.prototype.displayCaldIfFromCald = function () {
    if (this.fromCald === "TRUE") {
        if (this.tripType === "R") {
            theJJUtils.openPopin("it_cald")
        } else {
            theJJUtils.openPopin("co_cald")
        }
        this.fromCald = "FALSE"
    }
};
CO_UPSLForm.prototype.initToolTip = function () {
    this.boundTrip.each(function () {
        var a = $(this);
        theJJUtils.createFareFamilyTooltip(a)
    });
    this.createLocationTooltip()
};
CO_UPSLForm.prototype.firstClickOnTab = function () {
    var a = this.getValueFromFormOrCookie("TAB_ID", "tab");
    if (a != "") {
        $("td#" + a).click()
    } else {
        $("td.selectMeFirst").click()
    }
};
CO_UPSLForm.prototype.verifAvailability = function () {
    var a = this;
    if (a.tripType === "R") {
        if (this.isAvailability == "true") {
            theJJUtils.openPopin("it_cald");
            WDSError.add(WDSMessage.getMessage("IT_CALD.error.NoRecommandationFound"));
            WDSError.show();
            $("#closeItCaldPopin").hide()
        } else {
            a.firstClickOnTab()
        }
    } else {
        if ($("td.selectMeFirst").size() == 0) {
            theJJUtils.openPopin("co_cald");
            WDSError.add(WDSMessage.getMessage("CO_CALD.error.NoRecommandationFound"));
            WDSError.show();
            $("#closeCoCaldPopin").hide()
        } else {
            a.firstClickOnTab()
        }
    }
};
CO_UPSLForm.prototype.initSpecificPanels = function () {
    var a = this;
    $("div.module-search div.WDSToggleTarget:first, div.module-summary div.WDSToggleTarget:first").each(function () {
        theJJUtils.togglePanel($(this).parent().find("span.WDSToggleItem")[0], $(this))
    });
    $("span#amountTotal, span#amountTotalCurrency").hide();
    $("a#coupslBackButton").click(function () {
        thePROGRESSForm.back("COUPSL")
    });
    $("a#submitCoupsl").click(function () {
        theJJUtils.extendTamSession(IS_DISABLED_FACADE);
        if (typeof googleAnalyticsObject != "undefined") {
            googleAnalyticsObject.submitCoUpsl()
        }
        a.check((a.tripType === "R") ? true : false)
    })
};
CO_UPSLForm.prototype.tabIdClicked = "";
CO_UPSLForm.prototype.handleCalendarTabs = function () {
    var a = this;
    var b = $("table#calendarTabsRoundTrip td.ajaxSubmit, table#calendarTabsOneWayTrip td.ajaxSubmit");
    theJJUtils.createTooltip($("th.yourSearch"), WDSMessage.getMessage("CO_UPSL.text.YourSearchTooltip"));
    theJJUtils.createTooltip($("th.closestSearch"), WDSMessage.getMessage("CO_UPSL.text.ClosestSearchTooltip"));
    theJJUtils.createTooltip($("th.lowestSearch"), WDSMessage.getMessage("CO_UPSL.text.LowestSearchTooltip"));
    b.not(".disabled").hover(function () {
        this.className = this.className.replace(/EffectOff/g, "EffectOn") + " "
    }, function () {
        this.className = this.className.replace(/EffectOn/g, "EffectOff") + " "
    });
    b.click(function () {
        $("#WDIScrollBox_vertical .WDSIntersticeOff").addClass("WDSIntersticeOn").removeClass("WDSIntersticeOff");
        a.tabIdClicked = $(this).attr("id");
        if (!this.className.match("SelectedEffect")) {
            this.className = this.className.replace(/Effect/g, "SelectedEffect");
            $.each($(this).siblings(), function () {
                this.className = this.className.replace(/SelectedEffect/g, "Effect")
            })
        }
        var e = $(this);
        myDialog.open();
        var d = $("div.bound-CALD");
        if (a.tripType === "R") {
            var f = e.attr("id").split("-");
            d.find("td#cell_" + f[1] + "_" + f[0]).click();
            d.find("input#checkbox_" + f[1] + "_" + f[0]).attr("checked", true)
        } else {
            var f = e.find("input[name=B_DATE_1]").val().split("0000")[0];
            d.find("td#" + f).click();
            d.find("td#" + f).find("input[name=WDS_DATE]").attr("checked", true)
        }
        theRightPanel.updateBoundsDate(e.find("input[name=B_DATE_1]").val(), e.find("input[name=B_DATE_2]").val());
        var c = $("form[name=FLEXPRICER_AJAX_FORM]");
        c.find("input[name=B_DATE_1]").attr("disabled", "disabled");
        c.find("input[name=B_DATE_2]").attr("disabled", "disabled");
        e.find("input[name=B_DATE_1]").removeAttr("disabled");
        e.find("input[name=B_DATE_2]").removeAttr("disabled");
        $("div#panelToFillWithAajax_0.WDSIntersticeOff, div#panelToFillWithAajax_1.WDSIntersticeOff").removeClass("WDSIntersticeOff").addClass("WDSIntersticeOn");
        $("#IntersticeSpace_0,#IntersticeSpace_1 ").show();
        a.boundTrip.find(".section").remove();
        a.updateHeaders(e);
        $.ajax({type:"POST", url:($("form#FLEXPRICER_AJAX_FORM"))[0].action, dataType:"html", data:$("form[name=FLEXPRICER_AJAX_FORM]").serialize(), dataFilter:function (k) {
            var h = $(k);
            var n = $(".section", h);
            var g = n.length;
            for (var j = g; j--;) {
                var m = n[g - j - 1];
                var l = 340 / ($("th.FF", m).length);
                $("th.FF", m).width(l)
            }
            return h
        }, success:function (h, m, k) {
            a.startPopulateAfterAjaxCall(h);
            if ($("#calendarTabsOneWayTrip").length) {
                var l = $("#calendarTabsOneWayTrip .SelectedEffectOff input[name='B_DATE_1']").val().substr(0, 8);
                $("#co_cald div.bound-CALD div#" + l).click()
            } else {
                var j = $("#calendarTabsRoundTrip .SelectedEffectOff span.outbound input[name='B_DATE_1']").val().substr(0, 8);
                var g = $("#calendarTabsRoun..."
                div.section - direct
                table.WDSResults, div.section - stopover
                table.WDSResults, div.section - connection
                table.WDSResults
                ").trigger("
                sorton
                ",[d]);return false});c.find(".tablesorter
                thead
                th.duration
                ").click(function(){var d=[[3,0]];$("
                div#"+c.attr("
                id
                ")).find("
                div.section - direct
                table.WDSResults, div.section - stopover
                table.WDSResults, div.section - connection
                table.WDSResults
                ").trigger("
                sorton
                ",[d]);return false});$("
                div#"+c.attr("
                id
                ")+".tablesorter
                thead
                th.FF
            :
                visible
                ").click(function(){var d=parseInt($(this).attr("
                id
                ").split("
                _
                ")[1])+4;var e=[[d,0]];$("
                div#"+c.attr("
                id
                ")).find("
                div.section - direct
                table.WDSResults, div.section - stopover
                table.WDSResults, div.section - connection
                table.WDSResults
                ").trigger("
                sorton
                ",[e])})});$("
                table.tablesorter
                ").bind("
                sortStart
                ",function(){$("#IntersticeSpace_0,#IntersticeSpace_1
                ").css("
                height
                ","
                250
                px
                ");$("
                div#panelToFillWithAajax_0.WDSIntersticeOff, div#panelToFillWithAajax_1.WDSIntersticeOff
                ").removeClass("
                WDSIntersticeOff
                ").addClass("
                WDSIntersticeOn
                ");$("#IntersticeSpace_0,#IntersticeSpace_1
                ").show();$(this).find("
                tr.flightdetails > div
                ").hide()}).bind("
                sortEnd
                ",function(){var c=$(this);c.find("
                tbody
                tr.flight.segment - first
                ").each(function(){var h=$(this);var d=h.attr("
                id
                ");var f=c.find("
                tr#"+d+"
            :
                not(.segment - first
            )
                ");if(f.length>0){for(var e=1;e<=f.length;e++){h.after(c.find("
                tr#"+d+".segment - "+e));h=c.find("
                tr#"+d+".segment - "+e)}}var g=c.find("
                tr.flightdetails.
                "+d);c.find("
                tr#"+d+".segment
                ").last().after(g)});setTimeout('$("
                div#panelToFillWithAajax_0.WDSIntersticeOn, div#panelToFillWithAajax_1.WDSIntersticeOn
                ").removeClass("
                WDSIntersticeOn
                ").addClass("
                WDSIntersticeOff
                ");$("#IntersticeSpace_0,#IntersticeSpace_1
                ").hide();$("#page.section - connection
                ").toggle().toggle();',1000);theJJUtils.tableFixForWebkit(1000)});$("
                th.flight.colhead
                ").unbind()};CO_UPSLForm.prototype.isLowestPriceIn=function(){if(this.tripType==="
                R
                "){var a=[$("
                div#outboundUpsellPanel.outbound
                "),$("
                div#inboundUpsellPanel.inbound
                ")]}else{var a=[$("
                div#outboundUpsellPanel.outbound
                ")]}for(i=0;i<a.length;i++){if(a[i].find("
                div.section - direct
                td.lowest
                ").length==0){if(a[i].find("
                div.section - stopover
                td.lowest
                ").length==0){if(a[i].find("
                div.section - connection
                td.lowest
                ").length>0){if(a[i].find("
                div.section - connection
                h4
                span.WDSToggle
                ").children("
                span.WDSToggleItem
                ").hasClass("
                closed
                ")){a[i].find("
                div.section - connection
                h4
                span.WDSToggle
                ").children("
                span.WDSToggleItem
                ").click()}}}else{if(a[i].find("
                div.section - stopover
                h4
                span.WDSToggle
                ").children("
                span.WDSToggleItem
                ").hasClass("
                closed
                ")){a[i].find("
                div.section - stopover
                h4
                span.WDSToggle
                ").children("
                span.WDSToggleItem
                ").click()}}}}};CO_UPSLForm.prototype.check=function(a){WDSError.init();WDSError.reset();if(theRightPanel.fareReco[0]==null){WDSError.add(WDSMessage.getMessage("
                CO_UPSL.error.PleaseSelectOutbound
                "))}if(a&&theRightPanel.fareReco[1]==null){WDSError.add(WDSMessage.getMessage("
                CO_UPSL.error.PleaseSelectInbound
                "))}if(WDSError.hasError()){WDSError.show()}else{this.submit()}};function Recommendation(c,d,f,e){this.bound=c;this.flightId=d;this.fareFamily=f;this.recoId=e.RECOMMENDATION_ID;this.recoIndex=e.RECOMMENDATION_INDEX;this.isLowestPrice=e.IS_LOWEST_PRICE;this.amountToDisplay=e.AMOUNT_TO_DISPLAY;this.taxToDisplay=e.TAX_TO_DISPLAY;this.listTravelerTypeTaxAmount={};this.listTravelerTypeTaxAmount.ADT=e.LIST_TRAVELER_TYPE_TAX_AMOUNT.ADT;this.listTravelerTypeTaxAmount.CHD=e.LIST_TRAVELER_TYPE_TAX_AMOUNT.CHD;this.listTravelerTypeTaxAmount.INF=e.LIST_TRAVELER_TYPE_TAX_AMOUNT.INF;this.listTravelerTypePriceWithoutTax={};this.listTravelerTypePriceWithoutTax.ADT=e.LIST_TRAVELER_TYPE_PRICE_WITHTOUT_TAX.ADT;this.listTravelerTypePriceWithoutTax.CHD=e.LIST_TRAVELER_TYPE_PRICE_WITHTOUT_TAX.CHD;this.listTravelerTypePriceWithoutTax.INF=e.LIST_TRAVELER_TYPE_PRICE_WITHTOUT_TAX.INF;this.listRbd=[];this.listFareClass=[];var b=e.LIST_RBD;for(var a in b){this.listRbd.push(b[a].RBD.replace(/\[|\]|\ /g,"
                "));this.listFareClass.push(b[a].FARE_CLASS.replace(/\[|\]|\ /g,"
                "))}this.lastSeats=e.NUMBER_OF_LAST_SEATS;this.hierarchy=e.HIERARCHY}CO_UPSLForm.prototype.createLocationTooltip=function(){var a=new WDSToolTip("
                tooltipId
                ","
                tooltipId
                ",5,-30,true);$("#tooltipId
                ").css("
                z - index
                ",15000);$("#panelToFillWithAajax_0
                tr.flight
                span.location, #panelToFillWithAajax_1
                tr.flight
                span.location
                ","#page
                ").live("
                mouseenter
                mouseleave
                ",function(d){if(d.type=="
                mouseenter
                "){var f=$(this).children().attr("
                className
                ").split("
                _
                ");var e=f[0];var b=f[1];var c=f[2];a.show(b+" - "+c+"("+e+")
                ",d)}else{a.hide()}})};CO_UPSLForm.prototype.createHelpTooltip=function(){$.each($("
                body#co_upsl
                a.help
                "),function(){theJJUtils.createTooltip($(this).find(".ico - help
                "),$(this).find(".text
                ").text())})};CO_UPSLForm.prototype.createShowHideTooltip=function(){theJJUtils.createTooltip($(".WDSToggleItem
                ").not(function(){return $(this).parents(".module - summary
                ")[0]}),WDSMessage.getMessage("
                CO_UPSL.text.tooltip.SHOW_HIDE
                "))};$(document).ready(function(){window.theCO_UPSLForm=new CO_UPSLForm();theJJUtils.redemptionLinkTimer()});
