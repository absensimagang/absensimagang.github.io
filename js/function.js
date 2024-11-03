function halamanAbsensi() {
  let dataDitampilkan = false;
  function Geolocation(srcForm) {
    if (navigator.geolocation && !dataDitampilkan) {
      navigator.geolocation.getCurrentPosition(showPosition, showError);
      const modal = document.getElementById("modal");
      const iframe = modal.querySelector("iframe");
      iframe.setAttribute("src", srcForm);
      modal.classList.replace("hidden", "flex");
      dataDitampilkan = true;
    } else {
      Swal.fire({
        icon: "error",
        title: "Pesan error",
        text: "fitur geolocation tidak tersedia, coba ganti browser anda lalu akses kembali website ini",
        confirmButtonText: "OK",
      }).then((result) => {
        if (result.isConfirmed) {
          location.href = "index.html";
        }
      });
    }
  }

  function showPosition(position) {
    var userLat = position.coords.latitude;
    var userLng = position.coords.longitude;
    var targetLat = -5.16528; // Ganti dengan latitude lokasi yang diinginkan
    var targetLng = 119.42061; // Ganti dengan longitude lokasi yang diinginkan
    var distance = calculateDistance(userLat, userLng, targetLat, targetLng);
    if (distance <= 20) {
      document.getElementById("modal").style.display = "none";
    } else {
      Swal.fire({
        icon: "warning",
        title: "Peringatan",
        text: "Anda berada di luar jangkauan lokasi yang diizinkan.",
        confirmButtonText: "OK",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "index.html";
        }
      });
    }
  }

  function calculateDistance(lat1, lon1, lat2, lon2) {
    var R = 6371e3; // Radius bumi dalam meter
    var φ1 = (lat1 * Math.PI) / 180;
    var φ2 = (lat2 * Math.PI) / 180;
    var Δφ = ((lat2 - lat1) * Math.PI) / 180;
    var Δλ = ((lon2 - lon1) * Math.PI) / 180;

    var a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    var d = R * c; // Jarak dalam meter
    return d;
  }
  function showError(error) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        dataDitampilkan = true;
        Swal.fire({
          icon: "error",
          title: "Izin Ditolak",
          text: "silahkan refresh ulang website dan setujui perizinan",
          confirmButtonText: "OK",
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.reload();
            localStorage.clear();
          }
        });
        break;
      case error.POSITION_UNAVAILABLE:
        dataDitampilkan = true;
        Swal.fire({
          icon: "error",
          title: "Lokasi tidak ditemukan",
          text: "Silahkan pergi ke titik yang telah ditentukan lalu coba website di refresh.",
          confirmButtonText: "OK",
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.reload();
            localStorage.clear();
          }
        });
        break;
      case error.TIMEOUT:
        dataDitampilkan = true;
        Swal.fire({
          icon: "error",
          title: "permintaan oleh user sudah habis",
          text: "Silahkan website di refresh",
          confirmButtonText: "OK",
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.reload();
            localStorage.clear();
          }
        });

        break;
      case error.UNKNOWN_ERROR:
        dataDitampilkan = true;
        Swal.fire({
          icon: "error",
          title: "Kesalahan tidak diketahui",
          text: "Hubungi administrator untuk segera ingin memakai layanan tersebut",
          confirmButtonText: "OK",
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = "index.html";
          }
        });

        break;
    }
  }

  function tampilkanJam() {
    const tanggal = new Date();
    let jam = tanggal.getHours();
    let menit = tanggal.getMinutes();
    let detik = tanggal.getSeconds();

    // Tambahkan nol di depan angka yang kurang dari 10
    jam = jam < 10 ? "0" + jam : jam;
    menit = menit < 10 ? "0" + menit : menit;
    detik = detik < 10 ? "0" + detik : detik;

    const waktu = jam + ":" + menit + ":" + detik;
    document.getElementById("jam").textContent = waktu;

    function liveStats() {
      const stats = document.getElementById("stats");
      const success = document.createTextNode("Aktif");
      const notsuccess = document.createTextNode("Tidak Aktif");
      const absensi = document.getElementById("absensi");
      if (waktu >= "07:30:00" && waktu <= "23:30:00") {
        if (!dataDitampilkan) {
          stats.setAttribute(
            "class",
            "bg-red-600 px-6 py-2 max-md:px-3 max-md:py-1 border-slate-300 rounded-xl font-bold text-slate-100 text-pretty"
          );
          stats.appendChild(success);
          // absensi.setAttribute("disabled", "false");
          absensi.setAttribute(
            "class",
            "border overflow-hidden text-white hover:bg-red-600 bg-red-800 text-red-50 border-red-500 px-5 py-3 max-sm:py-1 max-md:py-2 rounded-md transition-all duration-75"
          );
          absensi.addEventListener("click", () => {
            if (!localStorage.getItem("JamMasuk")) {
              Geolocation();
              localStorage.setItem("JamMasuk", new Date().toISOString());
              dataDitampilkan = true;
            } else {
              stats.setAttribute(
                "class",
                "bg-slate-600 px-6 py-2 max-md:px-3 max-md:py-1 border-slate-300 rounded-xl font-bold text-slate-100 text-pretty"
              );
              stats.appendChild(notsuccess);
              absensi.setAttribute("disabled", "true");
              absensi.setAttribute(
                "class",
                "text-slate-400 overflow-hidden bg-slate-300 text-red-800 px-5 py-3 max-md:py-2 rounded-md transition-all duration-75"
              );
            }
          });
          dataDitampilkan = true;
        }
      } else if (waktu >= "01:30:00" && waktu <= "6:30:00") {
        if (!dataDitampilkan) {
          stats.setAttribute(
            "class",
            "bg-red-600 px-6 py-2 max-md:px-3 max-md:py-1 border-slate-300 rounded-xl font-bold text-slate-100 text-pretty"
          );
          stats.appendChild(success);
          absensi.setAttribute(
            "class",
            "border overflow-hidden hover:bg-red-600 bg-red-800 text-red-50 border-red-500 px-5 py-3 max-md:py-2 max-sm:py-1 rounded-md transition-all duration-75"
          );
          absensi.addEventListener("click", () => {});
        }
      } else {
        if (!dataDitampilkan) {
          stats.setAttribute(
            "class",
            "bg-slate-600 px-6 py-2 max-md:px-3 max-md:py-1 border-slate-300 rounded-xl font-bold text-slate-100 text-pretty"
          );
          stats.appendChild(notsuccess);
          absensi.setAttribute("disabled", "true");
          absensi.setAttribute(
            "class",
            "text-slate-400 overflow-hidden bg-slate-300 text-red-800 px-5 py-3 max-md:py-2 rounded-md transition-all duration-75"
          );
          localStorage.clear();
          dataDitampilkan = true;
        }
      }
    }
    liveStats();
  }
  setInterval(tampilkanJam, 1000);
}
