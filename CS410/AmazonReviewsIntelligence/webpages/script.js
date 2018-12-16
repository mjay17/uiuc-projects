var product_sentiments_aggregated_overall, product_sentiments_aggregated_dates;
var overall_word_cloud, positive_word_cloud, negative_word_cloud;
var last_product_title;

//test data
//product_sentiments_aggregated_overall = [{"product_id":"B00004XOYC","product_title":"Rand McNally TND 720 LM IntelliRoute Truck GPS with Lifetime Maps (Certified Refurbished)","overall_weighted_sentiment_score":0.27},{"product_id":"0594012015","product_title":"Barnes & Noble NOOK Power Kit in Carbon BNADPN31","overall_weighted_sentiment_score":0.28}];
//product_sentiments_aggregated_dates = [{"product_id":"B00004XOYC","product_title":"Rand McNally TND 720 LM IntelliRoute Truck GPS with Lifetime Maps (Certified Refurbished)","review_date":"2015-06-14","aggr_weighted_sentiment_score":0.84},{"product_id":"B00004XOYC","product_title":"Rand McNally TND 720 LM IntelliRoute Truck GPS with Lifetime Maps (Certified Refurbished)","review_date":"2015-06-18","aggr_weighted_sentiment_score":0.0},{"product_id":"B00004XOYC","product_title":"Rand McNally TND 720 LM IntelliRoute Truck GPS with Lifetime Maps (Certified Refurbished)","review_date":"2015-06-22","aggr_weighted_sentiment_score":-1.67},{"product_id":"B00004XOYC","product_title":"Rand McNally TND 720 LM IntelliRoute Truck GPS with Lifetime Maps (Certified Refurbished)","review_date":"2015-06-23","aggr_weighted_sentiment_score":1.06},{"product_id":"0594012015","product_title":"Barnes & Noble NOOK Power Kit in Carbon BNADPN31","review_date":"2013-07-16","aggr_weighted_sentiment_score":1.93},{"product_id":"0594012015","product_title":"Barnes & Noble NOOK Power Kit in Carbon BNADPN31","review_date":"2013-07-18","aggr_weighted_sentiment_score":-1.75},{"product_id":"0594012015","product_title":"Barnes & Noble NOOK Power Kit in Carbon BNADPN31","review_date":"2013-07-20","aggr_weighted_sentiment_score":1.74},{"product_id":"0594012015","product_title":"Barnes & Noble NOOK Power Kit in Carbon BNADPN31","review_date":"2013-07-23","aggr_weighted_sentiment_score":0.07}];
//overall_word_cloud = [{"product_id":"B00004X10A","Overall_Topics":[["lenses",0.049588941],["bag",0.0430502631],["L",0.0231964365],["fits",0.023176698],["size",0.0231431946],["The",0.0231355429],["Tamrac",0.0166043956],["facing",0.0165806692],["website",0.0165798366],["accurate",0.0165785812]]},{"product_id":"B00004XOYC","Overall_Topics":[["press",0.0943373889],["delicately",0.0566219389],["pinch",0.0566209294],["buttons",0.0566152111],["hand",0.0566151924],["I",0.0566110797],["thing",0.0566099398],["came",0.0566084348],["world",0.0566065237],["changed",0.0566031374]]}];
//overall_word_cloud = [{"product_id":"B00004XOYC","Overall_Topics":[["javascript",0.049588941],["coffeescript",0.0430502631],["shaving sheep",0.0231964365],["AngularJS",0.0231431946],["size",0.0166043956],["The",0.0165785812]]}];

function loadProductsAndSentimentsFull() {
    loadJSON(function (response) {
        // Parsing JSON string into object
        product_sentiments_aggregated_overall = JSON.parse(response);
        var products = [];
        for (var i = 0; i < product_sentiments_aggregated_overall.length; i++) {
            products.push(product_sentiments_aggregated_overall[i].product_title);
        }
        autocomplete(document.getElementById("product_name"), products);
    }, '../data/product_sentiments_aggregated_overall.json');

    loadJSON(function (response) {
        // Parsing JSON string into object
        product_sentiments_aggregated_dates = JSON.parse(response);
    }, '../data/product_sentiments_aggregated_dates.json');

    loadJSON(function (response) {
        // Parsing JSON string into object
        overall_word_cloud = JSON.parse(response);
    }, '../data/topics_models_overall.json');

    loadJSON(function (response) {
        // Parsing JSON string into object
        positive_word_cloud = JSON.parse(response);
    }, '../data/topics_models_positive.json');

    loadJSON(function (response) {
        // Parsing JSON string into object
        negative_word_cloud = JSON.parse(response);
    }, '../data/topics_models_negative.json');
}

function loadProductsAndOverallSentiments() {
    loadJSON(function (response) {
        // Parsing JSON string into object
        product_sentiments_aggregated_overall = JSON.parse(response);
    }, '../data/product_sentiments_aggregated_overall.json');
}

function loadJSON(callback, filePath) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', filePath, true);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}

function showAnalytics(product_title) {
    if (product_title && last_product_title != product_title) {
        var product_id;
        var product_overall_details = getProductOverallSentimentDetails(product_title);
        if (product_overall_details && product_overall_details.length >= 1) {
            product_id = product_overall_details[0]["product_id"];
            document.getElementById('current_product').innerHTML = product_overall_details[0]["product_title"];
            var sentiment_score = convertToFixedDecimalPlaces(product_overall_details[0]["overall_weighted_sentiment_score"]);
            document.getElementById('overall_sentiment_score').innerHTML = sentiment_score + " (" + getSentimentCategory(sentiment_score) + ")";

            var product_dates_details = getProductSentimentDetailsByDate(product_id);
            plotBarChart(product_dates_details);
            GetWordClouds(product_id);

            last_product_title = product_title;
        }
    }
}

function getProductOverallSentimentDetails(product_title) {
    if (product_title) {
        return product_sentiments_aggregated_overall.filter(
            function (data) { return data.product_title == product_title }
        );
    }
}

function getProductOverallSentimentDetailsById(product_id) {
    if (product_id) {
        return product_sentiments_aggregated_overall.filter(
            function (data) { return data.product_id == product_id }
        );
    }
}

function getProductSentimentDetailsByDate(product_id) {
    if (product_id) {
        return product_sentiments_aggregated_dates.filter(
            function (data) { return data.product_id == product_id }
        );
    }
}

function getSentimentCategory(sentiment_score) {
    if (sentiment_score >= -3 && sentiment_score < -2) {
        return "<span style='background-color:#2F4A6D;color:#cc0000'> Very Negative </span>";
    }
    else if (sentiment_score >= -2 && sentiment_score < -1) {
        return "<span style='background-color:#2F4A6D;color:#ff6666'> Negative </span>";
    }
    else if (sentiment_score >= -1 && sentiment_score <= 1) {
        return "<span style='background-color:#2F4A6D;color:#f0ec0b'> Neutral </span>";
    }
    else if (sentiment_score > 1 && sentiment_score <= 2) {
        return "<span style='background-color:#2F4A6D;color:#66ff66'> Positive </span>";
    }
    else if (sentiment_score > 2 && sentiment_score <= 3) {
        return "<span style='background-color:#2F4A6D;color:#00cc00'> Very Positive </span>";
    }
}

function convertToFixedDecimalPlaces(num) {
    return num.toFixed(2);
}

function GetWordClouds(product_id) {
    if (product_id) {
        ProcessAndDrawWordCloud(overall_word_cloud, product_id, 500, 75, "cloudOverall");
        ProcessAndDrawWordCloud(positive_word_cloud, product_id, 375, 300, "cloudPositive");
        ProcessAndDrawWordCloud(negative_word_cloud, product_id, 375, 300, "cloudNegative");
    }
}

function ProcessAndDrawWordCloud(word_cloud, product_id, w_wordcloud, h_wordcloud, div_wordcloud) {
    if (word_cloud && product_id) {
        // Get data for the productId of interest
        wcResponse = word_cloud.filter(function (data) { return data.product_id == product_id });
        var topics_dct = []
        if (wcResponse && wcResponse.length > 0) {
            var topics = wcResponse[0]['topics']
            var in_min = Math.min.apply(null, topics.map(d => d[1]));
            var in_max = Math.max.apply(null, topics.map(d => d[1]));
            for (var i = 0; i < topics.length; i++) {
                //var topic_transform = { text: topics[i][0], weight: Math.round(parseFloat(topics[i][1]) * 300, 2) };
                var topic_transform = { text: topics[i][0], size: mapScale(topics[i][1], in_min, in_max, 10, 60) };
                topics_dct.push(topic_transform);
            }
        }
        //console.log(wcResponse);
        //console.log(topics_dct);
        //drawWordCloud(topics_overall_dct, 500, 75, "cloudOverall");
        //drawWordCloud(topics_overall_dct, 375, 300, "cloudPositive");
        //drawWordCloud(topics_overall_dct, 375, 300, "cloudNegative");
        drawWordCloud(topics_dct, w_wordcloud, h_wordcloud, div_wordcloud);
    }
}

function mapScale(num, in_min, in_max, out_min, out_max) {
        return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

function autocomplete(inp, arr) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function (e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false; }
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (i = 0; i < arr.length; i++) {
            /*check if the item starts with the same letters as the text field value:*/
            if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                /*create a DIV element for each matching element:*/
                b = document.createElement("DIV");
                /*make the matching letters bold:*/
                b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                b.innerHTML += arr[i].substr(val.length);
                /*insert a input field that will hold the current array item's value:*/
                b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function (e) {
                    /*insert the value for the autocomplete text field:*/
                    inp.value = this.getElementsByTagName("input")[0].value;
                    /*close the list of autocompleted values,
                    (or any other open lists of autocompleted values:*/
                    closeAllLists();
                });
                a.appendChild(b);
            }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function (e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            /*If the arrow DOWN key is pressed,
            increase the currentFocus variable:*/
            currentFocus++;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 38) { //up
            /*If the arrow UP key is pressed,
            decrease the currentFocus variable:*/
            currentFocus--;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 13) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            e.preventDefault();
            if (currentFocus > -1) {
                /*and simulate a click on the "active" item:*/
                if (x) x[currentFocus].click();
            }
        }
    });
    function addActive(x) {
        /*a function to classify an item as "active":*/
        if (!x) return false;
        /*start by removing the "active" class on all items:*/
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }
    function closeAllLists(elmnt) {
        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}

function plotBarChart(product_data) {
    const svg = d3.select('#svg1');
    svg.selectAll("*").remove();
    //const svgContainer = d3.select('#container');

    const margin = 100;
    const width = 950 - 2 * margin;
    const height = 400 - 2 * margin;

    const chart = svg.append('g')
        .attr('transform', `translate(${margin}, ${margin})`);

    const xScale = d3.scaleBand()
        .range([0, width])
        .domain(product_data.map((s) => s.review_date))
        .padding(0.4)

    const yScale = d3.scaleLinear()
        .range([height, 0])
        .domain([-3, 3]);

    // vertical grid lines
    // const makeXLines = () => d3.axisBottom()
    //   .scale(xScale)

    const makeYLines = () => d3.axisLeft()
        .scale(yScale)

    chart.append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(xScale).tickValues(xScale.domain().filter(function(d,i){ return !(i%10)})))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", function (d) {
            return "rotate(-90)"
        });


    chart.append('g')
        .call(d3.axisLeft(yScale));

    // vertical grid lines
    // chart.append('g')
    //   .attr('class', 'grid')
    //   .attr('transform', `translate(0, ${height})`)
    //   .call(makeXLines()
    //     .tickSize(-height, 0, 0)
    //     .tickFormat('')
    //   )

    chart.append('g')
        .attr('class', 'grid')
        .call(makeYLines()
            .tickSize(-width, 0, 0)
            .tickFormat('')
        )

    const barGroups = chart.selectAll()
        .data(product_data)
        .enter()
        .append('g')

    barGroups
        .append('rect')
        .attr('class', function(d) {
            if (d.aggr_weighted_sentiment_score < -1) {
              return 'barNeg';
            } else if (d.aggr_weighted_sentiment_score > 1) {
              return 'barPos';
            }
            return 'bar';
          })
        .attr('x', (g) => xScale(g.review_date))
        .attr('y', (g) => yScale(g.aggr_weighted_sentiment_score))
        .attr('height', (g) => height - yScale(g.aggr_weighted_sentiment_score))
        .attr('width', xScale.bandwidth())
        .on('mouseenter', function (actual, i) {
            d3.selectAll('.value')
                .attr('opacity', 0)

            d3.select(this)
                .transition()
                .duration(300)
                .attr('opacity', 0.6)
                .attr('x', (a) => xScale(a.review_date) - 5)
                .attr('width', xScale.bandwidth() + 10)

            const y = yScale(actual.aggr_weighted_sentiment_score)

            line = chart.append('line')
                .attr('id', 'limit')
                .attr('x1', 0)
                .attr('y1', y)
                .attr('x2', width)
                .attr('y2', y)

            barGroups.append('text')
                .attr('class', 'divergence')
                .attr('x', (a) => xScale(a.review_date) + xScale.bandwidth() / 2)
                .attr('y', (a) => yScale(a.aggr_weighted_sentiment_score) + 30)
                .attr('fill', 'white')
                .attr('text-anchor', 'middle')
                /*.text((a, idx) => {
                    const divergence = (a.aggr_weighted_sentiment_score - actual.aggr_weighted_sentiment_score).toFixed(2)

                    let text = ''
                    if (divergence > 0) text += '+'
                    text += `${divergence}`

                    return idx !== i ? text : '';
                })*/

        })
        .on('mouseleave', function () {
            d3.selectAll('.value')
                .attr('opacity', 1)

            d3.select(this)
                .transition()
                .duration(300)
                .attr('opacity', 1)
                .attr('x', (a) => xScale(a.review_date))
                .attr('width', xScale.bandwidth())

            chart.selectAll('#limit').remove()
            chart.selectAll('.divergence').remove()
        })

    barGroups
        .append('text')
        .attr('class', 'value')
        .attr('x', (a) => xScale(a.review_date) + xScale.bandwidth() / 2)
        .attr('y', (a) => yScale(a.aggr_weighted_sentiment_score) + 30)
        .attr('text-anchor', 'middle')
        //.text((a) => `${a.aggr_weighted_sentiment_score}`)

    svg
        .append('text')
        .attr('class', 'label')
        .attr('x', -(height / 2) - margin)
        .attr('y', margin / 2.4)
        .attr('transform', 'rotate(-90)')
        .attr('text-anchor', 'middle')
        .text('Weighted Sentiment Score')

    svg.append('text')
        .attr('class', 'label')
        .attr('x', width / 2 + margin)
        .attr('y', height + margin * 1.7 + 20)
        .attr('text-anchor', 'middle')
        .text('Review Date')

    svg.append('text')
        .attr('class', 'title')
        .attr('x', width / 2 + margin)
        .attr('y', 40)
        .attr('text-anchor', 'middle')
        .text('Sentiment Trends')

    svg.append('text')
        .attr('class', 'source')
        .attr('x', width - margin / 2)
        .attr('y', height + margin * 1.7)
        .attr('text-anchor', 'start')
    //.text('Source: Amazon Reviews')

}

function showProducts() {
    var product_ids = ["0528007262", "0594012015", "1084814315", "1400532736"];

    // CREATE DYNAMIC TABLE.
    var table = document.createElement("table");
    table.style.width = '800px';
    table.setAttribute('border', '1');
    table.setAttribute('cellspacing', '0');
    table.setAttribute('cellpadding', '5');

    var col = ["Product", "Overall Sentiment Score"];

    // CREATE TABLE HEAD .
    var tHead = document.createElement("thead");

    // CREATE ROW FOR TABLE HEAD .
    var hRow = document.createElement("tr");

    // ADD COLUMN HEADER TO ROW OF TABLE HEAD.
    for (var i = 0; i < col.length; i++) {
        var th = document.createElement("th");
        th.innerHTML = col[i];
        hRow.appendChild(th);
    }
    tHead.appendChild(hRow);
    table.appendChild(tHead);

    // CREATE TABLE BODY .
    var tBody = document.createElement("tbody");

    for (var i = 0; i < product_ids.length; i++) {
        var curr_product_overall_details = getProductOverallSentimentDetailsById(product_ids[i]);
        if (curr_product_overall_details && curr_product_overall_details.length >= 1) {
            var bRow = document.createElement("tr"); // CREATE ROW FOR EACH RECORD .

            var sentiment_score = convertToFixedDecimalPlaces(curr_product_overall_details[0]["overall_weighted_sentiment_score"]);

            var td1 = document.createElement("td");
            td1.innerHTML = curr_product_overall_details[0]["product_title"];
            bRow.appendChild(td1);

            var td2 = document.createElement("td");
            td2.innerHTML = sentiment_score + " (" + getSentimentCategory(sentiment_score) + ")";
            bRow.appendChild(td2);

            tBody.appendChild(bRow);
        }
    }
    table.appendChild(tBody);

    var tablediv = document.getElementById('product_details');
    tablediv.innerHTML = "";
    tablediv.appendChild(table);
}

function drawWordCloud(wordsToDraw, w, h, divId) {
    var width = w;
    var height = h;
    var fill = d3.scaleOrdinal(d3.schemeCategory10);

    d3.layout.cloud()
    	.size([width, height])
    	.words(wordsToDraw)
    	.rotate(function() {
    		return ~~(Math.random() * 2) * 90;
    	})
    	.font("Impact")
    	.fontSize(function(d) {
    		return d.size;
    	})
    	.on("end", drawCloud)
    	.start();

// Finally implement `drawCloud`, which performs the D3 drawing:

    // apply D3.js drawing API
    function drawCloud(words) {
        d3.selectAll('#' + divId +' svg').remove();
        d3.select("#" + divId).append("svg")
    		.attr("width", width)
    		.attr("height", height)
    		.append("g")
    		.attr("transform", "translate(" + ~~(width / 2) + "," + ~~(height / 2) + ")")
    		.selectAll("text")
    		.data(words)
    		.enter().append("text")
    		.style("font-size", function(d) {
    			return d.size + "px";
    		})
    		.style("-webkit-touch-callout", "none")
    		.style("-webkit-user-select", "none")
    		.style("-khtml-user-select", "none")
    		.style("-moz-user-select", "none")
    		.style("-ms-user-select", "none")
    		.style("user-select", "none")
    		.style("cursor", "default")
    		.style("font-family", "Impact")
    		.style("fill", function(d, i) {
    			return fill(i);
    		})
    		.attr("text-anchor", "middle")
    		.attr("transform", function(d) {
    			return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
    		})
    		.text(function(d) {
    			return d.text;
    		});
    }
    
    // set the viewbox to content bounding box (zooming in on the content, effectively trimming whitespace)

    var svg = document.getElementsByTagName("svg")[0];
    var bbox = svg.getBBox();
    var viewBox = [bbox.x, bbox.y, bbox.width, bbox.height].join(" ");
    svg.setAttribute("viewBox", viewBox);
}