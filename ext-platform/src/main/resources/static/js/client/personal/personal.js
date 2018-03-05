jQuery(document).ready(function ($) {


    $("#myLand").click(function (e) {
       window.location.href = "myLand.html?farmId="+farmId;
    });
    $("#myPlant").click(function (e) {
        window.location.href = "myPlant.html?farmId="+farmId;
    });
    $("#myFruitTrees").click(function (e) {
        window.location.href = "myFruitTrees.html?farmId="+farmId;
    });

    $("#myLivestock").click(function (e) {
        window.location.href = "myLivestock.html?farmId="+farmId;
    });

    $("#myDelivery").click(function (e) {
        window.location.href = "myDelivery.html?farmId="+farmId;
    });

    $("#myAddress").click(function (e) {
        window.location.href = "myAddress.html?farmId="+farmId;
    });

    $("#personal_back").click(function (e) {
        window.location.href = "index.html?farmId="+farmId;
    });


});