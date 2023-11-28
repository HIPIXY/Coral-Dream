// Daftar warna yang mungkin muncul
var candies = ["Blue", "Orange", "Green", "Yellow", "Red", "Purple", "Choco"];
// Papan permainan
var board = [];
var rows = 9;
var columns = 9;
var score = 0;
// Status permainan
var gameOver = false;
var skorMaks = 500;
var currTile;
var otherTile;

// Ketika halaman dimuat, mulai permainan dan atur interval pergerakan
window.onload = function() {
    startGame();

    // Setiap 1/10 detik
    window.setInterval(function(){
            crushCandy();
            slideCandy();
            generateCandy();
    }, 100);
}
// Fungsi untuk memilih warna secara acak
function randomCandy() {
    return candies[Math.floor(Math.random() * candies.length)]; //0 - 5.99
}
// Inisialisasi papan permainan
function startGame() {
    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("img");
            tile.id = r.toString() + "-" + c.toString();
            tile.src = "./images/" + randomCandy() + ".png";

            // FUNGSIONALITAS "DRAG"
            tile.addEventListener("dragstart", dragStart); // klik pada items, inisialisasi proses seret
            tile.addEventListener("dragover", dragOver);  // klik pada items, geser mouse untuk menyeret items
            tile.addEventListener("dragenter", dragEnter); // menyeret items ke items lain
            tile.addEventListener("dragleave", dragLeave); // keluar dari items ke items lain
            tile.addEventListener("drop", dragDrop); //meletakkan items di atas items lain
            tile.addEventListener("dragend", dragEnd); // setelah proses seret selesai, tukar items

            document.getElementById("board").append(tile);
            row.push(tile);
        }
        board.push(row);
    }

    console.log(board);
}
// Fungsi saat memulai proses seret
function dragStart() {
    if (gameOver) return;
    // `this` merujuk pada items yang diklik untuk diseret
    currTile = this;
}
// Fungsi saat mouse bergerak di atas items yang diseret
function dragOver(e) {
    if (gameOver) return;
    e.preventDefault();
}
// Fungsi saat item diseret ke atas item lain
function dragEnter(e) {
    if (gameOver) return;
    e.preventDefault();
}
// Fungsi saat keluar dari item yang dituju
function dragLeave() {

}
// Fungsi saat meletakkan item di atas item lain
function dragDrop() {
    // `this` merujuk pada item tujuan yang diletakkan di atasnya
    if (gameOver) return;
    otherTile = this;
}
// Fungsi saat proses seret selesai
function dragEnd() {
if (gameOver) return;
    // Jika salah satu item kosong, batalkan proses
    if (currTile.src.includes("blank") || otherTile.src.includes("blank")) {
        return;
    }
    // Ambil koordinat item yang diseret
    let currCoords = currTile.id.split("-"); // id="0-0" -> ["0", "0"]
    let r = parseInt(currCoords[0]);
    let c = parseInt(currCoords[1]);
    
    // Ambil koordinat item tujuan

    let otherCoords = otherTile.id.split("-");
    let r2 = parseInt(otherCoords[0]);
    let c2 = parseInt(otherCoords[1]);

    // Periksa apakah item bersebelahan
    let moveLeft = c2 == c-1 && r == r2;
    let moveRight = c2 == c+1 && r == r2;

    let moveUp = r2 == r-1 && c == c2;
    let moveDown = r2 == r+1 && c == c2;

    let isAdjacent = moveLeft || moveRight || moveUp || moveDown;
    // Jika item bersebelahan, tukar posisinya
    if (isAdjacent) {
        let currImg = currTile.src;
        let otherImg = otherTile.src;
        currTile.src = otherImg;
        otherTile.src = currImg;
        // Periksa apakah tukar item menghasilkan permainan yang valid
        let validMove = checkValid();
        if (!validMove) {
            let currImg = currTile.src;
            let otherImg = otherTile.src;
            currTile.src = otherImg;
            otherTile.src = currImg;    
        }
    }
    // Jika skor mencapai batas tertentu, tampilkan pesan kemenangan disini batasnya adalah 500
    if (score > skorMaks) {
        Swal.fire({
            title: "Yay, kamu menang!",
            text: "YUk, bermain lagi!",
            imageUrl: "yey.png",
            showConfirmButton: true,
            imageWidth: 400,
            imageHeight: 400,
            imageAlt: "Custom image"
          }).then((response) => {
            if(response.isConfirmed){
                score = 0;
            }
          });
    }
}
// Fungsi untuk menghancurkan item
function crushCandy() {
    if (gameOver) return;
    //crushFive();
    //crushFour();
    crushThree();
    document.getElementById("score").innerText = score;

}
// Fungsi untuk menghancurkan item ketika terdapat tiga item yang sama berdampingan
function crushThree() {
    // Periksa baris
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns-2; c++) {
            let candy1 = board[r][c];
            let candy2 = board[r][c+1];
            let candy3 = board[r][c+2];
            if (candy1.src == candy2.src && candy2.src == candy3.src && !candy1.src.includes("blank")) {
                candy1.src = "./images/blank.png";
                candy2.src = "./images/blank.png";
                candy3.src = "./images/blank.png";
                score += 30;
            }
        }
    }

    // Periksa kolom
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows-2; r++) {
            let candy1 = board[r][c];
            let candy2 = board[r+1][c];
            let candy3 = board[r+2][c];
            if (candy1.src == candy2.src && candy2.src == candy3.src && !candy1.src.includes("blank")) {
                candy1.src = "./images/blank.png";
                candy2.src = "./images/blank.png";
                candy3.src = "./images/blank.png";
                score += 30;
            }
        }
    }
}
// Fungsi untuk memeriksa apakah permainan masih valid
function checkValid() {
    // Periksa baris
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns-2; c++) {
            let candy1 = board[r][c];
            let candy2 = board[r][c+1];
            let candy3 = board[r][c+2];
            if (candy1.src == candy2.src && candy2.src == candy3.src && !candy1.src.includes("blank")) {
                return true;
            }
        }
    }

    // Periksa kolom
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows-2; r++) {
            let candy1 = board[r][c];
            let candy2 = board[r+1][c];
            let candy3 = board[r+2][c];
            if (candy1.src == candy2.src && candy2.src == candy3.src && !candy1.src.includes("blank")) {
                return true;
            }
        }
    }

    return false;
}

// Fungsi untuk menggeser item ke bawah setelah beberapa item dihancurkan
function slideCandy() {
    if (gameOver) return;
    for (let c = 0; c < columns; c++) {
        let ind = rows - 1;
        for (let r = columns-1; r >= 0; r--) {
            if (!board[r][c].src.includes("blank")) {
                board[ind][c].src = board[r][c].src;
                ind -= 1;
            }
        }

        for (let r = ind; r >= 0; r--) {
            board[r][c].src = "./images/blank.png";
        }
    }
}
// Fungsi untuk menghasilkan item baru di bagian atas papan permainan
function generateCandy() {
    if (gameOver) return;

    for (let c = 0; c < columns;  c++) {
        if (board[0][c].src.includes("blank")) {
            board[0][c].src = "./images/" + randomCandy() + ".png";
        }
    }
}