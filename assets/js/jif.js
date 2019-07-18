$(document).ready(function () {

    // creating pre-existing buttons
    var existingMoods = ["squad goals", "monday mood", "okurr", "confused", "shook", "yaaaaas", "that feeling", "omg", "youre welcome"]

    function buttons() {
        $(".buttons").empty();

        for (var mood of existingMoods) {

            var vibe = $("<button>");
            vibe.addClass("search");
            vibe.attr("data-mood", mood);
            vibe.text(mood);
            vibe.css("display", "inline-block")
            $(".buttons").append(vibe);
        }
    }
    buttons()

    // generating new buttons
    $("#submitbtn").on("click", function (event) {
        event.preventDefault();
        var search = $("#search-input").val().trim();
        existingMoods.push(search);
        buttons()
        $("#search-input").val("");
    });

    //AJX Call to show giphy search
    $(".buttons").on("click", ".search", function () {
        var search = $(this).attr("data-mood")
        var queryURL = "https://api.giphy.com/v1/gifs/search?api_key=" + key + "&limit=16&q=" + search;
        $(".results").empty();

        var method = {
            url: queryURL,
            method: "GET"
        }

        $.ajax(method).then(function (response) {
            var results = response.data

            for (var i = 0; i < results.length; i++) {

                var still = results[i].images.fixed_height_still.url;
                var animated = results[i].images.fixed_height.url;
                var src = results[i].images.fixed_height_still.url;
                var ratingText = results[i].rating;
                ratingText = ratingText.toUpperCase()



                var resultsDiv = $("<div class='gif " + results[i].id + "' id='" + results[i].id + "' >");

                var favorite = $("<button class='favorite'></button>");
                var rating = $("<span class='rating'></span> <br>");
                var searchGif = $("<img>");

                searchGif.attr("src", src);
                searchGif.attr("alt", "Fun Gif");
                searchGif.attr("still", still); // still url
                searchGif.attr("animated", animated); // animated url
                searchGif.attr("frame", "still"); // state
                searchGif.addClass("gifImage")

                favorite.text("Favorite");
                favorite.attr("id", results[i].id);
                favorite.addClass(results[i].id)
                rating.text("Rating: " + ratingText);


                resultsDiv.prepend(favorite);
                resultsDiv.append(rating);
                searchGif.appendTo(resultsDiv);
                resultsDiv.appendTo(".results")

                // if favorited
                if (favoriteList.includes(results[i].id)) {
                    $(favorite).css("background-color", "#AA1911");
                    $(favorite).css("color", "white");
                    $(favorite).css("border", "2px solid #d49f4f");
                    $(favorite).css("padding", "3px 13px 3px 13px");
                }

            };
        });
    })

    // CODE FOR: Click on GIF to move!
    // $(".results").on("click", ".gifImage", function () {
    //     var state = $(this).attr("frame")

    //     if (state === "still") {
    //           $(this).attr('src', $(this).attr("animated"))
    //           $(this).attr("frame", "animated")
    //         } else if (state === "animated") {
    //           $(this).attr('src', $(this).attr("still"))
    //           $(this).attr("frame", "still")
    //         }
    // });

    // CODE TO: Hover over GIF to move!
    $(".results").on("mouseover", ".gifImage", function () {
        $(this).attr('src', $(this).attr("animated"));
        $(this).attr("frame", "animated");
    }).on("mouseout", ".gifImage", function () {
        $(this).attr('src', $(this).attr("still"));
        $(this).attr("frame", "still");
    });

    $(".favoriteGallery").on("mouseover", ".gifImage", function () {
        $(this).attr('src', $(this).attr("animated"));
        $(this).attr("frame", "animated");
    }).on("mouseout", ".gifImage", function () {
        $(this).attr('src', $(this).attr("still"));
        $(this).attr("frame", "still");
    });

    // Click to add to favorites
    var favoriteList = [];

    $(".results").on("click", ".favorite", function () {
        if (favoriteList.includes($(this).attr("id"))) {
            $(this).css("background-color", "");
            $(this).css("color", "");
            $(this).css("border", "");
            $(this).css("padding", "");

            // HOW TO DETACH A DIV FROM ANOTHER AREA?
            var ID = $(this).attr("id");
            var deletingDiv = $("." + ID)

            // we are filtering our elements that share the same class (BY ID) 
            // within the filter we must return true for our filtering mechanism to work and it returns as an array
            var myItem = deletingDiv.filter(function (index, item) {

                return $(item).hasClass("clone")
            })

            $(myItem[0]).remove();

            var index = $(myItem[0]).attr("data-index");
            removeFave(index);

        } else {
            $(this).css("background-color", "#AA1911");
            $(this).css("color", "white");
            $(this).css("border", "2px solid #d49f4f");
            $(this).css("padding", "3px 13px 3px 13px");
           
            favoriteList.push($(this).attr("id"))
            favorited = true;
           
            var dataIndex = favoriteList.length ? favoriteList.length - 1 : 0;

            // adding giv to favorites (div is being cloned and moved)
            var faveDiv = $("div[id=" + ($(this).attr("id")) + "]").attr("data-index", dataIndex);
            faveDiv.clone().detach().addClass("clone").appendTo(".favoriteGallery");

            

        }

        console.log("from results:" + favoriteList)
    });



    $(".favoriteGallery").on("click", ".favorite", function () {
        var faveDiv = $("div[id=" + ($(this).attr("id")) + "]");

        $(this).css("background-color", "");
        $(this).css("color", "");
        $(this).css("border", "");
        $(this).css("padding", "");
        $(faveDiv).remove()

        if (favoriteList.includes($(this).attr("id"))) {
            // HOW TO DETACH A DIV FROM ANOTHER AREA?
            var ID = $(this).attr("id");
            var deletingDiv = $("." + ID)

            // we are filtering our elements that share the same class (BY ID) 
            // within the filter we must return true for our filtering mechanism to work and it returns as an array
            var myItem = deletingDiv.filter(function (index, item) {

                return $(item).hasClass("clone")
            })

            var index = $(myItem[0]).attr("data-index");
            removeFave(index);
        }

        console.log("from Fave:" + favoriteList)
    });


    // Click on favorites
    $(".searchFave").on("click", "#favoritebtn", function () {
        $(".results").hide();
        $("#resultTitle").hide();
        $(".buttons").hide();
        $(".favoriteGallery").show()
    });

    // Click on Search Results
    $(".searchFave").on("click", "#searchresultsbtn", function () {
        $(".results").show();
        $("#resultTitle").show();
        $(".buttons").show();
        $(".favoriteGallery").hide()
    });

    // Removing gif ID from from Array Function
    function removeFave(index) {
        console.log('index',index);
        favoriteList.splice(index, 1)
    }
})