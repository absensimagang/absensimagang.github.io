function halamanAbsensi() {
  let dataDitampilkan = false;

  function Geolocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
      showErrorModal(
        "fitur geolocation tidak tersedia, coba ganti browser anda lalu akses kembali website ini"
      );
    }
  }

  
  function showPosition(position) {
    const userLat = position.coords.latitude;
    const userLng = position.coords.longitude;
    -5.165650, 119.420982
    targetLat = -5.165650;
    targetLng = 119.420982;
    const distance = calculateDistance(userLat, userLng, targetLat, targetLng);
    if (distance <= 20) {
      showModalWithIframe();
    } else {
      showErrorModal("Anda berada di luar jangkauan lokasi yang diizinkan.");
    }
  }

  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Radius bumi dalam meter
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) ** 2 +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  function showErrorModal(message) {
    dataDitampilkan = true;
    Swal.fire({
      icon: "error",
      title: "Pesan error",
      text: message,
      confirmButtonText: "OK",
    }).then((result) => {
      if (result.isConfirmed) {
        location.href = "index.html";
      }
    });
  }

  function showModalWithIframe() {
    const tanggal = new Date();
    let jam = String(tanggal.getHours()).padStart(2, "0");
    let menit = String(tanggal.getMinutes()).padStart(2, "0");
    let detik = String(tanggal.getSeconds()).padStart(2, "0");
    const waktu = `${jam}:${menit}:${detik}`;
    const modal = document.getElementById("modal");
    const iframe = modal.querySelector("#modal div iframe");
    let url;
    modal.classList.replace("hidden", "flex");
    if (waktu >= "07:30:00" && waktu <= "12:30:00") {
      url =
        "https://docs.google.com/forms/d/e/1FAIpQLScrACvwfKpoSLr7mTVz_P8DrAa1f4fobXBu93ROzThcUMlxLw/viewform";
      iframe.setAttribute("src", url);
    } else if (waktu >= "15:30:00" && waktu <= "16:30:00") {
      url =
        "https://docs.google.com/forms/d/e/1FAIpQLSdwS-BrNg8r2v5tGXbH6qqhlEaY_9AE-xeNcoGEhRP27QN2dQ/viewform";
      iframe.setAttribute("src", url);
    }
  }

  function showError(error) {
    const errorMessages = {
      [error.PERMISSION_DENIED]:
        "Izin Ditolak. Silahkan refresh ulang website dan setujui perizinan.",
      [error.POSITION_UNAVAILABLE]:
        "Lokasi tidak ditemukan. Silahkan pergi ke titik yang telah ditentukan lalu coba website di refresh.",
      [error.TIMEOUT]:
        "Permintaan oleh user sudah habis. Silahkan website di refresh.",
      [error.UNKNOWN_ERROR]:
        "Kesalahan tidak diketahui. Hubungi administrator untuk segera ingin memakai layanan tersebut.",
    };
    showErrorModal(errorMessages[error.code]);
  }

  function tampilkanJam() {
    const tanggal = new Date();
    let jam = String(tanggal.getHours()).padStart(2, "0");
    let menit = String(tanggal.getMinutes()).padStart(2, "0");
    let detik = String(tanggal.getSeconds()).padStart(2, "0");
    const waktu = `${jam}:${menit}:${detik}`;
    document.getElementById("jam").textContent = waktu;
    document.querySelector("#modal div").addEventListener("click", () => {
      modal.classList.replace("flex", "hidden");
    });

    updateStats(waktu);
  }

  function updateStats(waktu) {
    const stats = document.getElementById("stats");
    const absensi = document.getElementById("absensi");
    const isWorkingHours =
      (waktu >= "07:30:00" && waktu <= "12:30:00") ||
      (waktu >= "15:30:00" && waktu <= "16:30:00");
    if (isWorkingHours && !dataDitampilkan) {
      stats.className =
        "bg-red-600 px-6 py-2 max-md:px-3 max-md:py-1 border-slate-300 rounded-xl font-bold text-slate-100 text-pretty";
      stats.textContent = "Aktif";
      absensi.className =
        "border overflow-hidden text-white hover:bg-red-600 bg-red-800 text-red-50 border-red-500 px-5 py-3 max-sm:py-1 max-md:py-2 rounded-md transition-all duration-75";

      absensi.addEventListener("click", () => {
        Geolocation();
      });

      dataDitampilkan = true;
    } else if (!isWorkingHours) {
      stats.className =
        "bg-slate-600 px-6 py-2 max-md:px-3 max-md:py-1 border-slate-300 rounded-xl font-bold text-slate-100 text-pretty";
      stats.textContent = "Tidak Aktif";
      absensi.disabled = true;
      absensi.className =
        "text-slate-400 overflow-hidden bg-slate-300 text-red-800 px-5 py-3 max-md:py-2 rounded-md transition-all duration-75";
      localStorage.clear();
      dataDitampilkan = true;
    }
  }

  setInterval(tampilkanJam, 1000);
}
