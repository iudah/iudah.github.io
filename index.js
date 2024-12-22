
class IudahElement {
  #element
    = document.createElement("span");

  constructor(element) {
    this.#element = element;
  }
  render() { }
  get element() {
    return this.#element;
  }
}

class Calendar extends IudahElement {
  #calendar_container = document.createElement("span");
  #days;

  constructor(selector, no_of_days) {
    super(document.createElement("table"));

    this.#calendar_container = document.querySelector(selector);

    const days = ["M", "T", "W", "T", "F", "S", "S"];

    const table = this.element;
    table.className = "calendar";

    const table_head = document.createElement("thead");
    for (let index = 0; index < 7; index++) {
      table_head.appendChild(document.createElement("th"));
      table_head.children[index].innerHTML = days[index];
    }

    table.appendChild(table_head);

    this.#days = Array(no_of_days);
    let week = document.createElement("tr");

    for (let index = 0; index < no_of_days; index++) {
      if (index !== 0 && index % 7 == 0) {
        week.className = `week_${Math.floor(index / 7)}`;
        console.log(week.className);
        table.appendChild(week);
        week = document.createElement("tr");
      }

      this.#days[index] = new Day(index + 1);
      const day = this.#days[index].element;

      week.appendChild(day);
    }

    table.appendChild(week);

    this.#days[0].element.click();
  }
  render() {
    this.#calendar_container.appendChild(this.element);
  }
}

class Day extends IudahElement {
  #day;
  constructor(number) {
    super(document.createElement("td"));

    this.#day = number;
    let day = this.element;

    day.innerHTML = `${number}`;

    day.onclick = (e) => {
      console.log(this);
      console.log(e);

      if (window.active_day !== undefined) {
        window.active_day.classList.remove("active_day");
      }

      window.active_day = day;
      day.classList.add("active_day");

      let note = document.querySelector("#write_up");

      send_xhttp_request(
        encodeURI(`${location.pathname}\?article_day=${this.#day}`),
        (response) => {
          if (note)
            note.innerHTML = response;
        }
      );
    };
  }
}

let srcs_timestamps = {};

main();

function main() {


  const calendar = new Calendar(".calendar_container", 30);
  calendar.render();

}



function check_recency(src_path) {
  if (src_path !== null) {
    src_path = src_path.split(location.href)[1];
    send_xhttp_request(
      encodeURI(`check_recency\?path=${src_path}`),
      (response) => {
        const timestamp = Number.parseFloat(response);

        if (srcs_timestamps[src_path] === undefined || srcs_timestamps[src_path] === 0) {
          srcs_timestamps[src_path] = timestamp;
        } else {
          if (srcs_timestamps[src_path] < timestamp) {
            srcs_timestamps[src_path] = timestamp;
            console.log(srcs_timestamps[src_path], timestamp);
            console.log(`${src_path} has changed`);
            location.reload();
          }
        }
      }
    );
  }
}


function reload_page() {
    return;
  //check if any style sheet is newer
  for (const style_src of document.styleSheets) {
    check_recency(style_src.href);
  }

  //check recency of all scripts
  for (const script_src of document.scripts) {
    check_recency(script_src.src);
  }

  //check file recency
  check_recency(location.href);
  setTimeout(reload_page, 500);
}

function send_xhttp_request(path, callback) {


  const xhttp = new XMLHttpRequest();

  xhttp.onload = (e) => {
    callback(xhttp.responseText);
  };

  xhttp.open("GET", path, true);
  xhttp.send();
}

