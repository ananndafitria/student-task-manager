
// Mengambil elemen dari HTML
const namaTugas = document.getElementById("namaTugas");
const mataKuliah = document.getElementById("mataKuliah");
const deadline = document.getElementById("deadline");
const tambahBtn = document.getElementById("tambahBtn");
const listTugas = document.getElementById("listTugas");
const cariTugas = document.getElementById("cariTugas");

// Mengambil data tugas dari localStorage
let tugas = JSON.parse(localStorage.getItem("tugasKuliah")) || [];

// Menyimpan data tugas
function simpanTugas() {
    localStorage.setItem("tugasKuliah", JSON.stringify(tugas));
}

// Menampilkan daftar tugas
function tampilkanTugas() {
    listTugas.innerHTML = "";

    // Menghitung jumlah tugas
    const total = tugas.length;
    const selesai = tugas.filter(item => item.selesai).length;
    const belum = total - selesai;

    // Menampilkan jumlah tugas
    document.getElementById("jumlahTugas").textContent = total;
    document.getElementById("jumlahSelesai").textContent = selesai;
    document.getElementById("jumlahBelum").textContent = belum;

    // Fitur pencarian tugas
    const kataKunci = cariTugas.value.toLowerCase().trim();

    const hasilPencarian = tugas
        .map((item, index) => ({ item, index }))
        .filter(({ item }) =>
            item.nama.toLowerCase().includes(kataKunci) ||
            item.matkul.toLowerCase().includes(kataKunci)
        );

    // Jika tugas tidak ditemukan
    if (hasilPencarian.length === 0) {
        const pesan = document.createElement("p");
        pesan.textContent = kataKunci
            ? "Maaf, tugas tidak ditemukan. Coba kata kunci lain ya! 🌷"
            : "Belum ada tugas. Yuk, tambahkan tugas pertamamu! ♡";

        listTugas.appendChild(pesan);
        return;
    }

    // Menampilkan hasil pencarian
    hasilPencarian.forEach(({ item, index }) => {
        const div = document.createElement("div");
        div.className = item.selesai ? "tugas selesai" : "tugas";

        const judul = document.createElement("h3");
        judul.textContent = item.nama;

        const matkul = document.createElement("p");
        matkul.textContent = "Mata Kuliah: " + item.matkul;

        const tanggal = document.createElement("p");
        tanggal.textContent = "Deadline: " + (item.deadline || "-");

        const status = document.createElement("p");
        status.textContent = item.selesai
            ? "Status: Selesai"
            : "Status: Belum selesai";

        // Tombol tandai selesai
        const tombolStatus = document.createElement("button");
        tombolStatus.textContent = item.selesai
            ? "Batalkan Selesai"
            : "Tandai Selesai";
        tombolStatus.addEventListener("click", () => ubahStatus(index));

        // Tombol edit
        const tombolEdit = document.createElement("button");
        tombolEdit.textContent = "Edit";
        tombolEdit.className = "edit";
        tombolEdit.addEventListener("click", () => editTugas(index));

        // Tombol hapus
        const tombolHapus = document.createElement("button");
        tombolHapus.textContent = "Hapus";
        tombolHapus.className = "hapus";
        tombolHapus.addEventListener("click", () => hapusTugas(index));

        div.append(
            judul,
            matkul,
            tanggal,
            status,
            tombolStatus,
            tombolEdit,
            tombolHapus
        );

        listTugas.appendChild(div);
    });
}

// Menambahkan tugas baru
tambahBtn.addEventListener("click", function() {
    if (
        namaTugas.value.trim() === "" ||
        mataKuliah.value.trim() === ""
    ) {
        alert("Nama tugas dan mata kuliah harus diisi!");
        return;
    }

    const dataTugas = {
        nama: namaTugas.value.trim(),
        matkul: mataKuliah.value.trim(),
        deadline: deadline.value,
        selesai: false
    };

    tugas.push(dataTugas);
    simpanTugas();
    tampilkanTugas();

    namaTugas.value = "";
    mataKuliah.value = "";
    deadline.value = "";
});

// Mencari tugas secara langsung
cariTugas.addEventListener("input", tampilkanTugas);

// Mengubah status tugas
function ubahStatus(index) {
    tugas[index].selesai = !tugas[index].selesai;
    simpanTugas();
    tampilkanTugas();
}

// Mengedit tugas
function editTugas(index) {
    const namaBaru = prompt(
        "Masukkan nama tugas baru:",
        tugas[index].nama
    );

    if (namaBaru === null || namaBaru.trim() === "") return;

    const matkulBaru = prompt(
        "Masukkan mata kuliah baru:",
        tugas[index].matkul
    );

    if (matkulBaru === null || matkulBaru.trim() === "") return;

    const deadlineBaru = prompt(
        "Masukkan deadline baru (YYYY-MM-DD):",
        tugas[index].deadline
    );

    tugas[index].nama = namaBaru.trim();
    tugas[index].matkul = matkulBaru.trim();

    if (deadlineBaru !== null) {
        tugas[index].deadline = deadlineBaru.trim();
    }

    simpanTugas();
    tampilkanTugas();
}

// Menghapus tugas
function hapusTugas(index) {
    const konfirmasi = confirm(
        "Apakah kamu yakin ingin menghapus tugas ini?"
    );

    if (konfirmasi) {
        tugas.splice(index, 1);
        simpanTugas();
        tampilkanTugas();
    }
}

// Menampilkan tugas saat halaman dibuka
tampilkanTugas();
