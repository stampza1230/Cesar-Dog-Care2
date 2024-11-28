document.addEventListener("DOMContentLoaded", () => {
  const dogEntries = document.getElementById("dog-entries");
  const addDogButton = document.getElementById("add-dog");
  const generateCalendarButton = document.getElementById("generate-calendar");
  const calendarContainer = document.getElementById("calendar-container");

  // โหลดข้อมูลจาก Local Storage
  function loadDogsFromStorage() {
    const savedData = JSON.parse(localStorage.getItem("dogEntries")) || [];
    savedData.forEach(data => createDogEntry(data));
  }

  // บันทึกข้อมูลลง Local Storage
  function saveDogsToStorage() {
    const entries = [];
    document.querySelectorAll(".dog-entry").forEach(entry => {
      entries.push({
        name: entry.querySelector("input[name='dog-name']").value.trim(),
        startDate: entry.querySelector("input[name='start-date']").value,
        endDate: entry.querySelector("input[name='end-date']").value,
        position: entry.querySelector("select[name='position']").value,
        additionalInfo: entry.querySelector("textarea[name='additional-info']").value.trim()
      });
    });
    localStorage.setItem("dogEntries", JSON.stringify(entries));
  }

  // สร้าง UI สำหรับรายการน้องหมา
  function createDogEntry(data = {}) {
    const dogEntry = document.createElement("div");
    dogEntry.className = "dog-entry";

    dogEntry.innerHTML = `
      <label>
        ชื่อน้องหมา: <input type="text" name="dog-name" value="${data.name || ""}" required>
      </label>
      <label>
        วันที่จอง: <input type="date" name="start-date" value="${data.startDate || ""}">
        ถึง <input type="date" name="end-date" value="${data.endDate || ""}">
      </label>
      <label>
        ตำแหน่งกรง:
        <select name="position">
          <option value="showroom" ${data.position === "showroom" ? "selected" : ""}>โชว์รูม</option>
          <option value="house" ${data.position === "house" ? "selected" : ""}>บ้าน</option>
          <option value="small-dog-room" ${data.position === "small-dog-room" ? "selected" : ""}>ห้องหมาเล็ก</option>
          <option value="stainless-room" ${data.position === "stainless-room" ? "selected" : ""}>ห้องสแตนเลส</option>
          <option value="front-table" ${data.position === "front-table" ? "selected" : ""}>หน้าโต๊ะคลุกข้าว</option>
        </select>
      </label>
      <label>
        ข้อมูลเพิ่มเติม: 
        <textarea name="additional-info" placeholder="ตัวอย่าง: ไม่มีสายจูงมา, ต้องกินยา, และอื่นๆ">${data.additionalInfo || ""}</textarea>
      </label>
      <button class="remove-dog">ลบ</button>
    `;

    dogEntry.querySelector(".remove-dog").addEventListener("click", () => {
      dogEntry.remove();
      saveDogsToStorage();
    });

    dogEntries.appendChild(dogEntry);
  }

  // ฟังก์ชันเพิ่มรายการน้องหมาใหม่
  function addDogEntry() {
    createDogEntry();
    saveDogsToStorage();
  }

  // ฟังก์ชันสร้างปฏิทิน
  function generateCalendar() {
    calendarContainer.innerHTML = "";

    const entries = document.querySelectorAll(".dog-entry");
    const calendarData = {};

    entries.forEach(entry => {
      const dogName = entry.querySelector("input[name='dog-name']").value.trim();
      const startDate = entry.querySelector("input[name='start-date']").value;
      const endDate = entry.querySelector("input[name='end-date']").value;
      const position = entry.querySelector("select[name='position']").value;

      if (dogName && position) {
        const start = new Date(startDate || new Date());
        const end = new Date(endDate || start);
        
        for (let date = start; date <= end; date.setDate(date.getDate() + 1)) {
          const dateString = date.toISOString().split("T")[0];

          if (!calendarData[position]) calendarData[position] = {};
          if (!calendarData[position][dateString]) calendarData[position][dateString] = [];

          calendarData[position][dateString].push(dogName);
        }
      }
    });

    for (const position in calendarData) {
      const table = document.createElement("table");
      const thead = document.createElement("thead");
      const tbody = document.createElement("tbody");

      table.innerHTML = `<caption>ตำแหน่ง: ${position}</caption>`;
      thead.innerHTML = `
        <tr>
          <th>วันที่</th>
          <th>ชื่อน้องหมา</th>
        </tr>
      `;

      for (const date in calendarData[position]) {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${date}</td>
          <td>${calendarData[position][date].join(", ")}</td>
        `;
        tbody.appendChild(tr);
      }

      table.appendChild(thead);
      table.appendChild(tbody);
      calendarContainer.appendChild(table);
    }
  }

  addDogButton.addEventListener("click", addDogEntry);
  generateCalendarButton.addEventListener("click", generateCalendar);
  loadDogsFromStorage();
});
