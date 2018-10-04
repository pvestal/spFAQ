//This loads the first custom script after SP loads internal scripts
_spBodyOnLoadFunctionNames.push("getQuestions");

//This handles the REST error calls
function errHandler(jqXHR, textStatus, errorThrown) {
    alert("Error please see console log.");
    console.log(jqXHR, textStatus, errorThrown);
}

//Within the body > after the question div > toggle the div answer
$("#placeHolder").on("click", ".faq_question", function () {
    $(this).next().toggle("fade");//select the sibling and toggle fade
    //console.log("You clicked on: ", this); 
});

//Within the search modal > after the question div > toggle the div answer
$("#searchModal").on("click", ".faq_question", function () {
    $(this).next().toggle("fade");//select the sibling and toggle fade
    //console.log("You clicked on: ", this); 
});

//Send search term to searchFuncton if search btn clicked
$("#btnSearch").on("click", function () {
    var search = $("#searchTerm").val();
    searchQuestions(search);
    //console.log("You clicked on: ", this); 
});

//Close and empty modal if close btn clicked
$("#searchModal .btn btn-default").on('click', function() {
    console.log("dismiss called");
    $("#searchModal .modal-body").empty();
});

//Cycle thru every faq to add the questions from the list passing into question and answer
//Send results to modal
function populateModal(question, answer) {
    var elements = '<div class="faq_container">' +
                    '<div class="faq_question">' +
                    '<p>' + question + '</p>' +
                    '</div>' + //End faq_question div
                    '<div class="faq_answer">' +
                    '<p>' + answer + '</p>' +
                    '</div>' + //End faq_answer_
                    '</div>'; //End faq_container div
    $("#searchModal .modal-body").append(elements);
}

//Cycle thru every faq to add the questions from the list passing into question and answer
//Send results to tbody placeholder 
function createElements(question, answer) {
    var elements = '<div class="faq_container">' + 
                    '<div class="faq_question">' +
                    '<p>'+question+'</p>' +
                    '</div>'+//End faq_question div
                    '<div class="faq_answer">'+
                    '<p>'+answer+'</p>'+
                    '</div>'+//End faq_answer_
                    '</div>';//End faq_container div
    $("#placeHolder").append(elements);
}

//Used to filter questions (Title field) by those with content approval status of approved
//OData__ModerationStatus endpoints 0 = Approved, 1 = Rejected, 2 = Pending, 3 = Draft
function getQuestions() {

    var call = $.ajax({
        url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('FAQ')/Items/?$select=Title,Answer&$filter=(OData__ModerationStatus eq 0)",
        type: "GET",
        dataType: "json",
        headers: {
            "Accept": "application/json; odata=verbose",
        }
    });
    call.done(function (data) {
        var items = data.d.results;
        var numQuestions = data.d.results.length;
        //Send results to DOM
        $.each(items, function (index, item) {
            createElements(item.Title, item.Answer);
        });
        console.log("# q: ", numQuestions);
    });
    call.fail(errHandler);
}

//Used to filter questions (Title field) by those with content approval status of approved passing in the search term
//OData__ModerationStatus endpoints 0 = Approved, 1 = Rejected, 2 = Pending, 3 = Draft
function searchQuestions(searchTerm) {
    
    var call = $.ajax({
        url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('FAQ')/Items/?$select=Title,Answer&$filter=substringof('"+searchTerm+"',Title) and OData__ModerationStatus eq 0",
        type: "GET",
        dataType: "json",
        headers: {
            "Accept": "application/json; odata=verbose",
        }
    });
    call.done(function (data) {
        var items = data.d.results;
        var numQuestions = data.d.results.length;
        //Send found results to modal otherwise display not found
        if (numQuestions > 0) {
            $.each(items, function (index, item) {
                console.log(item.Title, item.Answer);
                populateModal(item.Title, item.Answer);
            });
        } else {
            $("#searchModal .modal-body").append("No questions related to ["+searchTerm+"]. ");
        }
        console.log("# searchResults: ", numQuestions);
    });
    call.fail(errHandler);
}


