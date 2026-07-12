console.log("Script jalan");

function pindahHalaman(namaHalaman){

    console.log("Pindah ke:", namaHalaman);

    document.querySelectorAll(".page-view").forEach(function(page){
        page.classList.remove("active");
    });

    document.getElementById("page-" + namaHalaman).classList.add("active");

    document.querySelectorAll(".nav-link-page").forEach(function(link){
        link.classList.remove("active");
    });

    document.querySelector('[data-page="' + namaHalaman + '"]').classList.add("active");
}

document.querySelectorAll("[data-page]").forEach(function(link){

    link.addEventListener("click", function(e){

        e.preventDefault();

        pindahHalaman(this.dataset.page);

    });

});
