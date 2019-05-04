function pad(num, len) { return ("00000000" + num).substr(-len) };

function build_data(data) {
    result = {
        labels: [],
        datasets: []
    }

    result.datasets.push({
        label: 'Last 7 days coding hours',
        data: []
    });

    data.forEach(element => {
        result.labels.push(element.range.date)
        result.datasets[0].data.push(
            element.grand_total.hours + (element.grand_total.minutes / 60)
        );
    });
    return result;
}

function prepare_data(data) {
    result = {
        labels: [],
        datasets: []
    }

    result.datasets.push({
        label: 'Languages used in the last month',
        data: [],
        backgroundColor: [
            'rgba(85, 239, 196, 180)',
            'rgba(129, 236, 236, 180)',
            'rgba(116, 185, 255, 180)',
            'rgba(162, 155, 254, 180)',
            'rgba(223, 230, 233, 180)',
            'rgba(255, 234, 167, 180)',
            'rgba(250, 177, 160, 180)',
            'rgba(255, 118, 117, 180)',
            'rgba(253, 121, 168, 180)',
            'rgba(99, 110, 114, 180)',
            'rgba(0, 184, 148, 180)',
            'rgba(0, 206, 201, 180)', 
            'rgba(9, 132, 227, 180)', 
            'rgba(108, 92, 231, 180)', 
            'rgba(178, 190, 195, 180)', 
            'rgba(253, 203, 110, 180)', 
            'rgba(225, 112, 85, 180)', 
            'rgba(214, 48, 49, 180)', 
            'rgba(232, 67, 147, 180)', 
            'rgba(45, 52, 54, 180)'
        ]
    });

    data.forEach(element => {
        result.labels.push(element.name + " (" + element.percent + "%)")
        result.datasets[0].data.push(
            element.percent
        );
    });
    return result;
}

function draw_line(data, ctx) {
    
    var myLineChart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            maintainAspectRatio: false,
            distribution: 'linear',
            scales: {
                xAxes: [{
                    type: 'time',
                    time: {
                        unit: 'day'
                    }
                }],
                yAxes: [{
                    ticks: {
                        // Include a dollar sign in the ticks
                        callback: function(value, index, values) {
                            var quotient = Math.floor(value);
                            var remainder = (value - quotient) * 60;
                            return pad(quotient, 2) + ":" + pad(remainder, 2);
                        }
                    }
                }]
            },
            tooltips: {
                enabled: true,
                mode: 'single',
                callbacks: {
                    title: function (tooltipItem, data) { 
                        return "Day: " + data.labels[tooltipItem[0].index]; 
                    },
                    label: function(tooltipItems, data) {
                        var value = tooltipItems.value;
                        var quotient = Math.floor(value);
                        var remainder = Math.round((value - quotient) * 60);
                        return pad(quotient, 2) + ":" + pad(remainder, 2) + " hours";
                    },
                    //footer: function (tooltipItem, data) { return "..."; }
                }
            }
        }
    });
    return myLineChart;
}

function draw_pie(data, ctx) {
    var myPieChart = new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: {
            legend: {
                position: 'right'
            },
            tooltips: {
                enabled: true,
                mode: 'single',
                callbacks: {
                    title: function (tooltipItem, data) { 
                        return data.labels[tooltipItem[0].index]; 
                    },
                    label: function(tooltipItems, data) { 
                    },
                    //footer: function (tooltipItem, data) { return "..."; }
                }
            }
        }
    });
    return myPieChart;
}

function draw_working_hours(elementId) {
    var ctx = document.getElementById(elementId);
    $.ajax({
        type: 'GET',
        url: 'https://wakatime.com/share/@joelibaceta/e4dca67d-585b-45b3-9406-6dd9d817b336.json',
        dataType: 'jsonp',
        success: function(response) {
            console.log(response.data);
            data = build_data(response.data);
            draw_line(data, ctx);   
        }
    });
};

function draw_languages_share(elementId) {
    var ctx = document.getElementById(elementId);
    $.ajax({
        type: 'GET',
        //url: 'https://wakatime.com/share/@joelibaceta/9cb8dc9e-ac75-475d-88a8-8a66ef80f884.json', month
        url: 'https://wakatime.com/share/@joelibaceta/d6c82088-6c98-4dd6-a2ee-9cf6f1bad568.json', //week
        dataType: 'jsonp',
        success: function(response) {
            data = prepare_data(response.data);
            draw_pie(data, ctx);
        },
    });
}

function addListeners(){
    Array.from(document.getElementsByClassName("social-icon")).forEach(function(button) {
        button.addEventListener("click", function(){
            link = this.dataset.link;
            window.open(link, '_blank');
        });
        button.addEventListener("mouseover", function(){
            window.status = this.dataset.link;
        });
    });
    Array.from(document.getElementsByClassName("project-item")).forEach(function(button) {
        button.addEventListener("click", function(){
            link = this.dataset.link;
            window.open(link, '_blank');
        });
    });
}