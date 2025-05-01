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

const upcg_template     = document.getElementById("upcg_template");
const upcg_container    = document.getElementById("upcoming_gigs");
const gc_template       = document.getElementById("gig_card_0");
const gigs_container    = document.getElementById("gigs");

var allgigs;


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


function loadgigs(gigs) {
    for (let gig of gigs) {
        let gc_clone = upcg_template.cloneNode(true);
        gc_clone.classList.remove("upcg_hidden");
        gc_clone.classList.add("upcg");

        let datestring = gig.ddmmyy.toString();
        let dd = datestring.substring(0,2);
        let mm = datestring.substring(2,4);
        let yy = datestring.substring(4,6);

        let monthstring = months[parseInt(mm)-1].substring(0,3);

        gc_clone.innerHTML = gc_clone.innerHTML.replace("#date#", `${parseInt(dd)}ᵗʰ ${monthstring}`);
        gc_clone.innerHTML = gc_clone.innerHTML.replace("#city#", gig.city.toUpperCase());
        gc_clone.href += gig.code;
    
        upcg_container.appendChild(gc_clone);
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