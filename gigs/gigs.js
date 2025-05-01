const months = [
    "JANUARY",
    "FEBRUARY",
    "MARCH",
    "APRIL",
    "MAY",
    "JUNE",
    "JULY",
    "AUGUST",
    "SEPTEMBER",
    "OCTOBER",
    "NOVEMBER",
    "DECEMBER"
]

const githubCSV = 'https://raw.githubusercontent.com/Adam-GJ/adam-gj.github.io/refs/heads/main/gigs.csv';
const proxyURL = 'https://api.allorigins.win/get?url=' + encodeURIComponent(githubCSV);

var allgigs;

const gc_template       = document.getElementById("gig_tmp");
const gigs_container    = document.getElementById("main");
const gig_template  = document.getElementById("giglist_item_temp");
const gig_container = document.getElementById("giglist_container")

function csvToJson(csvString) {
    const lines = csvString.trim().split('\n');
    const headers = lines[0].split(',');

    const result = lines.slice(1).map(line => {
        const values = line.split(',');
        return headers.reduce((obj, header, index) => {
            obj[header.trim()] = values[index].trim();
            return obj;
        }, {});
    });
    return result;
}

function getallgigs() {

    function loadgigs(gigs) {
        console.log(gigs);
        for (let gig of gigs) {
            let gc_clone = gig_template.cloneNode(true);
            gc_clone.classList.remove("giglist_item_hidden");
            gc_clone.classList.add("giglist_item");

            let datestring = gig.ddmmyy.toString();
            let dd = datestring.substring(0,2);
            let mm = datestring.substring(2,4);
            let yy = datestring.substring(4,6);

            let monthstring = months[parseInt(mm)-1].substring(0,3);

            gc_clone.innerHTML = gc_clone.innerHTML.replace("#date#", `${parseInt(dd)}ᵗʰ ${monthstring}`);
            gc_clone.innerHTML = gc_clone.innerHTML.replace("#city#", gig.city.toUpperCase());
            gc_clone.innerHTML = gc_clone.innerHTML.replace("#icons#", "123123");
            // gc_clone.href += gig.code;
        
            gig_container.appendChild(gc_clone);
        }
    }


    fetch(proxyURL)
        .then(response => {
        if (!response.ok) throw new Error("Network response was not ok");
            return response.json();
        })
        .then(data => {
            allgigs  = csvToJson(data.contents);
            loadgigs(allgigs);
        });
}

const gigs = {
    "MAN110525": {
        dd: 11,
        mm: 5,
        mmm: "MAY",
        yy: 25,
        yyyy: 2025,
        time: "",
        city: "MANCHESTER",
        venue: "Mother Mary's Bar",
        maplink: "https://maps.app.goo.gl/3eV6nZNzozkA9NwRA",
        ticketlink: "",
        otd: true
    },
    "LIV180725": {
        dd: 18,
        mm: 7,
        mmm: "JULY",
        yy: 25,
        yyyy: 2025,
        time: "",
        city: "LIVERPOOL",
        venue: "Outpost",
        maplink: "https://maps.app.goo.gl/BbyJF9wP2zZwakaP7",
        ticketlink: "",
        otd: true
    }
}


const params = new URLSearchParams(window.location.search);
const code = params.get('code');


if (code) {
    function loadgig(allgigs) {
        let thisgig;
        for (let gig of allgigs) {
            if (gig.code === code) {
                thisgig = gig;
            }
        }
        // let thisgig = gigs[code];
        let gc_clone = gc_template.cloneNode(true);

        gc_clone.classList.remove("gig_tmp_big_hidden");
        gc_clone.classList.add("gig_tmp_big");

        gc_clone.getElementsByClassName("gt_location")[0].href = thisgig.maplink;
        gc_clone.innerHTML = gc_clone.innerHTML.replace("#city#", `${thisgig.city}`);
        gc_clone.innerHTML = gc_clone.innerHTML.replace("#venue#", `${thisgig.venue}`);
        // gc_clone.innerHTML = gc_clone.innerHTML.replace("#date#", `${thisgig.dd}th ${thisgig.mmm} ${thisgig.yyyy}`);

        let datestring = thisgig.ddmmyy.toString();
        let dd = datestring.substring(0,2);
        let mm = datestring.substring(2,4);
        let yy = datestring.substring(4,6);

        let monthstring = months[parseInt(mm)-1].substring(0,3);

        gc_clone.innerHTML = gc_clone.innerHTML.replace("#date#", `${parseInt(dd)}ᵗʰ ${monthstring}`);
       


        if (thisgig.time === "") {
            gc_clone.innerHTML = gc_clone.innerHTML.replace("#time#", "TBA");
        } else {
            gc_clone.innerHTML = gc_clone.innerHTML.replace("#time#", `${thisgig.time}`);
        }

        if (thisgig.otd) {
            gc_clone.innerHTML = gc_clone.innerHTML.replace("#AVAILABLE#", "AVAILABLE");
        } else {
            gc_clone.innerHTML = gc_clone.innerHTML.replace("#AVAILABLE#", "UNAVAILABLE");
        }

        gigs_container.appendChild(gc_clone);
    }


    fetch(proxyURL)
        .then(response => {
        if (!response.ok) throw new Error("Network response was not ok");
            return response.json();
        })
        .then(data => {
            allgigs  = csvToJson(data.contents);
            loadgig(allgigs);
        });
} else {
    getallgigs();
}